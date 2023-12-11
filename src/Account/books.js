import { LuPencil, LuTrash2 } from "react-icons/lu";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./profile.css"
import * as client from "../Books/client.js"
import * as reviewsClient from "../Reviews/client.js"
import { Link } from "react-router-dom";

function MyBooks({curr, account, id}) {
    const [books, setBooks] = useState([]);
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);
    const author = `${account.firstName} ${account.lastName}`
    const navigate = useNavigate();

    const getBooksForUser = async () => {
        if (curr._id == id) {
            console.log(curr._id, id)
            navigate("../profile")
        }
        const b = await client.findBooksByAuthor(account._id)
        setBooks(b);
        
    }
    useEffect(() => {
          getBooksForUser(account._id);
      }, []);

    const createBook = async () => {
        let newBook = {...book, author: account._id}
        if (newBook._id) {
            delete newBook._id;
        }
        try {
            newBook = await client.createBook(newBook);
            setError("published!")
            setBooks([
              ...books, newBook
            ]);
            setBook(null);
        } catch (err) {
            console.log(err);
            setError(`${err.response.data.message}. try again.`);
        }
    };

    const deleteBook = async (bk) => {
        try {
            await client.deleteBook(bk);
            setBooks(books.filter(
                (b) => b._id !== bk._id
            ));
            setBook(null)
        } catch (err) {
            console.log(`${err.response.data.message}. try again.`);
        }
    }

    const updateBook = async () => {
        const updatedBook = {...book, author: account._id}
        setBook(updatedBook);
        try {
            await client.updateBook(book);
            setBooks(
                books.map((b) => {
                  if (b._id === book._id) {
                    return book;
                  }
                  return b;
                })
              );
              setError("changes saved!");
        } catch (err) {
            setError(`${err.response.data.message}. try again.`);
        }
    };

    return (
        <div className="row body" style={{backgroundColor: '#fcf3f2', minHeight: '90vh'}}>
            <div className="" style={{backgroundColor: '#fcf3f2'}}>
                <div className="d-flex justify-content-center">
                    {!id && <button type="button" onClick={(event) => setError(null)} className="btn text-light mt-4 mx-4" style={{backgroundColor: '#FFC8D3'}} data-bs-toggle="modal" data-bs-target="#bookModal">
                        +  &nbsp; new book
                    </button>} 
                    {id && <h3 className="mt-4 mb-0">{account.firstName.toLowerCase()} {account.lastName.toLowerCase()}'s books</h3>}                   
                </div>
                <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="bookModal" tabindex="-1">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            {error && <div className="alert p-2 mt-3 mx-3 mb-1" style={{backgroundColor: '#fc668e'}}><p className="ms-2 my-0 lh-sm">{error}</p></div>}
                            <div class="modal-header">
                                <h3 class="modal-title fs-5" style={{fontWeight: "normal"}} id="bookModalLabel">my new book</h3>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" onClick={(e) => setError(null)}/>
                            </div>
                            <div class="modal-body">
                                <div class="mb-1">
                                    <label for="title" class="col-form-label">title</label>
                                    <input type="text" class="form-control" id="title" onChange={(e) => setBook({ ...book, title: e.target.value })}/>
                                </div>
                                <div class="mb-1">
                                    <label for="review" class="col-form-label">synopsis</label>
                                    <textarea class="form-control" id="review" style={{height: "100px"}} onChange={(e) => setBook({ ...book, synopsis: e.target.value })}></textarea>
                                </div>
                                <div class="mb-1">
                                    <label for="year" class="col-form-label">year published</label>
                                    <input type="number" class="form-control" id="year" onChange={(e) => setBook({ ...book, year: new Date(e.target.value, 3) })} />
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" className="btn text-light" style={{backgroundColor: '#FFC8D3'}} data-bs-dismiss="modal" onClick={(e) => setError(null)}>close</button>
                                <button type="button" className="btn text-light" style={{backgroundColor: '#FFC8D3'}} onClick={createBook}>publish</button>
                            </div>
                        </div>
                    </div>
                </div>
                <ul className="list-group list-group-flush mt-1 mb-4 mx-4">
                    {books.map((b, index) => (
                        <li key={index} className="list-group-item mt-3">
                            <Link
                                to={`/books/${b._id}`}
                                style={{color: '#FFC8D3', textDecoration: 'none'}}
                            >                            
                                <h5 className="mt-2" style={{fontWeight: "normal"}}> {b.title} {`(${new Date(b.year).getFullYear()})`}</h5>
                            </Link>
                            <p> <i> by {author} </i></p>
                            <p> {b.synopsis} </p>
                            {!id && (
                                <>
                                    <button type="button" className="btn btn-sm ps-1" data-bs-toggle="modal" data-bs-target="#editModal"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            setError(null);
                                            setBook(b);
                                          }}
                                    >
                                        <LuPencil className="mb-2" style={{color: '#FFC8D3'}} />
                                    </button>
                                    <button className="btn btn-sm">
                                        <LuTrash2 className="mb-2" style={{color: '#FFC8D3'}} onClick={(event) => {
                                            deleteBook(b)
                                        }} />
                                    </button>
                                </>
                            )}
                                <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="editModal" tabindex="-1">
                                    <div class="modal-dialog modal-dialog-centered modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h3 style={{fontWeight: "normal"}}class="modal-title fs-5" id="editModalLabel">edit book</h3>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" onClick={(e) => setError(null)} />
                                            </div>
                                            <div class="modal-body">
                                                <div class="mb-1">
                                                    <label for="title" class="col-form-label">title</label>
                                                    <input type="text" class="form-control" id="title" value={book ? book.title : ""} onChange={(e) => setBook({ ...book, title: e.target.value })}/>
                                                </div>
                                                <div class="mb-1">
                                                    <label for="synopsis" class="col-form-label">synopsis</label>
                                                    <textarea class="form-control" id="synopsis" value={book ? book.synopsis : ""} style={{height: "100px"}} onChange={(e) => setBook({ ...book, synopsis: e.target.value })}></textarea>
                                                </div>
                                                <div class="mb-1">
                                                    <label for="year" class="col-form-label">year published</label>
                                                    <input type="number" class="form-control" id="year" value={book ? new Date(book.year).getFullYear() : 0} onChange={(e) => setBook({ ...book, year: new Date(e.target.value, 3) })} />
                                                </div>
                                            </div>
                                            {error && <div className="alert p-2 mt-0 mx-3 mb-2" style={{backgroundColor: '#fc668e'}}><p className="ms-2 my-0 lh-sm">{error}</p></div>}
                                            <div class="modal-footer">
                                                <button type="button" className="btn text-light" style={{backgroundColor: '#FFC8D3'}} data-bs-dismiss="modal" onClick={(e) => setError(null)}>close</button>
                                                <button type="button" className="btn text-light" style={{backgroundColor: '#FFC8D3'}} onClick={updateBook}>publish changes</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>                                    
                        </li>                            
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default MyBooks;