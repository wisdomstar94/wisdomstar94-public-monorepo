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
      console.log('@meConnect', data.characterId);
      socket.data = { characterId: data.characterId };
      // console.log('@meConnect', socket);
      socket.broadcast.emit('otherUserConnect', data);
    });
    
    socket.on('meCurrentPositionAndRotation', (data: IUseBabylonCharacterController.CharacterPositionAndRotationOptions) => {
      console.log('@meCurrentPositionAndRotation', data.characterId);
      socket.broadcast.emit('otherUserCurrentPositionAndRotation', data);
    });

    socket.on('meCurrent', (data: { data: IUseBabylonCharacterController.AddRequireInfo; characterId?: string }) => {
      if (data.characterId === undefined) {
        socket.broadcast.emit('otherUserCurrent', data.data);
      } else {
        console.log('## ## ##');
        io.fetchSockets().then((list) => {
          // console.log('@@list', list);
          const targetSocket = list.find(k => k.data.characterId === data.characterId);
          // console.log('targetSocket', targetSocket);
          targetSocket?.emit('otherUserCurrent', data.data);
        })
      }
    });

    socket.on('meMoving', (data: IUseBabylonCharacterController.CharacterMovingOptions) => {
      console.log('@meMoving', data.characterId);
      socket.broadcast.emit('otherUserModelMovingInfo', data);
    });

    socket.on('meJumping', (data: { characterId: string, delay: number, duration: number }) => {
      console.log('@meJumping', data.characterId);
      socket.broadcast.emit('otherUserModelJumpingInfo', data);
    });

    // setInterval(() => {
    //   socket.broadcast.emit('getOtherDatas', { timestemp: Date.now() });
    // }, 1000);
  });
}