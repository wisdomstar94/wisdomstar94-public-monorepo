import http from 'http';
import { Server } from "socket.io";
import { IUseBabylonCharacterController } from '#IUseBabylonCharacterController';
import { load } from 'dotenv-mono';
load();

const BACKENDS_SOCKET_SAMPLE_CORS_ORIGIN = process.env.BACKENDS_SOCKET_SAMPLE_CORS_ORIGIN ?? '';

export default function(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: BACKENDS_SOCKET_SAMPLE_CORS_ORIGIN.split(',').map(x => x.trim()),
      methods: ["GET", "POST"],
    },
  });

  io.on('connection', socket => {
    console.log('New client connected', socket.id);

    socket.on('disconnect', () => {
      console.log('user disconnect', socket.id);
      socket.broadcast.emit("otherUserDisconnect", { characterId: socket.data.characterId });
    });

    socket.on('good', (data: any) => {
      console.log('on.good', data); // 클라이언트 -> 서버
    });

    socket.on('meConnect', (data: IUseBabylonCharacterController.AddRequireInfo) => {
      socket.data = { characterId: data.characterId };
      socket.broadcast.emit('otherUserConnect', data);
    });
    
    socket.on('meCurrnetPositionAndRotation', (data: IUseBabylonCharacterController.CharacterPositionAndRotationOptions) => {
      socket.broadcast.emit('otherUserCurrentPositionAndRotation', data);
    });

    socket.on('meCurrent', (data: IUseBabylonCharacterController.AddRequireInfo) => {
      socket.data = { characterId: data.characterId };
      socket.broadcast.emit('otherUserCurrent', data);
    });

    socket.on('meMoving', (data: IUseBabylonCharacterController.CharacterMovingOptions) => {
      socket.broadcast.emit('otherUserModelMovingInfo', data);
    });

    socket.on('meJumping', (data: { characterId: string, delay: number, duration: number }) => {
      socket.broadcast.emit('otherUserModelJumpingInfo', data);
    });

    setInterval(() => {
      socket.broadcast.emit('getOtherDatas', { timestemp: Date.now() });
    }, 1000);
  });
}