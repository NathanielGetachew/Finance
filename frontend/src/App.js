import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./Components/users/Register";
import { Provider } from "react-redux";

import Login from "./Components/users/login";
import UserProfile from "./Components/users/userProfile";

function App() {
  return (
    
     <BrowserRouter>
     <Routes>
        <Route path="/register" element={<Register />}></Route>
      
        <Route path="/login" element={<Login />}></Route>
       
       <Route path="/user-profile" element={< UserProfile/>}></Route>
      </Routes>



   </BrowserRouter>
      
    
   
    
  );
}

export default App;
