import pg from 'pg';
import * as recommendationRepository from "../../src/repositories/recommendationRepository";
import * as voteRepository from "../../src/repositories/voteRepository";
async function createArray(){
    const song1 = await recommendationRepository.createRecommendation("song1", "https://www.youtube.com/watch?v=MXkZ-eeGs6A&ab_channel=Cz%C5%82owiekDrzewo");
    const song2 = await recommendationRepository.createRecommendation("song2", "https://www.youtube.com/watch?v=MXkZ-eeGs6A&ab_channel=Cz%C5%82owiekDrzewo");
    const song3 = await recommendationRepository.createRecommendation("song3", "https://www.youtube.com/watch?v=MXkZ-eeGs6A&ab_channel=Cz%C5%82owiekDrzewo");
    const song4 = await recommendationRepository.createRecommendation("song4", "https://www.youtube.com/watch?v=MXkZ-eeGs6A&ab_channel=Cz%C5%82owiekDrzewo");

    await voteRepository.addScore(song1.rows[0].score, song1.rows[0].id);
    await voteRepository.addScore(song1.rows[0].score + 1, song1.rows[0].id);
    await voteRepository.addScore(song2.rows[0].score, song2.rows[0].id);
    await voteRepository.subtractScore(song3.rows[0].score, song3.rows[0].id);
    await voteRepository.subtractScore(song4.rows[0].score, song4.rows[0].id);
    await voteRepository.subtractScore(song4.rows[0].score - 1, song4.rows[0].id);

    const ordenatedArray = await recommendationRepository.getOrdenatedRecommendations("4");

    return ordenatedArray.rows.reverse();

}

async function createGoodSongsOnly(){
    const song1 = await recommendationRepository.createRecommendation("song1", "https://www.youtube.com/watch?v=MXkZ-eeGs6A&ab_channel=Cz%C5%82owiekDrzewo");
    const song2 = await recommendationRepository.createRecommendation("song2", "https://www.youtube.com/watch?v=MXkZ-eeGs6A&ab_channel=Cz%C5%82owiekDrzewo");
    for(let i = 0; i < 12; i++){
        await voteRepository.addScore(song1.rows[0].score + i, song1.rows[0].id);
    }

    for(let i = 0; i < 13; i++){
        await voteRepository.addScore(song2.rows[0].score + i, song2.rows[0].id);
    }

    const ordenatedArray = await recommendationRepository.getOrdenatedRecommendations("4");

    return ordenatedArray.rows.reverse();
}

async function createBadSongsOnly(){
    const song1 = await recommendationRepository.createRecommendation("song1", "https://www.youtube.com/watch?v=MXkZ-eeGs6A&ab_channel=Cz%C5%82owiekDrzewo");
    const song2 = await recommendationRepository.createRecommendation("song2", "https://www.youtube.com/watch?v=MXkZ-eeGs6A&ab_channel=Cz%C5%82owiekDrzewo");
    
    await voteRepository.subtractScore(song1.rows[0].score , song1.rows[0].id);
    

    for(let i = 0; i < 3; i++){
        await voteRepository.addScore(song2.rows[0].score - i, song2.rows[0].id);
    }
    
    const ordenatedArray = await recommendationRepository.getOrdenatedRecommendations("4");

    return ordenatedArray.rows.reverse();
}


export {createArray, createGoodSongsOnly, createBadSongsOnly};