import Landing from "./Landing";
import Signin from "./Account/signin.js";
import Signup from "./Account/signup.js";
import Account from "./Account";
import Profile from "./Account/profile.js";
import Book from "./Books/book.js"
import Search from "./Search"
import { BrowserRouter } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/account" element={<Account />} />
          <Route path="/profile" element={<Profile />} /> {/* current user's profile */}
          <Route path="/profile/:id" element={<Profile />} /> {/* another profile */}
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="books" element={<Book />} />
          <Route path="books/:id" element={<Book />} />
          <Route path="/search/:term" element={<Search />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;