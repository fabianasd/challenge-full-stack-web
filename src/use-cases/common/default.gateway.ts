export enum LogType {
    Info = 3,
    Warn = 2,
    Error = 1
};

export interface DefaultGateway {
    addLog(logType: LogType, message: string, details?: any): void;
}