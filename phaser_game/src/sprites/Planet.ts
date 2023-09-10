import { CONSTANTS } from "../constants.ts";
import { PlayScene } from "../scenes/PlayScene.ts";
import { constUtils } from "../utils/constUtils.ts";
export class Planet extends Phaser.Physics.Arcade.Sprite {
    bActive!: boolean;
    scene!: PlayScene;
    body!: Phaser.Physics.Arcade.Body;
    id: number;

    constructor(scene: PlayScene, x: number, y: number, texture: string, id: number) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.scene.physics.world.enable(this);
        this.width = 100;
        this.height = 100;
        this.bActive = false;
        this.scene.physics.world.enable(this, 1);
        this.body = this.body as Phaser.Physics.Arcade.Body;
        this.body.setSize(100, 100);
        this.body.onOverlap = true;
        this.body.onCollide = true;
        this.body.isCircle = true;
        this.scene.add.existing(this);
        this.type = CONSTANTS.TYPES.PLANET;
        this.id = id;
        
    }

    markPlanet(planetColor: number) {
        if (!this.bActive) {
            let circle = this.scene.add.circle(this.x, this.y, this.width / 2).setStrokeStyle(10, constUtils.resolveClusterColor(planetColor));
            circle.depth = -1;
            this.bActive = true;
        }
    }
}