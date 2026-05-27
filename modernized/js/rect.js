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

/**
 * Class for a rectangle
 */
export default class Rect {
    constructor() {
        this.id = "";
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.state = 0;
        this.touching = false;
    }

    cavity() {
        this.state = 1;
    }

    restoration() {
        this.state = 11;
    }

    uncheck() {
        this.state = 0;
    }

    /**
     * Method to check if a point is inside the rectangle
     * @param {number} cursX x coordinate of point
     * @param {number} cursY y coordinate of point
     * @returns {boolean} true if collision, false else
     */
    checkCollision(cursX, cursY) {
        let collision = false;

        if (cursX > this.x) {
            if (cursY > this.y) {
                if (cursX < this.x + this.width) {
                    if (cursY < this.y + this.height) {
                        collision = true;
                        console.log("Collision cb: " + this.id);
                    }
                }
            }
        }

        return collision;
    }

    /**
     * Method to highlight the checkbox
     * @param {CanvasRenderingContext2D} context canvas to draw on
     * @param {object} settings global highlight color of checkbox
     */
    highlight(context, settings) {
        context.beginPath();
        context.globalAlpha = 0.4;
        context.fillStyle = settings.COLOR_ON_TOUCH;
        context.fillRect(this.x, this.y, this.width, this.height);
        context.globalAlpha = 1;
        context.restore();
    }

    /**
     * Method to highlight the checkbox with a specific color
     * @param {CanvasRenderingContext2D} context canvas to draw on
     * @param {string} color the color of the highlight
     * @param {number} alpha alpha value of the color
     */
    highlightWithColor(context, color, alpha) {
        context.beginPath();
        context.globalAlpha = alpha;
        context.fillStyle = color;
        context.fillRect(this.x, this.y, this.width, this.height);
        context.globalAlpha = 1;
        context.restore();
    }

    /**
     * Method to outline the rectangle with a specific color
     * @param {CanvasRenderingContext2D} context canvas to draw on
     * @param {string} color the color for the outline
     */
    outline(context, color) {
        context.beginPath();
        context.lineWidth = 1;
        context.globalAlpha = 1;
        context.strokeStyle = color;
        context.rect(this.x, this.y, this.width, this.height);
        context.stroke();
        context.restore();
    }

    /**
     * Method to draw an ellipse with center of rectangle center
     * @param {CanvasRenderingContext2D} context the canvas to draw on
     * @param {string} color the color of the ellipse
     * @param {number} alpha the alpha value of the color
     * @param {number} [padding=0] padding for the ellipse
     */
    highlightEllipse(context, color, alpha, padding = 0) {
        context.beginPath();
        context.globalAlpha = alpha;
        context.fillStyle = color;
        
        context.ellipse(
            this.x + this.width / 2, 
            this.y + this.height / 2, 
            (this.width - padding) / 2, 
            (this.height - padding) / 2, 
            0,
            0,
            2 * Math.PI
        );
                        
        context.fill();
        context.globalAlpha = 1;
        context.restore();
    }

    /**
     * Method to fill rectangle with color
     * @param {CanvasRenderingContext2D} context the canvas to draw on
     * @param {string} color the color of the rectangle
     */
    fillColor(context, color) {
        context.beginPath();
        context.fillStyle = color;
        context.fillRect(this.x, this.y, this.width, this.height);
        context.restore();
        context.stroke();
        context.restore();
    }
}
