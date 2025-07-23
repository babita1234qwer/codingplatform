import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1470&q=80')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-75 z-0" />

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full min-h-screen flex flex-col items-center justify-center backdrop-blur-md bg-gray-900 bg-opacity-80 border border-gray-700 shadow-xl p-10 text-gray-200">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-center leading-tight">
            🚀 Welcome to <span className="text-yellow-400">CodeCrack</span>
          </h1>
          <p className="text-xl md:text-2xl text-center mb-8 font-light text-gray-300 max-w-3xl">
            Practice coding, climb leaderboards, and ace your interviews — all in one dark-themed platform.
          </p>

          <button
            onClick={handleGetStarted}
            className="bg-yellow-400 text-black px-6 py-3 rounded-full text-lg font-semibold hover:scale-105 transition duration-200 shadow-md"
          >
            Get Started
          </button>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-6xl px-4">
            <FeatureCard
              title="Solve Challenges"
              description="Improve your DSA and problem-solving skills with hundreds of curated questions."
              icon="https://cdn-icons-png.flaticon.com/512/2504/2504886.png"
            />
            <FeatureCard
              title="Live Contests"
              description="Participate in weekly contests and test your speed, logic, and accuracy under pressure."
              icon="https://cdn-icons-png.flaticon.com/512/3094/3094860.png" // ✅ Fixed working icon
            />
            <FeatureCard
              title="Track Progress"
              description="View your submissions, rank, accuracy, and growth in real time across problems."
              icon="https://cdn-icons-png.flaticon.com/512/1179/1179069.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description, icon }) => (
  <div className="flex flex-col items-center space-y-4 bg-gray-800 rounded-2xl p-6 shadow-md hover:bg-gray-700 transition w-full h-full">
    <img src={icon} alt={title} className="w-16 h-16" />
    <h3 className="text-xl font-semibold text-gray-100">{title}</h3>
    <p className="text-gray-400 text-sm text-center">{description}</p>
  </div>
);

export default Home;
