import connection from "../../src/database/database";
import supertest from "supertest";
import app from "../../src/app";
import * as functions from "../utils/functions";
import * as recommendationRepository from "../../src/repositories/recommendationRepository";
import * as voteRepository from "../../src/repositories/voteRepository";

beforeEach(async () => {
    await connection.query('DELETE FROM recommendations');
});
  
afterAll(() => {
    connection.end();
});


describe("POST /recommendations", () => {
    it("returns 201 for valid params", async () => {
        const body = {name:"song", youtubeLink: "https://www.youtube.com/watch?v=MXkZ-eeGs6A&ab_channel=Cz%C5%82owiekDrzewo"};
        const result = await supertest(app).post("/recommendations").send(body);
        expect(result.status).toEqual(201);
    })
    it("returns 400 for empty name string or non youtube link", async () => {
        const emptyStringBody = {name: "", youtubeLink: "https://www.youtube.com/watch?v=MXkZ-eeGs6A&ab_channel=Cz%C5%82owiekDrzewo"};
        const emptyStringResult = await supertest(app).post("/recommendations").send(emptyStringBody);
        expect(emptyStringResult.status).toEqual(400);

        const wrongLinkBody = {name: "link", youtubeLink: "https://ge.globo.com/"};
        const wrongLinkResult = await supertest(app).post("/recommendations").send(wrongLinkBody);
        expect(wrongLinkResult.status).toEqual(400);
    })
})

describe("GET /recommendations/random", () => {
    it("returns 404 for empty array os songs", async () => {
        const result = await supertest(app).get("/recommendations/random")
        expect(result.status).toEqual(404);
    })

    it("returns a random good song if there are no bad songs", async () => {
        const songs = await functions.createGoodSongsOnly();
        const result = await supertest(app).get("/recommendations/random");
        let song;

        for(let i = 0; i < songs.length; i++){
            if(songs[i].id === JSON.parse(result.text).id) song = songs[i];
        }

        expect(JSON.parse(result.text)).toEqual(song);
    })

    it("returns a random bad song if there are no good songs", async () => {
        const songs = await functions.createBadSongsOnly();
        const result = await supertest(app).get("/recommendations/random");
        let song;

        for(let i = 0; i < songs.length; i++){
            if(songs[i].id === JSON.parse(result.text).id) song = songs[i];
        }

        expect(JSON.parse(result.text)).toEqual(song);
    })

    it("returns a random song if there are both good and bad songs", async () => {
        const songs = await functions.createArray();
        const result = await supertest(app).get("/recommendations/random");
        let song;

        for(let i = 0; i < songs.length; i++){
            if(songs[i].id === JSON.parse(result.text).id) song = songs[i];
        }

        expect(JSON.parse(result.text)).toEqual(song);
    })

})

describe("GET /recommendations/top/:amount", () => {
    it("returns status 400 for invalid amount param", async () => {
        const result = await supertest(app).get("/recommendations/top/abc")
        expect(result.status).toEqual(400);
    })

    it("returns ordenated array of recommendation songs for valid params", async () => {
        
        const ordenatedArray = await functions.createArray()
        const result = await supertest(app).get("/recommendations/top/4");
        
        expect(JSON.parse(result.text)).toEqual(ordenatedArray);
    })
})