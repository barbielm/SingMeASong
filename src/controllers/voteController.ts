import { Request, Response } from "express";
import * as voteRepository from "../repositories/voteRepository"

async function upVote(req: Request, res: Response){
    try{
        const {id} = req.params;
        if(isNaN(+id)) return res.sendStatus(400);
        const recommendation = await voteRepository.getRecommendation(id);
        if(recommendation.length === 0) return res.sendStatus(400);
    
        await voteRepository.addScore(recommendation[0].score, id);
        res.sendStatus(200);
      }
    catch(e){
        console.log(e)
        res.sendStatus(500)
    }
}

async function downVote(req: Request, res: Response){
    try{

        const {id} = req.params;
        if(isNaN(+id)) return res.sendStatus(400);
        const recommendation = await voteRepository.getRecommendation(id);
        if(recommendation.length === 0) return res.sendStatus(400);
        const toDelete: boolean = (recommendation[0].score > -5) ? false : true;
        
        if(toDelete) await voteRepository.deleteRecommendation(id); 
        else await voteRepository.subtractScore(recommendation[0].score, id);
        
        res.sendStatus(200);
      } 
    catch(e){
        console.log(e)
        res.sendStatus(500)
    }
}


export {upVote, downVote};