export class InputKey extends Phaser.GameObjects.Container {
    content: string;
    renderWidth: number;
    renderHeight: number;
    x: number;
    y: number;

    constructor(scene: Phaser.Scene, x: number, y: number, content: string,) {
        super(scene, x, y);
        this.content = content;
        if (content ='DEL') {
            this.renderWidth = 50;
        } else {
            this.renderWidth = 15;
        }

        this.renderHeight = 75;
        this.x = x;
        this.y = y;

        this.setSize(this.renderWidth, this.renderHeight)
        this.setInteractive();

        this.create();
    }

    create() {
        let graphics = this.scene.make.graphics();
        graphics.lineStyle(1,0xff0000);
        graphics.fillStyle(0x02455f, .5);

        let text = this.scene.add.text( 0, 40, this.content, {fontFamily: 'atari'})
        .setScale(this.scale)
        .setColor('#ffffff');
        
        let renderTexture = this.scene.add.renderTexture(this.x, this.y, this.renderWidth, this.renderHeight);
    
        renderTexture.draw(graphics);
        renderTexture.draw(text);
        let imgName = 'inputkey' + this.content+ Math.random();
        
        renderTexture.saveTexture(imgName);

        graphics.destroy();
        text.destroy();
        renderTexture.destroy();

        this.scene.add.image(this.x,this.y, imgName).setOrigin(.5); 
    }
}