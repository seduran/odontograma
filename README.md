![GitHub Created At](https://img.shields.io/github/created-at/bardurt/odontograma?style=plastic)
![GitHub Stars](https://img.shields.io/github/stars/bardurt/odontograma?style=plastic)
![GitHub Forks](https://img.shields.io/github/forks/bardurt/odontograma?style=plastic)
![GitHub License](https://img.shields.io/github/license/bardurt/odontograma?style=plastic)

# Odontograph
A virtual Odontogram in JavaScript.

![demo](docs/demo.gif)

A virtual dental chart (Odontogram) application built with pure HTML5 Canvas, modern ES6+ JavaScript, and native HTML overlay elements. This directory contains a fully modernized, refactored, and optimized version of the original Odontograma project.

## Key Modernization Features

1. **Native HTML Overlays**: All diagnostic and layout mode buttons are native HTML `<button>` elements positioned as overlays, removing manual button drawing, hover checking, and bounding-box collision maths from the canvas logic.
2. **ES6 Classes & Modules**: The entire codebase has been transitioned from prototypal constructors and global scripts to ES6 Classes and ES Modules (`import`/`export`), improving readability, modularity, and encapsulation.
3. **DRY Optimization**: Repetitive teeth-generation loops in the original generator have been parameterized, reducing the size of `odontogramaGenerator.js` by ~73% (from 648 down to 175 lines of code) while preserving the exact layout.
4. **Reactive State Sync**: Integrates a callback listener (`onStateChange`) that keeps DOM buttons in active sync with canvas modifications and keyboard shortcut actions.
5. **Instant Startup**: Removed startup splash delay to load and display the main odontogram view instantly.
6. **Robust Printing**: Fixed layout alignment bugs that caused tooth shifts during printing actions.

---

## Directory Structure

```
modernized/
├── css/
│   └── styles.css          # Precise styling for HTML button overlays, gradients, and hover states
├── js/
│   ├── main.js             # Entrypoint module wiring up canvas listeners and HTML buttons
│   ├── engine.js           # Core state machine engine
│   ├── odontogramaGenerator.js # Parameterized adult & child tooth layout builder
│   ├── tooth.js            # Tooth surface, checkbox, and coordinate offset manager
│   ├── damage.js           # Graphic canvas drawer for treatments & diagnostics
│   ├── collisionHandler.js # Logic for toggling dental conditions
│   ├── renderer.js         # Canvas operations & text wrap utility wrapper
│   ├── rect.js             # Collision bounds & rectangle painter
│   ├── textBox.js          # TextBox visual container
│   ├── constants.js        # Global diagnosis condition IDs
│   └── settings.js         # Theme colors & debugging flags
├── images/                 # Original tooth assets
├── favicon.ico             # App icon
└── index.html              # Main HTML document
```

---

## Getting Started

Because this project uses native **ES Modules** (`import` / `export`), modern web browsers require files to be loaded over HTTP(S) rather than direct file system links (`file://`) due to CORS security policies.

To run the application locally, start a local web server in the `modernized/` folder:

### Using Python (Quickest)
```bash
# Python 3
python3 -m http.server 8000
```
Then navigate to `http://localhost:8000` in your web browser.

### Using Node.js / npm
```bash
# Install a static server globally
npm install -g http-server
# Run the server
http-server -p 8000
```
Then navigate to `http://localhost:8000` in your web browser.

---

## Usage Guide

### Selecting Diagnostics
- Click on any **Diagnosis Button** (e.g. *Caries*, *Crown*, *Filling*) at the top of the interface.
- Click on a specific **tooth checkbox** (surfaces) to apply the treatment (e.g., caries/fillings).
- Click on the **body of a tooth** or the **spaces between teeth** (for diastema/supernumerary) to toggle condition drawings.
- Right-click on any tooth or surface to clear its condition.

### Keyboard Shortcuts
For testing and power usage, the following keyboard mappings are active:
- **`ArrowLeft`**: Switch view to **Adult**
- **`ArrowRight`**: Switch view to **Child**
- **`z`**: Reset the entire odontogram
- **`p`**: Trigger print layout dialog
- **`-`**: Toggle print preview layout on the canvas
- **`v`**: Log current diagnostic data JSON array to browser console
- **`q` through `m`**: Quickly map keyboard keys to specific diagnoses
- **`Ctrl + Q`**: Toggle **Debug Mode** (draws bounding boxes and outlines)
- **`Shift + Q`**: Save the canvas directly as a PNG image file
