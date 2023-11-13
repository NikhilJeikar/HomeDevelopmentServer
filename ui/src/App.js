import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Login } from "./Component/Login";

import { Home } from "./Component/Home";
import { Display } from "./Component/DisplayView";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/*" element={<Display/>}>
        <Route  path="home" element={<Home/>}/>
      </Route>
    </Routes>
  );
}

export default App;
