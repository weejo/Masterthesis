import { CONSTANTS } from "../constants.ts";

export class UI_Element extends Phaser.GameObjects.Container {
    name!: string;
    x!: number;
    y!: number;
    scene!: Phaser.Scene;
    renderWidth!: number;
    renderHeight!: number;
    content!: string;
    scale: number;
    bInteractive: boolean;
    
    constructor(scene: Phaser.Scene, y: number, content: string, bInteractive: boolean = false, scale: number = 1.5) {
        super(scene, undefined, y);
        this.scene = scene;
        this.content = content;
        this.bInteractive = bInteractive;
        let { width, height } = this.scene.sys.game.canvas;
        this.y = y;
        this.scale = scale;
        this.x =  (width/2); 
        // scale * 16 => default scale is 1.5, to make the renderwidth fit we go for *16, otherwise not all of the scaled up text would be displayed.
        this.renderWidth = content.length * (scale*15.8);

        this.renderHeight= 75;
        if (bInteractive) {
            this.setSize(this.renderWidth, this.renderHeight)
            this.setInteractive();
        }

        this.create();
    }

    create () {
        if (this.bInteractive) {
            var hoverSpriteLeft = this.scene.add.sprite(100, 100, CONSTANTS.SPRITE.MENUSTAR);
            var hoverSpriteRight = this.scene.add.sprite(100, 100, CONSTANTS.SPRITE.MENUSTAR);
            hoverSpriteLeft.setVisible(false);
            hoverSpriteRight.setVisible(false);

        
            this.on("pointerover", () => {
                hoverSpriteLeft.setVisible(true);
                hoverSpriteRight.setVisible(true);

                hoverSpriteLeft.play(CONSTANTS.SPRITE_ANIM.MENUSTAR);
                hoverSpriteRight.play(CONSTANTS.SPRITE_ANIM.MENUSTAR);


                hoverSpriteLeft.x = this.x - (this.width/2) -50;
                hoverSpriteRight.x = this.x + (this.width/2) +50;

                hoverSpriteLeft.y = this.y;
                hoverSpriteRight.y = this.y;

            })

            this.on("pointerout", () => {
                hoverSpriteLeft.setVisible(false);
                hoverSpriteRight.setVisible(false);
            })
        }


        let graphics = this.scene.make.graphics();
        graphics.lineStyle(1,0xff0000);
        graphics.fillStyle(0x02455f, .5);

        let text = this.scene.add.text( 0, 40, this.content, {fontFamily: 'atari'})
        .setScale(this.scale)
        .setColor('#ffffff');
        
        let renderTexture = this.scene.add.renderTexture(this.x, this.y, this.renderWidth, this.renderHeight);
        
        renderTexture.draw(graphics);
        renderTexture.draw(text);
        let imgName = 'levelOptionImage' + Math.random();
        
        renderTexture.saveTexture(imgName);

        graphics.destroy();
        text.destroy();
        renderTexture.destroy();

        this.scene.add.image(this.x,this.y, imgName).setOrigin(.5); 
        
    }
}