# Homework 9: p5.play Game - Collect & Survive

## Name: Grant Grady

## Project Overview
A 2D game created using the p5.play library for a game development assignment. The player controls a character who must collect golden stars while avoiding purple skulls and navigating around obstacles.

## 🎮 Game Description

In this game, you control a character in a colorful world. Your goal is to collect 10 healthy to win while maintaining your health. Touching harmful items reduces your health by 1, and you start with 5 health. The game ends when you either reach 10 points (win) or your health reaches 0 (lose).

### Features
- **Animated Character**: The player character has both idle and walking animations
- **Responsive Movement**: Move using WASD or Arrow keys
- **5(at least 3) Static Obstacles**: Strategically placed obstacles that block movement
- **Collectible Stars**: Yellow squares that increase your score
- **Harmful Skulls**: Purple squares that decrease your health
- **Visual Health System**: Heart icons display your current health
- **Win/Lose Conditions**: Clear game ending with victory or defeat messages

## 🎯 How to Play

1. Use **WASD** or **Arrow Keys** to move your character
2. Collect **yellow squares** to increase your score (+1 each)
3. Avoid **purple squares** that decrease your health (-1 each)
4. Navigate around **brown obstacles** that block your path
5. Reach **10 points** to win the game
6. Don't let your health drop to **0** or you'll lose!

### Key Game Systems

**1. Animated Sprite System**
- Created 8 animation frames programmatically using p5.Graphics
- 4 idle frames with gentle bouncing motion
- 4 walking frames with leg and arm swing cycles
- Frame delay system for smooth animation timing

**2. Movement System**
- Manual keyboard event listeners (bypassed kb.pressing issues)
- Diagonal movement with normalized speed
- Collision detection with obstacles using p5.play's physics engine
- Boundary constraints to keep player on screen

**3. Collision & Game Logic**
- Overlap detection for collectible stars and harmful skulls
- Score tracking with win condition (score >= 10)
- Health tracking with lose condition (health <= 0)
- Item respawn system that relocates collected items

**4. Visual Design**
- Custom-drawn obstacles with texture details
- Different colored sprites drawn with p5 shape functions
- Health display using heart emojis with color coding

## 💭 Reflection

### Development Process

Creating this game was a journey through game development concepts using the p5.play library. I started by understanding the assignment requirements and then broke down the project into manageable components: player movement, collision detection, item spawning, win/lose conditions, and visual polish.

The most challenging aspect was getting keyboard input to work correctly with p5.play v3. The library's `kb.pressing()` function wasn't detecting key presses, which required implementing manual keyboard event listeners. This taught me about event handling in JavaScript and how game libraries abstract input systems.

I also learned about sprite animation by creating frames programmatically rather than using external image files. This approach ensures the game works without requiring additional assets while still providing visual feedback for player actions.

### Use of Generative AI

I used Generative AI (specifically DeepSeek) as a **development assistant** throughout this project. Here's how I used it:

1. **Debugging Help**: When I encountered the keyboard input issue, I asked the AI to help debug why `kb.pressing()` wasn't working. The AI suggested adding console logs and eventually helped me implement manual keyboard listeners as a solution.

2. **Code Structure Guidance**: I asked for help organizing the code to meet the assignment requirements, ensuring all features were properly implemented and commented.

3. **Error Resolution**: When I got errors like "sprite.immovable is deprecated", the AI helped update the syntax to use `collider = 'static'` instead, which is correct for p5.play v3.

4. **Animation Implementation**: I requested assistance in creating programmatic animations without external images, and the AI provided the frame creation logic using p5.Graphics objects.

**How I see others using Gen AI**:
- **Learning Tool**: New developers can use AI to explain concepts and provide examples
- **Debugging Assistant**: AI can help identify syntax errors and deprecated functions
- **Prototyping**: Quick iteration on game mechanics before refining code
- **Documentation**: Generating comments and explanations for complex code sections

### Use of Others' Code

I did not directly copy code from other projects or individuals. However, I did reference:

1. **p5.play Documentation**: I used the official documentation at https://p5play.org/learn/ to understand sprite properties, collision detection, and animation systems. The documentation examples helped me understand how to structure my code.

2. **p5.js Reference**: The official p5.js reference was invaluable for understanding drawing functions, color manipulation, and gradient creation.

3. **Library Code**: The p5.play library itself provided the underlying framework. I read through parts of the p5play.js file to understand how the `kb` object works, which helped me identify why the keyboard input wasn't working.

4. **Stack Overflow Concepts**: While I didn't copy code directly, I drew from general knowledge of game loops, event listeners, and collision detection patterns that are common in game development.

All code was written by me, with AI assistance for debugging and conceptual guidance, ensuring it meets the assignment requirements while being original work.


## 🐛 Known Issues & Future Improvements

**Current Limitations**:
- Player can sometimes get stuck on obstacles due to physics friction
- Items may spawn inside obstacles (though there's basic collision avoidance)

**Potential Enhancements**:
- Add sound effects for collecting items
- Create more varied animations for different directions
- Add particle effects for collection events


## ✅ Assignment Requirements Checklist

- ✅ **p5.play Animations**: Animated sprite with idle and walk cycles
- ✅ **Player Movement**: WASD and Arrow keys with responsive controls
- ✅ **Immovable Objects**: 5 static obstacles at random positions
- ✅ **Collectible Items**: 8 golden shapes that respawn on collection
- ✅ **Bad Items**: 5 purple shapes that decrease health
- ✅ **Win Condition**: Score reaches 10 points
- ✅ **Lose Condition**: Health reaches 0
- ✅ **Score Display**: Real-time score counter
- ✅ **Health Display**: Visual heart system
- ✅ **Game States**: Clear win/lose screens with restart option

