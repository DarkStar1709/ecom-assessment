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

## Screenshots
<img width="1919" height="874" alt="Screenshot 2025-11-06 203546" src="https://github.com/user-attachments/assets/26bddd3c-df7c-43c2-b430-da87e76d4659" />
<img width="1919" height="879" alt="Screenshot 2025-11-06 203526" src="https://github.com/user-attachments/assets/d9bc7b63-4d84-4671-8e9e-8d506c684ac3" />
<img width="1900" height="879" alt="Screenshot 2025-11-06 203512" src="https://github.com/user-attachments/assets/bc32c3d3-c3e3-4083-a2c7-1efcba826478" />
<img width="1919" height="878" alt="Screenshot 2025-11-06 203411" src="https://github.com/user-attachments/assets/1ca8b9fe-83b6-4d20-bc26-115c3f5ba5df" />
