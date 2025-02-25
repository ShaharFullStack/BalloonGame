
// הגדרת השלבים
export const levels = [
    {
      start: { x: 100, y: worldHeight - 150 },
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
        { x: 1200, y: worldHeight - 350, width: 100, height: 170, type: 'lizard', minX: 1100, maxX: 1300, speed: 1, direction: 1 },
        { x: 2100, y: worldHeight - 120, width: 100, height: 100, type: 'enemy', minX: 2100, maxX: 2800, speed: 5, direction: 1 }
  
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
      finish: { x: 2700, y: worldHeight - 200, width: 150, height: 180 }
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
        { x: 1600, y: worldHeight - 400, width: 100, height: 100, type: 'orc', minX: 1500, maxX: 1700, speed: 1, direction: 1 },
        { x: 2400, y: worldHeight - 600, width: 100, height: 100, type: 'enemy', minX: 2400, maxX: 2900, speed: 5, direction: 2 }
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
      finish: { x: 2850, y: worldHeight - 650, width: 140, height: 170 }
    },
    {
      start: { x: 100, y: worldHeight - 250 },
      platforms: [
        { x: 0, y: worldHeight - 50, width: 3000, height: 50 },
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
        { x: 700, y: worldHeight - 300 - 150, width: 100, height: 150, type: 'orc', minX: 700, maxX: 900, speed: 1, direction: 1 },
        { x: 1500, y: worldHeight - 500 - 150, width: 100, height: 150, type: 'lizard', minX: 1500, maxX: 1700, speed: 1, direction: 1 },
        { x: 2300, y: worldHeight - 700 - 150, width: 100, height: 150, type: 'orc', minX: 2300, maxX: 2500, speed: 1, direction: 1 }
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
        { x: 1000, y: worldHeight - 400, width: 100, height: 100, type: 'doublejump' },
        { x: 2500, y: worldHeight - 750, width: 100, height: 100, type: 'invincibility' }
      ],
      checkpoints: [
        { x: 1500, y: worldHeight - 550, width: 100, height: 100, activated: false },
        { x: 2700, y: worldHeight - 850, width: 100, height: 100, activated: false }
      ],
      finish: { x: 2850, y: worldHeight - 700, width: 140, height: 170 }
    },
    {
      start: { x: 100, y: worldHeight - 250 },
      platforms: [
        { x: 0, y: worldHeight - 50, width: 3000, height: 50 },
        { x: 300, y: worldHeight - 200, width: 200, height: 45 },
        { x: 700, y: worldHeight - 300, width: 200, height: 45 },
        { x: 1100, y: worldHeight - 400, width: 200, height: 45 },
        { x: 1500, y: worldHeight - 500, width: 200, height: 45 },
        { x: 1900, y: worldHeight - 600, width: 200, height: 45 },
        { x: 2300, y: worldHeight - 700, width: 200, height: 45 },
        { x: 2700, y: worldHeight - 800, width: 200, height: 45 },
        { x: 1000, y: worldHeight - 250, width: 150, height: 45, speed: 2, minX: 1000, maxX: 1400, direction: 1 },
        { x: 1600, y: worldHeight - 450, width: 100, height: 45, speed: 4, minX: 1600, maxX: 2900, direction: 1 }
      ],
      enemies: [
        { x: 700, y: worldHeight - 10 - 150, width: 100, height: 150, type: 'orc', minX: 700, maxX: 900, speed: 1, direction: 2 },
        { x: 1500, y: worldHeight - 500 - 150, width: 100, height: 150, type: 'lizard', minX: 1500, maxX: 1700, speed: 1, direction: 1 },
        { x: 2300, y: worldHeight - 700 - 150, width: 100, height: 150, type: 'orc', minX: 2300, maxX: 2500, speed: 1, direction: 1 }
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
        { x: 1000, y: worldHeight - 400, width: 100, height: 100, type: 'doublejump' },
        { x: 2500, y: worldHeight - 750, width: 100, height: 100, type: 'invincibility' }
      ],
      checkpoints: [
        { x: 1500, y: worldHeight - 550, width: 100, height: 100, activated: false },
        { x: 2700, y: worldHeight - 850, width: 100, height: 100, activated: false }
      ],
      finish: { x: 2800, y: worldHeight - 450, width: 200, height: 150 }
    }
  ];