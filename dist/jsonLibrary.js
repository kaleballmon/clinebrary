"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const book_1 = require("./book");
const library_1 = require("./library");
const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
class JsonLibrary extends library_1.Library {
    constructor(userName, books = []) {
        super(userName, []);
        this.userName = userName;
        this.database = lowdb(new FileSync("Books.json"));
        if (this.database.has("books").value()) {
            let dbItems = this.database.get("books").value();
            dbItems.forEach(item => this.itemMap.set(item.id, new book_1.Book(item.id, item.title, item.complete)));
        }
        else {
            this.database.set("books", books).write();
            books.forEach(item => this.itemMap.set(item.id, item));
        }
    }
    addBook(title) {
        let result = super.addBook(title);
        this.storeTasks();
        return result;
    }
    editTitle(id, title) {
        super.editTitle(id, title);
        this.storeTasks();
    }
    deleteBook(id) {
        super.deleteBook(id);
        this.storeTasks();
    }
    markComplete(id, complete) {
        super.markComplete(id, complete);
        this.storeTasks();
    }
    removeComplete() {
        super.removeComplete();
        this.storeTasks();
    }
    storeTasks() {
        this.database.set("books", [...this.itemMap.values()]).write();
    }
}
exports.JsonLibrary = JsonLibrary;
