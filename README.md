# Link Analytics Dashboard - Server

This is the backend for the Micro-SaaS Assignment: Link Analytics Dashboard (Mini Bitly Clone).  
Built with Node.js, Express.js, and MongoDB.

---

## Features

- User Authentication with JWT  
- URL Shortener with:
  - Custom Alias (optional)
  - Expiration Date (optional)
- Analytics Tracking:
  - Total Click Count
  - Device, Browser, and Location Tracking
  - Clicks Over Time
- RESTful API Architecture  
- CORS and Security Middleware Integration

---

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- User-Agent Parser (for device/browser detection)
- IP Geolocation (Optional)
- dotenv for Environment Variables

---

## API Endpoints

### Auth Routes

| Method | Route          | Description             |
|--------|----------------|-------------------------|
| POST   | /api/auth/login | Login with credentials |

Login Credentials:

```
Email: intern@dacoid.com  
Password: Test123
```

---

### URL Routes

| Method | Route              | Description                    |
|--------|-------------------|--------------------------------|
| POST   | /api/urls         | Create Short URL               |
| GET    | /api/urls         | Get All URLs of Logged User    |
| GET    | /:shortId         | Redirect to Original URL & Track Analytics |

---

## Environment Variables

Create `.env` file in root:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
BASE_URL=http://localhost:5000
```

---

## Run Locally

Clone the project:

```bash
git clone https://github.com/hanishtharwani123/SDE-ASSIGNMENT-SERVER.git
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm run dev
```

---

## Folder Structure

```
server/
│
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
└── server.js
```

---

## Project Demo

### Base URL  

> [http://localhost:5000](http://localhost:5000)

> Or your deployed server URL  

---

## Note

Make sure to run the server before using the client app.

---
