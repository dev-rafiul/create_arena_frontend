import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const MyProfile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [userData, setUserData] = useState({
    displayName: "",
    email: "",
    photoURL: "",
    phone: "",
    bio: "",
  });

  const [stats, setStats] = useState({
    participated: 0,
    won: 0,
    createdContests: 0,
  });

  const [contests, setContests] = useState([]);
  const [wins, setWins] = useState([]);

  /* ================= FETCH ALL DATA ================= */
  useEffect(() => {
    if (!user?.email) return;

    const fetchAllData = async () => {
      try {
        setLoading(true);

        // Fetch profile
        const profileRes = await axiosSecure.get(`/users/${user.email}`);
        setUserData({
          displayName: profileRes.data.displayName || "",
          email: profileRes.data.email || "",
          photoURL: profileRes.data.photoURL || "",
          phone: profileRes.data.phone || "",
          bio: profileRes.data.bio || "",
        });

        // Fetch stats
        const statsRes = await axiosSecure.get(`/users/${user.email}/stats`);
        setStats(statsRes.data || stats);

        // Fetch participated contests
        const contestsRes = await axiosSecure.get(`/my-participated-contests/${user.email}`);
        setContests(contestsRes.data || []);

        // Fetch winning contests
        const winsRes = await axiosSecure.get(`/my-winning-contests/${user.email}`);
        setWins(winsRes.data || []);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        Swal.fire("Error", "Failed to load dashboard", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [user?.email, axiosSecure]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUserData((prev) => ({ ...prev, photoURL: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  /* ================= UPDATE PROFILE ================= */
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await axiosSecure.patch(`/users/email/${user.email}`, {
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        phone: userData.phone,
        bio: userData.bio,
      });

      Swal.fire("Success!", "Profile updated successfully", "success");
      setEditing(false);
    } catch {
      Swal.fire("Error!", "Profile update failed", "error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  const winRate =
    stats.participated > 0
      ? ((stats.won / stats.participated) * 100).toFixed(0)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* ================= HEADER ================= */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            My Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your contests, payments, achievements and profile
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* ================= STATS CARD ================= */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
            <h3 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-800">
              📊
              <span className="text-sm font-normal text-gray-600">Statistics</span>
            </h3>
            
            <div className="space-y-4 mb-8">
              <StatCard 
                icon="🎯" 
                label="Contests Joined" 
                value={stats.participated}
                color="blue"
              />
              <StatCard 
                icon="🏆" 
                label="Contests Won" 
                value={stats.won}
                color="yellow"
              />
              <StatCard 
                icon="🎨" 
                label="Contests Created" 
                value={stats.createdContests}
                color="purple"
              />
            </div>

            <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl text-white text-center shadow-2xl">
              <p className="text-5xl font-black">{winRate}%</p>
              <p className="text-lg font-semibold opacity-90 mt-1">Win Rate</p>
            </div>
          </div>

          {/* ================= PROFILE CARD ================= */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
            <div className="flex justify-between items-start mb-8">
              <h3 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                👤 Profile
              </h3>
              <div className="flex gap-2">
                <input
                  type="file"
                  onChange={handlePhotoChange}
                  className="file-input file-input-bordered file-input-xs"
                  accept="image/*"
                  disabled={!editing}
                />
                <button
                  onClick={() => setEditing(!editing)}
                  className="btn btn-outline btn-sm"
                  disabled={updating}
                >
                  {editing ? "Cancel" : "Edit"}
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img
                    src={userData.photoURL || "/default-avatar.png"}
                    className="w-36 h-36 rounded-3xl object-cover ring-8 ring-blue-200/50 shadow-2xl"
                    alt="profile"
                  />
                  {editing && (
                    <div className="absolute -bottom-2 -right-2 bg-green-500 p-2 rounded-2xl shadow-lg border-4 border-white">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <Input 
                label="Full Name" 
                name="displayName" 
                value={userData.displayName}
                onChange={handleChange}
                disabled={!editing}
              />
              
              <Input 
                label="Email" 
                value={userData.email} 
                disabled 
              />
              
              <Input 
                label="Phone" 
                name="phone" 
                value={userData.phone}
                onChange={handleChange}
                disabled={!editing}
              />
              
              <Textarea 
                label="Bio" 
                name="bio" 
                value={userData.bio}
                onChange={handleChange}
                disabled={!editing}
              />

              {editing && (
                <button className="btn btn-primary w-full btn-lg shadow-xl" disabled={updating}>
                  {updating ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Updating...
                    </>
                  ) : (
                    "💾 Save Changes"
                  )}
                </button>
              )}
            </form>
          </div>
        </div>

        {/* ================= CONTESTS SECTION ================= */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Participated Contests */}
          <ContestSection 
            title="📋 Participated Contests" 
            count={contests.length}
            items={contests}
            emptyText="No contests joined yet. Join some contests! 🎯"
          />

          {/* Winning Contests */}
          <ContestSection 
            title="🏆 Winning Contests" 
            count={wins.length}
            items={wins}
            emptyText="No wins yet 🥲 Keep participating to win big!"
            isWin={true}
          />
        </div>
      </div>
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */
const StatCard = ({ icon, label, value, color }) => {
  const colors = {
    blue: "from-blue-400 to-blue-600",
    yellow: "from-yellow-400 to-orange-500",
    purple: "from-purple-500 to-pink-600"
  };

  return (
    <div className={`p-6 rounded-2xl shadow-lg border border-opacity-20 bg-gradient-to-r ${colors[color]} bg-opacity-10 backdrop-blur-sm hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl ${colors[color]} bg-opacity-20 flex items-center justify-center shadow-lg`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div>
          <p className="text-sm text-gray-600 font-medium">{label}</p>
          <p className="text-3xl font-black text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

const ContestSection = ({ title, count, items, emptyText, isWin = false }) => (
  <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800">
      {isWin ? "🏆" : "📋"} {title} 
      <span className="text-lg font-normal text-gray-600">({count})</span>
    </h3>
    
    {items.length === 0 ? (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-3xl flex items-center justify-center">
          {isWin ? "🥲" : "🎯"}
        </div>
        <p className="text-gray-500 text-lg">{emptyText}</p>
      </div>
    ) : (
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {items.map((item) => (
          <ContestCard key={item._id} contest={item} isWin={isWin} />
        ))}
      </div>
    )}
  </div>
);

const ContestCard = ({ contest, isWin }) => (
  <div className={`p-6 rounded-2xl shadow-lg border-l-4 transition-all hover:shadow-xl ${
    isWin 
      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-500' 
      : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-500'
  }`}>
    <div className="flex items-start gap-4">
      <img 
        src={contest.contestDetails?.image || contest.contestImage || '/default-contest.png'} 
        alt={contest.contestName}
        className="w-20 h-20 rounded-2xl object-cover flex-shrink-0 shadow-md"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-xl text-gray-800 mb-2 line-clamp-2">
          {contest.contestDetails?.name || contest.contestName}
        </h4>
        <div className="space-y-1 text-sm">
          <p className="text-gray-600">
            💰 Entry: ${contest.price || contest.amount}
          </p>
          <p className="text-green-600 font-semibold">
            ✅ {new Date(contest.createdAt).toLocaleDateString()}
          </p>
          {contest.trackingId && (
            <p className="text-xs text-gray-500">
              🆔 {contest.trackingId}
            </p>
          )}
          {contest.contestWinnerDeclared && (
            <span className="inline-block px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full font-semibold">
              👑 Winner Declared
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="form-control w-full">
    <label className="label">
      <span className="label-text font-semibold">{label}</span>
    </label>
    <input className="input input-bordered input-lg w-full" {...props} />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="form-control w-full">
    <label className="label">
      <span className="label-text font-semibold">{label}</span>
    </label>
    <textarea className="textarea textarea-bordered textarea-lg w-full" rows={3} {...props} />
  </div>
);

export default MyProfile;
