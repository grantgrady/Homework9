let player;
let obstacles = [];
let collectibles = [];
let badItems = [];
let score = 0;
let health = 5;
let gameActive = true;
let gameResult = null;

// Animation variables
let playerAnimation = [];
let currentFrame = 0;
let frameDelay = 0;
let isMoving = false;
let lastDirection = 'down';

// Manual keyboard tracking (since kb.pressing isn't working)
let keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// UI elements
let scoreDisplay, healthDisplay;

function preload() {
    console.log("PRELOAD: Creating animation frames");
    createAnimationFrames();
}

function createAnimationFrames() {
    for (let i = 0; i < 8; i++) {
        let frame = createGraphics(45, 55);
        let isWalking = (i >= 4);
        let frameIndex = i % 4;
        
        let bounceY = 0;
        let legSwing = 0;
        let armSwing = 0;
        
        if (isWalking) {
            legSwing = sin(frameIndex * HALF_PI) * 6;
            armSwing = sin(frameIndex * HALF_PI) * 4;
            bounceY = abs(sin(frameIndex * HALF_PI)) * 2;
        } else {
            bounceY = sin(frameIndex * HALF_PI) * 2;
        }
        
        drawCharacterFrame(frame, bounceY, legSwing, armSwing);
        playerAnimation.push(frame);
    }
}

function drawCharacterFrame(g, bounceY, legSwing, armSwing) {
    g.push();
    g.translate(22.5, 27.5 + bounceY);
    
    g.fill(52, 157, 89);
    g.noStroke();
    g.rectMode(g.CENTER);
    g.rect(0, 0, 32, 40, 8);
    
    g.fill(255, 224, 189);
    g.ellipse(0, -18, 26, 26);
    
    g.fill(101, 67, 33);
    g.arc(0, -28, 28, 18, PI, TWO_PI, g.CHORD);
    
    g.fill(20);
    g.ellipse(-7, -22, 4, 5);
    g.ellipse(7, -22, 4, 5);
    g.fill(255);
    g.ellipse(-8, -23, 1.5, 2);
    g.ellipse(6, -23, 1.5, 2);
    
    g.stroke(80, 40, 20);
    g.strokeWeight(1.5);
    g.noFill();
    g.arc(0, -14, 14, 7, 0, PI);
    
    g.stroke(52, 157, 89);
    g.strokeWeight(6);
    g.line(-12, -4, -20, -2 + armSwing);
    g.line(12, -4, 20, -2 - armSwing);
    
    g.stroke(42, 117, 69);
    g.strokeWeight(6);
    g.line(-8, 18, -15, 30 + legSwing);
    g.line(8, 18, 15, 30 - legSwing);
    
    g.fill(150, 90, 50);
    g.rect(16, 0, 10, 16, 3);
    
    g.pop();
}

function setup() {
    let canvas = createCanvas(900, 600);
    canvas.parent('gameCanvas');
    frameRate(60);
    
    scoreDisplay = select('#scoreValue');
    healthDisplay = select('#healthValue');
    select('#restartBtn').mousePressed(() => restartGame());
    
    player = new Sprite();
    player.width = 38;
    player.height = 48;
    player.collider = 'dynamic';
    player.x = width/2;
    player.y = height - 80;
    player.friction = 0.95;
    player.rotationLock = true;
    
    for (let i = 0; i < 5; i++) {
        let obstacle = new Sprite(random(70, width - 70), random(80, height - 90), 48, 48);
        obstacle.collider = 'static';
        obstacle.color = color(101, 67, 33);
        obstacle.stroke = color(70, 45, 20);
        obstacle.strokeWeight = 2;
        obstacles.push(obstacle);
    }
    
    for (let i = 0; i < 8; i++) {
        createCollectible();
    }
    
    for (let i = 0; i < 5; i++) {
        createBadItem();
    }
    
    updateUI();
    
    // Set up keyboard event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    console.log("SETUP: Complete! Use WASD or Arrow Keys to move");
}

function handleKeyDown(event) {
    let key = event.key;
    
    // Prevent default scrolling for game keys
    if (key === 'w' || key === 'W' || key === 'ArrowUp' ||
        key === 's' || key === 'S' || key === 'ArrowDown' ||
        key === 'a' || key === 'A' || key === 'ArrowLeft' ||
        key === 'd' || key === 'D' || key === 'ArrowRight') {
        event.preventDefault();
    }
    
    if (key === 'w' || key === 'W') keys.w = true;
    if (key === 'a' || key === 'A') keys.a = true;
    if (key === 's' || key === 'S') keys.s = true;
    if (key === 'd' || key === 'D') keys.d = true;
    if (key === 'ArrowUp') keys.ArrowUp = true;
    if (key === 'ArrowDown') keys.ArrowDown = true;
    if (key === 'ArrowLeft') keys.ArrowLeft = true;
    if (key === 'ArrowRight') keys.ArrowRight = true;
}

