import React from "react";
import WouldYouRather from "./components/WouldYouRather";
import "@radix-ui/themes/styles.css";
import WouldYouRatherLanding from "./components/MainWYRPage";
const App: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <WouldYouRatherLanding></WouldYouRatherLanding>
    </div>
  );
};

export default App;
