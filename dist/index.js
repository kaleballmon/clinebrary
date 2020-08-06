"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const book_1 = require("./book");
const jsonLibrary_1 = require("./jsonLibrary");
const inquirer = require("inquirer");
let books = [
    new book_1.Book(1, "Catcher in the Rye"),
    new book_1.Book(2, "Water Dancer"),
    new book_1.Book(3, "TypeScript"),
    new book_1.Book(4, "Between the World and Me", true),
];
var Commands;
(function (Commands) {
    Commands["Add"] = "Add New Book";
    Commands["Edit"] = "Edit Title";
    Commands["Delete"] = "Delete Books";
    Commands["Complete"] = "Complete Books";
    Commands["Toggle"] = "Show/Hide Completed";
    Commands["Purge"] = "Remove Completed Books";
    Commands["Quit"] = "Quit";
})(Commands || (Commands = {}));
let showCompleted = true;
let collection = new jsonLibrary_1.JsonLibrary("Kaleb", books);
function displayTodoList() {
    console.log(`${collection.userName}'s todo list`);
    collection.getBooks(showCompleted).forEach((item) => item.printDetails());
}
function promptAdd() {
    console.clear();
    inquirer
        .prompt({
        type: "input",
        name: "add",
        message: "enter book:",
    })
        .then((answers) => {
        if (answers["add"] !== "") {
            collection.addBook(answers["add"]);
        }
        promptUser();
    });
}
function promptEdit() {
    console.clear();
    inquirer
        .prompt({
        type: "rawlist",
        name: "edit",
        message: "edit title name",
        choices: collection.getBooks(true).map((item) => ({
            name: item.title,
            value: item.id
        }))
    })
        .then((answers) => {
        console.clear();
        inquirer.prompt({
            type: "input",
            name: "input-edit",
            message: "enter new name"
        })
            .then((secondAnswers) => {
            if (secondAnswers["input-edit"] !== "") {
                collection.editTitle(answers["edit"], secondAnswers["input-edit"]);
            }
            promptUser();
        });
    });
}
function promptComplete() {
    console.clear();
    inquirer
        .prompt({
        type: "checkbox",
        name: "complete",
        message: "mark books complete",
        choices: collection.getBooks(showCompleted).map((item) => ({
            name: item.title,
            value: item.id,
            checked: item.complete,
        })),
    })
        .then((answers) => {
        let completedTasks = answers["complete"];
        collection
            .getBooks(true)
            .forEach((item) => collection.markComplete(item.id, completedTasks.find((id) => id === item.id) != undefined));
        promptUser();
    });
}
function promptDelete() {
    console.clear();
    inquirer
        .prompt({
        type: "checkbox",
        name: "delete",
        message: "delete books",
        choices: collection.getBooks(showCompleted).map((item) => ({
            name: item.title,
            value: item.id,
        })),
    })
        .then((answers) => {
        let deletedBooks = answers["delete"];
        deletedBooks
            .forEach((id) => {
            collection.deleteBook(id);
        });
        promptUser();
    });
}
function promptUser() {
    console.clear();
    displayTodoList();
    inquirer
        .prompt({
        type: "list",
        name: "command",
        message: "Choose Option",
        choices: Object.values(Commands),
    })
        .then((answers) => {
        switch (answers["command"]) {
            case Commands.Toggle:
                showCompleted = !showCompleted;
                promptUser();
                break;
            case Commands.Add:
                promptAdd();
                break;
            case Commands.Edit:
                if (collection.getItemCounts().total > 0) {
                    promptEdit();
                }
                else {
                    promptUser();
                }
                break;
            case Commands.Delete:
                if (collection.getItemCounts().total > 0) {
                    promptDelete();
                }
                else {
                    promptUser();
                }
                break;
            case Commands.Complete:
                if (collection.getItemCounts().incomplete > 0) {
                    promptComplete();
                }
                else {
                    promptUser();
                }
                break;
            case Commands.Purge:
                collection.removeComplete();
                promptUser();
                break;
        }
    });
}
promptUser();
