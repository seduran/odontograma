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
import TextBox from './textBox.js';
import Damage from './damage.js';

/**
 * Base class for tooth
 */
export default class Tooth {
    constructor() {
        this.id = 0;
        this.tooth = true;
        this.surfaces = 0;
        this.highlight = false;
        this.highlightColor = "";
        this.damages = [];
        this.checkBoxes = [];
        this.rect = new Rect();
        this.textBox = new TextBox();
        this.spacer = 20; // spacer to seperate tooth from surfaces
        this.touching = false;
        this.address = 0;
        this.normalY = null;
        this.highY = null;
        this.blocked = false;
        this.constants = null;
        this.y = 0;
        this.type = 0;
    }

    /**
     * Method to set up position and dimension of the Tooth
     * @param {number} x position
     * @param {number} y position
     * @param {number} width 
     * @param {number} height
     */
    setDimens(x, y, width, height) {
        this.y = y; // y variable to help with animations, on mouse hover

        this.rect.x = x;
        this.rect.y = y;
        this.rect.width = width;
        this.rect.height = height;

        this.normalY = y;

        this.textBox.setDimens(x, y, width, 20);
        this.textBox.setLabel(this.id);
    }

    /**
     * Method to set the type of the tooth
     * @param {number} type of the tooth, upper (0) or lower (1)
     */
    setType(type) {
        this.type = type;

        if (type === 0) {
            this.highY = this.rect.y - 10;
            this.textBox.rect.y = this.rect.y - 42;
        } else {
            this.highY = this.rect.y + 10;
            this.textBox.rect.y = this.rect.y + this.rect.height + 22;
        }
    }

    /**
     * Method to set a reference to constants
     * @param {object} constants
     */
    setConstants(constants) {
        this.constants = constants;
    }

    /**
     * Method to check for collision
     * @param {number} eX x coordinates of event
     * @param {number} eY y coordinates of event
     * @returns {boolean} true if collision, else false
     */
    checkCollision(eX, eY) {
        return this.rect.checkCollision(eX, eY);
    }

    /**
     * Method to set surfaces for the tooth, 4 or 5
     * @param {number} surfaces
     */
    setSurfaces(surfaces) {
        this.surfaces = surfaces;
    }

    toggleSelected(selected) {
        this.highlight = selected;
    }

    /**
     * Method to create 4 surfaces for the tooth, 4 checkboxes
     * @param {object} settings global settings 
     */
    create4Surfaces(settings) {
        const width = settings.RECT_DIMEN;
        const startX = this.rect.x + 10;

        if (this.type === 0) {
            const rect1 = new Rect();
            rect1.width = width;
            rect1.height = width;
            rect1.x = startX;
            rect1.y = this.rect.y + this.rect.height + width;
            rect1.id = this.id + "_M";
            this.checkBoxes.push(rect1);

            const rect2 = new Rect();
            rect2.width = width;
            rect2.height = width;
            rect2.x = startX + width;
            rect2.y = this.rect.y + this.rect.height + width;
            rect2.id = this.id + "_D";
            this.checkBoxes.push(rect2);

            const rect3 = new Rect();
            rect3.width = width;
            rect3.height = width;
            rect3.x = startX + 5;
            rect3.y = this.rect.y + this.rect.height;
            rect3.id = this.id + "_V";
            this.checkBoxes.push(rect3);

            const rect4 = new Rect();
            rect4.width = width;
            rect4.height = width;
            rect4.x = startX + 5;
            rect4.y = this.rect.y + this.rect.height + width * 2;
            rect4.id = this.id + "_L";
            this.checkBoxes.push(rect4);
        } else {
            const rect1 = new Rect();
            rect1.width = width;
            rect1.height = width;
            rect1.x = startX;
            rect1.y = this.rect.y - width * 2;
            rect1.id = this.id + "_M";
            this.checkBoxes.push(rect1);

            const rect2 = new Rect();
            rect2.width = width;
            rect2.height = width;
            rect2.x = startX + width;
            rect2.y = this.rect.y - width * 2;
            rect2.id = this.id + "_D";
            this.checkBoxes.push(rect2);

            const rect3 = new Rect();
            rect3.width = width;
            rect3.height = width;
            rect3.x = startX + 5;
            rect3.y = this.rect.y - width;
            rect3.id = this.id + "_L";
            this.checkBoxes.push(rect3);

            const rect4 = new Rect();
            rect4.width = width;
            rect4.height = width;
            rect4.x = startX + 5;
            rect4.y = this.rect.y - width * 3;
            rect4.id = this.id + "_V";
            this.checkBoxes.push(rect4);
        }
    }

