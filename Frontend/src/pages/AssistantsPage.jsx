import React, { useEffect, useState } from "react";

const AssistantsPage = () => {
  const [assistants, setAssistants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAssistants = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:5000/api/assistant/get");
      const data = await res.json();

      if (data.success) {
        setAssistants(data.assistants);
      } else {
        setError("Failed to fetch assistants");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching assistants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssistants();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-6">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        🧑‍💼 Human Assistants Dashboard
      </h1>

      {loading && <p className="text-center text-blue-600 text-lg">Loading...</p>}
      {error && <p className="text-center text-red-500 text-lg">{error}</p>}

      {!loading && !error && assistants.length === 0 && (
        <p className="text-center text-gray-500 text-lg">
          No assistants found.
        </p>
      )}

      {/* Assistants Grid */}
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
        {assistants.map((assistant) => (
          <div
            key={assistant._id}
            className="bg-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden border border-gray-100 hover:-translate-y-1"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 flex justify-between items-center text-white">
              <h2 className="text-lg font-semibold truncate">
                {assistant.name}
              </h2>
              <span className="bg-white/20 text-sm font-medium px-3 py-1 rounded-full">
                🎟 {assistant.assignedTickets?.length || 0}
              </span>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col items-center">
              {/* Avatar */}
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-md">
                {assistant.name?.[0]?.toUpperCase() || "?"}
              </div>

              {/* Info */}
              <div className="text-center">
                <p className="text-gray-700 font-medium mb-1">
                  {assistant.email}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Department:{" "}
                  <span className="font-semibold text-indigo-600">
                    {assistant.department || "N/A"}
                  </span>
                </p>

                {/* Tag */}
                <div className="mt-3 inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                  Active Assistant
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssistantsPage;
