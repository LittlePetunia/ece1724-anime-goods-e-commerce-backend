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

We opted for Express.js for our backend architecture and React (Tailwind CSS and Shadcn/UI)-based frontend UI developed with Tailwind CSS and Shadcn/UI) in a clear “frontend–backend” split.

Our front-end implementation adopts React and TypeScript to build a single-page application, uses React Router to manage routes, and Tailwind CSS in combination with Shadcn/UI to achieve a consistent visual style and responsive layout. The application status is managed through two sets of Contexts: AuthContext is responsible for login, logout and role determination, and persists the token and user information to localStorage; CartContext is responsible for the addition, deletion, quantity and selection status of items in the shopping cart, and updates the total number of items in real time in the navigation bar. The entire page is wrapped by the Layout component, which includes the navigation bar (brand, category dropdown, search box, user menu, and shopping cart preview), the Outlet block, and the container and footer. All error states (401, 403, 404, 500) are uniformly rendered through the HttpError component, making ICONS, titles, descriptions, and operation buttons clear at a glance, ensuring a good user experience when permissions or resources are abnormal. The product list uses the ProductCard and ProductEntry components to present thumbnails, inventory badges and operation buttons; The shopping cart page displays ICONS for increasing or decreasing quantities, checking, and deleting through the CartListEntry component, and falls back to display placeholder ICONS when image loading fails. In the development process, Vite (or Create React App) is used to implement hot reloading. The code quality is guaranteed by ESLint/Prettier, and component Testing is accomplished by React Testing Library and Jest.

