import http from 'http';
import { Server } from "socket.io";
import { IUseBabylonCharacterController } from '#IUseBabylonCharacterController';

export default function(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000", "http://192.168.0.4:3000"],
      methods: ["GET", "POST"],
    },
  });

  io.on('connection', socket => {
    console.log('New client connected', socket.id);

    socket.on('disconnect', () => console.log('user disconnect', socket.id));

    socket.on('good', (data: any) => {
      console.log('on.good', data); // 클라이언트 -> 서버
    });

    socket.on('meConnect', (data: IUseBabylonCharacterController.InitRequireInfo) => {
      socket.broadcast.emit('otherUserConnect', data);
    });
    
    socket.on('meCurrnetPosition', (data) => {
      socket.broadcast.emit('otherUserConnectPosition', data);
    });

    socket.on('meCurrent', (data: IUseBabylonCharacterController.InitRequireInfo) => {
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