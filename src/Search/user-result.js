import { Link } from "react-router-dom";
import * as client from "../Account/client.js"
import { useState, useEffect } from "react";

function UserResult(props) {
    const { userResId, userResTitle, userResAuthor, userResSynopsis } = props;
    const [author, setAuthor] = useState(null);  
    const findAuthor = async (key) => {
        const a = await client.findUserById(key);
        setAuthor(a.username);
    }
    useEffect(() => {
        if (!author) {
          findAuthor(userResAuthor);
        }
     }, [author]);
    return (
        <div className="">
            <Link
                to={`/books/${userResId}`}
                style={{color: '#FFC8D3', textDecoration: 'none'}}
            >                            
                <h5 className="mt-2" style={{fontWeight: "normal"}}> {userResTitle}</h5>
            </Link>
            <Link to={`/profile/${userResAuthor}`}
                style={{color: '#FFC8D3', textDecoration: 'none'}}
            >
                <p> <i> by {author} </i></p>
            </Link>
            
            <div className="mb-2">
                {userResSynopsis && (
                   <div>
                      {userResSynopsis}
                    </div>
                 )}
            </div>
        </div>
    )
}

export default UserResult;