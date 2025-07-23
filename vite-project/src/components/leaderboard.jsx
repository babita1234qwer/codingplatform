import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../utils/axiosclient';

const trophyBorders = [
  'border-l-4 border-yellow-400',
  'border-l-4 border-gray-400',
  'border-l-4 border-orange-400'
];

const Leaderboard = () => {
  const { contestId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await axiosClient.get(`/leader/contest/${contestId}/leaderboard`);
        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [contestId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <span className="loading loading-spinner loading-lg text-white"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white px-4 py-10">
      <div className="max-w-4xl mx-auto bg-[#1a1a1a] border border-[#333] rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-white">🏆 Leaderboard</h2>

        {leaderboard.length === 0 ? (
          <p className="text-center text-gray-400">No submissions yet.</p>
        ) : (
          <div className="space-y-4">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.userId}
                className={`flex items-center justify-between px-5 py-4 rounded-xl bg-[#2b2b2b] ${
                  index < 3 ? trophyBorders[index] : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-lg font-bold w-6 text-center">
                    {index + 1}
                  </div>
                  <img
                    src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${entry.name}`}
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-white">
                      {entry.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      User ID: {entry.userId.slice(-4)}
                    </div>
                  </div>
                </div>
                <div className="font-mono text-xl text-green-400">
                  {entry.totalScore}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
