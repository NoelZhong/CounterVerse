// =====================================================
// CounterVerse v4.0
// Milestone 3 - Universe Effects
// Part 1/2
// =====================================================


// ===============================
// Canvas
// ===============================

const canvas =
document.getElementById("gameCanvas");

const ctx =
canvas.getContext("2d");



function resizeCanvas(){

    canvas.width =
    window.innerWidth;

    canvas.height =
    window.innerHeight;

}


window.addEventListener(
"resize",
resizeCanvas
);

resizeCanvas();



// ===============================
// UI
// ===============================

const startScreen =
document.getElementById("startScreen");

const playButton =
document.getElementById("playButton");


const scoreText =
document.getElementById("score");

const bestText =
document.getElementById("best");

const comboText =
document.getElementById("combo");


const counterValue =
document.getElementById("counterValue");


const stabilityFill =
document.getElementById("stabilityFill");


const stabilityText =
document.getElementById("stabilityText");



const plusButton =
document.getElementById("plus");


const minusButton =
document.getElementById("minus");


const boomButton =
document.getElementById("boom");


const sweepButton =
document.getElementById("sweep");


const pauseButton =
document.getElementById("pause");



// ===============================
// Game
// ===============================

let gameRunning=false;

let paused=false;



let score=0;

let best=
Number(
localStorage.getItem(
"counterVerseBest"
)
)||0;


let combo=1;

let counter=0;

let stability=70;



// ===============================
// Camera
// ===============================

const camera={

    x:0,
    y:0

};



// ===============================
// Ship
// ===============================

const ship={

    x:0,
    y:0,

    vx:0,
    vy:0,

    angle:-Math.PI/2,

    radius:18,

    thrust:320,

    turnSpeed:3.5

};



// ===============================
// Core
// ===============================

const core={

    x:0,
    y:0,

    vx:35,
    vy:-25,

    radius:55,

    mass:80000

};



// ===============================
// Particles
// ===============================

let particles=[];



function spawnParticle(
x,
y,
color,
amount=1
){


    for(
    let i=0;
    i<amount;
    i++
    ){


        particles.push({

            x:x,

            y:y,

            vx:
            (Math.random()-.5)
            *300,


            vy:
            (Math.random()-.5)
            *300,


            life:1,


            size:
            Math.random()*4+2,


            color:color

        });


    }


}



function updateParticles(dt){


    for(
    let i=particles.length-1;
    i>=0;
    i--
    ){


        const p =
        particles[i];


        p.x += p.vx*dt;

        p.y += p.vy*dt;


        p.life -= dt;


        if(p.life<=0){

            particles.splice(i,1);

        }


    }


}



// ===============================
// Input
// ===============================

const keys={};


window.addEventListener(
"keydown",
e=>keys[e.code]=true
);


window.addEventListener(
"keyup",
e=>keys[e.code]=false
);



// ===============================
// Reset
// ===============================

function resetWorld(){


    ship.x=
    canvas.width/2;


    ship.y=
    canvas.height*.75;


    ship.vx=0;

    ship.vy=0;



    core.x=
    canvas.width/2;


    core.y=
    canvas.height/2;



    score=0;

    combo=1;

    counter=0;

    stability=70;


    particles=[];



    updateHUD();

}



// ===============================
// Start
// ===============================

playButton.onclick=()=>{


    resetWorld();


    gameRunning=true;


    startScreen.style.display="none";


};
// =====================================================
// CounterVerse v4.0
// Milestone 3 - Universe Effects
// Part 2/2
// =====================================================


// ===============================
// Ship Physics
// ===============================

