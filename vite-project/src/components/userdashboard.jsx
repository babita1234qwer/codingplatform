import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosclient';
import { NavLink } from 'react-router-dom';

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [contests, setContests] = useState([]);
  const [totalProblems, setTotalProblems] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const solvedRes = await axiosClient.get('/problem/problemsolvedbyuser');
        setSolvedProblems(solvedRes.data || []);
        const contestsRes = await axiosClient.get('/problem/usercontests');
        setContests(contestsRes.data || []);
        const allProblemsRes = await axiosClient.get('/problem/getallproblem');
        setTotalProblems(allProblemsRes.data?.length || 0);
      } catch (err) {
        // handle error if needed
      }
      setLoading(false);
    };
    fetchUserStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-10">
      <div className="max-w-4xl mx-auto bg-base-300 text-neutral-content shadow-xl rounded-2xl p-10 border border-base-100">
        {/* Header */}
        <div className="flex items-center gap-6 mb-10">
          <div className="avatar placeholder">
            <div className="bg-primary text-neutral-content rounded-full w-20 h-20 flex items-center justify-center text-4xl">
              <span>{user?.firstName?.[0]?.toUpperCase() || "U"}</span>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-primary">{user?.firstName}</h2>
            <div className="text-base-content/70 text-sm">{user?.emailid}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-base-100 rounded-xl shadow-md p-6 text-center">
            <div className="text-lg font-semibold mb-2 text-success">
              ✅ Problems Solved
            </div>
            <div className="text-3xl font-bold">
              {solvedProblems.length}
              <span className="text-base-content/60 text-lg font-normal"> / {totalProblems}</span>
            </div>
          </div>

          <div className="bg-base-100 rounded-xl shadow-md p-6 text-center">
            <div className="text-lg font-semibold mb-2 text-info">
              🏆 Contests Participated
            </div>
            <div className="text-3xl font-bold">{contests.length}</div>
          </div>
        </div>

        {/* Recently Solved */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-primary mb-2">Recently Solved Problems</h3>
          {solvedProblems.length === 0 ? (
            <p className="text-base-content/60 italic">No problems solved yet.</p>
          ) : (
            <ul className="space-y-2">
              {solvedProblems.slice(0, 5).map((prob) => (
                <li key={prob._id}>
                  <NavLink
                    to={`/problem/${prob._id}`}
                    className="hover:underline text-primary font-medium"
                  >
                    {prob.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Contests */}
        <div>
          <h3 className="text-xl font-bold text-info mb-2">Recent Contests</h3>
          {contests.length === 0 ? (
            <p className="text-base-content/60 italic">No contests participated yet.</p>
          ) : (
            <ul className="space-y-2">
              {contests.slice(0, 5).map((contest) => (
                <li key={contest._id}>
                  <NavLink
                    to={`/contest/${contest._id}/leaderboard`}
                    className="hover:underline text-info font-medium"
                  >
                    {contest.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
