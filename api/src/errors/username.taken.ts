
export default class UniqNameError extends Error {
    __proto__ = Error
    get name(): string {
        return "UniqNameError";
    }

    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, UniqNameError.prototype);
        this.message = "field value must be uniq";
    }

}
