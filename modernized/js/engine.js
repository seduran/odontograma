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

import Constants from './constants.js';
import Settings from './settings.js';
import Renderer from './renderer.js';
import OdontogramaGenerator from './odontogramaGenerator.js';
import CollisionHandler from './collisionHandler.js';

/**
 * Main Engine class for Odontograma
 */
export default class Engine {
    constructor() {
        // canvas which is used by the engine
        this.canvas = null;

        this.adultShowing = true;

        // array which contains all the teeth for an odontograma
        this.mouth = [];

        // array which holds all the spaces between teeth
        this.spaces = [];

        // array for an adult odontograma
        this.odontAdult = [];

        // spaces for an adult odontograma
        this.odontSpacesAdult = [];

        // array for a child odontograma
        this.odontChild = [];

        // spaces for a child odontograma
        this.odontSpacesChild = [];

        // renderer which will render everything on a canvas
        this.renderer = new Renderer();

        // helper to create odontograma
        this.odontogramaGenerator = new OdontogramaGenerator();

        // helper for handling collision
        this.collisionHandler = new CollisionHandler();

        // settings for application
        this.settings = new Settings();

        // constants for application
        this.constants = new Constants();

        // value of the selected damage which should be added or removed
        this.selectedDamage = 0;

        // x position of the mouse pointer
        this.cursorX = 0;

        // y position of the mouse pointer
        this.cursorY = 0;

        // flag to toggle multiselection on or off
        this.multiSelect = false;

        // array to hold values for multiselection
        this.multiSelection = [];

        this.currentType = 0;

        this.preview = false;

        this.printPreviewPositionChange = 190;

        this.observations = "";
        this.specifications = "";
        this.patient = "";
        this.treatmentNumber = "";
        this.treatmentData = {};

        // State update listener callback
        this.onStateChange = null;
    }

    /**
     * Method to set the canvas for the engine.
     * @param {HTMLCanvasElement} canvas the canvas which will be used for drawing
     */
    setCanvas(canvas) {
        console.log("Engine: setting canvas: " + canvas);
        console.log("Engine: canvas size (" + canvas.width + ", " + canvas.height + ")");
        this.canvas = canvas;
        this.renderer.init(this.canvas);
    }

    /**
     * Helper method to get the real x position of mouse
     * @param {MouseEvent} event mouse event containing mouse position
     * @returns {number} the x position of the mouse
     */
    getXpos(event) {
        const boundingRect = this.canvas.getBoundingClientRect();
        return Math.round(event.clientX - boundingRect.left);
    }

    /**
     * Helper method to get the real y position of mouse
     * @param {MouseEvent} event mouse event containing mouse position
     * @returns {number} the y position of the mouse
     */
    getYpos(event) {
        const boundingRect = this.canvas.getBoundingClientRect();
        return Math.round(event.clientY - boundingRect.top);
    }

    /**
     * Method to prepare the engine
     */
    init() {
        this.collisionHandler.setConstants(this.constants);

        // set up the odontograma
        this.odontogramaGenerator.setEngine(this);
        this.odontogramaGenerator.setSettings(this.settings);
        this.odontogramaGenerator.setConstants(this.constants);

        this.odontogramaGenerator.prepareOdontogramaAdult(
            this.odontAdult,
            this.odontSpacesAdult,
            this.canvas
        );

        this.odontogramaGenerator.prepareOdontogramaChild(
            this.odontChild,
            this.odontSpacesChild,
            this.canvas
        );

        this.mouth = this.odontAdult;
        this.spaces = this.odontSpacesAdult;
    }

    /**
     * Method for updating the engine
     */
    update() {
        this.renderer.clear(this.settings);

        if (!this.preview) {
            this.renderer.render(this.mouth, this.settings, this.constants);
            this.renderer.render(this.spaces, this.settings, this.constants);

            if (this.settings.DEBUG) {
                this.renderer.renderText("DEBUG MODE", 2, this.canvas.height, "#000000");

                this.renderer.renderText(
                    "X: " + this.cursorX + ", Y: " + this.cursorY,
                    128,
                    this.canvas.height,
                    "#000000"
                );

                this.renderer.renderText(
                    "Selected Damage : " + this.selectedDamage,
                    220,
                    this.canvas.height,
                    "#000000"
                );
            }
        } else {
            this.printPreview();
        }

        // Notify parent application of state changes reactively
        if (this.onStateChange) {
            this.onStateChange();
        }
    }

