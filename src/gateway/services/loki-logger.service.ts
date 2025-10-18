import type { Logger } from 'pino';
import { LogType } from '../../use-cases/common/default.gateway';

export class LokiLoggerService {
  constructor(private readonly logger: Logger) {}

  public addLog(logType: LogType, message: string, data: any) {
    switch (logType) {
      case LogType.Info: {
        this.logger.info(data, message);
        break;
      }
      case LogType.Warn: {
        this.logger.warn(data, message);
        break;
      }
      case LogType.Error: {
        this.logger.error(data, message);
        break;
      }
      default: {
        console.log(logType, data, message);
      }
    }
  }
}
