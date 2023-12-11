import axios from "axios";

const request = axios.create({
    withCredentials: true,
});

export const BASE_API = process.env.REACT_APP_BASE_API_URL;
export const REVIEW_API = `${BASE_API}/api/reviews`;
export const REVIEWBOOK_API = `${BASE_API}/api/reviewbooks`;

export const updateReview = async (review) => {
    const response = await request.put(`${REVIEW_API}/${review._id}`, review);
    return response.data;
};

export const findAllReviews = async () => {
const response = await request.get(`${REVIEW_API}`);
return response.data;
};

export const createReview = async (review) => {
    const response = await request.post(`${REVIEW_API}`, review);
    return response.data;
};

export const createReviewBook = async (reviewBook) => {
    const response = await request.post(`${REVIEWBOOK_API}`, reviewBook);
    return response.data;
};

export const findReviewById = async (id) => {
    const response = await request.get(`${REVIEW_API}/${id}`);
    return response.data;
};

export const deleteReview = async (review) => {
    const response = await request.delete(
    `${REVIEW_API}/${review._id}`);
    return response.data;
};

export const findReviewsByReader = async (readerId) => {
    const response = await request.get(
    `${REVIEW_API}/reader/${readerId}`);
    return response.data;
};

export const findReviewsByBook = async (bookId) => {
    const response = await request.get(
    `${REVIEW_API}/book/${bookId}`);
    return response.data;
};

export const findReviewsByReaderAndBook = async (readerId, bookId) => {
    const response = await request.get(
    `${REVIEW_API}/reader/${readerId}/book/${bookId}`);
    return response.data;
};

export const findReviewBooksByBookKey = async (bookKey) => {
    const response = await request.get(
    `${REVIEWBOOK_API}/key/${bookKey}`);
    return response.data;
};

export const findReviewBooksById = async (rbId) => {
    const response = await request.get(
    `${REVIEWBOOK_API}/${rbId}`);
    return response.data;
};