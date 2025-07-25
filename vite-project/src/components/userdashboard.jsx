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
        console.error('Error fetching user dashboard data:', err);
      }
      setLoading(false);
    };
    fetchUserStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
        <span className="loading loading-spinner loading-lg text-[#ffa116]"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] py-10 px-4 text-[#e2e2e2]">
      <div className="max-w-4xl mx-auto bg-[#2c2c2c] shadow-xl rounded-2xl p-8 border border-[#3d3d3d]">
        {/* Header */}
        <div className="flex items-center gap-6 mb-10">
          <div className="avatar placeholder">
            <div className="bg-[#ffa116] text-black rounded-full w-20 h-20 flex items-center justify-center text-4xl font-bold">
              <span>{user?.firstName?.[0]?.toUpperCase() || 'U'}</span>
            </div>
          </div>
          <div>
           <h2 className="text-3xl font-bold text-[#eaeaea]">{user?.firstName}</h2>

            <div className="text-sm text-[#a6a6a6]">{user?.emailid}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-[#1e1e1e] rounded-xl shadow p-6 text-center border border-[#3d3d3d]">
            <div className="text-lg font-semibold mb-2 text-green-400">
              ✅ Problems Solved
            </div>
            <div className="text-3xl font-bold">
              {solvedProblems.length}
              <span className="text-[#a6a6a6] text-lg font-normal"> / {totalProblems}</span>
            </div>
          </div>

          <div className="bg-[#1e1e1e] rounded-xl shadow p-6 text-center border border-[#3d3d3d]">
            <div className="text-lg font-semibold mb-2 text-sky-400">
              🏆 Contests Participated
            </div>
            <div className="text-3xl font-bold">{contests.length}</div>
          </div>
        </div>

        {/* Recently Solved */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-[#ffa116] mb-2">Recently Solved Problems</h3>
          {solvedProblems.length === 0 ? (
            <p className="text-[#a6a6a6] italic">No problems solved yet.</p>
          ) : (
            <ul className="space-y-2">
              {solvedProblems.slice(0, 5).map((prob) => (
                <li key={prob._id}>
                  <NavLink
                    to={`/problem/${prob._id}`}
                    className="hover:underline text-[#ffa116] font-medium"
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
          <h3 className="text-xl font-bold text-sky-400 mb-2">Recent Contests</h3>
          {contests.length === 0 ? (
            <p className="text-[#a6a6a6] italic">No contests participated yet.</p>
          ) : (
            <ul className="space-y-2">
              {contests.slice(0, 5).map((contest) => (
                <li key={contest._id}>
                  <NavLink
                    to={`/contest/${contest._id}/leaderboard`}
                    className="hover:underline text-sky-400 font-medium"
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
