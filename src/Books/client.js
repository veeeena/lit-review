import axios from "axios";

const request = axios.create({
    withCredentials: true,
});

//export const BASE_API = process.env.REACT_APP_BASE_API_URL;
export const BASE_API = "http://localhost:4000";
export const BOOK_API = `${BASE_API}/api/books`;

export const updateBook = async (book) => {
    const response = await request.put(`${BOOK_API}/${book._id}`, book);
    return response.data;
};

export const findAllBooks = async () => {
const response = await request.get(`${BOOK_API}`);
return response.data;
};

export const createBook = async (book) => {
    const response = await request.post(`${BOOK_API}`, book);
    return response.data;
};

export const findBookById = async (id) => {
    const response = await request.get(`${BOOK_API}/${id}`);
    return response.data;
};

export const deleteBook = async (book) => {
    const response = await request.delete(
    `${BOOK_API}/${book._id}`);
    return response.data;
};

export const findBooksByTitle = async (title) => {
    const response = await request.get(
    `${BOOK_API}/title/${title}`);
    return response.data;
};

export const findBooksByAuthor = async (author) => {
    const response = await request.get(
    `${BOOK_API}/author/${author}`);
    return response.data;
};