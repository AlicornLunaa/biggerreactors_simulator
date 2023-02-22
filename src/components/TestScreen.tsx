import { Checkbox } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import SimulationDescription from "../classes/bigger_reactors/SimulationDescription";
import TimeSlicedReactorSimulation from "../classes/bigger_reactors/TimeSlicedReactorSimulation";
import { Materials } from "../classes/Materials";

export default function TestScreen(){
    const reactor = useRef<TimeSlicedReactorSimulation>();
    const active = useRef(true);
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        let desc = new SimulationDescription();
        desc.setSize(3, 1, 3);
        desc.setControlRod(1, 1, true);
        desc.setModeratorProperties(0, 0, 0, Materials[0][12]);
        desc.setModeratorProperties(1, 0, 0, Materials[0][12]);
        desc.setModeratorProperties(2, 0, 0, Materials[0][12]);
        desc.setModeratorProperties(0, 0, 1, Materials[0][12]);
        desc.setModeratorProperties(2, 0, 1, Materials[0][12]);
        desc.setModeratorProperties(0, 0, 2, Materials[0][12]);
        desc.setModeratorProperties(1, 0, 2, Materials[0][12]);
        desc.setModeratorProperties(2, 0, 2, Materials[0][12]);
        reactor.current = new TimeSlicedReactorSimulation(desc);

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

    if(reactor.current == null) return (<div>Null reactor</div>);

    return (
        <div>
            <p>{reactor.current.x}x{reactor.current.y}x{reactor.current.z}</p>
            <p>Fuel: {Math.round(reactor.current.fuelTank!.fuel)}/{Math.round(reactor.current.fuelTank!.capacity)}</p>
            <p>Battery: {Math.round(reactor.current.battery!.stored)}/{Math.round(reactor.current.battery!.capacity)}</p>
            <button onClick={() => {
                if(reactor.current == null) return;
                reactor.current.fuelTank.fuel = reactor.current.fuelTank.capacity;
                setUpdate(true);
            }}>Refuel</button>
            <Checkbox onChange={(selected) => { active.current = selected.target.checked; }} />
        </div>
    )
}