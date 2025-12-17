import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const MyContestParticipate = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    setLoading(true);
    axiosSecure
      .get(`/my-participated-contests/${user.email}`)
      .then(res => {
        // ✅ Only paid contests
        const paidContests = res.data.filter(
          c => c.paymentStatus === "paid"
        );

        // ✅ Sort by upcoming deadline
        const sortedByDeadline = paidContests.sort(
          (a, b) =>
            new Date(a.contestDetails?.deadline) -
            new Date(b.contestDetails?.deadline)
        );

        setContests(sortedByDeadline);
      })
      .catch(err => console.error("Error fetching contests:", err))
      .finally(() => setLoading(false));
  }, [user?.email, axiosSecure]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  if (!contests.length) {
    return (
      <p className="text-center py-10 text-gray-500">
        No paid contests found. Join some contests! 🎯
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold mb-4">
        📋 My Participated Contests ({contests.length})
      </h3>

      {contests.map(c => (
        <div
          key={c._id}
          className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg border-l-4 border-blue-500"
        >
          <div className="flex items-start gap-4">
            <img
              src={c.contestDetails?.image || "/default-contest.png"}
              alt={c.contestDetails?.name}
              className="w-20 h-20 rounded-xl object-cover"
            />

            <div className="flex-1">
              <h4 className="font-bold text-lg text-gray-800">
                {c.contestDetails?.name}
              </h4>

              <p className="text-sm text-gray-600 mt-1">
                Entry Fee: ৳{c.amount}
              </p>

              <p className="text-sm text-gray-600">
                📅 Deadline:{" "}
                {new Date(
                  c.contestDetails?.deadline
                ).toLocaleDateString()}
              </p>

              {/* ✅ Payment Status */}
              <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-semibold">
                ✅ Paid
              </span>

              {c.trackingId && (
                <p className="text-xs text-gray-500 mt-2">
                  Tracking ID: {c.trackingId}
                </p>
              )}

              {c.contestWinnerDeclared && (
                <span className="inline-block mt-2 ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                  🏆 Winner Declared
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyContestParticipate;
