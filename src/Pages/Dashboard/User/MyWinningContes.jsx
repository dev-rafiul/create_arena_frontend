import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const MyWinningContests = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [wins, setWins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    axiosSecure
      .get(`/my-winning-contests/${user.email}`)
      .then(res => setWins(res.data))
      .catch(err => console.error("Error fetching wins:", err))
      .finally(() => setLoading(false));
  }, [user?.email, axiosSecure]);

  if (loading) return <div className="flex justify-center py-10"><span className='loading loading-infinity loading-lg'></span></div>;
  if (!wins.length) return <p className="text-center py-10 text-gray-400">No wins yet 🥲<br/>Keep participating to win big! 🏆</p>;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold mb-4">🏆 My Winning Contests ({wins.length})</h3>
      {wins.map(w => (
        <div key={w._id} className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl shadow-lg border-l-4 border-yellow-500">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                🏆
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-lg text-gray-800 mb-2">{w.contestName}</h4>
              <p className="text-sm text-gray-600">Prize Money: ৳{w.price}</p>
              <p className="text-sm text-green-600 font-semibold">
                Won on: {new Date(w.createdAt).toLocaleDateString()}
              </p>
              {w.trackingId && (
                <p className="text-xs text-gray-500 mt-1">ID: {w.trackingId}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyWinningContests;

