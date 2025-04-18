# Final Report

---

## 1. Team Information

- **Astra Yu**  
  *Student Number:* 1011466423  
  *Email:* miing.yu@mail.utoronto.ca

- **Chuyue Zhang**  
  *Student Number:* 1005728303  
  *Email:* zhangchuyue.zhang@mail.utoronto.ca

- **Qiao Song**  
  *Student Number:* 1000920355
  *Email:* qiao.song@mail.utoronto.ca

- **Yushun Tang**  
  *Student Number:* 1011561962  
  *Email:* yushun.tang@mail.utoronto.ca



---

## 2. Motivation

### Problem Background

With the rapid growth of the anime community, a significant market gap has emerged for anime-specific merchandise. General e-commerce platforms like Amazon often fail to provide a tailored, streamlined experience for anime enthusiasts. Our project was inspired by this need for a dedicated platform that delivers both specialized product curation and an engaging, user-friendly experience.

### Business Significance

By focusing exclusively on anime goods, the website aims to create a dedicated and immersive shopping experience tailored specifically for anime fans. This specialized approach not only enhances user engagement but also helps build trust by demonstrating a deep understanding of the community’s interests and needs. Unlike general or niche e-commerce platforms that often offer fragmented and inconsistent anime merchandise, this website provides a professional, streamlined interface that consolidates products in one reliable location. As a result, users can enjoy a more efficient, satisfying, and trustworthy purchasing journey.


---

## 3. Objectives

The primary objectives of the project were as follows:

- **Responsive and Intuitive Interface:** Develop an easy-to-navigate front end that offers detailed product descriptions, visuals, and seamless shopping cart functionality.
- **Robust Backend Architecture:** Create a scalable backend using Express.js to handle user authentication, product management, order processing, and file handling efficiently.
- **Optimized Data Management:** Design and implement a normalized PostgreSQL database for efficient storage of users, products, orders, and order items.
- **Cloud Integration:** Incorporate cloud storage (e.g., AWS S3) for efficient image hosting and management.
- **Enhanced User Experience:** Provide features like simulated payment processing, real-time order tracking, and automated notifications to improve overall service quality.

---

## 4. Technical Stack

We opted for Express.js for our backend architecture and React (Tailwind CSS and Shadcn/UI)-based frontend UI developed with Tailwind CSS and Shadcn/UI) in a clear “frontend–backend” split. Node.js in combination with Express is used on the server side, and a comprehensive RESTful API is served on the `/api` namespace. All data access is handled by Prisma ORM (`@prisma/client`), and our schema is placed at `prisma/schema.prisma`. This schema includes four main entities, which are a User, Product, Order and OrderItem, along with two enums (OrderStatus and ProductStatus), their relations, indices, and timestamps set to auto fill. `npx prisma migrate dev` takes care of database migrations, while changes in schema will invoke generation of a type‑safe Prisma Client when `prisma generate` is executed.

PostgreSQL is our primary choice for the database due to its stability along with its powerful support towards transactions. For guaranteeing atomicity, we encapsulate multi‐step actions like stock deduction of a product and creating the corresponding order records within a `prisma.$transaction` calls. All database operations are captured within `src/database.js` where all queries, error handling and connection management are consolidated together. In order to validate and sanitize the incoming requests, we implemented a collection of Express middlewares that are placed in `src/middleware.js` which include request logging, input validation checking users, products, orders, and parsing of query-parameter based JSON schemas.

