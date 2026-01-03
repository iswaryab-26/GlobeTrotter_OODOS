import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';

interface AuthSocket extends Socket {
  userId?: string;
}

export const initializeSocket = (httpServer: HTTPServer): SocketIOServer => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:8080',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Authentication middleware
  io.use((socket: AuthSocket, next: any) => {
    const token = (socket as any).handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthSocket) => {
    console.log(`✅ User connected: ${socket.userId}`);

    // Join user-specific room
    if (socket.userId) {
      (socket as any).join(`user:${socket.userId}`);
    }

    // Trip collaboration events
    socket.on('trip:join', (tripId: string) => {
      socket.join(`trip:${tripId}`);
      console.log(`User ${socket.userId} joined trip ${tripId}`);
    });

    socket.on('trip:leave', (tripId: string) => {
      socket.leave(`trip:${tripId}`);
      console.log(`User ${socket.userId} left trip ${tripId}`);
    });

    socket.on('trip:update', (data: { tripId: string; updates: any }) => {
      // Broadcast to all users in the trip room except sender
      socket.to(`trip:${data.tripId}`).emit('trip:updated', data.updates);
    });

    socket.on('trip:city:add', (data: { tripId: string; city: any }) => {
      socket.to(`trip:${data.tripId}`).emit('trip:city:added', data.city);
    });

    socket.on('trip:city:remove', (data: { tripId: string; cityId: string }) => {
      socket.to(`trip:${data.tripId}`).emit('trip:city:removed', data.cityId);
    });

    socket.on('trip:activity:add', (data: { tripId: string; cityId: string; activity: any }) => {
      socket.to(`trip:${data.tripId}`).emit('trip:activity:added', {
        cityId: data.cityId,
        activity: data.activity
      });
    });

    socket.on('trip:activity:remove', (data: { tripId: string; cityId: string; activityId: string }) => {
      socket.to(`trip:${data.tripId}`).emit('trip:activity:removed', {
        cityId: data.cityId,
        activityId: data.activityId
      });
    });

    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
    });
  });

  console.log('✅ Socket.IO initialized');
  return io;
};

export const emitToUser = (io: SocketIOServer, userId: string, event: string, data: any): void => {
  io.to(`user:${userId}`).emit(event, data);
};

export const emitToTrip = (io: SocketIOServer, tripId: string, event: string, data: any): void => {
  io.to(`trip:${tripId}`).emit(event, data);
};
