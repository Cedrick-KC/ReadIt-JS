import fs from "node:fs/promises";

async function loadBooks() {
    const data = await fs.readFile("../data/books.json", "utf-8");
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
    await fs.writeFile("../data/books.json", jsonData, "utf-8");
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

async function borrowBook(id, memberId) {
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
    const members = await loadMembers();

const member = members.find(member => member.id === memberId);

if (!member) {
    console.log("Member not found.");
    return;
}
        const borrowedAt = new Date();
        const dueDate = new Date(borrowedAt);
        dueDate.setDate(dueDate.getDate() + 7);
        const transactions = await loadTransactions();
        const transaction = {
    id: Math.max(0, ...transactions.map(t => t.id)) + 1,
    bookId: id,
    memberId,
    borrowedAt: borrowedAt.toISOString(),
    dueDate: dueDate.toISOString(),
    returnedAt: null
};
book.available = false;
        await saveBooks(allBooks);
transactions.push(transaction);
await saveTransactions(transactions);
        console.log(`Book "${book.title}" borrowed successfully.`);
    console.log(`Due date: ${dueDate.toISOString()}`);
        return transaction;
    
}
async function loadMembers() {
    const allMembers = await fs.readFile("../data/members.json", "utf-8");
    return JSON.parse(allMembers);
}

async function saveMembers(members) {
   const jsonData = JSON.stringify(members, null, 2);
    await fs.writeFile("../data/members.json", jsonData, "utf-8"); 
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
async function loadTransactions() {
    const allTransactions = await fs.readFile("../data/transactions.json", "utf-8");
    return JSON.parse(allTransactions);
}
async function saveTransactions(transactions) {
    const jsonData = JSON.stringify(transactions, null, 2);
    await fs.writeFile("../data/transactions.json", jsonData, "utf-8");
}

async function returnBook(id, memberId) {
    const allBooks = await loadBooks();
    const book = allBooks.find(book => book.id === id);
    if (!book) {
        console.log("We don't have that book");
        return;
    };
    if (book.available === true) {
        console.log("This book is not borrowed.");
        return;
    };
     if (!transaction) {
        console.log("No transaction found for this book and member.");
        return;
    };
    const transactions = await loadTransactions();
    const transaction = transactions.find(t => t.bookId === id && t.memberId === memberId && !t.returnedAt);
    book.available = true;
    await saveBooks(allBooks);
   
    const returnedAt = new Date();
    transaction.returnedAt = returnedAt.toISOString();
    await saveTransactions(transactions);
    console.log(`Book "${book.title}" returned successfully.`);
}
async function getOverdueBooks() {
    const transactions = await loadTransactions();

    const overdueTransactions = transactions.filter(transaction => {
        return (
            !transaction.returnedAt &&
            new Date() > new Date(transaction.dueDate)
        );
    });

    return overdueTransactions;
}
function getDaysOverdue(dueDate) {
    const now = new Date();
    const due = new Date(dueDate);

    const difference = now - due;

    const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );

    return days;
}
async function getOverdueReport() {
    const transactions = await loadTransactions();
    const books = await loadBooks();
    const members = await loadMembers();

    const overdueTransactions = transactions.filter(transaction => {
        return (
            !transaction.returnedAt &&
            new Date() > new Date(transaction.dueDate)
        );
    });

    const report = overdueTransactions.map(transaction => {
    const book = books.find(book => book.id === transaction.bookId);
    const member = members.find(member => member.id === transaction.memberId);

    return {
        book: book.title,
        member: member.name,
        dueDate: new Date(transaction.dueDate).toLocaleDateString(),
        daysOverdue: getDaysOverdue(transaction.dueDate)
    };
});
console.log("\n===== OVERDUE BOOKS =====\n");

report.forEach(item => {
    console.log(`Book: ${item.book}`);
    console.log(`Borrowed by: ${item.member}`);
    console.log(`Due date: ${item.dueDate}`);
    console.log(`Days overdue: ${item.daysOverdue}`);
    console.log("-------------------------");
});

console.log("=========================\n");
return report;
}
     //testing area
//await borrowBook(3, 2);
//await returnBook(4, 2);
//const overdueBooks = await getOverdueBooks();
//console.log("Overdue Books:", overdueBooks);
//await getOverdueReport();
console.log("==============READ IT JS==============");
console.log("Welcome to the Read It JS Library Management System!");
console.log("======================================");
console.log("Available commands:");
console.log("1. addBook(title, author, year)");
console.log("2. deleteBook(id)");
console.log("3. borrowBook(bookId, memberId)");
console.log("4. returnBook(bookId, memberId)");
console.log("5. getOverdueReport()");
