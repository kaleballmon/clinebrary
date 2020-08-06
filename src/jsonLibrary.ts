import { Book } from "./book";
import { Library } from "./library";
import * as lowdb from "lowdb";
import * as FileSync from "lowdb/adapters/FileSync";

type schemaType = {
  books: { id: number; title: string; complete: boolean }[];
};

export class JsonLibrary extends Library {
  private database: lowdb.LowdbSync<schemaType>;

  constructor(public userName: string, books: Book[] = []) {
    super(userName, []);
    this.database = lowdb(new FileSync("Books.json"));
    if (this.database.has("books").value()) {
      let dbItems = this.database.get("books").value();
      dbItems.forEach((item) =>
        this.itemMap.set(item.id, new Book(item.id, item.title, item.complete))
      );
    } else {
      this.database.set("books", books).write();
      books.forEach((item) => this.itemMap.set(item.id, item));
    }
  }

  addBook(title: string): number {
    let result = super.addBook(title);
    this.storeTasks();
    return result;
  }

  editTitle(id: number, title: string): void {
    super.editTitle(id, title);
    this.storeTasks();
  }

  deleteBook(id: number): void {
    super.deleteBook(id);
    this.storeTasks();
  }

  markComplete(id: number, complete: boolean): void {
    super.markComplete(id, complete);
    this.storeTasks();
  }

  removeComplete(): void {
    super.removeComplete();
    this.storeTasks();
  }

  private storeTasks(): void {
    this.database.set("books", [...this.itemMap.values()]).write();
  }
}
