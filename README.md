# 🏨 EasyHostal

**EasyHostal** is a modern hostel and small accommodation management platform designed with simplicity, performance, and accessibility in mind. This project isn't just a digital product — it's a mission-driven solution.

### 🎯 Mission

In many regions, small hostel owners, family-run accommodations, and independent managers face overwhelming challenges in accessing modern digital tools — often due to complexity, cost, or lack of technical resources. **EasyHostal** was born to change that.

> 💡 **I believe technology should empower — not overwhelm.**  
> That's why I’ve built EasyHostal to bring professional-grade digital infrastructure to those who need it most — **affordably, accessibly, and beautifully**.

Whether you're running a 5-room rural hostel or a boutique stay downtown, **EasyHostal helps you digitize your operations** effortlessly. With clean design, intuitive navigation, and robust features, it gives power back to the managers.

## ⚡ Why EasyHostal?

- 💻 **User-first design** — no tech experience required
- 🌐 **Multi-language support** — inclusivity from day one
- 📱 **Responsive, mobile-ready** — works anywhere
- 🛠️ **Modular and scalable** — built for growth
- ❤️ **Driven by real-world needs**, not enterprise bloat

## 🧠 Philosophy

> Empowering digital transformation for those who’ve been left out.

This project aims to democratize access to modern tools — to **close the gap between high-cost hotel software and real-world hostels** who can’t afford or don’t need overengineered enterprise tools.

## ✨ Features

- 🔐 **Authentication** with protected routes
- 📊 **Dashboard Overview** with dynamic data
- 🛏️ **Room Management** with creation and editing
- 📅 **Reservation System** (overview, check-ins)
- 👥 **User & Staff Management**
- 💸 **Finance/Wage Tracking** per employee
- 📢 **Announcements System**
- 🌗 **Dark & Light Themes**
- 🌐 **i18n Translation Support** (via `react-i18next`)
- 📱 **Responsive Design**
- 🧩 **Modular UI Components**

## 🧰 Tech Stack

| Frontend   | Tools |
|------------|-------|
| React (w/ TypeScript) | ⚛️ |
| TailwindCSS | 🎨 |
| React Router DOM | 🔁 |
| React Icons & Lucide | 🎯 |
| React-i18next | 🌍 |
| Axios or Fetch for APIs | 🔌 |

## 📁 Project Structure

```
src/
├── api/ # API logic (userApi, wageApi, etc.)
├── components/ # Shared UI components
│ ├── auth/ # Login, ProtectedRoute, Context
│ ├── forms/ # Creation forms
│ └── ui/ # UI elements (Header, Modal, NotFound)
├── assets/ # Images, icons, logos
├── pages/ # Main pages (Dashboard, Rooms, Finances...)
├── i18n/ # Translation setup and language files
└── App.tsx # Routing and layout wrapper
```

## 🌍 Internationalization (i18n)

EasyHostal uses `react-i18next`. To add new translations:

1. Navigate to `src/i18n/locales/`
2. Add or update `translation.json` for your language
3. Use `t("your.translation.key")` in components

## 🖼️ Logo & Branding

Logo files:
- `assets/logo-light.png` for light mode
- `assets/logo-dark.png` for dark mode

Use `<img src={isDarkMode ? logoDark : logoLight} />` logic for dynamic switching.

## 🚀 Getting Started

### 1. Clone the repo
```
git clone https://github.com/your-username/easyhostal.git
cd easyhostal
```
### 2. Install dependencies
```
npm install
```
### 3. Run the dev server
```
npm run dev
```
###  4. (Optional) Build for production
```
npm run build
```

## 👨‍💻 Author

Made with ❤️ and a lot of coffee by [Jesús Ortiz](https://github.com/ortizzxz)  
> *"I’m building tools that make tech accessible — starting with EasyHostal."*
