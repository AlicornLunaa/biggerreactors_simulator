import { Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { Materials, Material } from "../classes/Materials";
import "./MaterialList.css";

interface MaterialListProps {
    setMaterial: (m: Material) => void;
    useOldMaterials: boolean;
};

function MaterialList(props: MaterialListProps){
    const [materialDivs, setMaterialDivs] = useState<JSX.Element[]>([]);

    useEffect(() => {
        let currentList: Material[] = Materials[(props.useOldMaterials ? 1 : 0)];
        let materialElements: JSX.Element[] = [];
        let i = 0;

        for(let m of currentList){
            materialElements.push( <button key={i} onClick={() => { props.setMaterial(m) }}>{m.displayName}</button> )
            i++;
        }

        setMaterialDivs(materialElements);
    }, [props.useOldMaterials])
    
    return (
        <Stack className="materialBar">
            { materialDivs }
        </Stack>
    )
}

export default MaterialList;