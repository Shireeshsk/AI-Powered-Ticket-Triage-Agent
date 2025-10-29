import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, User, AlertTriangle, MessageSquare, Eye } from "lucide-react";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getPriorityColor = (priority) => {
    switch (priority?.toUpperCase()) {
      case "P1":
        return "bg-red-100 text-red-700 border-red-300";
      case "P2":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "P3":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "P0":
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/ticket/get");
        const data = await res.json();

        if (!data.success) throw new Error("Failed to fetch tickets");

        setTickets(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 py-14 px-6">
      <div className="flex justify-between items-center max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          🎟️ Support Tickets
        </h1>
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md transition-all"
        >
          ⬅️ Back
        </button>
      </div>

      {loading ? (
        <p className="text-center text-blue-600 text-lg">Loading tickets...</p>
      ) : error ? (
        <p className="text-center text-red-500 text-lg">{error}</p>
      ) : tickets.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No tickets found.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="relative bg-white/70 backdrop-blur-md border border-gray-200 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group"
            >
              {/* Accent bar */}
              <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400" />

              {/* Card content */}
              <div className="p-6 pt-8 flex flex-col justify-between h-full">
                {/* Priority + Status */}
                <div className="flex justify-between items-center mb-4">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${getPriorityColor(
                      ticket.priority
                    )}`}
                  >
                    {ticket.priority?.toUpperCase() || "P0"} Priority
                  </span>
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                    {ticket.status?.toUpperCase()}
                  </span>
                </div>

                {/* Issue */}
                <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                  {ticket.issue}
                </h2>

                {/* Assignee info */}
                <div className="flex items-center text-gray-600 text-sm mb-3">
                  <User className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="truncate">
                    Assigned To:{" "}
                    <span className="font-medium text-indigo-600">
                      {ticket.assigneeReason?.split(" ")[2] || "Unknown"}
                    </span>
                  </span>
                </div>

                {/* Reason */}
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {ticket.assigneeReason}
                </p>

                {/* Reply Preview */}
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-sm text-gray-700 mb-4 line-clamp-3">
                  💬 {ticket.replyDraft}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {new Date(ticket.createdAt).toLocaleString()}
                  </div>
                  <button className="flex items-center gap-1 bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-all">
                    <Eye className="w-4 h-4" /> View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
