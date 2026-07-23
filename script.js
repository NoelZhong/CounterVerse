/*================================================

 COUNTERVERSE v3.0

 JAVASCRIPT
 PART 1/3

 ENGINE + SHIP

================================================*/


"use strict";



/*================================================
 CANVAS
================================================*/


const canvas =
document.getElementById("game");


const ctx =
canvas.getContext("2d");



function resize(){


    canvas.width =
    innerWidth;


    canvas.height =
    innerHeight;


}


addEventListener(
"resize",
resize
);


resize();







/*================================================
 GAME STATE
================================================*/


const game={


    started:false,


    paused:false,


    score:0,


    best:

    Number(

    localStorage.counterVerseBest

    )

    ||0,



    combo:1,


    counter:0,


    flash:0,


    flashColor:"#ffffff",


    shake:0


};







/*================================================
 UI
================================================*/


const scoreText =
document.getElementById("score");


const bestText =
document.getElementById("best");


const comboText =
document.getElementById("combo");



bestText.textContent=
game.best;







/*================================================
 START BUTTON
================================================*/


document
.getElementById("startButton")
.onclick=()=>{


    document
    .getElementById("startScreen")
    .style.display="none";


    game.started=true;


    requestAnimationFrame(loop);


};








/*================================================
 MULTIPLAYER NOTICE
================================================*/


document
.getElementById("multiplayerButton")
.onclick=()=>{


    alert(

    "🌐 CounterVerse Multiplayer\n\n" +

    "The multiplayer network is still being built.\n\n" +

    "Future update:\n" +

    "🚀 Shared ships\n" +

    "🌌 Shared Counter Core\n" +

    "💥 Shared explosions"

    );


};









/*================================================
 INPUT
================================================*/


const keys={};



onkeydown=e=>{


    keys[e.key]=true;



    if(e.key==="Escape")

        togglePause();


};



onkeyup=e=>{


    keys[e.key]=false;


};








/*================================================
 SHIP
================================================*/


const ship={



    x:0,


    y:0,


    angle:-Math.PI/2,


    speed:0,


    maxSpeed:350,


    turnSpeed:4,


    thrust:190


};






function resetShip(){


    ship.x=

    canvas.width/2;


    ship.y=

    canvas.height*.75;


}



resetShip();








function updateShip(dt){



    if(

    keys["a"]

    ||

    keys["ArrowLeft"]

    )

    ship.angle-=

    ship.turnSpeed*dt;






    if(

    keys["d"]

    ||

    keys["ArrowRight"]

    )

    ship.angle+=

    ship.turnSpeed*dt;







    if(

    keys["w"]

    ||

    keys["ArrowUp"]

    ){



        ship.speed+=

        ship.thrust*dt;



        spawnParticle(

            ship.x,

            ship.y,

            "engine"

        );


    }







    if(keys[" "]){


        ship.speed-=

        250*dt;


    }







    ship.speed*=.985;



    ship.speed=Math.max(

    0,

    Math.min(

    ship.speed,

    ship.maxSpeed

    )

    );







    ship.x+=

    Math.cos(ship.angle)

    *

    ship.speed

    *

    dt;





    ship.y+=

    Math.sin(ship.angle)

    *

    ship.speed

    *

    dt;







    wrap(ship);



}








function drawShip(){



    ctx.save();



    ctx.translate(

        ship.x,

        ship.y

    );



    ctx.rotate(

        ship.angle

    );




    ctx.fillStyle="#58a6ff";



    ctx.shadowColor="#58a6ff";

    ctx.shadowBlur=25;




    ctx.beginPath();



    ctx.moveTo(25,0);


    ctx.lineTo(-15,-12);


    ctx.lineTo(-8,0);


    ctx.lineTo(-15,12);



    ctx.closePath();



    ctx.fill();



    ctx.shadowBlur=0;



    ctx.restore();


}









function wrap(obj){



    if(obj.x<0)

    obj.x=canvas.width;



    if(obj.x>canvas.width)

    obj.x=0;



    if(obj.y<0)

    obj.y=canvas.height;



    if(obj.y>canvas.height)

    obj.y=0;



}
/*================================================

 COUNTERVERSE v3.0

 PART 2/3

 CORE + PARTICLES

================================================*/





