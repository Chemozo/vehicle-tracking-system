import "./App.css";
import { Routes, Route } from "react-router-dom";
import { MapPage } from "./app/pages/Map";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MapPage />} />
    </Routes>
  );
};

export default App;
