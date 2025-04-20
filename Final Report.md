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

With the ongoing global rise of animation culture and the steadily increasing compound annual growth rate of the derivative merchandise market, traditional e-commerce platforms have revealed notable limitations in addressing the demands of core ACG (Anime, Comic, and Game) users.  A vast number of products are classified and mixed, and the search efficiency is low, which makes it impossible for users to accurately locate the genuine figurines or limited edition peripheral products they need even after frequently turning pages. Meanwhile, local Japanese e-commerce platforms have serious language and payment barriers. Many do not support international credit cards or mainstream third-party payment systems. The cross-border purchasing process is often complex, accompanied by high intermediary fees and import tariffs, further increasing the financial burden on consumers. Moreover, in the second-hand trading space, it is difficult to distinguish the authenticity  of product. The frequent occurrence of counterfeit and substandard goods forces consumers into a dilemma between safeguarding their rights and bearing the cost of diminished trust.

Furthermore, conventional e-commerce platforms lack dedicated communities and interaction mechanisms, making it difficult to foster user engagement or cultivate fan loyalty. As a result, they fail to generate effective brand word-of-mouth promotion or secondary dissemination within fan communities.

In response to these pain points—namely *inefficient search, limited purchasing access, authenticity concerns, and insufficient community interaction*—we propose a dedicated e-commerce platform specializing in anime-related merchandise. Through refined product classification and special topic planning, users can directly access the complete product line of their favorite series or characters with just one click, completely saying goodbye to the trouble of getting lost in a vast list.

### Business Significance

By focusing exclusively on anime-related merchandise, the website aims to create a dedicated and immersive shopping experience tailored specifically for anime fans. Our platform achieves optimized performance in content curation, user interface interaction, and community engagement. Through specialized product categorization and thematic planning, users can access the full product line of their preferred series or characters without repeated navigation or unnecessary redirects. Compared to other vertical e-commerce platforms that tend to be either overly generalized or lack economies of scale, this specialized approach emphasizes depth and domain expertise. It not only enhances user engagement but also helps build trust by demonstrating a deep understanding of the community’s interests and needs. Unlike general or niche e-commerce platforms that often offer fragmented and inconsistent anime merchandise, this website provides a professional, streamlined interface that consolidates products in one reliable location. As a result, users can enjoy a more efficient, satisfying, and trustworthy purchasing journey. Users are not only able to locate their desired products with ease, but also benefit from more transparent logistics information and a richer array of community-based interactions. This combination contributes to a consumer experience that is more enjoyable, trustworthy, and tailored to the expectations of the target demographic.


---

## 3. Objectives

The primary goals of this project were defined to guide our implementation and measure its success:

- **Deliver a Responsive and Intuitive Interface**
   We set out to create a frontend that works seamlessly on any device, guiding users from browsing to checkout without friction. By building a single‑page React application in TypeScript, leveraging React Router for fluid navigation and Tailwind‑styled Shadcn/UI components, we ensure consistent and mobile first layouts. We aimed to present detailed product information, including images, descriptions, prices and stock badges with graceful fallback via `onError` through reusable components, such as `ProductCard`, `ProductEntry`, `CartListEntry`. This objective ensured that users could find, view and purchase items with minimal clicks, and enjoy real‑time updates via our global `Navbar` and `CartContext`.

- **Establish a Robust and Modular Backend Architecture**

  Our aim was to construct an Express.js server architecture that could scale and evolve to handle user authentication, product management, order processing, and file handling efficiently. We divided routes into clear modules users, including (`src/routes/users.js`), products (`src/routes/product.js`) and orders (`src/routes/order.js`), enforced input validation through custom middleware (`validateUserInput`, `validateProductInput`, `validateOrderInput`) before invoking Prisma, and centralized all database operations in `src/database.js`, wraping all Prisma calls such as`createUser`, `getAllProducts`, `createOrder`, and so on, to encapsulate error handling and maintain single responsibility. This separation of concerns—combined with request logging and a global error handler, ensured maintainability, predictable performance and a solid foundation for future feature growth.

