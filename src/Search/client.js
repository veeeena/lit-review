import axios from "axios";

export const LIBRARY_API = "https://openlibrary.org";
export const SEARCH_API = "search.json?q=";

export const searchBooks = async (terms) => {
    const newTerms = terms.replace(/[^A-Z0-9]+/ig, "+");
    const res = await axios.get(
        `${LIBRARY_API}/${SEARCH_API}${newTerms}&fields=key,first_publish_year,author_name,title&page=1&limit=20&sort=readinglog`
    )
    return res.data.docs;
}

export const getBookInfo = async (key) => {
    const res = await axios.get(
        `${LIBRARY_API}${key}.json`
    )
    return res.data;
}

export const getAuthorInfo = async (key) => {
    const res = await axios.get(
        `${LIBRARY_API}/${key}.json`
    )
    return res.data;
}

