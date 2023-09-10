import { CONSTANTS } from "../constants.ts";
import { InputKey } from "../containers/InputKey.ts";
import { UI_Element } from "../containers/UI_Element.ts";
import { UI_Table } from "../containers/UI_Table.ts";
import { Planet } from "../sprites/Planet.ts";
import { HighscoreScene } from "./HighscoreScene.ts";
import { PlayScene } from "./PlayScene.ts";

export class InputScene extends Phaser.Scene {
    chars!: any[];
    cursor!: Phaser.Math.Vector2;
    text: Phaser.GameObjects.Text;
    block: Phaser.GameObjects.Image;
    name!: string;
    charLimit!: number;
    timer: number;
    points: number;
    numPlanets: number;
    levelData: any;
    sendData: boolean;
    won: boolean;
    finalResult: number;


    constructor() {
        super({ key: CONSTANTS.SCENES.INPUT, active: false });

        this.chars = [
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
            'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
            'U', 'V', 'W', 'X', 'Y', 'Z', '.', '-', '<', '>',
            '%', '@', 'DEL'
        ];

        this.cursor = new Phaser.Math.Vector2();

        this.text;
        this.block;

        this.name = '';
        this.charLimit = 5;
    }

    init(data: any) {
        this.timer = data.timer;
        this.points = data.points;
        this.numPlanets = data.numVisi;
        this.levelData = data.level;
        this.sendData = data.sendData;
        this.won = data.won;
    }

    preload() {
        this.load.image('block', 'assets/image/input/block.png');
    }

    create() {
        this.scene.launch(CONSTANTS.SCENES.MENUBACKGROUND); // Making fancy background FX

        // this block is used to mark the currently selected character drawn to the screen.
        this.block = this.add.image(this.levelData.level_x - 100, this.levelData.level_y - 100, 'block').setOrigin(0);

        if (this.won) {
            this.points += 50000;
        }

        this.finalResult = 1000 * this.timer + this.points - (10000 * (this.registry.get(CONSTANTS.REGISTRY.CLUSTERS).length));

        let tableContent = this.prepareTableContent();

        let { playAgain, publishButton } = this.setupPageLayout(tableContent);

        this.setupButtonInteractions(playAgain, publishButton);

        this.createInputField();
    }


    private setupButtonInteractions(playAgain: UI_Element, publishButton: UI_Element) {
        playAgain.on("pointerup", () => {
            this.publishData();
            this.scene.stop(CONSTANTS.SCENES.MENUBACKGROUND);
            this.scene.stop(CONSTANTS.SCENES.INPUT);

            let playScene = this.scene.get(CONSTANTS.SCENES.PLAY);

            if (playScene != undefined) {
                this.game.scene.remove(CONSTANTS.SCENES.PLAY);
                this.scene.add(CONSTANTS.SCENES.PLAY, PlayScene, false, { level: this.levelData });
            }
            this.scene.start(CONSTANTS.SCENES.PLAY, { level: this.levelData });
        });

        publishButton.on("pointerup", () => {
            this.publishData();

            let highscore = this.scene.get(CONSTANTS.SCENES.HIGHSCORE);

            this.game.scene.remove(CONSTANTS.SCENES.PLAY);

            if (highscore != undefined) {
                this.game.scene.remove(CONSTANTS.SCENES.HIGHSCORE);
                this.scene.add(CONSTANTS.SCENES.HIGHSCORE, HighscoreScene, false, { level: this.levelData });
            }

            this.scene.start(CONSTANTS.SCENES.HIGHSCORE, { level: this.levelData, fakeResult: this.finalResult.toFixed(1).toString(), fakeName: this.text.text });
        });
    }

    private setupPageLayout(tableContent: any[]) {
        let { width, height } = this.sys.game.canvas;

        new UI_Element(this, height / 10, "<your score>");

        new UI_Element(this, height / 10 + 275, this.finalResult.toFixed(1).toString());

        new UI_Table(this, height / 10 + 100, tableContent, 3, 300);

        new UI_Element(this, height / 10 + 350, "<your name>");

        this.text = this.add.text(width / 2 - 50, height / 10 + 425, "", { fontFamily: 'atari' })
            .setScale(1)
            .setColor('#ffffff');

        let playAgain = new UI_Element(this, height - 200, "<play again>", true);
        let publishButton = new UI_Element(this, height - 100, "<publish>", true);
        return { playAgain, publishButton };
    }

    private prepareTableContent(): any[] {
        let content = new Array();
        content.push(new Array('<time>', '<points>', '<cluster>'));
        let timerString = "1K x " + this.timer.toFixed(1).toString();
        let planetString;
        if(this.won) {
            planetString = "1K x " + this.numPlanets.toString() + " + 50K";
        } else {
            planetString = "1K x " + this.numPlanets.toString() + " + 0K";
        }
        let cluster = "-10K x " + this.registry.get(CONSTANTS.REGISTRY.CLUSTERS).length.toString();
        content.push(new Array(timerString, planetString, cluster));
        content.push(new Array("=" + (1000 * this.timer).toFixed(1).toString(), "=" + this.points.toString(), "= -" + (10000 * (this.registry.get(CONSTANTS.REGISTRY.CLUSTERS).length))));
        return content;
    }

    private publishData() {
        let clusters = [];
        if (this.sendData) {
            let listofclusters = this.registry.get(CONSTANTS.REGISTRY.CLUSTERS);
            listofclusters.forEach(cluster => {
                let pList = new Array();
                for (let index = 0; index < cluster.length; index++) {
                    const planet = cluster[index] as Planet;
                    pList.push({x: planet.x, y: planet.y, id: planet.id});
                }

                clusters.push({planetList: pList });
            });
        }
        fetch(CONSTANTS.URLS.ADDRESULT, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "entry": {
                    "points": this.finalResult,
                    "name": this.text.text.toString()
                },
                "levelId": this.levelData.levelId,
                "clusters": clusters
            })
        })
            .then()

    }

    private createInputField() {
        let { width, height } = this.sys.game.canvas;
        let y_offset = 0;
        for (let index = 0; index < this.chars.length; index++) {
            const element = this.chars[index];

            if (index % 10 == 0) y_offset += 50;

            let key = new InputKey(this, width / 2 - 250 + ((index % 10) * 50), height / 2 + y_offset, element);

            if (element == 'DEL') {
                key.on("pointerover", () => {
                    this.block.setX(key.x - 25);
                    this.block.setY(key.y - 10);
                });

                key.on("pointerup", () => {
                    let currentText = this.text.text;
                    let delText = currentText.substring(0, currentText.length - 1);
                    this.text.text = delText;
                });
            } else {
                key.on("pointerover", () => {
                    this.block.setX(key.x - 40);
                    this.block.setY(key.y - 10);
                });

                key.on("pointerup", () => {
                    if (this.text.text.length < this.charLimit) {
                        this.text.text += element;
                    }
                });
            }
        }

        this.tweens.add({
            targets: this.block,
            alpha: 0.2,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            duration: 350
        });
    }
}