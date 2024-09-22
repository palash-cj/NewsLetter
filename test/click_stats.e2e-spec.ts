import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClickStat } from '../src/click_stats/entities/click_stat.entity';

describe('ClickStatController (e2e)', () => {
    let app: INestApplication;
    let clickStatRepository;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(getRepositoryToken(ClickStat))
            .useValue({
                findOne: jest.fn().mockResolvedValue({ link: 'https://www.google.co/', clickCount: 0 }), // Mocking a valid ClickStat
                save: jest.fn(),
            })
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        clickStatRepository = moduleFixture.get(getRepositoryToken(ClickStat));
    });

    it('/click-stats (POST) - Validation Error: Missing Link', () => {
        const payload = {
            clickCount: 0,
            campaignId: 'b0b7792c-f1bb-4224-a340-2aeb47829021',
        };
        const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZ21haWwuY29tIiwic3ViIjoiZTk4Yjg4NGItNWY4My00MjRhLWE1YjktMDk0OWU4M2IwOGRlIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MjcwMTYyMTgsImV4cCI6MTcyNzAxOTgxOH0.o2G1srxfoF7eBgDuPFiP7Evgae1Sl1C2NQbgaPSdjgI`;

        return request(app.getHttpServer())
            .post('/click-stats')
            .send(payload)
            .set('Authorization', token)
            .expect(400)
            .expect(({ body }) => {
                expect(body.message).toContain('link should not be empty');
            });
    });

    it('/click-stats (POST) - Validation Error: Invalid Campaign ID', () => {
        const payload = {
            link: 'https://www.google.co/',
            clickCount: 0,
            campaignId: 'njkdfv',
        };
        const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZ21haWwuY29tIiwic3ViIjoiZTk4Yjg4NGItNWY4My00MjRhLWE1YjktMDk0OWU4M2IwOGRlIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MjcwMTYyMTgsImV4cCI6MTcyNzAxOTgxOH0.o2G1srxfoF7eBgDuPFiP7Evgae1Sl1C2NQbgaPSdjgI`;

        return request(app.getHttpServer())
            .post('/click-stats')
            .set('Authorization', token)
            .send(payload)
            .expect(400)
            .expect(({ body }) => {
                expect(body.message).toContain('campaignId must be a UUID');
            });
    });

    it('/click-stats (POST) - Validation Error: Missing Campaign ID', () => {
        const payload = {
            link: 'https://www.google.co/',
            clickCount: 0,
        };
        const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZ21haWwuY29tIiwic3ViIjoiZTk4Yjg4NGItNWY4My00MjRhLWE1YjktMDk0OWU4M2IwOGRlIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MjcwMTYyMTgsImV4cCI6MTcyNzAxOTgxOH0.o2G1srxfoF7eBgDuPFiP7Evgae1Sl1C2NQbgaPSdjgI`;

        return request(app.getHttpServer())
            .post('/click-stats')
            .set('Authorization', token)
            .send(payload)
            .expect(400)
            .expect(({ body }) => {
                expect(body.message).toContain('campaignId should not be empty');
            });
    });

    it('/click-stats (POST) - Validation Error: Campaign Not Found', () => {
        const payload = {
            link: 'https://www.google.co/',
            clickCount: 0,
            campaignId: '44e19404-8394-4562-ae27-2d595fa7c677',
        };
        const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZ21haWwuY29tIiwic3ViIjoiZTk4Yjg4NGItNWY4My00MjRhLWE1YjktMDk0OWU4M2IwOGRlIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MjcwMTYyMTgsImV4cCI6MTcyNzAxOTgxOH0.o2G1srxfoF7eBgDuPFiP7Evgae1Sl1C2NQbgaPSdjgI`;
    
        // Mock the findOne method for campaign to return null (not found)
        // campaignRepository.findOne = jest.fn().mockResolvedValue(null);
    
        return request(app.getHttpServer())
            .post('/click-stats')
            .set('Authorization', token)
            .send(payload)
            .expect(404) // Expecting Not Found response
            .expect(({ body }) => {
                expect(body.message).toContain('Campaign not found');
            });
    });

    it('/click-stats (POST) - Validation Error: Duplicate Link', () => {
        const payload = {
            link: 'https://www.google.co/',
            clickCount: 0,
            campaignId: 'b0b7792c-f1bb-4224-a340-2aeb47829021',
        };
        const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZ21haWwuY29tIiwic3ViIjoiZTk4Yjg4NGItNWY4My00MjRhLWE1YjktMDk0OWU4M2IwOGRlIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MjcwMTYyMTgsImV4cCI6MTcyNzAxOTgxOH0.o2G1srxfoF7eBgDuPFiP7Evgae1Sl1C2NQbgaPSdjgI`;
    
        // Mock the findOne method to return an existing ClickStat
        clickStatRepository.findOne = jest.fn().mockResolvedValue(payload);
    
        return request(app.getHttpServer())
            .post('/click-stats')
            .set('Authorization', token)
            .send(payload)
            .expect(409) // Expecting Conflict response
            .expect(({ body }) => {
                expect(body.message).toContain('ClickStat with this link already exists');
            });
    });

    it('/click-stats (POST) - Successful Creation', () => {
        const payload = {
            link: 'https://www.google.co/',
            clickCount: 0,
            campaignId: 'b0b7792c-f1bb-4224-a340-2aeb47829021',
        };
        const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZ21haWwuY29tIiwic3ViIjoiZTk4Yjg4NGItNWY4My00MjRhLWE1YjktMDk0OWU4M2IwOGRlIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MjcwMTYyMTgsImV4cCI6MTcyNzAxOTgxOH0.o2G1srxfoF7eBgDuPFiP7Evgae1Sl1C2NQbgaPSdjgI`;

        return request(app.getHttpServer())
            .post('/click-stats')
            .set('Authorization', token)
            .send(payload)
            .expect(201)
    });

    it('/click-stats/track (GET) - Unauthorized', () => {
        return request(app.getHttpServer())
            .get('/click-stats/track?link=https://www.google.co/')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZ21haWwuY29tIiwic3ViIjoiZTk4HYjg4NGItNWY4My00MjRhLWE1YjktMDk0OWU4M2IwOGRlIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MjcwMTYyMTgsImV4cCI6MTcyNzAxOTgxOH0.o2G1srxfoF7eBgDuPFiP7Evgae1Sl1C2NQbgaPSdjgI`) // Use an invalid token
            .expect(401);
    });

    it('/click-stats/track (GET) - Authorized', () => {
        const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZ21haWwuY29tIiwic3ViIjoiZTk4Yjg4NGItNWY4My00MjRhLWE1YjktMDk0OWU4M2IwOGRlIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MjcwMTYyMTgsImV4cCI6MTcyNzAxOTgxOH0.o2G1srxfoF7eBgDuPFiP7Evgae1Sl1C2NQbgaPSdjgI`;
        clickStatRepository.findOne = jest.fn().mockResolvedValue({ link: 'https://www.google.co.uk/', clickCount: 0 });
        return request(app.getHttpServer())
            .get('/click-stats/track?link=https://www.google.co.uk/')
            .set('Authorization', token)
            .expect(302)
            .expect('Location', 'https://www.google.co.uk/');
    });

    it('/click-stats/track (GET) - Link Not Found', () => {
        const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZ21haWwuY29tIiwic3ViIjoiZTk4Yjg4NGItNWY4My00MjRhLWE1YjktMDk0OWU4M2IwOGRlIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MjcwMTYyMTgsImV4cCI6MTcyNzAxOTgxOH0.o2G1srxfoF7eBgDuPFiP7Evgae1Sl1C2NQbgaPSdjgI`;

        // Mocking findOne to return null for a non-existent link
        clickStatRepository.findOne = jest.fn().mockResolvedValue(null);

        return request(app.getHttpServer())
            .get('/click-stats/track?link=https://www.xyz.c')
            .set('Authorization', token)
            .expect(404); // Expecting Not Found response
    })

    it('/click-stats/track (GET) - Link Not Provided', () => {
        const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZ21haWwuY29tIiwic3ViIjoiZTk4Yjg4NGItNWY4My00MjRhLWE1YjktMDk0OWU4M2IwOGRlIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MjcwMTYyMTgsImV4cCI6MTcyNzAxOTgxOH0.o2G1srxfoF7eBgDuPFiP7Evgae1Sl1C2NQbgaPSdjgI`;

        return request(app.getHttpServer())
            .get('/click-stats/track') // No link query parameter
            .set('Authorization', token)
            .expect(400) // Expecting Bad Request response
            .expect(res => {
                expect(res.body).toEqual({ message: 'Link is required' }); // Check the error message
            });
    });


    afterAll(async () => {
        await app.close();
    });
});
