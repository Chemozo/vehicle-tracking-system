import "./App.css";
import { Routes, Route } from "react-router-dom";
import { MapPage } from "./app/pages/Map";
import { LoginPage } from "./app/pages/LoginPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/map" element={<MapPage />} />
    </Routes>
  );
};

export default App;
