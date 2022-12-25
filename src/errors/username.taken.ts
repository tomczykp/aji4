
export default class UserNameError extends Error {
    constructor() {
        super();
        this.message = "username already in use";
    }
}
