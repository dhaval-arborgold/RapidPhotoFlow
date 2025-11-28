# RapidPhotoFlow Backend

A lightweight Node.js/Express backend for photo upload, processing, and review workflow with JSON file-based storage.

## Features

- ✅ Multi-photo concurrent uploads
- ✅ Async processing simulation with status tracking
- ✅ Complete workflow event logging
- ✅ RESTful API
- ✅ JSON file-based database
- ✅ CORS enabled for frontend integration
- ✅ File validation and error handling

## Quick Start

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Run Production Server

```bash
npm start
```

The server will start on `http://localhost:3001`

## Project Structure

```
rapidphotoflow-backend/
├── server.js          # Main application file
├── package.json       # Dependencies
├── database.json      # JSON database (auto-created)
├── uploads/           # Uploaded photos directory (auto-created)
└── README.md          # Documentation
```

## API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### 1. Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-28T10:30:00.000Z"
}
```

---

#### 2. Upload Photos
```http
POST /api/photos/upload
Content-Type: multipart/form-data
```

**Request Body:**
- `photos`: File[] (max 10 files, 10MB each)

**Response:**
```json
{
  "message": "Photos uploaded successfully",
  "photos": [
    {
      "id": "uuid-1234",
      "filename": "uuid-filename.jpg",
      "originalName": "photo.jpg",
      "url": "/uploads/uuid-filename.jpg",
      "size": 2048576,
      "mimetype": "image/jpeg",
      "status": "pending",
      "createdAt": "2025-01-28T10:30:00.000Z",
      "updatedAt": "2025-01-28T10:30:00.000Z"
    }
  ]
}
```

---

#### 3. Get All Photos
```http
GET /api/photos
GET /api/photos?status=completed
```

**Query Parameters:**
- `status` (optional): Filter by status (pending, processing, completed, failed)

**Response:**
```json
{
  "photos": [...],
  "total": 10
}
```

---

#### 4. Get Single Photo
```http
GET /api/photos/:id
```

**Response:**
```json
{
  "id": "uuid-1234",
  "filename": "uuid-filename.jpg",
  "originalName": "photo.jpg",
  "url": "/uploads/uuid-filename.jpg",
  "status": "completed",
  "processedUrl": "/uploads/uuid-filename.jpg",
  "metadata": {
    "dimensions": "1920x1080",
    "size": "2.45 MB",
    "format": "JPG"
  },
  "createdAt": "2025-01-28T10:30:00.000Z",
  "updatedAt": "2025-01-28T10:32:00.000Z"
}
```

---

#### 5. Update Photo Status
```http
PATCH /api/photos/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "completed"
}
```

**Valid Statuses:** `pending`, `processing`, `completed`, `failed`

**Response:**
```json
{
  "id": "uuid-1234",
  "status": "completed",
  ...
}
```

---

#### 6. Delete Photo
```http
DELETE /api/photos/:id
```

**Response:**
```json
{
  "message": "Photo deleted successfully"
}
```

---

#### 7. Get Events (Workflow Log)
```http
GET /api/events
GET /api/events?photoId=uuid-1234
GET /api/events?limit=50
```

**Query Parameters:**
- `photoId` (optional): Filter events by photo ID
- `limit` (optional): Limit number of results (default: 100)

**Response:**
```json
{
  "events": [
    {
      "id": "event-uuid",
      "photoId": "photo-uuid",
      "event": "photo_uploaded",
      "details": {
        "filename": "photo.jpg",
        "size": 2048576
      },
      "timestamp": "2025-01-28T10:30:00.000Z"
    }
  ],
  "total": 5
}
```

**Event Types:**
- `photo_uploaded`
- `processing_started`
- `processing_completed`
- `processing_failed`
- `status_updated`
- `photo_deleted`

---

#### 8. Get Statistics
```http
GET /api/stats
```

**Response:**
```json
{
  "total": 100,
  "pending": 5,
  "processing": 10,
  "completed": 80,
  "failed": 5,
  "totalEvents": 450
}
```

---

#### 9. Reset All Data (Testing)
```http
POST /api/reset
```

**Response:**
```json
{
  "message": "All data cleared successfully"
}
```

---

## Photo Processing Flow

1. **Upload**: Photo uploaded with status `pending`
2. **Auto-Processing**: Server automatically starts processing (2-5 seconds)
3. **Processing**: Status changes to `processing`
4. **Completion**: Status changes to either:
   - `completed` (90% success rate) - includes metadata
   - `failed` (10% failure rate) - includes error message

## Database Schema

### database.json
```json
{
  "photos": [
    {
      "id": "string",
      "filename": "string",
      "originalName": "string",
      "url": "string",
      "size": "number",
      "mimetype": "string",
      "status": "pending|processing|completed|failed",
      "processedUrl": "string?",
      "metadata": {
        "dimensions": "string",
        "size": "string",
        "format": "string"
      },
      "error": "string?",
      "createdAt": "ISO-8601",
      "updatedAt": "ISO-8601"
    }
  ],
  "events": [
    {
      "id": "string",
      "photoId": "string",
      "event": "string",
      "details": "object",
      "timestamp": "ISO-8601"
    }
  ]
}
```

## Testing with cURL

### Upload a photo:
```bash
curl -X POST http://localhost:3001/api/photos/upload \
  -F "photos=@/path/to/photo.jpg"
```

### Get all photos:
```bash
curl http://localhost:3001/api/photos
```

### Get statistics:
```bash
curl http://localhost:3001/api/stats
```

### Get workflow events:
```bash
curl http://localhost:3001/api/events
```

## Testing with Postman

1. Import the following endpoints into Postman
2. For file upload, use form-data with key `photos` and select files
3. Set Content-Type to `multipart/form-data` for uploads

## Configuration

- **Port**: Set via `PORT` environment variable (default: 3001)
- **Upload Limit**: 10MB per file (configurable in server.js)
- **Max Files**: 10 files per upload (configurable in server.js)
- **Allowed Types**: JPEG, JPG, PNG, GIF, WEBP

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error

Error responses:
```json
{
  "error": "Error message description"
}
```

## Frontend Integration

CORS is enabled for all origins. To connect your React frontend:

```javascript
const API_URL = 'http://localhost:3001/api';

// Upload photos
const formData = new FormData();
files.forEach(file => formData.append('photos', file));

const response = await fetch(`${API_URL}/photos/upload`, {
  method: 'POST',
  body: formData
});

// Get photos
const photos = await fetch(`${API_URL}/photos`).then(r => r.json());

// Get events
const events = await fetch(`${API_URL}/events`).then(r => r.json());
```

## Production Considerations

For production deployment, consider:

1. Replace JSON file storage with a real database (MongoDB, PostgreSQL)
2. Add authentication/authorization
3. Implement rate limiting
4. Add input validation and sanitization
5. Use cloud storage for uploaded files (S3, Cloudinary)
6. Add logging (Winston, Morgan)
7. Implement proper error monitoring
8. Add automated tests
9. Use environment variables for configuration
10. Set up proper CORS whitelist

## License

MIT