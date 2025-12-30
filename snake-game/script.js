const ROWS = 25;
const COLS = 25;

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;

const CELL_SIZE = CANVAS_WIDTH / COLS;

const COLORS = {
  0: "white",
  1: "green",
  2: "red"
};

function setup() {
    points = 0;
    apples = [
        { x: 3,  y: 3  },
    ];
    snake = new Snake();
    document.getElementById("points").innerHTML = "Points: " + 0;
}


const TARGET_FPS = 7;
const FRAME_TIME = 1000 / TARGET_FPS;

let lastTime = 0;
let accumulator = 0;



class Snake {
    constructor() {
        this.direction = 0;
        this.head = {
            x: 3, y: 0
        };
        this.tail = [
            { x: 3, y: 0 },
            { x: 2, y: 0},
            { x: 1, y: 0}
        ];
    }

    update = function() {
        switch (this.direction) {
            case 0:
                this.head.x += 1;
                this.head.x %= ROWS;
                break;

            case 1:
                this.head.y -= 1;
                if (this.head.y < 0) {
                    this.head.y = COLS - 1;
                }
                break;

            case 2:
                this.head.x -= 1;
                if (this.head.x < 0) {
                    this.head.x = ROWS - 1;
                }
                break;

            case 3:
                this.head.y += 1;
                this.head.y %= COLS;
                break;
        }

        var prevX = this.tail[0].x;
        var prevY = this.tail[0].y;
        this.tail[0].x = this.head.x;
        this.tail[0].y = this.head.y;
        
        var prev2X, prev2Y;

        var length = this.getLength();
        for (let i = 1; i < length; i++) {
            prev2X = this.tail[i].x;
            prev2Y = this.tail[i].y;
            this.tail[i].x = prevX;
            this.tail[i].y = prevY;
            prevX = prev2X;
            prevY = prev2Y;

            if (this.head.x == this.tail[i].x && this.head.y == this.tail[i].y) {
                setup();
            }
        }

        apples.forEach(apple => {
            if (this.head.x == apple.x & this.head.y == apple.y) {
                this.increaseLength();
                apples.splice(apples.indexOf(apple), 1);
                createApple();
            }
        });

        

    }

    moveUp = function() {
        this.updateDirection(1);
    }

    moveRight = function() {
        this.updateDirection(0);
    }

    moveDown = function() {
        this.updateDirection(3);
    }

    moveLeft = function() {
        this.updateDirection(2);
    }

    updateDirection = function(newDirection) {
        var snakeHeadDirection;
        var snakeHeadVector = {
            x: this.tail[1].x - this.tail[0].x,
            y: this.tail[1].y - this.tail[0].y
        }; // Vector that points to the second snake block from the head
        if (snakeHeadVector.x != 0) {
            if (snakeHeadVector.x > 0) {
                snakeHeadDirection = 0;
            } else {
                snakeHeadDirection = 2;
            }
        } else {
            if (snakeHeadVector.y > 0) {
                snakeHeadDirection = 3;
            } else {
                snakeHeadDirection = 1;
            }
        }

        console.log(snakeHeadDirection);


        if (newDirection != snakeHeadDirection) {
            this.direction = newDirection;
        }
    }

    increaseLength = function() {
        var lastLength = this.getLength();
        var directionX = this.tail[lastLength - 2].x - this.tail[lastLength - 1].x;
        var directionY = this.tail[lastLength - 2].y - this.tail[lastLength - 1].y;
        this.tail.push({
            x: this.tail[lastLength - 1].x + directionX,
            y: this.tail[lastLength - 1].y + directionY
        });
        points++;
        document.getElementById("points").innerHTML = "Points: " + points;
    }

    getLength = function() {
        return this.tail.length;
    }
}

function randomNumber(max) {
  return Math.floor(Math.random() * max);
}

function createApple() {
    var xx, yy;
    do {
        xx = randomNumber(ROWS);
        yy = randomNumber(COLS);
    } while (snake.tail.includes({ x: xx, y: yy }))
    
    apples.push(
        { x: xx, y: yy}
    );
    console.log(xx, yy)
}

grid = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => 0)
);

setup();

window.addEventListener("keydown", (e) => {
    if (e.repeat) return;

    switch (e.code) {
        case "KeyW":
            snake.moveUp();
        break;

        case "KeyS":
            snake.moveDown();
        break;

        case "KeyA":
            snake.moveLeft();
        break;

        case "KeyD":
            snake.moveRight();
        break;
    }
});


canvas = document.getElementById("myCanvas");
context = canvas.getContext("2d");


context.strokeStyle = "white";
context.lineWidth = 2;

function update() {
    snake.update();
}

function drawGrid() {
    context.fillStyle = "white";
    context.strokeStyle = "black";

    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            context.fillRect(
                x * CELL_SIZE,
                y * CELL_SIZE,
                CELL_SIZE,
                CELL_SIZE
            );
            context.strokeRect(
                x * CELL_SIZE,
                y * CELL_SIZE,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }
}

function drawSnake() {
    context.fillStyle = "green";

    snake.tail.forEach(segment => {
        context.fillRect(
            segment.x * CELL_SIZE,
            segment.y * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
        );
    });
}

function drawApples() {
    context.fillStyle = "red";

    apples.forEach(apple => {
        context.fillRect(
            apple.x * CELL_SIZE,
            apple.y * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
        );
    });
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawSnake();
  drawApples();
}

function gameLoop(time) {
  if (!lastTime) lastTime = time;
  const delta = time - lastTime;
  lastTime = time;

  accumulator += delta;

  while (accumulator >= FRAME_TIME) {
    update(FRAME_TIME / 1000);
    draw();

    accumulator -= FRAME_TIME;
  }
  
  
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);