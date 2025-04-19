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

### Frontend

- **Framework & Libraries:** React, Next.js (or as chosen, using Next.js Full-Stack approach), Tailwind CSS, Shadcn/UI.
- **Features:** Responsive design, dynamic shopping cart, product search/filter interface, and detailed product views.

### Backend

- **Framework & Libraries:** Node.js with Express.js.
- **Key Services:** RESTful API for CRUD operations, user authentication (with role-based access control), error handling, and logging.

### Database

- **Database System:** PostgreSQL
- **Schema:**  
  - **Users Table:** Contains user data, with email-based indexing and a boolean for admin privileges.
  - **Products Table:** Stores product details including description, pricing, availability, and status.
  - **Orders and Order Items Tables:** Supports one-to-many and many-to-many relationships between users, products, and orders.

### Cloud & Other Integrations

- **Cloud Storage:** AWS S3 (or an equivalent cloud service) to handle product images and static assets.
- **Additional Services:** Integration for email notifications, simulated payment processing mechanisms, and third-party API support where applicable.

---

## 5. Features

### 5.1 Customer-Facing Features

- **Product Catalog:**  
  An extensive catalog with search, filter, and detailed product view options.  
- **User Dashboard:**  
  Enables customers to view, track, and update their order statuses.
- **Shopping Cart & Checkout:**  
  A dynamic cart interface with a simulated checkout process for seamless order placement.
- **User Account Management:**  
  Secure authentication, profile management, and order history tracking.

### 5.2 Administrative Features

- **Admin Dashboard:**  
  A comprehensive interface for managing products, orders, and users.
- **Inventory Management:**  
  Tools to update product details, stock, and pricing.
- **Reporting & Notifications:**  
  Automated systems for order confirmation and status updates via email notifications.

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

