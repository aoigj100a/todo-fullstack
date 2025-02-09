"use strict";
// src/middleware/errorHandler.ts
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("../utils/errors");
var errorHandler = function (err, req, res, next) {
    // Set defaults
    var statusCode = 500;
    var message = 'Internal Server Error';
    var stack = undefined;
    // Handle AppError instances
    if (err instanceof errors_1.AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    // Only show stack traces in development
    if (process.env.NODE_ENV === 'development') {
        stack = err.stack;
    }
    // Log error
    if (process.env.NODE_ENV === 'development') {
        console.error("[Error] ".concat(err.name, ": ").concat(err.message));
        console.error(err.stack);
    }
    // Send response
    res.status(statusCode).json(__assign({ status: 'error', statusCode: statusCode, message: message }, (stack && { stack: stack })));
};
exports.default = errorHandler;
