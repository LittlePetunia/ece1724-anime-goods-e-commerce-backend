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
