import { IoHeartOutline, IoHeartDislikeOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import * as client from "./client";
import * as reviewsClient from "../Reviews/client";
import * as usersClient from "../Account/client";
import Navigation from "../Navigation";

function Book() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [reviewBook, setReviewBook] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [review, setReview] = useState(null);
    const [author, setAuthor] = useState(null);
    const [error, setError] = useState(null);
    const [account, setAccount] = useState(null);
    
    const fetchAccount = async () => {
      const acc = await usersClient.account();
      setAccount(acc);
    };

    const findBookById = async (id) => {
      const b = await client.findBookById(id);
      setBook(b);
      await findReviewsForBook(b._id)
      getAuthorName(b.author);
    };
    
    const rbb = async () => {
        const revs = await reviewsClient.findReviewsByBook(reviewBook._id);
        return revs;
    }

    const findReviewsForBook = async (bk) => {
        const rb = await reviewsClient.findReviewBooksByBookKey(bk);
        if (rb.length == 0) {
            const newRb = await reviewsClient.createReviewBook({bookKey: bk, title: book.title, author: author});
            setReviewBook(newRb);
            return;
        }
        setReviewBook(rb[0]);

        const revs = await rbb();
        setReviews(revs);
    };

    const getAuthorName = async (auth) => {
        const a = await usersClient.findUserById(auth)
        const first = a.firstName;
        const last = a.lastName;
        setAuthor(`${first} ${last}`);
    }

    useEffect(() => {
        fetchAccount();
        if (reviews.length == 0) {
            findBookById(id);
        }
    }, [reviews]);

    const canCreate = async () => {
        const r = await reviewsClient.findReviewsByReaderAndBook(account._id, reviewBook._id)
        return r.length == 0;
    }
  

    const createReview = async () => {
        let newReview = {...review, reviewBookId: reviewBook._id, readerId: account._id}
        if (newReview._id) {
            delete newReview._id;
        }

        const c = await canCreate()
        console.log(c);
        if (!c) {
            setError(`you can't review a book you've already reviewed. use 'my reviews' tab to edit your review.`)
            return;
        }

        try {
            newReview = await reviewsClient.createReview(newReview);
            setError("published!")
            setReviews([
              ...reviews, newReview
            ]);
            setReview(null)
            setError(null)
        } catch (err) {
            console.log(err);
            setError(`${err.response.data.message}. try again.`);
        }
    };

    console.log(reviews);


    const icon = (recommended) => {
        if (recommended) {
            return <IoHeartOutline className="mb-1"/>
        } else {
            return <IoHeartDislikeOutline className="mb-1"/>
        }
    }

    return (
        <div className="container-fluid">
            <Navigation />
            {book && (
                <div className="row body" style={{backgroundColor: '#fcf3f2', minHeight: '90vh'}}>
                    <div className="col-6">
                        <div className="mt-4">
                            <h2 className="ms-3 mb-1 pt-2" style={{fontWeight: "normal"}}>{book.title} ({new Date(book.year).getFullYear()})</h2>
                            <h4 className="ms-3 mt-0 mb-1" style={{fontWeight: "normal"}}> <i>by {author}</i></h4>
                            <p className="ms-3 my-3" style={{textAlign: "justify"}}> {book.synopsis} </p>
                        </div>
                    </div>
                    <div className="col-6">
                        <ul className="list-group list-group-flush m-4">
                            {account.role === 'READER' && (
                            <button type="button" className="btn text-light" style={{backgroundColor: '#FFC8D3'}} data-bs-toggle="modal" data-bs-target="#reviewModal"> 
                                +  &nbsp; what do you think?
                            </button>)}
                            {reviews.map((review, index) => (
                                <li key={index} className="list-group-item mt-3">
                                    <p className="mt-2"> <strong> {review.title} {icon(review.recommended)} </strong> 
                                        <Link to={`../profile/${review.readerId._id}`} style={{textDecoration: "none"}}>
                                            <i className="text ms-2" style={{color: "#FFC8D3"}}>by {review.readerId.username.toLowerCase()} </i>
                                        </Link>
                                    </p>
                                    <p> {review.review} </p>
                                </li>                            
                            ))}                        
                        </ul>
                    </div>
                </div>
            )}
                                <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="reviewModal" tabindex="-1">
                                    <div class="modal-dialog modal-dialog-centered modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h3 class="modal-title fs-5" style={{fontWeight: "normal"}} id="editModalLabel">what do you think?</h3>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" />
                                            </div>
                                            <div class="modal-body">
                                                <div class="mb-1">
                                                    <label for="title" class="col-form-label">review title</label>
                                                    <input type="text" class="form-control" id="title" value={review ? review.title : ""} onChange={(e) => setReview({ ...review, title: e.target.value })}/>
                                                </div>
                                                <div class="mb-1">
                                                    <label for="synopsis" class="col-form-label">review</label>
                                                    <textarea class="form-control" id="synopsis" value={review ? review.review : ""} style={{height: "100px"}} onChange={(e) => setReview({ ...review, review: e.target.value })}></textarea>
                                                </div>
                                                <div class="form-check mt-2">
                                                    <input class="form-check-input" type="checkbox" value={review ? review.recommended : false} id="defaultCheck1" onChange={(e) => setReview({...review, recommended: e.target.checked})}/>
                                                    <label class="form-check-label" for="defaultCheck1">
                                                        recommend?
                                                    </label>
                                                </div>
                                            </div>
                                            {error && <div className="alert p-2 mt-0 mx-3 mb-2" style={{backgroundColor: '#fc668e'}}><p className="ms-2 my-0 lh-sm">{error}</p></div>}
                                            <div class="modal-footer">
                                                <button type="button" className="btn text-light" style={{backgroundColor: '#FFC8D3'}} data-bs-dismiss="modal">close</button>
                                                <button type="button" className="btn text-light" style={{backgroundColor: '#FFC8D3'}} onClick={createReview}>publish changes</button>
                                            </div>
                                        </div>
                                    </div>
                            </div>
        </div>
    )
}

export default Book;