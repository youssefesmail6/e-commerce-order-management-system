**🛒 E-Commerce Order Management System **

Welcome to the E-Commerce Order Management System! This backend API powers an online store where:

Admins manage products and orders.
Customers browse products, place orders, and track their status in real-time.

**🎯 Project Overview**

 ** Key Features:**

**✅ User Management:**

Customers can register & log in.
Admins can manage products and orders.

**✅ Product Inventory:**

Admins can add, update, and delete products.
Customers can browse & filter products by category, price range, and availability.

**✅ Order Management:**

Customers can place orders and track their order history.
Admins can update order statuses (e.g., pending → shipped → delivered).

**✅ Secure Payments:**

Integrated Stripe for handling payments.

**✅ Real-Time Updates:**

Customers get live order status updates via WebSockets.
Email notifications are sent when order statuses change (Powered by Nodemailer).

**✅ Performance & Security Enhancements:**

Redis Caching for improved performance.

Rate Limiting to prevent API abuse.

🔥 Tech Stack

**Technologies:	**

🖥 Backend  	Node.js (Express.js)

🗄 Database	  PostgreSQL

📦 Caching 	   Redis

💰 Payments  	Stripe

🔄 Real-time Updates   	WebSockets

🐳 Containerization   	Docker



**API Documentation(Postman)**:https://documenter.getpostman.com/view/31519255/2sAYdfqB1k



## Setup Instructions

### 1**clone repository **  
Clone the repository to your local machine:  
```sh
git clone https://github.com/youssefesmail6/e-commerce-order-management-system.git
cd e-commerce-order-management-system

### 2****Install Dependencies****
npm install
### 3 **Configure the Environment**

copy the .env example
### 4 **Start PostgreSQL & Redis**
using docker  docker-compose up --build
### 5 **Run migrations**
npm run migrate
### 6 **start the backend server** 
npm run dev




