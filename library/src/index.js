const formOpen = document.getElementById("form-open");
const exportLibrary = document.getElementById("export-library");
const overlay = document.getElementById("overlay");
const overlayClose = document.getElementById("overlay-close");
const formTitle = document.getElementById("title");
const formAuthor = document.getElementById("author");
const formCPage = document.getElementById("cpage");
const formTPages = document.getElementById("tpages");
const formStatus = document.getElementById("bstatus");
const formSubmit = document.getElementById("fsubmit");

formOpen.addEventListener("click", overlayAdd);
exportLibrary.addEventListener("click", overlayExport);
overlay.addEventListener("click", overlayOff);
overlayClose.addEventListener("click", overlayOff);
formSubmit.addEventListener("click", handleForm);

let library = [];
let history = [];
let overlayContent = "";

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

function overlayAdd() {
  overlayContent = "add";
  document.getElementById("overlay").style.display = "block";
  document.getElementById("book-form").style.display = "block";
  formCPage.addEventListener("change", cPageCheck);
  formTPages.addEventListener("change", tPagesCheck);
  formStatus.addEventListener("change", statusCheck);
}

function cPageCheck(e) {
  const number = e.target.parentNode.parentNode.children[3].children;
  const status = e.target.parentNode.parentNode.children[4].lastElementChild;
  if (Number(e.target.value) < 0) {
    e.target.value = 0;
  }
  if (Number(number[0].value) > Number(number[1].value)) {
    number[0].value = number[1].value;
  }
  if (Number(number[0].value) === Number(number[1].value)) {
    status.value = "Completed";
  }
}

function tPagesCheck(e) {
  const number = e.target.parentNode.parentNode.children[3].children;
  const status = e.target.parentNode.parentNode.children[4].lastElementChild;
  if (Number(e.target.value) < 0) {
    e.target.value = 0;
  }
  if (Number(number[0].value) > Number(number[1].value)) {
    number[0].value = number[1].value;
    status.value = "Completed";
  }
}

function statusCheck(e) {
  const status = e.target.parentNode.parentNode.children[4].lastElementChild;
  const number = e.target.parentNode.parentNode.children[3].children;
  if (status.value === "Completed") {
    number[0].value = number[1].value;
  }
}

function overlayExport() {
  overlayContent = "export";
  document.getElementById("overlay").style.display = "block";
  document.getElementById("book-export").style.display = "block";
  const textBox = document.getElementById("text-val");
  textBox.value = localStorage.getItem("blibrary");
  document.getElementById("dwn-btn").addEventListener("click", () => {
    const text = textBox.value;
    const filename = "my-book-list-data.txt";
    download(filename, text);
  });
}

function download(filename, text) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function overlayOff(e) {
  if (e.target.id === "overlay" || e.target.id === "overlay-close") {
    document.getElementById("overlay").style.display = "none";
    switch (overlayContent) {
      case "add":
        document.getElementById("book-form").reset();
        document.getElementById("book-form").style.display = "none";
        formCPage.removeEventListener("change", cPageCheck);
        formTPages.removeEventListener("change", tPagesCheck);
        formStatus.removeEventListener("change", statusCheck);
        break;
      case "delete":
        const bookDelete = document.getElementById("book-delete");
        bookDelete.style.display = "none";
        bookDelete.replaceWith(bookDelete.cloneNode(true));
        break;
      default:
        const bookExport = document.getElementById("book-export");
        bookExport.style.display = "none";
        bookExport.replaceWith(bookExport.cloneNode(true));
        break;
    }
  }
}

