import { LogDataSource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";
import fs, { appendFile, appendFileSync } from 'fs'; 

export class FileSystemDataSource implements LogDataSource{

    private readonly logPath = 'logs/';
    private readonly allLogPath = 'logs/logs-all.log';
    private readonly mediumLogPath = 'logs/logs-medium.log';
    private readonly highLogPath = 'logs/logs-high.log';

    constructor(){
        this.createLogsFile();
    }

    private createLogsFile = () => {
        if( !fs.existsSync(this.logPath ) ){
            fs.mkdirSync( this.logPath );
        }
        
        [
            this.allLogPath,
            this.mediumLogPath,
            this.highLogPath
        ].forEach( path => {
            if( fs.existsSync( path ) ) return;
            fs.writeFileSync( path, '' );
        })
    }

    async saveLog(newLog: LogEntity): Promise<void> {
        const logAsJSON = `${ JSON.stringify(newLog) }\n`
        
        fs.appendFileSync( this.allLogPath, logAsJSON );

        if( newLog.level === LogSeverityLevel.low ) return;
        if( newLog.level === LogSeverityLevel.medium ){
            fs.appendFileSync( this.mediumLogPath, logAsJSON )
        }else{
            fs.appendFileSync( this.highLogPath, logAsJSON )
        }
    }

    private getLogsFromFile = ( path: string): LogEntity[] => {
        const content = fs.readFileSync( path, 'utf-8');
        const logs = content.split('\n').map( log => LogEntity.fromJson( log ) );

        return logs;
    }

    async getLog(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
        
        switch( severityLevel ){
            case LogSeverityLevel.low:
                return this.getLogsFromFile(this.allLogPath);
            case LogSeverityLevel.medium:
                return this.getLogsFromFile( this.mediumLogPath );
            case LogSeverityLevel.high:
                return this.getLogsFromFile( this.highLogPath );
            default: 
            throw new Error(`${ severityLevel } not implemented`);
        }
    }

}