import kaboom from "https://unpkg.com/kaboom@next/dist/kaboom.mjs";
        
        // initialize kaboom context
        kaboom();

//health bar
 health = 3
       
 const FLOOR_HEIGHT = 48;
 const JUMP_FORCE = 800;
 const SPEED = 300;
 const BULLET_SPEED=400;

 // loading the sprites
 loadSprite("deku", "resources/player2.png") 
 loadSprite("enemy", "resources/Enamy.png")
 loadSprite("bullet","resources/fireball.png")
 loadSprite("heart","resources/heart.png")
 loadSprite("obstacle","resources/obstacles.png")
 loadSprite("spikess","resources/spikes.png")
//loadSprite("splode","splode.gif")

 //loading sounds
 loadSound("music","resources/bg music.wav")
 loadSound("gameover","resources/gameover.mp3")
 loadSound("shot","resources/electronicShot.wav")
 loadSound("explosion","resources/explosion.wav")
 loadSound("collision","resources/collision.wav")

 //loading animations
 //explosion
 loadSpriteAtlas("resources/Xplosion.png", {
	"xplode": {
		x:450,
		y:0,
		width: 990,
		height: 89,
		sliceX: 11,
		anims: {
			'explode': { from: 0, to: 10, speed: 12},
		},
	},
})

//spinning stars
// loadSpriteAtlas("stars.png", {
// 	"stars": {
// 		x:30,
// 		y:5,
// 		width: 700,
// 		height: 64,
// 		sliceX: 7,
// 		anims: {
// 			'spin': { from: 0, to: 6, speed: 5},
// 		},
// 	},
// })

//red balls
// loadSpriteAtlas("red balls.jpg",{
// 	"balls" : {
// 		x:400,
// 		y:5,
// 		width: 27360,
// 		height: 480,
// 		sliceX: 57,
// 		anims: {
// 		'rotate': { from: 0, to: 56,loop:true, speed: 4},
// 		}
// 	}
// })

//healthBar function
function healthBar(x){
	for(let i = 0; i<health-x;i++){
	add([
		sprite("heart"),
		scale(1.3),
		pos(i*40 + 200, 3)
	]);

	// const lives = add([
	// 	sprite("balls"),
	// 	pos(i*40 + 200, 3),
	// 	scale(0.3),
		
	// ])

	// lives.play("rotate")

}
}


