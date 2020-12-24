var PLAY = 1;
var END = 0;
var gameState = PLAY;
var background1, jump_sound, die_sound, checkpoint_sound;
var mario, mario_running, mario_collided;
var ground, invisibleGround, groundImage;

var brick, bricksGroup, brickImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;

var score = 0;

var gameOver, restart;


function preload() {
  mario = loadAnimation("mario00.png");
  mario_running =   loadAnimation("mario01.png","mario02.png", "mario03.png");
  mario_collided = loadAnimation("collided.png");
  
  background1 = loadImage("bg.png");
  groundImage = loadImage("ground2.png");
  
  jump_sound = loadSound("jump.mp3");
  die_sound = loadSound("die.mp3");
  checkpoint_sound = loadSound("checkPoint.mp3");
  
  bricksImage = loadImage("brick.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png"); 
}

function setup() {
  createCanvas(600, 400);
  
 
    
  
  mario = createSprite(100,300,100,100);
  mario.addAnimation("running", mario_running);
  mario.addAnimation("collided", mario_collided);
  mario.scale = 1.2;
  
  
   brick = createSprite(600,100,40,10);
  brick.y = Math.round(random(250,320));
    brick.addImage(bricksImage);
    brick.scale = 0.75;
    brick.velocityX = -3;
  
  
 
  
  ground = createSprite(200,380,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,200);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,240);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,390,400,10);
  invisibleGround.visible = false;
  
  bricksGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {

  background(background1);
  text("Score: "+ score, 500,50);
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(4 + 3*score/100);
    //change the mario  animation
    mario.changeAnimation("running", mario_running);
    
    if(keyDown("space") && mario.y >= 259) {
      mario.velocityY = -12;
    jump_sound.play();
    } 
   
    mario.velocityY = mario.velocityY + 0.8; 
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    } 
  
    mario.collide(ground);
    
    spawnBricks();
    
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(mario)){
        gameState = END;
        die_sound.play();
     
    }
    
    if(mario.isTouching(brick)){
        brick.destroy();
          brick = createSprite(600,100,40,10);
          brick.visible = false;
    }
    
    if(score>0 && score%100 ===0){
      checkpoint_sound.play();
    }
    
  }
  else if (gameState === END) {   
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    bricksGroup.setVelocityXEach(0);
    
    //change the mario animation
    mario.changeAnimation("collided",mario_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    bricksGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnBricks() {
 
  //write code here to spawn the clouds
  if (frameCount %80 === 0) {
   
    brick.y = Math.round(random(250,320));
    brick.addImage(bricksImage);
    brick.visible = true;
    brick.scale = 0.75;
    brick.velocityX = -3;
    
     //assign lifetime to the variable
    brick.lifetime = 300;
    
    //adjust the depth
     brick.depth = mario.depth;
    brick.depth = mario.depth + 1;
    
    //add each cloud to the group
    bricksGroup.add(brick);
  }
  
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
 bricksGroup.destroyEach();
  score = 0;
}

function spawnObstacles() {
  if(frameCount %60 === 0) {
    obstacle = createSprite(600,325,10,40);
    obstacle.velocityX = -(6 + score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.75;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