    /**
     * Method to remove all the highlight from all the teeth
     */
    removeHighlight() {
        for (let i = 0; i < this.mouth.length; i++) {
            this.mouth[i].highlight = false;
        }
    }

    /**
     * Method to highlight all the teeth which are marked when multiselected
     * @param {object} tooth the tooth which should be highlighted
     */
    highlightMultiSelection(tooth) {
        console.log("Highlighting multiselection");
        try {
            // only highlight if the selection is at least 1
            if (this.multiSelection.length > 0) {
                // reset the highlighting
                for (let i = 0; i < this.mouth.length; i++) {
                    this.mouth[i].highlight = false;
                    this.mouth[i].highlightColor = this.settings.COLOR_HIGHLIGHT;
                }

                const tooth1 = this.multiSelection[0];

                // check if these teeth are same types
                if (tooth1.type === tooth.type) {
                    // get indices for both teeth
                    const index1 = this.getIndexForTooth(tooth1);
                    const index2 = this.getIndexForTooth(tooth);

                    const begin = Math.min(index1, index2);
                    const end = Math.max(index1, index2);

                    // highlight the teeth between begin and end
                    for (let i = begin; i <= end; i++) {
                        this.mouth[i].highlight = true;
                    }

                    // some damages can only have 2 items in multiselection
                    if (this.selectedDamage === this.constants.TRANSPOSICION_LEFT) {
                        // if count of selection for this damage (max 2) then
                        // change the highlight color, to show that this selection
                        // is not allowed
                        if ((end - begin) > 1) {
                            for (let i = begin; i <= end; i++) {
                                this.mouth[i].highlightColor = this.settings.COLOR_HIGHLIGHT_BAD;
                            }
                        }
                    }
                }

                // repaint
                this.update();
            }
        } catch (error) {
            console.log("Engine highlightMultiSelection e: " + error.message);
        }
    }

    /**
     * Method to reset the multiselection - deactivate multiselection
     */
    resetMultiSelect() {
        this.selectedDamage = 0;
        this.multiSelect = false;
        this.multiSelection.length = 0;
        this.removeHighlight();
        this.update();
    }

    /**
     * Method to get the index for a tooth
     * @param {object} tooth the tooth to find the index of
     * @returns {number} index of the tooth, -1 if not found
     */
    getIndexForTooth(tooth) {
        let index = -1;

        for (let i = 0; i < this.mouth.length; i++) {
            if (this.mouth[i].id === tooth.id) {
                index = i;
                break;
            }
        }

        return index;
    }

    /**
     * Method to handle multiselection.
     */
    handleMultiSelection() {
        // only handle multiselect when 2 teeth have been selected
        if (this.multiSelection.length === 2) {
            const tooth1 = this.multiSelection[0];
            const tooth2 = this.multiSelection[1];

            // get the indices for the teeth which have been selected
            const index1 = this.getIndexForTooth(tooth1);
            const index2 = this.getIndexForTooth(tooth2);

            let valid = true;

            // make sure that we don't select the same tooth 2 times
            if (index1 === index2) {
                valid = false;
            }

            // make sure that both teeth are same type, upper or lower mouth
            if (tooth1.type !== tooth2.type) {
                valid = false;
            }

            // only toggle damages if everything is okay
            if (valid) {
                const start = Math.min(index1, index2);
                const end = Math.max(index1, index2);

                // check which damage should be added or removed
                if (this.selectedDamage === this.constants.ORTODONTICO_FIJO_END) {
                    this.mouth[start].toggleDamage(this.constants.ORTODONTICO_FIJO_END, this.constants);
                    this.mouth[end].toggleDamage(this.constants.ORTODONTICO_FIJO_END, this.constants);

                    for (let i = start + 1; i <= end - 1; i++) {
                        this.mouth[i].toggleDamage(this.constants.ORTODONTICO_FIJO_CENTER, this.constants);
                    }
                } else if (this.selectedDamage === this.constants.PROTESIS_FIJA_LEFT) {
                    this.mouth[start].toggleDamage(this.constants.PROTESIS_FIJA_RIGHT, this.constants);
                    this.mouth[end].toggleDamage(this.constants.PROTESIS_FIJA_LEFT, this.constants);

                    for (let i = start + 1; i <= end - 1; i++) {
                        this.mouth[i].toggleDamage(this.constants.PROTESIS_FIJA_CENTER, this.constants);
                    }
                } else if (this.selectedDamage === this.constants.TRANSPOSICION_LEFT) {
                    if (end - start === 1) {
                        this.mouth[start].toggleDamage(this.constants.TRANSPOSICION_LEFT, this.constants);
                        this.mouth[end].toggleDamage(this.constants.TRANSPOSICION_RIGHT, this.constants);
                    }
                }
            }

            // reset multiselection when it is finished
            this.multiSelection.length = 0;
            this.removeHighlight();
            this.update();
        }
    }

