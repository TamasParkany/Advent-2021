const formTitle = document.getElementById("title");
const formAuthor = document.getElementById("author");
const formCPage = document.getElementById("cpage");
const formTPages = document.getElementById("tpages");
const formStatus = document.getElementById("bstatus");
const formSubmit = document.getElementById("fsubmit");

formSubmit.addEventListener("click", handleForm);

const library = [];

function Book(title, author, cpage, tpages, status) {
  this.title = title;
  this.author = author;
  this.cpage = cpage;
  this.tpages = tpages;
  this.status = status;
}

/* TESTING */

const twelveRules = new Book(
  "12 Rules",
  "Jordan B. Peterson",
  "259",
  "259",
  "Completed"
);

library.push(twelveRules);

function addBookToLibrary(title, author, cpage, tpages, status) {
  const book = new Book(title, author, cpage, tpages, status);
  library.unshift(book);
}
/* TESTING */

function showBooks() {
  const bookList = document.getElementById("books");
  bookList.textContent = "";
  library.forEach((book) => {
    const bookRow = document.createElement("tr");
    bookList.appendChild(bookRow);
    const bookTitle = document.createElement("td");
    bookTitle.innerText = book.title;
    bookRow.appendChild(bookTitle);
    const bookAuthor = document.createElement("td");
    bookAuthor.innerText = book.author;
    bookRow.appendChild(bookAuthor);
    const bookStatus = document.createElement("td");
    bookStatus.innerText = book.status;
    bookRow.appendChild(bookStatus);
    const bookProgress = document.createElement("td");
    bookProgress.innerText = `${book.cpage} / ${book.tpages}`;
    bookRow.appendChild(bookProgress);
  });
  console.log(library);
}

showBooks();

function handleForm(e) {
  e.preventDefault();

  addBookToLibrary(
    formTitle.value,
    formAuthor.value,
    formCPage.value,
    formTPages.value,
    formStatus.value
  );

  document.getElementById("bookForm").reset();
  showBooks();
}

// const created = 1640342000000;
// const date = new Date();
// const current = Math.floor((date.valueOf() - created) / 1000);
// console.log(`Seconds: ${current}`);
// console.log(`Minutes: ${Math.floor(current / 60)}`);
// console.log(`Hours: ${Math.floor(current / 60 / 60)}`);
