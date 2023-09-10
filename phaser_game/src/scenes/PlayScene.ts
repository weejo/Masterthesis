import "../sprites/SpaceShip.ts";
import { CONSTANTS } from "../constants.ts";
import { constUtils } from "../utils/constUtils.ts";
import { Planet } from "../sprites/Planet.ts";
import eventCenter from "../utils/EventCenter.ts";
import { HUDScene } from "./HUDScene.ts";
import { CollectorRange } from "../sprites/CollectorRange.ts";
import { SpaceShip } from "../sprites/SpaceShip.ts";
import { CalculationScene } from "./CalculationScene.ts";

export class PlayScene extends Phaser.Scene {
    ship!: SpaceShip;
    speed!: number;
    levelData: any;
    map: Phaser.Tilemaps.Tilemap;
    planets!: Phaser.GameObjects.Group;
    planetsLeft!: Phaser.GameObjects.Group;
    numVisitedPlanets: number;
    numPlanets!: number;
    minNeighbors!: number;
    points!: number;
    hudScene: HUDScene;
    calculator: CalculationScene;
    timer!: number;
    collectorRange!: CollectorRange;
    overlapGroup: Phaser.GameObjects.Group;
    marked!: Planet[];
    lastVisited?: Planet;
    firstInCluster?: Planet;
    gameOver!: boolean;
    bTimerRunning: boolean;
    minimap!: Phaser.Cameras.Scene2D.Camera;
    dataThreshold!: number;


    constructor() {
        super({
            key: CONSTANTS.SCENES.PLAY, active: false
        });
        this.lastClick = 0;
        this.lastClickActive = false;
        this.speed = 300;
        this.points = 0;
        this.timer = 0;
        this.numPlanets = 0;
        this.numVisitedPlanets = 0;
        this.gameOver = false;
        this.bTimerRunning = false;

    }

    preload() {
        this.load.tilemapTiledJSON(this.levelData.levelId, CONSTANTS.URLS.LEVELDATA + this.levelData.levelId);
    }

    init(data: any) {
        this.levelData = data.level;
    }

    create() {
        this.setupCameraAndShip();

        this.initializeParameters();

        this.createPlanetsAndMap();

        this.setupEventListeners();

        this.setupAdditionalScenes();

        this.setupMinimap();
    }

    private setupAdditionalScenes() {
        let hudScene = this.scene.get(CONSTANTS.SCENES.HUD);

        if (hudScene != undefined) {
            this.game.scene.remove(CONSTANTS.SCENES.HUD);
            this.scene.add(CONSTANTS.SCENES.HUD, HUDScene, false, { initialTime: this.levelData.initialTime });
        }

        this.scene.launch(CONSTANTS.SCENES.HUD, { initialTime: this.levelData.initialTime, numberOfPlanets: this.numPlanets });
        this.hudScene = this.scene.get(CONSTANTS.SCENES.HUD) as HUDScene;

        let calc = this.scene.get(CONSTANTS.SCENES.CALCULATION);
        if (calc != undefined) {
            this.game.scene.remove(CONSTANTS.SCENES.CALCULATION);
            this.scene.add(CONSTANTS.SCENES.CALCULATION, CalculationScene, false);
        }
        this.scene.launch(CONSTANTS.SCENES.CALCULATION);
        this.calculator = this.scene.get(CONSTANTS.SCENES.CALCULATION) as CalculationScene;
    }

    private initializeParameters() {
        this.registry.set(CONSTANTS.REGISTRY.SCORE, 0);
        this.registry.set(CONSTANTS.REGISTRY.CLUSTERS, new Array());

        this.planets = this.add.group({ classType: Planet });
        this.planetsLeft = this.add.group({ classType: Planet });

        //initialize marked group
        this.marked = new Array();
        this.lastVisited = undefined;
        this.firstInCluster = undefined;
    }

    setupCameraAndShip() {
        this.physics.world.setBounds(this.levelData.level_x, 0, this.levelData.width, this.levelData.height);
        this.ship = new SpaceShip(this, 0, 0, CONSTANTS.IMAGE.SHIP, 400, 1, 350).setVelocity(0, 0);
        this.collectorRange = new CollectorRange(this, this.ship.x, this.ship.y, this.ship);
        this.overlapGroup = new Phaser.GameObjects.Group(this, [this.ship, this.collectorRange]);
    }

