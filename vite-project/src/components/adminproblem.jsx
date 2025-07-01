import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../utils/axiosclient';

const AdminProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axiosClient.get('/problem/getallproblem');
        if (Array.isArray(res.data)) {
          setProblems(res.data);
        } else {
          console.error("Unexpected response format:", res.data);
          setProblems([]);
        }
      } catch (err) {
        console.error("Failed to fetch problems", err);
        setProblems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-primary">All Problems</h2>

      {loading ? (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : problems.length === 0 ? (
        <p className="text-center text-base-content/70">No problems found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Tags</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem, index) => (
                <tr key={problem._id}>
                  <td>{index + 1}</td>
                  <td>{problem.title}</td>
                  <td>
                    <span className={`badge ${
                      problem.difficulty === 'easy'
                        ? 'badge-success'
                        : problem.difficulty === 'medium'
                        ? 'badge-warning'
                        : 'badge-error'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td>
                    {Array.isArray(problem.tags)
                      ? problem.tags.join(', ')
                      : 'No tags'}
                  </td>
                  <td>
                    <Link
                      to={`/admin/update/${problem._id}`}
                      className="btn btn-outline btn-primary btn-sm"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProblemList;
