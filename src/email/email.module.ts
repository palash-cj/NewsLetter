import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';

// mvll qkct jtds zmfc

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: async () => ({
                transport: {
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: 'palash.vdoit@gmail.com',
                        pass: 'mvll qkct jtds zmfc',
                    },
                },
                defaults: {
                    from: `"No Reply" <no-reply@zasset.com>`,
                },
                // template: {
                //     dir: join(__dirname, './templates'),
                //     adapter: new HandlebarsAdapter(),
                //     options: {
                //         strict: true,
                //     },
                // },
            }),
            // inject: [ConfigService],
        }),
    ],
    controllers: [EmailController],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule { }