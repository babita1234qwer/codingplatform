import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../utils/axiosclient';

const ContestDetail = () => {
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await axiosClient.get(`/problem/contestbyid/${id}`);
        setContest(res.data);
        calculateTimeLeft(res.data.endTime);
      } catch (err) {
        console.error("Error fetching contest details:", err);
      }
    };

    fetchContest();
  }, [id]);

  const calculateTimeLeft = (endTime) => {
    const interval = setInterval(() => {
      const diff = new Date(endTime) - new Date();
      if (diff <= 0) {
        setTimeLeft("Contest ended");
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${hours > 0 ? hours + "h " : ""}${mins}m ${secs}s`);
      }
    }, 1000);
  };

  if (!contest) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] px-6 py-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 w-full max-w-6xl mx-auto">
      {/* Contest Info */}
      <div className="bg-[#262626] shadow-xl rounded-2xl border border-[#333] p-4 sm:p-6 mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
          <div className="w-12 h-12 flex items-center justify-center text-xl font-bold rounded-full bg-gradient-to-br from-purple-700 to-pink-600 text-white">
            {contest.title[0]?.toUpperCase() || "C"}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-sky-400">{contest.title}</h2>
            <div className="flex gap-2 mt-1 flex-wrap text-xs sm:text-sm">
              <span className="bg-[#322f47] text-violet-200 px-3 py-1 rounded-md">
                Starts: {new Date(contest.startTime).toLocaleString()}
              </span>
              <span className="bg-[#322f47] text-violet-200 px-3 py-1 rounded-md">
                Ends: {new Date(contest.endTime).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-4">{contest.description}</p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2">
          <span className="font-medium text-gray-400">Status:</span>
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
            timeLeft === "Contest ended"
              ? "bg-red-600 text-white"
              : "bg-green-500 text-white"
          }`}>
            {timeLeft || "Calculating..."}
          </span>
        </div>

        {/* Leaderboard Button */}
        <div className="mt-6">
          <Link
            to={`/contest/${contest._id}/leaderboard`}
            className="inline-block text-sm font-semibold border border-sky-400 text-sky-400 px-4 py-2 rounded-lg hover:bg-sky-400 hover:text-black transition"
          >
            View Leaderboard
          </Link>
        </div>
      </div>

      {/* Problems Table */}
      <div className="bg-[#262626] shadow-lg rounded-2xl border border-[#333] p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold mb-4 text-white">Problems in this Contest</h3>
        <div className="overflow-x-auto">
          <table className="table w-full min-w-[600px]">
            <thead className="bg-gradient-to-r from-[#2d2d2d] to-[#202020] text-gray-200 text-sm">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {contest.problems.map((problem, idx) => (
                <tr key={problem._id} className="hover:bg-[#2e2e2e] transition">
                  <td>{idx + 1}</td>
                  <td>
                    <Link
                      to={`/problem/${problem._id}`}
                      className="text-white font-medium hover:text-sky-400"
                    >
                      {problem.title}
                    </Link>
                  </td>
                  <td>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      problem.difficulty === "easy"
                        ? "bg-green-500/20 text-green-300 border border-green-500"
                        : problem.difficulty === "medium"
                          ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500"
                          : "bg-red-500/20 text-red-300 border border-red-500"
                    }`}>
                      {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                    </span>
                  </td>
                  <td>
                    {timeLeft === "Contest ended" ? (
                      <button
                        className="text-gray-500 px-4 py-1 text-sm font-medium border border-gray-600 rounded-md cursor-not-allowed opacity-60"
                        disabled
                      >
                        Participation Closed
                      </button>
                    ) : (
                      <Link
                        to={`/contest/${contest._id}/problem/${problem._id}`}
                        className="text-sm font-semibold border border-sky-400 text-sky-400 px-4 py-1 rounded-md hover:bg-sky-400 hover:text-black transition"
                      >
                        Solve Now
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContestDetail;
  