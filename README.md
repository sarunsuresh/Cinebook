# 🍿 CineBook: Premium Movie Booking Experience

**CineBook** is a high-fidelity MERN-stack application that bridges AI-driven design with robust, handmade systems engineering. Featuring a cinematic dark-mode UI and a simulated real-time payment gateway, it provides a seamless end-to-end journey from seat selection to PDF ticket generation.

---

## 🛠️ The Hybrid Build Philosophy

This project serves as a case study in **AI-Augmented Development**:

* **Frontend (Architected by Gemini):** The cinematic interface, responsive layouts, and fluid Tailwind animations were architected using **Google AI Studio** and **Gemini**. This allowed for rapid prototyping of a premium user experience.
* **Backend (Handcrafted):** Every line of the server-side logic was **manually coded** in Node.js/Express. This ensures absolute reliability for critical systems like the seat-locking algorithm, JWT authentication, and the simulated bank gateway verification sequence.

---

## 🚀 Key Features

* **Interactive Seat Mapping:** Real-time seat selection with backend-enforced locking logic to prevent double bookings.
* **Simulated Payment Gateway:** A 20-second, multi-stage verification sequence (Idle ➔ Verifying ➔ Success) that mimics real-world banking API behavior.
* **Dynamic TMDB Integration:** Fetches high-quality movie metadata and posters dynamically via The Movie Database API.
* **Digital Pass Generation:** Automated QR code generation and PDF download functionality using `jsPDF` and `html2canvas`.
* **Security:** Protected routes and secure session management using JSON Web Tokens (JWT).



---

## 📦 Tech Stack

### Frontend
* **React 18** (Functional Components & Hooks)
* **Tailwind CSS** (Styling & Framer-like Animations)
* **Axios** (API Communication)
* **QR-Code.React** (Connect-to-LinkedIn QR)

### Backend
* **Node.js & Express** (RESTful API Design)
* **MongoDB & Mongoose** (Schema Modeling & Persistence)
* **JWT** (Secure Authentication)

### AI & Tools
* **Google AI Studio & Gemini** (UI/UX Architecture)
* **TMDB API** (Movie Metadata)



---

## 🏁 Getting Started

### Prerequisites
* Node.js installed
* MongoDB Atlas account
* TMDB API Key

### Installation
1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/cinebook.git](https://github.com/your-username/cinebook.git)
   cd cinebook