For the backend, we use Node.js with Express.js to provide RESTful APIs under the `/api` namespace. All database access is handled via Prisma ORM (`@prisma/client`). The schema is defined in `prisma/schema.prisma` and includes four main entities — User, Product, Order, and OrderItem — as well as two enums: OrderStatus and ProductStatus. The schema is configured with auto-incrementing primary keys, unique indexes, relationship mappings, and automatic timestamps. PostgreSQL is our primary choice for the database due to its stability along with its powerful support towards transactions. For guaranteeing atomicity, we encapsulate multi‐step actions like stock deduction of a product and creating the corresponding order records within a `prisma.$transaction` calls. All database operations are captured within `src/database.js` where all queries, error handling and connection management are consolidated together. In order to validate and sanitize the incoming requests, we implemented a collection of Express middlewares that are placed in `src/middleware.js` which include request logging, input validation checking users, products, orders, and parsing of query-parameter based JSON schemas. To support file handling, product images are stored in an AWS S3 bucket, with credentials and bucket name supplied via environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME`). In development, we use `dotenv` to load these variables along with `DATABASE_URL` for the PostgreSQL connection. Code quality is enforced through ESLint and Prettier, while Jest and Supertest provide unit and integration tests for our API endpoints. During local development, `nodemon` watches for file changes and restarts the server automatically. For continuous integration and deployment, GitHub Actions run our test suite and, on successful builds, deploy the backend to Heroku and the frontend to Vercel whenever changes are merged into `main`.



---

## 5. Features

Our application features a complete workflow for user management which includes account creation and secure logins. In the current version, when a new user registers through the application interface with `POST /api/user`, their email is having uniqueness verified at the database level. For now, passwords are stored without hashing, though our future work will include migrating to securely hashed passwords. In this version, login is performed by supplying a password which is then compared with the one stored, after which a user profile object which does not include sensitive data such as `password` is returned. Registered users can update or delete their profiles with `PUT /api/user/:id` and `DELETE /api/user/:id`, respectively. A custom middleware ensures all requests comply with correct data types and formats.

The product catalog supports all CRUD requirements, as defined in the course. Through `POST /api/product`, administrators are able to create new products by supplying name, brand, description, price, category, stock, status, and imageURL. Individual items are retrievable through `GET /api/product/:id`, while the entire catalog can be accessed via `GET /api/product`, allowing for searching in a case insensitive manner over the name, brand, and description. A custom middleware parses and validates the supplied pagination parameters (`skip`, `take`) with sorting by any indexed field, including but not limited to: price, stock, and creation date. Updating is done through `PUT /api/product/:id`, and deletion is done using `DELETE /api/product/:id`, which safeguards referential integrity by preventing removal of products that appear in existing orders (suggesting they be marked as DISCONTINUED instead).

Order processing is implemented as a five‑endpoint workflow. A new order is created with `POST /api/order`, where incoming items are validated for existence, availability (ACTIVE status), and sufficient stock. Stock quantities are decremented in the same transaction that writes the Order and corresponding OrderItem records. Users can fetch their own orders via `GET /api/order/user/:id`, complete with product snapshots (including name and imageURL). Administrators have a paginated, filterable overview of all orders at `GET /api/order`, with optional status filters and pagination metadata. Detailed order views are available at `GET /api/order/:id`, including user contact and full line‑item details, and order statuses can be updated through the lifecycle (PENDING → PROCESSING → SHIPPED → DELIVERED → CANCELLED) via the `PATCH /api/order/:id/status` endpoint.

Generally speaking from the perspective of the users, the site begins with a fully responsive homepage. Users can view the paginated displayed product cards on the home page. Each card contains a thumbnail of the product, a title, a truncated description, a price and stock badge (" In Stock "/" Out of Stock "), and provides three operations: "View Details", "Add to Cart", and "Buy Now". The category drop-down menu is dynamically pulled from the back end or the mock interface, and can be jumped to the corresponding category list with one click. The search box supports real-time input and enter filtering, and automatically updates URL parameters. The user avatar on the right side of the navigation bar shows the login/registration entry when not logged in. When logged in, the user’s avatar icon reveals a contextual menu: customers see links to their Dashboard and Orders pages, admins see links to manage orders, products and users, and both roles can log out. The shopping cart icon will display the real-time product quantity badge. When hovered over, the shopping cart preview will be expanded, listing the product image, title, unit price × quantity, and providing links for “Go to Cart” or “Checkout” buttons. 

The main cart page uses `CartListEntry` entries, each letting the user toggle selection via checkbox, adjust quantity with plus/minus buttons or direct input (bounded by stock), and remove items. When settling the bill, click Place Order”. The front end will verify the stock again and call the back-end interface. The inventory will be deducted in a transactional manner and an order will be generated. After a successful transaction, the order confirmation information will be returned and (in the development environment) an email will be simulated on the console. Users can view the list of historical and current orders through "My Orders", and click to enter the order details page to view the user information, product details, price, quantity and status of each order. When there is no permission access or the resource does not exist, ProtectedRoute will render the corresponding HttpError page to guide the user to log in, roll back or try again.

---

## 6. User Guide

When users visit the page for the first time, they need to register first. Specifically, the user navigates to the Sign Up page, enters their first name, last name, address, email and password, and clicks “Register.” Upon success they land on the Login page automatically. Then they can enter the same email and password logs them in and redirects to the “Products” listing by default. At the top, the navbar brand “AnimeGoods” always links back to `/products`, while the “Products” menu reveals all categories, letting users jump directly to category‑specific lists. The search bar accepts free‑text queries and updates the URL’s `?search=` parameter in real time automatically; pressing Enter runs the search if not already on the products page. The right side of the navbar houses the user icon (opening login/register or account menus) and the cart icon (showing the count of items and a preview panel). 

On the products page, cards are laid out in a responsive grid. Clicking “View Details” opens `/products/:id`, displaying a larger image, full description, current stock badge and the price formatted to two decimals. Users adjust the quantity with plus/minus buttons or by typing a number into a sanitized input field. Clicking “Add to Cart” updates the cart count in real time. To review selected items, the user clicks the cart icon and then “Go to Cart,” arriving at `/cart`. On the shopping cart page, each item is represented by a `CartListEntry` card showing a checkbox, image (or fallback icon), title, unit price, description snippet, and controls to change quantity or remove the item entirely. Users can select individual items or use a “Select All” control (in the header) to bulk‑remove or proceed to checkout. Pressing “Place Order” on the checkout page validates stock once more, submits the purchase to the backend, and upon success displays an order confirmation page. And during development, a console log simulating an email notification. Users can view details in "My Orders" section which linked from the user menu. It lists all past and current orders with status badges; clicking one shows detailed line items, quantities, unit prices and timestamps. If the user manually visits a protected admin page or their own user page without proper rights, the `HttpError` component gracefully displays 401/403/404/500 screens with clear messages and action buttons.


---

## 7. Development Guide

### Environment Setup & Configuration

- - 1. **Prerequisites:**  

       - Node.js installed on your machine.
       - PostgreSQL database server up and running.
       - AWS account with an S3 bucket configured (for product image hosting)  

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

    3. **Environment Configuration**

       Create a `.env` file in the project root with the following content:

       ```env
       # PostgreSQL database URL
       DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
       
       # AWS S3 configuration
       AWS_ACCESS_KEY_ID="your-access-key"
       AWS_SECRET_ACCESS_KEY="your-secret-key"
       S3_BUCKET_NAME="your-bucket-name"
       ```

       For frontend (if in a separate directory), create `.env` as:

       ```env
       VITE_API_BASE_URL="http://localhost:3000/api"
       ```

    4. **Database Initialization & Prisma Client Generation**

       ```bash
       npx prisma migrate dev --name init
       npx prisma generate
       # Optional: seed test data
       node prisma/seed.js
       ```

    5. **Running the Application Locally**

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

    6. **Testing**

       Run unit and integration tests using Jest and Supertest:

       ```bash
       npm run test
       ```

    7. **Build & Deployment**

       - **Build Frontend**

       ```bash
       npm run build   # Output to dist/ or build/
       ```

       - **Deploy Backend**
         - Configure environment variables as per `.env`
       - **Deploy Frontend**
         - Platforms: Vercel, Netlify
         - Build command: `npm run build`
         - Output directory: `dist/` or `build/`

    8. **CI/CD (Optional)**

       Set up GitHub Actions for automatic testing and deployment on every push:

       ```yaml
       # .github/workflows/ci.yml
       on: [push]
       jobs:
         build-and-test:
           runs-on: ubuntu-latest
           steps:
             - uses: actions/checkout@v3
             - uses: actions/setup-node@v3
               with:
                 node-version: '18'
             - run: npm ci
             - run: npm run test
       
         deploy:
           needs: build-and-test
           runs-on: ubuntu-latest
           steps:
             - name: Deploy to Vercel/Heroku/Netlify
               run: echo "Add your deployment steps here"
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


