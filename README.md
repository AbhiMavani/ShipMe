# ShipMe: Shipment Transport System

**ShipMe** is a web-based platform developed using Angular, Node.js, and Google Maps APIs, designed to facilitate shipment transport and logistics. The system provides features similar to [Shiply](https://www.shiply.com/), offering users an intuitive interface to post and track shipments while enabling transport providers to bid for jobs.

---

## Features

- **User Registration and Authentication**
  - Secure signup/login system for both customers and transport providers.
  
- **Post and Manage Shipments**
  - Customers can post details of shipments, including type, size, origin, and destination.
  
- **Transport Provider Bidding**
  - Providers can browse shipment requests and place bids, creating a competitive marketplace.

- **Google Maps Integration**
  - Real-time route optimization and distance calculation using Google Maps APIs.

- **Dynamic Pricing**
  - Pricing suggestions based on distance, shipment size, and other parameters.

- **Shipment Tracking**
  - Customers can track shipment status and location in real time.

- **Notifications**
  - Email and in-app notifications for updates on bids, shipment status, and other activities.

---

## Technology Stack

- **Frontend:** Angular
- **Backend:** Node.js with Express.js
- **Database:** MongoDB (or any other NoSQL/SQL database)
- **APIs:** Google Maps API for geolocation and route mapping
- **Hosting:** Deployed on [Platform/Cloud Provider] (e.g., AWS, Heroku)

---

## Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AbhiMavani/ShipMe.git
   cd ShipMe
2. **Setup:**
   ```bash
   npm install
   
  - Add environment variables in a .env file:
  ```bash
  PORT=3000
  DB_URI=<your-database-connection-string>
  GOOGLE_MAPS_API_KEY=<your-google-maps-api-key>

  npm start

  Go to http://localhost:4200



