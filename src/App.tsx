import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PinGate } from "./components/PinGate";
import { FamilyHomePage } from "./pages/FamilyHomePage";
import { HomePage } from "./pages/HomePage";
import { OrganDetailPage } from "./pages/OrganDetailPage";
import { EventDetailPage } from "./pages/EventDetailPage";
import "./app.css";

export default function App() {
  return (
    <PinGate>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<FamilyHomePage />} />
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/organ/:organ" element={<OrganDetailPage />} />
          <Route path="/event/:eventId" element={<EventDetailPage />} />
        </Routes>
      </BrowserRouter>
    </PinGate>
  );
}
