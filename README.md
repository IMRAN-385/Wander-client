# 🌍 Wanderlust – Travel Discovery Platform

A modern travel discovery platform that helps users explore breathtaking destinations, discover unique travel experiences, and manage their favorite trips. Built with a clean, responsive UI and secure full-stack architecture using Next.js, TypeScript, Express.js, MongoDB, and JWT Authentication.

## 🌐 Live URL

https://wander-client-gilt.vercel.app/

## 🚀 Backend API

https://wander-server.onrender.com

## 📌 Purpose

Wanderlust is designed to simplify travel exploration by allowing users to browse destinations, search and filter travel packages, view detailed information, and manage travel listings through a secure dashboard. The platform focuses on delivering a fast, interactive, and visually appealing user experience.

## ✨ Key Features

- 🔐 JWT Authentication & Authorization
- 👤 Secure Login & Registration
- 🌍 Explore Popular Travel Destinations
- 🔍 Search, Filter, Sort & Pagination
- ❤️ Save & Manage Favorite Destinations
- 📄 Detailed Destination Information
- ➕ Add New Destination (Protected)
- 🗂️ Manage Personal Listings
- ⚡ Beautiful Framer Motion Animations
- 🎨 Modern UI with Tailwind CSS
- 💀 Skeleton Loaders
- 🍞 Toast Notifications
- 📱 Fully Responsive Design
- 🚫 Custom 404 Page

## 🛠️ NPM Packages Used

| Package | Purpose |
|---|---|
| `next` | React Framework |
| `react` | UI Library |
| `typescript` | Type Safety |
| `tailwindcss` | Utility-first CSS |
| `framer-motion` | Smooth Animations |
| `axios` | API Requests |
| `react-hook-form` | Form Handling |
| `zod` | Form Validation |
| `react-hot-toast` | Notifications |
| `lucide-react` | Icons |
| `recharts` | Analytics & Charts |

## 🔑 Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

### Production (Vercel)

```env
NEXT_PUBLIC_API_URL=https://wander-server.onrender.com/api
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

## 🚀 Getting Started

```bash
npm install

npm run dev
```

## 📁 Project Structure

```text
src/
│
├── app/
├── components/
├── hooks/
├── lib/
├── providers/
├── services/
├── types/
├── utils/
└── assets/
```

## 👨‍💻 Author

**Imran Kabir**

GitHub: https://github.com/IMRAN-385
