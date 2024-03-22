export default class IHeat {
    public value: number;

    constructor(value: number){
        this.value = value;
    }

    set(value: number): void {
        this.value = value;
    }

    add(amount: number): void {
        this.value += amount;
    }

    resetIfNegative(): void {
        if(this.value < 0){
            this.value = 0;
        }
    }
}