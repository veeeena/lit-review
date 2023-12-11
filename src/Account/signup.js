import "./signin.css"
import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import * as client from "./client";

function Signup() {
    const [error, setError] = useState("");
    const [credentials, setCredentials] = useState({
      username: "", password: "", firstName: "", lastName: "", role: ""});
    const navigate = useNavigate();
    const signup = async () => {
        if (credentials.firstName === ""
        || credentials.lastName === ""
        || credentials.username === ""
        || credentials.password === ""
        || credentials.role === "") {
            setError("please fill out all the fields to make your account.")
            return;
        }
        try {
            await client.signup(credentials);
            navigate("/profile");      
        } catch (err) {
            setError(`${err.response.data.message}. try again.`);
        }
    };
    const signin = async () => {
        navigate("/signin");
    }
    
    return (
        <div className="container-fluid">
            <div className="body row d-flex align-items-center justify-content-center"
                style={{backgroundColor: '#fcf3f2', height: '100vh'}}>
                <div className="col-6">
                    <h2 className="text-center" style={{fontWeight: "normal"}}> welcome to lit review </h2>
                    {error && <div className="alert p-2 mt-3" style={{backgroundColor: '#fc668e'}}><p className="ms-2 my-0 lh-sm">{error}</p></div>}
                        <div>
                            <input required type="text" className="form-control my-2" placeholder="first name" value={credentials.firstname} onChange={(e) => setCredentials({...credentials, firstName: e.target.value})}/>
                        </div>
                        <div>
                            <input required type="text" className="form-control my-2" placeholder="last name" value={credentials.lastName} onChange={(e) => setCredentials({...credentials, lastName: e.target.value})}/>
                        </div>
                        <div>
                            <input required type="text" className="form-control my-2" placeholder="username" value={credentials.username} onChange={(e) => setCredentials({...credentials, username: e.target.value})}/>
                        </div>
                        <div>
                            <input required type="password" className="form-control" placeholder="password" value={credentials.password} onChange={(e) => setCredentials({...credentials, password: e.target.value})}/>
                        </div>
                        <div className="input-group my-2">
                            <select required className="form-select"
                                onChange={(e) => setCredentials({ ...credentials,
                                    role: e.target.value })}
                            >
                                <option selected disabled value="">select your role</option>
                                <option value="READER">reader</option>
                                <option value="AUTHOR">author</option>
                            </select>
                        </div>
                        <div className="text-center">
                            <button className="btn mt-1 text-light" style={{backgroundColor: '#FFC8D3'}} onClick={signup}> sign up </button>
                        </div>
                    <div>
                        <p className="text-center mt-4 mb-1">
                            <i>already have an account?</i>
                        </p>
                        <div className="text-center">
                            <button className="btn text-light" onClick={signin} style={{backgroundColor: '#FFC8D3'}}> sign in </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Signup;