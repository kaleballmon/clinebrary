import { Book } from "./book";

type ItemCounts = {
  total: number;
  incomplete: number;
};

export class Library {
  private nextId: number = 1;
  protected itemMap: Map<number, Book> = new Map<number, Book>();

  constructor(public userName: string, public books: Book[] = []) {
    books.forEach((item) => this.itemMap.set(item.id, item));
  }

  addBook(title: string): number {
    while (this.getBookById(this.nextId)) {
      this.nextId++;
    }
    this.itemMap.set(this.nextId, new Book(this.nextId, title));
    return this.nextId;
  }

  editTitle(id: number, title: string): void {
    const book = this.getBookById(id);
    if (book) {
      book.title = title;
    }
  }

  deleteBook(id: number): void {
    this.itemMap.delete(id);
  }

  getBookById(id: number): Book {
    return this.itemMap.get(id);
  }

  getBooks(includeComplete: boolean): Book[] {
    return [...this.itemMap.values()].filter(
      (item) => includeComplete || !item.complete
    );
  }

  markComplete(id: number, complete: boolean): void {
    const book = this.getBookById(id);
    if (book) {
      book.complete = complete;
    }
  }

  getItemCounts(): ItemCounts {
    return {
      total: this.itemMap.size,
      incomplete: this.getBooks(false).length,
    };
  }

  removeComplete(): void {
    this.itemMap.forEach((item) => {
      if (item.complete) {
        this.itemMap.delete(item.id);
      }
    });
  }
}
