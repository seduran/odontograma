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

import Tooth from './tooth.js';

/**
 * Helper class for creating a Odontograma
 */
export default class OdontogramaGenerator {
    constructor() {
        // variable for how many images have been loaded
        this.currentLoad = 0;

        // variable for how many teeths are in array
        this.arrayCount = 0;
        this.seperator = 210;
        this.imgWidth = 40;
        this.imgHeight = 90;
        this.engine = null;
        this.settings = null;
        this.constants = null;
    }

    /**
     * Method to set reference to the engine which uses this odontograma
     * @param {object} engine
     */
    setEngine(engine) {
        this.engine = engine;
    }

    /** 
     * Method to set reference to settings
     * @param {object} settings application settings
     */
    setSettings(settings) {
        this.settings = settings;
    }

    /**
     * Method to set reference to constants
     * @param {object} constants application constants
     */
    setConstants(constants) {
        this.constants = constants;
    }

    /**
     * Method to update the count of images which have been loaded
     */
    updateLoad() {
        this.currentLoad = this.currentLoad + 1;

        // notify when all images have been loaded
        if (this.currentLoad >= this.arrayCount) {
            this.engine.start();
        }
    }

    /**
     * Helper method to generate and position a tooth
     */
    generateTooth(id, type, surfaces, x, y, odontograma) {
        const tooth = new Tooth();
        tooth.setConstants(this.constants);
        tooth.setSurfaces(surfaces);

        const image = new Image();
        image.onload = () => {
            this.updateLoad();
        };
        image.src = `images/dentadura-${type === 0 ? "sup" : "inf"}-${id}.png`;

        tooth.id = id;
        tooth.image = image;
        tooth.setDimens(x, y, this.imgWidth, this.imgHeight);
        tooth.setType(type);

        odontograma[this.arrayCount] = tooth;
        tooth.address = this.arrayCount;
        this.arrayCount++;

        tooth.createSurfaces(this.settings);
        return tooth;
    }

    /**
     * Helper method to create a space between teeth
     */
    generateSpace(id, tooth, spaces) {
        const space = new Tooth();
        space.setConstants(this.constants);
        space.setSurfaces(5);
        space.id = id;
        space.setDimens(
            tooth.rect.x + tooth.rect.width / 2,
            tooth.rect.y,
            tooth.rect.width,
            tooth.rect.height
        );
        space.type = tooth.type;
        space.tooth = false;
        spaces.push(space);
    }

    /**
     * Method to prepare an Odontograma for an adult, 32 teeth
     * @param {Array} odontograma array which holds all 32 teeth
     * @param {Array} spaces array to hold all the spaces between teeth
     * @param {HTMLCanvasElement} canvas the canvas where the odontograma will be drawn
     */
    prepareOdontogramaAdult(odontograma, spaces, canvas) {
        this.arrayCount = 0;

        // center the odontograma horizontally
        const width = canvas.width;
        const odontWidth = 16 * this.imgWidth;
        const start = (width - odontWidth) / 2;
        let x = start;

        // center vertically
        const height = canvas.height;
        const odontHeight = 2 * 150;
        const base = (height - odontHeight) / 2;

        // create the 1st group of upper teeth (18 down to 11)
        for (let i = 18; i > 10; i--) {
            const surfaces = i > 13 ? 5 : 4;
            const tooth = this.generateTooth(i, 0, surfaces, x, base, odontograma);
            x += tooth.rect.width + this.settings.TOOTH_PADDING;

            const spaceId = i !== 11 ? Number(`${i}${i - 1}`) : 1121;
            this.generateSpace(spaceId, tooth, spaces);
        }

        // create the 2nd group of upper teeth (21 to 28)
        for (let i = 21; i < 29; i++) {
            const surfaces = i < 24 ? 4 : 5;
            const tooth = this.generateTooth(i, 0, surfaces, x, base, odontograma);
            x += tooth.rect.width + this.settings.TOOTH_PADDING;

            if (i < 28) {
                const spaceId = Number(`${i}${i + 1}`);
                this.generateSpace(spaceId, tooth, spaces);
            }
        }

        // Reset x coordinate for lower teeth group
        x = start;

        // create the 1st group of lower teeth (48 down to 41)
        for (let i = 48; i > 40; i--) {
            const surfaces = i < 44 ? 4 : 5;
            const tooth = this.generateTooth(i, 1, surfaces, x, base + this.seperator, odontograma);
            x += tooth.rect.width + this.settings.TOOTH_PADDING;

            const spaceId = i !== 41 ? Number(`${i}${i - 1}`) : 4131;
            this.generateSpace(spaceId, tooth, spaces);
        }

        // create the 2nd group of lower teeth (31 to 38)
        for (let i = 31; i < 39; i++) {
            const surfaces = i < 34 ? 4 : 5;
            const tooth = this.generateTooth(i, 1, surfaces, x, base + this.seperator, odontograma);
            x += tooth.rect.width + this.settings.TOOTH_PADDING;

            if (i < 38) {
                const spaceId = Number(`${i}${i + 1}`);
                this.generateSpace(spaceId, tooth, spaces);
            }
        }
    }

