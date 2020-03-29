// load express 
const express =  require('express');
const app = express();

// load mongoose 
const mongoose = require('mongoose');

// load the models
require('./Book');
const Book = mongoose.model('Book');

// load body-parser
const bodyParser = require('body-parser');
// use body-parser for accept json format 
app.use(bodyParser.json());



// connect to database 
mongoose.connect('mongodb://localhost:27017/books', {
    useNewUrlParser : true,
    useUnifiedTopology : true
},(err) => {
    if (err) {
        console.log(err);
    }
    else{
        console.log('connected to mongodb at 27017');
    }
});

// create my first middleware for test my server 
app.get('/', (req,res)=> {
    res.send('hello world this my first app for my library');
});

/*-------------------- create a book ----------------------- */
app.post('/book', (req, res) => {
    var newBook = {
        title : req.body.title,
        auther : req.body.auther,
        numberPages : req.body.numberPages,
        publisher : req.body.publisher
    };

    var book = new Book(newBook);

    book.save().then(() => {
        console.log('new book created');
        res.json('new book created');
    }).catch( (err) => {
        if(err) {
            throw err;
        }
    })
});

/*------------------- get all books -------------------------- */
app.get('/books', (req, res) => {
    Book.find().then((books) => {
        res.json(books);
    }).catch(err => {
        if (err) {
            throw err;
        }
    })
});

/*--------------------get one book by id --------------------- */
app.get('/book/:id', (req,res) => {
    Book.findById(req.params.id).then((book) => {
        if (book) {
            res.json(book)
        }else {
            res.sendStatus(404);
        }
    }).catch(err => {
        console.log(err);
        res.json(err);
    })
});


/*----------------- delete one by id ----------------------- */
app.delete('/book/:id', (req, res) => {
    Book.findOneAndRemove(req.params.id).then(() => {
        res.send('book deleted with success');
    }).catch(err => {
        if (err) {
            throw err;
        }
    })
});

/*----------------------delete all ------------------------ */
app.delete('/books', (req, res) => {
    Book.deleteMany({}).then(() => {
        res.json('all books deleted!');
    }).catch((err) => {
        console.log(err);
    })
});

/*----------------update one by id -----------------------*/
app.put('/book/:id', (req, res) => {
   Book.findByIdAndUpdate({_id : req.params.id},req.body, (err)=>{
       if (err) {
           res.json(err);
       }else {
           res.json('book updated with success!');
       }
   })
});

app.listen(4000, () => {
    console.log('book running on port 4000');
})