import { CONSTANTS } from "../constants.ts"
import { UI_Element } from "../containers/UI_Element.ts";
export class CreditScene extends Phaser.Scene {

    constructor() {
        super({
            key: CONSTANTS.SCENES.CREDIT,  active: false
        });
    } 
    create() {
        let { width, height } = this.sys.game.canvas;
        new UI_Element(this, (height / 10), "<credits>", false, 2.5);

        new UI_Element(this, (height/10) + 100 ,"Grand_Project for the song 'Lady of the 80's' from pixabay.com", false, 1);
        new UI_Element(this, (height/10) + 150 ,"Deep_Fold for his pixel-planet-generator", false, 1);

        new UI_Element(this, (height/10) + 200 ,"W. Randolph Franklin for his PNPOLY function!", false, 1);
        new UI_Element(this, (height/10) + 250 ,"Genshichi Yasui for his 'Atari Font' on fontspace.com", false, 1);

        new UI_Element(this, (height/10) + 500,"If you have any questions, please write me at:", false, 1);
        new UI_Element(this, (height/10) + 550,"ai21m007@fh-technikum.at or visit me on github: weejo!", false, 1);


        
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