    /**
     * Method to add items to a list of selected items
     * @param {object} tooth the tooth to add to the list
     */
    addToMultiSelection(tooth) {
        this.multiSelection.push(tooth);

        if (this.multiSelection.length === 2) {
            this.handleMultiSelection();
        }
    }

    /**
     * Method to check if a string is alphanumeric
     * @param {string} input the text to check
     * @returns {boolean} true if alphanumeric, else false
     */
    isAlphanumeric(input) {
        const letters = /^[0-9a-zA-Z]+$/;
        return !!input.match(letters);
    }

    /**
     * Method to add text to a textbox. This method only allows alphanumeric values
     */
    setTextToTextBox(textBox, text) {
        if (text !== null) {
            if (text.length < 4) {
                if (this.isAlphanumeric(text)) {
                    textBox.setNote(text);
                } else if (text === "") {
                    textBox.setNote(text);
                }
            }
        }
    }

    /**
     * Method to handle when there is a mouse click on a textbox
     * @param {object} textBox the textbox clicked
     */
    onTextBoxClicked(textBox) {
        const message = "Add 3 letter dental code.";
        const text = prompt(message, "");
        this.setTextToTextBox(textBox, text);
    }

    mouseRightClickSpace(event) {
        let shouldUpdate = false;

        for (let i = 0; i < this.spaces.length; i++) {
            if (this.spaces[i].checkCollision(this.getXpos(event), this.getYpos(event))) {
                this.spaces[i].popDamage();
                shouldUpdate = true;
            }
        }

        if (shouldUpdate) {
            this.update();
        }
    }

    mouseRightClickTooth(event) {
        let shouldUpdate = false;

        for (let i = 0; i < this.mouth.length; i++) {
            if (this.mouth[i].textBox.rect.checkCollision(this.getXpos(event), this.getYpos(event))) {
                this.mouth[i].textBox.text = "";
                shouldUpdate = true;
            }

            if (this.mouth[i].rect.checkCollision(this.getXpos(event), this.getYpos(event))) {
                this.mouth[i].popDamage();
                shouldUpdate = true;
            }

            for (let j = 0; j < this.mouth[i].checkBoxes.length; j++) {
                if (this.mouth[i].checkBoxes[j].checkCollision(this.getXpos(event), this.getYpos(event))) {
                    this.mouth[i].checkBoxes[j].state = 0;
                    shouldUpdate = true;
                }
            }
        }

        if (shouldUpdate) {
            this.update();
        }
    }

    mouseClickSpace(event) {
        let shouldUpdate = false;

        for (let i = 0; i < this.spaces.length; i++) {
            if (this.spaces[i].checkCollision(this.getXpos(event), this.getYpos(event))) {
                this.collisionHandler.handleCollision(this.spaces[i], this.selectedDamage);
                shouldUpdate = true;
            }
        }

        if (shouldUpdate) {
            this.update();
        }
    }

