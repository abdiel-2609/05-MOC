import { envs } from "../config/plugins/envs.plugin";
import { CheckService } from "../domain/use-cases/checks/check-service";
import { FileSystemDataSource } from "../infrastructure/datasources/file-system.datasource";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service";
import { EmailService } from "./email/email.service";

const fileSystemLogRepository = new LogRepositoryImpl(
    new FileSystemDataSource(),
)


export class Server{
    public static start(){
        console.log('Server started...');

        //Mandar email

        const emailService = new EmailService();
        emailService.sendEmail({
            to: "abdiel.alvarado@wabtec.com",
            subject: "Logs de sistema",
            htmlBody: 'Hola Mundo'
        })
        
        /* CronService.creatJon(
        '* /5 * * * * *',
        () => {
            const url = 'https://google.com';
            //const url = 'https://localhost:3000'
            new CheckService(
                fileSystemLogRepository,
                () => console.log(`${ url } is ok`),
                ( error ) => console.log(error),
            ).execute( url );
            //new CheckService().execute( 'http://localhost:3000/posts' );
        }
        );  */
    }
       
}