    /**
     * If you add this to the HUDScene it gets all weird and displays pixel artifacts... idk, just leave it here until someone fixes it (lol)
     */
    private setupMinimap() {
        let { width, height } = this.sys.game.canvas;
        //  The miniCam is 400px wide, so can display the whole world at a zoom of 0.2
        this.minimap = this.cameras.add(0, height - height / 4, width / 4.5, height / 4).setZoom(0.1).setName('mini');
        this.minimap.setBackgroundColor(0x133d52);
        this.minimap.setAlpha(0.5);
        this.minimap.startFollow(this.ship, true, 0.05, 0.05);
        this.minimap.centerOn(this.ship.x, this.ship.y);
        let rectangle = this.add.rectangle(width / 9, height - (height / 8), width / 4.5, height / 4).setStrokeStyle(10, 0xefc53f).setScrollFactor(0, 0);
        this.minimap.ignore(rectangle);
    }

    private createPlanetsAndMap() {
        this.map = this.make.tilemap({ key: this.levelData.levelId });

        var objects = this.map.getObjectLayer(CONSTANTS.LAYERS.PLANET_LAYER);

        objects?.objects.forEach((object) => {
            //create planets

            if (object.type == 'planet') {
                var cluster = constUtils.resolveGid(object.gid);
                let planet = new Planet(this, object.x, this.levelData.height - object.y -this.levelData.heightCorrection, CONSTANTS.SPRITE[cluster], object.id);
                planet.play(CONSTANTS.SPRITE_ANIM[cluster]);
                this.planets.add(planet);
                this.planetsLeft.add(planet);
            }
        });
        this.numPlanets = this.planets.children.size;
        this.dataThreshold = (this.numPlanets/100) *3;
    }

    update(time: number, delta: number) { //delta ~16.66 @ 60fps
        if (!this.gameOver) {
            this.ship.update(time, delta);
            this.collectorRange.update();
            this.physics.overlap(this.overlapGroup, this.planets, (object1, object2) => { this.overlapped(object1, object2, this) });
        }
    }

    /**
     * ---------------------------------------- COLLISION STUFF ---------------------------------- 
     */
    overlapped(overlap: any, object: any, context: PlayScene) {
        let planet = object as Planet;
        // Start the timer as soon as the first overlap happens
        if (!this.bTimerRunning) {
            this.bTimerRunning = true;
            eventCenter.emit(CONSTANTS.EVENTS.PAUSE_TOGGLE, this.bTimerRunning);
        }
        // Ship crashed onto planet - game over, baby
        if (overlap.type == CONSTANTS.TYPES.SPACESHIP) {
            return context.gameOverCrashed();
        } else if (overlap.type == CONSTANTS.TYPES.COLLECTOR) {
            // Planet got into collecting range - mark it!
            context.checkPlanet(planet);
        }

    }

    /**
     * Check if the given planet is
     * @param planet 
     */
    private checkPlanet(planet: Planet) {

        if (!planet.bActive) {
            this.markingActivePlanet(planet);
            // check if through that increased convex hull there are additional planets to be collected
            this.calcPlanetsInCluster();
        }
        // if there are no more planets -> add the last one to the last cluster and go to win screen.
        if (this.numVisitedPlanets == this.numPlanets) {
            this.win();
        }
    }

    private markingActivePlanet(planet: Planet) {
    	 if (this.isPlanetInNewCluster(planet)) {
            // last visited too far away from the currently visited -> create a new cluster.
            this.setupNewCluster(planet);
        } else {
            // cluster is still active - add new planet to it.
            if (this.lastVisited != undefined) {
                constUtils.drawClusterLine(this.lastVisited, planet, this, this.registry.get(CONSTANTS.REGISTRY.CLUSTERS).length);
            }
        }

        this.marked.push(planet);
        planet.markPlanet(this.registry.get(CONSTANTS.REGISTRY.CLUSTERS).length);
        this.planetsLeft.remove(planet);
        this.numVisitedPlanets++;

        // add planet points + add time.
        this.addPlanetFromShip();
        this.lastVisited = planet;
    }

    private isPlanetInNewCluster(planet: Planet): boolean {
        if (this.lastVisited != undefined) {
            return Phaser.Math.Distance.Between(planet.x, planet.y, this.lastVisited.x, this.lastVisited.y) > this.levelData.maxDistance ? true : false;
        }
        if (this.firstInCluster == undefined) {
            return true;
        }
        return false;
    }

    private setupNewCluster(planet: Planet) {
        if (this.lastVisited != undefined && this.firstInCluster != undefined) {
            constUtils.drawClusterLine(this.lastVisited, this.firstInCluster, this, this.registry.get(CONSTANTS.REGISTRY.CLUSTERS).length);
            this.addClusterToRegistry();
        }
        this.lastVisited = planet;
        this.firstInCluster = planet;
        this.marked = new Array();
    }

    private addClusterToRegistry() {
        // add the cluster to the registry
        var clusters = this.registry.get(CONSTANTS.REGISTRY.CLUSTERS);
        if (this.marked.length >= this.levelData.minNeighbors) {
            clusters.push(this.marked);
            this.registry.set(CONSTANTS.REGISTRY.CLUSTERS, clusters);
        } 
        this.firstInCluster = undefined;
    }