    mouseClickTooth(event) {
        let shouldUpdate = false;

        for (let i = 0; i < this.mouth.length; i++) {
            if (this.mouth[i].textBox.rect.checkCollision(this.getXpos(event), this.getYpos(event))) {
                if (this.currentType === 0) {
                    this.onTextBoxClicked(this.mouth[i].textBox);
                }
            }

            if (this.mouth[i].rect.checkCollision(this.getXpos(event), this.getYpos(event))) {
                if (this.multiSelect) {
                    this.addToMultiSelection(this.mouth[i]);
                } else {
                    if (this.currentType === 0) {
                        this.collisionHandler.handleCollision(this.mouth[i], this.selectedDamage);
                        shouldUpdate = true;
                    } else {
                        const d = {
                            tooth: this.mouth[i].id,
                            damage: "",
                            diagnostic: this.selectedDamage,
                            surface: "X",
                            note: ""
                        };
                        this.createDiagnostico(d);
                    }
                }
            }

            for (let j = 0; j < this.mouth[i].checkBoxes.length; j++) {
                if (this.mouth[i].checkBoxes[j].checkCollision(this.getXpos(event), this.getYpos(event))) {
                    console.log("Collision Checkbox : " + this.selectedDamage);

                    if (this.currentType === 0) {
                        this.collisionHandler.handleCollisionCheckBox(
                            this.mouth[i].checkBoxes[j],
                            this.selectedDamage
                        );
                        shouldUpdate = true;
                    } else {
                        const d = {
                            tooth: "0",
                            damage: "",
                            diagnostic: this.selectedDamage,
                            surface: this.mouth[i].checkBoxes[j].id,
                            note: ""
                        };
                        this.createDiagnostico(d);
                    }
                }
            }
        }

        if (shouldUpdate) {
            this.update();
        }
    }

    onMouseClick(event) {
        console.log("Mouse click. which: " + event.which);

        if (!this.preview) {
            if (event.which === 3) {
                if (this.settings.HIHGLIGHT_SPACES) {
                    this.mouseRightClickSpace(event);
                } else {
                    this.mouseRightClickTooth(event);
                }
            } else if (event.which === 1) {
                if (this.settings.HIHGLIGHT_SPACES) {
                    this.mouseClickSpace(event);
                } else {
                    this.mouseClickTooth(event);
                }
            }
        }
    }

    followMouse(event) {
        this.cursorX = this.getXpos(event);
        this.cursorY = this.getYpos(event);
        this.update();
    }

    mouseMoveSpaces(event) {
        let update = false;

        for (let i = 0; i < this.spaces.length; i++) {
            if (this.spaces[i].checkCollision(this.getXpos(event), this.getYpos(event))) {
                this.spaces[i].onTouch(true);
                update = true;
            } else {
                this.spaces[i].onTouch(false);
            }
        }

        if (update) {
            this.update();
        }
    }

    mouseMoveTeeth(event) {
        for (let i = 0; i < this.mouth.length; i++) {
            if (this.mouth[i].textBox.rect.checkCollision(this.getXpos(event), this.getYpos(event))) {
                this.mouth[i].textBox.touching = true;
            } else {
                this.mouth[i].textBox.touching = false;
            }

            if (this.mouth[i].checkCollision(this.getXpos(event), this.getYpos(event))) {
                this.mouth[i].onTouch(true);

                if (this.multiSelect && this.multiSelection.length > 0) {
                    this.highlightMultiSelection(this.mouth[i]);
                }
            } else {
                this.mouth[i].onTouch(false);
            }

            for (let j = 0; j < this.mouth[i].checkBoxes.length; j++) {
                if (this.mouth[i].checkBoxes[j].checkCollision(this.getXpos(event), this.getYpos(event))) {
                    this.mouth[i].checkBoxes[j].touching = true;
                } else {
                    this.mouth[i].checkBoxes[j].touching = false;
                }
            }
        }
    }

    onMouseMove(event) {
        if (!this.preview) {
            if (this.settings.HIHGLIGHT_SPACES) {
                this.mouseMoveSpaces(event);
            } else {
                this.mouseMoveTeeth(event);
            }
        }
        this.followMouse(event);
    }

    reset() {
        for (let i = 0; i < this.mouth.length; i++) {
            this.mouth[i].damages.length = 0;
            this.mouth[i].textBox.text = "";

            for (let j = 0; j < this.mouth[i].checkBoxes.length; j++) {
                this.mouth[i].checkBoxes[j].state = 0;
            }
        }

        for (let i = 0; i < this.spaces.length; i++) {
            this.spaces[i].damages.length = 0;
        }

        this.update();
    }

