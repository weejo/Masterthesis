import { GameObjects } from "phaser";
import { CONSTANTS } from "../constants.ts";
import { Planet } from "../sprites/Planet.ts";

export class CalculationScene extends Phaser.Scene {

    constructor() {
        super({
            key: CONSTANTS.SCENES.CALCULATION
        });
    }

    calculatePointsInCluster(polygon: Planet[], pointsToLookAt: GameObjects.Group ): Planet[] {
        let addedPlanets: Planet[] = new Array();
        let ptla = pointsToLookAt.children.getArray();

        for (let index = 0; index < ptla.length; index++) {
            const element = ptla[index] as Planet;
            if(this.isPointInsidePolygon(element, polygon)) {
                addedPlanets.push(element);
            }
        }
        return addedPlanets;
    }

    /**
     * This is how we check if a point is inisde our polygon 
     * @param point 
     * @param vertices 
     * @returns 
     */
    isPointInsidePolygon(point: Planet, polygon: Planet[]): boolean  {
        const x = point.x;
        const y = point.y;

        var inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i].x, yi = polygon[i].y;
            const xj = polygon[j].x, yj = polygon[j].y;

            const intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
            if (intersect) inside = !inside;
        }

        return inside;
    }
}