Throughout the project, our team acquired a range of valuable insights that will inform our future development practices. One of the key takeaways was the importance of modular development. By establishing clear and consistent interfaces between the frontend and backend, we were able to enhance the scalability of our application and simplify future maintenance.
We also benefited greatly from adopting agile collaboration. A well-structured weekly plan and a clear division of responsibilities allowed us to maintain steady progress and consistently meet our milestones. This approach fostered accountability and improved team efficiency.
In addition, working with cloud integration and security deepened our appreciation for the complexities of real-world application deployment. Incorporating cloud storage solutions and safeguarding user data pushed us to adopt industry best practices and consider system robustness from both a technical and ethical standpoint.
Finally, we learned that testing and debugging are indispensable parts of the development cycle. Implementing thorough unit and integration tests not only helped us catch errors early but also ensured a more stable and seamless user experience. These lessons collectively contributed to a more professional and resilient final product.

### Concluding Remarks

The project has successfully delivered a dedicated and professional anime goods e-commerce platform. Our final product not only meets the course requirements but also delivers a robust, scalable, and user-friendly solution that addresses a key market need. The hands-on experience with a full-stack development process—from planning and architecture design to testing and deployment—has significantly enhanced our technical and collaborative skills.

We would like to extend our gratitude to our instructors and TAs for their support and guidance throughout the project lifecycle.

---

