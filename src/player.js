/*
Alex G, flynger, Richard W, Harry

This file implements server-sided player functionality 
*/
import Items from "./items.js";
import Inventory from "./inventory.js";
import Pokedex from "./pokedex.js";
import Pokemon, { Stats } from "./pokemon.js";
import Map from "./map.js";
import Pc from "./pc.js"

export default class Player {
    static onlinePlayers = [];
    static starterOptions = ["BULBASAUR", "CHARMANDER", "SQUIRTLE"];
    static starterNatures = ["bashful", "docile", "hardy", "quirky", "serious"];

    constructor(name, displayName, x = 160, y = 240, facing = "down") { // 224, 288 town - 240, 350 lab
        this.name = name;
        this.displayName = displayName;
        this.x = x;
        this.y = y;
        this.facing = facing;
        this.connected = false;
        this.socket = null;
        this.requests = {
            battle: {},
            trade: {}
        };
        this.battle = null;
        this.trade = null;
        this.party = [];
        // this.box = new Array(5).fill("").map(e => []); // create 5 arrays inside one array
        this.starter = false;
        this.pickStarter();
        this.balance = 500;
        this.inventory = new Inventory(this);
        this.pc = new Pc(this);
        this.inventory.addItem("pokeball", 5);
        // this.inventory.addItem("greatball", 10);
        // this.inventory.addItem("ultraball", 5);
        this.inventory.addItem("potion", 3);
        this.inventory.addItem("masterball", 99);
        // this.inventory.addItem("superpotion", 3);
        // this.inventory.addItem("hyperpotion", 3);
        // this.inventory.addItem("maxpotion", 3);
        // this.inventory.addItem("firestone", 1);
        // this.inventory.addItem("aguavberry", 17);
        this.location = {
            /* Route 1 : Area 1, Area 2
               Ballet Town : Town, Lab, Player House 1F, Player House 2F, Outskirts */
            map: "Ballet Town",
            submap: "Player House 2F"

            //For testing battle quicker
            // map: "Route 1",
            // submap: "Area 1"
        };
    }

    pickStarter(starter) {
        if (this.starter == false) {
            this.starter = Player.starterOptions.includes(starter) ? starter : ["MRMIME", "PIKACHU", "CHARIZARD", "BLASTOISE", "VENUSAUR"].random(); //Player.starterOptions.random();
            this.addPokemon(new Pokemon(this.starter, 50, { name: ["Eggo", "Googly", "Barry", "StutlerK", "HappyMonster", "Demon"].random(), nature: Player.starterNatures.random(), ivs: new Stats(15, 15, 15, 15, 15, 15), owner: this.displayName, hiddenAbilityChance: 0 }));
            for (let i = 0; i < 5; i++) {
                let rng = randomNumber(1, 649);
                for (let mon in Pokedex) {
                    if (rng == Pokedex[mon].id) {
                       //  console.log(mon)
                        this.addPokemon(new Pokemon(mon, 50, { originalTrainer: this.displayName, owner: this.displayName }));
                        break;
                    }
                }
            }
            // this.party.push(new Pokemon("MIMEJR", 1, { "ASH", gender: "F", originalTrainer: "Professor Oak", owner: this.displayName, caughtBall: "ultraball" }));
            // this.party.push(new Pokemon("DARKRAI", 10, { heldItem: "pokeball", originalTrainer: "Unknown", owner: this.displayName, caughtBall: "masterball" }));
            // this.party.push(new Pokemon("MAGNEMITE", 99, { originalTrainer: "Unknown", owner: this.displayName }));
            // this.party.push(new Pokemon("MAGNEMITE", 100, { originalTrainer: "Unknown", owner: this.displayName }));
        }
    }

    addPokemon(mon) {
        mon.owner = this.displayName;
        if (this.party.length < 6) {
            this.party.push(mon);
            this.sendPartyUpdate();
        } else this.pc.addToPc(mon);
    }

    swapPartySlots(slot1, slot2) {
        if (typeof slot1 == "number" && typeof slot2 == "number" && slot1 != slot2 && this.party[--slot1] && this.party[--slot2]) {
            [this.party[slot1], this.party[slot2]] = [this.party[slot2], this.party[slot1]];
            this.sendPartyUpdate();
        }
    }

    giveItemToSlot(id, slot) {
        if (typeof slot == "number" && this.party[--slot] && this.inventory.hasItem(id, 1) && Items[id].isHoldable) {
            if (this.party[slot].heldItem) {
                this.inventory.addItem(this.party[slot].heldItem, 1);
            }
            this.party[slot].heldItem = id;
            this.inventory.removeItem(id, 1);
            this.sendPartyUpdate();
        }
    }

    removeItemFromSlot(slot) {
        if (typeof slot == "number" && this.party[--slot] && this.party[slot].heldItem) {
            this.inventory.addItem(this.party[slot].heldItem, 1);
            this.party[slot].heldItem = "";
            this.sendPartyUpdate();
        }
    }

    sendPartyUpdate() {
        if (this.connected) {
            this.socket.emit("partyUpdate", this.party);
        }
    }

    getMap() {
        return Map.getMap(this.location.map, this.location.submap);
    }

    isBusy() {
        return this.battle != null || this.trade != null;
    }

    setLocation(x, y, facing) {
        this.x = x;
        this.y = y;
        this.facing = facing;
    }

    setSocket(socket) {
        this.socket = socket;
        this.connected = true;
        Player.onlinePlayers.push(this.displayName);
    }

    deleteSocket() {
        this.socket = null;
        this.connected = false;
        Player.onlinePlayers.remove(this.displayName);
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

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}