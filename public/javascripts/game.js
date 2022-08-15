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
    map = await (await fetch("./worlds/map.json")).json()
    width = screen.width
    height = screen.height
    
    window.addEventListener("keydown",downKey)
    window.addEventListener("keyup",upKey)

    entities = {
        "player":await (await fetch("./entities/player.json")).json()
    }
    entities.player.pos.x=map.playerspawn.x
    entities.player.pos.y=map.playerspawn.y

    
    c2d.fillStyle="hsl(0,0%,0%)"
    c2d.fillRect(0,0,width,height)
    
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
    if(keys.includes("ShiftLeft")){
        entities.player.vel.x*=2
        entities.player.vel.y*=2
    }

    if(entities.player.vel.x>0){
        if(map.solid[map.map[Math.round(entities.player.pos.y-entities.player.size.y/2)][Math.round(entities.player.pos.x+entities.player.size.x/2+entities.player.vel.x*delta)]]||
        map.solid[map.map[Math.round(entities.player.pos.y+entities.player.size.y/2)][Math.round(entities.player.pos.x+entities.player.size.x/2+entities.player.vel.x*delta)]]){
            entities.player.vel.x=0
        }
    }
    if(entities.player.vel.x<0){
        if(map.solid[map.map[Math.round(entities.player.pos.y-entities.player.size.y/2)][Math.round(entities.player.pos.x-entities.player.size.x/2+entities.player.vel.x*delta)]]||
        map.solid[map.map[Math.round(entities.player.pos.y+entities.player.size.y/2)][Math.round(entities.player.pos.x-entities.player.size.x/2+entities.player.vel.x*delta)]]){
            entities.player.vel.x=0
        }
    }
    if(entities.player.vel.y>0){
        if(map.solid[map.map[Math.round(entities.player.pos.y+entities.player.size.y/2+entities.player.vel.y*delta)][Math.round(entities.player.pos.x-entities.player.size.x/2)]]||
        map.solid[map.map[Math.round(entities.player.pos.y+entities.player.size.y/2+entities.player.vel.y*delta)][Math.round(entities.player.pos.x+entities.player.size.x/2)]]){
            entities.player.vel.y=0
        }
    }
    if(entities.player.vel.y<0){
        if(map.solid[map.map[Math.round(entities.player.pos.y-entities.player.size.y/2+entities.player.vel.y*delta)][Math.round(entities.player.pos.x-entities.player.size.x/2)]]||
        map.solid[map.map[Math.round(entities.player.pos.y-entities.player.size.y/2+entities.player.vel.y*delta)][Math.round(entities.player.pos.x+entities.player.size.x/2)]]){
            entities.player.vel.y=0
        }
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
                Math.floor(x*tilesize+width/2-camera.x),
                Math.floor(y*tilesize+height/2-camera.y),
                tilesize,
                tilesize)
        }
    }
}

function drawEntities(){
    c2d.fillStyle="hsl(20,100%,50%)"
    c2d.fillRect(width/2,height/2,tilesize,tilesize)
}