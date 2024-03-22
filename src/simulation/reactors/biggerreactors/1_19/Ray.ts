import { Vector3 } from "../../../Vector";
import Config from "./Config";

class RayStep {
    static rays: RayStep[][] = [];

    offset: Vector3;
    length: number;

    constructor(offset: Vector3, length: number){
        this.offset = offset;
        this.length = length;
    }
}

{
    RayStep.rays = [];
    let TTL = Config.Reactor.IrradiationDistance;
    
    // generate ray directions using Fibonacci sphere
    let SimulationRays = Config.SimulationRays;
    let SimulationRaysDouble = SimulationRays - 1;
    let rayDirections: Vector3[] = [];
    let phi = Math.PI * (3.0 - Math.sqrt(5));
    for (let i = 0; i < SimulationRays; i++) {
        let y = 1.0 - (i * 2.0 / SimulationRaysDouble);
        let radius = Math.sqrt(1.0 - y * y);
        let theta = phi * i;
        let x = Math.cos(theta) * radius;
        let z = Math.sin(theta) * radius;
        rayDirections.push(new Vector3(x, y, z).normalize());
    }
    
    let radiationDirection = new Vector3(0, 0, 0);
    let currentSegment = new Vector3(0, 0, 0);
    let currentSegmentStart = new Vector3(0, 0, 0);
    let currentSegmentEnd = new Vector3(0, 0, 0);
    let currentSectionBlock = new Vector3(0, 0, 0);
    let planes = new Vector3(0, 0, 0);
    let processedLength = 0;
    
    let intersections: Vector3[] = [
            new Vector3(0, 0, 0),
            new Vector3(0, 0, 0),
            new Vector3(0, 0, 0)
    ];
    
    // ray tracing, because cardinal directions isn't good enough for me
    // also keeps you from building a skeleton reactor
    for (let rayDirection of rayDirections) {
        let raySteps: RayStep[] = [];
        
        radiationDirection.set(rayDirection);
        radiationDirection.normalize();
        
        // radiation extends for RadiationBlocksToLive from the outside of the fuel rod
        // but i rotate about the center of the fuel rod, so, i need to add the length of the inside
        currentSegmentStart.set(radiationDirection);
        currentSegmentStart.mul(1 / Math.abs(currentSegmentStart.get(currentSegmentStart.maxComponent())));
        currentSegmentStart.mul(0.5);
        radiationDirection.mul(TTL + currentSegmentStart.length());
        
        processedLength = 0;
        let totalLength = radiationDirection.length();
        
        currentSegmentStart.mul(0);
        
        // +0.5 or -0.5 for each of them, tells me which way i need to be looking for the intersections
        planes.set(radiationDirection);
        planes.absolute();
        planes.divVec(radiationDirection);
        planes.mul(0.5);
        
        let firstIteration = true;
        let i = 0;

        while (i < 500000) {
            i++;

            for (let i = 0; i < 3; i++) {
                let intersection = intersections[i];
                intersection.set(radiationDirection);
                let component = intersection.get(i);
                let plane = planes.get(i);
                intersection.mul(plane / component);
            }   
            
            let minVec = 0;
            let minLength = Infinity;
            for (let i = 0; i < 3; i++) {
                let length = intersections[i].length();
                if (length < minLength) {
                    minVec = i;
                    minLength = length;
                }
            }
            
            // move the plane we just intersected back one
            planes.setComponent(minVec, planes.get(minVec) + (planes.get(minVec) / Math.abs(planes.get(minVec))));
            
            currentSegmentEnd.set(intersections[minVec]);
            currentSegment.set(currentSegmentEnd).sub(currentSegmentStart);
            currentSectionBlock.set(currentSegmentEnd).sub(currentSegmentStart).mul(0.5).add(0.5, 0.5, 0.5).add(currentSegmentStart.x, currentSegmentStart.y, currentSegmentStart.z).floor();
            
            let segmentLength = currentSegment.length();
            let breakAfterLoop = processedLength + segmentLength >= totalLength;
            
            segmentLength = Math.min(totalLength - processedLength, segmentLength);

            if(Number.isNaN(segmentLength)){
                // let a;
            }
            
            if (!firstIteration && segmentLength != 0) {
                raySteps.push(new RayStep(new Vector3(currentSectionBlock.x, currentSectionBlock.y, 0), segmentLength));
            }
            firstIteration = false;
            
            
            processedLength += segmentLength;
            if (breakAfterLoop) {
                break;
            }
            
            currentSegmentStart.set(currentSegmentEnd);
        }

        RayStep.rays.push(raySteps);
    }

    console.log("Finished ray sim");
}

export default RayStep;