Here is a clean, professional **README.md** for your **frontend** project:

---

# **RapidPhotoFlow – Frontend**

A modern React + TypeScript UI for the RapidPhotoFlow system.
Supports photo upload, simulated processing status, review screens, and event logging.
Built using **Vite**, **React**, and a minimal clean component-based architecture.

---

## 📁 **Project Structure**

```
frontend/
│
├── public/
│   └── vite.svg
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── UploadScreen.tsx
│   │   ├── ProcessingScreen.tsx
│   │   ├── ReviewScreen.tsx
│   │   ├── StatusBadge.tsx
│   │   └── EventLogPanel.tsx
│   │
│   ├── services/
│   │   └── api.ts
│   │
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   ├── types.ts
│   └── main.tsx
│
├── types.ts
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
│
└── README.md
```

---

## 🚀 **Features**

* 📤 **Photo Upload Screen**
  Upload multiple photos with progress + preview.

* ⚙️ **Processing Queue Screen**
  Displays simulated async statuses (queued → processing → completed).

* 🖼️ **Review Screen**
  View processed photos with final metadata.

* 📝 **Event Log Panel**
  Shows a live, chronological workflow log.

* 🧩 **Modular Components**
  Reusable architecture for UI + API integration.

* ⚡ **Fast Development With Vite**
  Instant HMR and optimized builds.

---

## 📦 **Installation**

```bash
npm install
```

---

## ▶️ **Run Development Server**

```bash
npm run dev
```

Starts Vite dev server at:

```
http://localhost:5173
```

---

## 🏗️ **Build for Production**

```bash
npm run build
```

---

## 🌐 **API Configuration**

The API endpoints are defined inside:

```
src/services/api.ts
```

Update the base URL if your backend runs on a different port:

```ts
export const API_BASE = "http://localhost:3000";
```

---

## 🧱 **Tech Stack**

* React 18
* TypeScript
* Vite
* Fetch API
* CSS Modules / Custom CSS

---

## 🎨 **UI Components**

| Component              | Purpose                       |
| ---------------------- | ----------------------------- |
| `UploadScreen.tsx`     | Photo selection & upload      |
| `ProcessingScreen.tsx` | Displays jobs + statuses      |
| `ReviewScreen.tsx`     | Shows processed image results |
| `StatusBadge.tsx`      | Reusable status indicator     |
| `EventLogPanel.tsx`    | Event/activity feed           |
| `Header.tsx`           | Top navigation                |

---

## 📄 **License**

MIT License

---