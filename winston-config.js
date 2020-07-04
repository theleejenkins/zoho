import winston from "winston";

const DEFAULT_CATEGORY = "ZOHO";

var winstonOptions = {
  file: {
    level: "info",
    filename: "zoho.log",
    handleExceptions: true,
    json: false,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: true,
    prettyPrint: true,
  },
};

function createLoggerConfig(category) {
  return {
    level: "info",
    transports: [
      new winston.transports.File(winstonOptions.file),
      new winston.transports.Console(winstonOptions.console),
    ],
    format: winston.format.combine(
      winston.format.label({
        label: category,
      }),
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.prettyPrint(),
      winston.format.printf((info) => {
        return `${info.timestamp} - ${info.label}:[${info.level}]: ${info.message}`;
      })
    ),
  };
}
winston.loggers.add(DEFAULT_CATEGORY, createLoggerConfig(DEFAULT_CATEGORY));

const defaultLogger = winston.loggers.get(DEFAULT_CATEGORY);
export default defaultLogger;