- **Optimize Data Integrity and Performance**

  To guarantee reliable storage, fast queries, referential integrity and clear order lifecycle, we designed a normalized PostgreSQL schema defined in `prisma/schema.prisma` modeling `User`, `Product`, `Order` and `OrderItem` entities with appropriate relations and enums (`OrderStatus`, `ProductStatus`). We indexed critical fields, such as email on `User`, status on `Order`/`Product`, and managed all migrations and client generation with ``npx prisma migrate dev` and `prisma generate`. By leveraging `prisma.$transaction` for atomic multi‑step operations such as stock deduction and order creation, we prevent partial writes and preserve referential integrity under high concurrency while normalized tables support flexible one‑to‑many and many‑to‑many relationships without redundant data.

- **Leverage Cloud Storage for Scalability**

  Recognizing that images represent the bulk of static assets, we integrated AWS S3 to offload hosting and accelerate delivery. Product images are uploaded to S3 (configured via `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME`), and served via their URLs in the `imageURL` field. This approach allows our Express API to remain focused on business logic, improves load times, and ensures the system can scale without burdening the backend.

- **Provide an End‑to‑End, Production‑Ready Experience**

  To enhance users' experience, we provide features like simulated payment processing, real-time order tracking, and automated notifications to improve overall service quality. Beyond simple CRUD, our implementation simulates a full checkout workflow: the frontend invokes `POST /api/order`, the backend validates stock, decrements inventory and writes `Order` and `OrderItem` records within a transaction, and returns confirmations. Users can immediately track their orders in real time via (`GET /api/order/user/:id`), view detailed order pages via (`GET /api/order/:id`), and admins can filter, paginate and update statuses via (`PATCH /api/order/:id/status`). Although payment and email notifications are stubbed during development, our clean API design and pluggable architecture ensure that integrating real gateways or notification services will be straightforward, laying the groundwork for a fully production‑grade platform.





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

1. **Prerequisites:**  

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

Our production deployment is split.

The frontend of the project is deployed in Vercel. The build command is` npm run build `, and the output directory is` dist `(or` build `). The backend is deployed in Heroku and the package is built using Node.js. GitHub Actions automatically pipelines install dependencies, run linter checks and tests, then deploy the backend to Heroku via the Node.js buildpack and the frontend to Vercel using its Next.js integration when the 'main' branch is pushed. 

Environment variables for production (`DATABASE_URL`, AWS credentials, S3 bucket name) are managed securely in each platform’s settings panel. The live application is accessible at 

# [https://anime-ecommerce?????.com] 要改

where performance is monitored through Heroku Metrics and automatic vulnerability scans run on each new deployment.


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


Throughout the project, our team acquired a range of valuable insights that will inform our future development practices. One of the key takeaways was the importance of modular development. By establishing clear and consistent interfaces between the frontend and backend, defining separate Express routers for users, products and orders in `src/routes/`, centralizing all Prisma calls in `src/database.js`, and encapsulating shared logic in middleware, we were able to enhance the scalability of our application and simplify future maintenance.
We also benefited greatly from adopting agile collaboration. A well-structured weekly plan and a clear division of responsibilities with tasks tracked in our project board and daily stand‑up check‑ins, gave us clear short‑term goals and allowed us to maintain steady progress and consistently meet our milestones. This approach fostered accountability and improved team efficiency.
In addition, working with cloud integration and security deepened our appreciation for the complexities of real-world application deployment. Incorporating cloud storage solutions and safeguarding user data pushed us to adopt industry best practices and consider system robustness from both a technical and ethical standpoint.
Finally, we learned that testing and debugging are indispensable parts of the development cycle. Implementing thorough unit and integration tests with Jest and Supertest not only helped us catch errors early, such as missing query parameter validations or transaction rollbacks, but also ensured a more stable and seamless user experience. These lessons collectively contributed to a more professional and resilient final product.

These lessons collectively contributed to a more professional and resilient final product, equipping us with patterns, tools and processes that we will carry forward into future full‑stack projects.

### 

### Concluding Remarks

The project has successfully delivered a dedicated and professional anime goods e-commerce platform. Our final product not only meets the course requirements but also delivers a robust, scalable, and user-friendly solution that addresses a key market need. The hands-on experience with a full-stack development process—from planning and architecture design to testing and deployment—has significantly enhanced our technical and collaborative skills.

We would like to extend our gratitude to our instructors and TAs for their support and guidance throughout the project lifecycle. For some members of our team, this was the very first time in our lives that we had fully engaged with web development. At the beginning, we had no concept of HTTP requests, API design, or database structures, but now we can collaborate efficiently and build integrated frontend-backend systems. This four-month learning journey greatly broadened our engineering perspective and laid a solid foundation for our technical skill set. Especially starting from scratch, the course’s structured phases—including design documentation, project proposal, midterm presentation, and final submission—gradually immersed us in real-world development scenarios, helping us grow rapidly through constant trial and error.

We also noticed that this was the professor’s first time teaching this course. Throughout the semester, the professor made tremendous efforts to continuously refine the course content. We are deeply grateful for how the professor promptly responded to student feedback during the project phase, adjusted the grading criteria, standardized the documentation guidelines, and communicated clearly through GitHub discussions and course announcements. This open, inclusive, and constructive attitude truly made us feel that this is a course designed to grow together with the students.

During the learning process, the professor’s patience and thorough explanations during office hours also gave us significant support. During the project, when our team encountered disagreements and uncertainty in making decisions, the professor's detailed and thoughtful responses helped us move forward efficiently. This timely and professional feedback greatly boosted our confidence in problem-solving and inspired us to dive deeper into the technical principles behind each issue.

In addition, the documentation and presentation components of the course project helped us improve soft skills beyond just writing code. The process of writing the project proposal trained us to translate technical ideas into clear and actionable plans. The midterm presentation taught us how to communicate system architecture and design concepts effectively within a limited time frame. These skills will be extremely valuable whether we are working on large-scale development projects, applying for internships, or entering the workforce.

Looking back on the entire course, it didn’t just teach us how to “write code”—it taught us how to develop a real, usable system. It was not simply a stack of textbook knowledge, but a complete engineering process covering requirement analysis, technology selection, version control, team collaboration, system deployment, and user testing. We realized that whether a feature is implemented well goes far beyond whether the code runs correctly. It is also a comprehensive reflection of whether the architecture is well-designed, whether the APIs are clearly defined, whether the user experience is friendly, whether errors are recoverable, and whether the performance is scalable. This improvement in “engineering literacy” is the most valuable takeaway we gained from this course.

During the final stage of the course, when we saw the shopping cart updating quantities in real-time, or the interface displaying different menus based on user permissions… the sense of accomplishment at that moment was beyond words. Behind these features were countless failed debugging attempts. They were the result of our late-night remote collaborations. And they reflected the continuous refinement of our code logic and system design.

We believe that this course experience will serve as a critical starting point on our path toward a career in software engineering. It not only taught us “how to build a project,” but also “how to become better developers.” Whether in industry, building large-scale systems, or in academia, pursuing deeper technical research, the hands-on experience and problem-solving mindset this course gave us will benefit us for a long time to come.

Lastly, we would like to once again thank the professor and TAs for their thoughtful guidance and wholehearted dedication throughout this semester. Thank you for building a platform that was both challenging and full of possibilities. And thank you for consistently supporting, encouraging, and believing in every one of us. We hope to collaborate again in future courses, projects, or research, and continue growing together.



---

