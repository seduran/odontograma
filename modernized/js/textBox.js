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

import Rect from './rect.js';

/**
 * Class which represents a simple textbox
 */
export default class TextBox {
    constructor() {
        this.text = "";
        this.rect = new Rect();
        this.touching = false;
        this.label = "";
    }

    /**
     * Set the dimension of the rectangle
     * @param {number} x position in canvas
     * @param {number} y position in canvas
     * @param {number} width of rectangle
     * @param {number} height of rectangle
     */
    setDimens(x, y, width, height) {
        this.rect.x = x;
        this.rect.y = y;
        this.rect.width = width;
        this.rect.height = height;
        this.text = "";
        this.label = "";
    }

    /**
     * Method to set the text which should be displayed in the textbox
     * @param {string} text string to draw
     */
    setText(text) {
        this.text = text;
    }

    /**
     * Method to set the label of the textbox
     * @param {string} label label to set
     */
    setLabel(label) {
        this.label = label;
    }

    /**
     * Draw a text label on the textbox
     * @param {CanvasRenderingContext2D} context
     */
    drawLabel(context) {
        this.rect.outline(context, "#000000");

        context.beginPath();
        context.textAlign = "center";
        context.fillStyle = "#9a9a9a";
        context.font = "11px Arial";

        context.fillText(
            this.label,
            this.rect.x + this.rect.width / 2,
            this.rect.y + this.rect.height - 4
        );

        context.stroke();
        context.restore();
    }

    /**
     * Draw a text on textbox
     * @param {CanvasRenderingContext2D} context canvas to draw on
     * @param {string} color color of the text to draw
     */
    drawText(context, color) {
        context.beginPath();

        // if there is text, create a white background
        // to clear the area of the text box
        if (this.text !== "") {
            context.fillStyle = "#ffffff";
            context.fillRect(
                this.rect.x,
                this.rect.y,
                this.rect.width,
                this.rect.height
            );
        }

        this.rect.outline(context, "#000000");
        
        context.textAlign = "center";
        context.fillStyle = color;
        context.font = "13px Arial";

        context.fillText(
            this.text,
            this.rect.x + this.rect.width / 2,
            this.rect.y + this.rect.height - 4
        );

        context.stroke();
        context.restore();
    }

    /**
     * Method to draw the textbox onto a canvas
     * @param {CanvasRenderingContext2D} context the canvas to draw on
     * @param {string} color the color of the text
     */
    render(context, color) {
        this.drawText(context, color);
    }

    /**
     * Set note (uppercased text)
     * @param {string} note the note content
     */
    setNote(note) {
        this.text = note.toUpperCase();
    }
}
