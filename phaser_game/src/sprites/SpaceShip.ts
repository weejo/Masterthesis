import { CONSTANTS } from "../constants.ts";
import { PlayScene } from "../scenes/PlayScene.ts";
import eventCenter from "../utils/EventCenter.ts";

export class SpaceShip extends Phaser.Physics.Arcade.Sprite {
    scene!: PlayScene;
    cursor: Phaser.GameObjects.Image;
    lastClick: number;
    lastClickActive: boolean;
    spaceBar?: Phaser.Input.Keyboard.Key;
    booster: number;
    defaultSpeed!: number;
    speed!: number;
    bIsBoosting: boolean;
    glow: Phaser.FX.Glow;
    lastTimeStamp: number;

    constructor(scene: PlayScene, x: number, y: number, texture: string, maxVelo: number, drag: number, speed: number) {
        super(scene, x, y, texture);
        this.scene = scene;
        let physicsgrp = this.scene.physics.add.group({
            key: 'ship',
            frameQuantity: 50,
            collideWorldBounds: true,
        });
        physicsgrp.add(this);
        this.scene.physics.world.enable(physicsgrp);
        if (this.body) {
            this.body.onCollide = true;
            this.body.onOverlap = true;
            this.body.isCircle = true;
        }
        this.setScale(0.2);
        this.setOrigin(0.5, 0.5);
        this.setMaxVelocity(maxVelo);
        this.setVelocity(0, 0);
        this.setDrag(drag);

        this.scene.cameras.main.startFollow(this, true, 0.05, 0.05);
        this.scene.add.existing(this);
        this.type = CONSTANTS.TYPES.SPACESHIP;
        this.lastClick = 0;
        this.lastClickActive = false;
        this.cursor = this.scene.add.image(0, 0, CONSTANTS.IMAGE.LOGO).setVisible(false);
        this.spaceBar = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.booster = 100;
        this.speed = speed;
        this.defaultSpeed = speed;
        this.bIsBoosting = false;

        this.createInputCallback();

    }
    update(time, delta): void {      
        
        if (this.cursor.active) {
            if (Phaser.Math.Distance.Between(this.cursor.x, this.cursor.y, this.x, this.y) > 100) {
                this.rotateToCursor(this.cursor);
            } else {
                this.cursor.active = false;
            }
        }

        if (this.bIsBoosting == true && this.booster >= 1) {
            this.speed += 50;
            this.booster = this.booster - 0.75;
            eventCenter.emit(CONSTANTS.EVENTS.UPDATE_BOOSTER, this.booster);
        } else if (this.bIsBoosting == false && this.speed > this.defaultSpeed) {
            this.speed -= 100;
        }
        if(this.booster < 1 && this.glow != undefined) {
            this.postFX.remove(this.glow);
            this.bIsBoosting = false;
        }

        if (this.bIsBoosting == false && this.booster < 100) {
            this.booster = this.booster + 0.25;
            eventCenter.emit(CONSTANTS.EVENTS.UPDATE_BOOSTER, this.booster);
        }

        this.scene.physics.velocityFromRotation(this.rotation, this.speed, this.body?.velocity);
    }

    private createInputCallback() {
        if (this.spaceBar) {
            this.spaceBar.on('down', () => {
                if(this.booster > 0) {
                this.glow = this.postFX.addGlow(0XFFA500, 6, 0, false, 0.1, 32);
                this.bIsBoosting = true;
                }
            })
            this.spaceBar.on('up', () => {
                this.postFX.remove(this.glow);
                this.bIsBoosting = false;
            })
        }

        this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            this.lastClick = Date.now();
            this.cursor.x = pointer.worldX;
            this.cursor.y = pointer.worldY;
            this.cursor.setVisible(false);
            this.cursor.active = true;
            this.inputToggle(true);
        });
    }

    inputToggle(isActive: boolean): void {
        this.lastClickActive = isActive;
        this.cursor.setVisible(false);
    }


    rotateToCursor(cursor: Phaser.GameObjects.Image): void {
        const current = this.angle;
        const targetRad = Phaser.Math.Angle.Between(this.x, this.y, cursor.x, cursor.y);
        const target = Phaser.Math.RadToDeg(targetRad);

        let diff = target - current;

        if (diff < -180) {
            diff += 360;
        } else if (diff > 180) {
            diff -= 360;
        }
        if(this.bIsBoosting == true) {
            this.scene.tweens.add({
                targets: this,
                angle: current + diff,
                duration: 350
            })
        } else {
            this.scene.tweens.add({
                targets: this,
                angle: current + diff,
                duration: 500
            })
        }

      
    }
}
// Factory method for adding a wonky ship -> have a look at SpaceShips.ts to see the defenitions of other spaceships (can be called in playscene by e.g.: this.add.wonky()) but
// they apparently break for some reason when you start a 2. round... maybe fix it?
Phaser.GameObjects.GameObjectFactory.register(
    'wonky',
    function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number) {
        const ship = new SpaceShip(this.scene, 400, 300, CONSTANTS.IMAGE.SHIP, 400, 1, 500).setVelocity(0, 0);
        return ship;
    }
);

Phaser.GameObjects.GameObjectFactory.register(
    'mid',
    function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number) {
        const ship = new SpaceShip(this.scene, 400, 300, CONSTANTS.IMAGE.SHIP, 300, 0.6, 400).setVelocity(0, 0);
        return ship;
    }
)

Phaser.GameObjects.GameObjectFactory.register(
    'slowprecise',
    function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number) {
        const ship = new SpaceShip(this.scene, 400, 300, CONSTANTS.IMAGE.SHIP, 200, 0.25, 250).setVelocity(0, 0);
        return ship;
    }
)

