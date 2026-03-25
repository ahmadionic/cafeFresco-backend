# Cafe Fresco Backend

A complete Node.js + Express backend API for Cafe Fresco ecommerce operations.
This project handles user authentication, product/catalog management, cart/wishlist, orders, payments, discounts, reviews, admin operations, and dashboard reporting.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Main Features](#main-features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Getting Started (Beginner Guide)](#getting-started-beginner-guide)
6. [Environment Variables](#environment-variables)
7. [Run the Project](#run-the-project)
8. [API Route Map](#api-route-map)
9. [Authentication & Roles](#authentication--roles)
10. [Image Uploads](#image-uploads)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)
13. [Future Improvements](#future-improvements)
14. [Developed By](#developed-by)

---

## Project Overview

Cafe Fresco Backend is the server-side system for an ecommerce-style cafe platform.

It provides:

- User and Admin authentication
- Role-based access control (Admin / Manager / Editor)
- Product and category management
- Cart and wishlist
- Order and payment handling (Stripe + COD support)
- Discount code support
- Review system
- Inventory and business entities (employee, department, supplier, distributer)
- Dashboard analytics endpoints

---

## Main Features

### 1) User Features

- Register and login with JWT
- Forgot/reset password via email
- Profile update and profile image upload
- Product search and recommendations
- Manage cart and wishlist
- Place orders and view order history
- Apply discount codes
- Add product reviews

### 2) Admin Features

- Admin register/login
- Create, update, and delete permissions/roles
- Manage users and admin list
- Notification endpoints (mark seen, fetch)
- Dashboard analytics (earnings and reports)

### 3) Catalog & Inventory Features

- Category CRUD with image upload
- Product CRUD with image upload
- Inventory update support
- Department management
- Employee management
- Supplier and distributer management

### 4) Commerce & Security Features

- Stripe payment intent creation
- Payment record creation and tracking
- Order status updates by authorized admin roles
- Login rate limiting for protection
- VPN/proxy detection middleware (production)
- CORS allowlist + cookie handling

---

## Tech Stack

### Core

- Node.js
- Express.js
- MongoDB + Mongoose

### Security & Auth

- JSON Web Token (`jsonwebtoken`)
- Password hashing (`bcryptjs` / `bcrypt`)
- `express-rate-limit`
- `cookie-parser`
- `validator`

### Payments & Communication

- Stripe
- Nodemailer

### Utilities

- Multer (image uploads)
- Axios
- NodeCache
- Dotenv
- Moment.js

### Deployment

- Vercel (`vercel.json` uses `app.js` as server entry)

---

## Project Structure

```bash
cafeFresco-backend/
├── app.js
├── package.json
├── vercel.json
├── config/
│   ├── db.js
│   └── sendMail.js
├── middleware/
├── models/
├── public/images/
└── routes/
```

- `config/` -> database and mail configuration
- `middleware/` -> auth, limiter, upload, VPN detection
- `models/` -> MongoDB schemas
- `routes/` -> all API modules
- `public/images/` -> uploaded images for product/category/user

---

## Getting Started (Beginner Guide)

### Step 1: Install prerequisites

Make sure you have:

- Node.js (v18 or above recommended)
- npm
- MongoDB database (local or MongoDB Atlas)

### Step 2: Open project

```bash
cd cafeFresco-backend
```

### Step 3: Install dependencies

```bash
npm install
```

### Step 4: Create environment file

Create a `.env` file in the project root.

Use this template:

```env
PORT=8080
NODE_ENV=development
DB_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret
EMAIL=your_email_address
EMAIL_PASSWORD=your_email_app_password
EMAIL_USER_URL=http://localhost:3000
EMAIL_RESET_URL=http://localhost:3001
```

### Step 5: Start the backend server

```bash
node app.js
```

or during development:

```bash
npx nodemon app.js
```

### Step 6: Test server

Open in browser:

```text
http://localhost:8080
```

Expected response:

```text
Server is running
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | Yes | Port for Express server |
| `NODE_ENV` | Yes | `development` or `production` |
| `DB_URI` | Yes | MongoDB connection string |
| `SECRET_KEY` | Yes | JWT signing secret |
| `STRIPE_SECRET_KEY` | Yes (for payments) | Stripe private key |
| `EMAIL` | Yes (for mail) | Sender email |
| `EMAIL_PASSWORD` | Recommended | Email app password |
| `EMAIL_USER_URL` | Yes (for user reset link) | Frontend base URL for user reset |
| `EMAIL_RESET_URL` | Yes (for admin reset link) | Frontend base URL for admin reset |

---

## Run the Project

### Local

1. Configure `.env`
2. Run `npm install`
3. Run `node app.js` or `npx nodemon app.js`

### Production Notes

- Set `NODE_ENV=production`
- Configure CORS origins in `app.js`
- Add environment variables on your hosting platform

---

## API Route Map

Base route prefixes configured in `app.js`:

- `/user` -> user operations
- `/admin` -> admin operations
- `/category` -> category management
- `/product` -> product management
- `/review` -> product reviews
- `/cart` -> cart APIs
- `/wishlist` -> wishlist APIs
- `/stripe` -> payment APIs
- `/order` -> order APIs
- `/user-Interest` -> recommendation/search behavior
- `/api` -> dashboard/earning reports
- `/discount` -> discount code APIs
- `/employee` -> employee APIs
- `/department` -> department APIs
- `/supplier` -> supplier APIs
- `/distributer` -> distributer APIs

### Example Endpoints

- `POST /user/register`
- `POST /user/login`
- `POST /admin/login`
- `GET /product/all`
- `POST /cart/add`
- `POST /order/create`
- `POST /stripe/payment-intent`
- `POST /discount/apply`

---

## Authentication & Roles

- JWT tokens are used for user and admin sessions.
- Cookie support is enabled through `cookie-parser`.
- Role authorization middleware supports role checks like `admin`, `manager`, and `editor`.
- Protected routes use `isLogged` (user) and `isAdmin` + `authorizeRoles` (admin).

---

## Image Uploads

- Uploads are handled by Multer middleware.
- Storage folders:
  - `public/images/product`
  - `public/images/category`
  - `public/images/user`
- Allowed formats: `jpeg`, `jpg`, `png`, `gif`

---

## Deployment

This project includes `vercel.json` for deployment on Vercel:

- Build source: `app.js`
- Runtime: `@vercel/node`
- All routes rewrite to `app.js`

Before deployment:

1. Add all environment variables in Vercel settings
2. Update CORS allowed origins in `app.js`
3. Ensure MongoDB cluster allows your deployment IP/access

---

## Troubleshooting

- **MongoDB not connecting** -> Check `DB_URI`
- **JWT errors** -> Verify `SECRET_KEY`
- **CORS blocked** -> Add frontend domain to allowed origins
- **Email not sending** -> Verify email credentials and app password
- **Stripe issue** -> Check `STRIPE_SECRET_KEY` and payload amount type

---

## Future Improvements

- Add request validation library (Joi/Zod)
- Centralized error handler middleware
- Swagger/OpenAPI documentation
- Unit and integration test coverage
- Replace hardcoded secrets with strict env-based config

---

## Developed By

Developed by Muhammad Ismaeel.
