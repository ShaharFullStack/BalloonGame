// הגדרת הקנבס
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// מימדי העולם
const worldWidth = 3000;
const worldHeight = 940;

// טעינת תמונות
const images = {};
const imageSources = {
  background: 'assets/images/background2.png',
  hero_idle: 'assets/images/hero_idle.png',
  hero_jump: 'assets/images/hero_jump.png',
  orc: 'assets/images/orc.png',
  lizard: 'assets/images/lizard.png',
  coin: 'assets/images/coin.png',
  finish: 'assets/images/finish.png',
  platform: 'assets/images/platform.png',
  doublejump: 'assets/images/doublejump.png',
  checkpoint: 'assets/images/checkpoint.png',
  checkpoint_activated: 'assets/images/checkpoint_activated.png',
  invincibility: 'assets/images/invincibility.png'
};

let imagesLoaded = 0;
const totalImages = Object.keys(imageSources).length;

function loadImages(callback) {
  for (let key in imageSources) {
    images[key] = new Image();
    images[key].src = imageSources[key];
    images[key].onload = () => {
      imagesLoaded++;
      if (imagesLoaded === totalImages) callback();
    };
  }
}

// אובייקט השחקן
const player = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  width: 150,
  height: 180,
  isOnGround: true,
  lives: 3,
  score: 0,
  hasDoubleJump: false,
  onPlatform: null,
  dashAvailable: true,
  dashTimer: 0,
  dashCooldown: 0,
  invincible: false,
  invincibleTimer: 0,
  checkpoint: { x: 100, y: worldHeight - 100 }
};

// חלקיקים לאפקטים
const particles = [];

// עננים לפרלקס
const clouds = [
  { x: 100, y: 100, width: 200, height: 100, speed: 0.2 },
  { x: 600, y: 150, width: 250, height: 120, speed: 0.15 },
  { x: 1200, y: 80, width: 180, height: 90, speed: 0.25 }
];

// הגדרת השלבים
const levels = [
  {
    start: { x: 100, y: worldHeight - 250 },
    platforms: [
      { x: -600, y: worldHeight - 15, width: 2000, height: 45 },
      { x: 300, y: worldHeight - 20, width: 2000, height: 45 },
      { x: 200, y: worldHeight - 140, width: 200, height: 45 },
      { x: 500, y: worldHeight - 200, width: 200, height: 45 },
      { x: 800, y: worldHeight - 270, width: 200, height: 45 },
      { x: 1100, y: worldHeight - 200, width: 200, height: 45 },
      { x: 1500, y: worldHeight - 230, width: 200, height: 45 },
      { x: 1900, y: worldHeight - 230, width: 200, height: 45 },
      { x: 2300, y: worldHeight - 50, width: 700, height: 50 },
      { x: 700, y: worldHeight -400 , width: 100, height: 45, speed: 2, minX: 600, maxX: 1200, direction: 1 }
    ],
    enemies: [
      { x: 600, y: worldHeight - 300, width: 100, height: 150, type: 'orc', minX: 500, maxX: 700, speed: 1, direction: 1 },
      { x: 1200, y: worldHeight - 350, width: 100, height: 170, type: 'lizard', minX: 1100, maxX: 1300, speed: 1, direction: 1 }
    ],
    coins: [
      { x: 550, y: worldHeight - 230, width: 45, height: 45 },
      { x: 850, y: worldHeight - 300, width: 45, height: 45 },
      { x: 1150, y: worldHeight - 400, width: 45, height: 45 },
      { x: 1550, y: worldHeight - 300, width: 45, height: 45 },
      { x: 1950, y: worldHeight - 320, width: 45, height: 45 }
    ],
    powerups: [
      { x: 900, y: worldHeight - 550, width: 100, height: 100, type: 'doublejump' },
      { x: 1000, y: worldHeight - 300, width: 100, height: 100, type: 'invincibility' }
    ],
    checkpoints: [
      { x: 1300, y: worldHeight - 100, width: 100, height: 100, activated: false }
    ],
    finish: { x: 2800, y: worldHeight - 100, width: 600, height: 500 }
  },
  {
    background: 'assets/images/background.png',
    start: { x: 100, y: worldHeight - 250 },
    platforms: [
      { x: -700, y: worldHeight - 10, width: 2000, height: 20 },
      { x: 0, y: worldHeight - 10, width: 2000, height: 45 },
      { x: 100, y: worldHeight - 10, width: 200, height: 45 },
      { x: 300, y: worldHeight - 100, width: 200, height: 45 },
      { x: 600, y: worldHeight - 150, width: 200, height: 45 },
      { x: 900, y: worldHeight - 200, width: 200, height: 45 },
      { x: 1200, y: worldHeight - 250, width: 200, height: 45 },
      { x: 1500, y: worldHeight - 300, width: 200, height: 45 },
      { x: 1800, y: worldHeight - 350, width: 200, height: 45 },
      { x: 2100, y: worldHeight - 400, width: 200, height: 45 },
      { x: 2400, y: worldHeight - 450, width: 200, height: 45 },
      { x: 2700, y: worldHeight - 500, width: 300, height: 45 },
      { x: 1200, y: worldHeight - 300, width: 100, height: 45, speed: 2, minX: 1100, maxX: 2300, direction: 1 }
    ],
    enemies: [
      { x: 400, y: worldHeight - 200, width: 100, height: 100, type: 'orc', minX: 300, maxX: 500, speed: 1, direction: 1 },
      { x: 1000, y: worldHeight - 300, width: 100, height: 100, type: 'lizard', minX: 900, maxX: 1100, speed: 1, direction: 1 },
      { x: 1600, y: worldHeight - 400, width: 100, height: 100, type: 'orc', minX: 1500, maxX: 1700, speed: 1, direction: 1 }
    ],
    coins: [
      { x: 350, y: worldHeight - 150, width: 20, height: 20 },
      { x: 650, y: worldHeight - 200, width: 20, height: 20 },
      { x: 950, y: worldHeight - 250, width: 20, height: 20 },
      { x: 1250, y: worldHeight - 300, width: 20, height: 20 },
      { x: 1550, y: worldHeight - 350, width: 20, height: 20 },
      { x: 1850, y: worldHeight - 400, width: 20, height: 20 },
      { x: 2150, y: worldHeight - 450, width: 20, height: 20 },
      { x: 2450, y: worldHeight - 500, width: 20, height: 20 }
    ],
    powerups: [
      { x: 1500, y: worldHeight - 400, width: 30, height: 30, type: 'doublejump' }
    ],
    checkpoints: [
      { x: 1400, y: worldHeight - 50, width: 50, height: 50, activated: false }
    ],
    finish: { x: 2800, y: worldHeight - 750, width: 220, height: 160 }
  }
];

