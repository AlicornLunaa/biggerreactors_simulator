/**
 * This interface is meant to be used as the compatability layer between the
 * ported java code and the javascript for the website.
 */
interface ReactorInterface {
    tick(active: boolean): void;
    refuel(): void;

    get_width(): number;
    get_depth(): number;
    get_height(): number;

    get_generated(): number; // Energy generated within a tick
    get_energy(): number;
    get_energy_capacity(): number;

    get_stack_temperature(): number;
    get_fuel_temperature(): number;
    get_fuel_burned(): number; // Fuel burned within a tick
    get_fuel(): number;
    get_fuel_capacity(): number;
    get_waste(): number;
    
    get_fertility(): number;
    
    set_control_rod(index: number, insertion: number): void;
    get_control_rod(index: number): number;
    get_control_rod_count(): number;
};