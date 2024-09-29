import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendEmail(to: string, subject: string, text: string) {
        try {
            let campaignId = '0f5d24c2-cc0e-463a-b427-729a4482ef99';
            let linkId = '7cf7b3ce-1a70-48c1-ac01-d13ad2171ace';
            // Generate a trackable link
            const trackableLink = `https://k84gtxt2-4578.inc1.devtunnels.ms/api/tracking/${campaignId}/${linkId}/click/${to}`;
            const trackingImageUrl = `https://k84gtxt2-4578.inc1.devtunnels.ms/api/tracking/${campaignId}/${linkId}/open/${to}`;


            const emailTemplate = `
            <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                        }
                        .container {
                            padding: 20px;
                            border: 1px solid #ddd;
                            border-radius: 5px;
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #f9f9f9;
                        }
                        .header {
                            font-size: 24px;
                            margin-bottom: 20px;
                        }
                        .content {
                            font-size: 18px;
                            margin-bottom: 20px;
                        }
                        .footer {
                            font-size: 16px;
                            color: #666;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">New Info From NewsLetter !!!</div>
                        <div class="content">
                            <strong>${text}</strong>
                            <p>Click here: <a href="${trackableLink}">Click here to read more</a></p>
                        </div>
                        <div class="footer">
                            Thank you,<br>Team NewsLetter
                        </div>
                        <img src="${trackingImageUrl}" style="display:none;" alt="tracking pixel"/>
                    </div>
                </body>
                </html>
            `;

            await this.mailerService.sendMail({
                to,
                subject,
                html: emailTemplate,
            });
        } catch (e) {
            console.log(e);
        }
    }
}

