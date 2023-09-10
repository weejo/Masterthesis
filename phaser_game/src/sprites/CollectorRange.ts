import { CONSTANTS } from "../constants.ts";
import { PlayScene } from "../scenes/PlayScene.ts";
import { SpaceShip } from "./SpaceShip.ts";

export class CollectorRange extends Phaser.Physics.Arcade.Sprite  {
    outerRangeCircle!: Phaser.GameObjects.Arc;
    spaceship!: SpaceShip;
    scene!: PlayScene;

    constructor(scene: PlayScene, x: number, y: number, spaceship: SpaceShip) {
        super(scene,x, y, spaceship.texture);
        this.scene = scene;
        this.scene.physics.world.enable(this);
        this.spaceship = spaceship;
        if (this.body) {
            this.body.setSize(300,300);
            this.body.isCircle = true;
        }
        //rangecirle for marking planets visual aid
        this.outerRangeCircle = this.scene.add.circle(0, 300, 150).setStrokeStyle(10, 0x01678d);

        this.type=CONSTANTS.TYPES.COLLECTOR;
    }

    update(): void {
        this.copyPosition(this.spaceship);
        this.outerRangeCircle.copyPosition(this.spaceship);
    }
}