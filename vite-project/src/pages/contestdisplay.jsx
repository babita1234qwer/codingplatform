import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../utils/axiosclient';

const ContestList = () => {
  const [contests, setContests] = useState([]);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await axiosClient.get('/problem/getallcontests');
        setContests(res.data);
      } catch (err) {
        console.error('Error fetching contests:', err);
      }
    };
    fetchContests();
  }, []);

  const getStatus = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'running';
    return 'ended';
  };

  const statusColor = {
    upcoming: 'bg-blue-600',
    running: 'bg-green-600',
    ended: 'bg-red-600',
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 py-8">
      <h2 className="text-3xl font-extrabold mb-8 text-[#ffa116] border-b border-[#333] pb-3 text-center">
        🚀 All Contests
      </h2>

      {contests.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40">
          <span className="text-[#e2e2e2] text-lg">No contests available.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {contests.map((contest) => {
            const status = getStatus(contest.startTime, contest.endTime);

            return (
              <div
                key={contest._id}
                className="bg-[#1e1e1e] rounded-2xl shadow-xl border border-[#333] hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[#4f46e5] text-white text-xl font-bold px-4 py-2 rounded-full shadow-sm">
                      {contest.title[0]?.toUpperCase() || 'C'}
                    </div>
                    <h3 className="text-xl font-semibold text-black bg-[#d4d4d4] px-3 py-1 rounded-md">
                      {contest.title}
                    </h3>
                    <span className={`${statusColor[status]} text-white px-3 py-1 rounded-full text-sm font-semibold shadow-sm`}>
                      {status.toUpperCase()}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-3 line-clamp-2">{contest.description}</p>

                  {/* Start and End Time */}
                  <div className="flex flex-col gap-1 text-sm text-gray-400">
                    <span>
                      <strong className="text-[#d4d4d4]">📅 Starts:</strong>{' '}
                      <span className="bg-[#333] text-white px-2 py-1 rounded-md">
                        {new Date(contest.startTime).toLocaleString()}
                      </span>
                    </span>
                    <span>
                      <strong className="text-[#d4d4d4]">⏰ Ends:</strong>{' '}
                      <span className="bg-[#333] text-white px-2 py-1 rounded-md">
                        {new Date(contest.endTime).toLocaleString()}
                      </span>
                    </span>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-end mt-5">
                    {status === 'upcoming' ? (
                      <button
                        className="bg-gray-500 text-white px-4 py-2 text-sm rounded-full opacity-60 cursor-not-allowed"
                        disabled
                      >
                        Not Started
                      </button>
                    ) : (
                      <Link
                        to={`/contest/${contest._id}`}
                        className="bg-blue-500 text-white font-semibold px-5 py-2 rounded-full hover:bg-blue-600 transition duration-200"
                      >
                        View Contest
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContestList;


