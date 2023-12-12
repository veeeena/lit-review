import "./index.css"
import Navigation from "../Navigation"
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import * as client from "../Account/client";
import Reader from "./reader.js"
import Author from "./author.js"

function Landing() {
    const [account, setAccount] = useState(null);
    const navigate = useNavigate();
    const fetchAccount = async () => {
        const acc = await client.account();
        setAccount(acc);
    };
    useEffect(() => {
        if (!account || !account._id) {
            fetchAccount();
        }
      }, []);
    const signin = async () => {
        navigate("/signin");
    }
    const signup = async () => {
        navigate("/signup");
    }
    const contents = (role) => {
        if (role === 'READER') {
            return <Reader curr={account}/>
        } else if (role === 'AUTHOR') {
            return <Author curr={account}/>
        }
    }
    return (
      <div className="">
        <div className="container-fluid"> <Navigation /> </div>
        {account && (<>
            <div className="body" style={{backgroundColor: '#fcf3f2'}}>
                {contents(account.role)}
            </div>
        </>)}
        {!account && (<>
        <div className="d-flex fill" style={{backgroundColor: '#FFC8D3'}}>
            <div id='bg' className="w-100 fill" style={{ backgroundImage: `url(/litreview4.png)`,
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundSize: '100vw',
                                            height: '95vh',
                                        }}>
            </div>
        </div>
        <div className="row w-100">
            <div className="d-flex align-items-center justify-content-center">
                        <h2 style={{fontWeight: "normal"}} className="mt-4 mb-0 me-0">
                            <i>a platform for readers and authors</i>
                        </h2>
            </div>
        </div>
        <div className="row w-100">
            <div className="col-6">
                <p className="ms-5 me-3 my-4" style={{textAlign: "justify"}}> 
                readers, immerse yourself in a community where readers share insights on their latest reads and timeless classics. whether you're in search of your next literary journey or eager to showcase your own work, lit review is the platform where words come to life. connect with fellow readers, explore a diverse collection of books, and empower authors to share their creations with an engaged community.  join us in celebrating the beauty of storytelling, where opinions flow freely, and every review adds to the dynamic landscape of our shared reading experience. be part of the conversation at lit review and let us know... <i>what do you think?</i>
                </p>
            </div>
            <div className="col-6">
                <p className="ms-3 me-5 my-4" style={{textAlign: "justify"}}> 
                authors, unlock the potential of lit review to elevate your books! showcase your creations to a passionate community of readers, receive valuable feedback, and build connections with your audience. engage in meaningful conversations, gain exposure, and let lit review be the platform where your stories find their voice. whether you're a seasoned author or a newcomer, our vibrant community is ready to embrace and celebrate your literary contributions. join us and connect with readers who are eager to discover and support your work.
                </p>
            </div>
        </div>
        <div className="row w-100">
        <div className="d-flex align-items-center justify-content-center mb-4">
                <button className="btn mx-2 text-light" style={{backgroundColor: '#FFC8D3'}} onClick={signin}> sign in </button>
                or
                <button className="btn mx-2 text-light" style={{backgroundColor: '#FFC8D3'}} onClick={signup}> sign up </button>
        </div>
        </div></>)}
      </div>
    )
}

export default Landing;