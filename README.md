# CampusFlow

## 📌 Overview

CampusFlow is a full-stack multi-platform social media application designed for content sharing, user interaction, and real-time communication. The platform allows users to publish articles on different topics, interact through likes and comments, follow other users, and communicate instantly using a real-time chat system.

The application is available on both web and mobile platforms and combines content publishing, social networking, and messaging into a single unified system.

---

# ✨ Main Features

## 👤 User Features

* User registration and authentication
* Create, edit, and publish articles
* Upload images, videos, and audio files
* Like and comment on articles
* Follow and unfollow users
* Real-time private messaging
* Notifications system
* User profile management
* Save/bookmark articles

---

## 🛠️ Admin Features

* Manage users
* Manage article categories
* Moderate content
* View platform statistics

---

# 🧱 System Architecture

CampusFlow is built using a layered architecture composed of four main parts:

### 🔹 Backend API

Built with Laravel and responsible for:

* Authentication
* Business logic
* Database management
* API endpoints

### 🔹 Web Application

Built with React and provides:

* Responsive user interface
* Article browsing and interaction
* Real-time communication

### 🔹 Mobile Application

Built with React Native and Expo:

* Android & iOS support
* Shared backend with web application
* Mobile-friendly user experience

### 🔹 Real-Time Server

Built with Node.js and WebSocket:

* Instant messaging
* Live notifications
* Persistent real-time communication

---

# 💻 Technologies Used

## Backend

* Laravel 12
* PHP 8.2
* Laravel Sanctum
* Eloquent ORM
* SQLite / MySQL

## Frontend

* React
* React Router
* Axios
* Tailwind CSS
* GSAP
* Vite

## Mobile

* React Native
* Expo
* React Navigation
* AsyncStorage

## Real-Time Communication

* Node.js
* Express
* WebSocket (`ws`)

## Development Tools

* VS Code
* Git & GitHub
* Postman
* Composer
* npm

---

# 📂 Project Structure

```bash
campusflow2/
├── backend/              # Laravel API
├── frontend/             # React web application
├── mobile/               # React Native mobile application
├── backend-socket/       # Node.js WebSocket server
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/CampusFlow.git
cd CampusFlow
```

---

# 🔧 Backend Setup

```bash
cd backend

composer install

cp .env.example .env

php artisan key:generate

php artisan migrate

php artisan serve
```

---

# 🌐 Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# 📱 Mobile Setup

```bash
cd mobile

npm install

npx expo start
```

---

# ⚡ WebSocket Server Setup

```bash
cd backend-socket

npm install

node server.js
```

---

# 🔐 Authentication

CampusFlow uses Laravel Sanctum token authentication.

Protected routes require:

```http
Authorization: Bearer YOUR_TOKEN
```

---

# 📸 Application Interfaces

The system includes:

* Login & Registration pages
* Home feed
* Article details page
* User profiles
* Real-time chat
* Notifications page
* Admin dashboard
* Mobile application interfaces

---

# 🚀 Future Improvements

* Push notifications
* Search functionality
* Dark mode
* Community/groups feature
* Enhanced mobile experience
* Rich text editor

---

# 👨‍💻 Author

**CHAHID El Mostafa**
Final Year Project — IADT-DUT
Mohammed VI Polytechnic University (UM6P)

---

# 👨‍🏫 Supervisor

**Pr. El Yazidi Moulay Hafid**

---

# 📄 License

This project was developed for academic and educational purposes.

