import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ContestDetails = () => {
  const { contestId } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const { data: contest = null, isLoading: contestLoading, isError: contestError } = useQuery({
    queryKey: ["contestDetails", contestId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/contests/${contestId}`);
      return res.data;
    },
    enabled: !!contestId
  });

  const { data: participants = [], isLoading: participantsLoading } = useQuery({
    queryKey: ["contestParticipants", contestId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/contests/${contestId}/participants`);
      return res.data;
    },
    enabled: !!contestId
  });

  
  const isUserJoined = participants.some(p => p.email === localStorage.getItem('email'));

  if (contestLoading || participantsLoading) {
    return (
      <div className="flex justify-center mt-20">
        <span className='loading loading-infinity loading-lg'></span>
      </div>
    );
  }

  if (contestError || !contest) {
    return <p className="text-center mt-20 text-red-500">Contest not found</p>;
  }

  const handleJoinContest = () => {
    navigate(`/payment/${contest._id}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <img
            src={contest.image}
            alt={contest.name}
            className="w-[250px] h-[220px] mx-auto rounded-lg border object-cover"
          />
        </div>

        <div>
          <span className="text-sm text-green-600 font-semibold uppercase">New Contest</span>
          <h2 className="text-3xl font-bold mt-2">{contest.name}</h2>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-yellow-500">★★★★★</span>
            <span className="text-sm text-gray-500">(4.5)</span>
          </div>

          <p className="text-3xl font-semibold text-green-600 mt-4">${contest.price}</p>
          <p className="text-gray-600 mt-4">{contest.description}</p>

          <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
            <p><strong>Type:</strong> {contest.type}</p>
            <p><strong>Prize:</strong> ${contest.prizeMoney}</p>
            <p><strong>Deadline:</strong> {contest.deadline}</p>
            <p><strong>Status:</strong> Open</p>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">👥</span>
              Participants ({participants.length})
            </h3>
            <div className="flex flex-wrap gap-3 mb-6">
              {participants.slice(0, 12).map((participant) => (
                <img
                  key={participant._id}
                  src={participant.photoURL || '/default-avatar.png'}
                  alt={participant.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-green-300 hover:border-green-500 transition-all cursor-pointer"
                  title={`${participant.name} - Joined`}
                />
              ))}
              {participants.length > 12 && (
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 border-2 border-dashed border-gray-400">
                  +{participants.length - 12}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleJoinContest}
            className="mt-6 w-full py-3 bg-amber-800 text-white rounded-lg font-semibold hover:bg-amber-900 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isUserJoined}
          >
            {isUserJoined ? 'Already Joined ✅' : 'Join Contest'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContestDetails;
