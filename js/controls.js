const backgroundMusicCheckBox = document.querySelector("#music");
const soundEffectCheckBox = document.querySelector("#effects");
const speedElement = document.querySelector("#speed-span");
const speedButtons = Array.from(
	document.querySelector(".speed-btn-group")?.children ?? []
);

const pageCloseBtn = document.querySelector("#close");

// set defaults
if (
	backgroundMusicCheckBox &&
	soundEffectCheckBox &&
	speedElement &&
	speedButtons
) {
	let isBGMusicOn = sessionStorage.getItem("isBGMusicOn") === "true";
	let isSoundEffectsOn =
		sessionStorage.getItem("isSoundEffectsOn") === "true";
	let GAME_SPEED = sessionStorage.getItem("GAME_SPEED") ?? 5;

	console.log(isBGMusicOn, typeof isBGMusicOn);
	console.log(isBGMusicOn, typeof isBGMusicOn);
	backgroundMusicCheckBox.checked = isBGMusicOn ?? false;
	soundEffectCheckBox.checked = isSoundEffectsOn ?? false;
	speedElement.innerText = GAME_SPEED;

	speedButtons.forEach((btn) => {
		if (btn.dataset.speed == GAME_SPEED) {
			btn.classList.add("active");
		}
	});
}

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

pageCloseBtn?.addEventListener("click", (e) => {
	location.href = "/";
});
