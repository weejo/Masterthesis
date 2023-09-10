import { Planet } from "../sprites/Planet.ts";

export class constUtils {
    
        
    static resolveGid(gid?: number): string {
        if (gid == 0) {
            return "ICE";
        }else if (gid == 1) {
            return "ISLANDS";
        }else if (gid == 2) {
            return "MENUSTAR";
        }else if (gid == 3) {
            return "MOON";
        }else if (gid == 4) {
            return "TERRADRY";
        } else if (gid == 5) {
            return "TERRAWET";
        }
        return "ICE";
    }

    /*
        This is ugly i know, but i'm running out of time for a fully fledged computed solution to cluster colors.
        This works and is easily extendable if ever needed.
    */ 
    static resolveClusterColor(numberOfClusters: number): number {
        var clusterColors = [ "00FF00","0f1ddb","9e0fdb","db0f9a","db720f","bd2109","e2f720"]
        return parseInt(clusterColors[numberOfClusters % clusterColors.length],16);
    }

    static drawClusterLine(current: Planet, other: Planet, scene: Phaser.Scene, numberOfClusters: number) {
        if (other == undefined || current == undefined)return;
        const line = new Phaser.Geom.Line(other.x, other.y, current.x, current.y);

        const graphics = scene.add.graphics({ lineStyle: { width: 4, color: constUtils.resolveClusterColor(numberOfClusters) } });
        graphics.depth = -1;
        graphics.strokeLineShape(line);
    }
  }