import { IoHeartOutline, IoHeartDislikeOutline } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./profile.css"
import * as client from "../Reviews/client.js";
import { Link } from "react-router-dom";

function Reviews(props) {
    const {curr, account, id} = props;
    const [reviews, setReviews] = useState([]);
    const [review, setReview] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const getReviewsForUser = async (accountId) => {
        if (curr && curr._id == id) {
            console.log(curr._id, id)
            navigate("../profile")
        }
        const revs = await client.findReviewsByReader(accountId);
        setReviews(revs);
    }

    useEffect(() => {
        getReviewsForUser(account._id);
    }, []);

    const deleteReview = async (rv) => {
        try {
            await client.deleteReview(rv);
            setReviews(reviews.filter(
                (r) => r._id !== rv._id
            ));
            setReview(null)
        } catch (err) {
            console.log(`${err.response.data.message}. try again.`);
        }
    }

    const updateReview = async () => {
        const updatedReview = {...review, readerId: account._id, reviewBookId: review.reviewBookId._id}
        setReview(updatedReview);
        try {
            await client.updateReview(review);
            setReviews(
                reviews.map((r) => {
                  if (r._id === review._id) {
                    return review;
                  }
                  return r;
                })
              );
              setError("changes saved!");
        } catch (err) {
            setError(`${err.response.data.message}. try again.`);
        }
    };

    const icon = (recommended) => {
        if (recommended) {
            return <IoHeartOutline className="mb-1"/>
        } else {
            return <IoHeartDislikeOutline className="mb-1"/>
        }
    }
    
    return (
        <div className="row body" style={{backgroundColor: '#fcf3f2', minHeight: '90vh'}}>
            <div className="" style={{backgroundColor: '#fcf3f2'}}>
                {id && (
                    <div className="d-flex align-items-center justify-content-center">
                        <h3 className="mt-4" style={{fontWeight: "normal"}}><i>{account.firstName.toLowerCase()} {account.lastName.toLowerCase()}'s reviews</i></h3>
                    </div>
                )}
                {!id && reviews && reviews.length > 0 && (
                    <div className="d-flex align-items-center justify-content-center">
                        <h3 className="mt-4" style={{fontWeight: "normal"}}><i>my reviews</i></h3>
                    </div>
                )}
                <ul className="list-group list-group-flush mx-4 mb-4">
                    {!reviews || reviews.length === 0 && (
                        <div className="body row d-flex align-items-center justify-content-center" style={{backgroundColor: '#fcf3f2', height:'80vh'}}>
                            <h5 className="text-center" style={{fontWeight: "normal"}}><i>no reviews written yet. search for books to let us know what you think!</i></h5>
                        </div>
                    )}
                    {reviews.map((r, index) => (
                        <li key={index} className="list-group-item mt-3">
                            <div className="d-flex">
                                <Link to={`/books/${r.reviewBookId.bookKey}`} style={{color: '#FFC8D3', textDecoration: 'none'}}>
                                    <h5 className="my-2" style={{fontWeight: "normal"}}> {r.reviewBookId.title} <i>by {r.reviewBookId.author}</i> {icon(r.recommended)}</h5>
                                </Link>
                            </div>
                            <p className="mb-0"> <strong> {r.title} </strong></p>
                            <p className="mt-0"> {r.review} </p>
                            {!id && (
                                <>
                                    <button type="button" className="btn btn-sm ps-1" data-bs-toggle="modal" data-bs-target="#editModal"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            setError(null);
                                            setReview(r);
                                          }}
                                    >
                                        <LuPencil className="mb-2" style={{color: '#FFC8D3'}} />
                                    </button>
                                    <button className="btn btn-sm">
                                        <LuTrash2 className="mb-2" style={{color: '#FFC8D3'}} onClick={(event) => {
                                            console.log(r)
                                            deleteReview(r)
                                        }} />
                                    </button>
                                </>
                            )}
                            <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="editModal" tabindex="-1">
                                    <div class="modal-dialog modal-dialog-centered modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h3 class="modal-title fs-5" id="editModalLabel">edit review</h3>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" />
                                            </div>
                                            <div class="modal-body">
                                                <div class="mb-1">
                                                    <label for="title" class="col-form-label">title</label>
                                                    <input type="text" class="form-control" id="title" value={review ? review.title : ""} onChange={(e) => setReview({ ...review, title: e.target.value })}/>
                                                </div>
                                                <div class="mb-1">
                                                    <label for="synopsis" class="col-form-label">synopsis</label>
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
                                                <button type="button" className="btn text-light" style={{backgroundColor: '#FFC8D3'}} onClick={updateReview}>publish changes</button>
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

export default Reviews;