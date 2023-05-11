import Pokemon from "./pokemon.js";

export default class Map {
    constructor(encounters, encounterRate =  1 / 8) {
        this.encounters = encounters;
        this.encounterRate = encounterRate;
    }

    grassCheck() {
        var num = randomNumber(1, this.encounters.grass.frequency);
        return num == 1;
    }

    getTotalWeight(encounters) {
        let weight = 0;
        for (let encounter of encounters) {
            weight += encounter.weight;
        }
        return weight;
    }

    createEncounter() {
        let encounterPool = this.encounters.grass.day;
        let encounterWeight = this.getTotalWeight(encounterPool);
        let rng = Math.floor(Math.random() * encounterWeight) + 1;
        let counter = 0;
        for (let encounter of encounterPool) {
            counter += encounter.weight;
            if (counter >= rng) {
                let randomEncounter = new Pokemon(encounter.species, "", "?", "?", randomNumber(encounter.minLevel, encounter.maxLevel), "");
                console.log(randomEncounter);
                return randomEncounter;
            }
        }
    }
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}