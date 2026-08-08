import fs from "node:fs/promises";

async function loadBooks() {
    const data = await fs.readFile("./data/books.json", "utf-8");
    return JSON.parse(data);
}

async function saveBooks(books) {
    const data = JSON.stringify(books, null, 2);
    await fs.writeFile("./data/books.json", data, "utf-8");
    console.log("Books saved successfully.");
}
const books = await loadBooks();
const newBooks = [
    {
        id: 3,
        title: "The Wreckoning of the Titan",
        author: "F. Michael",
    },
    {
        id: 4,
        title: "Atomic Habits",
        author: "James Clear",
        available: true,
    }

];
books.push(...newBooks);
await saveBooks(books);
console.log(books);
