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

    useEffect(() => {
        let elements: JSX.Element[] = [];

        for(let i = 0; i < reactorMaterials.length; i++){
            elements.push(
                <Grid item xs={1}>
                    <div className="reactorElement">{reactorMaterials[i].displayName}</div>
                </Grid>
            )
        }

        setReactorElements(elements);
    }, [reactorMaterials]);
    
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
            <Grid container spacing={2} columns={{ xs: props.width }}>
                { reactorElements }
            </Grid>
            <p>{props.width}x{props.depth}x{props.height}</p>
        </div>
    );
}

export default ReactorWindow;