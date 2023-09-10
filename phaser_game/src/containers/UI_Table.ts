export class UI_Table extends Phaser.GameObjects.Container {
    name!: string;
    y!: number;
    scene!: Phaser.Scene;
    content!: any[];
    columnNum!: number;
    columnWidth!: number
    columnHeight!: number;

    constructor(scene: Phaser.Scene, y: number, content: any[], columnNum: number, columnWidth: number, columnHeight: number = 50) {
        super(scene, undefined, y);
        this.scene = scene;
        this.content = content;
        this.y = y;
        this.columnNum = columnNum;
        this.columnWidth = columnWidth;
        this.columnHeight = columnHeight;
        this.create();
    }

    create() {
        let { width, height } = this.scene.sys.game.canvas;
        let graphics = this.scene.make.graphics();
        graphics.lineStyle(1, 0xff0000);
        graphics.fillStyle(0x02455f, .5);

        var offsetLeft: number = Math.floor(this.columnNum / 2);
        // move to the left from the middle for every column + a half such that the middle column is exactly in the middle
        let x = (width / 2) - (offsetLeft * this.columnWidth) - (0.5 * this.columnWidth);

        let imgName = 'table' + Math.random();
        let renderTexture = this.scene.add.renderTexture(x, this.y, x + (this.columnNum * this.columnWidth), this.content.length * this.columnHeight);


        let text: Phaser.GameObjects.Text;
        for (let rowIndex = 0; rowIndex < this.content.length; rowIndex++) {
            const row = this.content[rowIndex];
            for (let index = 0; index < row.length; index++) {
                const element = row[index];
                text = this.scene.add.text(x + (index * this.columnWidth), this.y + (rowIndex * this.columnHeight), element, { fontFamily: 'atari' });
                if (rowIndex == 0) {
                    text.setScale(1.5);
                }
                renderTexture.draw(text);
            }
        }

        renderTexture.draw(graphics);
        renderTexture.saveTexture(imgName);

        graphics.destroy();
        renderTexture.destroy();

        this.scene.add.image(this.x, this.y, imgName).setOrigin(.5);
    }
}