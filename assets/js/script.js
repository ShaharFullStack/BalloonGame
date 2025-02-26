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
  enemy: 'assets/images/enemy.png',
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
      { x: 700, y: worldHeight - 10, width: 1000, height: 45 },
      { x: 0, y: worldHeight - 10, width: 1000, height: 45 },
      { x: 200, y: worldHeight - 140, width: 200, height: 45 },
      { x: 500, y: worldHeight - 200, width: 200, height: 45 },
      { x: 800, y: worldHeight - 270, width: 200, height: 45 },
      { x: 1100, y: worldHeight - 200, width: 200, height: 45 },
      { x: 1100, y: worldHeight - 450, width: 200, height: 45 },
      { x: 1500, y: worldHeight - 230, width: 200, height: 45 },
      { x: 1900, y: worldHeight - 230, width: 200, height: 45 },
      { x: 2300, y: worldHeight - 20, width: 700, height: 50 },
      { x: 700, y: worldHeight -550 , width: 100, height: 45, speed: 2, minX: 700, maxX: 1900, direction: 1 }
    ],
    clouds: [
      { x: 100 , y: 100, width: 200, height: 100, speed: 0.2 },
      { x: 600, y: 150, width: 250, height: 120, speed: 0.15 }
    ],

    enemies: [
      { x: 450, y: worldHeight - 375, width: 130, height: 180, type: 'orc', minX: 450, maxX: 750, speed: 1, direction: 1 },
      { x: 1900, y: worldHeight - 395, width: 130, height: 180, type: 'lizard', minX: 1850, maxX: 2100, speed: 2, direction: 1 },
      { x: 2200, y: worldHeight - 190, width: 130, height: 180, type: 'enemy', minX: 2200, maxX: 2900, speed: 5, direction: 1 }

    ],
    coins: [
      { x: 550, y: worldHeight - 250, width: 45, height: 45 },
      { x: 850, y: worldHeight - 350, width: 45, height: 45 },
      { x: 1150, y: worldHeight - 500, width: 45, height: 45 },
      { x: 1550, y: worldHeight - 300, width: 45, height: 45 },
      { x: 1950, y: worldHeight - 320, width: 45, height: 45 }
    ],
    powerups: [
      { x: 850, y: worldHeight -750 , width: 130, height: 180, type: 'invincibility' },
      { x: 1750, y: worldHeight - 650, width: 130, height: 180, type: 'doublejump' },
    ],
    checkpoints: [
      { x: 1500, y: worldHeight - 410, width: 130, height: 180, activated: false }
    ],
    finish: { x: 2700, y: worldHeight - 200, width: 150, height: 180 }
  },

  {
    start: { x: 100, y: worldHeight - 250 },
    platforms: [
      { x: 0, y: worldHeight - 10, width: 2000, height: 50 },
      { x: -30, y: worldHeight - 10, width: 300, height: 50 },
      { x: 300, y: worldHeight - 200, width: 200, height: 45 },
      { x: 700, y: worldHeight - 300, width: 200, height: 45 },
      { x: 1100, y: worldHeight - 400, width: 200, height: 45 },
      { x: 1500, y: worldHeight - 500, width: 200, height: 45 },
      { x: 1900, y: worldHeight - 600, width: 200, height: 45 },
      { x: 2300, y: worldHeight - 700, width: 200, height: 45 },
      { x: 2700, y: worldHeight - 800, width: 200, height: 45 },
      { x: 1000, y: worldHeight - 250, width: 150, height: 45, speed: 2, minX: 1000, maxX: 1400, direction: 1 },
      { x: 1600, y: worldHeight - 550, width: 100, height: 55, speed: 3, minX: 1600, maxX: 2900, direction: 1 }
    ],
    enemies: [
      { x: 700, y: worldHeight - 480, width: 130, height: 180, type: 'orc', minX: 700, maxX: 900, speed: 1, direction: 1 },
      { x: 1500, y: worldHeight - 680, width: 130, height: 180, type: 'lizard', minX: 1500, maxX: 1700, speed: 1, direction: 1 },
      { x: 2300, y: worldHeight - 880, width: 130, height: 180, type: 'orc', minX: 2300, maxX: 2500, speed: 1, direction: 1 }
    ],
    coins: [
      { x: 350, y: worldHeight - 250, width: 45, height: 45 },
      { x: 750, y: worldHeight - 350, width: 45, height: 45 },
      { x: 1150, y: worldHeight - 450, width: 45, height: 45 },
      { x: 1550, y: worldHeight - 550, width: 45, height: 45 },
      { x: 1950, y: worldHeight - 650, width: 45, height: 45 },
      { x: 2350, y: worldHeight - 750, width: 45, height: 45 },
      { x: 2750, y: worldHeight - 850, width: 45, height: 45 }
    ],
    powerups: [
      { x: 1100, y: worldHeight - 580, width: 130, height: 180, speed: 2, minX: 1100, maxX: 2300, direction: 1, type: 'invincibility' },

      // { x: 1000, y: worldHeight - 400, width: 130, height: 150, type: 'doublejump' },
      { x: 2800, y: worldHeight - 950, width: 130, height: 150, type: 'doublejump' }
    ],
    checkpoints: [
      { x: 1500, y: worldHeight - 660, width: 130, height: 160, activated: false },
    ],
    finish: { x: 2850, y: worldHeight - 700, width: 140, height: 170 }
  },

  {
    start: { x: 100, y: worldHeight - 250 },
    platforms: [
      { x: -700, y: worldHeight - 10, width: 2000, height: 20 },
      { x: 0, y: worldHeight - 10, width: 2000, height: 45 },
      { x: 100, y: worldHeight - 10, width: 200, height: 45 },
      { x: 300, y: worldHeight - 100, width: 200, height: 45 },
      { x: 600, y: worldHeight - 200, width: 200, height: 45 },
      { x: 1200, y: worldHeight - 250, width: 200, height: 45 },
      { x: 1500, y: worldHeight - 300, width: 200, height: 45 },
      { x: 1800, y: worldHeight - 350, width: 200, height: 45 },
      { x: 2100, y: worldHeight - 400, width: 200, height: 45 },
      { x: 2400, y: worldHeight - 450, width: 200, height: 45 },
      { x: 2700, y: worldHeight - 500, width: 300, height: 45 },
      { x: 900, y: worldHeight - 350, width: 300, height: 45 },
      { x: 1100, y: worldHeight - 490, width: 300, height: 45 },
      { x: 1300, y: worldHeight - 650, width: 300, height: 45 },
      { x: 2400, y: worldHeight - 10, width: 800, height: 45 },
      { x: 1600, y: worldHeight - 800, width: 100, height: 45, speed: 5, minX: 800, maxX: 2700, direction: 2 }
    ],
    enemies: [
      { x: 400, y: worldHeight - 280, width: 130, height: 180, type: 'orc', minX: 280, maxX: 580, speed: 1, direction: 1 },
      { x: 1000, y: worldHeight - 189, width: 130, height: 180, type: 'lizard', minX: 300, maxX: 1800, speed: 6, direction: 1 },
      { x: 2900, y: worldHeight - 10, width: 130, height: 180, type: 'orc', minX: 2400, maxX: 2900, speed: 3, direction: 1 },
      { x: 2600, y: worldHeight - 675, width: 130, height: 180, type: 'enemy', minX: 2600, maxX: 3200, speed: 6, direction: 1 }
    ],
    coins: [
      { x: 350, y: worldHeight - 150, width: 45, height: 45 },
      { x: 650, y: worldHeight - 250, width: 45, height: 45 },
      { x: 950, y: worldHeight - 400, width: 45, height: 45 },
      { x: 1250, y: worldHeight - 300, width: 45, height: 45 },
      { x: 1440, y: worldHeight - 700, width: 45, height: 45 },
      { x: 1550, y: worldHeight - 350, width: 45, height: 45 },
      { x: 1850, y: worldHeight - 400, width: 45, height: 45 },
      { x: 2150, y: worldHeight - 450, width: 45, height: 45 },
      { x: 2450, y: worldHeight - 500, width: 45, height: 45 }
    ],
    powerups: [
      { x: 1200, y: worldHeight - 670, width: 130, height: 180, speed: 2, minX: 1200, maxX: 2300, direction: 1, type: 'doublejump' },
    ],
    checkpoints: [
      { x: 1400, y: worldHeight - 190, width: 130, height: 180, activated: false }
    ],
    finish: { x: 2850, y: worldHeight - 670, width: 140, height: 170 }
  },

  {
    start: { x: 100, y: worldHeight - 250 },
    platforms: [
      { x: 0, y: worldHeight - 10, width: 2000, height: 50 },
      { x: 300, y: worldHeight - 200, width: 200, height: 45 },
      { x: 700, y: worldHeight - 300, width: 200, height: 45 },
      { x: 1100, y: worldHeight - 400, width: 200, height: 45 },
      { x: 1500, y: worldHeight - 500, width: 200, height: 45 },
      { x: 1900, y: worldHeight - 600, width: 200, height: 45 },
      { x: 2300, y: worldHeight - 700, width: 200, height: 45 },
      { x: 2700, y: worldHeight - 730, width: 200, height: 45 },
      { x: 2600, y: worldHeight - 20, width: 100, height: 45, speed: 4, minX: 2600, maxX: 2950, direction: 1 }
    ],
    enemies: [
      { x: 400, y: worldHeight - 190, width: 130, height: 180, type: 'orc', minX: 400, maxX: 1400, speed: 1, direction: 2 },
      { x: 1500, y: worldHeight - 680, width: 130, height: 180, type: 'lizard', minX: 1500, maxX: 1700, speed: 1, direction: 1 },
      { x: 2300, y: worldHeight - 880, width: 130, height: 180, type: 'orc', minX: 2300, maxX: 2500, speed: 1, direction: 1 }
    ],
    coins: [
      { x: 350, y: worldHeight - 250, width: 45, height: 45 },
      { x: 750, y: worldHeight - 350, width: 45, height: 45 },
      { x: 1150, y: worldHeight - 450, width: 45, height: 45 },
      { x: 1550, y: worldHeight - 550, width: 45, height: 45 },
      { x: 1950, y: worldHeight - 650, width: 45, height: 45 },
      { x: 2350, y: worldHeight - 750, width: 45, height: 45 },
      { x: 2750, y: worldHeight - 850, width: 45, height: 45 }
    ],
    powerups: [
      { x: 950, y: worldHeight - 700, width: 130, height: 180, type: 'invincibility' }
    ],
    checkpoints: [
      { x: 2700, y: worldHeight - 910, width: 130, height: 180, activated: false }
    ],
    finish: { x: 2850, y: worldHeight - 200, width: 130, height: 180, minX: 2600, maxX: 2900, speed: 1, direction: 1 }
  },
  {
    start: { x: 100, y: worldHeight - 250 },
    platforms: [
      { x: 0, y: worldHeight - 10, width: 300, height: 50 },
      { x: 400, y: worldHeight - 10, width: 130, height: 180, minX: 400, maxX: 1400, speed: 1, direction: 1 },
      { x: 1400, y: worldHeight - 10, width: 130, height: 180, minX: 1400, maxX: 2800, speed: 1, direction: 1 },
      { x: 300, y: worldHeight - 200, width: 200, height: 45 },
      { x: 300, y: worldHeight - 400, width: 200, height: 45 },
      { x: 300, y: worldHeight - 600, width: 200, height: 45 },
      { x: 700, y: worldHeight - 300, width: 200, height: 45 },
      { x: 1100, y: worldHeight - 400, width: 200, height: 45 },
      { x: 1500, y: worldHeight - 500, width: 200, height: 45 },
      { x: 1900, y: worldHeight - 600, width: 200, height: 45 },
      { x: 2500, y: worldHeight - 200, width: 200, height: 45 },
      { x: 2300, y: worldHeight - 700, width: 200, height: 45 },
      { x: 2700, y: worldHeight - 730, width: 200, height: 45 },
      { x: 1600, y: worldHeight - 450, width: 100, height: 45, speed: 4, minX: 1600, maxX: 2900, direction: 1 }
    ],
    enemies: [
      { x: 400, y: worldHeight - 190, width: 130, height: 180, type: 'orc', minX: 400, maxX: 1400, speed: 1, direction: 1 },
      { x: 1500, y: worldHeight - 680, width: 130, height: 180, type: 'lizard', minX: 1500, maxX: 1700, speed: 1, direction: 1 },
      { x: 2300, y: worldHeight - 880, width: 130, height: 180, type: 'orc', minX: 2300, maxX: 2500, speed: 1, direction: 1 }
    ],
    coins: [
      { x: 350, y: worldHeight - 250, width: 70, height: 45 },
      { x: 350, y: worldHeight - 450, width: 70, height: 45 },
      { x: 350, y: worldHeight - 650, width: 70, height: 45 },
      { x: 550, y: worldHeight - 100, width: 70, height: 45 },
      { x: 1350, y: worldHeight - 100, width: 70, height: 45 },
      { x: 950, y: worldHeight - 100, width: 70, height: 45 },
      { x: 1450, y: worldHeight - 450, width: 70, height: 45 },
      { x: 1750, y: worldHeight - 100, width: 70, height: 45 },
      { x: 1150, y: worldHeight - 450, width: 70, height: 45 },
      { x: 1650, y: worldHeight - 350, width: 70, height: 45 },
      { x: 1650, y: worldHeight - 350, width: 70, height: 45 },
      { x: 1550, y: worldHeight - 550, width: 70, height: 45 },
      { x: 1950, y: worldHeight - 650, width: 45, height: 45 },
      { x: 2350, y: worldHeight - 750, width: 45, height: 45 },
      { x: 2750, y: worldHeight - 850, width: 45, height: 45 }
    ],
    powerups: [
      { x: 950, y: worldHeight - 700, width: 100, height: 100, type: 'invincibility' }
    ],
    checkpoints: [
      { x: 2700, y: worldHeight - 910, width: 130, height: 180, activated: false }
    ],
    finish: { x: 2850, y: worldHeight - 350, width: 200, height: 150 }
  },
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
const gravity = 0.2;
const jumpSpeed = -12;
const moveSpeed = 3;
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

  player.vy += gravity;

  // עדכון כיוון השחקן לפי תנועה
  if (player.vx > 0) {
    player.direction = 1; // פונה ימינה
  } else if (player.vx < 0) {
    player.direction = -1; // פונה שמאלה
  }

  player.x += player.vx;
  player.y += player.vy;

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
        player.score += 3;
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
      player.score += 2;
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

// כיוון מבט השחקן
player.direction = 1;

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
  ctx.save();
  ctx.translate(player.x - cameraX + player.width / 2, player.y - cameraY + player.height / 2);
  ctx.scale(player.direction, 1);
  const heroImage = player.isOnGround ? images.hero_idle : images.hero_jump;
  ctx.drawImage(heroImage, -player.width / 2, -player.height / 2, player.width, player.height);
  ctx.restore();

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
    ctx.font = '50px Arial, sans-serif';
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

