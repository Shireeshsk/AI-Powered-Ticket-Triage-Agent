import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TriageTicketPage from "./pages/TriageTicketPage";
import TicketsPage from "./pages/TicketsPage";
import AssistantsPage from "./pages/AssistantsPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TriageTicketPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/assistants" element={<AssistantsPage />} />
      </Routes>
    </Router>
  );
}
