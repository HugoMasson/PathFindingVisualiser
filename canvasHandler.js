const DRAW_GRID = true;
const WIDTH_PX = 1200;
const HEIGHT_PX = parseInt(WIDTH_PX / 2);
const NBR_CASE_WIDTH = 100;
const NBR_CASE_HEIGHT = parseInt(NBR_CASE_WIDTH / 2);
const CASE_SIZE = Math.floor(WIDTH_PX / NBR_CASE_WIDTH);

/* Colors */
const GRID_COLOR = "#2daae0";

/* Runtime Vars */

var canvas = document.getElementById("mainCanvas");
canvas.width = WIDTH_PX;
canvas.height = HEIGHT_PX;
var ctx = canvas.getContext("2d");
const rect = canvas.getBoundingClientRect();

let mouseIsDown = false;

var startPos = {
  x: -1,
  y: -1,
  placed: false,
};

var endPos = {
  x: -1,
  y: -1,
  placed: false,
};

var obstaclesPos = [];
var selectedButton = null;

const start = document.getElementById("start");
const obstacle = document.getElementById("obstacle");
const end = document.getElementById("end");
const back = document.getElementById("back");

start.addEventListener("click", () => {
  selectedButton = start;
});
obstacle.addEventListener("click", () => {
  selectedButton = obstacle;
});
end.addEventListener("click", () => {
  selectedButton = end;
});
back.addEventListener("click", () => {
  obstaclesPos.pop();
});

canvas.addEventListener("mousedown", () => {
  mouseIsDown = true;
});
canvas.addEventListener("mouseup", () => {
  mouseIsDown = false;
});

canvas.addEventListener("mousemove", (e) => {
  if (mouseIsDown && selectedButton === obstacle) {
    const x = Math.floor((e.clientX - rect.left) / CASE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / CASE_SIZE);
    let canAdd = true;
    for (i = 0; i < obstaclesPos.length; i++) {
      if (arraysEqual(obstaclesPos[i], [x, y])) {
        canAdd = false;
      }
    }
    if (canAdd) obstaclesPos.push([x, y]);
  }
});

canvas.addEventListener("mousedown", function (e) {
  const x = Math.floor((e.clientX - rect.left) / CASE_SIZE);
  const y = Math.floor((e.clientY - rect.top) / CASE_SIZE);

  switch (selectedButton) {
    case start:
      startPos.x = x;
      startPos.y = y;
      startPos.placed = true;
      break;
    case obstacle:
      obstaclesPos.push([x, y]);
      break;
    case end:
      endPos.x = x;
      endPos.y = y;
      endPos.placed = true;
      break;
    default:
      break;
  }
});

/* from https://stackoverflow.com/a/16436975 */
function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/* Create Grid */
function initCanvas() {
  if (DRAW_GRID) {
    ctx.beginPath();
    for (x = 0; x < NBR_CASE_HEIGHT; x++) {
      ctx.moveTo(0, x * CASE_SIZE + 1);
      ctx.lineTo(WIDTH_PX, x * CASE_SIZE);
    }
    for (y = 0; y < NBR_CASE_WIDTH; y++) {
      ctx.moveTo(y * CASE_SIZE + 1, 0);
      ctx.lineTo(y * CASE_SIZE, HEIGHT_PX);
    }
    ctx.strokeStyle = GRID_COLOR;
    ctx.stroke();
  }
}

function drawCanvas() {
  var imgStart = new Image();
  imgStart.src = "../assets/icons/startPos.png";
  var imgObstacle = new Image();
  imgObstacle.src = "../assets/icons/obstacle.png";
  var imgEnd = new Image();
  imgEnd.src = "../assets/icons/endPos.png";

  if (startPos.placed)
    ctx.drawImage(
      imgStart,
      startPos.x * CASE_SIZE,
      startPos.y * CASE_SIZE,
      CASE_SIZE,
      CASE_SIZE
    );
  if (endPos.placed)
    ctx.drawImage(
      imgEnd,
      endPos.x * CASE_SIZE,
      endPos.y * CASE_SIZE,
      CASE_SIZE,
      CASE_SIZE
    );
  for (i = 0; i < obstaclesPos.length; i++) {
    ctx.drawImage(
      imgObstacle,
      obstaclesPos[i][0] * CASE_SIZE + 3,
      obstaclesPos[i][1] * CASE_SIZE + 2,
      CASE_SIZE,
      CASE_SIZE,
    );
  }
}

async function run() {
  while (true) {
    ctx.clearRect(0, 0, WIDTH_PX + 1, HEIGHT_PX + 1);
    initCanvas();
    drawCanvas();
    await new Promise((r) => setTimeout(r,10));
  }
}

run();
