# PayMint

A full-stack invoice generator for freelancers.

## Features

- User authentication and authorization
- Client management
- Invoice creation, viewing, and management
- Service management
- Payment tracking
- PDF invoice generation and export
- Data visualization with charts
- Email notifications

## Tech Stack

- Frontend: React (Vite), Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB (Atlas)

## Setup

1. Clone the repository
   ```
   git clone <repository-url>
   cd paymint
   ```
2. Install dependencies
   ```
   npm install
   ```
3. Create a `.env` file in the root directory and add necessary variables such as:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```
4. To start the frontend development server:
  ```
  npm run dev
  ```
5. To start the backend server:
  ```
  npm run server
  ```
