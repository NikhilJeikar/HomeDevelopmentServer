import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Login } from "./Component/Login";
import { DisplayView } from "./Component/DisplayView/DisplayView";
import { Home } from "./Component/Home";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/*" element={<DisplayView/>}>
        <Route  path="home" element={<Home/>}/>
      </Route>
    </Routes>
  );
}

export default App;
