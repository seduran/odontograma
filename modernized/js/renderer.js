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
 * Helper class for drawing items on a canvas
 */
export default class Renderer {
    constructor() {
        this.context = null;
        this.width = 0;
        this.height = 0;
        this.settings = null;
    }

    /**
     * Method to initialize the renderer for drawing the odontograma
     * @param {HTMLCanvasElement} canvas the canvas to draw on
     */
    init(canvas) {
        this.context = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
    }

    /**
     * Method to clear the canvas
     * @param {object} settings for color, and debug state
     */
    clear(settings) {
        if (settings.DEBUG) {
            this.context.fillStyle = "#e6fff3";
        } else {
            this.context.fillStyle = "#ffffff";
        }

        this.context.fillRect(
            0,
            0,
            this.context.canvas.width,
            this.context.canvas.height
        );

        this.context.restore();
    }

    /**
     * Method to render odontograma
     * @param {Array} data list of teeth for odontograma
     * @param {object} settings for the canvas
     * @param {object} constants which are used for the engine
     */
    render(data, settings, constants) {
        for (let i = 0; i < data.length; i++) {
            data[i].render(this.context, settings, constants);
        }
    }

    /**
     * Method to render text on canvas
     * @param {string} text the text to render
     * @param {number} x position on canvas
     * @param {number} y position on canvas
     * @param {string} [color="#000000"] the color which the text should be
     */
    renderText(text, x, y, color = "#000000") {
        this.context.textAlign = 'left';
        this.context.fillStyle = color;
        this.context.fillText(text, x, y);
        this.context.restore();
    }

    renderText14(text, x, y, color = "#000000") {
        this.context.font = "14px Arial";
        this.context.textAlign = 'left';
        this.context.fillStyle = color;
        this.context.fillText(text, x, y);
        this.context.restore();
    }

    renderNameValueTabbed(name, value, tab, x, y, color = "#000000") {
        this.context.font = "14px Arial";
        let text = name;

        for (let i = 0; i < tab; i++) {
            text += "\t";
        }

        text += value;

        this.context.textAlign = 'left';
        this.context.fillStyle = color;
        this.context.fillText(text, x, y);
        this.context.restore();
    }

    renderTextCenter(text, x, y, color = "#000000") {
        this.context.textAlign = 'center';
        this.context.fillStyle = color;
        this.context.fillText(text, x, y);
        this.context.restore();
    }

    renderTextCenter16(text, x, y, color = "#000000") {
        this.context.font = "16px Arial Bold";
        this.context.textAlign = 'center';
        this.context.fillStyle = color;
        this.context.fillText(text, x, y);
        this.context.restore();
    }

    /**
     * Method to set app settings to the renderer
     * @param {object} settings the settings for the application
     */
    setSettings(settings) {
        this.settings = settings;
    }

    /**
     * Method to change the size of the canvas
     * @param {number} width new width of the canvas
     * @param {number} height new height of the canvas
     */
    setCanvasSize(width, height) {
        this.context.canvas.width = width;
        this.context.canvas.height = height;
    }

    wrapText(text, x, y, maxWidth, lineHeight, maxLines) {
        const input = text.toString();
        const words = input.split(" ");
        let line = "";
        let lineNumber = 1;

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + " ";
            const metrics = this.context.measureText(testLine);
            const testWidth = metrics.width;

            if (testWidth > maxWidth && n > 0) {
                this.renderText(line, x, y, "#000000");
                line = words[n] + " ";
                y += lineHeight;
                lineNumber++;
            } else {
                line = testLine;
            }

            if (lineNumber > maxLines) {
                break;
            }
        }

        this.renderText(line, x, y, "#000000");
    }

    drawImage(src, x, y, width, height) {
        this.context.drawImage(src, x, y, width, height);
    }
}
