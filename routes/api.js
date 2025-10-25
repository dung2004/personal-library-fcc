/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');
const Book = require('../models').Book;

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const books = await Book.find({}).select('title comments').lean();
        const result = books.map(b => ({ _id: b._id, title: b.title, commentcount: (b.comments?.length) || 0 }));
        res.json(result);
      } catch (err) {
        res.json([]);
      }
    })
    
    .post(async function (req, res){
      let title = req.body.title;
      if(!title){
        res.send('missing required field title');
        return;
      }
      try {
        const newBook = new Book({ title: title, comments: [] });
        const data = await newBook.save();
        res.json({ _id: data._id, title: data.title});
      } catch (err) {
        res.send('error saving book');
      }
    })   
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      try {
        await Book.deleteMany({});
        res.send('complete delete successful');
      } catch (err) {
        res.send('complete delete successful');
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        if (!mongoose.Types.ObjectId.isValid(bookid)) {
          return res.send('no book exists');
        }
        const book = await Book.findById(bookid).lean();
        if(!book){
          return res.send('no book exists');
        }
        res.json({ _id: book._id, title: book.title, comments: book.comments || [] });
      } catch (err) {
        res.send('no book exists');
      }
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if(!comment){
        return res.send('missing required field comment');
      }
      try {
        if (!mongoose.Types.ObjectId.isValid(bookid)) {
          return res.send('no book exists');
        }
        const book = await Book.findById(bookid);
        if(!book){
          return res.send('no book exists');
        }
        book.comments.push(comment);
        await book.save();
        res.json({ _id: book._id, title: book.title, comments: book.comments });
      } catch (err) {
        res.send('no book exists');
      }
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      try {
        if (!mongoose.Types.ObjectId.isValid(bookid)) {
          return res.send('no book exists');
        }
        const deleted = await Book.findByIdAndDelete(bookid);
        if(!deleted){
          return res.send('no book exists');
        }
        res.send('delete successful');
      } catch (err) {
        res.send('no book exists');
      }
    });
  
};
