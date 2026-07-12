# 🎨 Personal Portfolio Website

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Hosting](https://img.shields.io/badge/Hosting-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://www.netlify.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

A professional, modern, and fully responsive personal portfolio website designed to showcase developer skills, GitHub projects, and career progression. This project demonstrates highly customized styling, user-centric UX/UI flow, glassmorphic layout components, and performance-optimized static asset loadouts.

---

<p align="center">
  <img src="assets/banner.png" alt="Portfolio Website Banner" width="100%">
</p>

---

## 🗺️ Navigation Index

1. [🔗 Live Demo](#-live-demo)
2. [✨ Core Features](#-core-features)
3. [🖥️ Selected Projects Showcase](#️-selected-projects-showcase)
4. [🏗️ Client-Side Architecture](#-client-side-architecture)
5. [🖥️ Folder Structure](#-folder-structure)
6. [⚙️ How to Setup & Run Locally](#-how-to-setup--run-locally)
7. [📬 Contact & Socials](#-contact)

---

## 🔗 Live Demo

Visit the interactive site live:  
👉 **[muhammadasadarshadportfolio.netlify.app](https://muhammadasadarshadportfolio.netlify.app/)**

---

## ✨ Core Features

- **📱 Fully Responsive Layout:** Pixels scale fluidly across desktop, tablet, and mobile displays using raw CSS flexbox/grid.
- **🏝️ Dynamic Island Navigation:** A smooth header bar utilizing CSS transitions for an interactive navigation aesthetic.
- **📂 Git Project Showcase:** Highlight cards showing active repositories and key project statistics.
- **📈 Visual Timeline:** An interactive timeline card mapping career highlights and skills.
- **📄 Resume Integration:** Separate clean viewer page (`resume.html`) with options to instantly download a professional PDF copy.
- **⚡ Micro-Animations:** Lightweight hover transitions, parallax card depths, and smooth-scrolling event listener intercepts.

---

## 🖥️ Selected Projects Showcase

Here is a curated list of featured projects showcasing different domain areas:

### 1. FoodHeaven POS (Featured)
*A native restaurant point-of-sale system with live order tracking, analytics, printable invoices, and a PostgreSQL-backed Django architecture.*
* **Technologies:** Python, Django REST, PostgreSQL, Chart.js
* **Repo Link:** [Restaurant-POS-system](https://github.com/asad594/Restaurant-POS-system)
* **Screenshot:**
  ![FoodHeaven POS](images/restaurant-pos.png)

---

### 2. Algo Puzzle Board
*An interactive home for sorting, pathfinding, graph algorithms, and classic puzzles with step-by-step visual learning.*
* **Technologies:** JavaScript, Algorithms, CSS
* **Repo Link:** [Algo-Puzzle-Board](https://github.com/asad594/Algo-Puzzle-Board)
* **Screenshot:**
  ![Algo Puzzle Board](images/algo-puzzle.png)

---

### 3. SkillMesh (Job Ranking)
*A smart candidate ranking engine using skill matching, experience scores, greedy optimisation, and an explainable max-heap flow.*
* **Technologies:** Python, DSA, OOP
* **Repo Link:** [Job-Ranking-System](https://github.com/asad594/Job-Ranking-System)
* **Screenshot:**
  ![SkillMesh](images/job-ranking.png)

---

### 4. MIPS Productivity Dashboard
*A task manager built in MIPS Assembly, with task tracking, calendar views, and direct memory-status updates.*
* **Technologies:** MIPS Assembly, Architecture
* **Repo Link:** [Productivity-Dashboard-MIPS-assembly-Language](https://github.com/asad594/Productivity-Dashboard-MIPS-assembly-Language)
* **Screenshot:**
  ![MIPS Productivity Dashboard](images/mips-dashboard.png)

---

### 5. SkyBound (Flight Management System)
*A flight management system designed around MVC-style organisation and reusable domain logic.*
* **Technologies:** Python, MVC, OOP
* **Repo Link:** [Flight-Management-System](https://github.com/asad594/Flight-Management-System)
* **Screenshot:**
  ![SkyBound](images/flight-system.png)

---

### 💡 Additional Projects
* **Requirement Genie:** An NLP-driven assistant that structures software requirement gathering and helps generate SRS documentation. *(Python, NLP, Streamlit)* - [Repo Link](https://github.com/asad594/Requirement-Genie)
  ![Requirement Genie](images/req-genie.png)
* **Decode & Discover:** A story-led cryptography learning tool that turns encryption and decryption concepts into interactive visual modules. *(JavaScript, Cryptography, CSS)* - [Repo Link](https://github.com/asad594/Decode-And-Discover)
  ![Decode & Discover](images/decode-discover.png)
* **Food Heaven:** A responsive restaurant experience with a dynamic menu and table reservation flow. *(JavaScript, Bootstrap, .NET)* - [Repo Link](https://github.com/asad594/Food-Heaven)
  ![Food Heaven](images/food-heaven.png)
* **Snake Game:** A polished take on the classic game, featuring live scoring, collision logic, and progressive difficulty. *(Python, OOP, Pygame)* - [Repo Link](https://github.com/asad594/Snake-Game-)
  ![Snake Game](images/snake-game.png)

---

## 🏗️ Client-Side Architecture

The architecture is purely static to maximize CDN delivery speed and performance:

```mermaid
flowchart TD
    subgraph Client ["Client Browser Runtime"]
        HTML["DOM Tree (index.html, resume.html)"]
        CSS["Styling & Effects (style.css, feature-cards.css)"]
        JS["Interactivity Engine (script.js)"]
        HTML --> CSS
        HTML --> JS
    end
    
    subgraph UI ["UX Component Modules"]
        Nav["Dynamic Navigation Island"]
        Show["Project Case Highlights"]
        Time["Skills & Experience Timeline"]
        Res["Interactive Resume View & PDF Fetch"]
    end
    
    JS --> Nav
    JS --> Show
    CSS --> Time
    HTML --> Res
    
    subgraph Cloud ["CDN Delivery Pipeline"]
        Netlify["Netlify edge servers (HTTPS)"]
    end
    HTML --> Netlify
```

---

## 🖥️ Folder Structure

```text
/
├── index.html            # Main site hub & developer summary
├── resume.html           # Dedicated professional resume reader view
├── style.css             # Root design tokens, variables, & main grid styles
├── feature-cards.css     # CSS rules for specialized visual cards
├── script.js             # Event listeners, active classes, & navigation logic
├── assets/               # Branding assets
│   └── banner.png        # Glowing tech banner
├── images/               # Project screenshots & decorative SVGs
├── profile.jpg           # Header avatar image
└── muhammad_Asad_Resume.pdf  # Printable PDF resume asset
```

---

## ⚙️ How to Setup & Run Locally

Since this is a lightweight static site, no external bundlers, package managers, or server frameworks are necessary.

### Running Options

#### Option A: Direct Execution
1. Clone the repository:
   ```bash
   git clone https://github.com/asad594/Portfolio-2nd.git
   cd Portfolio-2nd
   ```
2. Simply double-click `index.html` or open it directly inside any browser.

#### Option B: Local Web Server (Recommended)
To prevent CORS conflicts on AJAX modules or custom layouts, run a lightweight server:
- **Using Python 3:**
  ```bash
  python -m http.server 8000
  ```
  Open your browser and navigate to: [http://localhost:8000](http://localhost:8000)

- **Using Node.js (`live-server`):**
  ```bash
  npx live-server
  ```

---

## 📬 Contact

I am always open to new opportunities, collaborations, and conversations. Connect with me!

- **🌐 Live Site:** [muhammadasadpportfolio.netlify.app](https://muhammadasadpportfolio.netlify.app)
- **📧 Email:** [asad.spartan300@gmail.com](mailto:asad.spartan300@gmail.com)
- **💼 LinkedIn:** [linkedin.com/in/muhammadasad-arshad](https://www.linkedin.com/in/muhammadasad-arshad/)
- **🐙 GitHub:** [github.com/asad594](https://github.com/asad594)

---

⭐ *Found this template helpful? Give the repository a star!*
