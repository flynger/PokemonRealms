var Input = {
    RIGHT: false,
    LEFT: false,
    UP: false,
    DOWN: false,
    SHIFT: false
}
function keyDownHandler(event) {
    if (event.keyCode === 39 || event.keyCode === 68) {
        Input.RIGHT = true;
    } else if (event.keyCode === 37 || event.keyCode === 65) {
        Input.LEFT = true;
    }
    if (event.keyCode === 40 || event.keyCode === 83) {
        Input.DOWN = true;
    } else if (event.keyCode === 38 || event.keyCode === 87) {
        Input.UP = true;
    }
    if (event.keyCode === 16) {
        Input.SHIFT = true;
    }
}
function keyUpHandler(event) {
    if (event.keyCode === 39 || event.keyCode === 68) {
        Input.RIGHT = false;
    } else if (event.keyCode === 37 || event.keyCode === 65) {
        Input.LEFT = false;
    }
    if (event.keyCode === 40 || event.keyCode === 83) {
        Input.DOWN = false;
    } else if (event.keyCode === 38 || event.keyCode === 87) {
        Input.UP = false;
    }
    if (event.keyCode === 16) {
        Input.SHIFT = false;
    }
}
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);