/*================================================
 STARFIELD
================================================*/


const stars=[];


for(let i=0;i<180;i++){


    stars.push({

        x:
        Math.random()*canvas.width,


        y:
        Math.random()*canvas.height,


        size:
        Math.random()*2+0.5,


        speed:
        Math.random()*20+5


    });


}







function updateStars(dt){


    for(let s of stars){


        s.y+=s.speed*dt;



        if(s.y>canvas.height){


            s.y=0;

            s.x=
            Math.random()*canvas.width;


        }


    }


}






function drawStars(){



    ctx.fillStyle="#ffffff";



    for(let s of stars){


        ctx.globalAlpha=.55;



        ctx.beginPath();


        ctx.arc(

            s.x,

            s.y,

            s.size,

            0,

            Math.PI*2

        );


        ctx.fill();



    }



    ctx.globalAlpha=1;



}










/*================================================
 COUNTER CORE
================================================*/


const core={


    x:

    canvas.width/2,


    y:

    canvas.height/2,


    vx:30,


    vy:20,


    radius:55,


    pulse:0


};







function updateCore(dt){



    core.x+=

    core.vx*dt;



    core.y+=

    core.vy*dt;






    if(

    core.x<120 ||

    core.x>

    canvas.width-120

    )

    core.vx*=-1;





    if(

    core.y<120 ||

    core.y>

    canvas.height-120

    )

    core.vy*=-1;





    core.pulse+=dt;



}







function drawCore(){



    let glow=

    Math.sin(core.pulse*5)*10;






    ctx.beginPath();



    ctx.arc(

        core.x,

        core.y,

        130+glow,

        0,

        Math.PI*2

    );



    ctx.fillStyle=

    "rgba(88,166,255,.08)";



    ctx.fill();








    ctx.beginPath();



    ctx.arc(

        core.x,

        core.y,

        core.radius+glow/3,

        0,

        Math.PI*2

    );



    ctx.fillStyle="#58a6ff";



    ctx.shadowColor="#58a6ff";

    ctx.shadowBlur=50;



    ctx.fill();



    ctx.shadowBlur=0;



}









/*================================================
 PARTICLES
================================================*/


const particles=[];







function spawnParticle(

x,

y,

type="normal",

power=1

){



    if(particles.length>800)

    return;






    let angle=

    Math.random()*Math.PI*2;



    let speed=

    (

    Math.random()*100+40

    )

    *

    power;





    if(type==="boom")

    speed*=3;






    particles.push({



        x:x,


        y:y,



        vx:

        Math.cos(angle)*speed,



        vy:

        Math.sin(angle)*speed,



        life:1,



        size:

        type==="boom"

        ?

        Math.random()*8+3

        :

        Math.random()*5+2,



        type:type



    });



}








function updateParticles(dt){



    for(

    let i=particles.length-1;

    i>=0;

    i--

    ){



        let p=

        particles[i];







        // gravity pull



        let dx=

        core.x-p.x;



        let dy=

        core.y-p.y;



        let distance=

        Math.hypot(dx,dy);






        if(distance>40){



            let force=

            120/distance;



            p.vx+=

            dx/distance*

            force*

            dt;



            p.vy+=

            dy/distance*

            force*

            dt;



        }








        p.x+=

        p.vx*dt;



        p.y+=

        p.vy*dt;








        p.vx*=.985;

        p.vy*=.985;







        p.life-=

        p.type==="boom"

        ?

        dt*2

        :

        dt*.6;








        if(p.life<=0){


            particles.splice(i,1);


        }



    }






    // random space particles


    if(Math.random()<.02){


        spawnParticle(

            Math.random()*canvas.width,

            Math.random()*canvas.height,

            "normal"

        );


    }



}








function drawParticles(){



    for(let p of particles){



        ctx.globalAlpha=p.life;





        if(p.type==="engine"){


            ctx.fillStyle="#ff9900";


        }

        else if(p.type==="plus"){


            ctx.fillStyle="#2ecc71";


        }

        else if(p.type==="minus"){


            ctx.fillStyle="#ff4d4d";


        }

        else if(p.type==="boom"){


            ctx.fillStyle="#ffd43b";


        }

        else{


            ctx.fillStyle="#58a6ff";


        }






        ctx.beginPath();



        ctx.arc(

            p.x,

            p.y,

            p.size,

            0,

            Math.PI*2

        );



        ctx.fill();



    }



    ctx.globalAlpha=1;


}
/*================================================

 COUNTERVERSE v3.0

 PART 3/3

 GAME SYSTEMS + LOOP

================================================*/






