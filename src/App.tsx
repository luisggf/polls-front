import WouldYouRather from "./components/WouldYouRather";
import "@radix-ui/themes/styles.css";
import WouldYouRatherLanding from "./components/MainWYRPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Router>
        <Routes>
          {/* Define your routes here */}
          <Route path="/" element={<WouldYouRatherLanding />} />{" "}
          {/* Default route */}
          <Route path="/would-you-rather" element={<WouldYouRather />} />{" "}
          {/* New route for WouldYouRather */}
        </Routes>
      </Router>{" "}
    </div>
  );
}
