const pool = require("../config/pool");
require('dotenv').config();



function getLineSegment(x1, y1, x2, y2, steps) {
    let points = [];

    for (let t = 0; t <= 1; t += 1 / steps) {
        let x = x1 + t * (x2 - x1);
        let y = y1 + t * (y2 - y1);
        points.push({x, y});
    }

    return points;
}


function twoNearestPoints(x,y,character){
    

    let distance = Math.sqrt(Math.pow(x - character.x1, 2) + Math.pow(y - character.y1, 2));
    let p1 = {d: distance, x: character.x1, y: character.y1};
    distance = Math.sqrt(Math.pow(x - character.x2, 2) + Math.pow(y - character.y2, 2));
    let p2 = {d: distance, x: character.x2, y: character.y2};
    distance = Math.sqrt(Math.pow(x - character.x3, 2) + Math.pow(y - character.y3, 2));
    let p3 = {d: distance, x: character.x3, y: character.y3};
    distance = Math.sqrt(Math.pow(x - character.x4, 2) + Math.pow(y - character.y4, 2));
    let p4 = {d: distance, x: character.x4, y: character.y4};
    
    

    let distances = [p1, p2, p3, p4];
    
    let min1 = {d: Infinity, x: null, y: null};
    let min2 = {d: Infinity, x: null, y: null};
    for(let i = 0; i < distances.length; i++){
        if(distances[i].d < min1.d){
            
            min1 = { ...distances[i] };
            distances[i].d = Infinity;
        }
    }
    
   
    
    for(let i = 0; i < distances.length; i++){
        if(distances[i].d < min2.d){
            min2 = { ...distances[i] };
            distances[i].d = Infinity;
        }
    }
    return [min1, min2];
}

async function getCharacters(req, res){
    try{
        const {rows} = await pool.query('SELECT * FROM characters;');
        res.json({
            success: true,
            result: rows
        })
    }catch (err) {
        res.json({ success: false, msg: err });
    }
}

async function checkValid(req, res) {
    const {x, y, r, characterId} = req.body; 
    
    
    try {
        const {rows} = await pool.query('SELECT * FROM characters ch JOIN contours co ON ch.contour_id=co.id WHERE ch.id = $1;', [characterId]);
        
        const twoNearestP = twoNearestPoints(x,y,rows[0]);
        
        const lineSegment = getLineSegment(twoNearestP[0].x, twoNearestP[0].y, twoNearestP[1].x, twoNearestP[1].y, 10);
        

        let result = false;
        let distance = null;
        for(let i = 0; i < lineSegment.length && !result; i++){
            distance = Math.sqrt(Math.pow(x - lineSegment[i].x, 2) + Math.pow(y - lineSegment[i].y, 2));
            if( distance != null && distance < r){
                result = true;
            }
        }

        res.json({ success: result});

    } catch (err) {
        res.json({ success: false, msg: err });
    }
} 

async function createWinner(req, res){
    const {username, time} = req.body;
    
    try{
        await pool.query('INSERT INTO scores(user_name, time) VALUES ($1, $2);', [username, time]);
        
        res.json({
            success: true
        })
    }catch (err) {
        res.json({ success: false, msg: err });
    }
}

async function getWinners(req, res){
    try{
        const {rows} = await pool.query('SELECT * FROM scores');
        res.json({
            success: true,
            results: rows
        })
    }catch (err) {
        res.json({ success: false, msg: err });
    }
}

module.exports = {
    checkValid,
    getCharacters,
    createWinner,
    getWinners
}

