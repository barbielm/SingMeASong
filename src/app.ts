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

export default app;
