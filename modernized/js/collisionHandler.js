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
 * Helper class for handling collisions
 */
export default class CollisionHandler {
    constructor() {
        this.constants = null;
    }

    /**
     * Method to set reference to global constants
     * @param {object} constants
     */
    setConstants(constants) {
        this.constants = constants;
    }

    /**
     * Method to handle a collision with a tooth
     * @param {object} tooth
     * @param {any} argument
     */
    handleCollision(tooth, argument) {
        let newArg;

        try {
            newArg = Number(argument);
        } catch (e) {
            console.log("Handle Collision Exception: " + e.message);
        }

        if (newArg !== 0 && newArg !== undefined && !isNaN(newArg)) {
            if (newArg !== this.constants.CARIES &&
                    newArg !== this.constants.CURACION) {
                tooth.toggleDamage(newArg);
            }
        }
    }

    /**
     * Method to handle a collision with a checkbox
     * @param {object} checkBox
     * @param {any} argument
     */
    handleCollisionCheckBox(checkBox, argument) {
        let newArg;
        console.log("Handle Collision CB arg :" + argument);
        try {
            newArg = Number(argument);
        } catch (e) {
            console.log("Handle Collision Exception: " + e.message);
        }

        if (newArg === this.constants.CARIES) {
            if (checkBox.state === 1) {
                checkBox.state = 0;
            } else {
                checkBox.state = 1;
            }
        } else if (newArg === this.constants.CURACION) {
            if (checkBox.state === 11) {
                checkBox.state = 0;
            } else {
                checkBox.state = 11;
            }
        }
    }
}
