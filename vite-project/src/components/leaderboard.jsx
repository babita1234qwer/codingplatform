import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../utils/axiosclient';

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
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-6 border-b pb-2 text-primary">🏆 Contest Leaderboard</h2>
      {leaderboard.length === 0 ? (
        <p className="text-center text-base-content/70">No submissions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full border border-base-200">
            <thead>
              <tr className="bg-base-300 text-base-content font-bold">
                <th>#</th>
                <th>Participant</th>
                <th>Total Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={entry.userId}>
                  <td>{index + 1}</td>
                  <td>{entry.name}</td>
                  <td>{entry.totalScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;