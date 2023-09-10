import { CONSTANTS } from "../constants.ts";
import { UI_Element } from "../containers/UI_Element.ts";
import { HighscoreScene } from "./HighscoreScene.ts";
import { PlayScene } from "./PlayScene.ts";

export class SelectionScene extends Phaser.Scene {
    levelOverviewData: any[];
    sceneContext: String;


    constructor() {
        super({
            key: CONSTANTS.SCENES.SELECTION, active: false
        })
    }

    preload() {

    }

    init(data: any) {
        this.sceneContext = data.sceneContext;
    }

    create() {
        this.createHeader();

        this.levelOverviewData = this.registry.get(CONSTANTS.REGISTRY.OVERVIEW);

        let counter = 0;

        this.levelOverviewData.forEach(levelData => {
            let levelOption = new UI_Element(this, ((counter + 2) * 100), "<level: " + levelData.name + "; size: " + levelData.size + ">", true);

            levelOption.on("pointerup", () => {
                if (this.sceneContext == "LEVEL") {
                    this.scene.stop(CONSTANTS.SCENES.MENUBACKGROUND);
                    this.scene.stop(CONSTANTS.SCENES.SELECTION);

                    let playScene = this.scene.get(CONSTANTS.SCENES.PLAY);

                    if (playScene == undefined) {
                        this.scene.add(CONSTANTS.SCENES.PLAY, PlayScene, false, { level: levelData });
                    }

                    this.scene.start(CONSTANTS.SCENES.PLAY, { level: levelData });

                } else if (this.sceneContext == "HIGHSCORE") {
                    let highscore = this.scene.get(CONSTANTS.SCENES.HIGHSCORE);

                    if (highscore != undefined) {
                        this.game.scene.remove(CONSTANTS.SCENES.HIGHSCORE);
                        this.scene.add(CONSTANTS.SCENES.HIGHSCORE, HighscoreScene, false, { level: levelData });
                    }

                    this.scene.start(CONSTANTS.SCENES.HIGHSCORE, { level: levelData });
                }

            })

            counter++;
        });

        this.addReturnButton();
    }

    private createHeader() {
        let { height } = this.sys.game.canvas;
        if (this.sceneContext == "LEVEL") {
            new UI_Element(this, (height / 10), "<level select>", false, 2.5);
        } else if (this.sceneContext == "HIGHSCORE") {
            new UI_Element(this, (height / 10), "<highscore select>", false, 2.5);
        }
    }

    addReturnButton() {
        let { height } = this.sys.game.canvas;
        let returnMenu = new UI_Element(this, (height - 150), "<return>", true);

        returnMenu.on("pointerup", () => {
            this.scene.start(CONSTANTS.SCENES.MENU);
        })
    }
}