// =====================================================
// CounterVerse v4.0.1
// Gameplay Update
// =====================================================


// ===============================
// Canvas
// ===============================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


function resizeCanvas(){

    canvas.width = innerWidth;
    canvas.height = innerHeight;

}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();



// ===============================
// UI
// ===============================

const scoreText =
document.getElementById("score");

const bestText =
document.getElementById("best");

const comboText =
document.getElementById("combo");

const counterText =
document.getElementById("counterValue");

const plusButton =
document.getElementById("plus");

const minusButton =
document.getElementById("minus");

const stabilityText =
document.getElementById("stabilityText");



// ===============================
// Game Data
// ===============================

let score = 0;

let best =
Number(localStorage.getItem("counterBest")) || 0;

let combo = 1;

let counter = 0;

let stability = 100;



// ===============================
// Camera
// ===============================

const camera = {

    x:0,
    y:0

};



// ===============================
// Ship
// ===============================

const ship = {

    x:0,
    y:0,

    vx:0,
    vy:0,

    angle:-Math.PI/2,

    thrust:250,

    turnSpeed:3.5,

    maxSpeed:700

};



// ===============================
// Gravity Core
// ===============================

const core = {

    x:0,
    y:0,

    vx:40,
    vy:-20,

    radius:55,

    mass:70000

};



// ===============================
// Input
// ===============================

const keys={};


addEventListener(
"keydown",
e=>keys[e.code]=true
);


addEventListener(
"keyup",
e=>keys[e.code]=false
);



// ===============================
// Reset
// ===============================

function resetWorld(){


    ship.x =
    canvas.width/2;


    ship.y =
    canvas.height*.75;


    ship.vx=0;

    ship.vy=0;



    core.x =
    canvas.width/2;


    core.y =
    canvas.height/2;


}


resetWorld();



// ===============================
// Counter Controls
// ===============================

plusButton.onclick=()=>{


    counter++;

    combo++;


    score += combo;


    stability =
    Math.min(
        100,
        stability+5
    );


    updateHUD();

};



minusButton.onclick=()=>{


    counter--;


    combo=1;


    stability =
    Math.max(
        0,
        stability-5
    );


    updateHUD();

};



// ===============================
// Gravity
// ===============================

function applyGravity(body){


    const dx =
    core.x-body.x;


    const dy =
    core.y-body.y;


    const distance =
    Math.hypot(dx,dy);



    if(distance < 80)
        return;



    const force =
    core.mass /
    (distance*distance);



    body.vx +=
    dx/distance *
    force *
    .016;


    body.vy +=
    dy/distance *
    force *
    .016;


}



// ===============================
// Ship Update
// ===============================

function updateShip(dt){


    if(keys["ArrowLeft"] ||
       keys["KeyA"])

        ship.angle -=
        ship.turnSpeed*dt;



    if(keys["ArrowRight"] ||
       keys["KeyD"])

        ship.angle +=
        ship.turnSpeed*dt;



    if(keys["ArrowUp"] ||
       keys["KeyW"]){

        ship.vx +=
        Math.cos(ship.angle)
        *
        ship.thrust
        *
        dt;


        ship.vy +=
        Math.sin(ship.angle)
        *
        ship.thrust
        *
        dt;

    }



    applyGravity(ship);



    ship.x += ship.vx*dt;

    ship.y += ship.vy*dt;


}



// ===============================
// Core Update
// ===============================

function updateCore(dt){

    core.x += core.vx*dt;

    core.y += core.vy*dt;

}



// ===============================
// Camera
// ===============================

function updateCamera(){


    camera.x +=
    (
        ship.x -
        canvas.width/2 -
        camera.x
    )*.08;



    camera.y +=
    (
        ship.y -
        canvas.height/2 -
        camera.y
    )*.08;


}



// ===============================
// HUD
// ===============================

function updateHUD(){


    scoreText.textContent =
    Math.floor(score);


    bestText.textContent =
    best;


    comboText.textContent =
    "x"+combo;


    counterText.textContent =
    counter;


    stabilityText.textContent =
    "Stability: "
    +
    Math.floor(stability)
    +
    "%";


}



// ===============================
// Drawing
// ===============================

function draw(){


    ctx.fillStyle="#020611";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );



    ctx.fillStyle="#00e5ff";

    ctx.beginPath();

    ctx.arc(
        core.x-camera.x,
        core.y-camera.y,
        core.radius,
        0,
        Math.PI*2
    );

    ctx.fill();



    ctx.save();


    ctx.translate(
        ship.x-camera.x,
        ship.y-camera.y
    );


    ctx.rotate(ship.angle);


    ctx.fillStyle="white";


    ctx.beginPath();

    ctx.moveTo(25,0);

    ctx.lineTo(-15,-12);

    ctx.lineTo(-5,0);

    ctx.lineTo(-15,12);

    ctx.closePath();

    ctx.fill();


    ctx.restore();


}



// ===============================
// Game Loop
// ===============================

let lastTime=0;


function loop(time){


    let dt =
    Math.min(
        (time-lastTime)/1000,
        .05
    );


    lastTime=time;



    updateShip(dt);

    updateCore(dt);

    updateCamera();


    score +=
    Math.hypot(
        ship.vx,
        ship.vy
    )
    *
    dt
    *
    .01;



    if(score>best){

        best=Math.floor(score);

        localStorage.setItem(
            "counterBest",
            best
        );

    }



    updateHUD();

    draw();


    requestAnimationFrame(loop);


}



requestAnimationFrame(loop);
