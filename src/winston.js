import winston from "winston";
import config from "./config/config.js";

const customLevels = {
  levels: {
    debug: 5,
    http: 4,
    info: 3,
    warning: 2,
    error: 1,
    fatal: 0,
  },
  colors: {
    debug: "cyan",
    http: "blue",
    info: "green",
    warning: "yellow",
    error: "red",
    fatal: "magenta",
  },
};

winston.addColors(customLevels.colors);

const logger = winston.createLogger({
  levels: customLevels.levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple(),
    winston.format.colorize({ all: true })
  ),
  transports: [
    new winston.transports.Console({
      level: config.environment === "production" ? "info" : "debug",
    }),
    new winston.transports.File({
      level: "error",
      filename: "./errors.log",
    }),
  ],
});

export { logger };
