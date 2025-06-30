import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosclient';
import { logoutUser } from '../authslice';

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all'
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  // Filter by search in title (all words must be present, any order)
  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const statusMatch = filters.status === 'all' ||
      solvedProblems.some(sp => sp._id === problem._id);

    // Search logic: all words in search must be present in title (case-insensitive)
    const searchWords = search.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const title = problem.title.toLowerCase();
    const searchMatch = searchWords.every(word => title.includes(word));

    return difficultyMatch && tagMatch && statusMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-base-200 to-base-100">
      {/* Navigation Bar */}
      <nav className="navbar bg-base-100 shadow-lg px-4 mb-6">
        <div className="flex-1">
          <NavLink to="/" className="btn btn-ghost text-2xl font-bold tracking-wide text-primary">CodeCrack</NavLink>
        </div>
        <div className="flex-none gap-4 flex items-center">
           <NavLink to="/dashboard" className="btn btn-outline btn-sm flex items-center gap-2">
            <span role="img" aria-label="dashboard">👤</span> Dashboard
          </NavLink>
          <NavLink to="/contests" className="btn btn-outline btn-sm flex items-center gap-2">
            <span role="img" aria-label="contest">🏆</span> Contests
          </NavLink>
          {user?.role?.toLowerCase() === 'admin' && (
            <NavLink to="/admin" className="btn btn-outline btn-sm flex items-center gap-2">
              <span role="img" aria-label="admin">🛠️</span> Admin
            </NavLink>
          )}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost gap-2">
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-8">
                  <span>{user?.firstName?.[0]?.toUpperCase() || "U"}</span>
                </div>
              </div>
              <span className="font-semibold">{user?.firstName}</span>
            </div>
            <ul className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-2 md:px-6 py-4">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center items-center w-full">
          <input
            type="text"
            className="input input-bordered w-full md:max-w-xs"
            placeholder="Search problems by title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <select
            className="select select-bordered select-sm"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Problems</option>
            <option value="solved">Solved Problems</option>
          </select>

          <select
            className="select select-bordered select-sm"
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            className="select select-bordered select-sm"
            value={filters.tag}
            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
          >
            <option value="all">All Tags</option>
            <option value="array">Array</option>
            <option value="linkedList">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">DP</option>
          </select>
        </div>

        {/* Problems List */}
        <div className="flex flex-col gap-6 w-full">
          {filteredProblems.length === 0 ? (
            <div className="text-center text-base-content/70 py-10">
              No problems found.
            </div>
          ) : (
            filteredProblems.map(problem => (
              <div
                key={problem._id}
                className="card bg-base-100 shadow-lg border border-base-200 hover:shadow-xl transition-shadow duration-200 w-full"
              >
                <div className="card-body flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <NavLink
                      to={`/problem/${problem._id}`}
                      className="card-title text-lg font-bold hover:text-primary"
                    >
                      {problem.title}
                    </NavLink>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`badge ${getDifficultyBadgeColor(problem.difficulty)} capitalize`}>
                        {problem.difficulty}
                      </span>
                      <span className="badge badge-info capitalize">{problem.tags}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {solvedProblems.some(sp => sp._id === problem._id) && (
                      <div className="badge badge-success gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Solved
                      </div>
                    )}
                    <NavLink
                      to={`/problem/${problem._id}`}
                      className="btn btn-primary btn-sm w-full md:w-auto"
                    >
                      Solve Problem
                    </NavLink>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'badge-success';
    case 'medium': return 'badge-warning';
    case 'hard': return 'badge-error';
    default: return 'badge-neutral';
  }
};

export default Homepage;