let currentLevel = 0;
let background, platforms, enemies, coins, powerups, checkpoints, finish;

// טעינת שלב
function loadLevel(levelIndex) {
  const level = levels[levelIndex];
  platforms = level.platforms;
  enemies = level.enemies.map(enemy => ({ ...enemy }));
  coins = level.coins.map(coin => ({ ...coin }));
  powerups = level.powerups.map(powerup => ({ ...powerup }));
  checkpoints = level.checkpoints.map(cp => ({ ...cp, activated: false }));
  finish = level.finish;
  player.x = level.start.x;
  player.y = level.start.y;
  player.vy = 0;
  player.isOnGround = true;
  player.hasDoubleJump = false;
  player.checkpoint = { ...level.start };
  player.dashAvailable = true;
  player.dashTimer = 0;
  player.dashCooldown = 0;
  player.invincible = false;
  player.invincibleTimer = 0;
  cameraX = 0;
  cameraY = 0;
}

// מצלמה
let cameraX = 0;
let cameraY = 0;

// קלט מהמשתמש
let leftPressed = false;
let rightPressed = false;
let jumpPressed = false;
let restartPressed = false;
let dashPressed = false;

// מצב המשחק
let gameState = 'playing'; 

// קבועים לפיזיקה
const gravity = 0.3;
const jumpSpeed = -12;
const moveSpeed = 5;
const dashSpeed = 15;
const dashDuration = 10; 
const dashCooldownTime = 60; 
const invincibilityDuration = 300; 

// מאזיני אירועים
window.addEventListener('keydown', (e) => {
  if (e.key === 'a') leftPressed = true;
  else if (e.key === 'd') rightPressed = true;
  else if (e.key === 'w') jumpPressed = true;
  else if (e.key === 'r') restartPressed = true;
  else if (e.key === 'Shift') dashPressed = true;
});
window.addEventListener('keyup', (e) => {
  if (e.key === 'a') leftPressed = false;
  else if (e.key === 'd') rightPressed = false;
  else if (e.key === 'w') jumpPressed = false;
  else if (e.key === 'r') restartPressed = false;
  else if (e.key === 'Shift') dashPressed = false;
});

