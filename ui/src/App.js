import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Login } from "./Component/Login";

import { Display } from "./Component/Drive";
import { PhotosView } from "./Component/Photos/PhotoView";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/drive" element={<Display />}/>
      <Route path="/photo" element={<PhotosView/>}/>
    </Routes>
  );
}

export default App;
