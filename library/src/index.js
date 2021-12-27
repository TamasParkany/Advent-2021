const formTitle = document.getElementById("title");
const formAuthor = document.getElementById("author");
const formCPage = document.getElementById("cpage");
const formTPages = document.getElementById("tpages");
const formStatus = document.getElementById("bstatus");
const formSubmit = document.getElementById("fsubmit");

formSubmit.addEventListener("click", handleForm);

let library = [];
let history = [];

function Book(title, author, cpage, tpages, status, time) {
  this.title = title;
  this.author = author;
  this.cpage = cpage;
  this.tpages = tpages;
  this.status = status;
  this.time = time;
}

function addBookToLibrary(title, author, cpage, tpages, status, time) {
  const book = new Book(title, author, cpage, tpages, status, time);
  library.unshift(book);
}

if (localStorage.getItem("blibrary") === null) {
  library = [];
} else {
  const booksFromStorage = JSON.parse(localStorage.getItem("blibrary"));
  library = booksFromStorage;
}

function handleForm(e) {
  e.preventDefault();

  const creationTime = new Date();
  creationTime.toJSON();

  addBookToLibrary(
    formTitle.value,
    formAuthor.value,
    formCPage.value,
    formTPages.value,
    formStatus.value,
    creationTime
  );

  document.getElementById("bookForm").reset();
  showHistory();
  showBooks();
}

function showHistory() {
  const updateHistory = document.getElementById("history");
  updateHistory.innerHTML = "";
  const recent = [...library].sort((a, b) => {
    return a.time < b.time ? 1 : a.time > b.time ? -1 : 0;
  });
  history = recent.slice(0, 3);
  history.forEach((book) => {
    const bookContainer = document.createElement("div");
    updateHistory.appendChild(bookContainer);
    //TITLE
    const bookTitle = document.createElement("p");
    bookTitle.innerText = book.title;
    bookContainer.appendChild(bookTitle);
    //AUTHOR
    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = book.author;
    bookContainer.appendChild(bookAuthor);
    //PROGRESS BAR
    const bookProgress = document.createElement("div");
    bookProgress.setAttribute("class", "progress-bar");
    const progressFill = document.createElement("span");
    progressFill.style.width = `${Math.floor(
      (book.cpage / book.tpages) * 100
    )}%`;
    bookProgress.appendChild(progressFill);
    bookContainer.appendChild(bookProgress);
    //INFO
    bookContainer.appendChild(document.createTextNode(`${book.status} `));
    const currentPage = document.createElement("span");
    currentPage.innerText = `${book.cpage}`;
    bookContainer.appendChild(currentPage);
    bookContainer.appendChild(document.createTextNode(`/${book.tpages}`));

    switch (book.status) {
      case "Reading":
        progressFill.style.backgroundColor = "green";
        currentPage.style.color = "green";
        break;
      case "Completed":
        progressFill.style.backgroundColor = "blue";
        currentPage.style.color = "blue";
        break;
      case "On-hold":
        progressFill.style.backgroundColor = "yellow";
        currentPage.style.color = "yellow";
        break;
      default:
        progressFill.style.backgroundColor = "red";
        currentPage.style.color = "red";
        break;
    }
  });
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
  localStorage.setItem("blibrary", JSON.stringify(library));
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
        if (
          queryInfo.cpage !== td.firstChild.value ||
          queryInfo.tpages !== td.lastChild.value
        ) {
          const updatedTime = new Date();
          updatedTime.toJSON();
          queryInfo.time = updatedTime;
        }
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
  localStorage.setItem("blibrary", JSON.stringify(library));
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
  localStorage.setItem("blibrary", JSON.stringify(library));
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

showHistory();
showBooks();

// const created = 1640342000000;
// const date = new Date();
// const dateJSON = date.toJSON();
// console.log(dateJSON);
// const current = Math.floor((date.valueOf() - created) / 1000);
// console.log(`Seconds: ${current}`);
// console.log(`Minutes: ${Math.floor(current / 60)}`);
// console.log(`Hours: ${Math.floor(current / 60 / 60)}`);
