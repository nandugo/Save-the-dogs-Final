var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var dog, dog_running, dog_collided;
var bg, invisiblebg;

var carGroup, car1;

var score=0;

var gameOver, restart;

var house;

function preload(){
  dog_running =   loadAnimation("assets/dog1.png","assets/dog2.png","assets/dog3.png");
 dog_collided = loadAnimation("assets/dog1.png");
  bgImage = loadImage("assets/bg.png");
  car1 = loadImage("assets/car.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
  bone1=loadImage("assets/bone1.png");
  bone2=loadImage("assets/bone2.png");
  bone3=loadImage("assets/bone3.png");
  houseImg=loadImage("assets/house.png");

}

function setup() {
  createCanvas(800, 400);

  bg = createSprite(400,100,400,20);
  bg.addImage("bg",bgImage);
  bg.scale=0.3
  bg.x = width /2;

  dog = createSprite(20,6,20,50);
  dog.addAnimation("running", dog_running);
  dog.addAnimation("collided", dog_collided);
  dog.scale = 0.5;
  dog.setCollider("rectangle",20,20,110,dog.height); 
  dog.debug = false;
    
  invisibleGround = createSprite(400,400,1600,10);
  invisibleGround.visible = false;

  gameOver = createSprite(400,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(550,140);
  restart.addImage(restartImg);
  
  house=createSprite(600,200,50,300);
  house.addImage(houseImg);
  house.visible=false;

  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
  
  boneGroup = new Group();
  carsGroup = new Group();
  
  score = 0;

}

function draw() {
  background(255);

  
  
  dog.x=camera.position.x-270;
   
  if (gameState===PLAY){

    bg.velocityX=-3

    if(bg.x<100)
    {
       bg.x=400
    }

    dog.collide(invisibleGround);
   console.log(dog.y)
    if(keyDown("space")&& dog.y>270) {
      jumpSound.play();
      dog.velocityY = -16;
    }
  
    dog.velocityY = dog.velocityY + 0.8
    spawnbone();
    spawncars();

    dog.collide(invisibleGround);
    
    if(carsGroup.isTouching(dog)){
      collidedSound.play();
      gameState = END;
    }
    if(boneGroup.isTouching(dog)){
     score = score + 1;
      boneGroup.destroyEach();
    }

  
  }
  else if (gameState === END) {
    gameOver.x=camera.position.x;
    restart.x=camera.position.x;
    gameOver.visible = true;
    restart.visible = true;
    //set velcity of each game object to 0
    dog.velocityY = 0;
    bg.velocityX = 0;
    carsGroup.setVelocityXEach(0);
    boneGroup.setVelocityXEach(0);

    //change the trex animation
    dog.changeAnimation("collided",dog_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    carsGroup.setLifetimeEach(-1);
    boneGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
        reset();
    }
  }

  else if (gameState === WIN) {
    //set velcity of each game object to 0
    bg.velocityX = 0;
    dog.velocityY = 0;
    carsGroup.setVelocityXEach(0);
    boneGroup.setVelocityXEach(0);

    if(score=10){
      house.visible=true;
      dog.visible=true;
      }
    
    //change the dog animation
    dog.changeAnimation("collided",dog_collided);

    //set lifetime of the game objects so that they are never destroyed
    carsGroup.setLifetimeEach(-1);
    boneGroup.setLifetimeEach(-1);
  }
  
  
  drawSprites();

  textSize(20);
  stroke(3);
  fill("black");
  textFont("hana");
  text("Score: "+ score,20,20);
  
  if(score >= 5){
    dog.visible = false;
    textSize(30);
    stroke(3);
    fill("black");
    textFont("hobo");
    text("Congragulations!! Your dog is safe in this house!! ", 120,370);
    
    gameState = WIN;
  }
}

function spawnbone() {
  //write code here to spawn the clouds
  if (frameCount % 150 === 0) {

    var bone = createSprite(camera.position.x+500,330,40,10);

    bone.velocityX = -(6 + 3*score/100)
    bone.scale = 0.6;

    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: bone.addImage(bone1);
              break;
      case 2: bone.addImage(bone2);
              break;
             
      case 3: bone.addImage(bone3);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the bone           
    bone.scale = 0.3;
     //assign lifetime to the variable
    bone.lifetime = 400;
    
    bone.setCollider("rectangle",0,0,bone.width/2,bone.height/2)
    //add each cloud to the group
    boneGroup.add(bone);
    
  }
  
}

function spawncars() {
  if(frameCount % 120 === 0) {

    var car = createSprite(camera.position.x+400,330,40,40);
    car.setCollider("rectangle",0,0,200,200)
    car.addImage(car1);
    car.velocityX = -(6 + 3*score/100)
    car.scale = 0.2;
    //assign scale and lifetime to the car           

    car.lifetime = 400;
    //add each car to the group
    carsGroup.add(car);
    
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  dog.visible = true;
  dog.changeAnimation("running", dog_running);
  carsGroup.destroyEach();
  boneGroup.destroyEach();
  score = 0;
}