To support file handling, product images are stored in an AWS S3 bucket, with credentials and bucket name supplied via environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME`). In development, we use `dotenv` to load these variables along with `DATABASE_URL` for the PostgreSQL connection. Code quality is enforced through ESLint and Prettier, while Jest and Supertest provide unit and integration tests for our API endpoints. During local development, `nodemon` watches for file changes and restarts the server automatically. For continuous integration and deployment, GitHub Actions run our test suite and, on successful builds, deploy the backend to Heroku and the frontend to Vercel whenever changes are merged into `main`.



---

## 5. Features

Our application features a complete workflow for user management which includes account creation and secure logins. In the current version, when a new user registers through the application interface with `POST /api/user`, their email is having uniqueness verified at the database level. For now, passwords are stored without hashing, though our future work will include migrating to securely hashed passwords. In this version, login is performed by supplying a password which is then compared with the one stored, after which a user profile object which does not include sensitive data such as `password` is returned. Registered users can update or delete their profiles with `PUT /api/user/:id` and `DELETE /api/user/:id`, respectively. A custom middleware ensures all requests comply with correct data types and formats.

The product catalog supports all CRUD requirements, as defined in the course. Through `POST /api/product`, administrators are able to create new products by supplying name, brand, description, price, category, stock, status, and imageURL. Individual items are retrievable through `GET /api/product/:id`, while the entire catalog can be accessed via `GET /api/product`, allowing for searching in a case insensitive manner over the name, brand, and description. A custom middleware parses and validates the supplied pagination parameters (`skip`, `take`) with sorting by any indexed field, including but not limited to: price, stock, and creation date. Updating is done through `PUT /api/product/:id`, and deletion is done using `DELETE /api/product/:id`, which safeguards referential integrity by preventing removal of products that appear in existing orders (suggesting they be marked as DISCONTINUED instead).

Order processing is implemented as a five‑endpoint workflow. A new order is created with `POST /api/order`, where incoming items are validated for existence, availability (ACTIVE status), and sufficient stock. Stock quantities are decremented in the same transaction that writes the Order and corresponding OrderItem records. Users can fetch their own orders via `GET /api/order/user/:id`, complete with product snapshots (including name and imageURL). Administrators have a paginated, filterable overview of all orders at `GET /api/order`, with optional status filters and pagination metadata. Detailed order views are available at `GET /api/order/:id`, including user contact and full line‑item details, and order statuses can be updated through the lifecycle (PENDING → PROCESSING → SHIPPED → DELIVERED → CANCELLED) via the `PATCH /api/order/:id/status` endpoint.

---

## 6. User Guide

### Getting Started

1. **Landing Page:**  
   Users are welcomed by an intuitive homepage featuring the latest anime goods, promotional banners, and an easy-to-navigate menu.
2. **Browsing Products:**  
   - Use the search bar or filter options to find specific items.
   - Click on any product to view detailed information including high-quality images, descriptions, pricing, and availability.
3. **Shopping Cart & Checkout:**  
   - Add desired products to your cart with a single click.
   - Proceed to checkout for a simulated payment process.
   - Confirm your order and receive an instant email notification.


---

## 7. Development Guide

### Environment Setup & Configuration

1. **Prerequisites:**  
   - Node.js installed on your machine.
   - PostgreSQL database server up and running.
   - AWS account configured.

2. **Repository Setup:**  
   - Clone the repository:  
     ```bash
     git clone https://github.com/LittlePetunia/ece1724-anime-goods-e-commerce-backend.git
     cd anime-ecommerce
     ```
   - Install dependencies for both frontend and backend:
     ```bash
     npm install
     ```
     
3. **Development Environment:**

   - **Frontend:**  
     - Run the development server using:  
       ```bash
       npm run dev
       ```
     - The site will be available at [http://localhost:3000](http://localhost:3000).

   - **Backend:**  
     - Start the Express server with:  
       ```bash
       npm run start
       ```


  
---

## 8. Deployment Information

### Live Deployment

- **URL:**  
  The deployed application can be accessed at: [https://anime-ecommerce?????.com]


---

## 9. Individual Contributions

Each team member contributed significantly to the project's success, with responsibilities clearly aligned with their areas of expertise. The contributions are summarized below:

- **Astra Yu:**  
  - 

- **Chuyue Zhang:**  
  - 

- **Qiao Song:**  
  - 

- **Yushun Tang:**  
  - 



---

## 10. Lessons Learned and Concluding Remarks

### Lessons Learned

T### 10. Lessons Learned and Concluding Remarks

#### Lessons Learned

Throughout the project, our team acquired a range of valuable insights that will inform our future development practices. One of the key takeaways was the importance of modular development. By establishing clear and consistent interfaces between the frontend and backend, we were able to enhance the scalability of our application and simplify future maintenance.
We also benefited greatly from adopting agile collaboration. A well-structured weekly plan and a clear division of responsibilities allowed us to maintain steady progress and consistently meet our milestones. This approach fostered accountability and improved team efficiency.
In addition, working with cloud integration and security deepened our appreciation for the complexities of real-world application deployment. Incorporating cloud storage solutions and safeguarding user data pushed us to adopt industry best practices and consider system robustness from both a technical and ethical standpoint.
Finally, we learned that testing and debugging are indispensable parts of the development cycle. Implementing thorough unit and integration tests not only helped us catch errors early but also ensured a more stable and seamless user experience. These lessons collectively contributed to a more professional and resilient final product.

### Concluding Remarks

The project has successfully delivered a dedicated and professional anime goods e-commerce platform. Our final product not only meets the course requirements but also delivers a robust, scalable, and user-friendly solution that addresses a key market need. The hands-on experience with a full-stack development process—from planning and architecture design to testing and deployment—has significantly enhanced our technical and collaborative skills.

We would like to extend our gratitude to our instructors and TAs for their support and guidance throughout the project lifecycle.

---

