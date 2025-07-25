import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
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

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
   
    const tagMatch = filters.tag === 'all' || problem.tags.includes(filters.tag);

    const statusMatch = filters.status === 'all' ||
      solvedProblems.some(sp => sp._id === problem._id);

    const searchWords = search.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const title = problem.title.toLowerCase();
    const searchMatch = searchWords.every(word => title.includes(word));

    return difficultyMatch && tagMatch && statusMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#e2e2e2]">
      {/* Sticky Navigation Bar */}
      <nav className="navbar bg-[#232323] shadow-lg px-4 py-2 mb-6 border-b border-[#333] sticky top-0 z-50 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="https://leetcode.com/favicon.ico" alt="Logo" className="w-8 h-8" />
          <NavLink to="/" className="btn btn-ghost text-2xl font-bold tracking-wide text-[#ffa116]">CodeCrack</NavLink>
        </div>
        <div className="flex-none gap-2 flex items-center mt-2 md:mt-0">
          <NavLink to="/dashboard" className="btn btn-outline btn-sm flex items-center gap-2 border-[#444] text-[#e2e2e2] hover:bg-[#292929]">
            <span role="img" aria-label="dashboard">👤</span> Dashboard
          </NavLink>
          <NavLink to="/contests" className="btn btn-outline btn-sm flex items-center gap-2 border-[#444] text-[#e2e2e2] hover:bg-[#292929]">
            <span role="img" aria-label="contest">🏆</span> Contests
          </NavLink>
          {user?.role?.toLowerCase() === 'admin' && (
            <NavLink to="/admin" className="btn btn-outline btn-sm flex items-center gap-2 border-[#444] text-[#e2e2e2] hover:bg-[#292929]">
              <span role="img" aria-label="admin">🛠️</span> Admin
            </NavLink>
          )}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost gap-2 text-[#e2e2e2]">
              <div className="avatar placeholder">
                <div className="bg-[#444] text-[#ffa116] rounded-full w-8 h-8 flex items-center justify-center">
                  <span>{user?.firstName?.[0]?.toUpperCase() || "U"}</span>
                </div>
              </div>
              <span className="font-semibold">{user?.firstName}</span>
            </div>
            <ul className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-[#232323] rounded-box w-52 border border-[#333]">
              <li><button onClick={handleLogout} className="text-[#ffa116] hover:bg-[#292929]">Logout</button></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-2 md:px-6 py-4">
        {/* Search Bar */}
        <div className="w-full flex justify-center mb-4">
          <input
            type="text"
            className="input input-bordered w-80 bg-[#232323] border-[#444] text-[#e2e2e2] placeholder-[#888]"
            placeholder="🔍 Search problems by title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {/* Filters below search input */}
        <div className="flex flex-wrap gap-4 mb-8 w-full justify-center">
          <select
            className="select select-bordered select-sm bg-[#232323] border-[#444] text-[#e2e2e2]"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Problems</option>
            <option value="solved">Solved Problems</option>
          </select>
          <select
            className="select select-bordered select-sm bg-[#232323] border-[#444] text-[#e2e2e2]"
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <select
            className="select select-bordered select-sm bg-[#232323] border-[#444] text-[#e2e2e2]"
            value={filters.tag}
            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
          >
            <option value="all">All Tags</option>
            <option value="array">array</option>
            <option value="linkedList">linkedlist</option>
            <option value="graph">graph</option>
            <option value="dp">dp</option>
            <option value="string">string</option>
          </select>
        </div>

        {/* Problems List - vertical, compact */}
        <h2 className="text-xl font-bold text-[#ffa116] mb-4 px-2">Problems</h2>
        <div className="flex flex-col gap-3 w-full px-2">
          {filteredProblems.length === 0 ? (
            <div className="text-center text-[#888] py-10">
              No problems found.
            </div>
          ) : (
            filteredProblems.map(problem => (
              <div
                key={problem._id}
                className="card bg-[#232323] shadow border border-[#333] hover:shadow-lg transition-shadow duration-200 w-full hover:border-[#ffa116] hover:scale-[1.01] min-h-[64px] py-2"
              >
                <div className="card-body flex flex-col gap-1 py-2 px-3">
                  {/* Title and Solved/Solve in same line */}
                  <div className="flex items-center justify-between">
                    <NavLink
                      to={`/problem/${problem._id}`}
                      className="card-title text-base font-bold hover:text-[#ffa116] text-[#e2e2e2] truncate"
                    >
                      {problem.title}
                    </NavLink>
                    {solvedProblems.some(sp => sp._id === problem._id) ? (
                      <span className="flex items-center gap-1 text-[#2ecc71] font-semibold text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        Solved
                      </span>
                    ) : (
                      <NavLink
                        to={`/problem/${problem._id}`}
                        className="btn btn-primary btn-xs bg-[#ffa116] text-[#232323] border-none hover:bg-[#e2b34a] px-2 py-1 font-semibold"
                      >
                        Solve
                      </NavLink>
                    )}
                  </div>
                  {/* Difficulty and Tags below title */}
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className={`badge ${getDifficultyBadgeColor(problem.difficulty)} capitalize px-2 py-1 text-xs font-semibold`}>
                      {problem.difficulty}
                    </span>
                    <span className="badge badge-info capitalize bg-[#333] text-[#ffa116] px-2 py-1 text-xs">{problem.tags}</span>
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
    case 'easy': return 'bg-[#2ecc71] text-[#232323]';
    case 'medium': return 'bg-[#f7b731] text-[#232323]';
    case 'hard': return 'bg-[#eb2f06] text-[#e2e2e2]';
    default: return 'bg-[#444] text-[#e2e2e2]';
  }
};

export default Homepage;