import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@styles/global.css";
import { Home, About, Start } from "@routes";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/start" element={<Start />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
