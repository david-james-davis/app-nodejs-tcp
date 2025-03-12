import { createServer, Socket } from 'net';
import * as dotenv from 'dotenv';
import * as http from 'http';
import logger from './logger';

dotenv.config();

const CONSTANTS: {
  TCP_PORT: number;
  HTTP_PORT: number;
  clients: http.ServerResponse[];
} = {
  TCP_PORT: Number(process.env.TCP_PORT) || 4242,
  HTTP_PORT: Number(process.env.HTTP_PORT) || 8080,
  clients: [],
};

// Create a TCP Server
const tcpServer = createServer((socket: Socket): void => {
  logger.info(
    `New TCP client connected from ${socket.remoteAddress}:${socket.remotePort}`
  );

  socket.on('data', (data: Buffer): void => {
    const message: string = data.toString().trim();
    logger.info({ message, source: 'TCP Client' }, 'Received message');

    // broadcast the message to all clients
    CONSTANTS.clients.forEach((client: http.ServerResponse): void => {
      logger.info(`Client message sent`);
      client.write(`data: ${message}\n\n`);
    });
  });

  socket.on('end', (): void => {
    logger.warn('Tcp client disconnected.');
  });
});

tcpServer.listen(CONSTANTS.TCP_PORT, '0.0.0.0', () => {
  logger.info(`TCP Server running on port ${CONSTANTS.TCP_PORT}`);
});

// Create an HTTP Server for SSE
const httpServer = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse): void => {
    if (req.url === '/events') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });

      res.write(': connected\n\n');
      CONSTANTS.clients.push(res);

      req.on('close', (): void => {
        logger.warn('SSE client disconnected.');
        CONSTANTS.clients.splice(CONSTANTS.clients.indexOf(res), 1);
      });
    } else {
      res.writeHead(404);
      res.end();
    }
  }
);

httpServer.listen(CONSTANTS.HTTP_PORT, () => {
  logger.info(`SSE Server running on port ${CONSTANTS.HTTP_PORT}`);
});
