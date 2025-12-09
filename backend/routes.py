from flask import Blueprint, request, jsonify, send_file
from models import db, Product, Supplier, Sale, Notification
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import func
from datetime import datetime, timedelta
import io
import csv
from fpdf import FPDF

bp = Blueprint("api", __name__, url_prefix="/api")

# ---------- SUPPLIERS CRUD ----------

@bp.route("/suppliers", methods=["GET"])
def list_suppliers():
    suppliers = Supplier.query.order_by(Supplier.name.asc()).all()
    return jsonify([
        {"id": s.id, "name": s.name, "contact": s.contact}
        for s in suppliers
    ])


@bp.route("/suppliers", methods=["POST"])
def add_supplier():
    data = request.json or {}
    name = data.get("name", "").strip()
    contact = data.get("contact", "").strip() if data.get("contact") else None

    if not name:
        return jsonify({"error": "Supplier name is required"}), 400

    s = Supplier(name=name, contact=contact)
    db.session.add(s)
    db.session.commit()
    return jsonify({"id": s.id, "name": s.name, "contact": s.contact}), 201


# ---------- PRODUCTS CRUD ----------

@bp.route("/products", methods=["GET"])
def list_products():
    prods = Product.query.order_by(Product.name.asc()).all()
    return jsonify([
        {
            "id": p.id,
            "name": p.name,
            "category": p.category,
            "price": p.price,
            "stock_quantity": p.stock_quantity,
            "reorder_level": p.reorder_level,
            "supplier_id": p.supplier_id,
            "created_at": p.created_at.isoformat() if p.created_at else None
        }
        for p in prods
    ])


@bp.route("/products", methods=["POST"])
def add_product():
    data = request.json or {}

    try:
        name = data["name"].strip()
    except KeyError:
        return jsonify({"error": "Product name is required"}), 400

    category = data.get("category")
    price = float(data.get("price", 0) or 0)
    stock_quantity = int(data.get("stock_quantity", 0) or 0)
    reorder_level = int(data.get("reorder_level", 5) or 5)
    supplier_id = data.get("supplier_id")

    p = Product(
        name=name,
        category=category,
        price=price,
        stock_quantity=stock_quantity,
        reorder_level=reorder_level,
        supplier_id=supplier_id,
    )
    db.session.add(p)
    db.session.commit()
    return jsonify({"id": p.id}), 201


@bp.route("/products/<int:id>", methods=["PUT"])
def update_product(id):
    p = Product.query.get_or_404(id)
    data = request.json or {}

    for k in ("name", "category", "price", "stock_quantity", "reorder_level", "supplier_id"):
        if k in data:
            setattr(p, k, data[k])

    db.session.commit()
    return jsonify({"id": p.id})


# ---------- POS: CREATE SALE, UPDATE STOCK, NOTIFICATIONS ----------

@bp.route("/sales", methods=["POST"])
def create_sale():
    """
    Expected JSON:
    {
        "items": [
            {"product_id": 1, "quantity": 2},
            {"product_id": 3, "quantity": 1}
        ]
    }
    """
    data = request.json or {}
    items = data.get("items", [])
    if not items:
        return jsonify({"error": "No items in sale"}), 400

    created_sales = []
    try:
        for it in items:
            pid = it.get("product_id")
            qty = int(it.get("quantity", 0) or 0)

            if not pid or qty <= 0:
                continue

            product = Product.query.get_or_404(pid)

            if product.stock_quantity < qty:
                return jsonify({"error": f"Not enough stock for {product.name}"}), 400

            product.stock_quantity -= qty
            total = qty * product.price

            sale = Sale(
                product_id=product.id,
                quantity_sold=qty,
                total_price=total
            )
            db.session.add(sale)
            created_sales.append({
                "product_id": product.id,
                "product_name": product.name,
                "qty": qty,
                "total": total
            })

            # low stock notification
            if product.stock_quantity <= product.reorder_level:
                msg = f"Low stock: {product.name} (qty: {product.stock_quantity})"
                notif = Notification(product_id=product.id, message=msg)
                db.session.add(notif)

        db.session.commit()
        return jsonify({"status": "ok", "sales": created_sales}), 201

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "db error", "detail": str(e)}), 500


# ---------- SALES LIST (FOR DASHBOARD / REPORTS) ----------

@bp.route("/sales", methods=["GET"])
def list_sales():
    """
    Returns last 100 sales joined with product name
    """
    rows = (
        db.session.query(Sale, Product.name)
        .join(Product, Sale.product_id == Product.id)
        .order_by(Sale.sale_date.desc())
        .limit(100)
        .all()
    )

    return jsonify([
        {
            "id": s.Sale.id,
            "product_name": s.name,
            "quantity_sold": s.Sale.quantity_sold,
            "total_price": float(s.Sale.total_price),
            "sale_date": s.Sale.sale_date.isoformat()
        }
        for s in rows
    ])


# ---------- NOTIFICATIONS ----------

@bp.route("/notifications", methods=["GET"])
def list_notifications():
    notifs = Notification.query.order_by(Notification.created_at.desc()).all()
    return jsonify([
        {
            "id": n.id,
            "product_id": n.product_id,
            "message": n.message,
            "seen": n.seen,
            "created_at": n.created_at.isoformat() if n.created_at else None
        }
        for n in notifs
    ])