    /**
     * Method to prepare an odontograma for a child, 20 teeth
     * @param {Array} odontograma container for the odontograma teeth
     * @param {Array} spaces container for the spaces between teeth
     * @param {HTMLCanvasElement} canvas the canvas where the odontograma will be drawn on
     */
    prepareOdontogramaChild(odontograma, spaces, canvas) {
        this.arrayCount = 0;

        // center odontograma horizontally
        const width = canvas.width;
        const odontWidth = 10 * this.imgWidth;
        const start = (width - odontWidth) / 2;
        let x = start;

        // center odontograma vertically
        const height = canvas.height;
        const odontHeight = 2 * 150;
        const base = (height - odontHeight) / 2;

        // create the 1st group of upper teeth (55 down to 51)
        for (let i = 55; i > 50; i--) {
            const surfaces = i > 53 ? 5 : 4;
            const tooth = this.generateTooth(i, 0, surfaces, x, base, odontograma);
            x += tooth.rect.width + this.settings.TOOTH_PADDING;

            const spaceId = i !== 51 ? Number(`${i}${i - 1}`) : 5161;
            this.generateSpace(spaceId, tooth, spaces);
        }

        // create the 2nd group of upper teeth (61 to 65)
        for (let i = 61; i < 66; i++) {
            const surfaces = i < 64 ? 4 : 5;
            const tooth = this.generateTooth(i, 0, surfaces, x, base, odontograma);
            x += tooth.rect.width + this.settings.TOOTH_PADDING;

            if (i < 65) {
                const spaceId = Number(`${i}${i + 1}`);
                this.generateSpace(spaceId, tooth, spaces);
            }
        }

        // Reset x coordinate for lower teeth group
        x = start;

        // create the 1st group of lower teeth (85 down to 81)
        for (let i = 85; i > 80; i--) {
            const surfaces = i < 84 ? 4 : 5;
            const tooth = this.generateTooth(i, 1, surfaces, x, base + this.seperator, odontograma);
            x += tooth.rect.width + this.settings.TOOTH_PADDING;

            const spaceId = i !== 81 ? Number(`${i}${i - 1}`) : 8171;
            this.generateSpace(spaceId, tooth, spaces);
        }

        // create the 2nd group of lower teeth (71 to 75)
        for (let i = 71; i < 76; i++) {
            const surfaces = i < 74 ? 4 : 5;
            const tooth = this.generateTooth(i, 1, surfaces, x, base + this.seperator, odontograma);
            x += tooth.rect.width + this.settings.TOOTH_PADDING;

            if (i < 75) {
                const spaceId = Number(`${i}${i + 1}`);
                this.generateSpace(spaceId, tooth, spaces);
            }
        }
    }
}
