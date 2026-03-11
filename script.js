const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [];
let direction = "RIGHT";
let food = {};
let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;

let gameInterval;
let speed = 120;
let isPaused = false;

document.getElementById("highScore").innerText = highScore;

function initGame(){

snake = [
{x:10,y:10},
{x:9,y:10},
{x:8,y:10}
];

direction = "RIGHT";
score = 0;

spawnFood();

document.getElementById("score").innerText = score;

}

function spawnFood(){

food = {
x: Math.floor(Math.random()*tileCount),
y: Math.floor(Math.random()*tileCount)
};

}

function drawGame(){

if(isPaused) return;

moveSnake();

if(checkCollision()){
gameOver();
return;
}

drawBoard();
drawFood();
drawSnake();

}

function drawBoard(){

ctx.fillStyle = "black";
ctx.fillRect(0,0,canvas.width,canvas.height);

for(let i=0;i<tileCount;i++){

for(let j=0;j<tileCount;j++){

ctx.strokeStyle="#222";
ctx.strokeRect(i*gridSize,j*gridSize,gridSize,gridSize);

}

}

}

function drawSnake(){

for(let i=0;i<snake.length;i++){

ctx.fillStyle = i==0 ? "lime" : "green";

ctx.fillRect(
snake[i].x*gridSize,
snake[i].y*gridSize,
gridSize,
gridSize
);

}

}

function drawFood(){

ctx.fillStyle="red";

ctx.beginPath();

ctx.arc(
food.x*gridSize + gridSize/2,
food.y*gridSize + gridSize/2,
gridSize/2,
0,
Math.PI*2
);

ctx.fill();

}

function moveSnake(){

let head = {...snake[0]};

if(direction=="RIGHT") head.x++;
if(direction=="LEFT") head.x--;
if(direction=="UP") head.y--;
if(direction=="DOWN") head.y++;

snake.unshift(head);

if(head.x==food.x && head.y==food.y){

score++;

document.getElementById("score").innerText = score;

spawnFood();

if(speed>60){
speed -= 2;
clearInterval(gameInterval);
gameInterval = setInterval(drawGame,speed);
}

}else{

snake.pop();

}

}

function checkCollision(){

let head = snake[0];

if(head.x<0 || head.x>=tileCount ||
head.y<0 || head.y>=tileCount){

return true;

}

for(let i=1;i<snake.length;i++){

if(head.x==snake[i].x && head.y==snake[i].y){

return true;

}

}

return false;

}

function gameOver(){

clearInterval(gameInterval);

document.getElementById("gameOverScreen").style.display="block";

document.getElementById("finalScore").innerText = score;

if(score > highScore){

highScore = score;

localStorage.setItem("snakeHighScore",highScore);

}

document.getElementById("highScore").innerText = highScore;

}

function startGame(){

document.getElementById("gameOverScreen").style.display="none";

initGame();

clearInterval(gameInterval);

gameInterval = setInterval(drawGame,speed);

}

function pauseGame(){

isPaused = !isPaused;

}

function restartGame(){

location.reload();

}

document.addEventListener("keydown",function(e){

if(e.key=="ArrowUp" && direction!="DOWN"){
direction="UP";
}

if(e.key=="ArrowDown" && direction!="UP"){
direction="DOWN";
}

if(e.key=="ArrowLeft" && direction!="RIGHT"){
direction="LEFT";
}

if(e.key=="ArrowRight" && direction!="LEFT"){
direction="RIGHT";
}

});