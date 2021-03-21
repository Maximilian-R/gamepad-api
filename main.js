// https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API
// https://w3c.github.io/gamepad/#remapping

const game = document.querySelector(".game");
let players = [];

window.addEventListener("gamepadconnected", (event) => {
  console.log(`Connected controller with id ${event.gamepad.id}`);
  console.log(event.gamepad);

  createPlayer(event.gamepad);
});

window.addEventListener("gamepaddisconnected", (event) => {
  console.log(`Disconnected controller with id ${event.gamepad.id}`);
  console.log(event.gamepad);

  removePlayer(event.gamepad);
});

const gameLoop = () => {
  const gamepads = navigator.getGamepads();

  players.forEach(({ buttonNodes, level, controllerIndex }) => {
    level.update();

    const gamepad = gamepads[controllerIndex];
    for (var i = 0; i < buttonNodes.length; i++) {
      if (gamepad.buttons[i].pressed) {
        level.pressed();
        buttonNodes[i].classList.add("pressed");
      } else {
        buttonNodes[i].classList.remove("pressed");
      }
    }
  });
  requestAnimationFrame(gameLoop);
};

const createPlayer = (gamepad) => {
  const fragment = document.createDocumentFragment();

  const player = document.createElement("div");
  player.classList.add("player");
  player.id = `player${gamepad.index + 1}`;
  fragment.appendChild(player);

  const playerTitle = document.createElement("H2");
  playerTitle.textContent = `Player ${gamepad.index + 1}`;
  player.appendChild(playerTitle);

  const buttonGroup = document.createElement("div");
  buttonGroup.classList.add("buttons");
  player.appendChild(buttonGroup);
  for (var i = 0; i <= 3; i++) {
    const button = document.createElement("div");
    button.classList.add("button-" + i);
    button.classList.add("button");
    buttonGroup.appendChild(button);
  }

  const level = document.createElement("div");
  level.classList.add("level");
  player.appendChild(level);

  const levelValue = document.createElement("div");
  level.appendChild(levelValue);

  game.appendChild(fragment);
  players.push({
    controllerIndex: gamepad.index,
    buttonNodes: buttonGroup.childNodes,
    level: createLevel(levelValue),
  });
};

const removePlayer = (gamepad) => {
  players = players.filter(
    ({ controllerIndex }) => controllerIndex != gamepad.index
  );
  document.querySelector(`#player${gamepad.index + 1}`).remove();
};

const createLevel = (node) => {
  return {
    node,
    value: 100,
    target: 100,
    update() {
      this.value -= 1;
      if (this.value < 0) {
        this.value = 0;
      }
      node.style = `width: ${this.percent()}%;`;
    },
    pressed() {
      this.value += 5;
      if (this.value > this.target) {
        this.value = this.target;
      }
    },
    percent() {
      return (this.value / this.target) * 100;
    },
  };
};

gameLoop();
