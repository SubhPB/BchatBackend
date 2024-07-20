// Byimaan

import { Request, Response } from "express";
import { Book } from "../routes/book";

let books: Book[] = [
    { id: 1, title: '1984', author: 'George Orwell', publishedYear: 1949 },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', publishedYear: 1960 },
];

class BookController {

    getBooks(req: Request, res:Response){
        return res.json(books)
    };


    getBookByID(req: Request, res: Response){
        const id = parseInt(req.params.id);

        const book = books.find(
            bk => bk.id === id
        );

        if (book){
            res.json(book)
        } else {
            res.status(404).send('Book not found!')
        }
    };

    createBook(req: Request, res: Response){
        const body = req.body
        const newBook: Book = {
            id: books.length + 1,
            title: body.title,
            author: body.author,
            publishedYear: body.publishedYear
        };
        books.push(newBook);
        res.status(201).json(newBook)
    };

    updateBook(req: Request, res: Response){
        const id = parseInt(req.params.id);
        const book = books.find(b => b.id === id);
        if (book) {
          book.title = req.body.title;
          book.author = req.body.author;
          book.publishedYear = req.body.publishedYear;
          res.json(book);
        } else {
          res.status(404).send('Book not found');
        }
      };

    deleteBook(req: Request, res: Response){
        const id = parseInt(req.params.id);
        books = books.filter(b => b.id !== id);
        res.status(204).send();
    };

};

const bookController = new BookController()
export {bookController}