"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const book_1 = require("./book");
class Library {
    constructor(userName, books = []) {
        this.userName = userName;
        this.books = books;
        this.nextId = 1;
        this.itemMap = new Map();
        books.forEach((item) => this.itemMap.set(item.id, item));
    }
    addBook(title) {
        while (this.getBookById(this.nextId)) {
            this.nextId++;
        }
        this.itemMap.set(this.nextId, new book_1.Book(this.nextId, title));
        return this.nextId;
    }
    editTitle(id, title) {
        const book = this.getBookById(id);
        if (book) {
            book.title = title;
        }
    }
    deleteBook(id) {
        this.itemMap.delete(id);
    }
    getBookById(id) {
        return this.itemMap.get(id);
    }
    getBooks(includeComplete) {
        return [...this.itemMap.values()].filter((item) => includeComplete || !item.complete);
    }
    markComplete(id, complete) {
        const book = this.getBookById(id);
        if (book) {
            book.complete = complete;
        }
    }
    getItemCounts() {
        return {
            total: this.itemMap.size,
            incomplete: this.getBooks(false).length,
        };
    }
    removeComplete() {
        this.itemMap.forEach((item) => {
            if (item.complete) {
                this.itemMap.delete(item.id);
            }
        });
    }
}
exports.Library = Library;
