# RouteMate API Documentation

Base URL: `http://localhost:3000`

All protected endpoints require a Bearer token in the `Authorization` header:
```
Authorization: Bearer <access_token>
```

---

## Authentication

> The refresh token is stored as an **HttpOnly cookie** (`refresh_token`, 7-day expiry). You do not need to send it manually — the browser/client handles it automatically.

### POST /auth/register
Register a new user.

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+1234567890",
  "role": "USER" // USER | DRIVER | ADMIN
}
```

**Response** `201`
```json
{
  "accessToken": "<jwt_token>",
  "user": { "id": "uuid", "email": "user@example.com", "role": "USER" }
}
```
Sets `refresh_token` cookie.

---

### POST /auth/login
Login and receive an access token.

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** `200`
```json
{
  "accessToken": "<jwt_token>",
  "user": { "id": "uuid", "email": "user@example.com", "role": "USER" }
}
```
Sets `refresh_token` cookie.

---

### POST /auth/refresh
Rotate the refresh token and get a new access token.

> Reads `refresh_token` from cookie automatically. No request body needed.

**Response** `200`
```json
{
  "accessToken": "<new_jwt_token>",
  "user": { "id": "uuid", "email": "user@example.com", "role": "USER" }
}
```
Sets a new `refresh_token` cookie.

---

### POST /auth/logout
> Requires: `JWT`

Revoke the current refresh token and clear the cookie.

**Response** `200`
```json
{ "success": true }
```

---

## Users
> Requires: `JWT`

### POST /users
Create a new user.

> Requires role: `ADMIN`

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+1234567890",
  "role": "CUSTOMER"
}
```

**Response** `201` — Created user object.

---

### GET /users
Get all users.

**Response** `200` — Array of user objects.

---

### GET /users/:id
Get a single user by ID.

**Response** `200` — User object.

---

### PATCH /users/:id
Update a user.

**Request Body** — Any subset of user fields:
```json
{
  "name": "Jane Doe",
  "phone": "+9876543210"
}
```

**Response** `200` — Updated user object.

---

### DELETE /users/:id
Delete a user.

> Requires role: `ADMIN`

**Response** `200` — Deletion result.

---

## Drivers

### POST /driver
Register a new driver profile.

**Request Body**
```json
{
  "userId": "cuid_here",
  "licenseNo": "DL123456",
  "vehiclePlate": "ABC-1234",
  "isOnline": false,
  "locationLat": 27.7172,
  "locationLng": 85.3240
}
```

**Response** `201` — Created driver object.

---

### GET /driver
Get all drivers.

**Response** `200` — Array of driver objects.

---

### GET /driver/:id
Get a single driver by ID.

**Response** `200` — Driver object.

---

### GET /driver/nearby
Find drivers near a location.

**Query Parameters**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| lat | number | Yes | Latitude |
| lng | number | Yes | Longitude |
| radius | number | No | Search radius in km |

**Response** `200` — Array of nearby driver objects.

---

### PATCH /driver/:id/location
Update driver's current location.

**Request Body**
```json
{
  "lat": 27.7172,
  "lng": 85.3240
}
```

**Response** `200` — Updated driver object.

---

### PATCH /driver/:id/status
Update driver's online status.

**Request Body**
```json
{
  "isOnline": true
}
```

**Response** `200` — Updated driver object.

---

## Orders
> Requires: `JWT`

### POST /orders
Create a new order.

**Request Body**
```json
{
  "userId": "cuid_here",
  "pickupLat": 27.7172,
  "pickupLng": 85.3240,
  "dropLat": 27.7000,
  "dropLng": 85.3100,
  "fare": 250.00
}
```

**Response** `201` — Created order object.

---

### GET /orders
Get all orders.

**Response** `200` — Array of order objects.

---

### GET /orders/:id
Get a single order by ID.

**Response** `200` — Order object.

---

### PATCH /orders/:id
Update order status.

**Request Body**
```json
{
  "status": "ACCEPTED", // PENDING | ACCEPTED | IN_PROGRESS | COMPLETED | CANCELLED
  "driverId": "cuid_here"
}
```

**Response** `200` — Updated order object.

---

### DELETE /orders/:id
Delete an order.

**Response** `200` — Deletion result.

---

## Dispatch
> Requires: `JWT`

### GET /dispatch/:orderId
Dispatch an order to available drivers.

**Response** `200`
```json
{
  "status": "dispatching",
  "orderId": "cuid_here"
}
```

---

### Event: `order.dispatch` (Microservice)
Microservice message pattern to trigger order dispatch.

**Payload**
```json
{
  "orderId": "cuid_here",
  "pickup": {
    "lat": 27.7172,
    "lng": 85.3240
  }
}
```

---

### Event: `driver.match` (Microservice)
Microservice message pattern when a driver is matched to an order.

**Payload**
```json
{
  "orderId": "cuid_here",
  "driverId": "cuid_here"
}
```

---

## Earnings

### POST /earnings
Record a new earning entry.

**Request Body**
```json
{
  "driverId": "cuid_here",
  "orderId": "cuid_here",
  "amount": 250.00
}
```

**Response** `201` — Created earning object.

---

### GET /earnings/driver/:driverId
Get all earnings for a driver.

**Response** `200` — Array of earning objects.

---

### GET /earnings/driver/:driverId/total
Get total earnings for a driver.

**Response** `200`
```json
{
  "total": 5000.00
}
```

---

### GET /earnings/:id
Get a single earning record by ID.

**Response** `200` — Earning object.

---

## Chat (WebSocket Gateway)

The chat module uses WebSocket (Socket.IO). Connect to the server and emit the following events.

### Event: `sendMessage`
Send a message to a chat room.

**Payload**
```json
{
  "roomId": "order_cuid_here",
  "content": "I'm on my way!"
}
```

### Event: `joinRoom`
Join a chat room to receive messages.

**Payload**
```json
{
  "roomId": "order_cuid_here"
}
```

---

## Error Responses

All endpoints return standard HTTP error shapes:

```json
{
  "statusCode": 400,
  "message": ["field must not be empty"],
  "error": "Bad Request"
}
```

| Code | Meaning |
|------|---------|
| 400 | Bad Request — validation failed |
| 401 | Unauthorized — missing or invalid JWT |
| 403 | Forbidden — insufficient role |
| 404 | Not Found |
| 500 | Internal Server Error |
