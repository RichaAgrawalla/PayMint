# PayMint
[PayMint](https://pay-mint-two.vercel.app/)

A full-stack invoice creation and management system for freelancers.

## Overview
PayMint is a full-stack web application designed to manage clients, invoices, services, and payments efficiently. It features a modern React-based frontend with a Node.js and Express backend, integrated with MongoDB for data storage. The application supports user authentication, PDF invoice generation, and data visualization.

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

## Project Structure

```
/src               # Frontend React application (TypeScript)
/server            # Backend Node.js Express server
/public            # Public assets and static files
index.html         # Main HTML file
package.json       # Project dependencies and scripts
vite.config.ts     # Vite configuration
```

### Prerequisites
- Node.js (v16 or higher recommended)
- MongoDB instance (cloud)


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

## Deployments
Frontend deployed at: https://pay-mint-two.vercel.app/

Backend deployed at: https://paymint-backend.onrender.com

## Contributions

Any contributions are welcome!
