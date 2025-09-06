// src/middleware/requestLogger.ts
import { Request, Response, NextFunction } from 'express';

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Log when response finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logMessage = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;

    // 从环境变量或默认配置获取日志格式
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
      // Colorize output in development
      const color =
        res.statusCode >= 500
          ? '\x1b[31m' // red
          : res.statusCode >= 400
            ? '\x1b[33m' // yellow
            : res.statusCode >= 300
              ? '\x1b[36m' // cyan
              : '\x1b[32m'; // green
      console.log(`${color}${logMessage}\x1b[0m`);
    } else {
      // JSON format for production
      console.log(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          method: req.method,
          url: req.originalUrl,
          status: res.statusCode,
          duration,
          ip: req.ip,
          userAgent: req.get('user-agent'),
        })
      );
    }
  });

  next();
};

export default requestLogger;
