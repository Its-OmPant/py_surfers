import {
	playSound,
	pauseSound,
	randRange,
	isCollided,
	validateMoveAndChangeDirection,
} from "./helper.js";

// ----------- ASSETS -------------
const FOOD_EAT_EFFECT = new Audio("assets/music/food.mp3");
const GAMEOVER_EFFECT = new Audio("assets/music/gameover.mp3");
const MOVE_EFFECT = new Audio("assets/music/move.mp3");
const BG_MUSIC = new Audio("assets/music/music.mp3");

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
const body = document.querySelector("body");
const settingsContainer = document.querySelector("#settings-container");
const backgroundMusicCheckBox = document.querySelector("#music");
const soundEffectCheckBox = document.querySelector("#effects");
const speedElement = document.querySelector("#speed-span");
const settingsCloseBtn = document.querySelector("#settings_close");
const settingsBtn = document.querySelector("#settings-btn");
const instructionsBtn = document.querySelector("#instructions-btn");
const bgSelector = document.querySelector("#backgroundSelect");
const speedButtons = Array.from(
	document.querySelector(".speed-btn-group")?.children ?? []
);

// ---------- GLOBALS -----------
let IS_PAUSED = false;
let lastPaintTime = 0;
let score = 0;
let snake = [{ x: 8, y: 8 }];
let food = { x: 17, y: 5 };
let direction = { x: 0, y: 0 };

// ----------- HELPER FUNCTIONS ------------

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

	// render snake
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

	// render food
	const foodElement = document.createElement("div");
	foodElement.classList.add("food");
	foodElement.style.gridRowStart = food.y;
	foodElement.style.gridColumnStart = food.x;
	gameContainer.appendChild(foodElement);
}

// ----------- MAIN LOGIC STARTS HERE ---------------

// SHOWING INSTRUCTIONS COMPONENT ON INITIAL LOAD
let isInitialLoadDone = sessionStorage.getItem("isInitialLoadDone");

if (!isInitialLoadDone) {
	instructionsElement.classList.remove("hidden");
	sessionStorage.setItem("isInitialLoadDone", true);
}

gameStartButton.addEventListener("click", (e) => {
	instructionsElement.classList.add("hidden");
	let isBGMusicOn = sessionStorage.getItem("isBGMusicOn") === "true";
	if (isBGMusicOn) {
		playSound(BG_MUSIC);
	}
});

// ---------- SETTING DEFAULT VALUES -----------

let isBGMusicKeyAvailable = sessionStorage.getItem("isBGMusicOn");
let isSoundEffectsKeyAvailable = sessionStorage.getItem("isSoundEffectsOn");
let GAME_SPEED_key_available = sessionStorage.getItem("GAME_SPEED");

if (
	!isBGMusicKeyAvailable ||
	!isSoundEffectsKeyAvailable ||
	!GAME_SPEED_key_available
) {
	sessionStorage.setItem("isBGMusicOn", true);
	sessionStorage.setItem("isSoundEffectsOn", true);
	sessionStorage.setItem("GAME_SPEED", 5);
}

let isBGMusicOn = sessionStorage.getItem("isBGMusicOn") === "true";
let isSoundEffectsOn = sessionStorage.getItem("isSoundEffectsOn") === "true";
let GAME_SPEED = sessionStorage.getItem("GAME_SPEED") ?? 5;

backgroundMusicCheckBox.checked = isBGMusicOn ?? false;
soundEffectCheckBox.checked = isSoundEffectsOn ?? false;
speedElement.innerText = GAME_SPEED;
sessionStorage.setItem("bgImageUrl", bgSelector.value);

settingsCloseBtn.onclick = () => {
	settingsContainer.classList.add("hidden");
};

let highScore = localStorage.getItem("highScore");
if (highScore == null) {
	localStorage.setItem("highScore", 0);
} else {
	highScoreElement.innerText = highScore;
}

// ---------- GAME LOOP -----------
window.requestAnimationFrame(main);

// ----------- EVENT LISTENERS ----------
document.addEventListener("keyup", (e) => {
	if (e.key == "p" || e.key == "P") {
		playPause();
		return;
	}
	validateMoveAndChangeDirection(e.key, direction, BG_MUSIC, MOVE_EFFECT);
});

[topButton, bottomButton, leftButton, rightButton].forEach((btn) => {
	btn.addEventListener("click", (e) => {
		validateMoveAndChangeDirection(
			e.target.value,
			direction,
			BG_MUSIC,
			MOVE_EFFECT
		);
	});
});

speedButtons.forEach((btn) => {
	if (btn.dataset.speed == GAME_SPEED) {
		btn.classList.add("active");
	}
});

backgroundMusicCheckBox?.addEventListener("click", (e) => {
	sessionStorage.setItem("isBGMusicOn", e.target.checked);
});

soundEffectCheckBox?.addEventListener("click", (e) => {
	sessionStorage.setItem("isSoundEffectsOn", e.target.checked);
});

speedButtons.forEach((btn) => {
	btn.addEventListener("click", (e) => {
		// remove active class from all btns
		speedButtons.forEach((btn) => btn.classList.remove("active"));
		speedElement.innerText = e.target.dataset.speed;
		sessionStorage.setItem("GAME_SPEED", e.target.dataset.speed);

		e.target.classList.add("active");
	});
});

settingsBtn.onclick = () => {
	settingsContainer.classList.remove("hidden");
};

instructionsBtn.onclick = () => {
	instructionsElement.classList.remove("hidden");
};

bgSelector.addEventListener("change", (e) => {
	sessionStorage.setItem("bgImageUrl", e.target.value);
	body.style.background = `url(${e.target.value})`;
	settingsContainer.style.background = `url(${e.target.value})`;
});
