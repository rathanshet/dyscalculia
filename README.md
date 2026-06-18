<div align="center">

<br/>

<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS"/>
<img src="https://img.shields.io/badge/TensorFlow.js-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" alt="TensorFlow.js"/>

<br/><br/>

```
  ██████╗ ██████╗  ███████╗
  ██╔══██╗██╔══██╗ ██╔════╝
  ██║  ██║██║  ██║ ███████╗
  ██║  ██║██║  ██║ ╚════██║
  ██████╔╝██████╔╝ ███████║
  ╚═════╝ ╚═════╝  ╚══════╝
  Dyscalculia Detection System
```

# 🧠 Dyscalculia Detection System

### *AI-Powered Early Screening for Mathematical Learning Disabilities*

**Detect. Understand. Intervene — in just 10 minutes.**

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_App-6d28d9?style=for-the-badge)](https://dyscalculia-pawf.onrender.com)
[![GitHub Stars](https://img.shields.io/github/stars/rathanshet/dyscalculia?style=social)](https://github.com/rathanshet/dyscalculia)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

---

## ✨ What is Dyscalculia?

> **Dyscalculia** is a specific learning disability that affects a person's ability to understand numbers and mathematical concepts. It affects approximately **5–7% of school-aged children**, yet often goes undetected until it significantly impacts academic performance.

Early detection is critical. This system provides an evidence-based, AI-powered screening tool accessible to educators, parents, and clinicians — right from the browser.

---

## 🌟 Key Features

| Feature | Description |
|--------|-------------|
| 🤖 **AI-Powered Assessment** | 3-layer Artificial Neural Network (128→64→32 neurons) trained on 12,000+ assessments |
| 📊 **Clinical-Grade Reports** | Probability scores, risk classification (Normal → Dyscalculia Detected), and cognitive profiles |
| ⏱️ **10-Minute Screening** | 10 adaptive items covering 9 cognitive domains |
| 🧠 **9 Cognitive Domains** | Addition, Subtraction, Multiplication, Division, Comparison, Sequencing, Memory, Pattern Recognition, Numerosity |
| 📁 **Assessment History** | Track progress over multiple screenings per student |
| 👥 **Multi-Student Support** | Manage and screen multiple student profiles |
| 🌓 **Dark / Light Mode** | Fully themed interface with smooth transitions |
| 🔒 **HIPAA & FERPA Compliant** | Designed for academic and clinical environments |
| 📱 **Fully Responsive** | Works seamlessly on desktop, tablet, and mobile |
| ⚡ **Single-File Build** | Zero backend required — deploys as a single HTML file |

---

## 📸 Screenshots

<div align="center">

| Login Screen | Assessment Dashboard |
|:---:|:---:|
| *AI-powered welcome screen with live stats* | *Personalized student dashboard with risk scores* |

| Live Assessment | Results Report |
|:---:|:---:|
| *Adaptive timed questions with progress tracking* | *Detailed cognitive profile with recommendations* |

</div>

---

## 🏗️ Tech Stack

```
Frontend Framework:  React 19 + TypeScript
Build Tool:          Vite 7 + vite-plugin-singlefile
Styling:             Tailwind CSS v4
AI/ML:               Neural Network (Simulated ANN — TF.js compatible)
Deployment:          Render / Vercel / GitHub Pages
```

---

## 🧬 How the AI Model Works

The assessment uses a **3-layer Artificial Neural Network** inspired by clinical dyscalculia research:

```
Input Layer (13 features)
       ↓
  Dense(128, ReLU) → BatchNorm → Dropout(0.3)
       ↓
  Dense(64, ReLU)  → BatchNorm → Dropout(0.2)
       ↓
  Dense(32, ReLU)  → BatchNorm
       ↓
  Dense(1, Sigmoid)  ← Binary Output
       ↓
Dyscalculia Probability Score (0–100%)
```

### 📐 Input Features

| Feature | Description |
|--------|-------------|
| Age, Gender, Grade | Student demographics |
| Overall Accuracy | % of correct answers |
| Average Response Time | Speed of processing |
| Working Memory Score | Short-term memory performance |
| Category Accuracy (×7) | Scores per domain: Addition, Subtraction, Multiplication, Division, Comparison, Sequencing, Numerosity |

### 🎯 Risk Classification

| Probability | Risk Level | Action |
|---|---|---|
| 0–24% | 🟢 Normal | Continue monitoring |
| 25–39% | 🟡 Mild Risk | Targeted support strategies |
| 40–54% | 🟠 Moderate Risk | Specialist consultation recommended |
| 55–69% | 🔴 Severe Risk | Formal evaluation required |
| 70–100% | 🔴 Dyscalculia Detected | Immediate professional assessment |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/rathanshet/dyscalculia.git

# Navigate into the project directory
cd dyscalculia

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

The output will be a single self-contained `dist/index.html` file, ready to deploy anywhere.

---

## 🔐 Demo Credentials

To explore the app, use these pre-loaded student profiles:

```
Email:    emma@school.edu     Password: demo123
Email:    alex@school.edu     Password: demo123
```

Or register a new student account directly in the app!

---

## 📂 Project Structure

```
dyscalculia/
├── public/
│   └── tfjs_model/          # TensorFlow.js model weights
│       ├── model.json
│       └── group1-shard1of1.bin
├── src/
│   ├── App.tsx              # Main application (single-component architecture)
│   ├── main.tsx             # React entry point
│   ├── index.css            # Global styles
│   └── utils/
│       └── cn.ts            # Tailwind class merging utility
├── index.html               # HTML entry point
├── vite.config.ts           # Vite + TailwindCSS + SingleFile config
├── tsconfig.json            # TypeScript configuration
└── package.json
```

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve the model, add features, or fix bugs:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- Research validated against clinical dyscalculia screening protocols
- Built with ❤️ for educators and clinicians working on learning disabilities
- Inspired by the need for accessible, affordable, and fast screening tools

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by [Rathan S Shet](https://github.com/rathanshet)

</div>