function isColliding(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

function createParticles(x, y) {
  for (let i = 0; i < 10; i++) {
    particles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      alpha: 1,
      radius: Math.random() * 4 + 2
    });
  }
}

// עדכון מצב המשחק
function update() {
  if (restartPressed && gameState !== 'playing') {
    currentLevel = 0;
    loadLevel(currentLevel);
    gameState = 'playing';
    player.lives = 3;
    player.score = 0;
  }

  if (gameState !== 'playing') return;

  // עדכון פלטפורמות ניידות
  for (let platform of platforms) {
    if (platform.speed) {
      platform.x += platform.speed * platform.direction;
      if (platform.x < platform.minX) {
        platform.x = platform.minX;
        platform.direction = 1;
      } else if (platform.x + platform.width > platform.maxX) {
        platform.x = platform.maxX - platform.width;
        platform.direction = -1;
      }
      platform.deltaX = platform.speed * platform.direction;
    }
  }

  // עדכון דאש
  if (dashPressed && player.dashAvailable && (leftPressed || rightPressed)) {
    player.dashTimer = dashDuration;
    player.dashAvailable = false;
    player.vx = rightPressed ? dashSpeed : (leftPressed ? -dashSpeed : 0);
  }
  if (player.dashTimer > 0) {
    player.dashTimer--;
  } else if (!player.dashAvailable) {
    player.dashCooldown++;
    if (player.dashCooldown >= dashCooldownTime) {
      player.dashAvailable = true;
      player.dashCooldown = 0;
    }
  }

  // תנועת השחקן
  if (player.dashTimer <= 0) {
    player.vx = 0;
    if (leftPressed) player.vx = -moveSpeed;
    if (rightPressed) player.vx = moveSpeed;
    if (jumpPressed) {
      if (player.isOnGround) {
        player.vy = jumpSpeed;
        player.isOnGround = false;
      } else if (player.hasDoubleJump) {
        player.vy = jumpSpeed;
        player.hasDoubleJump = false;
      }
    }
  }

  // כוח כבידה
  player.vy += gravity;
  let prevY = player.y;
  player.x += player.vx;
  player.y += player.vy;

  // גבולות העולם
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > worldWidth) player.x = worldWidth - player.width;
  if (player.y > worldHeight) {
    player.lives--;
    if (player.lives > 0) {
      player.x = player.checkpoint.x;
      player.y = player.checkpoint.y;
      player.vy = 0;
      player.isOnGround = true;
    } else {
      gameState = 'gameover';
    }
  }

  // התנגשות עם פלטפורמות
  player.isOnGround = false;
  player.onPlatform = null;
  for (let platform of platforms) {
    if (isColliding(player, platform) && player.vy > 0 && prevY + player.height <= platform.y) {
      player.y = platform.y - player.height;
      player.vy = 0;
      player.isOnGround = true;
      player.onPlatform = platform;
    }
  }
  if (player.onPlatform && player.onPlatform.deltaX) {
    player.x += player.onPlatform.deltaX;
  }

  // התנגשות עם אויבים
  for (let i = enemies.length - 1; i >= 0; i--) {
    let enemy = enemies[i];
    if (isColliding(player, enemy)) {
      if (player.vy > 0 && prevY + player.height <= enemy.y) {
        createParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
        enemies.splice(i, 1);
      } else {
        if (!player.invincible) {
          player.lives--;
          if (player.lives > 0) {
            player.x = player.checkpoint.x;
            player.y = player.checkpoint.y;
            player.vy = 0;
            player.isOnGround = true;
          } else {
            gameState = 'gameover';
          }
        } else {
          createParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
          enemies.splice(i, 1);
        }
      }
    }
    enemy.x += enemy.speed * enemy.direction;
    if (enemy.x < enemy.minX || enemy.x + enemy.width > enemy.maxX) enemy.direction *= -1;
  }

  // איסוף מטבעות
  for (let i = coins.length - 1; i >= 0; i--) {
    if (isColliding(player, coins[i])) {
      player.score++;
      coins.splice(i, 1);
    }
  }

  // איסוף powerups
  for (let i = powerups.length - 1; i >= 0; i--) {
    if (isColliding(player, powerups[i])) {
      if (powerups[i].type === 'doublejump') {
        player.hasDoubleJump = true;
      } else if (powerups[i].type === 'invincibility') {
        player.invincible = true;
        player.invincibleTimer = invincibilityDuration;
      }
      powerups.splice(i, 1);
    }
  }

  // עדכון אי-פגיעות
  if (player.invincible) {
    player.invincibleTimer--;
    if (player.invincibleTimer <= 0) {
      player.invincible = false;
    }
  }

  // התנגשות עם צ'קפוינטים
  for (let checkpoint of checkpoints) {
    if (!checkpoint.activated && isColliding(player, checkpoint)) {
      checkpoint.activated = true;
      player.checkpoint = { x: checkpoint.x, y: checkpoint.y };
    }
  }

  // הגעה לקו הסיום
  if (isColliding(player, finish)) {
    if (currentLevel < levels.length - 1) {
      currentLevel++;
      loadLevel(currentLevel);
    } else {
      gameState = 'gamecomplete';
    }
  }

  // עדכון עננים
  for (let cloud of clouds) {
    cloud.x += cloud.speed;
    if (cloud.x > worldWidth) cloud.x = -cloud.width;
  }

  // עדכון חלקיקים
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.02;
    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  // עדכון מצלמה
  cameraX = Math.max(0, Math.min(worldWidth - canvas.width, player.x - canvas.width / 2));
  cameraY = Math.max(0, Math.min(worldHeight - canvas.height, player.y - canvas.height / 2));
}

