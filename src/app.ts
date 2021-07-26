import express from "express";
import cors from "cors";
import { Request, Response } from "express";
import connection from "./database/database";
import * as recommendationController from "./controllers/recommendationController";
import * as voteController from "./controllers/voteController";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/recommendations", recommendationController.postRecommendation);

app.post("/recommendations/:id/upvote", voteController.upVote)

app.post("/recommendations/:id/downvote", voteController.downVote)

app.get("/recommendations/random", recommendationController.getRandomRecommendation)

app.get("/recommendations/top/:amount", recommendationController.getTopRecommendations)

export default app;
