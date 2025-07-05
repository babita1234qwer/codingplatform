import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';


const socket = io('https://codingplatform4.onrender.com', { withCredentials: true }); 

const ProblemUserCounter = () => {
  const { problemId } = useParams(); // assumes route contains :problemId
  const [userCount, setUserCount] = useState(0);
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!problemId) return;

    socket.emit('join-problem', {
  problemId,
  userId: user?._id, });
   const handleUserCount = (count) => setUserCount(count);
    socket.on('problem-user-count', handleUserCount);


   return () => {
      socket.emit('leave-problem', { problemId, userId: user._id });
      socket.off('problem-user-count', handleUserCount);
    };
  }, [problemId, user?._id]);

  return (
    <div className="badge badge-info text-lg px-4 py-2 mt-4">
      👨‍💻 {userCount} user{userCount !== 1 && 's'} solving this problem live
    </div>
  );
};

export default ProblemUserCounter;
