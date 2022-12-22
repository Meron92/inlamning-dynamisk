import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AdminPage from "./Pages/AdminPage";
import CapturedImage from "./Pages/CapturedImage";
import ImagesGallery from "./Pages/ImagesGallery";
import LoggedIn from "./Pages/LoggedIn";
import SignUp from "./Pages/SignUp";
import { ImagesProvider } from "./Components/ListContext";

function App() {
  return (
    <ImagesProvider>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<SignUp />} />
            <Route path="/loggedin" element={<LoggedIn />} />
            <Route path="/capturedimage" element={<CapturedImage />} />
            <Route path="/imagesgallery" element={<ImagesGallery />} />
            <Route path="/adminlogin" element={<AdminPage />} />
          </Routes>
        </Router>
      </div>
    </ImagesProvider>
  );
}

export default App;
