# PharmaPath - Medicine Availability Finder

PharmaPath is a production-ready, centralized web platform connecting customers with nearby pharmacies. It solves the problem of "pharmacy-hopping" by allowing users to search for prescribed medicines, check real-time availability, compare prices, and reserve medicines for pickup.

---

## Key Features

### For Customers
- **Smart Search:** Search medicines by brand or generic salt name with radius filters (1 km, 3 km, 5 km, 10 km).
- **Real-time Inventory:** View exact stock quantities, prices, and expiry details at verified nearby pharmacies.
- **Courtesy Hold (Reservation):** Reserve medicines for a 2-hour pickup window with a unique token and 4-digit SMS PIN to avoid stock-outs.
- **Live Tracking:** Track reservation status with a live countdown timer and instant counter pass modal on the dashboard.

### For Pharmacy Owners
- **Dispensary Dashboard:** Manage inventory, view low-stock alerts, and monitor incoming reservations.
- **Inventory CRUD:** Add, edit, and delete medicines with real-time database sync and batch/rack location tracking.
- **Reservation Management:** Accept, reject, or mark customer orders as collected with automatic stock decrementing.

### For Admins
- **Platform Oversight:** Verify new pharmacy registrations, review drug licenses, and manage user access.
- **Analytics:** View platform-wide stats and operational metrics.

---

## Tech Stack

### Frontend
- **React 19** with **Vite**
- **TypeScript**
- **Tailwind CSS** (Clinical Modernism Design System)
- **Framer Motion & GSAP** (Smooth scrolling via Lenis & reveal animations)
- **Lucide React** (Icons)

### Backend
- **Node.js & Express**
- **TypeScript**
- **MongoDB & Mongoose** (MongoDB Atlas integration)
- **JWT** (Authentication via secure httpOnly cookies)
- **bcryptjs** (Password hashing)

### Testing
- **Playwright** (Automated End-to-End QA Testing)

---

## Folder Structure

```text
pharmapath/
├── client/          # React + Vite Frontend Application
├── server/          # Express + TypeScript Backend API
├── docs/            # PRD, Architecture & Specifications
├── run_e2e_qa.mjs   # Automated End-to-End Testing Script (Playwright)
└── TEST_REPORT.md   # Latest QA Automation Report
```

---

## Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas Account (or local MongoDB instance)

### 1. Clone the repository
```bash
git clone https://github.com/Narindersra/PharmaPath.git
cd PharmaPath
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory and add the following:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
```

Seed initial data (Admin, verified pharmacies, medicine catalog):
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
```

### 3. Setup Frontend
Open a new terminal window:
```bash
cd client
npm install
npm run dev
```

The application will be accessible at `http://localhost:5173`.

### 4. Run E2E Tests (Optional)
Ensure both the frontend and backend servers are running, then run the automated Playwright test suite from the root directory:
```bash
node run_e2e_qa.mjs
```

---

## Documentation

- [Product Requirements Document (PRD)](file:///c:/Users/ASUS/Desktop/PharmaPath/docs/PRD.md)
- [QA Automation Test Report](file:///c:/Users/ASUS/Desktop/PharmaPath/TEST_REPORT.md)
