import { CONSTANTS } from "../constants.ts"
import { UI_Element } from "../containers/UI_Element.ts";
export class AboutScene extends Phaser.Scene {

    constructor() {
        super({
            key: CONSTANTS.SCENES.ABOUT, active: false
        });
    }
    create() {
        let { width, height } = this.sys.game.canvas;
        new UI_Element(this, (height / 10), "<about>", false, 2.5);

        new UI_Element(this, (height / 10) + 100, "Developed by Jonas Wendel as part of the master thesis project.", false, 1);
        new UI_Element(this, (height / 10) + 150, "Under supervision of Dr. Sharwin Rezagholi, MSc", false, 1);

        new UI_Element(this, (height / 10) + 200, "FH Technikum Wien in the summer of '23.", false, 1);
        new UI_Element(this, (height / 10) + 250, "and with support from my girlfriend, friends and coffee.", false, 1);

        new UI_Element(this, (height / 10) + 400, "Special thanks in no particular order goes out to: ", false, 1);
        new UI_Element(this, (height / 10) + 450, "Leni, Hasi, the Phaser3 framework developers,", false, 1);
        new UI_Element(this, (height / 10) + 500, "B3L7, deep-fold, Julian Breddy, and many more...", false, 1);

        this.addReturnButton();
    }


    addReturnButton() {
        let { width, height } = this.sys.game.canvas;
        let returnMenu = new UI_Element(this, (height - 150), "<return>", true);

        returnMenu.on("pointerup", () => {
            this.scene.start(CONSTANTS.SCENES.MENU);
        })
    }
}
