import { IoHeartOutline, IoHeartDislikeOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as client from "../Search/client.js";
import * as reviewsClient from "../Reviews/client.js";
import * as usersClient from "../Account/client.js";
import Navigation from "../Navigation";

function ExternalBook(props) {
    const { apiBookKey } = props;
    const [book, setBook] = useState(null);
    const [reviewBook, setReviewBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [review, setReview] = useState(null);
    const [author, setAuthor] = useState(null);
    const [publisher, setPublisher] = useState(null);
    const [error, setError] = useState(null);
    const [account, setAccount] = useState(null);
    
    const fetchAccount = async () => {
      const acc = await usersClient.account();
      setAccount(acc);
    };

    const findBookInfo = async (id) => {
      const b = await client.getBookInfo(id);
      setBook(b);
      const authors = b["authors"][0]
      const a = authors["author"]
      const authorKey = a["key"]
      const authorName = await getAuthorName(authorKey);
      await findReviewsForBook(id, b, authorName)
      await findPublisherInfo(b)
    };

    const findPublisherInfo = async (b) => {
        if (b) {
            const p = await client.getPublishInfo(b["title"]);
            if (p.length !== 0) {
                const pls = p.filter((doc) => {
                    return doc["title"].toString().toLowerCase() === b["title"].toString().toLowerCase();
                })
                if (pls.length !== 0) {
                    let pub = p[0]["publisher"];
                    if (Array.isArray(pub) && pub.length > 0) {
                        pub = pub[0]
                    } else {
                        pub = null;
                    }
                    setPublisher(pub);
                }
            }    
        }
    }
    
    const rbb = async (rbId) => {
        const revs = await reviewsClient.findReviewsByBook(rbId);
        return revs;
    }

    const findReviewsForBook = async (bk, b, an) => {
        const formatKey = `${bk.replace(/\//g,'')}`;
        if (bk && an) {
            const rb = await reviewsClient.findReviewBooksByBookKey(formatKey);
            if (rb.length === 0) {
                const newRb = await reviewsClient.createReviewBook({bookKey: formatKey, title: b["title"], author: an});
                setReviewBook(newRb);
                return;
            }
            setReviewBook(rb[0]);
    
            const revs = await rbb(rb[0]._id);
            setReviews(revs);
        }
    };

    const getAuthorName = async (authorKey) => {
        const a = await client.getAuthorInfo(authorKey.replace('/',''))
        if (a["personal_name"]) {
            setAuthor(a["personal_name"]);
            return a["personal_name"];    
        } else {
            setAuthor(a["name"]);
            return a["name"];
        }
    }

    useEffect(() => {
        fetchAccount();
        if (!book || !reviewBook) {
            findBookInfo(`/${apiBookKey.replace("works", "works/")}`);
        }
    }, [reviewBook, book]);

    const canCreate = async () => {
        const r = await reviewsClient.findReviewsByReaderAndBook(account._id, reviewBook._id)
        return r.length == 0;
    }

    const createReview = async () => {
        let newReview = {...review, reviewBookId: reviewBook._id, readerId: account._id}
        if (newReview._id) {
            delete newReview._id;
        }
        if (!newReview.recommended) {
            newReview.recommended = false;
        }
        const c = await canCreate()
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
        } catch (err) {
            setError(`${err.response.data.message}. try again.`);
        }
    };

    const publisherTransform = (pub) => {
        if (pub) {
            const pub2 = pub.replace(/[^A-Z0-9]+/ig, "+");;
            return pub2;    
        }
    }

    const icon = (recommended) => {
        if (recommended) {
            return <IoHeartOutline className="mb-1"/>
        } else {
            return <IoHeartDislikeOutline className="mb-1"/>
        }
    }

    const standardizeDescription = (d) => {
        if (d instanceof String || typeof(d) === 'string') {
            return d;
        } else {
            return d.value;
        }
    }

    return (
        <div className="container-fluid">
            <Navigation />
            {book && (
                <div className="row body" style={{backgroundColor: '#fcf3f2', minHeight: '90vh'}}>
                    <div className="col-6">
                        <div className="mt-4">
                            <h2 className="ms-3 mb-1 pt-2" style={{fontWeight: "normal"}}>{book["title"]}</h2>
                            <h4 className="ms-3 mt-0 mb-1" style={{fontWeight: "normal"}}> <i>by {author}</i></h4>
                            <p className="ms-3 my-3" style={{textAlign: "justify"}}> {standardizeDescription(book["description"])} </p>
                            {publisher && (
                                <p className="ms-3 my-3"> published by&nbsp;
                                    <Link to={`../publisher/${publisherTransform(publisher)}`} style={{textDecoration: "none", color: "black"}}>
                                        <span style={{color: "#FFC8D3"}}>{publisher.toLowerCase()}</span>
                                    </Link>
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="col-6">
                      {(!account || !account.role) && (
                        <div className="d-flex justify-content-center mt-4"> sign in or sign up to review 
                        </div>
                        )}
                        {account && account.role === 'AUTHOR' && (
                        <div className="d-flex justify-content-center mt-4 mb-0"> 
                          create a reader account to add your review 
                        </div>                        
                        )}
                        <ul className="list-group list-group-flush m-4">
                            {account && account.role === 'READER' && (
                            <button type="button" className="btn text-light" style={{backgroundColor: '#FFC8D3'}} data-bs-toggle="modal" data-bs-target="#reviewModal"> 
                                +  &nbsp; what do you think?
                            </button>)}
                            {reviews.map((review, index) => (
                                <li key={index} className="list-group-item mt-3">
                                    <p className="mt-2"> <strong> {review.title} {icon(review.recommended)} </strong> 
                                        <Link to={`../profile/${review.readerId._id}`} style={{textDecoration: "none"}}>
                                            <i className="text ms-2" style={{color: "#FFC8D3"}}>by {review.readerId.username} </i>
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
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" onClick={(e) => setError(null)}/>
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
                                                <button type="button" className="btn text-light" style={{backgroundColor: '#FFC8D3'}} data-bs-dismiss="modal" onClick={(e) => setError(null)}>close</button>
                                                <button type="button" className="btn text-light" style={{backgroundColor: '#FFC8D3'}} onClick={createReview}>publish changes</button>
                                            </div>
                                        </div>
                                    </div>
                            </div>
        </div>
    )
}

export default ExternalBook;