import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./views/user/Login/Login";

import Layout from "./layout/Layout"
import Home from "./Home";
import Register from "./views/user/Register/Register";
import CreateBook from "./views/book/Create/CreateBook";
import UpdateBook from "./views/book/Update/UpdateBook";


function App() {
  return (

      <BrowserRouter> 
        <Routes>
          <Route element={<Layout />} >
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
             <Route path="/create-book" element={<CreateBook />} />
             <Route path="/update-book/:id" element={<UpdateBook />} />
           </Route>
        </Routes>
      </BrowserRouter>
   
  );
}

export default App;