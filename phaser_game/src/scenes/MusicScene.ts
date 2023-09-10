import { CONSTANTS } from "../constants.ts"
export class MusicScene extends Phaser.Scene {
    constructor() {
        super({
            key: CONSTANTS.SCENES.MUSIC, active: true
        });
    }

    loadMusic() {
        this.load.setPath("./assets/audio");

        for(let prop in CONSTANTS.MUSIC) {
            //@ts-ignore
            this.load.audio(CONSTANTS.MUSIC[prop], CONSTANTS.MUSIC[prop]);
        }
    }

    preload() {
        this.loadMusic();
    }
    
    create() {
        let music = this.sound.get(CONSTANTS.MUSIC.LADY);
        if (music == undefined) {
            music = this.sound.add(CONSTANTS.MUSIC.LADY, {
                volume: 0.5,
                loop: true
            });
        }
        if (!music.isPlaying) {
            music.play();
        }

    }
}