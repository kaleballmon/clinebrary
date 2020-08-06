import { Book } from "./book";
import { Library } from "./library";
import { JsonLibrary } from "./jsonLibrary";
import * as inquirer from "inquirer";

let books: Book[] = [
  new Book(1, "Catcher in the Rye"),
  new Book(2, "Water Dancer"),
  new Book(3, "TypeScript"),
  new Book(4, "Between the World and Me", true),
];

enum Commands {
  Add = "Add New Book",
  Edit = "Edit Title",
  Delete = "Delete Books",
  Complete = "Complete Books",
  Toggle = "Show/Hide Completed",
  Purge = "Remove Completed Books",
  Quit = "Quit",
}

let showCompleted: boolean = true;

let collection: Library = new JsonLibrary("Kaleb", books);

function displayTodoList(): void {
  console.log(`${collection.userName}'s todo list`);
  collection.getBooks(showCompleted).forEach((item) => item.printDetails());
}

function promptAdd(): void {
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

function promptEdit(): void {
  console.clear();
  inquirer
    .prompt({
      type: "rawlist",
      name: "edit",
      message: "edit title name",
      choices: collection.getBooks(true).map((item) => ({
        name: item.title,
        value: item.id,
      })),
    })
    .then((answers) => {
      console.clear();
      inquirer
        .prompt({
          type: "input",
          name: "input-edit",
          message: "enter new name",
        })
        .then((secondAnswers) => {
          if (secondAnswers["input-edit"] !== "") {
            collection.editTitle(answers["edit"], secondAnswers["input-edit"]);
          }
          promptUser();
        });
    });
}

function promptComplete(): void {
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
      let completedTasks = answers["complete"] as number[];
      collection
        .getBooks(true)
        .forEach((item) =>
          collection.markComplete(
            item.id,
            completedTasks.find((id) => id === item.id) != undefined
          )
        );
      promptUser();
    });
}

function promptDelete(): void {
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
      let deletedBooks = answers["delete"] as number[];
      deletedBooks.forEach((id) => {
        collection.deleteBook(id);
      });
      promptUser();
    });
}

function promptUser(): void {
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
          } else {
            promptUser();
          }
          break;
        case Commands.Delete:
          if (collection.getItemCounts().total > 0) {
            promptDelete();
          } else {
            promptUser();
          }
          break;
        case Commands.Complete:
          if (collection.getItemCounts().incomplete > 0) {
            promptComplete();
          } else {
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
