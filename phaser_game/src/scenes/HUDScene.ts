import { CONSTANTS } from "../constants.ts";
import { SpaceShip } from "../sprites/SpaceShip.ts";
import eventCenter from "../utils/EventCenter.ts";
export class HUDScene extends Phaser.Scene {
    scoreDisplay: Phaser.GameObjects.Text;
    addedPointsDisplay: Phaser.GameObjects.Text;
    deathTimerDisplay: Phaser.GameObjects.Text;
    initialTime: number;
    addedTimeDisplay: Phaser.GameObjects.Text;
    planetsLeftDisplay: Phaser.GameObjects.Text;
    boosterDisplay: Phaser.GameObjects.Text;
    timeLeft: number;
    lastTimeStamp: number;
    bIsGameRunning: boolean;
    numberOfPlanets: number;

    constructor() {
        super({ key: CONSTANTS.SCENES.HUD, active: false });
        this.timeLeft = 0;
        this.bIsGameRunning = false;
        this.lastTimeStamp = Date.now();
        this.initialTime = 0;
        this.numberOfPlanets = 0;
    }

    create() {
        this.setupEventListeners();

        this.setupTextLayout();

        this.timeLeft = this.initialTime
    }

    private setupTextLayout() {
        let { width, height } = this.sys.game.canvas;

        this.scoreDisplay = this.add.text(width / 2, height / 10, "0", { fontFamily: 'atari' })
            .setScale(1.5)
            .setColor('#ffffff');

        this.addedPointsDisplay = this.add.text(width / 2, height / 10 + 50, "", { fontFamily: 'atari' })
            .setScale(1.5)
            .setColor('#00FF00');

        this.deathTimerDisplay = this.add.text(width / 2, height - 100, this.initialTime.toString(), { fontFamily: 'atari' })
            .setScale(1.5)
            .setColor('#ffffff');

        this.addedTimeDisplay = this.add.text(width / 2, height - 150, "", { fontFamily: 'atari' })
            .setScale(1.5)
            .setColor('#00FF00');

        this.planetsLeftDisplay = this.add.text(50, height - height / 4 - 50, "Planets left: " + this.numberOfPlanets.toString(), { fontFamily: 'atari' })
            .setScale(1)
            .setColor('#ffffff');

        this.boosterDisplay = this.add.text((width / 4) * 3, height - 100, "||||||||||", { fontFamily: 'atari' })
            .setScale(1.5)
            .setColor('#FFFFFF');

        this.add.text(50, height/2, "<controls>", {fontFamily: 'atari'})
        .setScale(1)
        .setColor('#FFFFFF');
        this.add.text(50, height/2 + 50, "<click = move>", {fontFamily: 'atari'})
        .setScale(0.75)
        .setColor('#FFFFFF');
        this.add.text(50, height/2 + 100, "<spacebar = booster>", {fontFamily: 'atari'})
        .setScale(0.75)
        .setColor('#FFFFFF');

    }

    update(time: number, delta: number): void {
        if (this.bIsGameRunning) {
            let now = Date.now();
            var difference = now - this.lastTimeStamp;
            difference = difference / 1000;
            this.timeLeft = this.timeLeft - difference;
            if (this.timeLeft < 0) {
                eventCenter.emit(CONSTANTS.EVENTS.DEATH_BY_TIMER);
            } else if (this.timeLeft < 10) {
                eventCenter.emit(CONSTANTS.EVENTS.UPDATE_TIMER, this.timeLeft);
                this.deathTimerDisplay.setText(this.timeLeft.toFixed(1).toString()).setColor('#FF0000');
            } else {
                eventCenter.emit(CONSTANTS.EVENTS.UPDATE_TIMER, this.timeLeft);
                this.deathTimerDisplay.setText(this.timeLeft.toFixed(1).toString());
            }
            this.lastTimeStamp = Date.now();
        }
    }

    init(data: any) {
        this.initialTime = data.initialTime;
        this.numberOfPlanets = data.numberOfPlanets;
    }

    private setupEventListeners() {
        eventCenter.on(CONSTANTS.EVENTS.UPDATE_DISPLAY, this.updateDisplay, this);

        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            eventCenter.off(CONSTANTS.EVENTS.UPDATE_DISPLAY, this.updateDisplay, this);
        });

        eventCenter.on(CONSTANTS.EVENTS.SINGLE_PLANET_ADDED, this.planetAdded, this);

        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            eventCenter.off(CONSTANTS.EVENTS.SINGLE_PLANET_ADDED, this.planetAdded, this);
        });

        eventCenter.on(CONSTANTS.EVENTS.PAUSE_TOGGLE, this.toggleGameState, this);

        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            eventCenter.off(CONSTANTS.EVENTS.PAUSE_TOGGLE, this.toggleGameState, this);
        });

        eventCenter.on(CONSTANTS.EVENTS.UPDATE_BOOSTER, this.updateBooster, this);

        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            eventCenter.off(CONSTANTS.EVENTS.UPDATE_BOOSTER, this.updateBooster, this);
        });
    }

    private updateBooster(boosterValue: number) {
        let display = Math.floor(boosterValue/10);
        this.boosterDisplay.text = "|".repeat(display);
    }

    private updateDisplay(pointsAdded: number, totalpoints: number, visitedPlanets: number) {
        this.addedPointsDisplay.setText("+" + pointsAdded.toString());
        this.addedPointsDisplay.setAlpha(1);

        this.tweens.add({
            targets: this.addedPointsDisplay,
            alpha: 0,
            duration: 1000
        });

        this.scoreDisplay.setText(totalpoints.toString());
        this.planetsLeftDisplay.text = "Planets left: " + (this.numberOfPlanets - visitedPlanets).toString();
    }

    private toggleGameState(bIsRunning: boolean) {
        this.bIsGameRunning = bIsRunning;
        this.lastTimeStamp = Date.now();
    }


    private planetAdded(pointsAdded: number, totalpoints: number, visitedPlanets: number) {
        this.updateDisplay(pointsAdded, totalpoints, visitedPlanets);
        this.timeLeft = this.timeLeft + 1;
        this.addedTimeDisplay.setText("+1");
        this.addedTimeDisplay.setAlpha(1);

        this.tweens.add({
            targets: this.addedTimeDisplay,
            alpha: 0,
            duration: 1000
        });
    }
}