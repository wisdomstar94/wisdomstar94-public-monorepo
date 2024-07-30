// import { createLogger, format, transports } from "winston";

// // error.........
// const _logger = createLogger({
//   defaultMeta: { service: 'user-service' },
//   transports: [
//     new transports.Console({
//       level: 'debug',
//       format: format.json(),
//     }),
//   ],
// });

export const logger = {
  debug: console.debug,
};