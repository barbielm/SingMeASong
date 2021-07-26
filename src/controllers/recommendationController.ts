import {Request, Response} from 'express';
import * as recommendationRepository from "../repositories/recommendationRepository";

async function postRecommendation(req: Request, res: Response){
    try {
        const {name, youtubeLink} = req.body;
        
        if(name === '' || !youtubeLink.startsWith("https://www.youtube.com/watch?v=")) return res.sendStatus(400);
        
        await recommendationRepository.createRecommendation(name, youtubeLink);
        res.sendStatus(201);
        } 
    catch(e) {
        console.log(e)
        res.sendStatus(500);
    }
}

async function getRandomRecommendation(req: Request, res: Response){
    try{
        const {goodSongs, badSongs} = await recommendationRepository.selectSongs();
        if(goodSongs.rows.length === 0 && badSongs.rows.length === 0) return res.sendStatus(404);
        if(goodSongs.rows.length === 0) return res.send(badSongs.rows[Math.floor(Math.random()*badSongs.rows.length)]);
        if(badSongs.rows.length === 0) return res.send(goodSongs.rows[Math.floor(Math.random()*goodSongs.rows.length)]);
        const probability: number = 1 + Math.random()*10;
        if(probability <= 3) res.send(badSongs.rows[Math.floor(Math.random()*badSongs.rows.length)]);
        else res.send(goodSongs.rows[Math.floor(Math.random()*goodSongs.rows.length)]); 
      
        } 
    catch(e) {
      console.log(e)
      res.sendStatus(500);
    }
}

async function getTopRecommendations(req: Request, res: Response){
    try{
        const {amount} = req.params;
        
        if(isNaN(+amount)) return res.sendStatus(400);
    
        const ordenatedRecommendations = await recommendationRepository.getOrdenatedRecommendations(amount);
        res.send(ordenatedRecommendations.rows.reverse());
    
      } 
      catch(e){
        console.log(e)
        res.sendStatus(500)
      }
}

export {postRecommendation, getRandomRecommendation, getTopRecommendations};