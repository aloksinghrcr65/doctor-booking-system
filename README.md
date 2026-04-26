# Doctor Appointment Booking System (Backend)

## Overview

This project is a backend system that allows users to book appointments with multiple doctors.
Users can view available time slots based on a doctor's schedule and book appointments accordingly.
The system ensures that no time slot gets double-booked using database-level constraints.

---

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Joi** - Input validation
- **dotenv** - Environment variables

---

## Features

- Create and manage multiple doctors
- Generate dynamic time slots based on availability
- View available slots for a specific date
- Book appointments
- Prevent double booking with concurrency handled at DB level
- Comprehensive input validation and error handling
- Pagination support for doctors list
- Prevent past date booking
- Comprehensive pagination metadata

---

## System Design

### Architecture
```
┌─────────────────────────────────────────┐
│          API Request                    │
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│          Routes (/api/...)              │
│  ├── /api/doctors                       │
│  └── /api/appointments                  │
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│       Middleware (Validation)           │
│  ├── Request validation                 │
│  └── Error handling                     │
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│         Controllers                     │
│  ├── doctor.controller.js               │
│  └── appointment.controller.js          │
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│          Services                       │
│  ├── doctor.service.js                  │
│  └── appointment.service.js             │
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│           Models                        │
│  ├── doctor.model.js                    │
│  └── appointment.model.js               │
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│          MongoDB Database               │
└─────────────────────────────────────────┘
```

---

## Project Structure

```
doctor-booking-system/
│
├── src/
│   ├── controllers/
│   │   ├── doctor.controller.js
│   │   └── appointment.controller.js
│   │
│   ├── services/
│   │   ├── doctor.service.js
│   │   └── appointment.service.js
│   │
│   ├── models/
│   │   ├── doctor.model.js
│   │   └── appointment.model.js
│   │
│   ├── routes/
│   │   ├── index.js (Main routes aggregator with /api prefix)
│   │   ├── doctor.routes.js
│   │   └── appointment.routes.js
│   │
│   ├── middlewares/
│   │   ├── error.middleware.js
│   │   └── validate.middleware.js
│   │
│   ├── utils/
│   │   └── slotGenerator.js
│   │
│   ├── validators/
│   │   ├── doctor.validator.js
│   │   └── appointment.validator.js
│   │
│   └── config/
│       └── db.js
│
├── app.js (Express app configuration - root level)
├── index.js (Server entry point - root level)
├── package.json
├── .env
└── README.md
```

**Key Structure Points:**
- `index.js` at root is the server entry point
- `app.js` at root contains Express configuration and middleware setup
- `src/` folder contains all application logic
- `src/routes/index.js` aggregates all routes and mounts them under `/api` prefix

---

## API Endpoints

### Create Doctor

**Endpoint:** `POST /api/doctors`

**Request Body:**
```json
{
  "name": "Dr. Sharma",
  "workingDays": ["Monday", "Tuesday", "Wednesday"],
  "startTime": "10:00",
  "endTime": "18:00",
  "slotDuration": 30
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "_id": "66294f5e2d8c3a1b4e8f9a2c",
    "name": "Dr. Sharma",
    "workingDays": ["Monday", "Tuesday", "Wednesday"],
    "startTime": "10:00",
    "endTime": "18:00",
    "slotDuration": 30,
    "createdAt": "2026-04-26T10:30:00Z",
    "updatedAt": "2026-04-26T10:30:00Z"
  }
}
```

**Validation Rules:**
- All fields are required
- `workingDays` must be a non-empty array with valid day names
- Valid day names: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
- `slotDuration` must be a positive number

---

### Get All Doctors

**Endpoint:** `GET /api/doctors`

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Records per page (default: 10, max: 100)

