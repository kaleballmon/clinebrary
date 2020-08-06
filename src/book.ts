export class Book {
  constructor(
    public id: number,
    public title: string,
    public complete: boolean = false
  ) {}

  printDetails(): void {
    console.log(
      `${this.id}\t${this.title} ${this.complete ? "\t(complete)" : ""}`
    );
  }
}
