export default class OperationalMode {
    public static Active = new OperationalMode(false);
    public static Passive = new OperationalMode(true);

    public passiveReactor = false;

    constructor(passiveReactor: boolean){
        this.passiveReactor = passiveReactor;
    }

    public isActive(): boolean {
        return !this.passiveReactor;
    }

    public isPassive(): boolean {
        return this.passiveReactor;
    }
};