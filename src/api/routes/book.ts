// Byimaan

export interface Book {
    id: number;
    title: string;
    author: string;
    publishedYear: number;
};

import { bookController } from "../controllers/booksController";
import express from "express";

const bookRouter = express.Router();

bookRouter.get('/', bookController.getBooks);
bookRouter.get('/:id', bookController.getBookByID);
bookRouter.post('/', bookController.createBook);
bookRouter.put('/:id', bookController.updateBook);
bookRouter.delete('/:id', bookController.deleteBook)

export  {bookRouter}