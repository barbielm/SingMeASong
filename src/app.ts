import express from "express";
import cors from "cors";
import { Request, Response } from "express";
import connection from "./database/database";


const app = express();
app.use(cors());
app.use(express.json());

app.post("/recommendations", async (req: Request, res: Response) => {
  try {
  const {name, youtubeLink} = req.body;
  
  if(name === '' || !youtubeLink.startsWith("https://www.youtube.com/watch?v=")) return res.sendStatus(400);
  
  await connection.query(`INSERT INTO recommendations(name,"youtubeLink",score) VALUES ($1,$2,$3)`,[name, youtubeLink, 0]);
  res.sendStatus(201);
  } catch(e) {
    console.log(e)
    res.sendStatus(500);
  }
});

app.post("/recommendations/:id/upvote", async (req: Request, res: Response) => {
  try{
    const {id} = req.params;
    if(isNaN(+id)) return res.sendStatus(400);
    const recommendation = await connection.query(`SELECT * FROM recommendations WHERE id=$1`,[id]);
    if(recommendation.rows.length === 0) return res.sendStatus(400);

    await connection.query(`UPDATE recommendations SET score=$1 WHERE id=$2`,[recommendation.rows[0].score + 1, id]);
    res.sendStatus(200);
  } catch(e){
    console.log(e)
    res.sendStatus(500)
  }
})

app.post("/recommendations/:id/downvote", async (req: Request, res: Response) => {
  try{

    const {id} = req.params;
    if(isNaN(+id)) return res.sendStatus(400);
    const recommendation = await connection.query(`SELECT * FROM recommendations WHERE id=$1`,[id]);
    if(recommendation.rows.length === 0) return res.sendStatus(400);
    const toDelete: boolean = (recommendation.rows[0].score > -5) ? false : true;
    
    if(toDelete) await connection.query(`DELETE FROM recommendations WHERE id=$1`,[id]); 
    else await connection.query(`UPDATE recommendations SET score=$1 WHERE id=$2`,[recommendation.rows[0].score - 1, id]);
    
    res.sendStatus(200);
  } catch(e){
    console.log(e)
    res.sendStatus(500)
  }
})

app.get("/recommendations/random", async (req: Request, res: Response) => {
  try{
  const goodSongs = await connection.query(`SELECT * FROM recommendations WHERE score > 10`);
  const badSongs = await connection.query(`SELECT * FROM recommendations WHERE score <= 10 AND score >= -5`);
  if(goodSongs.rows.length === 0 && badSongs.rows.length === 0) return res.sendStatus(404);
  if(goodSongs.rows.length === 0) return res.send(badSongs.rows[Math.floor(Math.random()*badSongs.rows.length)]);
  if(badSongs.rows.length === 0) return res.send(goodSongs.rows[Math.floor(Math.random()*goodSongs.rows.length)]);
  const probability: number = 1 + Math.random()*10;
  if(probability <= 3) res.send(badSongs.rows[Math.floor(Math.random()*badSongs.rows.length)]);
  else res.send(goodSongs.rows[Math.floor(Math.random()*goodSongs.rows.length)]); 

  } catch(e) {
    console.log(e)
    res.sendStatus(500);
  }
})

app.get("/recommendations/top/:amount", async (req: Request, res: Response) => {
  try{
    const {amount} = req.params;
    
    if(isNaN(+amount)) return res.sendStatus(400);

    const ordenatedRecommendations = await connection.query(`SELECT * FROM recommendations ORDER BY score LIMIT $1`,[amount]);
    res.send(ordenatedRecommendations.rows.reverse());

  } catch(e){
    console.log(e)
    res.sendStatus(500)
  }

})

export default app;