function applyGravity(body){

    const dx =
    core.x-body.x;

    const dy =
    core.y-body.y;


    const distance =
    Math.sqrt(
        dx*dx+
        dy*dy
    );


    if(distance < 1)
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



function updateShip(dt){


    if(keys["ArrowLeft"] ||
       keys["KeyA"])
    {
        ship.angle -=
        ship.turnSpeed*dt;
    }


    if(keys["ArrowRight"] ||
       keys["KeyD"])
    {
        ship.angle +=
        ship.turnSpeed*dt;
    }


    if(keys["ArrowUp"] ||
       keys["KeyW"])
    {

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
// Core
// ===============================

function updateCore(dt){

    core.x += core.vx*dt;

    core.y += core.vy*dt;


}



// ===============================
// Abilities
// ===============================

boomButton.onclick=()=>{


    spawnParticle(
        core.x,
        core.y,
        "#ff8c00",
        180
    );


    stability =
    Math.max(
        0,
        stability-15
    );


};



sweepButton.onclick=()=>{


    particles.forEach(p=>{


        p.vx*=0.2;

        p.vy*=0.2;


    });


};



pauseButton.onclick=()=>{


    paused=!paused;


    pauseButton.textContent =
    paused
    ?
    "▶ RESUME"
    :
    "⏸ PAUSE";


};



// ===============================
// Counter Effects
// ===============================

plusButton.onclick=()=>{


    counter++;

    combo++;

    score+=combo;


    stability =
    Math.min(
        100,
        stability+3
    );


    spawnParticle(
        core.x,
        core.y,
        "#00ff66",
        35
    );


    updateHUD();

};



minusButton.onclick=()=>{


    counter--;

    combo=1;


    stability =
    Math.max(
        0,
        stability-3
    );


    spawnParticle(
        core.x,
        core.y,
        "#ff3333",
        35
    );


    updateHUD();

};



// ===============================
// Camera
// ===============================

function updateCamera(){


    camera.x +=
    (
        ship.x-
        canvas.width/2-
        camera.x
    )*.08;



    camera.y +=
    (
        ship.y-
        canvas.height/2-
        camera.y
    )*.08;


}



// ===============================
// Score
// ===============================

function updateScore(dt){


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
            "counterVerseBest",
            best
        );

    }

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


    counterValue.textContent =
    counter;


    stabilityFill.style.width =
    stability+"%";


    stabilityText.textContent =
    stability>75
    ?
    "Stable"
    :
    stability>40
    ?
    "Unstable"
    :
    "Critical";


}



// ===============================
// Drawing
// ===============================

function drawBackground(){


    ctx.fillStyle="#020611";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


}



function drawCore(){


    const x=
    core.x-camera.x;


    const y=
    core.y-camera.y;



    ctx.shadowBlur=40;

    ctx.shadowColor="#00e5ff";


    ctx.fillStyle="#00e5ff";


    ctx.beginPath();


    ctx.arc(
        x,
        y,
        core.radius,
        0,
        Math.PI*2
    );


    ctx.fill();


    ctx.shadowBlur=0;


}



function drawShip(){


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



function drawParticles(){


    for(const p of particles){


        ctx.globalAlpha =
        p.life;


        ctx.fillStyle =
        p.color;


        ctx.beginPath();


        ctx.arc(
            p.x-camera.x,
            p.y-camera.y,
            p.size,
            0,
            Math.PI*2
        );


        ctx.fill();


    }


    ctx.globalAlpha=1;


}



// ===============================
// Game Loop
// ===============================

let lastTime=0;


function gameLoop(time){


    const dt =
    Math.min(
        (time-lastTime)/1000,
        .05
    );


    lastTime=time;



    if(gameRunning && !paused){


        updateShip(dt);

        updateCore(dt);

        updateParticles(dt);

        updateCamera();

        updateScore(dt);

        updateHUD();


    }



    drawBackground();



    if(gameRunning){

        drawCore();

        drawShip();

        drawParticles();

    }



    requestAnimationFrame(gameLoop);


}



// ===============================
// Launch
// ===============================

resetWorld();

requestAnimationFrame(gameLoop);
// =====================================================
// CounterVerse v4.0
// Milestone 3A - Physics Stabilization
// Part 2/2
// =====================================================


// ===============================
// Core Update
// ===============================

function updateCore(dt){


    core.x += core.vx * dt;

    core.y += core.vy * dt;



    // soft boundary correction
    // keeps the Core in the universe area

    const margin = 3000;


    if(core.x < -margin ||
       core.x > canvas.width + margin){

        core.vx *= -1;

    }


    if(core.y < -margin ||
       core.y > canvas.height + margin){

        core.vy *= -1;

    }


}



// ===============================
// Camera Follow
// Camera ONLY changes view
// ===============================

function updateCamera(){


    const targetX =
    ship.x -
    canvas.width/2;


    const targetY =
    ship.y -
    canvas.height/2;



    camera.x +=
    (targetX-camera.x)
    *
    camera.smooth;


    camera.y +=
    (targetY-camera.y)
    *
    camera.smooth;


}



// ===============================
// Safety Check
// ===============================

function checkObject(object){


    if(
        !Number.isFinite(object.x) ||
        !Number.isFinite(object.y) ||
        !Number.isFinite(object.vx) ||
        !Number.isFinite(object.vy)
    ){

        resetWorld();

    }


}



// ===============================
// Stars
// ===============================

const stars=[];


function createStars(){


    for(let i=0;i<300;i++){


        stars.push({

            x:
            Math.random()*6000-3000,


            y:
            Math.random()*6000-3000,


            size:
            Math.random()*2+0.5

        });


    }


}


createStars();



// ===============================
// Drawing
// ===============================

function drawBackground(){


    ctx.fillStyle =
    "#020611";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );



    ctx.save();



    ctx.translate(
        -camera.x*0.15,
        -camera.y*0.15
    );



    for(const star of stars){


        ctx.fillStyle =
        "white";


        ctx.globalAlpha =
        0.4 +
        Math.random()*0.6;



        ctx.beginPath();


        ctx.arc(
            star.x,
            star.y,
            star.size,
            0,
            Math.PI*2
        );


        ctx.fill();


    }


    ctx.globalAlpha=1;


    ctx.restore();


}



// ===============================
// Draw Core
// ===============================

function drawCore(){


    const x =
    core.x-camera.x;


    const y =
    core.y-camera.y;



    ctx.shadowBlur=60;

    ctx.shadowColor =
    "#00e5ff";


    ctx.fillStyle =
    "#00e5ff";



    ctx.beginPath();


    ctx.arc(
        x,
        y,
        core.radius,
        0,
        Math.PI*2
    );


    ctx.fill();



    ctx.shadowBlur=0;


}



// ===============================
// Draw Ship
// ===============================

function drawShip(){


    const x =
    ship.x-camera.x;


    const y =
    ship.y-camera.y;



    ctx.save();


    ctx.translate(
        x,
        y
    );


    ctx.rotate(
        ship.angle
    );



    ctx.fillStyle =
    "#ffffff";



    ctx.beginPath();


    ctx.moveTo(
        28,
        0
    );


    ctx.lineTo(
        -18,
        -12
    );


    ctx.lineTo(
        -8,
        0
    );


    ctx.lineTo(
        -18,
        12
    );


    ctx.closePath();


    ctx.fill();



    ctx.restore();


}



// ===============================
// Game Loop
// ===============================

let lastTime=0;


function gameLoop(time){


    const dt =
    Math.min(
        (time-lastTime)/1000,
        0.05
    );


    lastTime=time;



    if(gameRunning && !paused){


        updateShip(dt);


        updateCore(dt);


        updateCamera();


        checkObject(ship);


        checkObject(core);


    }



    drawBackground();



    if(gameRunning){


        drawCore();


        drawShip();


    }



    requestAnimationFrame(
        gameLoop
    );


}



// ===============================
// Start
// ===============================

resetWorld();


requestAnimationFrame(
gameLoop
);
