<p align="center"> <img src="https://www.codecollision.dev/git-head.png" alt="code / collision" /> </p>

People enter the coding world in a differently than when I was growing up. The internet increased our reach and many first-steps are in building business, productivity, & lifestyle applications.

I grew up coding games. My peer group was made up of many who built "casual games" with only a small handful building applications. Today's new class of coders has that inverted. 

Building games taught me a lot. There were the same basics you need in a business app - front end and back end, work.  But you also got to do lots of **other** stuff: *Game mechanics, game physics (movement, acceleration, friction, gravity), collision detection*

The best part was building the in-game AI. That's where magic happens - and not just magic. **So much learning.** Translating a game strategy into code ***hard***. And ultimately, it makes you a stronger coder. 

**code / collision is an attempt to expose application developers to the world of game development, while lowering the bar so you can focus on the interesting part. **

The game dynamics are handled.
Object collision is handled.
### **You build the strategy.**

# How does it work?

![](https://www.codecollision.dev/git-game.png)

code / collision is an ever-expand library of games that work on the same set of principles:
- 2 teams
- Can be simultaneous or turn-based
- The game mechanics are handled
- You determine what your team's strategy is for the desired game
- You write the code for that strategy:
 - You are given the game-state in the parameters
 - You return 2 things: Angle you want to move, and overall Power.
- Your code is called periodically, **once per player on your team**
