export default class Player {
    constructor(name, displayName, x = 256, y = 254, facing = "right") {
        this.name = name;
        this.displayName = displayName;
        this.x = x;
        this.y = y;
        this.facing = facing;
        this.connected = false;
        this.socket = null;
        this.requests = {};
        this.battle = null;
    }

    setSocket(socket) {
        this.socket = socket;
        this.connected = true;
    }

    deleteSocket() {
        this.socket = null;
        this.connected = false;
    }

    export() {
        return {
            name: this.name,
            displayName: this.displayName,
            x: this.x,
            y: this.y,
            facing: this.facing
        }
    }
}