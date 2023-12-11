import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Reviews from "./reviews.js";
import MyBooks from "./books.js";
import * as client from "./client";
import Navigation from "../Navigation";
import "./profile.css"

function Profile() {
    const { id } = useParams();
    const [account, setAccount] = useState(null);
    const [current, setCurrent] = useState(null);
    const navigate = useNavigate();
    const fetchAccount = async () => {
      const acc = await client.account();
      setAccount(acc);
    };
    const findUserById = async (id) => {
      const user = await client.findUserById(id);
      const curr = await client.account();
      setAccount(user);
      setCurrent(curr);
      if (user && curr && user._id == curr._id) {
        navigate("/profile", { replace: true })
      }
    };
    useEffect(() => {
      if (!account || !account._id || !current || !current._id) {
        if (id) {
            findUserById(id);
          } else {
            fetchAccount();
          }
      }
    }, []);

    console.log(account, current);

    const signin = async () => {
        navigate("/signin");
    }
    const signup = async () => {
        navigate("/signup");
    }

    const contents = (role) => {
        console.log(role);
        if (role === 'READER') {
            return <Reviews curr={current} account={account} id={id}/>
        } else if (role === 'AUTHOR') {
            return <MyBooks curr={current} account={account} id={id}/>
        } else {
            return (
            <div className="mt-4">
                <button className="btn mx-2 text-light" style={{backgroundColor: '#FFC8D3'}} onClick={signin}> sign in </button>
                or
                <button className="btn mx-2 text-light" style={{backgroundColor: '#FFC8D3'}} onClick={signup}> sign up </button>
                to view this content
            </div>
            );
        }
    }
    
    return (
        <div className="container-fluid">
            <Navigation />
            <div className="row body" style={{backgroundColor: '#fcf3f2', minHeight: '90vh'}}>
                {account && (<div className="" style={{backgroundColor: '#fcf3f2'}}>
                    {contents(account.role)}
                </div>)}
                {!account && (
                    <div className="mt-4">
                        <button className="btn mx-2 text-light" style={{backgroundColor: '#FFC8D3'}} onClick={signin}> sign in </button>
                        or
                        <button className="btn mx-2 text-light" style={{backgroundColor: '#FFC8D3'}} onClick={signup}> sign up </button>
                        to view this content
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;