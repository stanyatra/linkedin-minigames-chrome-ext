# linkedIn-minigames-solver extension

A unified Chrome Extension that intelligently solves multiple **LinkedIn Mini Games** directly inside the browser.

This repository combines solvers for:

*  **Queens**
*  **Tango**
* **Mini Sudoku**

Instead of relying on hardcoded puzzle layouts, the extension dynamically analyzes the webpage, reconstructs each puzzle from the DOM, applies specialized constraint-solving algorithms, and presents accurate solutions in real time.

Each game uses its own optimized solving strategy while sharing a common architecture for browser automation, DOM parsing, matrix reconstruction, and visual solution rendering.

---

# Features

* Supports multiple LinkedIn Mini Games in a single extension
* Automatic puzzle detection
* Dynamic board reconstruction from the webpage DOM
* No hardcoded puzzle layouts
* Fast recursive constraint-based solvers
* Intelligent browser-side computation
* Lightweight visual solution overlays
* Built with Manifest V3
* Works entirely locally inside your browser

---


# Architecture

Although every game has unique solving rules, they share the same processing pipeline:

```text
LinkedIn Webpage
        │
        ▼
DOM Traversal
        │
        ▼
Grid Detection
        │
        ▼
Coordinate Extraction
        │
        ▼
Matrix Reconstruction
        │
        ▼
Game-Specific Solver
        │
        ▼
Constraint Validation
        │
        ▼
Solution Generation
        │
        ▼
Visual Overlay
```

---

# Core Algorithms & Concepts

Across all supported games, the project demonstrates a variety of algorithmic techniques, including:

* Recursive Backtracking
* Constraint Satisfaction Problems (CSP)
* Dynamic Constraint Propagation
* State-Space Search
* Matrix Reconstruction
* Bitmask Optimization
* Recursive Pruning
* DOM Traversal & Analysis
* Browser Automation
* Coordinate-Based Cell Detection
* Region & Color Mapping
* SVG Parsing
* Accessibility Attribute Extraction
* Adjacency Conflict Detection
* Row/Column Frequency Constraints
* Subgrid Validation
* Visual Overlay Rendering

---

# Tech Stack

* JavaScript
* HTML5
* CSS3
* Chrome Extensions Manifest V3
* Chrome Scripting API
* DOM Manipulation APIs
* Browser Event Handling
* Recursive Backtracking
* Bitmasking
* Matrix & State-Space Modelling
* C++ (original solver implementations, later ported to JavaScript)

---

# How It Works

For every supported LinkedIn game, the extension follows the same high-level workflow:

1. Detects the active puzzle automatically.
2. Traverses the webpage DOM.
3. Extracts puzzle-specific information.
4. Reconstructs the puzzle into an internal matrix representation.
5. Executes a game-specific recursive solver.
6. Validates all puzzle constraints during the search.
7. Computes a valid solution.
8. Displays the solution as lightweight visual overlays.

---



# Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/linkedin-mini-games-solver.git
```

### 2. Open Chrome Extensions

```
chrome://extensions
```

### 3. Enable **Developer Mode**

### 4. Load the extension

* Click **Load unpacked**
* Select the cloned project folder

### 5. Start solving

* Open any supported LinkedIn Mini Game.
* Click the extension icon.
* Select the appropriate solver (or let the extension detect the game automatically, if supported).
* View the generated solution overlay.

---

# Project Structure

```text
linkedin-mini-games-solver/
│
├── queens/
│   ├── solver/
│   ├── content/
│   └── assets/
│
├── tango/
│   ├── solver/
│   ├── content/
│   └── assets/
│
├── sudoku/
│   ├── solver/
│   ├── content/
│   └── assets/
│
├── shared/
│   ├── dom/
│   ├── overlays/
│   ├── utilities/
│   └── common/
│
├── manifest.json
└── README.md
```

---

# Highlights

* Unified extension supporting multiple LinkedIn Mini Games
* Dynamic DOM-driven puzzle reconstruction
* Efficient recursive solvers tailored to each game
* Zero hardcoded puzzle layouts
* Fully client-side execution
* Modular architecture for easy expansion
* Strong emphasis on algorithms, browser automation, and constraint-solving techniques
