# E-Commerce Store — Full-Stack HJX Application

A production-ready e-commerce storefront with API integration, database persistence,
shopping cart, checkout flow, and admin dashboard.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    E-Commerce Store                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Storefront   │  │  Cart &      │  │  Admin Dashboard │  │
│  │  (Product     │  │  Checkout    │  │  (Products,      │  │
│  │   Catalog)    │  │  Flow)       │  │   Orders, Stats) │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘  │
│         │                 │                    │            │
│  ┌──────┴─────────────────┴────────────────────┴─────────┐  │
│  │              HJX Server-Driven Runtime                 │  │
│  │         (WebSocket sync, state management)             │  │
│  └──────────────────────┬────────────────────────────────┘  │
│                         │                                   │
│  ┌──────────────────────┴────────────────────────────────┐  │
│  │                   API Layer                            │  │
│  │  GET /api/products    POST /api/cart                   │  │
│  │  GET /api/orders      POST /api/checkout               │  │
│  │  GET /api/admin/stats PUT /api/admin/products/:id      │  │
│  └──────────────────────┬────────────────────────────────┘  │
│                         │                                   │
│  ┌──────────────────────┴────────────────────────────────┐  │
│  │               Database (SQLite/PostgreSQL)             │  │
│  │  products | orders | order_items | users | cart        │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Components

| File | Purpose |
|------|---------|
| `app.hjx` | Root app with routing and layout |
| `storefront.hjx` | Product catalog grid with filters |
| `product-detail.hjx` | Single product view with add-to-cart |
| `cart.hjx` | Shopping cart with quantity controls |
| `checkout.hjx` | Multi-step checkout form |
| `admin-dashboard.hjx` | Admin panel with stats and product management |
| `admin-products.hjx` | Product CRUD interface |
| `admin-orders.hjx` | Order management and fulfillment |
| `components/ProductCard.hjx` | Reusable product card |
| `components/CartBadge.hjx` | Cart item count badge |
| `components/PriceTag.hjx` | Formatted price display |
| `components/StarRating.hjx` | Star rating display |
| `components/SearchBar.hjx` | Product search input |
| `components/FilterPanel.hjx` | Category and price filters |
| `components/OrderTimeline.hjx` | Order status timeline |
| `theme/tokens.hjx` | Design tokens for the store |

## API Contract

```bash
# Products
GET  /api/products?category=electronics&sort=price_asc&page=1
GET  /api/products/:id
POST /api/products  (admin)

# Cart
GET    /api/cart
POST   /api/cart/add       { productId, quantity }
PUT    /api/cart/update    { productId, quantity }
DELETE /api/cart/remove/:productId

# Orders
GET  /api/orders
POST /api/checkout        { cartId, paymentMethod, address }

# Admin
GET /api/admin/stats      { totalRevenue, ordersToday, topProducts }
PUT /api/admin/products/:id
```

## Run

```bash
hjx dev examples/projects/ecommerce/app.hjx --out dist-ecommerce --port 3000
```