    getData() {
        const list = [];

        // First: get data for adult odontograma
        for (let i = 0; i < this.odontSpacesAdult.length; i++) {
            const t1 = this.odontSpacesAdult[i];
            for (let j = 0; j < t1.damages.length; j++) {
                list.push({
                    tooth: t1.id,
                    damage: t1.damages[j].id,
                    diagnostic: "",
                    surface: "0",
                    note: ""
                });
            }
        }

        for (let i = 0; i < this.odontAdult.length; i++) {
            const t1 = this.odontAdult[i];

            if (t1.textBox.text !== "") {
                list.push({
                    tooth: t1.id,
                    damage: "",
                    diagnostic: "",
                    surface: "0",
                    note: t1.textBox.text
                });
            }

            for (let j = 0; j < t1.damages.length; j++) {
                list.push({
                    tooth: t1.id,
                    damage: "" + t1.damages[j].id,
                    diagnostic: "",
                    surface: "0",
                    note: ""
                });
            }

            for (let j = 0; j < t1.checkBoxes.length; j++) {
                if (t1.checkBoxes[j].state !== 0) {
                    list.push({
                        tooth: t1.id,
                        damage: t1.checkBoxes[j].state,
                        diagnostic: "",
                        surface: t1.checkBoxes[j].id,
                        note: t1.textBox.text
                    });
                }
            }
        }

        // Second: get data for child odontograma
        for (let i = 0; i < this.odontSpacesChild.length; i++) {
            const t1 = this.odontSpacesChild[i];
            for (let j = 0; j < t1.damages.length; j++) {
                list.push({
                    tooth: t1.id,
                    damage: t1.damages[j].id,
                    diagnostic: "",
                    surface: "0",
                    note: ""
                });
            }
        }

        for (let i = 0; i < this.odontChild.length; i++) {
            const t1 = this.odontChild[i];

            if (t1.textBox.text !== "") {
                list.push({
                    tooth: t1.id,
                    damage: "",
                    diagnostic: "",
                    surface: "0",
                    note: t1.textBox.text
                });
            }

            for (let j = 0; j < t1.damages.length; j++) {
                list.push({
                    tooth: t1.id,
                    damage: "" + t1.damages[j].id,
                    diagnostic: "",
                    surface: "0",
                    note: ""
                });
            }

            for (let j = 0; j < t1.checkBoxes.length; j++) {
                if (t1.checkBoxes[j].state !== 0) {
                    list.push({
                        tooth: t1.id,
                        damage: t1.checkBoxes[j].state,
                        diagnostic: "",
                        surface: t1.checkBoxes[j].id,
                        note: t1.textBox.text
                    });
                }
            }
        }

        return list;
    }

    save() {
        const link = document.createElement('a');
        const name = Date.now() + ".png";

        link.download = name;
        link.href = this.canvas.toDataURL("image/png")
            .replace("image/png", "image/octet-stream");

        link.click();
    }

    keyMapper(event) {
        let value = 0;

        if (event.key === "q") {
            value = 10;
        } else if (event.key === "w") {
            value = 11;
        } else if (event.key === "e") {
            value = 12;
        } else if (event.key === "r") {
            value = 13;
        } else if (event.key === "t") {
            value = 14;
        } else if (event.key === "y") {
            value = 15;
        } else if (event.key === "u") {
            value = 16;
        } else if (event.key === "i") {
            value = 17;
        } else if (event.key === "o") {
            value = 18;
        } else if (event.key === "p") {
            value = 19;
        } else if (event.key === "a") {
            value = 20;
        } else if (event.key === "s") {
            value = 21;
        } else if (event.key === "d") {
            value = 22;
        } else if (event.key === "f") {
            value = 23;
        } else if (event.key === "g") {
            value = 24;
        } else if (event.key === "h") {
            value = 25;
        } else if (event.key === "j") {
            value = 27;
        } else if (event.key === "k") {
            value = 28;
        } else if (event.key === "l") {
            value = 29;
        } else if (event.key === "x") {
            value = 30;
        } else if (event.key === "c") {
            value = 31;
        } else if (event.key === "b") {
            value = 32;
        } else if (event.key === "n") {
            value = 34;
        } else if (event.key === "m") {
            value = "DG990";
        }

        return value;
    }

