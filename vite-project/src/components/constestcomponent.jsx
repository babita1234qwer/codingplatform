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
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Contest</h2>
      <div className="form-control mb-4">
        <label className="label">Title</label>
        <input type="text" className="input input-bordered" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="form-control mb-4">
        <label className="label">Description</label>
        <textarea className="textarea textarea-bordered" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="form-control mb-4">
        <label className="label">Start Time</label>
        <input type="datetime-local" className="input input-bordered" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      </div>
      <div className="form-control mb-4">
        <label className="label">End Time</label>
        <input type="datetime-local" className="input input-bordered" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
      </div>
      <div className="form-control mb-4">
  <label className="label">Select Problems</label>
  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border rounded p-2 bg-base-100">
    {problems.map((p) => (
      <label key={p._id} className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          className="checkbox checkbox-primary"
          checked={selectedProblems.includes(p._id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedProblems([...selectedProblems, p._id]);
            } else {
              setSelectedProblems(selectedProblems.filter(id => id !== p._id));
            }
          }}
        />
        <span>{p.title} <span className="badge badge-sm badge-outline">{p.difficulty}</span></span>
      </label>
    ))}
  </div>
</div>
      <button className="btn btn-primary" onClick={handleSubmit}>Create Contest</button>
    </div>
  );
};

export default CreateContest;
