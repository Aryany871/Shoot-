        // import kaboom lib
        import kaboom from "https://unpkg.com/kaboom@next/dist/kaboom.mjs";
        
        // initialize kaboom context
        kaboom();
        
        // add a piece of text at position (120, 80)
        // add([
        //     text("hello"),
        //     pos(120, 80),
        // ]);
        
const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 800;
const SPEED = 400;

// // initialize context
// kaboom();

// load assets
loadSprite("bean", "deku.png")

scene("game", () => {

	// define gravity
	gravity(2400);

	// add a game object to screen
	const player = add([
		// list of components
		sprite("bean"),
		pos(80, 40),
		area(),
		body(),
        scale(2)
	]);

	// floor
	add([
		rect(width(), FLOOR_HEIGHT),
		outline(4),
		pos(0, height()),
		origin("botleft"),
		area(),
		solid(),
		color(127, 200, 255),
	]);

	function jump() {
		if (player.grounded()) {
			player.jump(JUMP_FORCE);
		}
	}

	// jump when user press space
	keyPress("space", jump);
	mouseClick(jump);

	function spawnTree() {

		// add tree obj
		add([
			rect(48, rand(32, 96)),
			area(),
			outline(4),
			pos(width(), height() - FLOOR_HEIGHT),
			origin("botleft"),
			color(255, 180, 255),
			move(LEFT, SPEED),
			cleanup(),
			"tree",
		]);

		// wait a random amount of time to spawn next tree
		wait(rand(0.5, 1.5), spawnTree);

	}

	// start spawning trees
	spawnTree();

	// lose if player collides with any game obj with tag "tree"
	player.collides("tree", () => {
		// go to "lose" scene and pass the score
		go("lose", score);
		// burp();
		addKaboom(player.pos);
	});

	// keep track of score
	let score = 0;

	const scoreLabel = add([
		text(score),
		pos(24, 24),
	]);

	// increment score every frame
    //////////////////////////////////
	action(() => {
		score++;
		scoreLabel.text = score;
	});

});

scene("lose", (score) => {

	add([
		sprite("bean"),
		pos(width() / 2, height() / 2 - 80),
		scale(2),
		origin("center"),
	]);

	// display score
	add([
		text(score),
		pos(width() / 2, height() / 2 + 80),
		scale(2),
		origin("center"),
	]);

	// go back to game with space is pressed
	keyPress("space", () => go("game"));
	mouseClick(() => go("game"));

});

go("game");








// function spawnBullet(p) {
// 	add([
// 		rect(12, 48),
// 		area(),
// 		pos(p),
// 		origin("center"),
// 		color(127, 127, 255),
// 		outline(4),
// 		move(UP, BULLET_SPEED),
// 		cleanup(),
// 		// strings here means a tag
// 		"bullet",
// 	]);
// }

// action("bullet", (b) => {
// 	if (insaneMode) {
// 		b.color = rand(rgb(0, 0, 0), rgb(255, 255, 255));
// 	}
// });

// keyPress("space", () => {
// 	spawnBullet(player.pos.sub(16, 0));
// 	spawnBullet(player.pos.add(16, 0));
// 	play("shoot", {
// 		volume: 0.3,
// 		detune: rand(-1200, 1200),
// 	});
// });

// collides("bullet", "enemy", (b, e) => {
// 	destroy(b);
// 	e.hurt(insaneMode ? 10 : 1);
// 	addExplode(b.pos, 1, 24, 1);
// });


add([
    text("SHIELD: ",8),
    pos(300, 10),
    origin("center"),
    layer("ui"),
]);

const shieldHolder = add ([
    rect(52,12),
    pos(350, 10),
    color(100,100,100),
    origin("center"),
    layer("ui"),
]);

const shieldHolderInside = add ([
    rect(50,10),
    pos(350, 10),
    color(0,0,0),
    origin("center"),
    layer("ui"),
]);

const shieldBar = add ([
    rect(50,10),
    pos(325, 5),
    color(0,255,0),
    layer("ui"),
]);



function updatePlayerShield(shieldPoints){
    player.shield += shieldPoints;
    player.shield = Math.max(player.shield, 0);
    player.shield = Math.min(player.shield, 100);

    shieldBar.width = 50 * (player.shield / 100);

    if (player.shield < 20) shieldBar.color = rgb(1,0,0);
    else if (player.shield < 50) shieldBar.color = rgb(1,0.5,0);
    else shieldBar.color = rgb(0,1,0);

    if (player.shield <=0){
        destroy(player);
        for (let i = 0; i < 500; i++) {
            wait(0.01 *i, ()=>{
                makeExplosion(vec2(rand(0,MAP_WIDTH,), rand(0, MAP_HEIGHT)), 5, 10, 10);
                play("explosion", {
                    detune: rand(-1200, 1200)
                });
            });
        }
        wait(2, ()=>{
            go("endGame");
        });
    }
}

anime({
	// content
})