    onButtonClick(event) {
        console.log("key " + event.key);

        if (event.key === "p") {
            this.print();
        }

        if (event.key === "v") {
            const data = this.getData();
            console.log("Data length: " + data.length);

            for (let i = 0; i < data.length; i++) {
                console.log(
                    "Data[" + i + "]: " + data[i].tooth + ", " +
                    data[i].damage + ", " + data[i].surface + ", " +
                    data[i].note
                );
            }
        } else if (event.key === "-") {
            this.togglePrintPreview();
        } else {
            if (event.key === ".") {
                this.currentType = 1;
                this.selectedDamage = "kb90";
            } else {
                this.currentType = 0;
                let damage;
                const key = Number(event.key);

                if (isNaN(key)) {
                    damage = this.keyMapper(event);
                } else {
                    damage = key;
                }

                this.setDamage(damage);

                if (event.key === "z") {
                    this.selectedDamage = 0;
                    this.reset();
                }

                // key combination Ctrl + Q to activate debug mode
                if ((event.which === 81 || event.keyCode === 81) && event.ctrlKey) {
                    this.settings.DEBUG = !this.settings.DEBUG;
                    this.update();
                }

                // key combination Ctrl + W to save the canvas as an image file
                if ((event.which === 81 || event.keyCode === 81) && event.shiftKey) {
                    this.settings.DEBUG = !this.settings.DEBUG;
                    this.save();
                }

                if (event.key === "ArrowLeft") {
                    this.adultShowing = true;
                    console.log("Setting odontograma to adult");
                    this.mouth = this.odontAdult;
                    this.spaces = this.odontSpacesAdult;
                    this.update();
                }

                if (event.key === "ArrowRight") {
                    this.adultShowing = false;
                    console.log("Setting odontograma to child");
                    this.mouth = this.odontChild;
                    this.spaces = this.odontSpacesChild;
                    this.update();
                }
            }
        }
    }

    setDamage(damage) {
        this.multiSelect = false;
        this.multiSelection.length = 0;

        console.log("Engine setting damage: " + damage);

        this.selectedDamage = parseInt(damage, 10) || 0;

        if (this.selectedDamage === this.constants.TRANSPOSICION_LEFT) {
            this.multiSelect = true;
            this.multiSelection.length = 0;
        }

        if (this.selectedDamage === this.constants.ORTODONTICO_FIJO_END) {
            this.multiSelect = true;
            this.multiSelection.length = 0;
        }

        if (this.selectedDamage === this.constants.PROTESIS_FIJA_LEFT) {
            this.multiSelect = true;
            this.multiSelection.length = 0;
        }

        if (this.selectedDamage === this.constants.SUPER_NUMERARIO) {
            this.settings.HIHGLIGHT_SPACES = true;
            this.update();
        }

        if (this.selectedDamage === this.constants.DIASTEMA) {
            this.settings.HIHGLIGHT_SPACES = true;
            this.update();
        }

        if (this.selectedDamage !== this.constants.DIASTEMA &&
            this.selectedDamage !== this.constants.SUPER_NUMERARIO) {
            this.settings.HIHGLIGHT_SPACES = false;
            this.update();
        }

        this.selectedDamage = damage;
    }

    changeView(which) {
        if (which === "1") {
            this.adultShowing = false;
            this.mouth = this.odontChild;
            this.spaces = this.odontSpacesChild;
            this.update();
        } else {
            this.adultShowing = true;
            this.mouth = this.odontAdult;
            this.spaces = this.odontSpacesAdult;
            this.update();
        }
    }

    start() {
        setTimeout(() => {
            this.update();
        }, 1500);
    }

    getToothById(id) {
        let tooth;

        for (let i = 0; i < this.mouth.length; i++) {
            if (this.mouth[i].id === id) {
                tooth = this.mouth[i];
                break;
            }
        }

        return tooth;
    }

    getSpaceById(id) {
        let space;

        for (let i = 0; i < this.spaces.length; i++) {
            if (this.spaces[i].id === id) {
                space = this.spaces[i];
                break;
            }
        }

        return space;
    }

