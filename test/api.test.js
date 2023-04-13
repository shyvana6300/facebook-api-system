const request = require('supertest');
let server;

describe('/api/facebook', () => {
    beforeEach(() => {server = require('../main');})
    afterEach(() => {server.close();});

    describe('GET /', () => {
        it('should return the test result api', async () => {
            const res = await request(server).get('/');
            expect(res.status).toBe(200);
        });
    });
 });