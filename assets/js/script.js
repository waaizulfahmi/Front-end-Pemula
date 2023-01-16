const books = [];
const SAVED_EVENT = "saved-books";
const STORAGE_KEY = "BOOKS_LIST";

function isStorageExist() {
    if (typeof(Storage) === undefined) {
        alert("Browser tidak mendukung local Storage")
        return false
    }
    return true;
}

function saveData() {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT))
    
}

function loadDataFromStorage(){
    const load = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(load);

    if (data !== null){
        for(book of data){
            books.push(book);
        }
    }
    renderBooks();
}

function showData(bookObject){
    const {id, title, author, year, isCompleted } = bookObject;
    const textTitle = document.createElement("h2");
    textTitle.classList.add("book-title");
    textTitle.innerText = `${title}`;

    const textAuthor = document.createElement("p")
    textAuthor.classList.add("book-author");
    textAuthor.innerText =`Penulis : ${author}`;
    
    const textYear = document.createElement("p")
    textYear.classList.add("book-year");
    textYear.innerText = `Tahun  : ${year}`;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner")
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement("div");
    container.classList.add("item","shadow");
    container.append(textContainer);
    container.setAttribute("id", `book-${id}`);

    if(isCompleted){
        const undoBtn = document.createElement("button");
        undoBtn.classList.add("undo-btn");
        undoBtn.addEventListener("click", function(){
            undoBookFromCompleted(id);
        });

        const removeBtn = document.createElement("button");
        removeBtn.classList.add("remove-btn");
        removeBtn.addEventListener("click", function(){
            removeBookFromCompleted(id);
        });
        
        container.append(undoBtn, removeBtn);
        
    }else {
        const checkBtn = document.createElement("button");
        checkBtn.classList.add("check-btn");
        checkBtn.addEventListener("click", function(){
            addBookToCompleted(id);
        })

        const removeBtn = document.createElement("button");
        removeBtn.classList.add("remove-btn");
        removeBtn.addEventListener("click", function(){
            removeBookFromCompleted(id);
        });
        container.append(checkBtn, removeBtn);
    }
    return container;

}

function addBooks() {
    const bookTitle = document.getElementById("inputBookTitle");
    const bookAuthor = document.getElementById("inputBookAuthor");
    const bookYear = document.getElementById("inputBookYear");
    const completeBooks = document.getElementById("inputBookIsComplete");
    const booksData = {
        id: +new Date(),
        title: bookTitle.value.trim(),
        author: bookAuthor.value.trim(),
        year :bookYear.value.trim(),
        isCompleted :completeBooks.checked
    }
    isCompleted = true;  
    if((bookYear.value).length < 4 || (bookYear.value).length > 4){
        alert("Format Tahun Tidak Sesuai \nSilakan isi dengan format 4 Digit ! ");
        return false;
    }

    if(books.push(booksData)){
        alert(`Data Buku dengan judul "${bookTitle.value}" berhasil disimpan !`);
    }else{
        alert("Data Gagal Disimpan !");
    }
    
    renderBooks();
    saveData();
    return booksData;
}

function findBook(booksId){
    for(bookItem of books){
        if(bookItem.id === booksId){
            return bookItem
        }
    }
    return null
}

function findBookIndex(booksId){
    for(index in books){
        if(books[index].id === booksId){
            return index
        }
    }
    return -1
    
}

function addBookToCompleted(booksId){
    const bookTarget = findBook(booksId);
    if(bookTarget == null ) return;
    
    bookTarget.isCompleted = true;
    
    renderBooks();
    saveData();
}

function undoBookFromCompleted(booksId){
    const bookTarget = findBook(booksId);
    if(bookTarget == null) return;

    bookTarget.isCompleted = false;
    renderBooks();
    saveData();
}

function removeBookFromCompleted(booksId){
    const deleteBook = window.confirm(`Apakah anda yakin akan menghapus buku ini?`);  
    if(deleteBook){
        const bookTarget = findBookIndex(booksId);
        if(bookTarget === -1) return;
        books.splice(bookTarget, 1);
    
        alert("Berhasil Menghapus data !")
        renderBooks();
        saveData();
    }else{
        alert("Gagal Menghapus data !")
    }
}

function checkButton(){
    const span = document.querySelector("span");
    if (inputBookIsComplete.checked){
        span.innerHTML = "&nbsp <strong> Selesai Dibaca </strong>";
    }else{
        span.innerHTML= "&nbsp <strong> Belum Selesai Dibaca </strong>";
    }
}


function searchBook() {
    const searchBook = document.getElementById("searchBookTitle");
    const filter = searchBook.value.toUpperCase();
    const bookItem = document.querySelectorAll("section.book_shelf > .book_list > .item");
    for (let i = 0; i < bookItem.length; i++) {
        txtValue = bookItem[i].textContent || bookItem[i].innerText;
        if ( txtValue.toUpperCase().indexOf(filter) > -1) {
            bookItem[i].style.display = "";  
            bookItem[i].style.background = "lightblue";            
        } else {
            bookItem[i].style.display = "none";            
        }
    }
}

function renderBooks(){
    const incompleteBooks = document.getElementById("incompleteBookshelfList");
    const completeBooks = document.getElementById("completeBookshelfList");

    incompleteBooks.innerHTML = ""
    completeBooks.innerHTML = ""

    for (bookItem of books){
        const bookElement = showData(bookItem);
        if(bookItem.isCompleted){
            completeBooks.append(bookElement);
        } else{
            incompleteBooks.append(bookElement);
        }
    }
}

document.addEventListener(SAVED_EVENT, () => {
    console.log("Data berhasil disimpan !")
})

document.addEventListener("DOMContentLoaded", function (){

    const btnSubmit = document.getElementById("inputBook");
    const inputBookIsComplete = document.getElementById("inputBookIsComplete");
    const btnSearch = document.getElementById("searchBook");

    btnSubmit.addEventListener("submit", function(event){
        event.preventDefault();
        addBooks();
    });

    inputBookIsComplete.addEventListener("input", function(event){
        event.preventDefault();
        checkButton();
    });

    btnSearch.addEventListener("submit", function(event){
        event.preventDefault();
        searchBook();
    });
       

    if(isStorageExist()){
        loadDataFromStorage();
    }
})