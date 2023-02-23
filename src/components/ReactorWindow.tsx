import { Grid } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import SimulationDescription from "../classes/bigger_reactors/SimulationDescription";
import TimeSlicedReactorSimulation from "../classes/bigger_reactors/TimeSlicedReactorSimulation";
import { Material, Materials } from "../classes/Materials";
import ControlPanel from "./ControlPanel";
import ControlRodPanel from "./ControlRodPanel";
import "./ReactorWindow.css"

interface ReactorWindowProps {
    material: Material | null;
    width: number;
    depth: number;
    height: number;
}

function ReactorWindow(props: ReactorWindowProps){
    const [update, setUpdate] = useState(false);
    const [reactorMaterials, setReactorMaterials] = useState<Material[]>([])
    const [reactorElements, setReactorElements] = useState<JSX.Element[]>([]);

    const reactorDesc = useRef<SimulationDescription>(new SimulationDescription());
    const active = useRef<boolean>(false);
    const reactor = useRef<TimeSlicedReactorSimulation | null>(null);

    const searchMaterial = (id: string) => {
        for(let m of Materials[0]){
            if(m.id == "minecraft:air"){
                return m;
            }
        }

        return Materials[0][0];
    }

    const setMaterial = (id: number, m: Material | null) => {
        if(m == null) return;
        reactorMaterials[id] = m;
        setReactorMaterials(reactorMaterials => [...reactorMaterials]);
    }

    useEffect(() => {
        let elements: JSX.Element[] = [];
        let count = 0;

        for(let i = 0; i < props.width + 2; i++){
            elements.push( <Grid item key={count} xs={1}> <div className="reactorWall" /> </Grid> );
            count++;
        }

        for(let i = 0; i < reactorMaterials.length; i++){
            if((i % props.width) == 0){
                elements.push( <Grid item key={count} xs={1}> <div className="reactorWall" /> </Grid> );
                count++;
            }
            
            elements.push(
                <Grid item key={count} xs={1}>
                    <button className="reactorElement" onClick={() => {setMaterial(i, props.material)}}>{reactorMaterials[i].displayName}</button>
                </Grid>
            );
            count++;

            if((i % props.width) == props.width - 1){
                elements.push( <Grid item key={count} xs={1}> <div className="reactorWall" /> </Grid> );
                count++;
            }
        }
        
        for(let i = 0; i < props.width + 2; i++){
            elements.push( <Grid item key={count} xs={1}> <div className="reactorWall" /> </Grid> );
            count++;
        }

        setReactorElements(elements);

        // Create sim
        for(let i = 0; i < reactorMaterials.length; i++){
            let x = i % props.width;
            let z = Math.floor(i / props.width);

            if(reactorMaterials[i].id == "biggerreactors:fuel_rod"){
                // Yummy fun rods
                reactorDesc.current.setControlRod(x, z, true);
                continue;
            }
            
            reactorDesc.current.setControlRod(x, z, false);

            for(let h = 0; h < props.height; h++){
                reactorDesc.current.setModeratorProperties(x, h, z, reactorMaterials[i]);
            }
        }
        reactor.current = new TimeSlicedReactorSimulation(reactorDesc.current);
    }, [reactorMaterials, props.material]);
    
    useEffect(() => {
        let materials: Material[] = [];
        let air = searchMaterial("minecraft:air");

        for(let x = 0; x < props.width; x++){
            for(let y = 0; y < props.depth; y++){
                materials.push(air);
            }
        }

        setReactorMaterials(materials);

        reactorDesc.current.setSize(props.width, props.height, props.depth);
        reactor.current = new TimeSlicedReactorSimulation(reactorDesc.current);
    }, [props.width, props.depth, props.height]);

    useEffect(() => {
        const tickInterval = setInterval(() => {
            if(reactor.current == null) return;
            reactor.current.tick(active.current);
            setUpdate(true);
        }, 50);

        return () => {
            clearInterval(tickInterval);
        };
    }, []);

    useEffect(() => { setUpdate(false); }, [update])
    
    return (
        <div className="reactor">
            <Grid container spacing={0.14} columns={{ xs: props.width + 2 }}>
                { reactorElements }
            </Grid>
            <p>{props.width}x{props.depth}x{props.height}</p>
            <p>{props.material?.displayName}</p>
            <ControlPanel reactor={reactor} active={active} update={update} />
            <ControlRodPanel reactor={reactor} />
        </div>
    );
}

export default ReactorWindow;