import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-primary/10 via-base-200 to-base-100 px-0">
      <div className="w-full flex justify-center">
        <div className="bg-base-100 shadow-xl rounded-2xl p-10 flex flex-col items-center border border-base-300 w-full max-w-5xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-2 drop-shadow-lg w-full text-center">
            {/* 👨‍💻 emoji for someone with a laptop */}
            <span className="inline-block animate-bounce">👨‍💻</span> CodeCrack
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 w-full text-center">
            Welcome to CodeCrack
          </h2>
          <p className="text-xl text-base-content/80 mb-6 font-medium text-center w-full">
            Practice coding problems, participate in contests, and level up your programming skills.
          </p>
          <button
            onClick={handleGetStarted}
            className="btn btn-primary text-lg px-10 py-2 rounded-full shadow hover:scale-105 transition-transform duration-150"
          >
            Get Started
          </button>
          <div className="mt-8 flex flex-col gap-2 w-full">
            <div className="flex items-center gap-2">
              <span className="badge badge-info badge-lg">📝</span>
              <span className="text-base-content/70">Solve Problems</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge badge-success badge-lg">🏆</span>
              <span className="text-base-content/70">Give Contests</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge badge-accent badge-lg">📊</span>
              <span className="text-base-content/70">See Leaderboard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;