import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as client from "../Search/client.js"
import Navigation from "../Navigation";
import Result from "../Search/result.js"

function Publisher() {
    const { id } = useParams();
    const [books, setBooks] = useState(null);
    const findBooksByPublisher = async (id) => {
        if (id) {
            const res = await client.findBooksByPublisher(id);
            setBooks(res);
        }
    }
    useEffect(() => {
        if (!books) {
            findBooksByPublisher(id);
        }
    }, [books]);
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
                    <h2 style={{fontWeight: "normal"}} className="mt-4 mb-0 me-0">
                    <i>published by {id.replace(new RegExp("\\+","g"),' ').toLowerCase()}</i>
                    </h2>
                </div>
                <div className="" style={{backgroundColor: '#fcf3f2'}}>
                <ul className="list-group list-group-flush mb-4 pe-4 ms-4">
                {books && books.map((res)=> (
                  <li className="list-group-item mt-4">
                        {contents(res.key, res["author_name"], res["title"])}
                  </li>
                ))}
                </ul>
                </div>
            </div>
        </div>
    );
}

export default Publisher;