/*================================================
 SCORE
================================================*/


function addScore(amount){



    const now=

    Date.now();





    if(

    now-game.lastScoreTime

    <

    1200

    ){


        game.combo=

        Math.min(

            game.combo+1,

            10

        );


    }

    else{


        game.combo=1;


    }



    game.lastScoreTime=

    now;






    game.score+=

    amount*

    game.combo;







    if(game.score>game.best){


        game.best=

        game.score;



        localStorage.counterVerseBest=

        game.best;


    }






    scoreText.textContent=

    Math.floor(game.score);



    bestText.textContent=

    game.best;



    comboText.textContent=

    "x"+game.combo;



}









/*================================================
 COUNTER BUTTONS
================================================*/


function changeCounter(amount){



    game.counter+=amount;



    document

    .getElementById("count")

    .textContent=

    game.counter;







    document

    .getElementById("coreValue")

    .textContent=

    game.counter;






    addScore(1);






    game.flash=.25;



    game.flashColor=

    amount>0

    ?

    "#2ecc71"

    :

    "#ff4d4d";







    for(let i=0;i<40;i++){



        spawnParticle(

            core.x,

            core.y,

            amount>0

            ?

            "plus"

            :

            "minus",

            1.5

        );


    }



}






document

.getElementById("plus")

.onclick=()=>{

    changeCounter(1);

};





document

.getElementById("minus")

.onclick=()=>{

    changeCounter(-1);

};










/*================================================
 BOOM
================================================*/


function boom(){



    game.shake=40;



    game.flash=.7;



    game.flashColor="#ff9900";






    for(let i=0;i<500;i++){



        spawnParticle(

            core.x,

            core.y,

            "boom",

            2

        );


    }



    addScore(25);



}






document

.getElementById("boom")

.onclick=boom;









/*================================================
 CLEAN
================================================*/


document

.getElementById("clean")

.onclick=()=>{


    particles.length=0;



    game.flash=.2;



    game.flashColor="#ffffff";


};









/*================================================
 PAUSE
================================================*/


function togglePause(){



    game.paused=

    !game.paused;



    document

    .getElementById("pause")

    .textContent=


    game.paused

    ?

    "▶ RESUME"

    :

    "⏸ PAUSE";



}





document

.getElementById("pause")

.onclick=

togglePause;










/*================================================
 MULTIPLAYER MESSAGE
================================================*/


document

.getElementById("multiplayerButton")

.onclick=()=>{


    alert(

    "🌐 CounterVerse Multiplayer\n\n"+

    "The network is still under construction.\n\n"+

    "Coming soon:\n\n"+

    "🚀 Player ships\n"+

    "🌌 Shared Counter Core\n"+

    "💥 Shared events"

    );


};









/*================================================
 FINAL LOOP
================================================*/


let lastTime=0;






function loop(time){



    let dt=

    (time-lastTime)

    /

    1000;



    lastTime=time;





    dt=Math.min(

    dt,

    .033

    );








    if(!game.paused){



        updateStars(dt);



        updateShip(dt);



        updateCore(dt);



        updateParticles(dt);





        ctx.clearRect(

            0,

            0,

            canvas.width,

            canvas.height

        );






        if(game.shake>0){



            ctx.save();



            ctx.translate(

                Math.random()*game.shake,

                Math.random()*game.shake

            );



            game.shake*=.9;


        }





        drawStars();



        drawCore();



        drawParticles();



        drawShip();







        if(game.shake<1){



            ctx.restore();



            game.shake=0;


        }



    }








    // flash effect


    if(game.flash>0){



        ctx.fillStyle=

        game.flashColor;



        ctx.globalAlpha=

        game.flash;



        ctx.fillRect(

            0,

            0,

            canvas.width,

            canvas.height

        );



        ctx.globalAlpha=1;



        game.flash-=dt*2;


    }






    requestAnimationFrame(loop);



}
