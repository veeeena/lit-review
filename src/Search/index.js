import * as client from "./client.js";
import * as bookClient from "../Books/client.js";
import Navigation from "../Navigation";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Result from "./result.js"
import UserResult from "./user-result.js"
import "../Account/profile.css"

function Search() {
    const { term } = useParams();
    const [results, setResults] = useState(null);
    const [userResults, setUserResults] = useState([]);
    const navigate = useNavigate();
    const getResults = async (t) => {
      const res = await client.searchBooks(t);
      setResults(res);
    }
    const getUserResults = async (keyword) => {
      const res = await bookClient.findBooksByTitle(keyword)
      setUserResults(res);
    }

     useEffect(() => {
        if (!results || !userResults) {
          getResults(term);
          getUserResults(term);
        }
     }, [term]);

     const contents = (key, name, title) => {
      let transformName = name;
      if (name instanceof String || typeof(name) === 'string') {
        // do nothing
      } else {
          if (Array.isArray(name) && name.length > 0) {
            transformName = name[0]
          }
      }
        if (key != "undefined") {
          return <Result resultInfoKey={key} resultAuthorName={transformName} resultTitle={title}/>
        }
     }

    return (
      <div className="container-fluid">
      <Navigation />
        <div className="row body" style={{backgroundColor: '#fcf3f2', minHeight: '90vh'}}>          
          <div className="d-flex align-items-center justify-content-center">
            <h2 style={{fontWeight: "normal"}} className="mt-4 mb-2">
              <i>results for "{term.replace(/[^A-Z0-9]+/ig, " ")}"</i>
            </h2>
          </div>
          <div className="row body" style={{backgroundColor: '#fcf3f2', minHeight: '90vh'}}>
            <div className="" style={{backgroundColor: '#fcf3f2'}}>

              <ul className="list-group list-group-flush mb-4 ms-4">
                {userResults && userResults.map((res)=> (
                  <li className="list-group-item mt-3">
                    <UserResult
                      userResId={res._id}
                      userResTitle={res.title}
                      userResAuthor={res.author}
                      userResSynopsis={res.synopsis}
                    />
                  </li>
                ))}
                {results && results.map((res) => (
                  <li className="list-group-item mt-3">
                    {res.key && (
                      <div>
                        {contents(res.key, res["author_name"], res["title"])}
                      </div>
                    )}
                  </li>
                ))
                }
                </ul>
              </div>
            </div>
        </div>
      </div>
    )
}

export default Search;