function handleKeyUp(event) {
    let key = event.key;
    
    // Set key state
    if (key === 'w' || key === 'W') keys.w = false;
    if (key === 'a' || key === 'A') keys.a = false;
    if (key === 's' || key === 'S') keys.s = false;
    if (key === 'd' || key === 'D') keys.d = false;
    if (key === 'ArrowUp') keys.ArrowUp = false;
    if (key === 'ArrowDown') keys.ArrowDown = false;
    if (key === 'ArrowLeft') keys.ArrowLeft = false;
    if (key === 'ArrowRight') keys.ArrowRight = false;
}

function createCollectible() {
    let star = new Sprite(random(50, width - 50), random(60, height - 80), 28, 28);
    star.collider = 'static';
    star.color = color(255, 215, 0);
    star.type = 'good';
    collectibles.push(star);
}

function createBadItem() {
    let skull = new Sprite(random(50, width - 50), random(60, height - 80), 30, 30);
    skull.collider = 'static';
    skull.color = color(128, 0, 128);
    skull.type = 'bad';
    badItems.push(skull);
}

function draw() {
    // Sky gradient
    setGradient(0, 0, width, height, color(135, 206, 235), color(70, 130, 200));
    
    // Ground
    fill(80, 140, 60);
    noStroke();
    rect(0, height - 60, width, 60);
    
    // Grass details
    fill(100, 170, 70);
    for (let i = 0; i < 12; i++) {
        rect(i * 75, height - 65, 5, 15);
    }
    
    if (gameActive) {
        // Handle player movement
        handleMovement();
        
        // Check collisions
        handleCollisions();
        
        // Update animation
        updateAnimation();
    } else {
        player.vel.x = 0;
        player.vel.y = 0;
    }
    
    // Draw all sprites with custom shapes
    drawObstacles();
    drawCollectibles();
    drawBadItems();
    
    // Draw animated player
    drawAnimatedPlayer();
    
    // Draw UI
    drawUI();
    
    // Draw win/lose overlay
    if (!gameActive) {
        drawGameOverlay();
    }
}

function setGradient(x, y, w, h, c1, c2) {
    noFill();
    for (let i = y; i <= y + h; i++) {
        let inter = map(i, y, y + h, 0, 1);
        let c = lerpColor(c1, c2, inter);
        stroke(c);
        line(x, i, x + w, i);
    }
}

function drawObstacles() {
    for (let obs of obstacles) {
        push();
        translate(obs.x, obs.y);
        fill(101, 67, 33);
        stroke(70, 45, 20);
        strokeWeight(2);
        rectMode(CENTER);
        rect(0, 0, 45, 45, 8);
        fill(80, 50, 30);
        ellipse(-12, -8, 10, 10);
        ellipse(12, -8, 10, 10);
        pop();
    }
}

function drawCollectibles() {
    for (let item of collectibles) {
        push();
        translate(item.x, item.y);
        // Draw star
        fill(255, 215, 0);
        noStroke();
        beginShape();
        for (let i = 0; i < 5; i++) {
            let angle = i * TWO_PI / 5 - HALF_PI;
            let x1 = cos(angle) * 12;
            let y1 = sin(angle) * 12;
            vertex(x1, y1);
            let innerAngle = angle + PI/5;
            let x2 = cos(innerAngle) * 5;
            let y2 = sin(innerAngle) * 5;
            vertex(x2, y2);
        }
        endShape(CLOSE);
        fill(255, 180, 0);
        circle(0, 0, 8);
        pop();
    }
}

function drawBadItems() {
    for (let item of badItems) {
        push();
        translate(item.x, item.y);
        fill(80, 50, 70);
        ellipse(0, 0, 22, 24);
        fill(40, 30, 35);
        ellipse(-6, -4, 5, 6);
        ellipse(6, -4, 5, 6);
        fill(150, 50, 50);
        rect(-3, 3, 6, 6, 2);
        fill(200);
        rect(-7, 7, 4, 5);
        rect(0, 7, 4, 5);
        rect(7, 7, 4, 5);
        pop();
    }
}

function handleMovement() {
    if (!gameActive) return;
    
    let moveX = 0;
    let moveY = 0;
    
    // Check manual key states
    if (keys.w || keys.ArrowUp) moveY -= 1;
    if (keys.s || keys.ArrowDown) moveY += 1;
    if (keys.a || keys.ArrowLeft) moveX -= 1;
    if (keys.d || keys.ArrowRight) moveX += 1;
    
    if (moveX !== 0 || moveY !== 0) {
        let len = Math.hypot(moveX, moveY);
        moveX /= len;
        moveY /= len;
        
        // Set velocity
        let speed = 5.5;
        player.vel.x = moveX * speed;
        player.vel.y = moveY * speed;
        isMoving = true;
        
        // Update direction for animation
        if (moveX !== 0) {
            lastDirection = moveX > 0 ? 'right' : 'left';
        } else if (moveY !== 0) {
            lastDirection = moveY > 0 ? 'down' : 'up';
        }
    } else {
        // Apply friction when not moving
        player.vel.x *= 0.95;
        player.vel.y *= 0.95;
        isMoving = false;
    }
    
    // Boundaries
    player.x = constrain(player.x, 35, width - 35);
    player.y = constrain(player.y, 45, height - 65);
}

