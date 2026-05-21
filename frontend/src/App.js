import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import ComingSoon from "@/pages/ComingSoon";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ComingSoon />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" theme="light" />
    </div>
  );
}

export default App;
