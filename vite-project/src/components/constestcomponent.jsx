import React, { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosclient';

const CreateContest = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [problems, setProblems] = useState([]);
  const [selectedProblems, setSelectedProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axiosClient.get("/problem/getallproblem");
        setProblems(res.data);
      } catch (err) {
        console.error("Error fetching problems:", err);
      }
    };
    fetchProblems();
  }, []);

  const handleSubmit = async () => {
    try {
      await axiosClient.post("/problem/createcontest", {
        title,
        description,
        startTime,
        endTime,
        problems: selectedProblems,
      });
      alert("Contest created successfully");
      setTitle("");
      setDescription("");
      setStartTime("");
      setEndTime("");
      setSelectedProblems([]);
    } catch (err) {
      console.error("Error creating contest:", err);
      alert("Failed to create contest");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-[#232323] rounded-2xl shadow-2xl border border-[#333] p-8">
      <h2 className="text-3xl font-extrabold text-[#ffa116] mb-6 text-center">Create Contest</h2>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-1 text-[#ffa116]">Title</label>
          <input
            type="text"
            className="input input-bordered w-full bg-[#18181a] text-[#e2e2e2] border-[#ffa116] focus:border-[#ffa116] rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contest Title"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-[#ffa116]">Description</label>
          <textarea
            className="textarea textarea-bordered w-full bg-[#18181a] text-[#e2e2e2] border-[#ffa116] focus:border-[#ffa116] rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your contest..."
            rows={3}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-[#ffa116]">Start Time</label>
            <input
              type="datetime-local"
              className="input input-bordered w-full bg-[#18181a] text-[#e2e2e2] border-[#ffa116] focus:border-[#ffa116] rounded"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-[#ffa116]">End Time</label>
            <input
              type="datetime-local"
              className="input input-bordered w-full bg-[#18181a] text-[#e2e2e2] border-[#ffa116] focus:border-[#ffa116] rounded"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-[#ffa116]">Select Problems</label>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border border-[#333] rounded-lg p-2 bg-[#18181a]">
            {problems.map((p) => (
              <label
                key={p._id}
                className="flex items-center gap-3 px-2 py-1 rounded hover:bg-[#292929] transition cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="checkbox checkbox-warning"
                  checked={selectedProblems.includes(p._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedProblems([...selectedProblems, p._id]);
                    } else {
                      setSelectedProblems(selectedProblems.filter(id => id !== p._id));
                    }
                  }}
                />
                <span className="font-semibold text-[#e2e2e2]">{p.title}</span>
                <span className={`badge badge-outline ${p.difficulty === 'easy' ? 'border-green-400 text-green-400' : p.difficulty === 'medium' ? 'border-yellow-400 text-yellow-400' : 'border-red-400 text-red-400'}`}>
                  {p.difficulty.charAt(0).toUpperCase() + p.difficulty.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>
        <button
          className="btn w-full bg-[#ffa116] text-[#232323] font-bold rounded-full hover:bg-[#ffb84d] transition mt-4"
          onClick={handleSubmit}
        >
          Create Contest
        </button>
      </div>
    </div>
  );
};

export default CreateContest;