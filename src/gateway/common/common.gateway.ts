import { LogType } from "../../use-cases/common/default.gateway";

export class CommonGateway {
    addLog(logType: LogType, message: string, details: any): void {
        console.log({
            logType,
            message,
            details
        });
    }
}