// ASSETS
const FOOD_SOUND = new Audio("../assets/music/food.mp3");
const GAMEOVER_SOUND = new Audio("../assets/music/gameover.mp3");
const MOVE_SOUND = new Audio("../assets/music/move.mp3");
const MUSIC_SOUND = new Audio("../assets/music/music.mp3");

// ELEMENTS
const gameContainer = document.querySelector(".container");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".highScore");

let IS_PAUSED = false;
// GLOBALS
let game_speed = 8;
let lastPaintTime = 0;
let score = 0;
let snake = [{ x: 8, y: 8 }];
let food = { x: 17, y: 5 };
let direction = { x: 0, y: 0 };

function randRange(start, end) {
	return Math.round(Math.random() * (end - start) + start);
}

function main(ctime) {
	if (!IS_PAUSED) {
		window.requestAnimationFrame(main);
		if ((ctime - lastPaintTime) / 1000 < 1 / game_speed) {
			return;
		}
		lastPaintTime = ctime;
		gameEngine();
	}
}

function playPause() {
	if (IS_PAUSED) {
		window.requestAnimationFrame(main);
	}
	console.log("State: ", IS_PAUSED);
	IS_PAUSED = !IS_PAUSED;
	console.log("Setting State: ", IS_PAUSED);
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
		snake[0].x >= 20 ||
		snake[0].x <= 0 ||
		snake[0].y >= 20 ||
		snake[0].y <= 0
	) {
		return true;
	}

	return false;
}

function gameEngine() {
	if (isCollided(snake)) {
		MUSIC_SOUND.pause();
		GAMEOVER_SOUND.play();
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
		// MUSIC_SOUND.play();
	}

	// Check if food eaten and update accordingly
	if (snake[0].x === food.x && snake[0].y === food.y) {
		FOOD_SOUND.play();
		score += 1;
		scoreElement.innerText = score;
		snake.unshift({
			x: snake[0].x + direction.x,
			y: snake[0].y + direction.y,
		});
		food = { x: randRange(0, 21), y: randRange(0, 21) };
	}

	// move the snake
	for (let i = snake.length - 2; i >= 0; i--) {
		snake[i + 1] = { ...snake[i] };
	}

	snake[0].x = Math.max(snake[0].x + direction.x, 0);
	snake[0].y = Math.max(snake[0].y + direction.y, 0);

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

// main logic
// MUSIC_SOUND.play();
let highScore = localStorage.getItem("highScore");
if (highScore == null) {
	localStorage.setItem("highScore", 0);
} else {
	highScoreElement.innerText = highScore;
}

window.requestAnimationFrame(main);
document.addEventListener("keyup", (e) => {
	switch (e.key) {
		case "w":
		case "ArrowUp":
			MOVE_SOUND.play();
			direction.x = 0;
			direction.y = -1;
			break;
		case "s":
		case "ArrowDown":
			MOVE_SOUND.play();
			direction.x = 0;
			direction.y = 1;
			break;
		case "a":
		case "ArrowLeft":
			MOVE_SOUND.play();
			direction.x = -1;
			direction.y = 0;
			break;
		case "d":
		case "ArrowRight":
			MOVE_SOUND.play();
			direction.x = 1;
			direction.y = 0;
			break;
		case "p":
			playPause();
			break;
		default:
			direction.x = 0;
			direction.y = 0;
			break;
	}
});
