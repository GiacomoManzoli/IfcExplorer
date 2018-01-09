class Dummy {
    constructor(x) {
        this.x = x;
    }

    log() {
        console.log(x);
    }
}

let x = new Dummy(2);
console.log("Dentro il modulo", x);

export default Dummy