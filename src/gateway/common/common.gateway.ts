import { LogType } from "../../use-cases/common/default.gateway";
import { LokiLoggerService } from "../services/loki-logger.service";

export class CommonGateway {
    constructor(protected lokiLoggerService: LokiLoggerService) { }
    addLog(logType: LogType, message: string, details: any): void {
        this.lokiLoggerService.addLog(logType, message, details);
    }
}