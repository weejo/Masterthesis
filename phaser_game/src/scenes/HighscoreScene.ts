import { CONSTANTS } from "../constants.ts"
import { UI_Element } from "../containers/UI_Element.ts";
import { UI_Table } from "../containers/UI_Table.ts";
export class HighscoreScene extends Phaser.Scene {
    levelData: any;
    fakeResult?: string;
    fakeName?: string;

    constructor() {
        super({
            key: CONSTANTS.SCENES.HIGHSCORE
        });
        this.fakeResult = undefined;
        this.fakeName = undefined;
    }

    init(data: any) {
        this.levelData = data.level;
        this.fakeName = data.fakeName;
        this.fakeResult = data.fakeResult;
    }

    preload() {
        this.load.json('level_highscore', CONSTANTS.URLS.HIGHSCORE + this.levelData.levelId);
    }

    create() {
        let { width, height } = this.sys.game.canvas;
        new UI_Element(this, (height / 10), "<" + this.levelData.name + " highscore>", false, 2.5);

        let content = this.createScoreTable();

        new UI_Table(this, height / 3, content, 3, 200);

        this.addReturnButton();
    }

    private createScoreTable() {
        const data = JSON.parse(JSON.stringify(this.cache.json.get('level_highscore')));
        let content = new Array();
        content.push(new Array('<rank>', '<score>', '<name>'));

        if (data.highscoreEntries != undefined) {

            for (let index = 0; index < data.highscoreEntries.length; index++) {
                let element = data.highscoreEntries[index];
                if (this.fakeResult != undefined && this.fakeResult > element.points) {
                    content.push(new Array(index+ 1, this.fakeResult, this.fakeName));
                    content.push(new Array(index+ 2, element.points, element.name));

                    for (let fakeIndex = index +2; fakeIndex < data.highscoreEntries.length; fakeIndex++) {
                        let element = data.highscoreEntries[fakeIndex];
                        content.push(new Array(fakeIndex + 1, element.points, element.name));
                    }
                    return content;
                }  else {
                    content.push(new Array(index + 1, element.points, element.name));
                }
            }
        }
        return content;
    }

    addReturnButton() {
        let { width, height } = this.sys.game.canvas;
        let returnMenu = new UI_Element(this, (height - 150), "<return>", true);

        returnMenu.on("pointerup", () => {
            this.scene.stop(CONSTANTS.SCENES.HIGHSCORE);
            this.cache.json.remove('level_highscore');
            this.scene.start(CONSTANTS.SCENES.SELECTION, { sceneContext: "HIGHSCORE" });
        })
    }
}
