import {ValidationError} from "class-validator";

export default class InvalidEntity extends Error {
    __proto__ = Error
    get name(): string {
        return "InvalidEntity";
    }

    constructor(errors : ValidationError[], message?: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidEntity.prototype);
        this.message = `${errors}`;
    }

}
