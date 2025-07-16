# Gemini-Style AI Chat App

A modern, responsive chat application inspired by conversational AI interfaces like Gemini. This app supports OTP-based authentication, multi-chatroom management, real-time messaging UI, and sleek dark/light theming using ShadCN and Tailwind CSS.

---

## 📁 Project Structure

```plaintext
src/
├── assets/
├── components/
│   ├── ui/                      # ShadCN-based UI components (Button, Dialog, etc.)
│   ├── loadingSkeleton.jsx
│   ├── Login.jsx
│   ├── OTP.jsx
│   ├── ProtectedRoute.jsx
├── contexts/
│   └── themeContext.jsx
├── lib/
│   └── utils.js
├── pages/
│   ├── AuthPage.jsx
│   ├── Chatroom.jsx
│   └── Dashboard.jsx
├── redux/
│   ├── authSlice.js
│   └── store.js
├── utils/
│   ├── debounce.js
│   ├── mockData.js
│   ├── storage.js
│   └── title-generator.js
├── App.css
├── App.jsx
├── index.css
├── main.jsx
├── .gitignore
├── components.json
├── eslint.config.js
└── icon.svg
```

---

## 🚀 Features

- **OTP-based login** using phone number verification for quick, secure access.
- **Chatroom management**: create, delete, pin chatrooms across sessions (per-user storage).
- **Debounce** Optimized search with debounce to delay processing until user input stabilizes, reducing request load.
- **Zod + React Hook Form** based form validation for robust input handling.
- **Dark/light mode toggle** powered by ShadCN + Tailwind.
- **Mobile responsive sidebar** behavior with adaptive layout for desktop vs. mobile.
- **Redux Toolkit** state management scoped per user.
- **Toast notifications** for instant feedback using `react-hot-toast`.

---

## ⚙️ Installation

1. **Clone the repository:**

```bash
git clone <repo-url>
cd <repo-folder>
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start the development server:**

```bash
npm run dev
```

App will be available at: [http://localhost:5173](http://localhost:5173)

---

## 💡 Implementation Details

### 🔄 Debounce

- Implemented in `utils/debounce.js` using custom debounce hook.

### ✅ Form Validation

- Zod schema-based validation integrated with `react-hook-form` in OTP and login flows.
- Ensures all fields meet strict format (e.g., 6-digit OTP).

### 🔐 Protected Routing

- `ProtectedRoute.jsx` restricts routes unless `isAuthenticated` is `true` in Redux.
- Redirects unauthorized users to Auth page.

---

## 🧩 Tech Stack

- **React 19**
- **Redux Toolkit**
- **React Router DOM 7**
- **ShadCN UI**
- **Tailwind CSS 4**
- **Zod + React Hook Form**
- **React Hot Toast**
- **Axios**
- **Lucide Icons**
- **Vite**

---

## 📸 Screenshots

### 🟢 Login Page

![Login Page](public/Screenshots/Screenshot2.png)

### 🟢 Verify OTP

![Verify OTP](public/Screenshots/Screenshot3.png)

### 🟢 Dashboard & Chatroom Interface

![Dashboard & Chatroom Interface](public/Screenshots/Screenshot1.png)

---

## 🔮 Future Improvements

- Add backend integration for real OTP and chat persistence.
- Migrate to TypeScript for type safety.
- Add Jest + React Testing Library for test coverage.
- WebSocket-based real-time messaging.
- Avatar/image support in messages.
- Drag and drop file sharing.
