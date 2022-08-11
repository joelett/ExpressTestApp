let lastTime = Date.now()

let map
let camera = {x:0,y:0}
let tilesize = 25
let width
let height

let entities = []

async function init(){
    let screen = document.getElementById("screen")
    c2d = screen.getContext('2d');
    map = await (await fetch("./map.json")).json()
    width = screen.width
    height = screen.height
    
    window.addEventListener("keydown",downKey)
    window.addEventListener("keyup",upKey)

    entities = {
        "player":await (await fetch("./entities/player.json")).json()
    }
    entities.player.pos.x=map.playerspawn.x
    entities.player.pos.y=map.playerspawn.y


    gameloop()
}
addEventListener("DOMContentLoaded",init)

function gameloop(){
    let thisTime = Date.now()
    let delta = (thisTime-lastTime)/1000
    lastTime = thisTime

    update(delta)

    draw()

    let t = setTimeout(gameloop,10)
}


////////////////////////////////////////////////////
//Retrieve inputs

let keys = []

function downKey(event){
    if(!keys.includes(event.code)){
        keys.push(event.code)
    }
}
function upKey(event){
    for(let i = 0; i<keys.length;i++){
        if(keys[i]==event.code){
            keys.splice(i,1)
        }
    }
}


/////////////////////////////////////////////////////
//Update the Game objects

function update(delta){
    entities.player.vel.x = 0
    entities.player.vel.y = 0

    if(keys.includes("KeyW")){
        entities.player.vel.y=-entities.player.speed
    }
    if(keys.includes("KeyA")){
        entities.player.vel.x=-entities.player.speed
    }
    if(keys.includes("KeyS")){
        entities.player.vel.y=entities.player.speed
    }
    if(keys.includes("KeyD")){
        entities.player.vel.x=entities.player.speed
    }


    if(map.solid[map.map[Math.round(entities.player.pos.y+0.5)][Math.round(entities.player.vel.x*delta+entities.player.pos.x+0.5)]]){
        entities.player.vel.x=0
    }//Math.floor(entities.player.vel.y*delta+entities.player.pos.y)+1
    if(map.solid[map.map[Math.round(entities.player.vel.y*delta+entities.player.pos.y+0.5)][Math.round(entities.player.pos.x+0.5)]]){
        entities.player.vel.y=0
    }

    entities.player.pos.x+=entities.player.vel.x*delta
    entities.player.pos.y+=entities.player.vel.y*delta


    camera.x=entities.player.pos.x*tilesize
    camera.y=entities.player.pos.y*tilesize
}














////////////////////////////////////////////////////
//Show stuff on screen
let c2d

function draw(){
    drawMap()
    drawEntities()
}

function drawMap(){
    for(let y=0; y<map.map.length; y++){
        for(let x=0;x<map.map[y].length;x++){
            c2d.fillStyle=map.colors[map.map[y][x]]
            c2d.fillRect(
                x*tilesize+width/2-camera.x,
                y*tilesize+height/2-camera.y,
                tilesize,
                tilesize)
        }
    }
}

function drawEntities(){
    c2d.fillStyle="hsl(20,100%,50%)"
    c2d.fillRect(width/2,height/2,tilesize,tilesize)
}