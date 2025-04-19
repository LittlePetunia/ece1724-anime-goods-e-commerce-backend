# ece1724-anime-goods-e-commerce-backend

This is the backend for the Anime Goods E-Commerce application. It provides a RESTful API for managing users.

---

## User API Endpoints

### POST `/api/user`  
Create a new user

**Input:**
```json
{
  "firstName": "Alice",
  "lastName": "Johnson",
  "email": "alice.johnson@example.com",
  "address": "123 Cherry Lane, Springfield",
  "isAdmin": false,
  "password": "12345"
}
```

**Output:**
```json
{
  "id": 1,
  "firstName": "Alice",
  "lastName": "Johnson",
  "email": "alice.johnson@example.com",
  "address": "123 Cherry Lane, Springfield",
  "isAdmin": false,
  "createdAt": "2025-04-18T21:47:16.868Z",
  "updatedAt": "2025-04-18T21:47:16.868Z"
}
```

```json
{
  "error": "Validation Error",
  "details": [
    "First name is required",
    "Last name is required",
    "Email format is invalid",
    "Address is required",
    "isAdmin must be a boolean value",
    "Password is required and must be at least 6 characters"
  ]
}
```

---

### GET `/api/user/allCustomers`  
Get all non-admin users

**Output:**
```json
[
  {
    "id": 1,
    "firstName": "Alice",
    "lastName": "Johnson",
    "email": "alice.johnson@example.com",
    "address": "123 Cherry Lane, Springfield",
    "isAdmin": false,
    "createdAt": "2025-04-18T21:47:16.868Z",
    "updatedAt": "2025-04-18T21:47:16.868Z"
  }
]
```

---

### GET `/api/user/:email`  
Find a user by email

**Output (if found):**
```json
{
  "id": 1,
  "firstName": "Alice",
  "lastName": "Johnson",
  "email": "alice.johnson@example.com",
  "address": "123 Cherry Lane, Springfield",
  "isAdmin": false,
  "createdAt": "2025-04-18T21:47:16.868Z",
  "updatedAt": "2025-04-18T21:47:16.868Z"
}
```

**Output (if not found):**
```json
{
  "error": "User not found"
}
```

---

### POST `/api/user/login`  
Authenticate user by email and password

**Input:**
```json
{
  "email": "alice.johnson@example.com",
  "password": "12345"
}
```

**Output:**
```json
{
  "id": 1,
  "firstName": "Alice",
  "lastName": "Johnson",
  "email": "alice.johnson@example.com",
  "address": "123 Cherry Lane, Springfield",
  "isAdmin": false,
  "createdAt": "2025-04-18T21:47:16.868Z",
  "updatedAt": "2025-04-18T21:47:16.868Z"
}
```

---

### PUT `/api/user/:id`  
Update user information

**Input:**
```json
{
  "firstName": "Alice",
  "lastName": "Wong",
  "email": "alice.wong@example.com",
  "address": "789 test Blvd",
  "isAdmin": false,
  "password": "12345"
}
```

**Output:**
```json
{
  "id": 1,
  "firstName": "Alice",
  "lastName": "Wong",
  "email": "alice.wong@example.com",
  "address": "789 test Blvd",
  "isAdmin": false,
  "createdAt": "2025-04-18T21:47:16.868Z",
  "updatedAt": "2025-04-18T21:59:14.435Z"
}
```
## User Input Requirement

---
| Field      | Required | Type    | Validation Rules                                                |
|------------|----------|---------|------------------------------------------------------------------|
| firstName  | Yes      | string  | Must be non-empty                                                |
| lastName   | Yes      | string  | Must be non-empty                                                |
| email      | Yes      | string  | Must be a valid email format                                     |
| address    | Yes      | string  | Must be non-empty                                                |
| isAdmin    | No       | boolean | If present, must be true or false                                |
| password   | Yes      | string  | Must be at least 6 characters long 

---

# Product API Endpoints

---

## POST `/api/product`
Create a new product.

**Input:**
```json
{
  "name": "Naruto Action Figure",
  "brand": "Bandai",
  "description": "A high-quality Naruto Uzumaki action figure with multiple accessories.",
  "price": 29.99,
  "category": "Figures",
  "imageURL": "https://example.com/images/naruto-figure.jpg",
  "stock": 100,
  "status": "ACTIVE"
}
```

**Response:**
Returns the created product with timestamps.

---

## GET `/api/product`
Get a list of products with optional search, filtering, sorting, and pagination.

**Query Parameters:**
- `search`: Search string (name, brand, description)
- `status`: Filter by status (`ACTIVE`, `INACTIVE`, `DISCONTINUED`)
- `sortBy`: Field to sort by (`name`, `price`, `stock`, `brand`, `id`, `createdAt`)
- `sortOrder`: `asc` or `desc`
- `skip`: Items to skip (for pagination)
- `take`: Items to return (page size, max 100)

**Request:**
```
GET /api/product?search=naruto&status=ACTIVE&sortBy=price&sortOrder=desc&skip=0&take=5
```

**Response:**
```json
{
  "products": [ { ... } ],
  "pagination": {
    "total": 1,
    "page": 1,
    "pageSize": 5,
    "totalPages": 1
  }
}
```

---

## GET `/api/product/:id`

**Example:**
```
GET /api/product/3
```

**Response:**
```json
{
  "id": 3,
  "name": "Naruto Figure",
  "brand": "Bandai",
  "description": "Limited edition Naruto Uzumaki figure",
  "price": 29.99,
  "stock": 100,
  "category": "Figures",
  "status": "ACTIVE",
  "imageURL": "https://example.com/images/naruto.jpg",
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Error:**
```json
{
  "error": "Product not found"
}
```

---

## PUT `/api/product/:id`
Update an existing product.

**Example:**
```
PUT /api/product/3
```

**Input:**
```json
{
  "name": "Naruto Figure - Updated",
  "brand": "Bandai",
  "description": "Updated description",
  "price": 39.99,
  "imageURL": "https://example.com/images/naruto-updated.jpg",
  "stock": 80,
  "status": "ACTIVE"
}
```

**Error:**
```json
{
  "error": "Product not found"
}
```

---
# Order API Documentation

## POST `/api/order`
Create a new order.

**Input:**
```json
{
  "userId": 1,
  "status": "PENDING",
  "items": [
    { "productId": 3, "quantity": 2 },
    { "productId": 5, "quantity": 1 }
  ]
}
```

**Response:** Returns the created order and its items.

---

## GET `/api/order/user/:userId`
Get all orders for a specific user.

**Example:**
```
GET /api/order/user/1
```

**Response:**
A list of orders

---

## GET `/api/order`
Get all orders (admin only), with optional filtering and pagination.

**Query Parameters:**
- `status`: `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`
- `skip`: number (default: 0)
- `take`: number (default: 10, max: 100)

**Example:**
```
GET /api/order?status=SHIPPED&skip=0&take=5
```

**Response:** Paginated list of orders with user info and order items.

---

## GET `/api/order/:id`
Get a specific order by ID.

**Example:**
```
GET /api/order/42
```

**Response:** Order

---

## PATCH `/api/order/:id/status`
Update the status of an order.

**Input:**
```json
{
  "status": "CANCELLED"
}
```

**Valid statuses:**
- `PENDING`
- `PROCESSING`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`

**Response:** Order

---

## Setup

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following:
   ```
   DATABASE_URL="your-postgresql-connection-string"
   ```
4. Run migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Start the server:
   ```bash
   npm run dev
   ```