//game scene
scene("level1", (x,y) => {
	//background
	add([
		rect(width(),height()),
		pos(0,0),
		color(0,0,0),
	])
	//keep track of the health
	var healthLose = y
    healthBar(healthLose);

	// define gravity
	gravity(2400);

	// add a game objects to screen

	//player
	const player = add([
		// list of components
		sprite("deku"),
		scale(0.15),
		pos(20, 0),
		area(),
		body(),
	]);

	// spinning stars animation
	// if(y>0){
	// const spinning = add([
	// 	sprite("stars"),
	// 	pos(player.pos.add(5,-10)),
	// 	area(),
	// 	body(),
	// ])

	// spinning.play("spin")
	// wait(1,destroy(spinning))
    // }


	// floor
	add([
		rect(width(), FLOOR_HEIGHT),
		outline(4),
		pos(0, height()),
		origin("botleft"),
		area(),
		solid(),
		// color(150, 75, 0)
		// color(64,224,208)
		color(127, 200, 255),
		
	]);

	// ceiling
	add([
		rect(width(), 10),
		outline(4),
		pos(0, 80),
		origin("botleft"),
		area(),
		// solid(),
		// color(150, 75, 0)
		// color(64,224,208)
		color(0,0,139),
		
	]);

	function jump() {
		// if (er.grounded()) {
			player.jump(JUMP_FORCE);
		// }
	}

	// jump when user press space
	keyPress("up", jump);
	mouseClick(jump);

	function spawnObs() {

		// add obstacle
		add([
			sprite("obstacle"),
			scale(rand(0.3,0.6)),
			// rect(48, rand(32, 96)),
			area(),
			// outline(4),
			pos(width(), height() - FLOOR_HEIGHT ),
			origin("botleft"),
            solid(),
			// color(255, 180, 255),
			move(LEFT, SPEED),
			cleanup(),
			"obstacle",
		]);

		// wait a random amount of time to spawn next obstacle
		wait(rand(0.9, 1.9), spawnObs);

	}

	// spawn spike

	function spawnspike(){
		add([
			sprite("spikess"),
			scale(0.6),
			area(),
			pos(width(),75),
			origin("topleft"),
            // solid(),
			// color(255, 180, 255),
			move(LEFT, SPEED),
			cleanup(),
			"spikess",
		]);

		// wait a random amount of time to spawn next spike
		wait(0.4, spawnspike);

	}

	
    function spawnEnemy() {

		// add enemy
		add([
			sprite("enemy"),
			
			area(),
			body(),
			scale(0.27),
			// origin("botleft"),
			pos(rand(600, width()),rand(height())),
			// color(255, 180, 255),
			move(LEFT, SPEED),
			cleanup(),
			"enemy",
		]);

		// wait a random amount of time to spawn next enemy
		wait(rand(1.0, 2.0), spawnEnemy);

	}
    
    //spawns bullets
    function spawnBullet(p) {
		//launch sound
		const  launchSound = play("shot", {
			volume: 0.8
		});
        add([
			sprite("bullet"),
			scale(0.25),
        //   rect(18,6), 
          area(),
          pos(p), 
          origin('botleft'), 
        //   color(255,255,0),
		//   cleanup(),
          'bullet'
          ])

   
      }
	  

       //bullet action
    keyPress('right', () => {
        spawnBullet(player.pos.add(50,40))
        })
        
    action('bullet', (b) => {
        b.move(BULLET_SPEED, 0)
        if (b.pos.x >= width()/2) {
            destroy(b)
          }
        })
	
	
	// start spawning obstacle
    spawnEnemy();
    spawnObs();
	spawnspike();
	

  
  // // lose if er collides with any game obj with tags "obstacle" and "enemy"
	player.collides("obstacle", () => {
		// camShake(4); apparently this doesn't even exist

		//sound after collision
		const  collisionSouns = play("collision", {
			volume: 0.8
		});

		//decrement the health bar 
		healthLose++; 
		
		// go to "lose" scene if no heart remains and pass the score
		if(healthLose==3){ 
		go("lose", score);
		// burp();
		// addKaboom(player.pos);
		}

		//else continue the game with current score and one less heart 
		else{
			go("level1",score,healthLose);
		}
	});

    
	player.collides("spikess", () => {
		// camShake(4); apparently this doesn't even exist

		//sound after collision
		const  collisionSouns = play("collision", {
			volume: 0.8
		});

		//decrement the health bar 
		healthLose++; 
		
		// go to "lose" scene if no heart remains and pass the score
		if(healthLose>=3){ 
		go("lose", score);
		// burp();
		// addKaboom(player.pos);
		}

		//else continue the game with current score and one less heart 
		else{
			go("level1",score,healthLose);
		}
	});

	player.collides("enemy", () => {

		//sound after collision
		const  collisionSouns = play("collision", {
			volume: 0.8
		});

		//decrement the health bar 
		healthLose++; 
		
		// go to "lose" scene if no heart remains and pass the score
		if(healthLose==3){ 
		go("lose", score);
		// burp();
		// addKaboom(player.pos);
		}

		//else continue the game with current score and one less heart 
		else{ 
		go("level1",score,healthLose);
		}
	});

	let score=x

	const scoreLabel = add([
		text(score,{size:50, font:'sink'}),
		pos(24, 18),
		scale(0.8)
	]);

	

	collides('bullet', 'enemy', (b,s) => {
		// add[(
		// 	sprite("splode"),
		// 	scale(1),
		// 	pos(s)

		// )]
		//exlosion sound
		const  explosionSound = play("explosion", {
			volume: 0.3
		});

		const explo = add([
			sprite("xplode"),
			pos(s.pos.add(0,-10))
			// origin("botleft")
		])

		explo.play("explode")


		

		// camShake(4),
		destroy(b),
		destroy(s),
		// destroy("splode")
		score += 40
		scoreLabel.text = score
	  })

	// if (score==400){
	// 	go("win")
	// }

	collides('bullet', 'obstacle', (b) => {
		// camShake(4),
		destroy(b)
	  })
	  
	// increment score every frame
    //////////////////////////////////
	// action(() => {
	// 	score++;
	// 	scoreLabel.text = score;
	// });


	// sound for the game

	// const music = play("music", {
	// 	volume: 0.7,
	// 	loop: true
	// });

});

//We were not able to decide characters but then artist Tirthankar 
//came to rescue and drew fantastic characters 

// bringing healthbar also brought a bunch of problems too lol
//  but Master Aryan has solved them alll

// design toh mast hai ab

// background bhi ho gaya

// air me obs/enemies, which do not increment points

// sound effects bhi ho gaye

// collision effects, almost there




//cleared the level
// scene("win",()=>{
// 	//background
// 	add([
// 		rect(width(),height()),
// 		pos(0,0),
// 		color(0,0,0),
// 	])

// 	add([
// 		sprite("deku"),
// 		pos(width() / 2, height() / 2 - 80),
// 		scale(0.6),
// 		origin("center"),
// 	]);

// 	keyPress("enter", () => go("level2"));
// 	mouseClick(() => go("level2"));
// });

//Game over scene
scene("lose", (score) => {
	//game over sound
	
	const  gameOverSound = play("gameover", {
		volume: 0.8
	});


   //background
	add([
		rect(width(),height()),
		pos(0,0),
		color(0,0,0),
	])
	
	add([
		sprite("deku"),
		pos(width() / 2, height() / 2 - 80),
		scale(0.6),
		origin("center"),
	]);
	
	// display score
		add([
		text(score,{size:45, font:'sink'}),
		pos(width() / 2, height() / 2 + 80),
		scale(2),
		origin("center"),
	]);

	add([
		text("Game Over",{size:45, font:'sink'}),
		pos(width() / 2, height() / 2 - 250),
		scale(2),
		origin("center"),
	]);

	// go back to game with space is pressed
	//reset score
	// score=0;
	keyPress("space", () => go("level1", 0,0));
	mouseClick(() => go("level1", 0,0));

});

//main game starts here
//new game, resets score? YES IT DOES YESSSSS YESSSSSSS
go("level1", 0,0);


// Spikes on top
// Animations
// Aerial enemies

