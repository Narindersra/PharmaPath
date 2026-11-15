# Document 1: `PRD.md`

```markdown
# PharmaPath – Medicine Availability Finder
## Product Requirements Document (PRD)

**Version:** 1.0 (MVP)  
**Status:** Ready for Architecture & Design  
**Target Stack:** MERN (MongoDB Atlas, Express.js, React + Vite, Node.js)  
**Deployment Model:** Free-tier cloud deployment (Vercel Frontend, Render Backend, MongoDB Atlas M0, Cloudinary, Brevo/Resend Email)

---

## 1. Problem, Value Proposition, and Target Users

### 1.1 Problem Statement
When patients or caregivers need a doctor-prescribed or urgent medicine, they currently have no centralized way to know which nearby pharmacy has it in stock. As a result:
- **Wasted Time & Effort:** Customers must physically visit or call multiple medical stores one by one.
- **Emergency Delays:** Finding critical medicines quickly during emergencies becomes stressful and slow.
- **Lack of Price Transparency:** Customers cannot easily compare medicine prices across nearby pharmacies.
- **Manual Pharmacy Operations:** Many local pharmacies lack simple digital inventory tracking, leading to stock discrepancies, missed sales, and unmonitored medicine expiry.
- **Unreliable Information:** Even when pharmacies are listed online on generic directories, real-time stock availability and batch expiry are not visible.

### 1.2 Value Proposition
**PharmaPath** is a centralized web platform connecting patients/customers with verified local pharmacies in real time:
- **For Customers:** Search any medicine by brand or generic name, select a location and search radius, compare nearby verified pharmacies by **availability, stock quantity, price, and distance**, and send a **time-bound reservation request** before stepping out—avoiding pharmacy-to-pharmacy hopping.
- **For Pharmacy Owners:** Digitize inventory easily via manual entry or CSV bulk upload, track batch numbers and expiry dates, receive low-stock and near-expiry alerts, and convert local searches into confirmed pickups via reservation requests.
- **For Platform Administrators:** Maintain trust and regulatory safety by verifying pharmacy drug licenses, managing the master medicine catalog, moderating users/pharmacies, and monitoring platform usage.

> **Platform Disclaimer:** PharmaPath is strictly a medicine availability discovery and pickup-reservation platform. PharmaPath does not directly sell, dispense, or deliver medicines; all dispensing and regulatory compliance occur at the licensed physical pharmacy counter.

### 1.3 Target Users
1. **Guest Visitors (Unauthenticated Customers):** Individuals urgently checking medicine availability, prices, and distances near a chosen location without friction.
2. **Registered Customers (Patients & Caregivers):** Users who reserve medicines at nearby pharmacies, upload prescriptions when required, track pickup status, save favorite pharmacies, and leave ratings/reviews.
3. **Pharmacy Owners (Multi-Branch Operators):** Licensed medical store owners managing one or more pharmacy branches, digital stock, pricing, expiry tracking, and incoming customer reservation requests.
4. **Platform Administrators:** System operators responsible for verifying pharmacy drug licenses, curating the master medicine catalog, handling user/pharmacy blocks, and reviewing platform analytics.

---

## 2. Core User Journeys and User Stories

### 2.1 Primary End-to-End Customer Journey (Happy Path)
1. A user needs **Paracetamol 500mg**. They open PharmaPath (no login required to search).
2. They type `"Paracetamol 500mg"` (or generic salt `"Paracetamol"`) into the search bar with autocomplete and typo-tolerant matching.
3. They allow browser GPS location detection or manually enter their city/area/pincode and select a search radius (e.g., `5 km`).
4. PharmaPath displays a list and interactive map of verified nearby pharmacies with `availableQuantity > 0`, showing distance (`km`), price (`₹`), available stock count, open/closed status, and last inventory update timestamp.
5. The user sorts/filters by distance or price, compares options, and clicks **Reserve** on their preferred pharmacy.
6. If not logged in, the user is prompted to log in or register; upon authentication, they return directly to the reservation modal.
7. The user enters the required quantity. (If the medicine is marked `requiresPrescription = true`, they must upload a valid prescription image/PDF; for OTC medicines like Paracetamol 500mg, prescription upload is optional).
8. The user selects payment preference (**Pay at Pharmacy** [default] or **Pay Online via Razorpay Test Mode** [stretch feature]) and submits the reservation request.
9. Stock is immediately placed on temporary hold (`PENDING`, 30-minute pharmacy response window), and the pharmacy receives an email + in-app notification.
10. The pharmacy owner reviews the request (and prescription, if attached) and clicks **Confirm**. The customer receives an email + in-app notification that the medicine is held for **2 hours** for pickup.
11. The customer visits the pharmacy, pays (if Pay at Pharmacy), and collects the medicine. The pharmacy marks the reservation as **Collected**, permanently deducting the stock.
12. Afterward, the customer can rate and review the pharmacy.

---

### 2.2 User Stories & Acceptance Criteria

#### A. Guest & Customer Stories
- **US-C01 (Public Medicine Search):** As a guest or customer, I want to search medicines by brand name or generic salt without logging in, so that I can immediately check availability in urgent situations.
  - *Acceptance Criteria:* Search works without authentication; autocomplete suggests matching medicines from the master catalog after 2+ characters; minor typos (e.g., `"paracetmol"`) still match relevant medicines.
- **US-C02 (Location & Radius Selection):** As a customer, I want to detect my current location via GPS or enter a city/area manually and choose a search radius (`1 km`, `3 km`, `5 km`, `10 km`, `25 km`), so that I only see pharmacies within reachable distance.
  - *Acceptance Criteria:* Both GPS and manual location input resolve to latitude/longitude coordinates; changing radius dynamically updates the matching pharmacy list and map markers.
- **US-C03 (Compare Nearby Pharmacies):** As a customer, I want to view nearby pharmacies on both a list and a map with price, stock quantity, distance, open/closed status, and last-updated time, and sort/filter results, so that I can pick the best store.
  - *Acceptance Criteria:* Only `VERIFIED` pharmacies with un-expired, available stock (`quantity - reservedQuantity > 0`) appear; users can sort by Distance (ascending) or Price (ascending) and filter by "Open Now" or "In Stock".
- **US-C04 (Medicine Reservation & Prescription Upload):** As a logged-in customer, I want to send a reservation request for a specific quantity and upload my prescription if required, so that the pharmacy holds the medicine until I arrive.
  - *Acceptance Criteria:* Unauthenticated users clicking "Reserve" are redirected to login and returned to the flow; reservations cannot exceed available stock; Schedule H/prescription-required medicines block submission unless a valid prescription file (`JPG`, `PNG`, `PDF`, max `5 MB`) is uploaded; stock is atomically held to prevent double-booking.
- **US-C05 (Payment Option Selection):** As a customer, I want to choose between paying at the pharmacy counter or paying online (test mode), so that I have flexibility at pickup.
  - *Acceptance Criteria:* "Pay at Pharmacy" is always available as the primary option; Razorpay test-mode payment (if enabled) records a test transaction reference before confirming the request.
- **US-C06 (Track & Cancel Reservations):** As a customer, I want to view my active and past reservations, receive status updates, and cancel an active reservation if my plans change, so that held stock is released back to the store.
  - *Acceptance Criteria:* Customers see real-time status (`PENDING`, `CONFIRMED`, `REJECTED`, `COLLECTED`, `EXPIRED`, `CANCELLED`); cancelling a `PENDING` or `CONFIRMED` reservation immediately releases `reservedQuantity`.
- **US-C07 (Favorites & Reviews):** As a customer, I want to save favorite pharmacies and rate/review pharmacies from which I have collected medicines, so that I can find trusted stores faster and help other patients.
  - *Acceptance Criteria:* Customers can toggle favorite status on any verified pharmacy; customers can submit one rating (1–5 stars) + comment per pharmacy after having at least one `COLLECTED` reservation there.

#### B. Pharmacy Owner Stories
- **US-P01 (Multi-Branch Pharmacy Registration & Verification):** As a pharmacy owner, I want to register an account and submit one or more pharmacy branches with drug license numbers and license documents, so that each branch can be verified and listed on PharmaPath.
  - *Acceptance Criteria:* One owner account can create multiple pharmacy branch profiles; each branch requires a unique drug license number, address, coordinates, opening/closing times, and license document upload; new branches start in `PENDING` status and are hidden from public search until `VERIFIED` by Admin.
- **US-P02 (Digital Inventory Management - Manual & CSV):** As a pharmacy owner, I want to add, edit, and delete medicine stock manually or via CSV bulk upload (including price, quantity, batch number, and expiry date), so that my branch inventory stays accurate without heavy data entry.
  - *Acceptance Criteria:* Owners can only manage inventory for branches they own; CSV upload validates columns, rejects invalid rows with clear error messages, and updates/inserts valid rows; `updatedAt` refreshes on every change.
- **US-P03 (Low-Stock & Near-Expiry Alerts):** As a pharmacy owner, I want to see alerts for medicines running low on stock or approaching expiry, so that I can restock on time and avoid dispensing expired medicines.
  - *Acceptance Criteria:* Dashboard highlights items with `availableQuantity <= 10` (Low Stock) and items expiring within 30 days (Near Expiry); items past `expiryDate` are automatically excluded from customer search results and flagged as Expired.
- **US-P04 (Manage Incoming Reservations):** As a pharmacy owner, I want to receive notifications for new reservation requests, inspect attached prescriptions, and confirm, reject, or mark them collected, so that I can serve customers smoothly.
  - *Acceptance Criteria:* Confirming locks stock for a 2-hour pickup window; rejecting (with reason) releases held stock immediately; marking `COLLECTED` deducts both `quantity` and `reservedQuantity` permanently.

#### C. Platform Admin Stories
- **US-A01 (Pharmacy Verification & Moderation):** As an admin, I want to review pending pharmacy registrations, inspect their license numbers and uploaded documents, and approve, reject, or block pharmacies, so that only legitimate medical stores appear on the platform.
  - *Acceptance Criteria:* Admin sees a queue of `PENDING` pharmacies with document preview; approving changes status to `VERIFIED` and notifies the owner; rejecting requires a reason; blocking immediately hides the pharmacy from public search.
- **US-A02 (Master Medicine Catalog Management):** As an admin, I want to add, update, and remove medicines in the master catalog (including brand name, generic salt, manufacturer, category, and prescription requirement), so that pharmacies and customers reference standardized medicine entries.
  - *Acceptance Criteria:* System starts seeded with ~500 common medicines; admin can CRUD catalog entries; marking `requiresPrescription = true` enforces prescription upload across all pharmacies stocking that medicine.
- **US-A03 (User Moderation & Platform Analytics):** As an admin, I want to view platform metrics and block/unblock abusive users or pharmacy accounts, so that the platform remains reliable and safe.
  - *Acceptance Criteria:* Admin dashboard displays total customers, pharmacies by status, total catalog medicines, total searches, reservation conversion metrics, and top searched medicines; blocked users cannot log in or perform write actions.

---

## 3. Features and Functional Requirements

### 3.1 Authentication & Account Management
- **FR-01:** System shall support email + password registration and login for `CUSTOMER` and `PHARMACY` roles. (`ADMIN` accounts are seeded/provisioned securely).
- **FR-02:** Passwords must be hashed using `bcrypt` before storage; sessions must use secure HTTP-only cookies or short-lived JWTs with proper expiration handling.
- **FR-03:** Blocked users (`isBlocked = true`) must be prevented from logging in and have active API requests rejected with `403 Forbidden`.
- **FR-04:** Public medicine search and pharmacy viewing must work without authentication; protected actions (reserve, favorite, review, pharmacy dashboard, admin panel) must enforce server-side authentication and role/ownership checks.

### 3.2 Medicine Search & Discovery (Customer / Guest)
- **FR-05:** Search input must support autocomplete suggestions and fuzzy matching against both `name` (brand/strength, e.g., `"Paracetamol 500mg"`) and `genericName` (salt composition, e.g., `"Paracetamol"`).
- **FR-06:** Location selector must support:
  1. Browser Geolocation API (`lat`, `lng` auto-detection).
  2. Manual location search by city, neighborhood, or pincode (geocoded to `lat`, `lng`).
- **FR-07:** Customer must be able to select search radius from predefined options (`1 km`, `3 km`, `5 km` [default], `10 km`, `25 km`).
- **FR-08:** Search results must return only pharmacies where:
  - `pharmacy.status === 'VERIFIED'`
  - `pharmacy.owner.isBlocked === false`
  - `inventory.quantity - inventory.reservedQuantity > 0`
  - `inventory.expiryDate > currentDate` (not expired)
  - Distance from customer coordinates `<= selectedRadius`
- **FR-09:** Each search result item must display:
  - Pharmacy name & branch/area
  - Distance in kilometers (rounded to 1–2 decimal places)
  - Unit/pack price in INR (`₹`)
  - Available stock quantity
  - Current open/closed status (calculated from `openingTime`, `closingTime`, and current time)
  - Inventory freshness indicator (e.g., `"Updated 45 mins ago"`)
  - Average rating & review count
  - Prescription required badge (if `requiresPrescription === true`)
- **FR-10:** Customer must be able to sort results by **Distance (Nearest First)** or **Price (Lowest First)**, and filter by **Open Now** and **Minimum Stock Quantity**.
- **FR-11:** Search results must be viewable in both **List View** and **Interactive Map View** (using Leaflet + OpenStreetMap) with synchronized markers and pharmacy summary popups.

### 3.3 Medicine Reservation & Lifecycle
- **FR-12:** Logged-in customers can request a reservation for a specific medicine at a specific verified pharmacy by specifying `quantity` (`>= 1` and `<= availableQuantity`).
- **FR-13:** If the medicine has `requiresPrescription === true`, the customer must upload a prescription file (`JPG`, `PNG`, `PDF`, max `5 MB`); the request must be rejected server-side if missing.
- **FR-14:** Customer selects payment mode:
  - `PAY_AT_PHARMACY` (Default, always available)
  - `ONLINE_TEST` (Razorpay Test Mode integration — MVP stretch goal)
- **FR-15:** Upon reservation creation, the backend must perform an **atomic conditional update** on inventory (`reservedQuantity += qty` only if `quantity - reservedQuantity >= qty`) so concurrent requests cannot oversell stock.
- **FR-16:** Reservation status lifecycle and stock rules:
  - `PENDING`: Initial state upon customer submission. Held for **30 minutes** awaiting pharmacy response.
  - `CONFIRMED`: Pharmacy accepts the request. Held for **2 hours** (or until pharmacy closing time if earlier, minimum 30 mins if near closing, or configurable pickup deadline) for customer collection.
  - `REJECTED`: Pharmacy declines the request (with mandatory reason). `reservedQuantity` is immediately decremented by `qty`.
  - `CANCELLED`: Customer cancels while in `PENDING` or `CONFIRMED` state. `reservedQuantity` is immediately decremented by `qty`.
  - `EXPIRED`: Automated background job/endpoint releases reservations whose `expiresAt` timestamp has passed (`PENDING` > 30 mins or `CONFIRMED` > 2 hours) and decrements `reservedQuantity` by `qty`.
  - `COLLECTED`: Pharmacy marks the medicine as picked up by the customer. `quantity` is decremented by `qty` AND `reservedQuantity` is decremented by `qty`.
- **FR-17:** Customers can view their active and historical reservations, filter by status, and download/view their uploaded prescription.

### 3.4 Pharmacy Branch & Inventory Management
- **FR-18:** A `PHARMACY` user can create and manage multiple pharmacy branches (`1 Owner -> N Branches`).
- **FR-19:** Each branch stores: `name`, `licenseNo` (unique), `licenseDocumentUrl`, `phone`, `address`, `city`, `pincode`, GeoJSON `location` (`[lng, lat]`), `openingTime`, `closingTime`, and `status` (`PENDING`, `VERIFIED`, `REJECTED`, `BLOCKED`).
- **FR-20:** Pharmacy owners can manage inventory per branch:
  - **Manual CRUD:** Select medicine from master catalog, set `price`, `quantity`, `batchNo`, `expiryDate`.
  - **CSV Bulk Upload:** Upload a `.csv` file matching a downloadable sample template to bulk-upsert inventory rows for a branch, receiving a summary of succeeded and failed rows.
- **FR-21:** Inventory items cannot have negative `price`, negative `quantity`, or `quantity < reservedQuantity`.
- **FR-22:** Pharmacy dashboard must display automated alerts per branch:
  - **Low Stock:** `quantity - reservedQuantity <= 10`
  - **Near Expiry:** `expiryDate` within next 30 days
  - **Expired:** `expiryDate <= today` (automatically hidden from customer search)
- **FR-23:** Pharmacy owners can view incoming reservations per branch, inspect customer name/phone and uploaded prescription image/PDF (for prescription medicines), and trigger `Confirm`, `Reject` (with reason), or `Mark Collected` actions.

### 3.5 Notifications, Favorites, and Reviews
- **FR-24:** System shall dispatch both **In-App Notifications** (stored in DB, shown in navbar notification bell with unread count) and **Email Notifications** (via transactional email API) for:
  - Customer: Reservation Confirmed, Reservation Rejected (with reason), Reservation Expired.
  - Pharmacy Owner: New Reservation Request received, Branch Verified/Rejected/Blocked by Admin, Daily/real-time Low-Stock or Near-Expiry alert summary.
- **FR-25:** Logged-in customers can add/remove verified pharmacies to/from their **Favorites** list for quick access.
- **FR-26:** Logged-in customers who have at least one `COLLECTED` reservation at a pharmacy can submit a **Rating (1–5 stars)** and **Review comment** for that pharmacy (one review per customer per pharmacy, editable). Aggregated average rating and review count update on the pharmacy profile.

### 3.6 Admin Governance & Analytics
- **FR-27:** Admin can view all pharmacy branches filtered by status (`PENDING`, `VERIFIED`, `REJECTED`, `BLOCKED`), inspect license numbers and uploaded license documents, and change status to `VERIFIED`, `REJECTED` (with reason), or `BLOCKED`.
- **FR-28:** Admin can perform full CRUD on the **Master Medicine Catalog** (`name`, `genericName`, `brand`, `manufacturer`, `category`, `unit`, `requiresPrescription`).
- **FR-29:** Admin can list all registered users (`CUSTOMER`, `PHARMACY`), search/filter them, and toggle `isBlocked` status.
- **FR-30:** Admin dashboard displays platform statistics: total registered customers, total pharmacies by verification status, total catalog medicines, total searches logged, reservation counts by status, and top 10 searched medicines.

---

## 4. Non-Functional Requirements

### 4.1 Performance
- **NFR-01 (Search Latency):** Medicine autocomplete responses should return in `< 200 ms` and geospatial nearby-pharmacy search queries in `< 500 ms` under demo-scale load (500 medicines, up to 1,000 pharmacy branches).
- **NFR-02 (Page Load):** Initial frontend bundle load on 4G mobile connection should complete First Contentful Paint in `< 2.0 seconds`.
- **NFR-03 (Cold-Start Mitigation):** Because Render's free tier sleeps after 15 minutes of inactivity, an external lightweight uptime ping (e.g., every 5 minutes) will keep the backend warm and trigger scheduled reservation-expiry cleanup.

### 4.2 Security & Data Privacy
- **NFR-04 (Transport & Headers):** All production traffic must run over HTTPS; Express backend must enforce security headers via `helmet` and restrict origins via strict CORS allowlist.
- **NFR-05 (Input Validation & Injection Prevention):** All incoming request bodies, params, and query strings must be validated with strict schemas (`Zod`), sanitized against NoSQL operator injection, and rate-limited on auth, search, and upload endpoints.
- **NFR-06 (Sensitive Health Data Protection):** Customer prescription uploads constitute sensitive personal health data (aligned with India's Digital Personal Data Protection Act, 2023 principles). Prescriptions must be stored in restricted/authenticated cloud storage (Cloudinary) and accessible **only** to the uploading customer and the target pharmacy owner via authorized server-mediated URLs or signed short-lived links.
- **NFR-07 (Pharmacy License Verification):** Pharmacy drug license documents must be accessible only to the uploading pharmacy owner and platform admins.
- **NFR-08 (Zero Client Secrets):** All API keys (MongoDB URI, JWT secret, Cloudinary credentials, Email API key, Razorpay keys) must reside strictly in server environment variables and never be exposed in frontend bundles.

### 4.3 Reliability & Concurrency
- **NFR-09 (Atomic Stock Integrity):** Concurrent reservation requests for the same medicine at the same pharmacy must never cause `reservedQuantity > quantity`.
- **NFR-10 (Fault Tolerance):** If a third-party email notification fails, the core reservation state transition must still succeed, and the email failure must be logged without crashing the request.

### 4.4 Usability & Compatibility
- **NFR-11 (Responsive Web):** Application must work seamlessly across desktop (`1280px+`), tablet (`768px`), and mobile (`360px+`) viewports in modern Chrome, Edge, Firefox, and Safari browsers.
- **NFR-12 (Accessibility):** Core customer flows (search, filter, view results, reserve) must meet WCAG 2.1 Level AA color contrast and keyboard navigation standards.

---

## 5. Pages / Screens Inventory

| Route | Screen Name | Access Level | Primary Purpose |
|---|---|---|---|
| `/` | Home & Medicine Search | Public (Guest + All) | Hero search bar, location detector/selector, radius selector, quick popular medicine chips, how-it-works summary |
| `/search` | Search Results & Map | Public (Guest + All) | Nearby verified pharmacies list + Leaflet map split view, sort/filter controls, stock/price/distance cards, "Reserve" CTA |
| `/pharmacies/:id` | Pharmacy Branch Detail | Public (Guest + All) | Branch address, map pin, hours, verification badge, full available medicine list (searchable), customer ratings & reviews, Favorite toggle |
| `/login` | Login | Public (Unauthenticated) | Email + password login with role-aware redirect |
| `/register` | Register | Public (Unauthenticated) | Account registration with role selection (`Customer` or `Pharmacy Owner`) |
| `/reservations` | My Reservations | Customer | Active reservations (with countdown timer & cancel button) and past reservation history |
| `/favorites` | Saved Pharmacies | Customer | List of bookmarked favorite pharmacies with quick link to branch inventory |
| `/notifications` | Notifications Center | Authenticated (All Roles) | Chronological list of in-app notifications with mark-as-read controls |
| `/pharmacy/dashboard` | Pharmacy Overview | Pharmacy Owner | Multi-branch selector, summary KPIs, pending reservation count, low-stock & near-expiry alert widgets |
| `/pharmacy/branches` | Manage Branches | Pharmacy Owner | Add new pharmacy branch (with license upload), edit branch details/hours, view verification status |
| `/pharmacy/inventory` | Manage Inventory | Pharmacy Owner | Branch-scoped inventory table, Add/Edit medicine modal, CSV bulk upload modal + sample template download, expiry/stock filters |
| `/pharmacy/reservations` | Branch Reservations | Pharmacy Owner | Incoming reservation queue (`PENDING`, `CONFIRMED`, `COLLECTED`, `REJECTED`, `EXPIRED`), prescription viewer modal, Confirm/Reject/Collect actions |
| `/admin/dashboard` | Admin Analytics | Admin | Platform KPIs, reservation status breakdown, top searched medicines chart/table |
| `/admin/pharmacies` | Pharmacy Verification | Admin | Filterable list of pharmacies (`PENDING` first), license document viewer, Verify / Reject / Block actions |
| `/admin/medicines` | Master Medicine Catalog | Admin | Searchable catalog table, Add/Edit/Delete medicine modal, prescription-required toggle |
| `/admin/users` | User Management | Admin | Searchable list of Customers & Pharmacy Owners, Block / Unblock toggle |

---

## 6. Roles and Permissions Matrix

| Capability / Resource | Guest | Customer | Pharmacy Owner | Admin |
|---|:---:|:---:|:---:|:---:|
| Search medicines & view nearby verified pharmacies | Yes | Yes | Yes | Yes |
| View public pharmacy profile & reviews | Yes | Yes | Yes | Yes |
| Create reservation request & upload prescription | Redirect to Login | Yes | No | No |
| View & cancel own reservations | No | Yes (Own only) | No | No |
| Bookmark favorite pharmacies | No | Yes (Own only) | No | No |
| Submit rating & review (requires `COLLECTED` order) | No | Yes | No | No |
| Register & manage pharmacy branches | No | No | Yes (Own branches) | View all |
| Manage branch inventory (Manual & CSV) | No | No | Yes (Own verified/pending branches) | No |
| View & action branch reservations (Confirm/Reject/Collect) | No | No | Yes (Own branches) | No |
| View customer prescription for a branch reservation | No | Own only | Yes (For own branch reservation only) | Audit if needed |
| Verify, reject, or block pharmacy branches | No | No | No | Yes |
| Manage master medicine catalog (CRUD) | No | No | Read/Suggest only | Yes |
| Block / unblock user accounts | No | No | No | Yes |
| View platform-wide analytics | No | No | Own branch stats | Yes |

---

## 7. Data Requirements

### 7.1 Core Entities
1. **User:** `id`, `name`, `email` (unique), `phone`, `passwordHash`, `role` (`CUSTOMER` | `PHARMACY` | `ADMIN`), `isBlocked`, `createdAt`.
2. **Pharmacy (Branch):** `id`, `ownerId` (ref User), `name`, `licenseNo` (unique), `licenseDocumentUrl`, `phone`, `address`, `city`, `pincode`, `location` (GeoJSON Point `[lng, lat]`), `openingTime`, `closingTime`, `status` (`PENDING` | `VERIFIED` | `REJECTED` | `BLOCKED`), `rejectionReason`, `averageRating`, `reviewCount`, `createdAt`.
3. **Medicine (Master Catalog):** `id`, `name` (e.g., `"Paracetamol 500mg"`), `genericName` (e.g., `"Paracetamol"`), `brand`, `manufacturer`, `category` (e.g., `"Analgesic"`), `packSize` (e.g., `"Strip of 15 tablets"`), `requiresPrescription` (boolean), `createdAt`.
4. **Inventory:** `id`, `pharmacyId` (ref Pharmacy), `medicineId` (ref Medicine), `price` (Number > 0), `quantity` (Integer >= 0), `reservedQuantity` (Integer >= 0, `<= quantity`), `batchNo`, `expiryDate`, `updatedAt`. *(Unique compound index on `(pharmacyId, medicineId)`).*
5. **Reservation:** `id`, `customerId` (ref User), `pharmacyId` (ref Pharmacy), `medicineId` (ref Medicine), `quantity` (Integer >= 1), `unitPrice`, `totalAmount`, `status` (`PENDING` | `CONFIRMED` | `REJECTED` | `COLLECTED` | `EXPIRED` | `CANCELLED`), `prescriptionUrl` (nullable), `paymentMode` (`PAY_AT_PHARMACY` | `ONLINE_TEST`), `paymentStatus` (`PENDING` | `PAID_TEST` | `WAIVED`), `razorpayOrderId` (nullable), `rejectionReason` (nullable), `expiresAt`, `createdAt`, `updatedAt`.
6. **Review:** `id`, `pharmacyId` (ref Pharmacy), `customerId` (ref User), `rating` (1–5), `comment`, `createdAt`. *(Unique compound index on `(pharmacyId, customerId)`).*
7. **Favorite:** `id`, `userId` (ref User), `pharmacyId` (ref Pharmacy), `createdAt`. *(Unique compound index on `(userId, pharmacyId)`).*
8. **Notification:** `id`, `userId` (ref User), `title`, `message`, `type` (`RESERVATION` | `VERIFICATION` | `INVENTORY_ALERT` | `SYSTEM`), `relatedId`, `isRead`, `createdAt`.
9. **SearchLog (Analytics):** `id`, `query`, `matchedMedicineId` (nullable), `city`, `resultsCount`, `createdAt`.

### 7.2 Seed & Initial Data Requirements
- **Master Medicines:** Seeded with ~500 common Indian medicines (sourced/cleaned from public Kaggle Indian medicine dataset) covering OTC and Schedule H medicines with accurate generic compositions.
- **Demo Pharmacies & Inventory:** Seeded with realistic sample verified pharmacies across major Indian cities (clearly badged in UI as `"Demo Pharmacy Data"` so visitors/recruiters can immediately test searches anywhere while distinguishing demo records from live verified pharmacies).

---

## 8. Integrations

| Integration | Purpose | MVP Choice | Fallback / Notes |
|---|---|---|---|
| **Interactive Maps** | Render nearby pharmacy pins, user location pin, and popups | **Leaflet + OpenStreetMap Tiles** | 100% free, no credit card or billing quota required |
| **Geocoding & Area Autocomplete** | Convert manual city/area/pincode input into `[lat, lng]` coordinates | **Geoapify Geocoding API (Free Tier)** or **OpenStreetMap Nominatim** | Strict server-side proxy + caching/debouncing to respect free rate limits *(see Decision Flag #2)* |
| **File & Media Storage** | Store customer prescriptions (private/authenticated) and pharmacy license documents | **Cloudinary (Free Tier)** | Max 5 MB per file; allowlist MIME types (`image/jpeg`, `image/png`, `application/pdf`) |
| **Transactional Email** | Send reservation status updates, pharmacy verification emails, and low-stock alerts | **Brevo or Resend (Free Tier)** | Non-blocking async dispatch; in-app notifications always persist in MongoDB even if email fails |
| **Online Payment (Stretch)** | Demonstrate online payment option during reservation | **Razorpay Test Mode** | Activated only in Test Mode (`rzp_test_...`); "Pay at Pharmacy" remains primary default |

---

## 9. Loading, Empty, and Error States

### 9.1 System-Wide Patterns
- **Loading States:** Use structural skeleton placeholders matching card/table geometry rather than full-screen blocking spinners; disable submit buttons with inline spinner during async mutations to prevent duplicate submissions.
- **Empty States:** Always explain *why* nothing is shown and provide a clear next action (e.g., expand radius, clear filters, add first inventory item).
- **Error States:** Display clear, human-readable messages (never raw stack traces or database errors) with a **Retry** action for transient network/server errors and inline field-level messages for validation errors.

### 9.2 Screen-Specific State Matrix

| Screen / Flow | Loading State | Empty State | Error State |
|---|---|---|---|
| **Medicine Search Autocomplete** | Subtle inline spinner inside search input | `"No matching medicines found. Try generic salt name (e.g., Paracetamol)."` | `"Could not fetch suggestions. You can still press Enter to search."` |
| **Nearby Pharmacy Search Results** | 4–6 pharmacy card skeletons + map placeholder shimmer | `"No verified pharmacies with stock found within [X] km."` + one-click **"Expand to 10 km"** / **"Clear Filters"** buttons | `"Unable to load nearby pharmacies. Check your connection and retry."` + **Retry** button |
| **Location Detection (GPS)** | `"Detecting your location..."` badge on location button | N/A | `"Location permission denied or unavailable. Please enter your city or pincode manually."` + auto-focus manual input |
| **Reservation Submission** | Submit button shows `"Reserving..."` and locks inputs | N/A | Specific banner: e.g., `"Stock just ran out at this pharmacy. Please choose another store."` or `"Prescription is required for this medicine."` |
| **Customer Reservations List** | 3 reservation card skeletons | `"You haven't made any reservations yet."` + **"Find a Medicine"** CTA button | `"Failed to load your reservations."` + **Retry** button |
| **Pharmacy Inventory Table** | Table row skeletons (8 rows) | `"No medicines in this branch's inventory yet."` + **"Add Medicine"** and **"Import CSV"** CTAs | `"Could not load inventory."` + **Retry** button |
| **CSV Bulk Upload** | Progress bar / `"Validating & importing rows..."` | N/A | Row-by-row error summary table (e.g., `"Row 4: Invalid expiry date; Row 9: Medicine name not found in catalog"`) |
| **Admin Verification Queue** | Queue card skeletons | `"All caught up! No pending pharmacy verifications."` | `"Failed to load verification queue."` + **Retry** button |

---

## 10. MVP Scope, Out-of-Scope Items, Success Criteria & Open Decisions

### 10.1 MVP Scope (10-Day Solo Build)
- **Core MVP (Must-Have, Days 1–8):**
  - Role-based Auth (`CUSTOMER`, `PHARMACY`, `ADMIN`) with JWT/cookie sessions & account blocking
  - Public medicine search (brand + generic, autocomplete + fuzzy match)
  - GPS + manual location geocoding + selectable radius (`1/3/5/10/25 km`)
  - Nearby verified pharmacies List + Leaflet Map view with price, stock, distance, open/closed status, freshness timestamp, sort & filter
  - Atomic stock reservation with `PENDING` (30m) and `CONFIRMED` (2h) auto-expiry, prescription upload for Schedule H medicines, and "Pay at Pharmacy"
  - Multi-branch pharmacy registration with license document upload
  - Per-branch inventory CRUD + CSV bulk upload + low-stock & near-expiry alerts
  - Admin pharmacy verification queue, master medicine catalog (~500 seeded medicines + CRUD), user blocking, and platform stats dashboard
  - In-app + Email notifications, Customer Favorites, Reservation History, and Verified Pickup Reviews/Ratings
- **MVP Stretch (Day 9, Time Permitting):**
  - Razorpay Test Mode online payment option on reservation
  - Generic alternative suggestions when a searched brand is out of stock nearby

### 10.2 Explicitly Out of Scope for MVP (Deferred to v2)
- Home delivery / courier rider tracking
- Live production online payments & automated bank settlements/refunds
- SMS and WhatsApp Business API notifications (requires Indian DLT & business verification)
- Separate `PHARMACY_STAFF` sub-user accounts under a pharmacy owner (owner manages all branches in MVP)
- Multi-batch inventory per medicine per branch (MVP tracks one active batch/expiry per medicine per branch)
- Multi-language UI (Hindi/Punjabi) and native mobile apps (iOS/Android)
- AI/ML demand forecasting or symptom-based diagnosis

### 10.3 Success Criteria
1. **End-to-End Functional Completeness:** A user can search a medicine without login, locate nearby pharmacies on list & map, log in, reserve a prescription or OTC medicine, have the pharmacy confirm and mark it collected, and see stock decrement accurately across every state transition.
2. **Concurrency & Data Integrity:** Simultaneous reservation attempts on the last remaining unit succeed for only 1 customer and return a clean stock-unavailable error for the second.
3. **Security Verification:** Unauthenticated or cross-tenant requests (e.g., Pharmacy A trying to edit Pharmacy B's inventory or view another pharmacy's prescription) fail with `401`/`403`.
4. **Live Production Deployment:** Deployed cleanly on free-tier hosting (Vercel + Render + MongoDB Atlas) with zero exposed secrets and reproducible seed scripts.

### 10.4 Assumptions & Decisions Requiring Approval
- **Assumption A1 (Project Naming):** Standardized project title to **"PharmaPath – Medicine Availability Finder"** per the specification prompts (replacing earlier working title *MediFind*).
- **Assumption A2 (Single Batch per Medicine per Branch):** Each `(pharmacyId, medicineId)` inventory record tracks one active `batchNo` and `expiryDate` in MVP to keep manual entry and CSV import simple.
- **Assumption A3 (Pharmacy Staff Role):** Prompt mentions *"Pharmacy owners and staff"*. For the 10-day solo MVP, `PHARMACY` role represents the pharmacy owner managing one or more branches; granular staff sub-accounts are deferred to v2.
- **Decision D1 (Maps & Geocoding Provider — Approval Needed):** Prompt 13 references *Google Maps Platform (Geocoding, Places Autocomplete, Distance Matrix)*, which requires a billing credit card on Google Cloud. Per your requirement for **100% free tools**, this PRD specifies **Leaflet + OpenStreetMap + Geoapify/Nominatim Free Tier + MongoDB Geospatial Distance**. *Please confirm if you want to keep the 100% free OSM/Geoapify stack or switch to Google Maps API (requires your own API key & billing setup).*
- **Decision D2 (Demo Data Labeling — Approval Needed):** To solve cold-start on live deployment, seeded demo pharmacies will display a subtle `"Demo Store"` badge so real users/recruiters know which stores are sample data vs newly registered live pharmacies. *Please confirm this approach.*
```

---
