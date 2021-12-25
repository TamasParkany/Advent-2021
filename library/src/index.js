const formTitle = document.getElementById("title");
const formAuthor = document.getElementById("author");
const formCPage = document.getElementById("cpage");
const formTPages = document.getElementById("tpages");
const formStatus = document.getElementById("bstatus");
const formSubmit = document.getElementById("fsubmit");

formSubmit.addEventListener("click", handleForm);

let library = [];

function Book(title, author, cpage, tpages, status) {
  this.title = title;
  this.author = author;
  this.cpage = cpage;
  this.tpages = tpages;
  this.status = status;
}

function addBookToLibrary(title, author, cpage, tpages, status) {
  const book = new Book(title, author, cpage, tpages, status);
  library.unshift(book);
}

if (localStorage.getItem("books") === null) {
  library = [];
} else {
  const booksFromStorage = JSON.parse(localStorage.getItem("books"));
  library = booksFromStorage;
}

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

function showBooks() {
  const bookList = document.getElementById("books");
  bookList.innerHTML = "";
  library.forEach((book) => {
    //BOOK
    const bookRow = document.createElement("tr");
    bookRow.setAttribute("id", library.indexOf(book));
    bookList.appendChild(bookRow);
    //TITLE
    const bookTitle = document.createElement("td");
    bookTitle.innerText = book.title;
    bookRow.appendChild(bookTitle);
    //AUTHOR
    const bookAuthor = document.createElement("td");
    bookAuthor.innerText = book.author;
    bookRow.appendChild(bookAuthor);
    //STATUS
    const bookStatus = document.createElement("td");
    bookStatus.innerText = book.status;
    bookRow.appendChild(bookStatus);
    //PROGRESS
    const bookProgress = document.createElement("td");
    bookProgress.innerText = `${book.cpage} / ${book.tpages}`;
    bookRow.appendChild(bookProgress);
    //BUTTONS
    const bookButtons = document.createElement("td");
    const editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.addEventListener("click", handleEdit);
    bookButtons.appendChild(editButton);
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", handleDelete);
    bookButtons.appendChild(deleteButton);
    bookRow.appendChild(bookButtons);
  });
  //SAVE TO LOCAL STORAGE
  localStorage.setItem("books", JSON.stringify(library));
}

function handleEdit(e) {
  const target = e.target.parentNode.parentNode.childNodes;
  target.forEach((td) => {
    switch (td.cellIndex) {
      case 0:
      case 1:
        const editText = document.createElement("input");
        editText.setAttribute("type", "text");
        editText.value = td.innerText;
        td.innerText = "";
        td.appendChild(editText);
        break;
      case 2:
        const editSelect = document.createElement("select");
        ["Reading", "Completed", "On-hold", "Dropped"].forEach((status) => {
          const selectOption = document.createElement("option");
          selectOption.innerText = status;
          if (status === td.innerText) {
            selectOption.setAttribute("selected", "");
          }
          editSelect.appendChild(selectOption);
        });
        td.innerText = "";
        td.appendChild(editSelect);
        break;
      case 3:
        const progress = td.innerText.split("/");
        const currentPage = document.createElement("input");
        currentPage.setAttribute("type", "number");
        currentPage.value = progress[0].trim();
        const totalPages = document.createElement("input");
        totalPages.setAttribute("type", "number");
        totalPages.value = progress[1].trim();
        td.innerText = "";
        td.appendChild(currentPage);
        td.appendChild(document.createTextNode(" / "));
        td.appendChild(totalPages);
        break;
      default:
        const saveButton = document.createElement("button");
        saveButton.innerText = "Save";
        saveButton.addEventListener("click", handleSave);
        const cancelButton = document.createElement("button");
        cancelButton.innerText = "Cancel";
        cancelButton.addEventListener("click", handleCancel);
        td.innerText = "";
        td.appendChild(saveButton);
        td.appendChild(cancelButton);
        break;
    }
  });
}

function handleSave(e) {
  const target = e.target.parentNode.parentNode.childNodes;
  const queryInfo = library[e.target.parentNode.parentNode.id];
  target.forEach((td) => {
    switch (td.cellIndex) {
      case 0:
        queryInfo.title = td.firstChild.value;
        td.innerText = queryInfo.title;
        break;
      case 1:
        queryInfo.author = td.firstChild.value;
        td.innerText = queryInfo.author;
        break;
      case 2:
        queryInfo.status = td.firstChild.value;
        td.innerText = queryInfo.status;
        break;
      case 3:
        queryInfo.cpage = td.firstChild.value;
        queryInfo.tpages = td.lastChild.value;
        td.innerText = `${queryInfo.cpage} / ${queryInfo.tpages}`;
        break;
      default:
        const editButton = document.createElement("button");
        editButton.innerText = "Edit";
        editButton.addEventListener("click", handleEdit);
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.addEventListener("click", handleDelete);
        td.innerText = "";
        td.appendChild(editButton);
        td.appendChild(deleteButton);
        break;
    }
  });
  //SAVE TO LOCAL STORAGE
  localStorage.setItem("books", JSON.stringify(library));
}

function handleCancel(e) {
  const target = e.target.parentNode.parentNode.childNodes;
  const queryInfo = library[e.target.parentNode.parentNode.id];
  target.forEach((td) => {
    switch (td.cellIndex) {
      case 0:
        td.innerText = queryInfo.title;
        break;
      case 1:
        td.innerText = queryInfo.author;
        break;
      case 2:
        td.innerText = queryInfo.status;
        break;
      case 3:
        td.innerText = `${queryInfo.cpage} / ${queryInfo.tpages}`;
        break;
      default:
        const editButton = document.createElement("button");
        editButton.innerText = "Edit";
        editButton.addEventListener("click", handleEdit);
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.addEventListener("click", handleDelete);
        td.innerText = "";
        td.appendChild(editButton);
        td.appendChild(deleteButton);
        break;
    }
  });
}

function handleDelete(e) {
  const targetID = e.target.parentNode.parentNode.id;
  library.splice(targetID, 1);
  e.target.parentNode.parentNode.remove();
  const bookRow = document.getElementById("books").childNodes;
  for (let i = targetID; i < library.length; i++) {
    bookRow[i].id = bookRow[i].rowIndex - 1;
  }
  //SAVE TO LOCAL STORAGE
  localStorage.setItem("books", JSON.stringify(library));
}

//DELETE LATER
const logLibrary = document.createElement("button");
logLibrary.innerText = "Log Library";
logLibrary.addEventListener("click", (e) => {
  e.preventDefault();
  console.log(library);
});
document.getElementById("bookForm").appendChild(logLibrary);
//DELETE LATER

showBooks();

// const created = 1640342000000;
// const date = new Date();
// const current = Math.floor((date.valueOf() - created) / 1000);
// console.log(`Seconds: ${current}`);
// console.log(`Minutes: ${Math.floor(current / 60)}`);
// console.log(`Hours: ${Math.floor(current / 60 / 60)}`);

// const twelveRules = new Book(
//   "12 Rules",
//   "Jordan B. Peterson",
//   "259",
//   "259",
//   "Completed"
// );
