import { Button, Checkbox, Slider, ToggleButton } from "@mui/material";
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useState } from "react";
import TimeSlicedReactorSimulation from "../classes/bigger_reactors/TimeSlicedReactorSimulation";
import "./ControlRodPanel.css";

interface ControlRodPanelProps {
    reactor: MutableRefObject<TimeSlicedReactorSimulation | null>;
}

interface Rod {
    rodValue: number;
    setRodValue: Dispatch<SetStateAction<number>>;
}

export default function ControlRodPanel(props: ControlRodPanelProps){
    const [locked, setLocked] = useState(true);
    const [rodValues, setRodValues] = useState<number[]>([]);

    useEffect(() => {
        if(props.reactor.current == undefined) return;

        let rodList = props.reactor.current.controlRods;
        let vals = [];
        for(let i = 0; i < rodList.length; i++){
            vals.push(rodList[i].insertion);
        }
        setRodValues(vals);
    }, [props.reactor.current]);

    useEffect(() => {
        if(props.reactor.current == undefined) return;

        for(let i = 0; i < rodValues.length; i++){
            props.reactor.current.controlRods[i].insertion = rodValues[i];
        }
    }, [rodValues]);

    return (
        <div className="controlRodPanel">
            <div className="titleBar">Control Rods</div>
            <div className="break" />
            <div className="rods">
                <Checkbox checked={locked} onChange={() => { setLocked(!locked); }} /><span>Lock sliders together</span>
                {rodValues.map((insertion, i) => {
                    return (<div key={i} className="rod">
                        <p>Rod {i + 1}: {insertion}</p>
                        <Slider value={insertion} onChange={(e, val) => {
                            if(locked){
                                let rodList = props.reactor.current == null ? [] : props.reactor.current.controlRods;
                                let vals = [];
                                for(let i = 0; i < rodList.length; i++){
                                    vals.push(val as number);
                                }
                                setRodValues(vals);
                            } else {
                                rodValues[i] = val as number;
                                setRodValues(rodValues => [...rodValues]);
                            }
                        }} />
                    </div>)
                })}
            </div>
        </div>
    )
}