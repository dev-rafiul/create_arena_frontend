import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const ContestSection = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  // 🔹 Fetch approved contests
  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["popularContests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/contests/approved");
      return res.data;
    },
  });

  // 🔹 Sort by highest participants count & take top 5
  const popularContests = [...contests]
    .sort(
      (a, b) => (b.participantsCount || 0) - (a.participantsCount || 0)
    )
    .slice(0, 5);

  // 🔹 Handle Details click
  const handleDetails = (id) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/contests/${id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-indigo-700 mb-3">
            🔥 Popular Contests
          </h2>
          <p className="text-gray-600">
            Most participated contests you don’t want to miss
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularContests.map((contest) => (
            <div
              key={contest._id}
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={contest.image}
                  alt={contest.name}
                  className="h-48 w-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-black/70 text-white text-xs font-bold px-3 py-1 rounded-full">
                  👥 {contest.participantsCount || 0} joined
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {contest.name}
                </h3>

                <p className="text-gray-600 text-sm mb-4">
                  {contest.description
                    ? contest.description.slice(0, 90) + "..."
                    : "No description available."}
                </p>

                {/* Action */}
                <div className="mt-auto">
                  <button
                    onClick={() => handleDetails(contest._id)}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show All */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/contests")}
            className="px-8 py-4 bg-white border-2 border-indigo-600 text-indigo-600 font-bold rounded-2xl hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-lg"
          >
            Show All Contests →
          </button>
        </div>
      </div>
    </section>
  );
};

export default ContestSection;
