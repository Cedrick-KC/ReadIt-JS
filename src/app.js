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



async function getBookById(id) {
  const books = await loadBooks();
  return books.find(book => book.id === id);
}
async function deleteBook(id) {
    const allBooks = await loadBooks();

    const bookExists = allBooks.some(book => book.id === id);

    if (!bookExists) {
        console.log(`No book found with id: ${id}`);
        return;
    }

    const updatedBooks = allBooks.filter(book => book.id !== id);

    await saveBooks(updatedBooks);

    console.log(`Book removed with id: ${id}`);
}
async function updateBook(id, changes) {
    const allBooks = await loadBooks();

    const existingBook = allBooks.find(book => book.id === id);

    if (!existingBook) {
        console.log("There is no such book with id:", id);
        return;
    }

    const updatedBooks = allBooks.map(book => {
        if (book.id === id) {
            return {
                ...book,
                ...changes
            };
        }

        return book;
    });

    await saveBooks(updatedBooks);

    console.log("Book updated successfully:", id);
}

async function borrowBook(id){
    const allBooks = await loadBooks();
    const book = allBooks.find(book => book.id === id);
    if(!book){
        console.log("We don't have that book");
        return;
    };
    if(book.available === false){
        console.log("Sorry! That book was already borrowed.");
        return;
    };
    if (book.available === true){
        console.log("You can have the book for seven days!");
        book.available = false;
        await saveBooks(allBooks);
        return;
    };
}
async function loadMembers() {
    const allMembers = await fs.readFile("./data/members.json", "utf-8");
    return JSON.parse(allMembers);
}

async function saveMembers(members) {
   const jsonData = JSON.stringify(members, null, 2);
    await fs.writeFile("./data/members.json", jsonData, "utf-8"); 
}

async function addMember(name, email) {
   const members = await loadMembers();
   const newMember = {
    id: Math.max(0, ...members.map(b => b.id)) + 1,
    name: name,
    email: email
   };
   members.push(newMember);
   await saveMembers(members);
   console.log("Member added successfully");
}
await addMember('Karangwa', 'karangwa000@gmail.com');