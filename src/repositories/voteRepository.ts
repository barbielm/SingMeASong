import connection from '../database/database';

async function getRecommendation(id: string){
    const recommendation = await connection.query(`SELECT * FROM recommendations WHERE id=$1`,[id]);
    return recommendation.rows;
}

async function addScore(score: number, id: string){
    await connection.query(`UPDATE recommendations SET score=$1 WHERE id=$2`,[score + 1, id])
}

async function subtractScore(score: number, id: string){
    await connection.query(`UPDATE recommendations SET score=$1 WHERE id=$2`,[score - 1, id])
}

async function deleteRecommendation(id: string){
    await connection.query(`DELETE FROM recommendations WHERE id=$1`,[id]);
}

export {getRecommendation, addScore, subtractScore, deleteRecommendation};