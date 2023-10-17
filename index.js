 const express= require("express");
 var bodyparser= require("body-parser");
const database= require("./database");
const bookman = express();
bookman.use(bodyparser.urlencoded({extended:true}));
bookman.use(bodyparser.json());


/*
Route           /
Description     Get all the books
Access          PUBLIC
parameter       NONE
Methods         GET
*/


bookman.get("/",(req,res)=>{
  return res.json({books: database.books});
});

/*
Route           /is
Description     GET specific book on ISBN
Access          PUBLIC
parameter       isbn
Methods         GET
*/

bookman.get("/is/:isbn",(req, res)=>{
  const getspecificBook = database.books.filter(
    (book)=> book.ISBN ===req.params.isbn

  );
  if(getspecificBook.length===0){
    return res.json({error:`No book found for ISBN of ${req.params.isbn}` })
  }
  return res.json({book:getspecificBook});
});



/*
Route               /c
Description         Get a specific book on category
Access              PUBLIC
parameter           category
Method              GET

*/

bookman.get( "/c/:category", (req, res)=>{
  const getspecificBook= database.books.filter(
    (book)=>book.category.includes(req.params.category)
  );
  if (getspecificBook.length==0){
    return res.json({error:`book not found ${req.params.category}`} )
  }
  return res.json({book:getspecificBook});
});

/*
Route              /language
Description         Get specific book on language
Access              PUBLIC
Parameter           NONE
Methods             GET
*/
bookman.get("/language",(req, res)=>{

  return res.json({languages: database.language});
});

/*
Route              /author
Description        Get all the authors
Access             PUBLIC
Parameter          NONE
Methods            GET
*/

bookman.get("/author",(req, res)=>{

  return res.json({authors: database.author});
});

/*
Router            /author/book
Description         Get all authors based on books
Access            PUBLIC
parameter          isbn
Methods           GET

*/

bookman.get("/author/book/:isbn",(req, res)=>{
  const getspecificAuthor= database.author.filter(
    (author)=>author.books.includes(req.params.isbn)
  );
  if (getspecificAuthor.length===0){
    return res.json({error:`no author found ${req.params.isbn}`})
  }
  return res.json({authors:getspecificAuthor});
});


/*
Route              /author/name
Description          Get list of authors based on books
Access              PUBLIC
Parameter            NONE
Methods             GET

*/

bookman.get("/author/name/:books",(req, res)=>{
  const getspecificAuthor = database.author.filter(
    (author)=>author.book.includes(req.params.book)
  )

  if(getspecificAuthor.length===0){
    return res.json({error:`no author found ${req.params.book}`})
  }
  return res.json({author:getspecificAuthor});
});

/*
Route              /publications
Description        Get all the publications
Access             PUBLIC
Parameter          NONE
Methods            GET
*/

bookman.get("/publications",(req, res)=>{

  return res.json({publications: database.publication});
});


/*
Route              /book/new
Description        Get all the publications
Access             PUBLIC
Parameter          NONE
Methods            GET
*/

bookman.get("/book/new",(req, res)=>{

  const newBook = req.body;
  database.books.push(newBook);
  return res.json({updatedBooks:database.books});
});

/*
Route           /author/new
Description     Add new authors
Access          PUBLIC
Parameter       NONE
Methods         POST

*/


bookman.post("/author/new",(req,res)=>{
  const newAuthor= req.body;
  database.author.push(newAuthor);
  return res.json(database.authors);
});

/*
Route             /publication/new
Description       Add new publication
Access            PUBLIC
Parameter         NONE
Methods           POST

*/

 bookman.post("/publication/new",(req, res)=>{
   const newPublication=req.body;
   database.publication.push(newPublication);
   return res.json(database.publication)
 })

 /*
Route                  /publication/update/book/
Description            update/add new publication
Access                  PUBLIC
Parameter               isbn
Methods                 PUT
 */

 bookman.put("/publication/update/book/:isbn",(req, res)=>{
   //upadate the publication database
   database.publication.forEach((pub)=>{
     if(pub.id===req.body.pubId){
       return pub.book.push(req.params.isbn);
     }
   });

   //update the book database

   database.books.forEach((book)=>{
     if(book.ISBN===req.params.isbn){
       book.publications=req.body.pubId;
       return;
     }
   });
   return res.json(
     {
       books:database.books,
       publications:database.publication,
       message: "successfully updated publications"

     }
   );
 })

 /*
Route                  /book/delete/
Description            Delete a book
Access                  PUBLIC
Parameter               isbn
Methods                 DELETE
 */

bookman.delete("/book/delete/:isbn",(req,res)=>{
  const updatedBookDatabase =database.books.filter(
    (book)=> book.ISBN !== req.params.isbn
  )
  database.books= updatedBookDatabase;
  return res.json({books:database.books});
});
/*
Route                  /book/delete/author
Description            Delete a author from a book and vice versa
Access                  PUBLIC
Parameter               isbn,authorId
Methods                 DELETE
*/
bookman.delete("/book/delete/author/:isbn/:authorId", (req,res)=>{
  //update the book database
  database.books.forEach((book)=>{
  if(book.ISBN ===  req.params.isbn){
    const newAuthorList = book.author.filter(

      (eachAuthor)=>eachAuthor !== parseInt(req.params.authorId)
    );
    book.author = newAuthorList;
    return;
  }
  });
  //updating the author database
  database.author.forEach((eachAuthor)=>{
    if(eachAuthor.id ===parseInt(req.params.authorId)){
      const newBookList = eachAuthor.books.filter(
        (book)=> book !== req.params.isbn
      );
      eachAuthor.books = newBookList;
      return;
    }
  });
  return res.json({
    book:database.books,
    author:database.author,
    message:"author was deleted!!!"
  });
});


bookman.listen (3000,() => {
  console.log("server is up and running");
});