    private calcPlanetsInCluster() {
        let insideCluster = this.calculator.calculatePointsInCluster(this.marked, this.planetsLeft);
        if (insideCluster.length > 0) {
            this.addClusterPlanets(insideCluster);
        }
    }

    private addClusterPlanets(planetsAdded: Planet[],) {

        planetsAdded.forEach((planet) => {
            planet.markPlanet(this.registry.get(CONSTANTS.REGISTRY.CLUSTERS).length);
            this.marked.push(planet);
            this.planetsLeft.remove(planet);
            planet.active = false;
        })

        this.numVisitedPlanets = this.numVisitedPlanets + planetsAdded.length;
        this.addPlanetPoints(planetsAdded.length);
    }

    /**
     * ---------------------------------------- EVENT STUFF ---------------------------------- 
     */
    private addPlanetFromShip() {
        this.points += 1000;
        eventCenter.emit(CONSTANTS.EVENTS.SINGLE_PLANET_ADDED, 1000, this.points , this.numVisitedPlanets);
    }

    private addPlanetPoints(numberOfPlanets: number) {
        const addedPoints = 1000 * numberOfPlanets;
        this.points += addedPoints;
        eventCenter.emit(CONSTANTS.EVENTS.UPDATE_DISPLAY, addedPoints, this.points, this.numVisitedPlanets);
    }

    private updateTimer(timer: number) {
        this.timer = timer;
    }

    private timerGameOver() {
        if (!this.gameOver) {
            this.scene.stop(CONSTANTS.SCENES.HUD);
            let { width, height } = this.sys.game.canvas;
            this.input.disable(this);
            this.gameOver = true;
            this.ship.setVelocity(0);
            this.add.text(this.ship.x - 150, this.ship.y - 200, "<time has run out>", { fontFamily: 'atari' })
                .setScale(2)
                .setDepth(100)
                .setColor('#FF0000');

            let planetsLeft = this.numPlanets - this.numVisitedPlanets;
            let percentage  = (planetsLeft /this.numPlanets) * 100;
            let data = false;
            if (percentage < this.dataThreshold) {
                data = true;
            }

            this.time.delayedCall(3000, this.switchToInput, [0, data, false], this);
        }
    }

    private gameOverCrashed() {
        if (!this.gameOver) {
            this.scene.stop(CONSTANTS.SCENES.HUD);
            let { width, height } = this.sys.game.canvas;
            this.input.disable(this);
            this.gameOver = true;
            this.ship.setVelocity(0);
            this.add.text(this.ship.x - 200, this.ship.y - 200, "<you crashed on a planet>", { fontFamily: 'atari' })
                .setScale(2)
                .setDepth(100)
                .setColor('#FF0000');

                let planetsLeft = this.numPlanets - this.numVisitedPlanets;
                let percentage  = (planetsLeft /this.numPlanets) * 100;
                let data = false;
                if (percentage < this.dataThreshold) {
                    data = true;
                }
             
            this.time.delayedCall(3000, this.switchToInput, [this.timer, data, false], this);
        }
    }

    private win() {
        if (!this.gameOver) {
            this.scene.stop(CONSTANTS.SCENES.HUD);
            this.input.disable(this);
            this.gameOver = true;
            this.ship.setVelocity(0);
            this.add.text(this.ship.x - 200, this.ship.y - 200, "<you won>", { fontFamily: 'atari' })
                .setScale(2)
                .setDepth(100)
                .setColor('#ffd700');

            this.time.delayedCall(3000, this.switchToInput, [this.timer, true, true], this);
        }
    }

    private switchToInput(timer: any, sendData: boolean, won: boolean) {
        this.addClusterToRegistry();
        this.scene.stop(CONSTANTS.SCENES.PLAY);
        this.scene.stop(CONSTANTS.SCENES.HUD);
        this.scene.start(CONSTANTS.SCENES.INPUT, { timer: timer, points: this.points, numVisi: this.numVisitedPlanets, level: this.levelData, sendData: sendData, won: won});
    }

    /**
     * ---------------------------------------- CONFIG STUFF ---------------------------------- 
     */

    private setupEventListeners() {
        eventCenter.on(CONSTANTS.EVENTS.UPDATE_TIMER, this.updateTimer, this);

        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            eventCenter.off(CONSTANTS.EVENTS.UPDATE_TIMER, this.updateTimer, this);
        });

        eventCenter.on(CONSTANTS.EVENTS.DEATH_BY_TIMER, this.timerGameOver, this);

        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            eventCenter.off(CONSTANTS.EVENTS.DEATH_BY_TIMER, this.timerGameOver, this);
        });
    }
}
