import React from "react";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";


const ContestSection = () => {

   const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["popularContests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/contests/approved");
      return res.data;
    },
  });

  

  const popularContests = [...contests]
    .sort((a, b) => (b.participantsCount || 0) - (a.participantsCount || 0))
    .slice(0, 5);

  const handleDetails = (contestId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    // ✅ ONLY navigate - NO increment
    navigate(`/contests/${contestId}`);
    
  };


  return (
    <section className="py-20 bg-[#ffffff] from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6">
    
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-secondary mb-3">
            Popular Contests
          </h2>
          <p className="text-gray-600">
            Most participated contests you don't want to miss
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularContests.map((contest) => (
            <div
              key={contest._id}
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
            >
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

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {contest.name}
                </h3>

                <p className="text-gray-600 text-sm mb-4">
                  {contest.description
                    ? contest.description.slice(0, 90) + "..."
                    : "No description available."}
                </p>

                <div className="mt-auto">


<button
    onClick={() => handleDetails(contest._id)}
    className="w-full bg-secondary text-white py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
  >
    "View Details →"
  </button>



                  {/* <button
                    onClick={() => handleDetails(contest._id)}
                    disabled={incrementParticipantMutation.isPending}
                    className="w-full bg-secondary text-white py-3 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {incrementParticipantMutation.isPending ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Joining...
                      </>
                    ) : (
                      "View Details →"
                    )}
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/all_contests")}
            className="px-8 py-4 bg-white border-2 border-indigo-200 text-indigo-400 font-bold rounded-2xl hover:bg-secondary hover:text-white transition-all duration-300 shadow-lg"
          >
            Show All Contests →
          </button>
        </div>
      </div>
    </section>
  );
};
export default ContestSection;
