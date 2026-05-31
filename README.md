# ⚡ VOLTX — Web-Based KCL & KVL Circuit Equation Solver

![Version](https://img.shields.io/badge/Version-4.0-00e5ff?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active-00e5ff?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-7b61ff?style=flat-square)
![Engine](https://img.shields.io/badge/Engine-Google%20Gemini%202.5%20Flash-ff6b35?style=flat-square)

> A precision AI-powered web application for solving Kirchhoff's Current Law (KCL) and Kirchhoff's Voltage Law (KVL) problems with full step-by-step solutions using Standard algebraic and Matrix-based methods.

---

## 📌 Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [How to Run](#how-to-run)
- [API Key Setup](#api-key-setup)
- [How to Use](#how-to-use)
- [Solving Methods](#solving-methods)
- [Matrix Method Theory](#matrix-method-theory)
- [File Responsibilities](#file-responsibilities)
- [Input Tips](#input-tips)
- [Error Messages & Fixes](#error-messages--fixes)
- [Browser Support](#browser-support)
- [Academic Information](#academic-information)

---

## Introduction

VOLTX is a web-based electrical circuit solver developed as an academic project for the analysis of electrical circuits using Kirchhoff's Laws. Kirchhoff's Current Law (KCL) and Kirchhoff's Voltage Law (KVL) are the two fundamental laws of circuit analysis, formulated by German physicist Gustav Robert Kirchhoff in 1845.

Manual calculation of multi-node and multi-mesh circuits is time-consuming and error-prone. VOLTX automates this process using Google Gemini AI as its solving engine, providing complete step-by-step solutions that help students understand the process — not just the final answer.

The application runs entirely in the browser with no installation required. Users can input circuit problems as text descriptions or upload circuit diagram images and PDF files.

---

## Features

| Feature | Description |
|---|---|
| ⚡ KCL Solver | Solves Kirchhoff's Current Law — ΣI = 0 at each node |
| ⚡ KVL Solver | Solves Kirchhoff's Voltage Law — ΣV = 0 around each loop |
| 📐 Standard Method | Classical algebraic equation-based step-by-step solving |
| 🔢 Matrix Method | Nodal Analysis [G][V]=[I] and Mesh Analysis [Z][I]=[V] |
| 📝 Text Input | Type or paste any circuit problem in natural language |
| 📁 File Upload | Upload circuit diagrams as .PDF, .JPG, or .PNG |
| ✅ Verification | Every solution is verified against the original law |
| 📱 Responsive | Works on desktop, tablet, and mobile browsers |
| 🚫 No Installation | Runs directly by opening index.html in a browser |

---

## Project Structure

```
VOLTX/
│
├── index.html               ← Main web page — HTML structure only
├── style.css                ← All visual styles and animations
├── api.js                   ← AI engine handler (Google Gemini API)
├── solver.js                ← UI logic and state management
├── voltx-requirements.js    ← Full project requirements reference
└── README.md                ← Project documentation (this file)
```

---

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Web page structure and layout |
| CSS3 | Visual design, animations, responsive layout |
| JavaScript (ES6+) | UI logic, form handling, API communication |
| Google Gemini 2.5 Flash | AI solving engine for circuit analysis |
| Google Fonts | Typography — Bebas Neue, IBM Plex Mono, IBM Plex Sans |
| FileReader Web API | Reading uploaded image and PDF files |
| Fetch API | Sending HTTP requests to Google Gemini |

> No frameworks. No libraries. No build tools. Pure vanilla web technologies.

---

## How to Run

**No installation. No server. No build step required.**

### Method 1 — From ZIP file
```
1. Download and extract the VOLTX.zip file
2. Open the extracted VOLTX folder
3. Double-click index.html
4. The application opens in your default browser
```

### Method 2 — From GitHub
```bash
git clone https://github.com/YOUR_USERNAME/VOLTX.git
cd VOLTX
# Double-click index.html or open with Live Server in VS Code
```

> ✅ Works best in **Google Chrome** or **Microsoft Edge** (latest versions)

---

## API Key Setup

VOLTX uses Google Gemini AI as its solving engine. A free API key is required.

### Step 1 — Get your free API key
1. Go to **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy the generated key

### Step 2 — Add the key to api.js
1. Open `api.js` in Notepad or VS Code
2. Find line 10:
```js
const GEMINI_API_KEY = 'PASTE_YOUR_KEY_HERE';
```
3. Replace `PASTE_YOUR_KEY_HERE` with your actual key:
```js
const GEMINI_API_KEY = 'AIzaSyXXXXXXXXXXXXXXXXXXXXXX';
```
4. Save the file (`Ctrl + S`)
5. Refresh the browser (`Ctrl + Shift + R`)

> ⚠️ Make sure there are no extra spaces before or after the key inside the quotes.

---

## How to Use

### Solving a KCL Problem
1. Click **KCL** in the top navigation bar
2. Type your circuit problem in the text area
   - Example: *"Node A has 3A entering and 1A leaving. A 4Ω resistor connects node A to ground. Find the node voltage."*
3. Select solving method — **Standard** or **Matrix**
4. Click **⚡ SOLVE**
5. The complete step-by-step solution appears below

### Solving a KVL Problem
1. Click **KVL** in the top navigation bar
2. Type your circuit problem in the text area
   - Example: *"A series circuit has a 12V source, R1=4Ω and R2=8Ω. Find the current and voltage drops."*
3. Select solving method — **Standard** or **Matrix**
4. Click **⚡ SOLVE**

### Uploading a File
1. Click the **FILE UPLOAD** tab
2. Click the upload zone or drag and drop your file
3. Supported formats: **.PDF**, **.JPG**, **.PNG**
4. Click **⚡ SOLVE** — VOLTX extracts the circuit from the file and solves it

---

## Solving Methods

### Standard Method
The classical approach taught in textbooks.

**For KCL:**
- Identifies all nodes and labels unknown voltages
- Applies ΣI = 0 at each node
- Writes one algebraic equation per node
- Solves the system step by step
- States all node voltages and branch currents

**For KVL:**
- Identifies all loops and assigns clockwise current directions
- Applies ΣV = 0 around each loop
- Writes one KVL equation per loop
- Solves algebraically showing every substitution
- States all mesh currents and element voltage drops

### Matrix Method
A systematic linear algebra approach for multi-node/multi-loop circuits.

**For KCL → Nodal Analysis:**
- Builds conductance matrix [G] and current vector [I]
- Solves [G][V] = [I] using Gaussian Elimination
- Shows complete matrix, row operations, and back substitution

**For KVL → Mesh Analysis:**
- Builds impedance matrix [Z] and voltage vector [V]
- Solves [Z][I] = [V] using Gaussian Elimination or Cramer's Rule
- Shows complete matrix, determinant, and solution steps

---

## Matrix Method Theory

### KCL — Nodal Analysis: [G][V] = [I]

The conductance matrix [G] is built as follows:

```
G[i][i] = Sum of all conductances connected to node i
G[i][j] = Negative of conductance between node i and node j (i ≠ j)
```

**Example — 2 node circuit:**
```
| G11  G12 |   | V1 |   | I1 |
| G21  G22 | × | V2 | = | I2 |
```

Solved by: **[V] = [G]⁻¹ × [I]**

---

### KVL — Mesh Analysis: [Z][I] = [V]

The impedance matrix [Z] is built as follows:

```
Z[i][i] = Sum of all resistances in mesh i
Z[i][j] = Negative of resistance shared between mesh i and mesh j (i ≠ j)
```

**Example — 2 mesh circuit:**
```
| Z11  Z12 |   | I1 |   | V1 |
| Z21  Z22 | × | I2 | = | V2 |
```

Solved by: **[I] = [Z]⁻¹ × [V]** or **Cramer's Rule**

---

### 2×2 Matrix Inversion Formula

```
     | a  b |⁻¹       1      |  d  -b |
A =  | c  d |   =  ──────  × | -c   a |
                    ad - bc
```

Determinant: **det(A) = ad - bc**
If det(A) = 0 → system is singular → no unique solution exists.

---

## File Responsibilities

### `index.html`
- Pure HTML structure with no inline CSS or JavaScript
- Contains the header, hero section, sidebar, main panel, and footer
- Links to `style.css` in `<head>` and loads `api.js` and `solver.js` before `</body>`

### `style.css`
- All visual styling using CSS custom properties (variables)
- Dark industrial theme with cyan accent color
- CSS grid layout for sidebar + main panel
- Animations: pulse, fadeUp, button sweep effect
- Fully responsive with mobile breakpoints at 768px

### `api.js`
- Stores the Gemini API key and model configuration
- `getMethodDescription()` — returns the correct solving instruction for each law/method combination
- `buildContents()` — assembles the request body for text or file input
- `callSolvingEngine()` — main async function that sends the request and returns the solution
- Complete error handling for all API error codes (400, 401, 403, 404, 429, 500, 503)

### `solver.js`
- `setLaw()` — switches between KCL and KVL, updates all UI elements
- `setMethod()` — switches between Standard and Matrix methods
- `setInputTab()` — switches between text and file upload input modes
- `handleFile()` — reads uploaded file and converts to Base64
- `updateExamples()` — populates quick example chips for each law
- `updatePlaceholder()` — updates textarea placeholder text per law
- `solve()` — validates input, calls api.js, renders solution in result panel

### `voltx-requirements.js`
- Complete project requirements specification
- Functional requirements (FR-01 to FR-12)
- Non-functional requirements (NFR-01 to NFR-06)
- AI engine configuration and prompt templates
- Matrix method technical reference

---

## Input Tips

- Always include **resistor values** with units — e.g. R1 = 10Ω, R2 = 5Ω
- Always include **source values** — e.g. Vs = 12V, Is = 3A
- Mention **node names** — e.g. Node A, Node B, Ground
- Mention **loop structure** — e.g. "two mesh circuit", "series loop"
- For matrix method — mention the number of nodes or meshes
- For file upload — use **clear, well-lit images** — hand-drawn diagrams work fine
- Avoid abbreviations — write "entering the node" not just "in"

---

## Error Messages & Fixes

| Error | Cause | Fix |
|---|---|---|
| API KEY NOT SET | Key not added to api.js | Paste key in api.js line 10 |
| INVALID API KEY | Wrong or copied with spaces | Re-copy key using copy button, no spaces |
| QUOTA EXCEEDED | Free tier limit reached | Wait 1 min or create new key |
| MODEL NOT FOUND | Model not available on account | Sign into aistudio.google.com first |
| SERVICE UNAVAILABLE | Google servers down | Wait 1-2 minutes and retry |
| NETWORK ERROR | No internet connection | Check internet and retry |
| EMPTY RESPONSE | Problem too vague | Add more circuit details |

---

## Browser Support

| Browser | Version | Support |
|---|---|---|
| Google Chrome | 90+ | ✅ Full support — Recommended |
| Microsoft Edge | 90+ | ✅ Full support |
| Mozilla Firefox | 88+ | ✅ Full support |
| Safari | 14+ | ✅ Full support |
| Opera | 76+ | ✅ Full support |

---

## Academic Information

| Field | Details |
|---|---|
| Project Title | VOLTX — Web-Based KCL & KVL Circuit Equation Solver |
| Subject | Electrical Circuit Analysis |
| Laws Covered | Kirchhoff's Current Law (KCL), Kirchhoff's Voltage Law (KVL) |
| Methods | Standard Algebraic Method, Matrix / Nodal / Mesh Analysis |
| AI Engine | Google Gemini 2.5 Flash |
| Platform | Web Browser (HTML / CSS / JavaScript) |
| Type | Academic Project |
| Version | 4.0 |

---

## Key Formulas

```
KCL:  ΣI = 0          (at every node)
KVL:  ΣV = 0          (around every closed loop)

Ohm's Law:    V = IR
Conductance:  G = 1/R  (unit: Siemens S)

Nodal Analysis:  [G][V] = [I]
Mesh Analysis:   [Z][I] = [V]
```

---

## License

This project is licensed under the **MIT License** — free to use, modify, and distribute for academic and personal purposes.

---

<div align="center">

**⚡ VOLTX — Circuit Equation Solver**

Built with HTML · CSS · JavaScript · Google Gemini AI

© 2025 VOLTX · All Rights Reserved

</div>
