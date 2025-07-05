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

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-primary border-b pb-3">All Contests</h2>

      {contests.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40">
          <span className="text-base-content/70 text-lg">No contests available.</span>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {contests.map(contest => {
            const status = getStatus(contest.startTime, contest.endTime);

            return (
              <div
                key={contest._id}
                className="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-shadow duration-200"
              >
                <div className="card-body">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="badge badge-primary badge-lg">
                      {contest.title[0]?.toUpperCase() || "C"}
                    </div>
                    <h3 className="card-title text-lg font-bold">{contest.title}</h3>
                    <span className={`badge ${
                      status === 'running' ? 'badge-success' :
                      status === 'upcoming' ? 'badge-warning' :
                      'badge-error'
                    }`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>

                  <p className="text-base-content/70 mb-2 line-clamp-2">{contest.description}</p>

                  <div className="flex flex-col gap-1 text-sm mb-2">
                    <span>
                      <strong className="text-base-content/80">Starts:</strong>{" "}
                      <span className="badge badge-outline badge-info">
                        {new Date(contest.startTime).toLocaleString()}
                      </span>
                    </span>
                    <span>
                      <strong className="text-base-content/80">Ends:</strong>{" "}
                      <span className="badge badge-outline badge-error">
                        {new Date(contest.endTime).toLocaleString()}
                      </span>
                    </span>
                  </div>

                  <div className="card-actions justify-end">
                    {status === "upcoming" ? (
                      <button className="btn btn-sm btn-disabled opacity-50 cursor-not-allowed">
                        Not Started
                      </button>
                    ) : (
                      <Link
                        to={`/contest/${contest._id}`}
                        className="btn btn-primary btn-sm"
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
