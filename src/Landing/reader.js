import * as client from "../Reviews/client"
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

function Reader(props) {
    const {curr} = props;
    const [reviews, setReviews] = useState([]);
    const getReviewsForUser = async (accountId) => {
        const revs = await client.findReviewsByReader(accountId);
        setReviews(revs.length > 4 ? revs.slice(0, 4) : revs);
    }

    useEffect(() => {
        getReviewsForUser(curr._id);
    }, []);

    return (
        <div className="container-fluid">
        {reviews.length === 0 && (
            <div className="body row" style={{backgroundColor: '#fcf3f2', minHeight: '90vh'}}>
                <div className="" style={{backgroundColor: '#fcf3f2'}}>
                    <div className="body row d-flex flex-column align-items-center justify-content-center" style={{backgroundColor: '#fcf3f2', height:'80vh'}}>
                        <h2 className="text-center" style={{fontWeight: "normal"}}><i>welcome to lit review {curr.firstName} ! </i></h2>
                        <p className="text-center" style={{fontWeight: "normal"}}><i>lit review is a platform for readers and authors to share their writing with a community of book-lovers </i></p>
                        <h4 className="text-center" style={{fontWeight: "normal"}}>search for books to let us know what you think.</h4>
                    </div>
                </div>
            </div>
        )}
        {reviews.length > 0 && (
        <div className="body row" style={{backgroundColor: '#fcf3f2', minHeight: '90vh'}}>
            <div className="p-0" style={{backgroundColor: '#fcf3f2'}}>
                <h2 style={{fontWeight: "normal"}} className="d-flex justify-content-center mt-5 mb-0 ms-4">welcome back {curr.firstName} !</h2>
                <h4 style={{fontWeight: "normal"}} className="d-flex justify-content-center mt-3 mb-3 ms-4">
                    see what readers are saying about books you've read...
                </h4>
                {reviews && (
                    <ul className="list-group list-group-flush mx-5 mb-4">
                        {reviews.map((r, index) => (
                            <li key={index} className="list-group-item mt-3 mx-5">
                                <Link to={`/books/${r.reviewBookId.bookKey}`} style={{color: '#FFC8D3', textDecoration: 'none'}}>
                                    <h5 className="d-flex justify-content-center my-2" style={{fontWeight: "normal"}}> {r.reviewBookId.title} <i>&nbsp;by {r.reviewBookId.author}</i></h5>
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

export default Reader;