// ציור המשחק
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ציור עננים (פרלקס)
  for (let cloud of clouds) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.ellipse(cloud.x - cameraX * 0.5, cloud.y - cameraY * 0.5, cloud.width / 2, cloud.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // ציור הרקע
  ctx.drawImage(images.background, -cameraX, -cameraY, worldWidth, worldHeight);
  ctx.drawImage(images.background, -cameraX, -cameraY, worldWidth, worldHeight);

  // ציור פלטפורמות
  for (let platform of platforms) {
    ctx.drawImage(images.platform, platform.x - cameraX, platform.y - cameraY, platform.width, platform.height);
  }

  // ציור אויבים
  for (let enemy of enemies) {
    ctx.drawImage(images[enemy.type], enemy.x - cameraX, enemy.y - cameraY, enemy.width, enemy.height);
  }

  // ציור מטבעות
  for (let coin of coins) {
    ctx.drawImage(images.coin, coin.x - cameraX, coin.y - cameraY, coin.width, coin.height);
  }

  // ציור powerups
  for (let powerup of powerups) {
    if (powerup.type === 'doublejump') {
      ctx.drawImage(images.doublejump, powerup.x - cameraX, powerup.y - cameraY, powerup.width, powerup.height);
    } else if (powerup.type === 'invincibility') {
      ctx.drawImage(images.invincibility, powerup.x - cameraX, powerup.y - cameraY, powerup.width, powerup.height);
    }
  }

  // ציור צ'קפוינטים
  for (let checkpoint of checkpoints) {
    const img = checkpoint.activated ? images.checkpoint_activated : images.checkpoint;
    ctx.drawImage(img, checkpoint.x - cameraX, checkpoint.y - cameraY, checkpoint.width, checkpoint.height);
  }

  // ציור קו הסיום
  ctx.drawImage(images.finish, finish.x - cameraX, finish.y - cameraY, finish.width, finish.height);

  // ציור השחקן
  if (player.invincible) {
    ctx.globalAlpha = 0.6;
  }
  const heroImage = player.isOnGround ? images.hero_idle : images.hero_jump;
  ctx.drawImage(heroImage, player.x - cameraX, player.y - cameraY, player.width, player.height);
  ctx.globalAlpha = 1;

  // ציור חלקיקים
  for (let p of particles) {
    ctx.fillStyle = `rgba(255, 165, 0, ${p.alpha})`;
    ctx.beginPath();
    ctx.arc(p.x - cameraX, p.y - cameraY, p.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // ציור ממשק משתמש
  ctx.fillStyle = 'white';
  ctx.font = '25px Arial';
  ctx.fillText(`Lives: ${player.lives}`, 10, 30);
  ctx.fillText(`Score: ${player.score}`, canvas.width - 100, 30);

  // הודעות מצב
  if (gameState === 'gameover') {
    ctx.fillStyle = 'red';
    ctx.font = '40px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
  } else if (gameState === 'gamecomplete') {
    ctx.fillStyle = 'gold';
    ctx.font = '40px Arial';
    ctx.fillText('Congratulations! You completed the game!', canvas.width / 2 - 300, canvas.height / 2);
  }
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

loadImages(() => {
  loadLevel(currentLevel);
  gameLoop();
});
