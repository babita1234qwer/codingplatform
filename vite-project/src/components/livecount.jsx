import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('https://codingplatform4.onrender.com', { withCredentials: true });

const ProblemUserCounter = () => {
  const { problemId } = useParams();
  const [userCount, setUserCount] = useState(0);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!problemId) return;

    socket.emit('join-problem', {
      problemId,
      userId: user?._id,
    });

    const handleUserCount = (count) => setUserCount(count);
    socket.on('problem-user-count', handleUserCount);

    return () => {
      socket.emit('leave-problem', { problemId, userId: user?._id });
      socket.off('problem-user-count', handleUserCount);
    };
  }, [problemId, user?._id]);

  return (
    <div className="badge bg-green-600 text-white text-sm sm:text-base px-3 py-2 mt-4 max-w-full whitespace-nowrap overflow-hidden text-ellipsis">
      👨‍💻 {userCount} user{userCount !== 1 && 's'} solving
    </div>
  );
};

export default ProblemUserCounter;