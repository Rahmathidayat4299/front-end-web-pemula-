const book = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function generateId() {
  return +new Date();
}

function generatebookObject(id, task, author, timestamp, isCompleted) {
  return {
    id,
    task,
    author,
    timestamp,
    isCompleted,
  };
}

function findbook(bookId) {
  for (const bookItem of book) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findbookIndex(bookId) {
  for (const index in book) {
    if (book[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

/**
 * Fungsi ini digunakan untuk memeriksa apakah localStorage didukung oleh browser atau tidak
 *
 * @returns boolean
 */
function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

/**
 * Fungsi ini digunakan untuk menyimpan data ke localStorage
 * berdasarkan KEY yang sudah ditetapkan sebelumnya.
 */
function saveData() {
  if (isStorageExist()) {
    const parsed /* string */ = JSON.stringify(book);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

/**
 * Fungsi ini digunakan untuk memuat data dari localStorage
 * Dan memasukkan data hasil parsing ke variabel {@see book}
 */
function loadDataFromStorage() {
  const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const books of data) {
      book.push(books);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const { id, task, author, timestamp, isCompleted } = bookObject;

  const textTitle = document.createElement('h2');
  textTitle.innerText = task;
  const textAuthor = document.createElement('h2');
  textAuthor.innerText = author;
  const textTimestamp = document.createElement('p');
  textTimestamp.innerText = timestamp;

  const buttons = document.createElement('div');
  buttons.classList.add('action');

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textAuthor, textTimestamp);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(textContainer);
  container.setAttribute('id', `book-${id}`);

  if (isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    undoButton.addEventListener('click', function () {
      undoTaskFromCompleted(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(id);
    });
    buttons.append(undoButton, trashButton);
    container.append(buttons);
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    checkButton.addEventListener('click', function () {
      addTaskToCompleted(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(id);
    });

    buttons.append(checkButton, trashButton);
    container.append(buttons);
  }

  return container;
}

function addbook() {
  const textbook = document.getElementById('title').value;
  const textAuthor = document.getElementById('author').value;
  const timestamp = document.getElementById('date').value;

  const generatedID = generateId();
  const bookObject = generatebookObject(
    generatedID,
    textbook,
    textAuthor,
    timestamp,
    false
  );
  book.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function donebook() {
  const textbook = document.getElementById('title').value;
  const textAuthor = document.getElementById('author').value;
  const timestamp = document.getElementById('date').value;

  const generatedID = generateId();
  const bookObject = generatebookObject(
    generatedID,
    textbook,
    textAuthor,
    timestamp,
    true
  );
  book.push(bookObject);

  book.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addTaskToCompleted(bookId /* HTMLELement */) {
  const bookTarget = findbook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromCompleted(bookId /* HTMLELement */) {
  const bookDelete = confirm('Apakah kamu yakin ingin menghapus buku ini?');

  if (bookDelete === true) {
    const bookTarget = findbookIndex(bookId);

    if (bookTarget === -1) return;

    book.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

//arrow function undo task
const undoTaskFromCompleted = (bookId /* HTMLELement */) => {
  const bookTarget = findbook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

//searchbook  arrow function
const searchBook = () => {
  const searchKey = document.getElementById('textBookTitle').value;
  let bookList = document.querySelectorAll('.item');

  bookList.forEach((item) => {
    const valueBook = item.firstChild.textContent.toLowerCase();

    if (valueBook.indexOf(searchKey) != -1) {
      item.setAttribute('style', 'display: flex;');
    } else {
      item.setAttribute('style', 'display: none !important;');
    }
  });
}


document.addEventListener('DOMContentLoaded', function () {
  const searchBtn = document.querySelector('.search-icon');
  const submitForm /* HTMLFormElement */ = document.getElementById('form');

  const searchBar = document.getElementById('searchBook');

  const checkbox = document.getElementById('inputBookIsComplete');
  let check = false;

  searchBtn.addEventListener('click', function () {
    form.classList.add('active');
    searchBtn.classList.add('hide');
    cancelBtn.classList.add('show');
  });

  searchBar.addEventListener('submit', function (event) {
    event.preventDefault();
    searchBook();
  });

  checkbox.addEventListener('change', function () {
    if (checkbox.checked) {
      check = true;
    } else {
      check = false;
    }
  });

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if (check == true) {
      donebook();
    } else {
      addbook();
    }
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data berhasil di simpan.');
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById('uncomplete-read');
  const listCompleted = document.getElementById('complete-read');

  // clearing list item
  uncompletedBookList.innerHTML = '';
  listCompleted.innerHTML = '';

  for (const bookItem of book) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      listCompleted.append(bookElement);
    } else {
      uncompletedBookList.append(bookElement);
    }
  }
});
