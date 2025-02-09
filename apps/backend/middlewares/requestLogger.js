"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requestLogger = function (req, res, next) {
    var start = Date.now();
    // Log when response finished
    res.on('finish', function () {
        var duration = Date.now() - start;
        var logMessage = "".concat(req.method, " ").concat(req.originalUrl, " ").concat(res.statusCode, " ").concat(duration, "ms");
        // 从环境变量或默认配置获取日志格式
        var isDev = process.env.NODE_ENV === 'development';
        if (isDev) {
            // Colorize output in development
            var color = res.statusCode >= 500 ? '\x1b[31m' : // red
                res.statusCode >= 400 ? '\x1b[33m' : // yellow
                    res.statusCode >= 300 ? '\x1b[36m' : // cyan
                        '\x1b[32m'; // green
            console.log("".concat(color).concat(logMessage, "\u001B[0m"));
        }
        else {
            // JSON format for production
            console.log(JSON.stringify({
                timestamp: new Date().toISOString(),
                method: req.method,
                url: req.originalUrl,
                status: res.statusCode,
                duration: duration,
                ip: req.ip,
                userAgent: req.get('user-agent'),
            }));
        }
    });
    next();
};
exports.default = requestLogger;
