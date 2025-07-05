import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosclient';

const UpdateProblem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'easy',
    tags: [],
    visibletestcases: [{ input: '', output: '', explanation: '' }],
    hiddentestcases: [{ input: '', output: '', explanation: '' }],
    startCode: [{ language: 'cpp', initialcode: '' }],
    referenceCode: [{ language: 'cpp', completecode: '' }]
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axiosClient.get(`/problem/problembyid/${id}`);
        const data = res.data;

        
        setFormData({
          title: data.title || '',
          description: data.description || '',
          difficulty: data.difficulty || 'easy',
          tags: Array.isArray(data.tags) ? data.tags : [],
          visibletestcases: Array.isArray(data.visibletestcases) && data.visibletestcases.length > 0
            ? data.visibletestcases
            : [{ input: '', output: '', explanation: '' }],
          hiddentestcases: Array.isArray(data.hiddentestcases) && data.hiddentestcases.length > 0
            ? data.hiddentestcases
            : [{ input: '', output: '', explanation: '' }],
          startCode: Array.isArray(data.startCode) && data.startCode.length > 0
            ? data.startCode
            : [{ language: 'cpp', initialcode: '' }],
          referenceCode: Array.isArray(data.referenceCode) && data.referenceCode.length > 0
            ? data.referenceCode
            : [{ language: 'cpp', completecode: '' }]
        });

        setLoading(false);
      } catch (err) {
        setError('Failed to load problem');
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  
  const handleTagsChange = (e) => {
    const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, tags: tagsArray }));
  };

  
  const handleArrayChange = (field, index, key, value) => {
    const updated = [...formData[field]];
    updated[index] = { ...updated[index], [key]: value };
    setFormData(prev => ({ ...prev, [field]: updated }));
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      
      await axiosClient.patch(`/problem/update/${id}`, formData);
      navigate('/admin/problems');
    } catch (err) {
      console.error('Update failed:', err.response || err);
      setError(err.response?.data?.error || 'Update failed');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-error">{error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Update Problem</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="input input-bordered w-full"
          required
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="textarea textarea-bordered w-full"
          required
        />

        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          className="select select-bordered w-full"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <input
          type="text"
          value={formData.tags.join(', ')}
          onChange={handleTagsChange}
          placeholder="Tags (comma separated)"
          className="input input-bordered w-full"
        />

        {/* Start Code */}
        <div>
          <h4 className="font-medium mb-1">Start Code</h4>
          {formData.startCode.map((code, i) => (
            <div key={i} className="mb-2">
              <select
                value={code.language}
                onChange={e => handleArrayChange('startCode', i, 'language', e.target.value)}
                className="select select-bordered w-full mb-1"
              >
                <option value="cpp">C++</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>
              <textarea
                value={code.initialcode}
                onChange={e => handleArrayChange('startCode', i, 'initialcode', e.target.value)}
                placeholder="Initial Code"
                className="textarea textarea-bordered w-full"
              />
            </div>
          ))}
        </div>

        {/* Reference Code */}
        <div>
          <h4 className="font-medium mb-1">Reference Code</h4>
          {formData.referenceCode.map((ref, i) => (
            <div key={i} className="mb-2">
              <select
                value={ref.language}
                onChange={e => handleArrayChange('referenceCode', i, 'language', e.target.value)}
                className="select select-bordered w-full mb-1"
              >
                <option value="cpp">C++</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>
              <textarea
                value={ref.completecode}
                onChange={e => handleArrayChange('referenceCode', i, 'completecode', e.target.value)}
                placeholder="Complete Code"
                className="textarea textarea-bordered w-full"
              />
            </div>
          ))}
        </div>

        {/* Visible Test Cases */}
        <div>
          <h4 className="font-medium mb-1">Visible Test Cases</h4>
          {formData.visibletestcases.map((tc, i) => (
            <div key={i} className="mb-2 flex flex-col gap-2">
              <input
                type="text"
                value={tc.input}
                onChange={e => handleArrayChange('visibletestcases', i, 'input', e.target.value)}
                placeholder="Input"
                className="input input-bordered w-full"
                required
              />
              <input
                type="text"
                value={tc.output}
                onChange={e => handleArrayChange('visibletestcases', i, 'output', e.target.value)}
                placeholder="Output"
                className="input input-bordered w-full"
                required
              />
              <input
                type="text"
                value={tc.explanation}
                onChange={e => handleArrayChange('visibletestcases', i, 'explanation', e.target.value)}
                placeholder="Explanation"
                className="input input-bordered w-full"
              />
            </div>
          ))}
        </div>

        {/* Hidden Test Cases */}
        <div>
          <h4 className="font-medium mb-1">Hidden Test Cases</h4>
          {formData.hiddentestcases.map((tc, i) => (
            <div key={i} className="mb-2 flex flex-col gap-2">
              <input
                type="text"
                value={tc.input}
                onChange={e => handleArrayChange('hiddentestcases', i, 'input', e.target.value)}
                placeholder="Input"
                className="input input-bordered w-full"
              />
              <input
                type="text"
                value={tc.output}
                onChange={e => handleArrayChange('hiddentestcases', i, 'output', e.target.value)}
                placeholder="Output"
                className="input input-bordered w-full"
              />
              <input
                type="text"
                value={tc.explanation}
                onChange={e => handleArrayChange('hiddentestcases', i, 'explanation', e.target.value)}
                placeholder="Explanation (optional)"
                className="input input-bordered w-full"
              />
            </div>
          ))}
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Update Problem
        </button>
      </form>
    </div>
  );
};

export default UpdateProblem;
