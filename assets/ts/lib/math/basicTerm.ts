
export class BasicTerm {
    coeffecient: number;
    power: number;

    constructor(coef: number, power: number) {
        this.coeffecient = coef;
        this.power = power;
    }

    getScaledYvalue(x: number, scale = 100): number {
        if(this.power < 0 && Math.abs(x) < 1e-6)
            return NaN;
        
        return (this.coeffecient * ((x ** this.power) * scale));
    }

    getYvalue(x: number, scale = 100): number {
        return this.getScaledYvalue(x, scale) / scale;
    }
}