import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TriageTicketPage() {
  const [userInput, setUserInput] = useState(""); // 🧠 renamed to match backend
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyDraft, setReplyDraft] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInput.trim()) {
      setError("Please describe your issue before submitting.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    setReplyDraft("");

    try {
      const res = await fetch("http://localhost:5001/call-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput }), // ✅ sending correct field name
      });

      const data = await res.json();

      if (data.success === false && data.response?.replyDraft) {
        // ✅ Display only the replyDraft
        setReplyDraft(data.response.replyDraft);
      } else {
        setError(data.message || "Unexpected response from the server.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8 transition-all duration-300">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          🧠 Triage Agent - Raise a Ticket
        </h1>

        {/* If backend replied, show replyDraft instead of form */}
        {replyDraft ? (
          <div className="text-center">
            <p className="text-green-700 text-lg font-medium bg-green-50 border border-green-200 rounded-2xl p-4 shadow-sm mb-6">
              💬 {replyDraft}
            </p>

            <button
              onClick={() => navigate("/tickets")}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300"
            >
              🎟️ View Tickets
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="userInput"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Describe your issue
              </label>
              <textarea
                id="userInput"
                rows="4"
                className="w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Type your issue here..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 rounded-md p-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 
                ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
            >
              {isSubmitting ? "Submitting..." : "Raise Ticket"}
            </button>
          </form>
        )}

        {/* Navigation buttons (hidden when reply is visible) */}
        {!replyDraft && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/tickets")}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300"
            >
              🎟️ Show Tickets Raised
            </button>

            <button
              onClick={() => navigate("/assistants")}
              className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-300"
            >
              🧍 Show Human Assistants
            </button>
          </div>
        )}
      </div>
    </div>
  );
}