import { Injectable, Optional } from '@nestjs/common';
import { logLevels as levels, actions } from '../../consts';
import * as path from 'path';
import * as fs from 'fs';
import * as process from 'process';
import { config } from 'dotenv';

type LogRecord = {
  url?: string;
  body?: object;
  params?: object;
  statusCode: number;
  response?: object | number;
};

export type LogLevel = 'info' | 'error' | 'warn' | 'debug' | 'verbose';

config();
const loFileMaxSize = Number(process.env.LOG_FILE_SIZE_MB) * 1024;

@Injectable()
export class LoggerService {
  private static logLevels: LogLevel[] = [
    levels.INFO,
    levels.ERROR,
    levels.WARN,
    levels.DEBUG,
    levels.VERBOSE,
  ];

  private static logDirPath: string = path.join(__dirname, '../../logs');
  private static logFilePath: string = path.join(
    __dirname,
    '../../logs/logs.txt',
  );

  private static instance?: typeof LoggerService = LoggerService;

  constructor(@Optional() private readonly context?: string) {
    this.handleLogFile(actions.REMOVE_LOG_DIR);

    if (!fs.existsSync(LoggerService.logDirPath)) {
      this.handleLogFile(actions.CREATE);
    }
  }

  private static rotateLogFile() {
    const timeStamp = this.getTimeStamp().replace(/:/g, '-');

    const rotatedFilePath = path.join(
      __dirname,
      `../../logs/logs - ${timeStamp}.txt`,
    );

    fs.renameSync(this.logFilePath, rotatedFilePath);

    fs.writeFileSync(this.logFilePath, '');
  }

  private static getTimeStamp(): string {
    return new Date().toISOString();
  }

  private static writeToFile(message: string) {
    const stats = fs.statSync(this.logFilePath);
    if (stats.size >= loFileMaxSize) {
      this.rotateLogFile();
    }

    const formattedMessage = `TIME: ${this.getTimeStamp()}\n${message}\n\n`;
    fs.appendFile(this.logFilePath, formattedMessage, (err) => {
      if (err) {
        console.error('Error writing to log file:', err);
      }
    });
  }

  info(data: LogRecord): void {
    this.callFunction(levels.INFO, data);
  }

  error(data: LogRecord): void {
    this.callFunction(levels.ERROR, data);
  }

  private callFunction(name: LogLevel, data: any) {
    if (!this.isLogLevelEnabled(name)) {
      return;
    }

    const message = this.prepareRecord(levels.INFO, JSON.stringify(data));

    const instance = this.getInstance();
    const func = instance && (instance as typeof LoggerService)[name];
    func && func.call(instance, message);
  }

  private getInstance(): typeof LoggerService {
    return LoggerService.instance;
  }

  private isLogLevelEnabled(level: LogLevel): boolean {
    return LoggerService.logLevels.includes(level);
  }

  private static logToStdOut(message: string): void {
    process.stdout.write(`${message}\n`);
  }

  private async handleLogFile(action: string): Promise<any[]> {
    const promises = [];

    if (action === actions.REMOVE_LOG_DIR) {
      promises.push(this.removeDirectory());
    }

    if (action === actions.CREATE) {
      promises.push(
        fs.mkdirSync(LoggerService.logDirPath),
        fs.writeFileSync(LoggerService.logFilePath, ''),
      );
    }

    if (action === actions.CLEAR) {
      promises.push(fs.writeFileSync(LoggerService.logFilePath, ''));
    }

    return Promise.allSettled(promises);
  }

  private async removeDirectory() {
    if (fs.existsSync(LoggerService.logDirPath)) {
      fs.readdirSync(LoggerService.logDirPath).forEach((file) => {
        const filePath = path.join(LoggerService.logDirPath, file);

        if (fs.statSync(filePath).isDirectory()) {
          this.removeDirectory();
        } else {
          fs.unlinkSync(filePath);
        }
      });

      fs.rmdirSync(LoggerService.logDirPath);
    }
  }

  private prepareRecord(level: string, data: string) {
    return `LEVEL: ${level}\nDATA: ${data}`;
  }

  private static printToLog(message: string): void {
    this.writeToFile(message);
    this.logToStdOut(message);
  }

  static info(message: any) {
    this.printToLog(message);
  }

  static error(message: any) {
    this.printToLog(message);
  }
}
