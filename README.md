# Mock E-Commerce Cart - MERN Stack

A full-stack shopping cart application built with the MERN stack for Ecommerce.

## Features

- Product catalog display
- Add/remove items from cart
- Cart total calculation
- Mock checkout process
- Responsive design

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **API**: RESTful services

## Project Structure

```
Arnav/
├── backend/          # Node.js/Express API server
├── frontend/         # React.js application
└── README.md
```

## Setup Instructions

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## API Endpoints

- `GET /api/products` - Fetch all products
- `POST /api/cart` - Add item to cart
- `GET /api/cart` - Get cart items and total
- `DELETE /api/cart/:id` - Remove item from cart
- `POST /api/checkout` - Process checkout and generate receipt

## Features Implemented

- [x] Backend APIs with Express
- [x] Frontend with React
- [x] MongoDB integration
- [x] Responsive design
- [x] Error handling
- [x] Mock checkout process