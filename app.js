const express = require('express');
// const exphbs = require('express-handlebars');
const { engine } = require('express-handlebars');
const path = require('path'); // Import the 'path' module

const app = express();
const PORT = 3000;

// Hardcoded dataset
let books = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 10.99, genres: "Tragedy",published: 1925, inStock: true },
    { id: 2, title: 'Harry Potter and the Philosopher\'s Stone', author: 'J.K. Rowling', price: 15.99, genres: 'Fantasy', published: 1997, inStock: true },
    { id: 3, title: 'The Hobbit', author: 'J.R.R. Tolkien', price: 14.99, genres: 'Fantasy', published: 1937, inStock: true },
    { id: 4, title: 'A Game of Thrones', author: 'George R.R. Martin', price: 17.99, genres: 'Fantasy', published: 1996, inStock: false },
    { id: 5, title: '1984', author: 'George Orwell', price: 9.99, genres: 'Dystopian', published: 1949,inStock: true }
];


// Set up Handlebars view engine
app.engine('handlebars', engine()); 
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

// Route to display all books HTML
app.get('/', (req, res) => {
    res.render('index', { books });
});

// Route to display a specific book by ID HTML
app.get('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(book => book.id === bookId);
    if (book) {
        res.status(200).render('book', { book });
    } else {
        res.status(404).send('Book not found');
    }
});

// Route to list all books (JSON)
app.get('/api/books', (req, res) => {
    res.status(200).json(books);
});

// Route to get a specific book by ID (JSON)
app.get('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(book => book.id === bookId);
    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});



// Middleware to parse JSON bodies
app.use(express.json());

// Route to create a new book

app.post('/api/books', (req, res) => {
    const lastID = books[books.length-1].id;
    const newId = lastID + 1;
    
    let newBook = req.body;


    newBook = {
        id: newId,
        title: req.body.title, 
        author: req.body.author, 
        price: req.body.price, 
        genres: req.body.genres, 
        published: req.body.published, 
        inStock: req.body.inStock

    }

    books.push(newBook);
    res.location('http://localhost:3000/api/books/'+newId);
    res.status(201).json(newBook);
});

// Route to update a book by ID
app.patch('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);

    const updatedPrice = req.body.price;
    const updatedInStock = req.body.inStock;

    let foundBook = false; // Flag to track if the book is found

    // Iterate through the books array to find the book with the specified ID
    books.forEach(book => {
        if (book.id === bookId) {
            // Update the price and inStock properties
            book.price = updatedPrice;
            book.inStock = updatedInStock;
            foundBook = true; // Set flag to true indicating book is found
        }
    });

    // Check if the book is found and send response accordingly
    if (foundBook) {
        res.status(200).json(books.find(book => book.id === bookId));
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});


// Route to delete a book by ID
app.delete('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const initialLength = books.length; // Store initial length of books array
   
    // Remove the book with the specified ID from the array
    books = books.filter(book => book.id !== bookId);
   
    // Check if any book was removed
    if (books.length < initialLength) { 
        res.status(202).json(books); // Send the updated books array
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
    // if (index !== -1) {
    //     const deletedBook = books.splice(index, 1);
    //     res.json(deletedBook);
    // } else {
    //     res.status(404).json({ error: 'Book not found' });
    // }
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

