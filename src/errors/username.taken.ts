
export default class UserNameError extends Error {
    __proto__ = Error
    get name(): string {
        return "UserNameError";
    }

    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, UserNameError.prototype);
        this.message = "username is already taken";
    }

}
