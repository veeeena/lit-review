import * as client from "./client.js";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Result(props) {
    const { resultInfoKey, resultAuthorName, resultTitle } = props;
    const [result, setResult] = useState(null)  
    const getResult = async (k) => {
        try {
            const res = await client.getBookInfo(k);
            setResult(res);      
        } catch (err) {
            setResult(null);
        }
    }
     useEffect(() => {
        if (!result) {
          getResult(resultInfoKey);
        }
     }, []);

    const standardizeDescription = (d) => {
        if (d instanceof String || typeof(d) === 'string') {
            return d;
        } else {
            return d.value;
        }
    }

    const getRoute = (url) => {
        const newRoute = url.replace(/\//g, '');
        return newRoute;
    }

    return (
        <div className="">
            <Link
                to={`/books/${getRoute(resultInfoKey)}`}
                style={{color: '#FFC8D3', textDecoration: 'none'}}
            >                            
                <h5 className="mt-2" style={{fontWeight: "normal"}}> {resultTitle}</h5>
            </Link>
            <p> <i> by {resultAuthorName} </i></p>
            <div className="mb-2">
                {result && result.description && (
                   <div>
                        {standardizeDescription(result["description"])}
                    </div>
                 )}
            </div>
        </div>
    );
}

export default Result;