const CONTROLLER = {
  BUTTONS: {
    CROSS: 0,
    CIRCLE: 1,
    SQUARE: 2,
    TRIANGLE: 3,
    L1: 4,
    R1: 5,
    L2: 6,
    R2: 7,
    CREATE: 8,
    OPTIONS: 9,
    L3: 10,
    R3: 11,
    UP: 12,
    DOWN: 13,
    LEFT: 14,
    RIGHT: 15,
    TOUCHPAD: 16,
  },
  AXES: {
    LX: 0,
    LY: 1,
    RX: 2,
    RY: 3,
  },
};

class GamePadComponent extends HTMLElement {
  constructor() {
    super();

    this.gamepad;
    this.cachedButtons = {};
    this.focusedElement;
    this.focusIndex = -1;
    this.cursor = {
      x: 0,
      y: 0,
    };

    this.cursorElement = document.createElement("div");
    this.cursorElement.style = `
        pointer-events: none;
        z-index: 1000000;
        position: fixed;
        width: 2rem;
        height: 2rem;
        top: 0;
        left: 0;
        transform: translate(-0.5rem, -0.5rem);
        background-size: contain;
        background-image: url("data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjgwMHB4IiB3aWR0aD0iODAwcHgiIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgCgkgdmlld0JveD0iMCAwIDMzOS4wMDIgMzM5LjAwMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGc+CgkJPHBvbHlnb24gc3R5bGU9ImZpbGw6IzAxMDAwMjsiIHBvaW50cz0iMTExLjk1NiwyMC41MjYgOTIuNDg2LDEuMDUgMCw5My41MzcgMTkuNDcsMTEzLjAxMyA1NS45MjIsNzYuNTU1IDExOS42MDYsMTM5Ljk0MSAKCQkJMTM5LjA0LDEyMC40MzUgNzUuMzkxLDU3LjA4NSAJCSIvPgoJCTxwb2x5Z29uIHN0eWxlPSJmaWxsOiMwMTAwMDI7IiBwb2ludHM9IjIyNy4wNDUsMjAuNTI2IDI2My42MSw1Ny4wODUgMTk5Ljk2MiwxMjAuNDM1IDIxOS4zOTYsMTM5Ljk0MSAyODMuMDgsNzYuNTU1IAoJCQkzMTkuNTMyLDExMy4wMTMgMzM5LjAwMiw5My41MzcgMjQ2LjUxNSwxLjA1IAkJIi8+CgkJPHBvbHlnb24gc3R5bGU9ImZpbGw6IzAxMDAwMjsiIHBvaW50cz0iMjgzLjA4LDI2Mi40NDcgMjE5LjM5NiwxOTkuMDU1IDE5OS45NjIsMjE4LjU2NiAyNjMuNjEsMjgxLjkxNyAyMjcuMDQ1LDMxOC40NzYgCgkJCTI0Ni41MTUsMzM3Ljk1MiAzMzkuMDAyLDI0NS40NjUgMzE5LjUzMiwyMjUuOTg5IAkJIi8+CgkJPHBvbHlnb24gc3R5bGU9ImZpbGw6IzAxMDAwMjsiIHBvaW50cz0iMTE5LjYwNiwxOTkuMDU1IDU1LjkyMiwyNjIuNDQ3IDE5LjQ3LDIyNS45ODkgMCwyNDUuNDY1IDkyLjQ4NiwzMzcuOTUyIDExMS45NTYsMzE4LjQ3NiAKCQkJNzUuMzkxLDI4MS45MTcgMTM5LjA0LDIxOC41NjYgCQkiLz4KCQk8cGF0aCBzdHlsZT0iZmlsbDojMDEwMDAyOyIgZD0iTTE3My41NywxNDcuNjk4djEyLjY1YzMuMjE2LDEuNzU0LDUuNDMsNS4xNzksNS40Myw5LjE1M2MwLDMuOTgtMi4yMiw3LjM5OS01LjQzLDkuMTUzdjEyLjY1CgkJCWM5LjkyOS0yLjIwMiwxNy4zNjQtMTEuMTE2LDE3LjM2NC0yMS44MDNDMTkwLjkzNCwxNTguODE0LDE4My40OTMsMTQ5LjksMTczLjU3LDE0Ny42OTh6Ii8+CgkJPHBhdGggc3R5bGU9ImZpbGw6IzAxMDAwMjsiIGQ9Ik0xNDYuNjg0LDE2OS41MDFjMCwxMC42OTMsNy40NDEsMTkuNjAxLDE3LjM2NCwyMS44MDN2LTEyLjY1Yy0zLjIxNi0xLjc1NC01LjQzLTUuMTc5LTUuNDMtOS4xNTMKCQkJYzAtMy45OCwyLjIyLTcuMzk5LDUuNDMtOS4xNTN2LTEyLjY1QzE1NC4xMjQsMTQ5LjksMTQ2LjY4NCwxNTguODA4LDE0Ni42ODQsMTY5LjUwMXoiLz4KCTwvZz4KPC9nPgo8L3N2Zz4=")
    `;
    document.body.appendChild(this.cursorElement);

    window.addEventListener("gamepadconnected", (event) => {
      console.log(`Connected controller with id ${event.gamepad.id}`);
      console.log(event.gamepad);

      this.loop();
    });

    window.addEventListener("gamepaddisconnected", (event) => {
      console.log(`Disconnected controller with id ${event.gamepad.id}`);
      console.log(event.gamepad);
    });
  }

