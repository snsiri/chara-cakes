## Chara Cakes — Full-Stack E-Commerce & Operations Platform

A production-style full-stack web application simulating a real-world artisan bakery business, combining customer e-commerce with internal operational systems.

## Live Overview

Chara Cakes is a comprehensive digital platform built for a made-to-order bakery. It integrates:

-Customer shopping experience.                                                                                                                                 
-Custom cake builder.
-Order lifecycle management.
-Inventory tracking.
-Role-based staff system.

### Designed to reflect real-world business workflows, not just a basic CRUD app.


## Key Features

### Customer Experience
Browse & search cakes by category, flavor, and occasion
View detailed product pages with reviews & ratings
Add to cart and place orders with delivery scheduling
Build fully customized cakes with dynamic pricing
Manage profile, orders, reviews, and addresses

### Custom Cake Builder
Multi-step configuration (size, shape, layers, flavors, decorations)
Dynamic options loaded from backend
Real-time price calculation
Stored as structured data for order processing

### Staff & Admin System
Secure staff login with role-based access control (RBAC)
Dashboard with business KPIs (orders, inventory)
Product management (add, edit, discontinue, restore)
Order processing workflow (pending → completed)
Ingredient stock tracking & updates
Staff role management with history tracking

### Verified Review System
Only customers with completed orders can leave reviews
Prevents duplicate or fake feedback
Admin moderation support

### System Architecture
Frontend (React)
   ↓ Axios (JWT)
Backend (Node.js + Express)
   ↓
MongoDB (Mongoose ODM)
RESTful API design
JWT-based authentication
Middleware-driven authorization
Modular, scalable architecture

### Tech Stack
Layer	Technology
Frontend	React 18, React Router, Bootstrap 5
Backend	Node.js, Express.js
Database	MongoDB Atlas (Mongoose)
Auth	JWT, bcrypt
File Uploads	Multer
HTTP Client	Axios

### Authentication & Security
JWT-based authentication for customers & staff
Role-based authorization middleware
Protected routes for sensitive operations
Token expiration & request interception

### Core Modules
Authentication System — Customer & staff login flows
Product Management — Full CRUD + soft delete system
Order Management — Lifecycle tracking with separation of active & completed orders
Customization Engine — Structured, dynamic product builder
Inventory System — Ingredient-level stock tracking
Feedback System — Verified purchase reviews

### Data Modeling Highlights
Custom ID generation system (e.g., ORD-0000000001)
Role history tracking for staff
Embedded + referenced document strategy in MongoDB
Separation of active vs completed orders for performance

## Getting Started

#3# Backend
npm install
npx nodemon server.js

### Frontend
cd client
npm install
npm run dev

## Environment Variables

MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
PORT=3000

## Screenshots

### Home Page
<img width="1060" height="43034" alt="localhost_5173_ (1)" src="https://github.com/user-attachments/assets/4f1686ce-20ec-40f4-8b4f-29457e55311a" />

### Cake Customizing Page
<img width="1060" height="2655" alt="localhost_5173_customizes" src="https://github.com/user-attachments/assets/89736f22-882d-4c04-98c7-320cc03247ac" />

### Cakes Page
<img width="1060" height="2376" alt="localhost_5173_cakes" src="https://github.com/user-attachments/assets/ef808f85-f5b7-4651-b054-b68a6067eead" />

### Customer Profile Page
<img width="1060" height="2263" alt="localhost_5173_customerProfile" src="https://github.com/user-attachments/assets/f8be9149-3e9c-4c97-8b70-2ee314811e75" />

### Cart Page
<img width="1060" height="2241" alt="localhost_5173_cart (1)" src="https://github.com/user-attachments/assets/790a0881-8278-4377-aa73-109850719a8b" />


This project demonstrates:

Full-stack application architecture
Real-world business logic implementation
Scalable backend design
Advanced state and data flow handling in React
Secure authentication & authorization patterns

## License

This project is developed for educational and portfolio purposes.

## Author

Nimsari Sirisooriya
BSc (Hons) in Information Technology



