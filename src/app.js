import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import fs from "node:fs/promises";

// Creating interface for user input 
const rl = readline.createInterface({
    input,
    output
});


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
 let running = true;

function showMenu() {
    console.log(`
========================================
           📚 READIT LIBRARY
========================================

1. View all books
2. Add a book
3. Find a book
4. Update a book
5. Delete a book

6. Add member
7. View members

8. Borrow a book
9. Return a book

10. View overdue books

0. Exit

========================================
`);
}
while(running){
    showMenu();
   await startApp();
}


async function startApp() {
    const choice = await rl.question("Choose an option: ");

    switch (choice) {
        case "1":
            console.log("You chose View all books.");
            const books = await loadBooks();
            console.table(books);
            break;

        case "2":
            console.log("You chose Add a book.");
            const ti = await rl.question("Enter the title of the book: ");
            const au = await rl.question("Enter the author of the book: ");
            const yy = await rl.question("Enter the year of the publishing the book: ");
            await addBook(ti, au, yy);
            break;

         case "3":
            console.log("You chose View a book.");
            const bookid = Number(await rl.question("Enter the id of the book: "));
            
            await getBookById(bookid);
            break;   
        
         case "4":
            console.log("You chose update a book.");
            const bokid = Number(await rl.question("Enter the id of the book: "));
            const chnges = Number(await rl.question("Enter the changes to the book: "));
            await updateBook(bokid, chnges);
            break;      
        
         case "5":
            console.log("You chose Delete a book.");
            const bkid = Number(await rl.question("Enter the id of the book: "));
            
            await deleteBook(bkid);
            break; 
         
         case "6":
            console.log("You chose Add a member.");
            const name = await rl.question("Enter the name ofthe member: ");
            const mail = await rl.question("Enter the email of the member: ");
            
            await addMember(name, mail);
            break; 
         
         case "7":
            console.log("You chose View all members.");
            const members = await loadMembers();
            console.table(members);
            break;    

        case "8":
            console.log("You chose Borrow a book.");
            const bid = Number(await rl.question("Enter the ID of the book: "));
            const mid = Number(await rl.question("Enter your ReadIT member id of the book: "));
            await borrowBook(bid, mid);
            break;

        case "9":
            console.log("You chose Return a book.");
            const bbid = Number(await rl.question("Enter the ID of the book: "));
            const mmid = Number(await rl.question("Enter your ReadIT member id of the book: "));
            await returnBook(bbid, mmid);
            break;

        case "10":
            console.log("You chose Overdue books.");
            await getOverdueBooks();
            break;

        case "0":
            console.log("Goodbye!");
            rl.close();
            running = false;
            return;

        default:
            console.log("Invalid option.");
            break;
    }
}
rl.close();
