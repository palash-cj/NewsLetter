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
                findOne: jest.fn().mockResolvedValue({ link: 'https://us06web.zoom.us/', clickCount: 0 }),
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
            campaignId: '460d2b78-efac-45d5-baf5-896275fc2a25',
        };
        const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZ21haWwuY29tIiwic3ViIjoiZmQ4OTQwMjgtMTdmNy00NzljLTg1NTgtNTYwZjU0OWQwYWFjIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MjcwODAwNzYsImV4cCI6MTcyNzA4MzY3Nn0.yq_Y7zPR0kulufxhZQeLJqXywF3R5gYfZ1XiBfk88Nw`;

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
        const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZ21haWwuY29tIiwic3ViIjoiZmQ4OTQwMjgtMTdmNy00NzljLTg1NTgtNTYwZjU0OWQwYWFjIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MjcwODAwNzYsImV4cCI6MTcyNzA4MzY3Nn0.yq_Y7zPR0kulufxhZQeLJqXywF3R5gYfZ1XiBfk88Nw`;

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
        const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZ21haWwuY29tIiwic3ViIjoiZmQ4OTQwMjgtMTdmNy00NzljLTg1NTgtNTYwZjU0OWQwYWFjIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MjcwODAwNzYsImV4cCI6MTcyNzA4MzY3Nn0.yq_Y7zPR0kulufxhZQeLJqXywF3R5gYfZ1XiBfk88Nw`;

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
            link: 'https://us06web.zoom.us/',
            clickCount: 0,
            campaignId: '44e19404-8394-4562-ae27-2d595fa7c677',
        };
        const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZ21haWwuY29tIiwic3ViIjoiZmQ4OTQwMjgtMTdmNy00NzljLTg1NTgtNTYwZjU0OWQwYWFjIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MjcwODAwNzYsImV4cCI6MTcyNzA4MzY3Nn0.yq_Y7zPR0kulufxhZQeLJqXywF3R5gYfZ1XiBfk88Nw`;
    
        return request(app.getHttpServer())
            .post('/click-stats')
            .set('Authorization', token)
            .send(payload)
            .expect(404)
            .expect(({ body }) => {
                expect(body.message).toContain('Campaign not found');
            });
    });

    it('/click-stats (POST) - Validation Error: Duplicate Link', () => {
        const payload = {
            link: 'https://www.google.co/',
            clickCount: 0,
            campaignId: '460d2b78-efac-45d5-baf5-896275fc2a25',
        };
        const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZ21haWwuY29tIiwic3ViIjoiZmQ4OTQwMjgtMTdmNy00NzljLTg1NTgtNTYwZjU0OWQwYWFjIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MjcwODAwNzYsImV4cCI6MTcyNzA4MzY3Nn0.yq_Y7zPR0kulufxhZQeLJqXywF3R5gYfZ1XiBfk88Nw`;
    
        clickStatRepository.findOne = jest.fn().mockResolvedValue(payload);
    
        return request(app.getHttpServer())
            .post('/click-stats')
            .set('Authorization', token)
            .send(payload)
            .expect(409) // Conflict response
            .expect(({ body }) => {
                expect(body.message).toContain('ClickStat with this link already exists');
            });
    });

    it('/click-stats (POST) - Successful Creation', () => {
        const payload = {
            link: 'https://us06web.zoom.us/',
            clickCount: 0,
            campaignId: '460d2b78-efac-45d5-baf5-896275fc2a25',
        };
        const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZ21haWwuY29tIiwic3ViIjoiZmQ4OTQwMjgtMTdmNy00NzljLTg1NTgtNTYwZjU0OWQwYWFjIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MjcwODAwNzYsImV4cCI6MTcyNzA4MzY3Nn0.yq_Y7zPR0kulufxhZQeLJqXywF3R5gYfZ1XiBfk88Nw`;

        return request(app.getHttpServer())
            .post('/click-stats')
            .set('Authorization', token)
            .send(payload)
            .expect(201)
    });

    it('/click-stats/track (GET) - Unauthorized', () => {
        return request(app.getHttpServer())
            .get('/click-stats/track?link=https://www.google.co/')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZ21haWwuY29tIiwic3ViIjoiZTk4HYjg4NGItNWY4My00MjRhLWE1YjktMDk0OWU4M2IwOGRlIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MjcwMTYyMTgsImV4cCI6MTcyNzAxOTgxOH0.o2G1srxfoF7eBgDuPFiP7Evgae1Sl1C2NQbgaPSdjgI`) // Invalid token
            .expect(401);
    });

    it('/click-stats/track (GET) - Authorized', () => {
        const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZ21haWwuY29tIiwic3ViIjoiZmQ4OTQwMjgtMTdmNy00NzljLTg1NTgtNTYwZjU0OWQwYWFjIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MjcwODAwNzYsImV4cCI6MTcyNzA4MzY3Nn0.yq_Y7zPR0kulufxhZQeLJqXywF3R5gYfZ1XiBfk88Nw`;
        clickStatRepository.findOne = jest.fn().mockResolvedValue({ link: 'https://www.google.co.uk/', clickCount: 0 });
        return request(app.getHttpServer())
            .get('/click-stats/track?link=https://www.google.co.uk/')
            .set('Authorization', token)
            .expect(302)
            .expect('Location', 'https://www.google.co.uk/');
    });

    it('/click-stats/track (GET) - Link Not Found', () => {
        const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZ21haWwuY29tIiwic3ViIjoiZmQ4OTQwMjgtMTdmNy00NzljLTg1NTgtNTYwZjU0OWQwYWFjIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MjcwODAwNzYsImV4cCI6MTcyNzA4MzY3Nn0.yq_Y7zPR0kulufxhZQeLJqXywF3R5gYfZ1XiBfk88Nw`;

        clickStatRepository.findOne = jest.fn().mockResolvedValue(null);

        return request(app.getHttpServer())
            .get('/click-stats/track?link=https://www.xyz.c')
            .set('Authorization', token)
            .expect(404); 
    })

    it('/click-stats/track (GET) - Link Not Provided', () => {
        const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZ21haWwuY29tIiwic3ViIjoiZmQ4OTQwMjgtMTdmNy00NzljLTg1NTgtNTYwZjU0OWQwYWFjIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MjcwODAwNzYsImV4cCI6MTcyNzA4MzY3Nn0.yq_Y7zPR0kulufxhZQeLJqXywF3R5gYfZ1XiBfk88Nw`;

        return request(app.getHttpServer())
            .get('/click-stats/track') 
            .set('Authorization', token)
            .expect(400) 
            .expect(res => {
                expect(res.body).toEqual({ message: 'Link is required' }); 
            });
    });


    afterAll(async () => {
        await app.close();
    });
});