    /**
     * Method to create 5 surfaces for the tooth, 5 checkboxes
     * @param {object} settings global settings 
     */
    create5Surfaces(settings) {
        const width = settings.RECT_DIMEN;
        const startX = this.rect.x + 5;

        if (this.type === 0) {
            const rect1 = new Rect();
            rect1.width = width;
            rect1.height = width;
            rect1.x = startX;
            rect1.y = this.rect.y + this.rect.height + width;
            rect1.id = this.id + "_M";
            this.checkBoxes.push(rect1);

            const rect2 = new Rect();
            rect2.width = width;
            rect2.height = width;
            rect2.x = startX + width;
            rect2.y = this.rect.y + this.rect.height + width;
            rect2.id = this.id + "_0";
            this.checkBoxes.push(rect2);

            const rect3 = new Rect();
            rect3.width = width;
            rect3.height = width;
            rect3.x = startX + width * 2;
            rect3.y = this.rect.y + this.rect.height + width;
            rect3.id = this.id + "_D";
            this.checkBoxes.push(rect3);

            const rect4 = new Rect();
            rect4.width = width;
            rect4.height = width;
            rect4.x = startX + width;
            rect4.y = this.rect.y + this.rect.height;
            rect4.id = this.id + "_V";
            this.checkBoxes.push(rect4);

            const rect5 = new Rect();
            rect5.width = width;
            rect5.height = width;
            rect5.x = startX + width;
            rect5.y = this.rect.y + this.rect.height + width * 2;
            rect5.id = this.id + "_L";
            this.checkBoxes.push(rect5);
        } else {
            const rect1 = new Rect();
            rect1.width = width;
            rect1.height = width;
            rect1.x = startX;
            rect1.y = this.rect.y - width * 2;
            rect1.id = this.id + "_M";
            this.checkBoxes.push(rect1);

            const rect2 = new Rect();
            rect2.width = width;
            rect2.height = width;
            rect2.x = startX + width;
            rect2.y = this.rect.y - width * 2;
            rect2.id = this.id + "_0";
            this.checkBoxes.push(rect2);

            const rect3 = new Rect();
            rect3.width = width;
            rect3.height = width;
            rect3.x = startX + width * 2;
            rect3.y = this.rect.y - width * 2;
            rect3.id = this.id + "_D";
            this.checkBoxes.push(rect3);

            const rect4 = new Rect();
            rect4.width = width;
            rect4.height = width;
            rect4.x = startX + width;
            rect4.y = this.rect.y - width;
            rect4.id = this.id + "_L";
            this.checkBoxes.push(rect4);

            const rect5 = new Rect();
            rect5.width = width;
            rect5.height = width;
            rect5.x = startX + width;
            rect5.y = this.rect.y - width * 3;
            rect5.id = this.id + "_V";
            this.checkBoxes.push(rect5);
        }
    }

    /**
     * Base method for setting the surfaces for a tooth
     * @param {object} settings global settings 
     */
    createSurfaces(settings) {
        if (this.surfaces === 4) {
            this.create4Surfaces(settings);
        } else {
            this.create5Surfaces(settings);
        }
    }

    /**
     * Method to draw the id for the tooth
     * @param {CanvasRenderingContext2D} context the canvas to draw on
     */
    drawId(context) {
        context.beginPath();
        context.textAlign = 'center';
        context.fillStyle = "#000000";
        context.font = "15px Arial Bold";

        const space = 40;

        if (this.type === 0) {
            // draw id
            context.fillText("" + this.id, this.rect.x + this.rect.width / 2,
                    this.y + this.rect.height + space + 10);

            // draw id border
            context.moveTo(this.rect.x, this.y + this.rect.height + space + 20);
            context.lineTo(this.rect.x + this.rect.width,
                    this.y + this.rect.height + space + 20);

            context.moveTo(this.rect.x + this.rect.width,
                    this.y + this.rect.height + space + 20);
            context.lineTo(this.rect.x + this.rect.width,
                    this.y + this.rect.height + space);
        } else {
            // draw id
            context.fillText("" + this.id, this.rect.x + this.rect.width / 2,
                    this.y - space - 5);

            // draw id border
            context.moveTo(this.rect.x, this.y - space - 20);
            context.lineTo(this.rect.x + this.rect.width, this.y - space - 20);

            context.moveTo(this.rect.x + this.rect.width, this.y - space - 20);
            context.lineTo(this.rect.x + this.rect.width, this.y - space);
        }

        context.lineWidth = 1;
        context.strokeStyle = '#000000';
        context.stroke();
        context.restore();
    }

