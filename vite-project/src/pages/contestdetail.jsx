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

  if (!contest) return (
    <div className="flex items-start min-h-[40vh] px-6 py-10">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );

  return (
    <div className="p-6 w-full max-w-5xl mx-auto">
      {/* Contest Info Card */}
      <div className="bg-base-100 shadow-lg rounded-xl border border-base-200 p-6 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="badge badge-primary badge-lg text-2xl px-4 py-3">
            {contest.title[0]?.toUpperCase() || "C"}
          </div>
          <div>
            <h2 className="text-3xl font-bold">{contest.title}</h2>
            <div className="flex gap-2 mt-2">
              <span className="badge badge-outline badge-info">
                Starts: {new Date(contest.startTime).toLocaleString()}
              </span>
              <span className="badge badge-outline badge-error">
                Ends: {new Date(contest.endTime).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <p className="mb-4 text-base-content/70">{contest.description}</p>

        <div className="flex items-center gap-4">
          <span className="font-semibold">Status:</span>
          <span className={`badge ${timeLeft === "Contest ended" ? "badge-error" : "badge-success"} text-lg px-4`}>
            {timeLeft || "Calculating..."}
          </span>
        </div>

        {/* Leaderboard Button */}
        <div className="mt-6">
          <Link
            to={`/contest/${contest._id}/leaderboard`}
            className="btn btn-outline btn-accent"
          >
            View Leaderboard
          </Link>
        </div>
      </div>

      {/* Problems Table */}
      <div className="bg-base-100 shadow rounded-xl border border-base-200 p-6">
        <h3 className="text-xl font-semibold mb-4">Problems in this Contest</h3>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="text-base-content/70">#</th>
                <th className="text-base-content/70">Title</th>
                <th className="text-base-content/70">Difficulty</th>
                <th className="text-base-content/70">Action</th>
              </tr>
            </thead>
            <tbody>
             {contest.problems.map((problem, idx) => (
  <tr key={problem._id} className="hover">
    <td>{idx + 1}</td>
    <td>
      <Link to={`/problem/${problem._id}`} className="text-primary font-semibold hover:underline">
        {problem.title}
      </Link>
    </td>
    <td>
      <span className={`badge ${problem.difficulty === "easy"
        ? "badge-success"
        : problem.difficulty === "medium"
          ? "badge-warning"
          : "badge-error"
        }`}>
        {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
      </span>
    </td>
    <td>
      {timeLeft === "Contest ended" ? (
        <button className="btn btn-outline btn-primary btn-sm btn-disabled opacity-50" disabled>
          Participation Closed
        </button>
      ) : (
        <Link 
          to={`/contest/${contest._id}/problem/${problem._id}`} 
          className="btn btn-outline btn-primary btn-sm"
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