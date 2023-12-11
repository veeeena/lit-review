import * as client from "../Account/client.js"
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

function Navigation() {
    const [account, setAccount] = useState(null);
    const [search, setSearch] = useState(null);
    const fetchAccount = async () => {
      const acc = await client.account();
      setAccount(acc);
    };
    useEffect(() => {
        fetchAccount();
    }, []);
    const navigate = useNavigate();

    const searchFor = async () => {
        if (search) {
            const searchTerms = search.replace(/[^A-Z0-9]+/ig, "+");
            navigate(`/search/${searchTerms}`);   
            navigate(0); 
        }
    }

    const mywhat = () => {
        if (!account || !account.role) {
            return 'my lit'
        }
        return account.role === 'READER' ? 'my reviews' : 'my books';
    }
    const active = (link) => {
        if (link == "profile") {
            if (pathname.indexOf('/', 7) !== -1) {
                return "#FCE8EA"
            }
        }

        if (pathname.includes(link)) {
           return "#FFFFFF"
        } else {
            return "#FCE8EA"
        }
    }
    const links = ["profile", "account"] 
    const noAccLinks =
       ["signin", "signup"]
    const linksToNamesMap = {
        profile: mywhat(),
        account: "account",
        signin: "sign in",
        signup: "sign up"
    };
    const { pathname } = useLocation();
    return (
        <div className="row" style={{height: "100%"}}>
            <nav class="navbar navbar-expand-sm navbar-dark" style={{backgroundColor: '#FFC8D3'}}>
                <div class="container-fluid">
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <a class="navbar-brand pt-1" href="/">
                        <img src={require("../res/brand.png")} alt="" width="100" height="26"/>
                    </a>
                    <div class="collapse navbar-collapse" id="navigation">
                        <ul class="navbar-nav me-auto mb-auto">
                            {account && links.map((link) => ( 
                              <li class="nav-item">
                                    <a class="nav-link" style={{color: active(link)}} href={`/${link}`}>{linksToNamesMap[link]}</a>
                                </li>                                                            
                            ))}
                            {!account && noAccLinks.map((link) => ( 
                                <li className={`nav-item ${
                                    pathname.includes(link) && "active"
                                  }`}>
                                    <a class="nav-link" href={`/${link}`}>{linksToNamesMap[link]}</a>
                                </li>                                                            
                            ))}                        
                        </ul>
                        <div class="d-flex">
                            <input class="form-control pt-1 me-1" type="search" placeholder="search" onChange={(e) => setSearch(e.target.value)}/>
                            <button className="btn btn-sm my-1" style={{backgroundColor: 'transparent'}} onClick={searchFor}> 
                                <FaSearch className="mb-1 text-light" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navigation;