    /**
     * Method to draw the checkboxes for the tooth
     * @param {CanvasRenderingContext2D} context the canvas to draw on
     * @param {object} settings global settings
     */
    drawCheckBoxes(context, settings) {
        for (let i = 0; i < this.checkBoxes.length; i++) {
            if (this.checkBoxes[i].state === 1) {
                this.checkBoxes[i].fillColor(context, settings.COLOR_RED);
                this.checkBoxes[i].outline(context, "#000000");
            } else if (this.checkBoxes[i].state === 11) {
                this.checkBoxes[i].fillColor(context, settings.COLOR_BLUE);
                this.checkBoxes[i].outline(context, "#000000");
            } else {
                this.checkBoxes[i].outline(context, "#000000");
            }
        }
    }

    /**
     * Method to draw a text box for the tooth
     * @param {CanvasRenderingContext2D} context the canvas to draw on
     * @param {object} settings global settings
     */
    drawTextBox(context, settings) {
        this.textBox.render(context, settings.COLOR_BLUE);

        if (this.textBox.touching) {
            this.textBox.rect.highlightWithColor(context, "#36BE1B", 0.6);
        }
    }

    /**
     * Method to toggle Touching on / off
     * @param {boolean} touch boolean value 
     */
    onTouch(touch) {
        if (this.tooth) {
            if (touch) {
                this.rect.y = this.highY;
            } else {
                this.rect.y = this.normalY;
            }
        }
        
        this.rect.touching = touch;
    }

    /**
     * Method to generate a damage for the tooth.
     * @param {number} damageId the id of the damage to create
     * @returns {Damage} damage which can be drawn
     */
    createDamage(damageId) {
        let damage;

        if (this.constants.isDiagnostic(damageId)) {
            // attach damage in the proper position
            // first check if the damage should be positioned in the checkboxes area
            if (damageId === this.constants.DIENTE_EN_CLAVIJA ||
                    damageId === this.constants.FUSION ||
                    damageId === this.constants.CORONA_DEFINITIVA ||
                    damageId === this.constants.CORONA_TEMPORAL) {

                // set the damage to proper position
                if (this.type === 0) {
                    damage = new Damage(damageId,
                            this.rect.x,
                            this.y + this.rect.height,
                            this.rect.width,
                            60,
                            this.type);
                } else {
                    damage = new Damage(damageId,
                            this.rect.x,
                            this.y - 60,
                            this.rect.width,
                            60,
                            this.type);
                }
            } else if (this.constants.isWritable(damageId)) {
                // damage should be attached to the textBox area
                damage = new Damage(damageId,
                        this.textBox.rect.x,
                        this.textBox.rect.y,
                        this.textBox.rect.width,
                        this.textBox.rect.height,
                        this.type);
            } else {
                // damage should be attached on the tooth
                damage = new Damage(damageId,
                        this.rect.x,
                        this.y,
                        this.rect.width,
                        this.rect.height,
                        this.type);
            }
        } else {
            // set the damage to proper position
            if (this.type === 0) {
                damage = new Damage(damageId,
                        this.rect.x,
                        this.y + this.rect.height,
                        this.rect.width,
                        60,
                        this.type);
            } else {
                damage = new Damage(damageId,
                        this.rect.x,
                        this.y - 60,
                        this.rect.width,
                        60,
                        this.type);
            }

            damage.setDiagnostic();
        }

        return damage;
    }

