from app import create_app
from models import db, Supplier, Product, Sale
from datetime import datetime, timedelta
import random

app = create_app()

with app.app_context():
    # wipe + recreate tables (dev only)
    db.drop_all()
    db.create_all()

    # suppliers
    supplier_names = [
        ("Fresh Drinks Co.", "freshdrinks@example.com"),
        ("Snack World", "snacks@example.com"),
        ("Daily Essentials", "daily@example.com"),
    ]
    suppliers = []
    for name, contact in supplier_names:
        s = Supplier(name=name, contact=contact)
        db.session.add(s)
        suppliers.append(s)

    db.session.commit()

    products_data = [
        ("Coke", "Drinks", 20, 50, 10, suppliers[0]),
        ("Sprite", "Drinks", 20, 40, 10, suppliers[0]),
        ("Iced Tea", "Drinks", 25, 30, 8, suppliers[0]),
        ("Potato Chips", "Snacks", 25, 80, 20, suppliers[1]),
        ("Chocolate Bar", "Snacks", 30, 60, 15, suppliers[1]),
        ("Instant Noodles", "Food", 15, 120, 30, suppliers[2]),
        ("Toothpaste", "Essentials", 40, 35, 10, suppliers[2]),
    ]

    products = []
    for name, category, price, stock, reorder, sup in products_data:
        p = Product(
            name=name,
            category=category,
            price=price,
            stock_quantity=stock,
            reorder_level=reorder,
            supplier_id=sup.id,
        )
        db.session.add(p)
        products.append(p)

    db.session.commit()

    # random past sales for dashboard
    for _ in range(40):
        p = random.choice(products)
        qty = random.randint(1, 5)
        total = qty * p.price
        days_ago = random.randint(0, 7)

        sale = Sale(
            product_id=p.id,
            quantity_sold=qty,
            total_price=total,
            sale_date=datetime.utcnow() - timedelta(days=days_ago),
        )
        db.session.add(sale)

        p.stock_quantity = max(0, p.stock_quantity - qty)

    db.session.commit()
    print("Seeded suppliers, products, and sales ✔")
