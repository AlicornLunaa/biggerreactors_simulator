import { Button, Checkbox, ToggleButton } from "@mui/material";
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useState } from "react";
import TimeSlicedReactorSimulation from "../classes/bigger_reactors/TimeSlicedReactorSimulation";
import "./ControlPanel.css";

interface ControlPanelProps {
    reactor: MutableRefObject<TimeSlicedReactorSimulation | null>;
    active: MutableRefObject<boolean>;
    update: boolean;
}

export default function ControlPanel(props: ControlPanelProps){
    const round = (val: number, places: number) => (Math.round(val * places) / places);

    const unit = (rf: number): [number, string] => {
        if(rf >= 1_000_000){
            return [round(rf / 1_000_000, 100), "MiRF/t"];
        } else if(rf >= 1000){
            return [round(rf / 1000, 100), "KiRF/t"];
        }

        return [Math.round(rf), "RF/t"];
    };

    if(props.reactor.current == undefined) return (<div></div>);

    let [rfGenerated, rfUnit] = unit(props.reactor.current.battery!.generatedLastTick);
    let fuelRatio = props.reactor.current.fuelTank.fuel / props.reactor.current.fuelTank.capacity;
    let wasteRatio = props.reactor.current.fuelTank.waste / props.reactor.current.fuelTank.capacity;
    let caseHeatRatio = Math.min(props.reactor.current.stackHeat.temperature / 2000, 1);
    let fuelHeatRatio = Math.min(props.reactor.current.fuelHeat.temperature / 2000, 1);
    let batteryRatio = (props.reactor.current.battery!.stored / props.reactor.current.battery!.capacity);

    return (
        <div className="controlPanel">
            <div className="titleBar">Reactor Info</div>
            <div className="break" />
            <div className="left">
                <div className="stat">Temperature: {round(props.reactor.current.fuelHeat.temperature, 1)} K</div>
                <div className="stat">Generation: {rfGenerated} {rfUnit}</div>
                <div className="stat">Fuel Usage: {round(props.reactor.current.fuelTank.burnedLastTick, 1000)} mB/t</div>
                <div className="stat">Fuel: {Math.round(props.reactor.current.fuelTank!.fuel)}/{Math.round(props.reactor.current.fuelTank!.capacity)}</div>
                <div className="stat">Waste: {Math.round(props.reactor.current.fuelTank!.waste)}/{Math.round(props.reactor.current.fuelTank!.capacity)}</div>
                <div className="stat">Battery: {Math.round(props.reactor.current.battery!.stored)}/{Math.round(props.reactor.current.battery!.capacity)}</div>
                <div className="stat">
                    <ToggleButton value="active" selected={props.active.current} onChange={() => { props.active.current = !props.active.current; }}>{props.active.current ? "Active" : "Inactive"}</ToggleButton>
                    <Button value="refuel" onClick={() => {
                        props.reactor.current!.fuelTank.fuel = props.reactor.current!.fuelTank.capacity;
                        props.reactor.current!.fuelTank.partialUsed = 0;
                        props.reactor.current!.fuelTank.waste = 0;
                    }}>Refuel</Button>
                </div>
            </div>
            <div className="right">
                <div className="bar" style={{ height: (fuelRatio * 100)+"%", top: ((1 - fuelRatio) * 100)+"%", backgroundColor: "#66CC00" }}></div> {/* Fuel */}
                <div className="bar" style={{ height: (wasteRatio * 100)+"%", top: ((1 - wasteRatio) * 100)+"%", backgroundColor: "#00C8CC" }}></div> {/* Waste */}
                <div className="bar" style={{ height: (caseHeatRatio * 100)+"%", top: ((1 - caseHeatRatio) * 100)+"%", backgroundColor: "#CC6600" }}></div> {/* Case Heat */}
                <div className="bar" style={{ height: (fuelHeatRatio * 100)+"%", top: ((1 - fuelHeatRatio) * 100)+"%", backgroundColor: "#CC6600" }}></div> {/* Fuel Heat */}
                <div className="bar" style={{ height: (batteryRatio * 100)+"%", top: ((1 - batteryRatio) * 100)+"%", backgroundColor: "#CC2800" }}></div> {/* Battery */}
            </div>
        </div>
    )
}