**Request:**
```
GET /api/doctors?page=1&limit=10
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Retrieved 10 doctors from page 1",
  "data": [
    {
      "_id": "66294f5e2d8c3a1b4e8f9a2c",
      "name": "Dr. Sharma",
      "workingDays": ["Monday", "Tuesday", "Wednesday"],
      "startTime": "10:00",
      "endTime": "18:00",
      "slotDuration": 30,
      "createdAt": "2026-04-26T10:30:00Z",
      "updatedAt": "2026-04-26T10:30:00Z"
    }
    // ... more doctors
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

**Features:**
- Automatic pagination
- Comprehensive metadata (total, pages, current page)
- Max limit enforced at 100 records per page

---

### Get Available Slots

**Endpoint:** `GET /api/appointments/doctors/:id/slots`

**Query Parameters:**
- `date` (required) - Date in format YYYY-MM-DD

**Request:**
```
GET /api/appointments/doctors/66294f5e2d8c3a1b4e8f9a2c/slots?date=2026-04-28
```

**Response (Success):**
```json
{
  "success": true,
  "data": [
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00"
  ]
}
```

**Features:**
- Returns only available slots (booked slots filtered out)
- Checks if doctor works on that day
- Generates slots based on duration
- Respects doctor's working hours

---

### Book Appointment

**Endpoint:** `POST /api/appointments`

**Request Body:**
```json
{
  "doctorId": "66294f5e2d8c3a1b4e8f9a2c",
  "date": "2026-04-27",
  "time": "10:30",
  "userName": "Alok"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "_id": "66294f5e2d8c3a1b4e8f9a3d",
    "doctorId": "66294f5e2d8c3a1b4e8f9a2c",
    "date": "2026-04-27",
    "time": "10:30",
    "userName": "Alok",
    "status": "booked",
    "createdAt": "2026-04-26T11:00:00Z",
    "updatedAt": "2026-04-26T11:00:00Z"
  }
}
```

**Validation Rules:**
- All fields are required
- Cannot book past dates
- Doctor must exist
- Doctor must work on that day
- Time slot must be within doctor's working hours
- Cannot double book (unique constraint at DB level)

**Error Response (Double Booking):**
```json
{
  "success": false,
  "message": "Slot already booked for this time"
}
```

**Error Response (Past Date):**
```json
{
  "success": false,
  "message": "Cannot book past dates"
}
```

---

## Concurrency Handling

### Double Booking Prevention

To prevent double booking, a **unique compound index** is used on the Appointment model:

```javascript
{ doctorId: 1, date: 1, time: 1 }
```

### Why This Works:

1. **Database-Level Guarantee** - MongoDB enforces uniqueness at the database level, not application level
2. **Race Condition Safe** - Even with concurrent requests, only one can succeed
3. **Atomic Operation** - The write operation is atomic, preventing duplicates

### Example:

```
Request 1: Book 10:30 slot for Dr. Smith on 2026-04-27
Request 2: Book 10:30 slot for Dr. Smith on 2026-04-27 (concurrent)

Result: Request 1 succeeds, Request 2 fails with duplicate key error
```

---

## Slot Generation Logic

### Example:

```
Doctor Configuration:
- Start Time: 10:00
- End Time: 12:00
- Slot Duration: 30 minutes

Generated Slots:
10:00, 10:30, 11:00, 11:30
```

### Algorithm:

```javascript
function generateSlots(startTime, endTime, slotDuration) {
  const slots = [];
  let current = startTime;
  
  while (current < endTime) {
    slots.push(current);
    current = addMinutes(current, slotDuration);
  }
  
  return slots;
}
```

---

## Test Cases

### Success Cases
- Create multiple doctors
- Retrieve doctors with pagination
- Get available slots for a specific date
- Book valid appointment
- Same time slot for different doctors

### Error Cases
- Double booking prevented
- Invalid time slot rejected
- Non-working day blocked
- Past date booking blocked
- Missing required fields validation
- Invalid day names rejected
- Slot duration must be positive
- Pagination limit max 100

---

## Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/your-username/doctor-booking-system.git
cd doctor-booking-system
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- express
- mongoose
- dotenv
- joi
- jsonwebtoken
- bcryptjs

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_URI=mongodb+srv://username:password@cluster0.tk2gyl4.mongodb.net/doctor-booking?appName=Cluster0
PORT=5001
```

### 4. Run Server

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

