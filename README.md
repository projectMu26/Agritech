# 🌱 AgriTech - Empowering Farmers Through Digital Technology

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green.svg)](https://github.com/projectMu26/Agritech)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Bootstrap-blue.svg)](https://reactjs.org/)
[![Node & Express](https://img.shields.io/badge/Backend-Node%20v24%20%2B%20Express-brightgreen.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Mongoose-darkgreen.svg)](https://www.mongodb.com/)
[![Security](https://img.shields.io/badge/Auth-JWT%20%26%20Bcrypt-orange.svg)](https://jwt.io/)

> **AgriTech** is a full-stack smart farming and agro-management system designed to empower farmers with digital tools that enhance agricultural productivity, soil health, and sustainability. Built using the **MERN stack (MongoDB, Express.js, React, Node.js)** and **Bootstrap**, it bridges traditional agricultural wisdom with precision digital technology.

---

## 📌 Project Review & Repository Links

- **GitHub Repository:** [https://github.com/projectMu26/Agritech](https://github.com/projectMu26/Agritech)
- **GitHub Username:** `projectMu26`
- **GitHub Email:** `astroandphyclub@gmail.com`
- **Live Demo Link:** `http://localhost:3000` *(or deployment URL)*

---

## 🚀 Key Modules & Architecture

### 1. 🔐 Role-Based Authentication & Security
- **JWT (JSON Web Token)** based stateless authentication with Bearer tokens.
- **Bcrypt.js** password encryption with salted hashing.
- Three specialized user roles:
  - 🌾 **Farmer**: Manages land, crops, soil tests, places orders, and consults agronomists.
  - 🛡️ **Admin**: Oversees platform telemetry, user role promotion, system stats, and catalog inventory.
  - 👨‍🔬 **Expert / Agronomist**: Reviews crop diseases, issues agronomic prescriptions, and schedules advisories.
- **Fast 1-Click Evaluator Buttons**: Log in instantly as Demo Farmer, Admin, or Expert with zero signup friction.

### 2. 🚜 Farm Profile & Parcel Management
- CRUD operations for agricultural holdings.
- Tracks acreage, GIS city/state coordinates, soil classification (Alluvial, Loam, Black, Clay, Red, Sandy), and irrigation infrastructure (Drip, Sprinkler, Canal, Borewell, Rainfed).

### 3. 🌾 Crop Phenology & AI Soil Diagnostics
- Growth stage tracking: *Sowing &rarr; Germination &rarr; Vegetative &rarr; Flowering &rarr; Grain Filling &rarr; Maturity &rarr; Harvested*.
- Comprehensive soil testing telemetry:
  - **pH Level Analysis** (Acidic, Optimal, Alkaline alerts + lime/gypsum remediation).
  - **Moisture Sensor Telemetry** (Adequate, Irrigation Needed, Waterlogged).
  - **N-P-K Balances** (Nitrogen, Phosphorus, Potassium in kg/ha) with automated dosage prescriptions for Urea, SSP, MOP, and Organic Vermicompost.
  - **Organic Carbon Index**.

### 4. 🌦️ Agro-Meteorology & Predictive Pest Radar
- Real-time weather lookup calibrated for major farming belts (Punjab, Maharashtra, Karnataka, Gujarat, UP, Bihar, etc.).
- Evaluates **Foliar Spray Suitability** and **Irrigation Need** based on wind speed and relative humidity.
- **Dynamic Pest & Blight Outbreak Simulator**:
  - Predicts pathogen risks (Late Blight, Yellow Rust, Rice Blast, Aphids, Whiteflies, Fall Armyworm).
  - Prescribes both **Biological/Organic remedies** (Neem extract, Trichoderma viride, BT) and **Chemical treatments** with exact dosages per liter.

### 5. 🛒 Agri-Marketplace & Kisan Order Tracking
- E-commerce catalog for certified hybrid seeds, biofertilizers, organic pesticides, and solar micro-drip kits.
- Real-time stock reservation and shopping cart with multiple payment options (Cash on Delivery / Kisan Pay, UPI, Net Banking, Kisan Credit Card).
- Order history tracking: *Processing &rarr; Confirmed &rarr; Dispatched &rarr; Delivered*.

### 6. 💬 Kisan Community Forum & Expert Consultation
- **Community Forum**: Category filtering, discussions, upvotes, and peer replies.
- **Expert Desk**: Schedule 1-on-1 consultations (Video Call, Phone, In-App) with certified ICAR scientists and receive written agronomic prescriptions.

### 7. 🌐 Multilingual Accessibility
- Instant switchable language context:
  - 🇺🇸 **English** (Default)
  - 🇮🇳 **हिंदी (Hindi)**
  - 🇪🇸 **Español (Spanish)**

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Bootstrap 5, Bootstrap Icons, Lucide React, Axios, React Router v6 |
| **Backend** | Node.js (v16+), Express.js, JWT, Bcrypt.js, CORS, Morgan, Dotenv |
| **Database** | MongoDB (Mongoose ODM) - Compatible with MongoDB Atlas & Local MongoDB |
| **Architecture** | RESTful APIs, MVC Pattern, Modular Middleware, Centralized Error Handling |

---

## 📁 Project Directory Structure

```text
agritech/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile
│   │   ├── farmController.js     # Farm CRUD operations
│   │   ├── cropController.js     # Crop phenology & soil reports
│   │   ├── weatherController.js  # Live weather & pest predictions
│   │   ├── resourceController.js # Marketplace catalog CRUD
│   │   ├── orderController.js    # Order processing & history
│   │   ├── forumController.js    # Community Q&A & replies
│   │   ├── consultationController.js # Agronomist appointment bookings
│   │   └── adminController.js    # System metrics & user governance
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & role authorization
│   │   └── errorMiddleware.js    # 404 & centralized error handler
│   ├── models/
│   │   ├── User.js, Farm.js, Crop.js, Resource.js, Order.js, Consultation.js, ForumPost.js, WeatherData.js
│   │   └── (Mongoose Relational Schemas)
│   ├── routes/                   # Express REST endpoints
│   ├── utils/
│   │   ├── pestAdvisory.js       # Dynamic pest prediction engine
│   │   └── soilAnalytics.js      # N-P-K & pH diagnostic engine
│   ├── seeder.js                 # Seeds realistic agricultural database
│   ├── server.js                 # Express application entrypoint
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/           # Navbar, Footer, ProtectedRoute
│   │   ├── context/              # AuthContext, LanguageContext
│   │   ├── pages/                # Home, Login, Register, Dashboard, Farms, Crops, Weather, Marketplace, Orders, Forum, Consultations, Admin
│   │   ├── services/             # Axios API client
│   │   ├── translations/         # Multilingual dictionaries (EN, HI, ES)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css             # Lush agriculture theme & Bootstrap overrides
│   ├── package.json
│   └── vite.config.js
├── package.json                  # Root orchestration (concurrently dev runner)
├── .gitignore
└── README.md
```

---

## ⚡ Step-by-Step Setup & Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/projectMu26/Agritech.git
cd Agritech
```

### Step 2: Install Dependencies
Run the installation command in the root folder to install backend, frontend, and root packages:
```bash
# In the root folder:
npm install
npm run install:all
```

Alternatively, install manually in each folder:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### Step 3: Configure Environment Variables
Inside the `backend/` folder, check `.env` (or copy `.env.example`):
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/agritech
JWT_SECRET=agritech_super_secret_jwt_key_2026_xyz
WEATHER_API_KEY=your_openweather_api_key_optional
```
*(Note: If you are using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string `mongodb+srv://<username>:<password>@cluster.mongodb.net/agritech`).*

### Step 4: Seed Sample Agricultural Data
Run the seeder script to populate realistic farms, crops, soil reports, products, and community posts:
```bash
npm run seed
```

Default credentials created by the seeder:
| Role | Email | Password |
|---|---|---|
| **Farmer** | `farmer@agritech.com` | `farmer123` |
| **Admin** | `admin@agritech.com` | `admin123` |
| **Expert** | `expert@agritech.com` | `expert123` |

### Step 5: Start Development Servers
From the root folder, launch both frontend and backend concurrently:
```bash
npm run dev
```

- **Frontend App:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` - Create new user account (farmer, expert, admin)
- `POST /api/auth/login` - Authenticate user & return JWT token
- `GET /api/auth/profile` - Fetch current user profile (Private)
- `PUT /api/auth/profile` - Update user details (Private)

### Farm Management
- `GET /api/farms` - Get farmer's land holdings (Private)
- `POST /api/farms` - Register new farm (Private)
- `GET /api/farms/:id` - Fetch farm details & associated crops (Private)
- `PUT /api/farms/:id` - Update farm parameters (Private)
- `DELETE /api/farms/:id` - Delete farm & cascade crops (Private)

### Crop Monitoring & Soil Health
- `GET /api/crops` - Get crops list (Private)
- `POST /api/crops` - Register crop season & compute soil prescriptions (Private)
- `GET /api/crops/:id` - Comprehensive diagnostic report (Private)
- `PUT /api/crops/:id` - Update stage & re-analyze soil (Private)
- `DELETE /api/crops/:id` - Remove crop record (Private)

### Agro-Meteorology & Pest Radar
- `GET /api/weather?city=Punjab` - Microclimate telemetry & 7-day outlook
- `POST /api/weather/pest-alerts` - Dynamic pest outbreak simulator

### Agri Store & Orders
- `GET /api/resources` - Browse catalog (seeds, fertilizers, tools)
- `POST /api/orders` - Place order & update inventory (Private)
- `GET /api/orders/myorders` - List farmer's past orders (Private)

### Community & Consultation
- `GET /api/forum` - Browse forum discussions
- `POST /api/forum` - Post farmer question (Private)
- `POST /api/consultations` - Book agronomist advisory (Private)
- `GET /api/consultations/my` - View booked sessions & prescriptions (Private)

### Administration
- `GET /api/admin/stats` - Platform metrics & revenue (Admin)
- `GET /api/admin/users` - Manage registered users & roles (Admin)
- `POST /api/resources` - Add catalog products (Admin)

---

## 🚢 Git Commands to Push to GitHub

To commit and push your project to [https://github.com/projectMu26/Agritech](https://github.com/projectMu26/Agritech):

```bash
git add .
git commit -m "feat: complete AgriTech smart farming management system (MERN stack)"
git branch -M main
git push -u origin main
```

---

## 👨‍🌾 Contributing & License
Developed under the MIT License for educational and agricultural empowerment initiatives.
