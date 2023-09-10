export const CONSTANTS = {
    SCENES: {
        LOAD: "LOAD",
        MENU: "MENU",
        HIGHSCORE: "HIGHSCORE",
        SELECTION: "SELECTION",
        PLAY: "PLAY",
        MENUBACKGROUND: "MENUBACKGROUND",
        INPUT: "INPUTSCENE",
        ABOUT: "ABOUT",
        HUD: "HUD",
        CALCULATION: "CALCULATION",
        CREDIT: "CREDITS",
        MUSIC: "MUSIC"
    },
    IMAGE: {
        SHIP: "SingleOrangeSpaceship.png"
    },
    SPRITE: {
        MENUSTAR: "MenuStar.png",
        ICE: "ice.png",
        ISLANDS: "islands.png",
        MOON: "moon.png",
        TERRADRY: "terraDry.png",
        TERRAWET: "terranWet.png",
    },
    SPRITE_ANIM: {
        MENUSTAR: "MENUSTAR_ROTATE",
        ICE: "ICE_ROTATE",
        ISLANDS: "ISLANDS_ROTATE",
        MOON: "MOON_ROTATE",
        TERRADRY: "TERRADRY_ROTATE",
        TERRAWET: "TERRAWET_ROTATE",
    },
    REGISTRY: {
        SCORE: 'SCORE',
        CLUSTERS: 'CLUSTERS',
        MAXDISTANCE: 'MAXDISTANCE',
        LEVELS: 'LEVELS',
        OVERVIEW: 'OVERVIEW'
    },
    TYPES: {
        SPACESHIP: 'SPACESHIP',
        COLLECTOR: 'COLLECTOR',
        PLANET: 'PLANET'
    },
    EVENTS:{
        UPDATE_DISPLAY: 'UPDATE-DISPLAY',
        UPDATE_TIMER: 'UPDATE-TIMER',
        DEATH_BY_TIMER: 'DEATH-BY-TIMER',
        PAUSE_TOGGLE: 'PAUSE-TOGGLE',
        SINGLE_PLANET_ADDED: 'ADD-SINGLE-PLANET',
        UPDATE_BOOSTER: 'UPDATE-BOOSTER'
    },
    LAYERS: {
        PLANET_LAYER: 'PLANET_LAYER',
    },
    URLS: {
        LEVELDATA: 'http://localhost:8080/level?levelId=',
        HIGHSCORE: 'http://localhost:8080/highscore?levelId=',
        ADDRESULT:'http://localhost:8080/result',
        OVERVIEW:'http://localhost:8080/overview'
    },
    MUSIC: {
        LADY: 'ladyofthe80s.mp3'
    }
}