    load(tooth, damage, surface, note) {
        // check if we should add damage to a tooth
        if (surface === "0") {
            // if id is less than 1000 then we have to find a tooth
            if (tooth < 1000) {
                const t = this.getToothById(tooth);
                this.collisionHandler.handleCollision(t, damage);
                this.setTextToTextBox(t.textBox, note);
            } else {
                // if the id is greater than 1000
                // then we have to find a space
                this.collisionHandler.handleCollision(this.getSpaceById(tooth), damage);
            }
        } else {
            // the damage should be added to a surface of a tooth
            const surfaceId = tooth + "_" + surface;
            const t = this.getToothById(tooth);
            const surfaceObj = t.getSurfaceById(surfaceId);

            this.collisionHandler.handleCollisionCheckBox(surfaceObj, damage);
            this.setTextToTextBox(t.textBox, note);
        }
    }

    setDataSource(dataArray) {
        const res = dataArray.split(",");

        let i = 0;
        while (i < res.length) {
            // loop through all and add damage
            this.load(Number(res[i]), Number(res[i + 1]), res[i + 2], res[i + 3]);
            i = i + 4;
        }
    }

    createDiagnostico(diagnostico) {
        console.log("Diagnostico: " + JSON.stringify(diagnostico));
    }

    togglePrintPreview() {
        this.preview = !this.preview;

        if (!this.preview) {
            this.hidePrintPreview();
        } else {
            this.showPrintPreview();
        }
    }

    showPrintPreview() {
        // reset the size of the canvas
        this.renderer.setCanvasSize(this.renderer.width, 1420);

        console.log("Print preview");

        for (let i = 0; i < this.odontAdult.length; i++) {
            if (this.odontAdult[i].type === 1) {
                this.odontAdult[i].moveUpDown(this.printPreviewPositionChange * 2 + 120);
                this.odontAdult[i].textBox.rect.y += 20;
            } else {
                this.odontAdult[i].moveUpDown(120);
                this.odontAdult[i].textBox.rect.y -= 20;
            }
        }

        for (let i = 0; i < this.odontSpacesAdult.length; i++) {
            if (this.odontSpacesAdult[i].type === 1) {
                this.odontSpacesAdult[i].moveUpDown(this.printPreviewPositionChange * 2 + 120);
            } else {
                this.odontSpacesAdult[i].moveUpDown(120);
            }
        }

        for (let i = 0; i < this.odontChild.length; i++) {
            this.odontChild[i].moveUpDown(this.printPreviewPositionChange + 120);

            if (this.odontChild[i].type === 0) {
                this.odontChild[i].textBox.rect.y -= this.printPreviewPositionChange;
            } else {
                this.odontChild[i].textBox.rect.y += this.printPreviewPositionChange;
            }
        }

        for (let i = 0; i < this.odontSpacesChild.length; i++) {
            this.odontSpacesChild[i].moveUpDown(this.printPreviewPositionChange + 120);
        }

        this.update();
    }

    hidePrintPreview() {
        // update size of the canvas
        this.renderer.setCanvasSize(this.renderer.width, this.renderer.height);

        console.log("Print preview");

        for (let i = 0; i < this.odontAdult.length; i++) {
            if (this.odontAdult[i].type === 1) {
                this.odontAdult[i].moveUpDown(-this.printPreviewPositionChange * 2 - 120);
                this.odontAdult[i].textBox.rect.y -= 20;
            } else {
                this.odontAdult[i].moveUpDown(-120);
                this.odontAdult[i].textBox.rect.y += 20;
            }
        }

        for (let i = 0; i < this.odontSpacesAdult.length; i++) {
            if (this.odontSpacesAdult[i].type === 1) {
                this.odontSpacesAdult[i].moveUpDown(-this.printPreviewPositionChange * 2 - 120);
            } else {
                this.odontSpacesAdult[i].moveUpDown(-120);
            }
        }

        for (let i = 0; i < this.odontChild.length; i++) {
            this.odontChild[i].moveUpDown(-this.printPreviewPositionChange - 120);

            if (this.odontChild[i].type === 0) {
                this.odontChild[i].textBox.rect.y += this.printPreviewPositionChange;
            } else {
                this.odontChild[i].textBox.rect.y -= this.printPreviewPositionChange;
            }
        }

        for (let i = 0; i < this.odontSpacesChild.length; i++) {
            this.odontSpacesChild[i].moveUpDown(-this.printPreviewPositionChange - 120);
        }

        for (let i = 0; i < this.odontAdult.length; i++) {
            this.odontAdult[i].refresh();
        }

        for (let i = 0; i < this.odontChild.length; i++) {
            this.odontChild[i].refresh();
        }

        this.update();
    }

