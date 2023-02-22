import { useEffect, useState } from "react";
import SimulationDescription from "../classes/bigger_reactors/SimulationDescription";
import TimeSlicedReactorSimulation from "../classes/bigger_reactors/TimeSlicedReactorSimulation";
import { Materials } from "../classes/Materials";

export default function TestScreen(){
    const [reactor, setReactor] = useState<TimeSlicedReactorSimulation>();
    const [active, setActive] = useState(false);
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
        setReactor(new TimeSlicedReactorSimulation(desc));

        const tickInterval = setInterval(() => {
            if(reactor == null) return;
            reactor.tick(true);
            setUpdate(true);
        }, 50);

        return () => {
            clearInterval(tickInterval);
        };
    }, []);

    useEffect(() => { setUpdate(false); }, [update])

    if(reactor == null) return (<div>Null reactor</div>);

    return (
        <div>
            <p>{reactor.x}x{reactor.y}x{reactor.z}</p>
            <p>Fuel: {reactor.fuelTank!.fuel}/{reactor.fuelTank!.capacity}</p>
            <p>Battery: {reactor.battery!.stored}/{reactor.battery!.capacity}</p>
            <button onClick={() => {
                if(reactor == null) return;
                reactor.tick(true);
                setUpdate(true);
            }}>Tick</button>
            <button onClick={() => {
                if(reactor == null) return;
                reactor.fuelTank.fuel = reactor.fuelTank.capacity;
                setUpdate(true);
            }}>Refuel</button>
        </div>
    )
}