@bp.route("/notifications/<int:id>/seen", methods=["POST"])
def mark_seen(id):
    n = Notification.query.get_or_404(id)
    n.seen = True
    db.session.commit()
    return jsonify({"id": n.id, "seen": n.seen})


# ---------- DASHBOARD SUMMARY (KPIs + CHART DATA) ----------

@bp.route("/dashboard-summary", methods=["GET"])
def dashboard_summary():
    product_count = Product.query.count()
    supplier_count = Supplier.query.count()

    low_stock_items = Product.query.filter(
        Product.stock_quantity <= Product.reorder_level
    ).all()
    low_stock_count = len(low_stock_items)

    stock_value = (
        db.session.query(
            func.coalesce(func.sum(Product.stock_quantity * Product.price), 0.0)
        ).scalar()
    )

    # low stock items
    low_stock_payload = [
        {
            "id": p.id,
            "name": p.name,
            "category": p.category,
            "qty": p.stock_quantity,
            "reorder_level": p.reorder_level,
        }
        for p in low_stock_items
    ]

    # recent sales (last 10)
    sales_rows = (
        db.session.query(Sale, Product.name)
        .join(Product, Sale.product_id == Product.id)
        .order_by(Sale.sale_date.desc())
        .limit(10)
        .all()
    )

    recent_sales = [
        {
            "product_name": r.name,
            "quantity_sold": r.Sale.quantity_sold,
            "total_price": float(r.Sale.total_price),
            "sale_date": r.Sale.sale_date.isoformat()
        }
        for r in sales_rows
    ]

    # stock by category (for chart)
    stock_by_category_raw = (
        db.session.query(
            Product.category,
            func.coalesce(func.sum(Product.stock_quantity), 0)
        )
        .group_by(Product.category)
        .all()
    )
    stock_by_category = [
        {"category": c or "Uncategorized", "stock": int(qty)}
        for c, qty in stock_by_category_raw
    ]

    # sales by product (for chart)
    sales_by_product_raw = (
        db.session.query(
            Product.name,
            func.coalesce(func.sum(Sale.total_price), 0)
        )
        .join(Product, Sale.product_id == Product.id)
        .group_by(Product.name)
        .order_by(func.sum(Sale.total_price).desc())
        .limit(7)
        .all()
    )
    sales_by_product = [
        {"name": name, "total": float(total)}
        for name, total in sales_by_product_raw
    ]

    return jsonify({
        "product_count": product_count,
        "supplier_count": supplier_count,
        "low_stock_count": low_stock_count,
        "stock_value": float(stock_value or 0.0),
        "low_stock_items": low_stock_payload,
        "recent_sales": recent_sales,
        "stock_by_category": stock_by_category,
        "sales_by_product": sales_by_product,
    })


# ---------- EXPORT SALES (CSV + PDF) ----------

@bp.route("/sales/export/csv", methods=["GET"])
def export_sales_csv():
    since = datetime.utcnow() - timedelta(days=30)
    rows = (
        db.session.query(Sale, Product.name)
        .join(Product, Sale.product_id == Product.id)
        .filter(Sale.sale_date >= since)
        .order_by(Sale.sale_date.desc())
        .all()
    )

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Date", "Product", "Quantity", "Total"])

    for r in rows:
        writer.writerow([
            r.Sale.sale_date.strftime("%Y-%m-%d %H:%M"),
            r.name,
            r.Sale.quantity_sold,
            float(r.Sale.total_price),
        ])

    mem = io.BytesIO()
    mem.write(output.getvalue().encode("utf-8"))
    mem.seek(0)

    return send_file(
        mem,
        as_attachment=True,
        download_name="sales_last_30_days.csv",
        mimetype="text/csv"
    )


@bp.route("/sales/export/pdf", methods=["GET"])
def export_sales_pdf():
    since = datetime.utcnow() - timedelta(days=30)
    rows = (
        db.session.query(Sale, Product.name)
        .join(Product, Sale.product_id == Product.id)
        .filter(Sale.sale_date >= since)
        .order_by(Sale.sale_date.desc())
        .all()
    )

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Helvetica", size=16)
    pdf.cell(0, 10, "Sales Report (Last 30 Days)", ln=True, align="C")
    pdf.ln(4)

    pdf.set_font("Helvetica", size=10)

    # table header
    pdf.cell(40, 8, "Date", border=1)
    pdf.cell(60, 8, "Product", border=1)
    pdf.cell(25, 8, "Qty", border=1, align="R")
    pdf.cell(35, 8, "Total", border=1, align="R")
    pdf.ln(8)

    for r in rows:
        pdf.cell(40, 8, r.Sale.sale_date.strftime("%Y-%m-%d"), border=1)
        pdf.cell(60, 8, r.name[:28], border=1)
        pdf.cell(25, 8, str(r.Sale.quantity_sold), border=1, align="R")
        pdf.cell(35, 8, f"${float(r.Sale.total_price):.2f}", border=1, align="R")
        pdf.ln(8)

    mem = io.BytesIO(pdf.output(dest="S"))
    mem.seek(0)

    return send_file(
        mem,
        as_attachment=True,
        download_name="sales_last_30_days.pdf",
        mimetype="application/pdf"
    )
