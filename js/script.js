// ----------- ASSETS -------------
const FOOD_EAT_EFFECT = new Audio("../assets/music/food.mp3");
const GAMEOVER_EFFECT = new Audio("../assets/music/gameover.mp3");
const MOVE_EFFECT = new Audio("../assets/music/move.mp3");
const BG_MUSIC = new Audio("../assets/music/music.mp3");

// ------------- ELEMENTS -------------
const gameContainer = document.querySelector(".container");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".highScore");
const topButton = document.querySelector(".top");
const bottomButton = document.querySelector(".bottom");
const leftButton = document.querySelector(".left");
const rightButton = document.querySelector(".right");
const instructionsElement = document.querySelector("#instructions-container");
const gameStartButton = document.querySelector(".start");

// ---------- GLOBALS -----------
let IS_PAUSED = false;
let lastPaintTime = 0;
let score = 0;
let snake = [{ x: 8, y: 8 }];
let food = { x: 17, y: 5 };
let direction = { x: 0, y: 0 };

// ----------- HELPER FUNCTIONS ------------

function playSound(sound) {
	sound.play();
}

function pauseSound(sound) {
	sound.pause();
}

function randRange(start, end) {
	return Math.round(Math.random() * (end - start) + start);
}

function playMoveEffectSound() {
	let isbgMusicEnabled = sessionStorage.getItem("isBGMusicOn") === "true";
	if (isbgMusicEnabled) {
		playSound(BG_MUSIC);
	}
	let isEnabled = sessionStorage.getItem("isSoundEffectsOn") === "true";
	if (isEnabled) {
		playSound(MOVE_EFFECT);
	}
}

function main(ctime) {
	if (!IS_PAUSED) {
		window.requestAnimationFrame(main);
		let game_speed = sessionStorage.getItem("GAME_SPEED") ?? 5;
		if ((ctime - lastPaintTime) / 1000 < 1 / +game_speed) {
			return;
		}
		lastPaintTime = ctime;
		gameEngine();
	}
}

function playPause() {
	if (IS_PAUSED) {
		let isBGMusicOn = sessionStorage.getItem("isBGMusicOn") === "true";
		if (isBGMusicOn) {
			playSound(BG_MUSIC);
		}
		window.requestAnimationFrame(main);
	} else {
		let isBGMusicOn = sessionStorage.getItem("isBGMusicOn") === "true";
		if (isBGMusicOn) {
			pauseSound(BG_MUSIC);
		}
	}
	IS_PAUSED = !IS_PAUSED;
	return IS_PAUSED;
}

function isCollided(snakeArr) {
	// If you bump into yourself
	for (let i = 1; i < snakeArr.length; i++) {
		if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
			return true;
		}
	}
	// If you bump into the wall
	if (
		snake[0].x >= 21 ||
		snake[0].x <= 0 ||
		snake[0].y >= 21 ||
		snake[0].y <= 0
	) {
		return true;
	}

	return false;
}

function detectAndHandleCollision() {
	if (isCollided(snake)) {
		pauseSound(BG_MUSIC);
		let soundfxEnabled =
			sessionStorage.getItem("isSoundEffectsOn") === "true";
		if (soundfxEnabled) playSound(GAMEOVER_EFFECT);
		alert("Game Over");
		if (score > highScore) {
			localStorage.setItem("highScore", score);
			highScoreElement.innerText = score;
			alert("New High Score");
		}
		snake = [{ x: 8, y: 8 }];
		food = { x: 17, y: 5 };
		direction = { x: 0, y: 0 };
		score = 0;
		scoreElement.innerText = 0;
		let isBGMusicOn = sessionStorage.getItem("isBGMusicOn") === "true";
		if (isBGMusicOn) {
			playSound(BG_MUSIC);
		}
	}
}

