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
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-200 to-base-100 py-10">
      <div className="max-w-3xl mx-auto bg-base-100 shadow-2xl rounded-3xl p-10 border border-base-300">
        <div className="flex items-center gap-6 mb-10">
          <div className="avatar placeholder">
            <div className="bg-gradient-to-br from-primary to-secondary text-neutral-content rounded-full w-20 h-20 flex items-center justify-center text-4xl shadow-lg">
              <span>{user?.firstName?.[0]?.toUpperCase() || "U"}</span>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-primary mb-1">{user?.firstName}</h2>
            <div className="text-base-content/70 text-lg">{user?.emailid}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="stat bg-gradient-to-br from-success/10 to-base-200 rounded-2xl shadow flex flex-col items-center py-6">
            <div className="stat-title text-lg font-semibold mb-2 flex items-center gap-2">
              <span role="img" aria-label="solved">✅</span> Problems Solved
            </div>
            <div className="stat-value text-success text-4xl font-bold">
              {solvedProblems.length}
              <span className="text-base-content/60 text-lg font-normal"> / {totalProblems}</span>
            </div>
          </div>
          <div className="stat bg-gradient-to-br from-info/10 to-base-200 rounded-2xl shadow flex flex-col items-center py-6">
            <div className="stat-title text-lg font-semibold mb-2 flex items-center gap-2">
              <span role="img" aria-label="contest">🏆</span> Contests Participated
            </div>
            <div className="stat-value text-info text-4xl font-bold">{contests.length}</div>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-xl font-bold mb-3 text-primary">Recently Solved Problems</h3>
          {solvedProblems.length === 0 ? (
            <div className="text-base-content/60 italic">No problems solved yet.</div>
          ) : (
            <ul className="list-disc list-inside space-y-2">
              {solvedProblems.slice(0, 5).map((prob) => (
                <li key={prob._id}>
                  <NavLink to={`/problem/${prob._id}`} className="text-primary hover:underline font-medium">
                    {prob.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold mb-3 text-info">Recent Contests</h3>
          {contests.length === 0 ? (
            <div className="text-base-content/60 italic">No contests participated yet.</div>
          ) : (
            <ul className="list-disc list-inside space-y-2">
              {contests.slice(0, 5).map((contest) => (
                <li key={contest._id}>
                  <NavLink to={`/contest/${contest._id}/leaderboard`} className="text-info hover:underline font-medium">
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