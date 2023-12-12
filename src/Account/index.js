import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as client from "./client";
import Navigation from "../Navigation";

function Account() {
    const [account, setAccount] = useState(null);
    const navigate = useNavigate();
    const fetchAccount = async () => {
      const acc = await client.account();
      setAccount(acc);
    };
    const save = async () => {
      await client.updateUser(account);
      console.log(account);
    };
    const signin = async () => {
        navigate("/signin");
    }

    const signup = async () => {
        navigate("/signup");
    }

    const signout = async () => {
      await client.signout();
      navigate("/");
    };

    useEffect(() => {
        fetchAccount();
    }, []);

    const mywhat = () => {
        if (!account || !account.role) {
            return 'lit'
        }
        return account.role === 'READER' ? 'reviews' : 'books';
    }

    return (
        <div className="container-fluid">
            <Navigation />
            {account && (
                <div className="body row d-flex align-items-center justify-content-center" style={{backgroundColor: '#fcf3f2', height:'90vh'}}>
                    <div className="col-7">
                        <h4 className="mt-3 text-center" style={{fontWeight: "normal"}}>  {account.role.toLowerCase()} account </h4>
                        <div className="input-group my-2">
                            <span class="input-group-text">first name</span>
                            <input value={account.firstName}
                            type="text" className="form-control"
                            onChange={(e) => setAccount({ ...account,
                                firstName: e.target.value })}/>
                        </div>
                        <div className="input-group my-2">
                            <span class="input-group-text">last name</span>
                            <input value={account.lastName}
                            type="text" className="form-control"
                            onChange={(e) => setAccount({ ...account,
                                lastName: e.target.value })}/>
                        </div>
                        <div className="input-group my-2">
                            <span class="input-group-text">username</span>
                            <input value={account.username}
                            type="text" className="form-control"
                            onChange={(e) => setAccount({ ...account,
                                username: e.target.value })}/>
                        </div>
                        <div className="input-group my-2">
                            <span class="input-group-text">password</span>
                            <input value={account.password}
                            type="text" className="form-control"
                            onChange={(e) => setAccount({ ...account,
                                password: e.target.value })}/>
                        </div>
                        <div className="text-center">
                            <button className="btn mt-0 my-1" style={{color: '#FD88A0'}} onClick={save}> update </button>
                        </div>
                        <div className="text-center">
                            <button className="btn mt-5" style={{backgroundColor: '#FFC8D3', color: "white"}} onClick={signout}> sign out </button>
                        </div>
                    </div>
                </div>
            )}
            {!account && (
                <div className="row body" style={{backgroundColor: '#fcf3f2', minHeight: '90vh'}}>
                    {!account && (
                        <div className="mt-4">
                            <button className="btn mx-2 text-light" style={{backgroundColor: '#FFC8D3'}} onClick={signin}> sign in </button>
                            or
                            <button className="btn mx-2 text-light" style={{backgroundColor: '#FFC8D3'}} onClick={signup}> sign up </button>
                            to view this content
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Account;