function gameEngine() {
	// Check if food eaten and update accordingly
	if (snake[0].x === food.x && snake[0].y === food.y) {
		let soundfxEnabled =
			sessionStorage.getItem("isSoundEffectsOn") === "true";
		if (soundfxEnabled) playSound(FOOD_EAT_EFFECT);
		score += 1;
		scoreElement.innerText = score;
		snake.unshift({
			x: snake[0].x + direction.x,
			y: snake[0].y + direction.y,
		});
		food = { x: randRange(1, 20), y: randRange(1, 20) };
	}

	// move the snake
	for (let i = snake.length - 2; i >= 0; i--) {
		snake[i + 1] = { ...snake[i] };
	}

	snake[0].x = Math.max(snake[0].x + direction.x, 0);
	snake[0].y = Math.max(snake[0].y + direction.y, 0);

	detectAndHandleCollision();

	// Display the snake and food
	gameContainer.innerHTML = "";
	snake.forEach((s, i) => {
		const el = document.createElement("div");
		if (i == 0) {
			el.classList.add("snake-head");
		} else {
			el.classList.add("snake-body");
		}

		el.style.gridRowStart = s.y;
		el.style.gridColumnStart = s.x;

		gameContainer.appendChild(el);
	});

	const foodElement = document.createElement("div");
	foodElement.classList.add("food");
	foodElement.style.gridRowStart = food.y;
	foodElement.style.gridColumnStart = food.x;
	gameContainer.appendChild(foodElement);
}

function validateMoveAndChangeDirection(dirString) {
	switch (dirString) {
		case "w":
		case "ArrowUp":
			playMoveEffectSound();
			direction.x = 0;
			direction.y = -1;
			break;
		case "s":
		case "ArrowDown":
			playMoveEffectSound();
			direction.x = 0;
			direction.y = 1;
			break;
		case "a":
		case "ArrowLeft":
			playMoveEffectSound();
			direction.x = -1;
			direction.y = 0;
			break;
		case "d":
		case "ArrowRight":
			playMoveEffectSound();
			direction.x = 1;
			direction.y = 0;
			break;
		case "p":
			playPause();
			break;
		default:
			break;
	}
}

// ----------- MAIN LOGIC STARTS HERE ---------------

// SHOWING INSTRUCTIONS COMPONENT ON INITIAL LOAD
gameStartButton.addEventListener("click", (e) => {
	instructionsElement.classList.add("hidden");
	let isBGMusicOn = sessionStorage.getItem("isBGMusicOn") === "true";
	if (isBGMusicOn) {
		playSound(BG_MUSIC);
	}
});

let isInitialLoadDone = sessionStorage.getItem("isInitialLoadDone");

if (!isInitialLoadDone) {
	instructionsElement.classList.remove("hidden");
	sessionStorage.setItem("isInitialLoadDone", true);
}

// SETTING DEFAULT VALUES

let isBGMusicOn = sessionStorage.getItem("isBGMusicOn");
let isSoundEffectsOn = sessionStorage.getItem("isSoundEffectsOn");
let GAME_SPEED = sessionStorage.getItem("GAME_SPEED");

if (!isBGMusicOn || !isSoundEffectsOn || !GAME_SPEED) {
	isBGMusicOn = sessionStorage.setItem("isBGMusicOn", true);
	isSoundEffectsOn = sessionStorage.setItem("isSoundEffectsOn", true);
	GAME_SPEED = sessionStorage.setItem("GAME_SPEED", 5);
}

// SETTING HIGH SCORE
let highScore = localStorage.getItem("highScore");
if (highScore == null) {
	localStorage.setItem("highScore", 0);
} else {
	highScoreElement.innerText = highScore;
}

// GAME LOOP CALL
window.requestAnimationFrame(main);

// GAME CONTROL EVENT LISTENERS
document.addEventListener("keyup", (e) => {
	validateMoveAndChangeDirection(e.key);
});

[topButton, bottomButton, leftButton, rightButton].forEach((btn) => {
	btn.addEventListener("click", (e) => {
		validateMoveAndChangeDirection(e.target.value);
	});
});