function handleCollisions() {
    // Check collectibles (good items)
    for (let i = collectibles.length - 1; i >= 0; i--) {
        if (player.collides(collectibles[i])) {
            score++;
            updateUI();
            collectibles[i].remove();
            collectibles.splice(i, 1);
            createCollectible();
            
            if (score >= 10) {
                gameActive = false;
                gameResult = "win";
            }
        }
    }
    
    // Check bad items
    for (let i = badItems.length - 1; i >= 0; i--) {
        if (player.collides(badItems[i])) {
            health--;
            updateUI();
            badItems[i].remove();
            badItems.splice(i, 1);
            createBadItem();
            
            if (health <= 0) {
                gameActive = false;
                gameResult = "lose";
                health = 0;
                updateUI();
            }
        }
    }
}

function updateAnimation() {
    frameDelay++;
    if (frameDelay >= 6) {
        frameDelay = 0;
        if (isMoving) {
            // Walking animation frames 4-7
            currentFrame = (currentFrame % 4) + 4;
        } else {
            // Idle animation frames 0-3
            currentFrame = (currentFrame + 1) % 4;
        }
    }
}

function drawAnimatedPlayer() {
    push();
    translate(player.x, player.y);
    
    // Flip based on direction
    if (lastDirection === 'left') {
        scale(-1, 1);
    }
    
    let frame = playerAnimation[currentFrame];
    imageMode(CENTER);
    image(frame, 0, 0);
    
    pop();
}

function drawUI() {
    textAlign(LEFT);
    for (let i = 0; i < 5; i++) {
        if (i < health) {
            fill(255, 80, 100);
            textSize(24);
            text("❤️", 15 + i * 32, 45);
        } else {
            fill(80, 80, 80);
            textSize(24);
            text("🖤", 15 + i * 32, 45);
        }
    }
    
    fill(255, 215, 0);
    textSize(28);
    textAlign(RIGHT);
    text("SCORE: " + score + " / 10", width - 20, 45);
    
    textAlign(CENTER);
    fill(255);
    textSize(14);
    let pointsNeeded = 10 - score;
    text("Need " + pointsNeeded + " more point" + (pointsNeeded !== 1 ? "s" : "") + " to win!", width/2, 25);
}

function drawGameOverlay() {
    fill(0, 0, 0, 220);
    rect(0, 0, width, height);
    
    textAlign(CENTER, CENTER);
    
    if (gameResult === "win") {
        fill(255, 215, 0);
        textSize(56);
        text("YOU WIN! 🎉", width/2, height/2 - 50);
        fill(255);
        textSize(28);
        text("Final Score: " + score, width/2, height/2 + 20);
        textSize(18);
        text("Click RESTART to play again", width/2, height/2 + 100);
    } else if (gameResult === "lose") {
        fill(255, 80, 80);
        textSize(56);
        text("GAME OVER 💀", width/2, height/2 - 50);
        fill(255);
        textSize(28);
        text("You collected " + score + " points", width/2, height/2 + 20);
        textSize(18);
        text("Click RESTART to try again", width/2, height/2 + 100);
    }
}

function updateUI() {
    if (scoreDisplay) scoreDisplay.html(score);
    if (healthDisplay) healthDisplay.html(health);
}

function restartGame() {
    gameActive = true;
    gameResult = null;
    score = 0;
    health = 5;
    updateUI();
    
    // Reset player
    player.x = width/2;
    player.y = height - 80;
    player.vel.x = 0;
    player.vel.y = 0;
    
    // Clear all items
    for (let obs of obstacles) {
        obs.remove();
    }
    for (let item of collectibles) {
        item.remove();
    }
    for (let item of badItems) {
        item.remove();
    }
    
    obstacles = [];
    collectibles = [];
    badItems = [];
    
    // Recreate obstacles
    for (let i = 0; i < 5; i++) {
        let obstacle = new Sprite(random(70, width - 70), random(80, height - 90), 48, 48);
        obstacle.collider = 'static';
        obstacle.color = color(101, 67, 33);
        obstacle.stroke = color(70, 45, 20);
        obstacle.strokeWeight = 2;
        obstacles.push(obstacle);
    }
    
    // Recreate collectibles
    for (let i = 0; i < 8; i++) {
        createCollectible();
    }
    
    // Recreate bad items
    for (let i = 0; i < 5; i++) {
        createBadItem();
    }
    
    // Reset animation
    currentFrame = 0;
    frameDelay = 0;
    isMoving = false;
}

window.addEventListener('beforeunload', function() {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
});
