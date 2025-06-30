const problemRooms = {}; // { problemId: Set of userIds }
const socketToUserMap = {}; // { socket.id: { userId, problemId } }

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('join-problem', ({ problemId, userId }) => {
      socket.join(problemId);
      socketToUserMap[socket.id] = { userId, problemId };

      if (!problemRooms[problemId]) problemRooms[problemId] = new Set();
      problemRooms[problemId].add(userId);

      io.to(problemId).emit('problem-user-count', problemRooms[problemId].size);
    });

    socket.on('leave-problem', ({ problemId, userId }) => {
      socket.leave(problemId);

      if (problemRooms[problemId]) {
        // Check if any other socket from this user is still connected
       const stillConnected = Object.entries(socketToUserMap).some(
      ([sid, info]) => sid !== socket.id && info.userId === userId && info.problemId === problemId
    );

        if (!stillConnected) {
          problemRooms[problemId].delete(userId);
        }
        io.to(problemId).emit('problem-user-count', problemRooms[problemId].size);
      }

      delete socketToUserMap[socket.id];
    });

    socket.on('disconnecting', () => {
      const info = socketToUserMap[socket.id];
      if (info) {
        const { userId, problemId } = info;

        const stillConnected = Object.entries(socketToUserMap).some(
          ([sid, i]) => sid !== socket.id && i.userId === userId && i.problemId === problemId
        );

        if (!stillConnected && problemRooms[problemId]) {
          problemRooms[problemId].delete(userId);
          io.to(problemId).emit('problem-user-count', problemRooms[problemId].size);
        }
      }

      delete socketToUserMap[socket.id];
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });
};

module.exports = socketHandler;
