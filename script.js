// =====================================================
// CounterVerse v4.0.0
// Core Engine
// =====================================================


// ===============================
// Canvas
// ===============================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


function resizeCanvas(){

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();



// ===============================
// Game State
// ===============================

let running = true;



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

const keys = {};


window.addEventListener(
"keydown",
e=>{

    keys[e.code]=true;

});


window.addEventListener(
"keyup",
e=>{

    keys[e.code]=false;

});



// ===============================
// Reset Universe
// ===============================

function resetWorld(){


    ship.x =
    canvas.width/2;


    ship.y =
    canvas.height*0.75;


    ship.vx=0;
    ship.vy=0;



    core.x =
    canvas.width/2;


    core.y =
    canvas.height/2;


    core.vx=40;
    core.vy=-20;



    camera.x=0;
    camera.y=0;


}


resetWorld();



// ===============================
// Gravity
// ===============================

function gravity(body){


    const dx =
    core.x-body.x;


    const dy =
    core.y-body.y;


    const distance =
    Math.sqrt(
        dx*dx+
        dy*dy
    );


    if(distance < 80)
        return;



    const force =
    core.mass /
    (distance*distance);



    body.vx +=
    (dx/distance)
    *
    force
    *
    0.016;


    body.vy +=
    (dy/distance)
    *
    force
    *
    0.016;


}



// ===============================
// Ship Update
// ===============================

function updateShip(dt){


    if(keys["ArrowLeft"] ||
       keys["KeyA"]){

        ship.angle -=
        ship.turnSpeed*dt;

    }


    if(keys["ArrowRight"] ||
       keys["KeyD"]){

        ship.angle +=
        ship.turnSpeed*dt;

    }



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



    gravity(ship);



    const speed =
    Math.sqrt(
        ship.vx*ship.vx+
        ship.vy*ship.vy
    );


    if(speed > ship.maxSpeed){

        ship.vx =
        (ship.vx/speed)
        *
        ship.maxSpeed;


        ship.vy =
        (ship.vy/speed)
        *
        ship.maxSpeed;

    }



    ship.x += ship.vx*dt;
    ship.y += ship.vy*dt;


}



// ===============================
// Core Update
// ===============================

function updateCore(dt){


    core.x +=
    core.vx*dt;


    core.y +=
    core.vy*dt;


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
    )*0.08;



    camera.y +=
    (
        ship.y -
        canvas.height/2 -
        camera.y
    )*0.08;


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



    // Core

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



    // Ship

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


    const dt =
    Math.min(
        (time-lastTime)/1000,
        0.05
    );


    lastTime=time;



    if(running){


        updateShip(dt);

        updateCore(dt);

        updateCamera();


    }



    draw();



    requestAnimationFrame(loop);


}



requestAnimationFrame(loop);
