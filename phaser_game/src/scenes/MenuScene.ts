import { UI_Element } from "../containers/UI_Element.ts";
import { CONSTANTS } from "../constants.ts"
import { MusicScene } from "./MusicScene.ts";
export class MenuScene extends Phaser.Scene{
    constructor() {
        super({
            key: CONSTANTS.SCENES.MENU
        })
    }
    create() {

        //create images (z order)
        this.scene.launch(CONSTANTS.SCENES.MENUBACKGROUND); // Making fancy background FX

        let calc = this.scene.get(CONSTANTS.SCENES.MUSIC);
        if (calc != undefined) {
            this.game.scene.remove(CONSTANTS.SCENES.MUSIC);
            this.scene.add(CONSTANTS.SCENES.MUSIC, MusicScene, false);
        }
        this.scene.launch(CONSTANTS.SCENES.MUSIC);

        let { width, height } = this.sys.game.canvas;
        new UI_Element(this, (height / 10), "<planetracer>", false, 2.5);
        
        let playButton = new UI_Element(this, (height /3), "<play>", true, 2);
        
        let optionsButton = new UI_Element(this, (height /3)+100, "<highscore>", true, 2);

        let aboutButton = new UI_Element(this, (height /3) + 200, "<about>", true, 2);

        let creditButton = new UI_Element(this, (height/3 + 300), "<credits>", true, 2);
        /**
         * pointerover / pointerout / pointerup / pointerdown
         */

        playButton.on("pointerup", () => {
            this.scene.start(CONSTANTS.SCENES.SELECTION, {sceneContext: "LEVEL"});
        })
        optionsButton.on("pointerup", () => {
            this.scene.start(CONSTANTS.SCENES.SELECTION, {sceneContext: "HIGHSCORE"});
        })
        aboutButton.on("pointerup", () => {
            this.scene.start(CONSTANTS.SCENES.ABOUT)
        })
        creditButton.on("pointerup", () => {
            this.scene.start(CONSTANTS.SCENES.CREDIT);
        })

    }
}