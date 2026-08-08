import fs from "node:fs/promises";

async function loadBooks() {
    const data = await fs.readFile("./data/books.json", "utf-8");
    return JSON.parse(data);
}
const books = await loadBooks();
console.log(books);
console.log("Books loaded successfully.");
console.log("Total books:", books.length);
