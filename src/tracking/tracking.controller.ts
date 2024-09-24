import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { TrackingService } from "./tracking.service";

@Controller('tracking')
export class TrackingController {
    constructor(private readonly trackingService: TrackingService) {}

    // Handle link tracking
    @Get(':campaignId/:linkId/click/:email')
    async trackLink(
        @Param('campaignId') campaignId: string,
        @Param('linkId') linkId: string,
        @Param('email') email: string,
        @Res() res: Response
    ) {
        // Log the link click
        const link = await this.trackingService.logClick(campaignId, linkId, email);

        // Redirect to actual URL (e.g., your landing page)
        const redirectUrl = link;  // Resolve the actual URL dynamically if needed
        res.redirect(302, redirectUrl);
    }

    // Handle email open tracking
    @Get(':campaignId/:linkId/open/:email')
    async trackOpen(
        @Param('campaignId') campaignId: string,
        @Param('linkId') linkId: string,
        @Param('email') email: string,
        @Res() res: Response
    ) {
        // Log the email open
        await this.trackingService.logOpen(campaignId, linkId, email);

        // Serve the 1x1 tracking image
        const imgBuffer = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
        res.writeHead(200, {
            'Content-Type': 'image/gif',
            'Content-Length': imgBuffer.length,
        });
        res.end(imgBuffer);
    }
}
