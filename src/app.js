import fs from "node:fs/promises";

async function loadBooks() {
    const data = await fs.readFile("./data/books.json", "utf-8");
    return JSON.parse(data);
}
async function addBook(title, author, year) {
    const books = await loadBooks();
    const newBook = {
        id: Math.max(0, ...books.map(b => b.id)) + 1,
        title: title,
        author: author,
        year: year,
        available: true
    };
    books.push(newBook);
    await saveBooks(books);
    console.log("Book added successfully:", newBook);
    return newBook;
}

async function saveBooks(books) {
    const jsonData = JSON.stringify(books, null, 2);
    await fs.writeFile("./data/books.json", jsonData, "utf-8");
}

//const newBook = await addBook("Assasins Creed", "Ubisoft", 2000);
//console.log("New book added:", newBook);
//async function getBooks(){
//  return await loadBooks();
//}
async function getBookById(id) {
  const books = await loadBooks();
  return books.find(book => book.id === id);
}
const book = await getBookById(4);
console.log(book);