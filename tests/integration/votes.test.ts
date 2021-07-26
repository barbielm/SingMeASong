import connection from "../../src/database/database";
import supertest from "supertest";
import app from "../../src/app";
import * as recommendationRepository from "../../src/repositories/recommendationRepository"



beforeEach(async () => {
    await connection.query('DELETE FROM recommendations');
});
  
afterAll(() => {
    connection.end();
});

describe("POST /recommendations/:id/upvote", () => {
    it("returns status 200 for valid id", async () => {
        const fakeRecommendation = await recommendationRepository.createRecommendation("song","https://www.youtube.com/watch?v=MXkZ-eeGs6A&ab_channel=Cz%C5%82owiekDrzewo");
        expect(fakeRecommendation.rows[0].score).toEqual(0);
        const result = await supertest(app).post(`/recommendations/${fakeRecommendation.rows[0].id}/upvote`).send({})
        const recommendation = await connection.query(`SELECT * FROM recommendations WHERE id=$1`,[fakeRecommendation.rows[0].id]);
        expect(recommendation.rows[0].score).toEqual(1);
        expect(result.status).toEqual(200);
    })
    it("returns satus 400 for invalid id", async () => {
        const unexistentId = await supertest(app).post(`/recommendations/34/upvote`).send({});
        expect(unexistentId.status).toEqual(400);
        const stringId = await supertest(app).post(`/recommendations/abc/upvote`).send({});
        expect(stringId.status).toEqual(400);
    })
})

describe("POST /recommendations/:id/downvote", () => {
    it("returns status 200 for valid id", async () => {
        const fakeRecommendation = await recommendationRepository.createRecommendation("song","https://www.youtube.com/watch?v=MXkZ-eeGs6A&ab_channel=Cz%C5%82owiekDrzewo");
        expect(fakeRecommendation.rows[0].score).toEqual(0);
        const result = await supertest(app).post(`/recommendations/${fakeRecommendation.rows[0].id}/downvote`).send({})
        const recommendation = await connection.query(`SELECT * FROM recommendations WHERE id=$1`,[fakeRecommendation.rows[0].id]);
        expect(recommendation.rows[0].score).toEqual(-1);
        expect(result.status).toEqual(200);
    })
    it("returns satus 400 for invalid id", async () => {
        const unexistentId = await supertest(app).post(`/recommendations/34/downvote`).send({});
        expect(unexistentId.status).toEqual(400);
        const stringId = await supertest(app).post(`/recommendations/abc/downvote`).send({});
        expect(stringId.status).toEqual(400);
    })
})