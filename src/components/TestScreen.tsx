import { useEffect, useState } from "react";
import SimulationDescription from "../classes/bigger_reactors/SimulationDescription";
import TimeSlicedReactorSimulation from "../classes/bigger_reactors/TimeSlicedReactorSimulation";

export default function TestScreen(){
    let [reactor, setReactor] = useState<TimeSlicedReactorSimulation>();
    let [update, setUpdate] = useState(false);

    useEffect(() => {
        let desc = new SimulationDescription();
        desc.setSize(3, 3, 3);
        desc.setControlRod(1, 1, true);
        setReactor(new TimeSlicedReactorSimulation(desc));
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