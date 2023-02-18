import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { Material, Materials } from "../classes/Materials";
import "./ReactorWindow.css"

interface ReactorWindowProps {
    material: Material | null;
    width: number;
    depth: number;
    height: number;
}

function ReactorWindow(props: ReactorWindowProps){
    const [reactorMaterials, setReactorMaterials] = useState<Material[]>([])
    const [reactorElements, setReactorElements] = useState<JSX.Element[]>([]);

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
    }, [props.width, props.depth]);

    return (
        <div className="reactor">
            <Grid container spacing={0.14} columns={{ xs: props.width + 2 }}>
                { reactorElements }
            </Grid>
            <p>{props.width}x{props.depth}x{props.height}</p>
            <p>{props.material?.displayName}</p>
        </div>
    );
}

export default ReactorWindow;