  get focusableElements() {
    return (
      window.ally?.query.focusable({
        strategy: "quick",
      }) ?? []
    );
  }

  tab(forward = true) {
    const elements = this.focusableElements;
    if (forward) {
      this.focusIndex = (this.focusIndex + 1) % elements.length;
    } else {
      this.focusIndex = this.focusIndex - 1;
      if (this.focusIndex < 0) this.focusIndex = elements.length - 1;
    }
    this.focusedElement = elements[this.focusIndex];
    this.focusedElement?.focus({ focusVisible: true });
  }

  click() {
    this.focusedElement?.click();
  }

  isPressed(index) {
    return (
      this.gamepad.buttons[index].pressed && this.cachedButtons[index] !== true
    );
  }

  isPushed(axis) {
    const axisValue = (index) =>
      Math.abs(this.gamepad.axes[index]) > 0.05
        ? this.gamepad.axes[index] * 10
        : 0;

    if (typeof axis === "number") {
      return axisValue(axis);
    } else {
      Object.keys(axis).map((key) => axisValue(axis[key]));
    }
  }

  input() {
    if (this.isPressed(CONTROLLER.BUTTONS.LEFT)) {
      this.tab(false);
    }
    if (this.isPressed(CONTROLLER.BUTTONS.RIGHT)) {
      this.tab(true);
    }
    if (this.isPressed(CONTROLLER.BUTTONS.CROSS)) {
      this.click();
    }
    if (this.isPressed(CONTROLLER.BUTTONS.L1)) {
      history.back();
    }
    if (this.isPressed(CONTROLLER.BUTTONS.R1)) {
      history.forward();
    }

    this.cursor.x += this.isPushed(CONTROLLER.AXES.LX);
    this.cursor.y += this.isPushed(CONTROLLER.AXES.LY);
    scrollBy(this.isPushed(CONTROLLER.AXES.RX), 0);
    scrollBy(0, this.isPushed(CONTROLLER.AXES.RX));

    if (this.isPushed(CONTROLLER.AXES)) {
      if (this.cursor.x > window.innerWidth) this.cursor.x = window.innerWidth;
      if (this.cursor.x < 0) this.cursor.x = 0;
      if (this.cursor.y > window.innerHeight)
        this.cursor.y = window.innerHeight;
      if (this.cursor.y < 0) this.cursor.y = 0;

      const prevElement = this.focusedElement;
      const elementAtCursor = document.elementFromPoint(
        this.cursor.x,
        this.cursor.y,
      );
      if (prevElement !== elementAtCursor) {
        //prevElement?.blur();
        elementAtCursor?.focus({ focusVisible: true });
        this.focusedElement = elementAtCursor;
        this.focusIndex = this.focusableElements.indexOf(this.focusedElement);
      }
    }
  }

  loop() {
    this.gamepad = navigator.getGamepads()[0];
    const pressedButtons = { ...this.gamepad.buttons.map((b) => b.pressed) };
    this.input();
    this.cachedButtons = pressedButtons;

    this.cursorElement.style.top = `${this.cursor.y}px`;
    this.cursorElement.style.left = `${this.cursor.x}px`;

    requestAnimationFrame(() => this.loop());
    // setTimeout(() => requestAnimationFrame(() => this.loop()), 100);
  }
}

customElements.define("gamepad-component", GamePadComponent);

const element = document.createElement("gamepad-component");
document.body.appendChild(element);
