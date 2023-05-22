import Items from "./items.js";
export default class Inventory {
    constructor(items = {}) {
        this.items = items;
    }

    addItem(item, quantity) {
        if (!this.hasItem(item)) {
            this.items[item] = {
                category: Items[item].category || "None",
                num: Items[item].num || 0,
                id: item,
                name: Items[item].name || item,
                desc: Items[item].desc || "No description provided.",
                isHoldable: Items[item].isHoldable || false,
                isUsable: Items[item].isUsable || false,
                quantity: 0,
            };
        }
        this.items[item].quantity += quantity;
    }

    removeItem(item, quantity) {
        if (!this.hasItem(item, quantity)) {
            throw Error("ItemError: No item to remove or not enough to remove");
        }
        this.items[item].quantity -= quantity;
        if (this.items[item].quantity == 0) {
            delete this.items[item];
        }
    }

    hasItem(item, quantity = 1) {
        return this.items.hasOwnProperty(item) && this.items[item].quantity >= quantity;
    }

    useItem(item, quantity = 1) {
        if (!this.hasItem(item, quantity)) {
            throw Error("ItemError: Not enough items to use");
        } else if (!Items[item] || !Items[item].isUsable) {
            throw Error("ItemError: Tried to use an unusable item");
        }
        this.items[item].quantity -= quantity;
        Items
    }
}