**Output:**
```
Server running on port 5001
Database connected successfully
```

### 5. Test API Endpoints

Using Postman or cURL:

```bash
# Create a doctor
curl -X POST http://localhost:5001/api/doctors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Sharma",
    "workingDays": ["Monday", "Tuesday"],
    "startTime": "10:00",
    "endTime": "18:00",
    "slotDuration": 30
  }'

# Get all doctors
curl http://localhost:5001/api/doctors?page=1&limit=10

# Get available slots
curl http://localhost:5001/api/appointments/doctors/{doctorId}/slots?date=2026-04-27

# Book appointment
curl -X POST http://localhost:5001/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": "{doctorId}",
    "date": "2026-04-27",
    "time": "10:30",
    "userName": "Alok"
  }'
```

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.18.0 | Web framework |
| mongoose | ^7.0.0 | MongoDB ODM |
| dotenv | ^16.0.0 | Environment variables |
| joi | ^17.0.0 | Schema validation |
| jsonwebtoken | ^9.0.0 | JWT authentication |
| bcryptjs | ^2.4.0 | Password hashing |

---

## Scalability Considerations

### Current Design Supports:

1. Multiple Doctors - Each doctor has independent availability
2. Concurrent Bookings - Database handles race conditions
3. Pagination - Efficient data retrieval for large datasets
4. Time-based Slots - Configurable slot duration per doctor
5. Working Day Constraints - Doctor availability by day

### Recommendations for Scale:

- Add Redis caching for available slots
- Implement rate limiting
- Add API key authentication
- Use read replicas for reporting
- Archive old appointments to separate database

---

## Future Improvements

- Authentication - JWT-based user authentication
- Doctor Holidays - Doctor-specific holidays and leave management
- Reschedule/Cancel - Allow users to modify bookings
- Notifications - Email/SMS alerts for appointments
- Ratings & Reviews - Doctor ratings and patient feedback
- Analytics Dashboard - Doctor performance metrics
- Reminders - Automated reminder notifications
- Payment Integration - Online payment processing
- Mobile App - React Native/Flutter app support
- Multi-language Support - Support for multiple languages

---

## Error Handling

The system implements comprehensive error handling:

### Global Error Handler
```javascript
// Catches all application errors
app.use(errorHandler);
```

### Validation Middleware
```javascript
// Validates request payload
app.use(validate(schema));
```

### Common Error Responses:

| Status | Message | Cause |
|--------|---------|-------|
| 400 | All fields are required | Missing request fields |
| 400 | Cannot book past dates | Booking date is in the past |
| 404 | Doctor not found | Invalid doctor ID |
| 409 | Slot already booked | Double booking attempt |
| 500 | Internal server error | Unexpected error |

---

## File Descriptions

| File | Location | Purpose |
|------|----------|---------|
| `app.js` | Root | Express app configuration, middleware setup, and route mounting |
| `index.js` | Root | Server entry point that connects to database and starts listening |
| `src/models/` | src/ | Database schemas for Doctor and Appointment |
| `src/controllers/` | src/ | Request handlers that process incoming requests |
| `src/services/` | src/ | Business logic layer with data processing |
| `src/routes/` | src/ | API route definitions aggregated under `/api` prefix |
| `src/middlewares/` | src/ | Custom middleware for validation and error handling |
| `src/validators/` | src/ | Input validation schemas using Joi |
| `src/utils/` | src/ | Helper functions like slot generation |
| `src/config/` | src/ | Configuration files like database connection |

---

## Development Notes

This project focuses on:
- **Clean Architecture** - Separation of concerns with controllers, services, and models
- **Proper Validation** - Joi schemas for comprehensive input validation
- **Real-world Problems** - Handles concurrency, slot management, and availability constraints
- **Scalable Design** - Pagination, indexing, and database optimization
- **Error Handling** - Comprehensive error responses and validation

Perfect for learning backend best practices and building production-ready APIs.

---

## License

MIT License - feel free to use this project for learning and production purposes.

---

## Contributing

Feel free to fork this repository and submit pull requests for any improvements.

---

**Last Updated:** April 2026
