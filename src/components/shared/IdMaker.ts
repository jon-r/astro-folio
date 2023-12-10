export class IdMaker {
    #limit: number;
    #nextId = 0;
    constructor(limit: number) {
        this.#limit = limit;
    }

    getNextId() {
        const thisId = this.#nextId;
        this.#nextId = (thisId + 1) % (this.#limit * 2);

        return thisId;
    }
}