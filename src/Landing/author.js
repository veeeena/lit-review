import * as client from "../Books/client"
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

function Author(props) {
    const {curr} = props;
    const [books, setBooks] = useState([]);

    const getBooksForUser = async (currId) => {
        const b = await client.findBooksByAuthor(currId)
        console.log(b);
        setBooks(b.length > 4 ? b.slice(0, 4) : b);
    }
    useEffect(() => {
          getBooksForUser(curr._id);
      }, []);

    console.log(books);
    return (
        <div className="container-fluid">
        {books.length === 0 && (
            <div className="body row" style={{backgroundColor: '#fcf3f2', minHeight: '90vh'}}>
                <div className="" style={{backgroundColor: '#fcf3f2'}}>
                    <div className="body row d-flex flex-column align-items-center justify-content-center" style={{backgroundColor: '#fcf3f2', height:'80vh'}}>
                        <h2 className="text-center" style={{fontWeight: "normal"}}><i>welcome to lit review {curr.firstName} ! </i></h2>
                        <p className="text-center" style={{fontWeight: "normal"}}><i>lit review is a platform for readers and authors to share their writing with a community of book-lovers</i></p>
                        <h4 className="text-center" style={{fontWeight: "normal"}}>go to the "my books" tab to add your writing.</h4>
                    </div>
                </div>
            </div>
        )}
        {books.length > 0 && (
        <div className="body row" style={{backgroundColor: '#fcf3f2', minHeight: '90vh'}}>
            <div className="p-0" style={{backgroundColor: '#fcf3f2'}}>
                <h2 style={{fontWeight: "normal"}} className="d-flex justify-content-center mt-5 mb-0 ms-4">welcome back {curr.firstName} !</h2>
                <h4 style={{fontWeight: "normal"}} className="d-flex justify-content-center mt-3 mb-3 ms-4">
                    see what readers are saying about books you've written...
                </h4>
                {books && (
                    <ul className="list-group list-group-flush mx-5 mb-4">
                        {books.map((b, index) => (
                            <li key={index} className="list-group-item mt-3 mx-5">
                                <Link to={`/books/${b._id}`} style={{color: '#FFC8D3', textDecoration: 'none'}}>
                                    <h5 className="d-flex justify-content-center my-2" style={{fontWeight: "normal"}}> {b.title} <i>&nbsp;by {curr.firstName} {curr.lastName}</i></h5>
                                </Link>                            
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>)}    
        </div>

    );
}

export default Author;