/** @type {import("../typings/phaser")} */

import { AboutScene } from "./scenes/AboutScene.ts";
import { CalculationScene } from "./scenes/CalculationScene.ts";
import { CreditScene } from "./scenes/CreditScene.ts";
import { HUDScene } from "./scenes/HUDScene.ts";
import { HighscoreScene } from "./scenes/HighscoreScene.ts";
import { InputScene } from "./scenes/InputScene.ts";
import { SelectionScene } from "./scenes/SelectionScene.ts";
import { LoadScene } from "./scenes/LoadScene.ts";
import { MenuBackgroundScene } from "./scenes/MenuBackgroundScene.ts";
import { MenuScene } from "./scenes/MenuScene.ts";
import { MusicScene } from "./scenes/MusicScene.ts";
import { PlayScene } from "./scenes/PlayScene.ts";

let game = new Phaser.Game({
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        height: 1080,
        width: 1920
    },
    scene: [
        LoadScene, MenuScene, PlayScene, MenuBackgroundScene, SelectionScene, HighscoreScene, InputScene, AboutScene, HUDScene, CalculationScene, CreditScene, MusicScene
    ],
    render: {
        // so it doesn't default sharpen images. I hope.
        pixelArt: true
    },
    physics: {
        default: "arcade",
        arcade: {
             fixedStep: false 
           /* debug: true,
            debugShowBody: true,
            debugShowStaticBody: true,
            debugShowVelocity: true,
            debugVelocityColor: 0xffff00,
            debugBodyColor: 0x0000ff,
            debugStaticBodyColor: 0xffffff */
        }
    },
    dom: {
        createContainer: true
    }
});