    loadPatientData(office, patient, number, treatmentNumber, treatmentDate, dentist, observations, specs) {
        this.treatmentData.office = office;
        this.treatmentData.patient = patient;
        this.treatmentData.number = number;
        this.treatmentData.treatmentNumber = treatmentNumber;
        this.treatmentData.treatmentDate = treatmentDate;
        this.treatmentData.dentist = dentist;
        this.treatmentData.observations = observations;
        this.treatmentData.specs = specs;
    }

    createHeader() {
        let seperation = 18;

        this.renderer.renderTextCenter16("Odontogram", this.renderer.width / 2, seperation, "#000000");

        seperation = 20;

        this.renderer.renderText14("Office", 4, seperation * 2, "#000000");
        this.renderer.renderText14(": " + this.treatmentData.office, 100, seperation * 2, "#000000");

        this.renderer.renderText14("Patient", 4, seperation * 3, "#000000");
        this.renderer.renderText14(": " + this.treatmentData.patient, 100, seperation * 3, "#000000");

        this.renderer.renderText14("Appoint No.", 4, seperation * 4, "#000000");
        this.renderer.renderText14(": " + this.treatmentData.treatmentNumber, 100, seperation * 4, "#000000");

        this.renderer.renderText14("Date", this.renderer.width / 2, seperation * 4, "#000000");
        this.renderer.renderText14(": " + this.treatmentData.treatmentDate, this.renderer.width / 2 + 120, seperation * 4, "#000000");

        this.renderer.renderText14("Dentist", 4, seperation * 5, "#000000");
        this.renderer.renderText14(": " + this.treatmentData.dentist, 100, seperation * 5, "#000000");
    }

    printPreview() {
        this.renderer.clear(this.settings);
        this.createHeader();

        this.renderer.render(this.odontAdult, this.settings, this.constants);
        this.renderer.render(this.odontSpacesAdult, this.settings, this.constants);
        this.renderer.render(this.odontChild, this.settings, this.constants);
        this.renderer.render(this.odontSpacesChild, this.settings, this.constants);

        if (this.settings.DEBUG) {
            this.renderer.renderText("DEBUG MODE", 2, 15, "#000000");
            this.renderer.renderText("X: " + this.cursorX + ", Y: " + this.cursorY, 128, 15, "#000000");
        }

        this.renderer.renderText("Specifications: ", 4, 1200, "#000000");
        this.renderer.wrapText(this.treatmentData.specs, 8, 1222, this.renderer.width - 8, 14, 5);

        this.renderer.renderText("Observations: ", 4, 1300, "#000000");
        this.renderer.wrapText(this.treatmentData.observations, 8, 1322, this.renderer.width - 8, 14, 5);
    }

    print() {
        const dataUrl = document.getElementById('canvas').toDataURL();

        let windowContent = '<!DOCTYPE html>';
        windowContent += '<html lang="en">';
        windowContent += '<head>';
        windowContent += '<meta charset="utf-8"/>';
        windowContent += '<title>OIM Odontograma</title>';
        windowContent += '</head>';
        windowContent += '<body>';
        windowContent += '<p style="text-align: center;"><img src="' + dataUrl + '"></p>';
        windowContent += '</body>';
        windowContent += '</html>';

        const printWin = window.open('', '', 'width=' + screen.availWidth + ',height=' + screen.availHeight);
        printWin.document.open();
        printWin.document.write(windowContent);

        printWin.document.addEventListener('load', () => {
            printWin.focus();
            printWin.print();
            printWin.document.close();
            printWin.close();
        }, true);

        this.preview = false;
        this.hidePrintPreview();
    }
}
