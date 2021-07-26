import connection from '../database/database';

async function createRecommendation(name: string, youtubeLink: string){
    await connection.query(`INSERT INTO recommendations(name,"youtubeLink",score) VALUES ($1,$2,$3)`,[name, youtubeLink, 0]);
}

async function selectSongs(){
    const goodSongs = await connection.query(`SELECT * FROM recommendations WHERE score > 10`);
    const badSongs = await connection.query(`SELECT * FROM recommendations WHERE score <= 10 AND score >= -5`);
    return {goodSongs, badSongs};
}

async function getOrdenatedRecommendations(amount: string){
    const ordenatedRecommendations = await connection.query(`SELECT * FROM recommendations ORDER BY score LIMIT $1`,[amount]);
    return ordenatedRecommendations;
}

export {createRecommendation, selectSongs, getOrdenatedRecommendations};