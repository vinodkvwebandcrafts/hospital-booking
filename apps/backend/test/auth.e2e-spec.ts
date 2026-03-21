import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/auth/register', () => {
    const uniqueEmail = `test-${Date.now()}@example.com`;

    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: uniqueEmail,
          password: 'testpassword123',
          firstName: 'Test',
          lastName: 'User',
          phone: '+1234567890',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.accessToken).toBeDefined();
          expect(res.body.data.refreshToken).toBeDefined();
          expect(res.body.data.user.email).toBe(uniqueEmail);
          expect(res.body.data.user.role).toBe('PATIENT');
          expect(res.body.data.user.password).toBeUndefined();
        });
    });

    it('should fail with duplicate email', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: uniqueEmail,
          password: 'testpassword123',
          firstName: 'Test',
          lastName: 'User',
          phone: '+1234567890',
        })
        .expect(409);
    });

    it('should fail with invalid email', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          password: 'testpassword123',
          firstName: 'Test',
          lastName: 'User',
          phone: '+1234567890',
        })
        .expect(400);
    });

    it('should fail with short password', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'short@example.com',
          password: '123',
          firstName: 'Test',
          lastName: 'User',
          phone: '+1234567890',
        })
        .expect(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    const loginEmail = `login-${Date.now()}@example.com`;

    beforeAll(async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: loginEmail,
          password: 'testpassword123',
          firstName: 'Login',
          lastName: 'Test',
          phone: '+1234567890',
        });
    });

    it('should login with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: loginEmail,
          password: 'testpassword123',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.accessToken).toBeDefined();
          expect(res.body.data.refreshToken).toBeDefined();
          accessToken = res.body.data.accessToken;
        });
    });

    it('should fail with wrong password', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: loginEmail,
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('should fail with non-existent email', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'testpassword123',
        })
        .expect(401);
    });
  });

  describe('Protected routes', () => {
    it('should access profile with valid token', async () => {
      if (!accessToken) return;

      return request(app.getHttpServer())
        .get('/api/v1/users/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.email).toBeDefined();
        });
    });

    it('should reject request without token', () => {
      return request(app.getHttpServer())
        .get('/api/v1/users/profile')
        .expect(401);
    });

    it('should reject request with invalid token', () => {
      return request(app.getHttpServer())
        .get('/api/v1/users/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
});
