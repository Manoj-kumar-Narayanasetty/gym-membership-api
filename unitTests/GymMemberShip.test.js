const request = require('supertest');
const app = require('../GymMemberShipAPi');

describe('Gym Membership API', () => {
    let testMember = { name: 'John Doe', email: 'john@example.com', startDate: '2025-04-01' };

    it('should register a new member', async () => {
        const res = await request(app).post('/register').send(testMember);
        expect(res.status).toBe(200);
        expect(res.body.member.email).toBe(testMember.email);
    });

    it('should not allow duplicate registration', async () => {
        const res = await request(app).post('/register').send(testMember);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Member already exists');
    });

    it('should fetch membership details', async () => {
        const res = await request(app).get('/membership').query({ email: testMember.email });
        expect(res.status).toBe(200);
        expect(res.body.email).toBe(testMember.email);
    });

    it('should return 404 for non-existent member', async () => {
        const res = await request(app).get('/membership').query({ email: 'unknown@example.com' });
        expect(res.status).toBe(404);
    });

    it('should fetch all members', async () => {
        const res = await request(app).get('/members');
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should modify membership start date', async () => {
        const newDate = '2025-05-01';
        const res = await request(app).put('/modify').send({ email: testMember.email, newStartDate: newDate });
        expect(res.status).toBe(200);
        expect(res.body.member.startDate).toBe(newDate);
    });

    it('should cancel a membership', async () => {
        const res = await request(app).delete('/cancel').send({ email: testMember.email });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Membership canceled successfully');
    });

    it('should return 404 when canceling non-existent member', async () => {
        const res = await request(app).delete('/cancel').send({ email: testMember.email });
        expect(res.status).toBe(404);
    });
});