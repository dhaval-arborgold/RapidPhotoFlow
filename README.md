Here is a clean **general main-folder README.md** that explains the whole project (backend + frontend + diagram + start script).
You can place this at the root folder.

---

# **RapidPhotoFlow – Full Project**

A complete **upload → process → review** photo workflow system built with:

* **Backend:** Node.js + Express
* **Frontend:** React + TypeScript (Vite)
* **Processing:** Simulated async workflow
* **Extras:** Architecture diagram + start helpers

This project demonstrates a clean micro-app approach: simple, fast, and fully AI-generated.

---

## 📁 **Project Structure**

```
root/
│
├── backend/          # Node.js API server
├── frontend/         # React + Vite UI
│
├── diagram.png        # System architecture diagram
├── start-dev.ps1      # Script to start backend+frontend together (optional)
│
└── README.md          # Main project documentation
```

---

## 🚀 **Features**

### 🔧 Backend (Node.js + Express)

* Photo upload (Multer)
* Simulated async processing queue
* Status updates (queued → processing → completed)
* Event logging
* Basic local JSON database
* Clean REST API

### 🎨 Frontend (React + TypeScript)

* Photo upload UI
* Processing queue visualization
* Review page for completed photos
* Live event log
* Modular component-based design

### 📊 Diagram

A PNG diagram visualizing:

* Upload flow
* Processing pipeline
* Frontend ↔ Backend interaction
* Event log path

---

## 📦 **Installation**

First install backend + frontend dependencies:

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd ../frontend
npm install
```

---

## ▶️ **Run Development Mode**

### Option 1 — Run Manually

**Backend**

```bash
cd backend
npm run dev
```

**Frontend**

```bash
cd frontend
npm run dev
```

### Option 2 — Use the `start-dev` Script (Windows PowerShell)

From the root:

```bash
./start-dev.ps1
```

This runs backend + frontend together.

---

## 🏗️ **Build for Production**

```bash
cd frontend
npm run build
```

The output will appear inside:

```
frontend/dist/
```

You can serve it using any static server or integrate with the backend.

---

## 🌐 **API Base URL**

Default backend URL:

```
http://localhost:3000
```

Update it inside:

```
frontend/src/services/api.ts
```

---

## 📄 **Individual Documentation**

* **Backend README:** `/backend/README.md`
* **Frontend README:** `/frontend/README.md`
* **Diagram:** `/diagram.png`

---

## 📜 **License**

MIT License

---