import { CONSTANTS } from "../constants.ts";

export class MenuBackgroundScene extends Phaser.Scene {
    stars: Array<Phaser.GameObjects.Blitter> = [];
    spawnDistance!: number;
    speed!: number;
    maxStars!: number;
    xCoords!: Array<number>;
    yCoords!: Array<number>;
    zCoords!: Array<number>;


    constructor ()
    {
        super({ key: CONSTANTS.SCENES.MENUBACKGROUND, active: true });

        this.speed = 250;
        this.spawnDistance=300;

        this.maxStars = 1000;
        this.xCoords = [];
        this.yCoords = [];
        this.zCoords = [];
    }

    preload ()
    {
        this.load.image('star', 'assets/image/BackgroundStar.png');
    }

    create ()
    {
        let { width, height } = this.sys.game.canvas;
        //  Do this, otherwise this Scene will steal all keyboard input
        this.input.keyboard.enabled = false;

        this.stars = this.add.blitter((width/4), (height/4), 'star');

        for (let i = 0; i < this.maxStars; i++)
        {
            this.xCoords[i] = Math.floor(Math.random() * width) - (width/2);
            this.yCoords[i] = Math.floor(Math.random() * height) - (height/2);
            this.zCoords[i] = Math.floor(Math.random() * 4000) + 2000;

            let perspective = this.spawnDistance / (this.spawnDistance - this.zCoords[i]);
            let x = (width/2) + this.xCoords[i] * perspective;
            let y = (height/2) + this.yCoords[i] * perspective;

            this.stars.create(x, y);
        }
    }

    update (time: number, delta: number)
    {
        for (let i = 0; i < this.maxStars; i++)
        {
            let perspective = this.spawnDistance / (this.spawnDistance - this.zCoords[i]);
            let x = 400 + this.xCoords[i] * perspective;
            let y = 300 + this.yCoords[i] * perspective;

            this.zCoords[i] += this.speed * (delta / 1000);

            if (this.zCoords[i] > 300)
            {
                this.zCoords[i] -= 600;
            }

            let bob = this.stars.children.list[i];

            bob.x = x;
            bob.y = y;
        }
    }
}