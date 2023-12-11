import "./signin.css"
import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import * as client from "./client";

function Signin() {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const signin = async () => {
        if (credentials.username === ""
        || credentials.password === "") {
            setError("please fill out all the fields to sign in.")
            return;
        }
        try {
            await client.signin(credentials);
            navigate("/profile"); 
        } catch (err) {
            setError(`${err.response.data.message}. try again.`);
        }
    };

    const signup = async () => {
        navigate("/signup");
    }

    return (
        <div className="container-fluid">
            <div className="body row d-flex align-items-center justify-content-center"
                style={{backgroundColor: '#fcf3f2', height: '100vh'}}>
                <div className="col-6">
                    <h2 className="text-center" style={{fontWeight: "normal"}}>welcome back!</h2>
                    {error && <div className="alert p-2 mt-3" style={{backgroundColor: '#fc668e'}}><p className="ms-2 my-0 lh-sm">{error}</p></div>}
                    <div>
                        <input type="text" className="form-control my-2" placeholder="username" value={credentials.username} onChange={(e) => setCredentials({...credentials, username: e.target.value})}/>
                    </div>
                    <div>
                        <input type="password" className="form-control" placeholder="password" value={credentials.password} onChange={(e) => setCredentials({...credentials, password: e.target.value})}/>
                    </div>
                    <div className="text-center">
                        <button className="btn mt-2 text-light" style={{backgroundColor: '#FFC8D3'}} onClick={signin}> sign in </button>
                    </div>
                    <div>
                        <p className="text-center mt-4 mb-1">
                            new to reviewing?
                        </p>
                        <div className="text-center">
                            <button className="btn text-light" style={{backgroundColor: '#FFC8D3'}} onClick={signup}> sign up </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signin;