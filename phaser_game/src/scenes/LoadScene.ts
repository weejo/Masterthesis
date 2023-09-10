import { CONSTANTS } from "../constants.ts";


export class LoadScene extends Phaser.Scene{
    overviewData!: any;

    constructor() {
        super({
            key: CONSTANTS.SCENES.LOAD
        })
    }

    loadImages() {
        this.load.setPath("./assets/image");

        for(let prop in CONSTANTS.IMAGE) {
            //@ts-ignore
            this.load.image(CONSTANTS.IMAGE[prop], CONSTANTS.IMAGE[prop]);
        }
    }

    loadSprites(frameConfig?: Phaser.Types.Loader.FileTypes.ImageFrameConfig) {
        this.load.setPath("./assets/sprite");

        for(let prop in CONSTANTS.SPRITE) {
            //@ts-ignore
            this.load.spritesheet(CONSTANTS.SPRITE[prop], CONSTANTS.SPRITE[prop], frameConfig);
        }
    }

    preload() {
        this.load.json('overviewData', CONSTANTS.URLS.OVERVIEW);

        //load images, spritesheet, sounds
        this.loadImages();
        
        this.loadSprites({
            frameHeight: 100,
            frameWidth: 100});
            
        //create loading bar
        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff
            }
        })

        this.load.on("progress", (percent: number)=>{
            loadingBar.fillRect(0, this.game.renderer.height /2, this.game.renderer.width * percent, 50);
        })

    }

    create() {
        this.overviewData = JSON.parse(JSON.stringify(this.cache.json.get('overviewData')));

        this.initRegistry();
        this.createAnims();
        this.scene.launch(CONSTANTS.SCENES.MUSIC);
        this.scene.start(CONSTANTS.SCENES.MENU);
    }

    private createAnims(){
        for(let prop in CONSTANTS.SPRITE) {
            this.createAnimations(prop, CONSTANTS.SPRITE[prop]);
        }
    }

    private createAnimations(name: string, refString: string) {
        this.anims.create({
            key: CONSTANTS.SPRITE_ANIM[name],
            frames: this.anims.generateFrameNumbers(refString, { start: 0, end: 49 }),
            frameRate: 20,
            repeat: -1,
        });
    }

    private initRegistry() {
        this.registry.set(CONSTANTS.REGISTRY.SCORE, 0);
        this.registry.set(CONSTANTS.REGISTRY.CLUSTERS, new Array());
        this.registry.set(CONSTANTS.REGISTRY.OVERVIEW, this.overviewData.overviewLevels);
    }
}