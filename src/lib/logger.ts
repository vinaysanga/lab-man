import { browser } from '$app/environment';
import pino, { type LoggerOptions } from 'pino';
import { get, readable, type Readable } from 'svelte/store';
import { ServerEnvironment, type PinoLogger } from './interfaces';

// Default log level will be set to silent but will be modified as per the environment in context.
const defaultLogLevel = 'silent';

// This is an IIFE, self executing function. It will return the Pino Logger instance 
const pinoLogger: PinoLogger = (() => {
    let pinoOptions: LoggerOptions;
    
    if (browser) {
        // If logger is running in browser, pretty print it.
        pinoOptions = {
            browser: { asObject: false },
            level: defaultLogLevel, // set default log level
            // format the level in the log to be uppercase.
            formatters: {
                level: label => {
                    return { level: label.toUpperCase() };
                },
            },
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true, // show colors in log
                    levelFirst: true, // show levels first in log
                    translateTime: true, // translate the time in human readable format
                },
            },
        }
    } else {
        // If logger is running in the server, do not pretty print it.
        pinoOptions = {
            level: defaultLogLevel,
            formatters: {
                level: label => {
                    return { level: label.toUpperCase() };
                },
            },
        };
    }
    
    return pino(pinoOptions);
})();

pinoLogger.setLogLevel = (NODE_ENV: ServerEnvironment) => {
    let logLevel: LoggerOptions['level'] = defaultLogLevel;
    
    switch (NODE_ENV) {
        case ServerEnvironment.DEV:
        case ServerEnvironment.PREV:
            logLevel = 'trace'; // for Development and Preview envs, use trace log level
            break;
        case ServerEnvironment.STG:
            logLevel = 'info'; // info for Staging
            break;
        case ServerEnvironment.PROD:
            if (browser) {
                logLevel = 'silent'; // for Production, silent in browser
            } else {
                logLevel = 'info'; // and info in server
            }
            break;
    }
    
    logger.info(`Logger log level will be set to "${logLevel}".`);
    pinoLogger.level = logLevel;
    return logLevel;
};

// Create a Readable store for the logger as its value is never going to change.
const loggerStore: Readable<PinoLogger> = readable<PinoLogger>(pinoLogger);

// Exporting the logger value obtained by get() function
export const logger = get(loggerStore);
