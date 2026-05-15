# 🏛️ Histora

Histora is an immersive and interactive web application dedicated to preserving and showcasing Tunisian cultural heritage, specifically from the Sahel region and the Kobba Museum in Sousse.

The application acts as a **virtual museum experience**, allowing users to explore historical life through themed rooms and interactive content.

---

## 📝 Project Description

Histora offers an immersive journey through different aspects of traditional Tunisian life:

- **The Souk (Market)**  
  Discover traditional professions such as goldsmiths, barbers, and public scribes.

- **Domestic Life**  
  Experience wedding preparations (Zhaz, Henna), traditional cooking, and historical living rooms.

- **Crafts & Industry**  
  Learn about traditional weaving and olive oil extraction processes.

The application is **multilingual (Arabic, French, English)** and includes a **secure access system**, where some sections are locked behind passwords obtained during a real museum visit. This creates a bridge between physical heritage and digital exploration.

---

## 🚀 Technologies Used

### 🔹 Frontend & UI
- **React 19** – Core framework for building a modular and reactive UI
- **React Router DOM** – Client-side routing and navigation
- **Framer Motion** – Smooth animations and micro-interactions
- **Vanilla CSS** – Custom styling for a unique visual identity

### 🔹 3D & Multimedia
- **Three.js / @react-three/fiber / @react-three/drei** – 3D visualization of historical objects (STL models)
- **Cloudinary** – Image and video storage, optimization, and delivery

### 🔹 Backend & Automation
- **Supabase** – Database management and analytics tracking
- **Node.js** – Backend scripts for data automation (e.g. `generateRoomsData.js`)
- **Nodemailer** – Automated email reporting system
- **GitHub Actions** – CI/CD pipelines and scheduled tasks

### 🔹 Security & Environment
- **dotenv** – Secure environment variable management
- **Auth Utils (custom)** – Session handling with short-lived access control (1 minute expiration)

---

## 📌 Summary

Histora combines modern web technologies with cultural preservation.  
It merges **3D visualization, automation, and multilingual UX** to create a digital museum experience that connects physical heritage with the digital world.

---