export function playSound(sound) {
	sound.play();
}

export function pauseSound(sound) {
	sound.pause();
}

export function randRange(start, end) {
	return Math.round(Math.random() * (end - start) + start);
}

export function playMoveEffectSound(BG_MUSIC, MOVE_EFFECT) {
	let isbgMusicEnabled = sessionStorage.getItem("isBGMusicOn") === "true";
	if (isbgMusicEnabled) {
		playSound(BG_MUSIC);
	}
	let isSoundEffectsEnabled =
		sessionStorage.getItem("isSoundEffectsOn") === "true";
	if (isSoundEffectsEnabled) {
		playSound(MOVE_EFFECT);
	}
}

export function isCollided(snake) {
	// If you bump into yourself
	for (let i = 1; i < snake.length; i++) {
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

export function validateMoveAndChangeDirection(
	dir_name,
	directionObj,
	BG_MUSIC,
	MOVE_EFFECT
) {
	switch (dir_name) {
		case "w":
		case "ArrowUp":
			playMoveEffectSound(BG_MUSIC, MOVE_EFFECT);
			directionObj.x = 0;
			directionObj.y = -1;
			break;
		case "s":
		case "ArrowDown":
			playMoveEffectSound(BG_MUSIC, MOVE_EFFECT);
			directionObj.x = 0;
			directionObj.y = 1;
			break;
		case "a":
		case "ArrowLeft":
			playMoveEffectSound(BG_MUSIC, MOVE_EFFECT);
			directionObj.x = -1;
			directionObj.y = 0;
			break;
		case "d":
		case "ArrowRight":
			playMoveEffectSound(BG_MUSIC, MOVE_EFFECT);
			directionObj.x = 1;
			directionObj.y = 0;
			break;
		default:
			break;
	}
}
