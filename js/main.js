/* 
 * Copyright (c) 2018 Bardur Thomsen <https://github.com/bardurt>.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    Bardur Thomsen <https://github.com/bardurt> - initial API and implementation and/or initial documentation
 */

import Engine from './engine.js';

// Instantiate the engine and set up the canvas
const canvas = document.getElementById('canvas');
const engine = new Engine();
engine.setCanvas(canvas);
engine.init();

// Fetch HTML button elements
const diagnosisButtons = Array.from(document.querySelectorAll('.diagnosis-btn'));
const btnAdult = document.getElementById('btn-adult');
const btnChild = document.getElementById('btn-child');
const btnReset = document.getElementById('btn-reset');
const buttonOverlay = document.getElementById('button-overlay');

let activeDiagnosisBtn = null;

// Setup click handlers for diagnosis buttons
diagnosisButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id, 10);
        
        if (activeDiagnosisBtn === btn) {
            // Deactivate current active button
            btn.classList.remove('active');
            activeDiagnosisBtn = null;
            engine.setDamage(0);
        } else {
            // Deactivate previous active button
            if (activeDiagnosisBtn) {
                activeDiagnosisBtn.classList.remove('active');
            }
            // Activate new button
            btn.classList.add('active');
            activeDiagnosisBtn = btn;
            engine.setDamage(id);
        }
        engine.update();
    });
});

// Setup click handlers for mode controls
btnAdult.addEventListener('click', () => {
    engine.changeView("0");
});

btnChild.addEventListener('click', () => {
    engine.changeView("1");
});

btnReset.addEventListener('click', () => {
    engine.reset();
    
    // Clear selection state
    if (activeDiagnosisBtn) {
        activeDiagnosisBtn.classList.remove('active');
        activeDiagnosisBtn = null;
    }
    engine.setDamage(0);
    engine.update();
});

// Bind canvas mouse events
canvas.addEventListener('mousedown', (event) => {
    engine.onMouseClick(event);
}, false);

canvas.addEventListener('mousemove', (event) => {
    engine.onMouseMove(event);
}, false);

// Bind keyboard events
window.addEventListener('keydown', (event) => {
    engine.onButtonClick(event);
}, false);

// Reactive callback from the engine's update loop to synchronize HTML button states
engine.onStateChange = () => {
    // 1. Sync adult/child active state
    if (engine.adultShowing) {
        btnAdult.classList.add('active');
        btnChild.classList.remove('active');
    } else {
        btnAdult.classList.remove('active');
        btnChild.classList.add('active');
    }

    // 2. Sync selected diagnosis buttons (handles keyboard selections and clears)
    const currentSelectedId = parseInt(engine.selectedDamage, 10) || 0;
    
    if (currentSelectedId === 0) {
        if (activeDiagnosisBtn) {
            activeDiagnosisBtn.classList.remove('active');
            activeDiagnosisBtn = null;
        }
    } else {
        if (!activeDiagnosisBtn || parseInt(activeDiagnosisBtn.dataset.id, 10) !== currentSelectedId) {
            if (activeDiagnosisBtn) {
                activeDiagnosisBtn.classList.remove('active');
            }
            // Find the matching button for the selected damage ID (selects first if duplicates exist)
            const matchingBtn = diagnosisButtons.find(b => parseInt(b.dataset.id, 10) === currentSelectedId);
            if (matchingBtn) {
                matchingBtn.classList.add('active');
                activeDiagnosisBtn = matchingBtn;
            } else {
                activeDiagnosisBtn = null;
            }
        }
    }

    // 3. Toggle button visibility in print preview mode
    if (engine.preview) {
        buttonOverlay.style.display = 'none';
    } else {
        buttonOverlay.style.display = 'block';
    }
};

// Initial state sync
engine.onStateChange();

// Load patient data just like the original layout
engine.loadPatientData(
    "New York",
    "Bardur Thomsen",
    "1002",
    "hc 001",
    "26/02/2018",
    "dentist one",
    "Test observations",
    "Test specifications"
);