function handleForm(e) {
  e.preventDefault();

  const creationTime = new Date();
  creationTime.toJSON();

  if (
    formTitle.value.trim() !== "" &&
    formAuthor.value.trim() !== "" &&
    !library.some((book) => book.title === formTitle.value.trim())
  ) {
    addBookToLibrary(
      formTitle.value,
      formAuthor.value,
      formCPage.value,
      formTPages.value,
      formStatus.value,
      creationTime
    );
  } else {
    alert("Fill out the form correctly and try again.");
  }

  document.getElementById("book-form").reset();
  document.getElementById("overlay").style.display = "none";
  document.getElementById("book-form").style.display = "none";
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
        progressFill.style.backgroundColor = "#2db039";
        currentPage.style.color = "#2db039";
        break;
      case "Completed":
        progressFill.style.backgroundColor = "#26448f";
        currentPage.style.color = "#26448f";
        break;
      case "On-hold":
        progressFill.style.backgroundColor = "#f9d457";
        currentPage.style.color = "#f9d457";
        break;
      case "Dropped":
        progressFill.style.backgroundColor = "#a12f31";
        currentPage.style.color = "#a12f31";
        break;
      default:
        progressFill.style.backgroundColor = "#c3c3c3";
        currentPage.style.color = "#c3c3c3";
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
    //INDICATOR
    const bookIndicator = document.createElement("td");
    bookIndicator.setAttribute("class", "tdesc-indicator");
    bookRow.appendChild(bookIndicator);

    switch (book.status) {
      case "Reading":
        bookIndicator.style.backgroundColor = "#2db039";
        break;
      case "Completed":
        bookIndicator.style.backgroundColor = "#26448f";
        break;
      case "On-hold":
        bookIndicator.style.backgroundColor = "#f9d457";
        break;
      case "Dropped":
        bookIndicator.style.backgroundColor = "#a12f31";
        break;
      default:
        bookIndicator.style.backgroundColor = "#c3c3c3";
        break;
    }
    //INDEX
    // const bookIndex = document.createElement("td");
    // bookIndex.innerText = Number(bookRow.id) + 1;
    // bookIndicator.setAttribute("class", "tdesc-index");
    // bookRow.appendChild(bookIndex);
    //TITLE
    const bookTitle = document.createElement("td");
    bookTitle.innerText = book.title;
    bookTitle.setAttribute("class", "tdesc-title");
    bookRow.appendChild(bookTitle);
    //AUTHOR
    const bookAuthor = document.createElement("td");
    bookAuthor.innerText = book.author;
    bookAuthor.setAttribute("class", "tdesc-author");
    bookRow.appendChild(bookAuthor);
    //STATUS
    const bookStatus = document.createElement("td");
    bookStatus.innerText = book.status;
    bookStatus.setAttribute("class", "tdesc-status");
    bookRow.appendChild(bookStatus);
    //PROGRESS
    const bookProgress = document.createElement("td");
    bookProgress.innerText = `${book.cpage} / ${book.tpages}`;
    bookProgress.setAttribute("class", "tdesc-progress");
    bookRow.appendChild(bookProgress);
    //BUTTONS
    const bookButtons = document.createElement("td");
    bookButtons.setAttribute("class", "tdesc-edit");
    const editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.addEventListener("click", handleEdit);
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", handleDelete);
    bookButtons.appendChild(editButton);
    bookButtons.appendChild(document.createTextNode(" · "));
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
        break;
      case 1:
      case 2:
        const editText = document.createElement("input");
        editText.setAttribute("type", "text");
        editText.value = td.innerText;
        td.innerText = "";
        td.appendChild(editText);
        break;
      case 3:
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
      case 4:
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
        td.appendChild(document.createTextNode(" · "));
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
        switch (td.parentNode.children[3].firstChild.value) {
          case "Reading":
            td.style.backgroundColor = "#2db039";
            break;
          case "Completed":
            td.style.backgroundColor = "#26448f";
            break;
          case "On-hold":
            td.style.backgroundColor = "#f9d457";
            break;
          case "Dropped":
            td.style.backgroundColor = "#a12f31";
            break;
          default:
            td.style.backgroundColor = "#c3c3c3";
            break;
        }
        break;
      case 1:
        queryInfo.title = td.firstChild.value;
        td.innerText = queryInfo.title;
        break;
      case 2:
        queryInfo.author = td.firstChild.value;
        td.innerText = queryInfo.author;
        break;
      case 3:
        queryInfo.status = td.firstChild.value;
        td.innerText = queryInfo.status;
        break;
      case 4:
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
        td.appendChild(document.createTextNode(" · "));
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
        break;
      case 1:
        td.innerText = queryInfo.title;
        break;
      case 2:
        td.innerText = queryInfo.author;
        break;
      case 3:
        td.innerText = queryInfo.status;
        break;
      case 4:
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
        td.appendChild(document.createTextNode(" · "));
        td.appendChild(deleteButton);
        break;
    }
  });
}

function handleDelete(e) {
  const target = e.target.parentNode.parentNode;
  overlayContent = "delete";
  document.getElementById("overlay").style.display = "block";
  document.getElementById("book-delete").style.display = "block";
  document
    .getElementById("delete-yes")
    .addEventListener("click", () => executeDelete(target));
  document.getElementById("delete-no").addEventListener("click", () => {
    const bookDelete = document.getElementById("book-delete");
    document.getElementById("overlay").style.display = "none";
    bookDelete.style.display = "none";
    bookDelete.replaceWith(bookDelete.cloneNode(true));
  });
  // library.splice(target.id, 1);
  // target.remove();
  // const bookRow = document.getElementById("books").childNodes;
  // for (let i = target.id; i < library.length; i++) {
  //   bookRow[i].id = bookRow[i].rowIndex - 1;
  // }
  // //SAVE TO LOCAL STORAGE
  // localStorage.setItem("blibrary", JSON.stringify(library));
}

function executeDelete(target) {
  library.splice(target.id, 1);
  target.remove();
  const bookRow = document.getElementById("books").childNodes;
  for (let i = target.id; i < library.length; i++) {
    bookRow[i].id = bookRow[i].rowIndex - 1;
  }
  const bookDelete = document.getElementById("book-delete");
  document.getElementById("overlay").style.display = "none";
  bookDelete.style.display = "none";
  bookDelete.replaceWith(bookDelete.cloneNode(true));
  //SAVE TO LOCAL STORAGE
  localStorage.setItem("blibrary", JSON.stringify(library));
}

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
