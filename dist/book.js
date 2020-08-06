"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Book {
    constructor(id, title, complete = false) {
        this.id = id;
        this.title = title;
        this.complete = complete;
    }
    printDetails() {
        console.log(`${this.id}\t${this.title} ${this.complete ? "\t(complete)" : ""}`);
    }
}
exports.Book = Book;
