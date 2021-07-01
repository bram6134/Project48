var score=0;
var gameState = 1;
var coinGroup, coinImg;
var obstacleGroup
var obstacle1, obstacle2, obstacle3;
var gameOverImg, gameOver
var restart, restartImg;
var dead, coinSound, theJump;

function preload() {
  bg = loadImage("NewBackground.png")
  bg2 = loadImage("treasure.jpg")
  marioAnimation = loadAnimation("Capture1.png", "Capture3.png", "Capture4.png")
  dead = loadAnimation("mariodead.png","mariodead.png");
  coinImg = loadImage("coin.png")
  obstacle1 = loadImage("obstacle1.png")
  obstacle2 = loadImage("obstacle2.png")
  obstacle3 = loadImage("obstacle3.png")
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  coinSound = loadSound("coin.wav")
}

function setup() {
  createCanvas(1000,500);
  forBackground = createSprite(0, 0, 1000, 500);
  forBackground.addImage(bg);
  //forBackground.scale = 0.8;
  forBackground.x = forBackground.width/2;
  forBackground.velocityX = -5;

  mario = createSprite(100, 400, 10, 10);
  mario.addAnimation("running",marioAnimation)
  mario.setCollider("rectangle", 0, 0, 110, mario.height)
  mario.addAnimation("collided",dead)
  //mario.debug = true

  ground = createSprite(500, 455, 1000, 25);
  ground.visible = false;

  coinGroup = new Group()
  obstacleGroup = new Group();

  gameOver = createSprite(500, 250, 50, 50);
  gameOver.addImage(gameOverImg)
  gameOver.visible = false;

  restart = createSprite(500, 300, 50, 50);
  restart.addImage(restartImg)
  restart.visible = false;
}

function draw() {
  if(gameState===1){

    forBackground.velocityX = -(5+(score/8));

    if(forBackground.x<0){
      forBackground.x=0;
      forBackground.x = forBackground.width/2;
    }

    if(keyDown("space") && mario.y >= 350){
      mario.velocityY =- 25
    }

    mario.velocityY += 0.8;
    mario.collide(ground);
    if(mario.isTouching(coinGroup)){
      coinGroup.destroyEach();
      coinSound.play();
      score+=1;
    }

    if(mario.isTouching(obstacleGroup)){
      gameState = 2;
    }

    if(score===16){
      background(bg2)
      forBackground.visible = false;
      obstacleGroup.destroyEach()
      coinGroup.destroyEach()
      mario.visible = false;
      gameOver.visible = true;
      restart.visible = true;
      if(mousePressedOver(restart)){
        reset();
      }
      textSize(24)
      fill('yellow');
      text("YOU WIN",450,200)
    }

    Coins();
    Enemy();
  }

  if(gameState===2){
    mario.changeAnimation("collided",dead);
    gameOver.visible = true;
    restart.visible = true;
    forBackground.velocityX = 0
    mario.velocityY = 0;
    obstacleGroup.setLifetimeEach(-1);
    obstacleGroup.setVelocityXEach(0)
    coinGroup.setVelocityXEach(0)
    coinGroup.setLifetimeEach(-1);
    if(mousePressedOver(restart)){
      reset();
    }
  }
  drawSprites();
  fill('red');
  stroke('black')
  textSize(24);
  text("Score: " + score, 50, 50)
  text("(Try to get score 16)", 50, 100)
}

function Coins(){
  if(frameCount%225===0){
    var coin = createSprite(1000,250,50,50);
    coin.addImage(coinImg);
    coin.velocityX = -(4+(score/8));
    coin.lifetime = 300;
    coin.scale = 0.13;
    coinGroup.add(coin);
    coin.depth=mario.depth;
    mario.depth=mario.depth+1;
  }
}

function Enemy(){
  if(frameCount%125===0){
    var enemy = createSprite(1000,420,50,50);
    var rand = Math.round(random(1, 3));

    switch(rand){
      case 1: enemy.addImage(obstacle1);
      break;

      case 2: enemy.addImage(obstacle2);
      break;

      case 3: enemy.addImage(obstacle3);
      break;

      default: break;
    }

    enemy.velocityX = -(4+(score/8));
    enemy.lifetime = 300;
    enemy.scale = 0.3;
    obstacleGroup.add(enemy);
  }
}

function reset(){
  gameState = 1;
  gameOver.visible = false;
  restart.visible = false;
  mario.changeAnimation("running",marioAnimation);
  obstacleGroup.destroyEach();
  coinGroup.destroyEach();
  score = 0;
  forBackground.x = forBackground.width/2;
}