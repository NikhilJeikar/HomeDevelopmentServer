import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Login } from "./Component/Login";

import { Display } from "./Component/Drive";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/drive" element={<Display />}/>
    </Routes>
  );
}

export default App;
