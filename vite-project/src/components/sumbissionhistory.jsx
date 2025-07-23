import { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosclient';

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/problem/submittedproblems/${problemId}`);
        setSubmissions(response.data || []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch submission history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [problemId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-700 border-green-400';
      case 'wrong': return 'bg-red-100 text-red-700 border-red-400';
      case 'error': return 'bg-yellow-100 text-yellow-700 border-yellow-400';
      case 'pending': return 'bg-blue-100 text-blue-700 border-blue-400';
      default: return 'bg-gray-100 text-gray-700 border-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <span title="Accepted">✅</span>;
      case 'wrong': return <span title="Wrong Answer">❌</span>;
      case 'error': return <span title="Error">⚠️</span>;
      case 'pending': return <span title="Pending">⏳</span>;
      default: return <span title="Unknown">❔</span>;
    }
  };

  const formatMemory = (memory) => {
    if (memory < 1024) return `${memory} kB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg my-4">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#ffa116]">Submission History</h2>
      {submissions.length === 0 ? (
        <div className="alert alert-info shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>No submissions found for this problem</span>
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table w-full rounded-lg overflow-hidden shadow">
              <thead className="bg-[#232323] text-[#ffa116]">
                <tr>
                  <th>#</th>
                  <th>Language</th>
                  <th>Status</th>
                  <th>Runtime</th>
                  <th>Memory</th>
                  <th>Test Cases</th>
                  <th>Submitted</th>
                  <th>Code</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub, index) => (
                  <tr key={sub._id} className="hover:bg-[#292929] transition">
                    <td>{index + 1}</td>
                    <td className="font-mono">{sub.language}</td>
                    <td>
                      <span className={`badge border ${getStatusColor(sub.status)} flex items-center gap-1`}>
                        {getStatusIcon(sub.status)}
                        {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                      </span>
                    </td>
                    <td className="font-mono">{sub.runtime} sec</td>
                    <td className="font-mono">{formatMemory(sub.memory)}</td>
                    <td className="font-mono">{sub.testCasesPassed}/{sub.testCasesTotal}</td>
                    <td>{formatDate(sub.createdAt)}</td>
                    <td>
                      <button 
                        className="btn btn-xs btn-outline btn-primary"
                        onClick={() => setSelectedSubmission(sub)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-gray-500 text-center">
            Showing {submissions.length} submissions
          </p>
        </>
      )}

      {/* Code View Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-[#232323] rounded-xl shadow-lg w-full max-w-3xl p-6 relative">
            <button
              className="absolute top-4 right-4 btn btn-sm btn-circle btn-error"
              onClick={() => setSelectedSubmission(null)}
              title="Close"
            >✕</button>
            <h3 className="font-bold text-lg mb-4 text-[#ffa116] flex items-center gap-2">
              {getStatusIcon(selectedSubmission.status)}
              Submission Details: <span className="badge badge-outline">{selectedSubmission.language}</span>
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`badge border ${getStatusColor(selectedSubmission.status)}`}>
                {selectedSubmission.status.charAt(0).toUpperCase() + selectedSubmission.status.slice(1)}
              </span>
              <span className="badge badge-outline">
                Runtime: {selectedSubmission.runtime}s
              </span>
              <span className="badge badge-outline">
                Memory: {formatMemory(selectedSubmission.memory)}
              </span>
              <span className="badge badge-outline">
                Passed: {selectedSubmission.testCasesPassed}/{selectedSubmission.testCasesTotal}
              </span>
            </div>
            {selectedSubmission.errorMessage && (
              <div className="alert alert-error mt-2">
                <span>{selectedSubmission.errorMessage}</span>
              </div>
            )}
            <pre className="p-4 bg-black text-green-300 rounded-lg overflow-x-auto mt-4 font-mono text-sm">
              <code>{selectedSubmission.code}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;