    /**
     * Method to toggle damage on a tooth on off
     * @param {number} damageId to add or remove
     */
    toggleDamage(damageId) {
        console.log("Toggle damage for " + this.id + ", damage " + damageId);

        // if there are no damages, then add.
        if (this.damages.length < 1) {
            const d = this.createDamage(damageId);

            if (d !== undefined) {
                this.damages.push(d);
            }
        } else {
            // if this tooth has damages, check for duplicates
            let exists = false;
            let splicer = -1;

            // check to see if this damage exists
            for (let i = 0; i < this.damages.length; i++) {
                // found this damage
                if (this.damages[i].id === damageId) {
                    console.log("Splicing array for tooth " + this.id);
                    splicer = i;
                    exists = true;
                    break;
                }
            }

            // check if damage exists
            if (!exists) {
                // damage is new, so add it
                const d = this.createDamage(damageId);

                if (d !== undefined) {
                    this.damages.push(d);
                }
            } else {
                // if damage already exists, then we remove it
                this.damages.splice(splicer, 1);
            }
        }
    }

    /**
     * Method to render a Tooth on the screen with all its states
     * @param {CanvasRenderingContext2D} context the canvas to draw on
     * @param {object} settings app settings
     * @param {object} constants application constants
     */
    render(context, settings, constants) {
        // check if this is a tooth or a space
        if (this.tooth) {
            this.textBox.drawLabel(context);

            // draw the image of the tooth
            if (this.image !== undefined) {
                // center of tooth
                const cx = (this.rect.x + this.rect.width / 2);

                // centering of the tooth in x axis
                const dx = cx - this.image.naturalWidth / 2;

                // draw tooth
                context.drawImage(this.image, dx, this.rect.y);
            }

            // id
            this.drawId(context);

            // checkboxes
            this.drawCheckBoxes(context, settings);

            if (this.highlight) {
                this.rect.highlightWithColor(context, this.highlightColor, 0.3);
            }
        } else {
            // highlight the spaces between the teeths
            if (settings.HIHGLIGHT_SPACES) {
                if (this.rect.touching) {
                    this.rect.highlightEllipse(context, "#00AEFF", 0.5, -10);
                } else {
                    this.rect.highlightEllipse(context, "#19B900", 0.2, 10);
                }
            }
        }

        // draw all damages
        for (let i = 0; i < this.damages.length; i++) {
            this.damages[i].render(context, settings, constants);
        }

        // highlight textboxes
        for (let i = 0; i < this.checkBoxes.length; i++) {
            if (this.checkBoxes[i].touching) {
                this.checkBoxes[i].highlightWithColor(context, "#36BE1B", 0.6);
            }
        }

        // Draw textboxes
        if (this.tooth) {
            this.drawTextBox(context, settings);
        }

        // show area of tooth or space, only in DEBUG MODE
        if (settings.DEBUG) {
            if (this.tooth) {
                this.rect.outline(context, "#000000");
            } else {
                this.rect.highlightEllipse(context, "#FFD100", 0.4, 2);
            }
        }
    }

    /**
     * Method to get a surface (checkbox) by id
     * @param {string} id the id of the textbox to find
     * @returns {Rect|undefined} returns a rect if found, else undefined
     */
    getSurfaceById(id) {
        let surface;

        for (let i = 0; i < this.checkBoxes.length; i++) {
            if (this.checkBoxes[i].id === id) {
                surface = this.checkBoxes[i];
                break;
            }
        }

        return surface;
    }

    /**
     * Method to move a tooth up and down the Y axis
     * @param {number} movement amount of pixels to move the tooth
     */
    moveUpDown(movement) {
        this.normalY += movement;
        this.y += movement;
        this.rect.y += movement;

        this.textBox.rect.y += movement;

        for (let i = 0; i < this.checkBoxes.length; i++) {
            this.checkBoxes[i].y += movement;
        }

        for (let i = 0; i < this.damages.length; i++) {
            this.damages[i].rect.y += movement;
        }
    }

    /**
     * Method to pop the last item of the damages array
     */
    popDamage() {
        const tail = this.damages.length - 1; // last item

        if (tail >= 0) {
            this.damages.splice(tail, 1);
        }
    }

    refresh(constants) {
        for (let i = 0; i < this.damages.length; i++) {
            if (this.constants.isWritable(this.damages[i].id)) {
                // damage should be attached to the textBox area
                this.damages[i].rect.x = this.textBox.rect.x;
                this.damages[i].rect.y = this.textBox.rect.y;
            }
        }

        this.rect.y = this.normalY;
        this.touching = false;

        this.textBox.touching = false;

        for (let i = 0; i < this.checkBoxes.length; i++) {
            this.checkBoxes[i].touching = false;
        }
    }
}
