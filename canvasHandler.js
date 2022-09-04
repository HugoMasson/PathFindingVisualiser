const DRAW_GRID 			= true;
const WIDTH_PX 				= 1200;
const HEIGHT_PX 			= parseInt(WIDTH_PX / 2);
const NBR_CASE_WIDTH 	= 50;
const NBR_CASE_HEIGHT = parseInt(NBR_CASE_WIDTH / 2);
const CASE_SIZE = WIDTH_PX / NBR_CASE_WIDTH;

/* Colors */
const GRID_COLOR = "#2daae0";

/* Runtime Vars */

var running = false

var canvas = document.getElementById("mainCanvas");
canvas.width = WIDTH_PX;
canvas.height = HEIGHT_PX;
var ctx = canvas.getContext("2d");
const rect = canvas.getBoundingClientRect();
const paddingCase = Math.floor(CASE_SIZE*0.1)

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

var map = new Map(NBR_CASE_WIDTH, NBR_CASE_HEIGHT);
var obstaclesPosFromMap = [];
var obstaclesPos = [];
var selectedButton = null;

const start = document.getElementById("start");
const obstacle = document.getElementById("obstacle");
const end = document.getElementById("end");

const back = document.getElementById("back");
const reset = document.getElementById("reset");
const play = document.getElementById("play");
const pause = document.getElementById("pause");

start.addEventListener("click", () => {
  selectedButton = start;
});
obstacle.addEventListener("click", () => {
  selectedButton = obstacle;
});
end.addEventListener("click", () => {
  selectedButton = end;
});
back.addEventListener("click", () => {	//delete last obstacle
	map.deleteObstacle(obstaclesPos[obstaclesPos.length-1])
  obstaclesPos.pop();
});
reset.addEventListener("click", () => {
  startPos.placed = false
	endPos.placed = false
	obstaclesPos = []
	map = new Map(NBR_CASE_WIDTH, NBR_CASE_WIDTH);
});
play.addEventListener("click", () => {
  running = true;
});
pause.addEventListener("click", () => {
  running = false;
});

canvas.addEventListener("mouseup", () => {
  mouseIsDown = false;
});

canvas.addEventListener("mousemove", (e) => {
  if (mouseIsDown && selectedButton === obstacle) {
    const x = Math.floor((e.clientX - rect.left) / CASE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / CASE_SIZE);
    let canAdd = true;
		obstaclesPosFromMap = map.getAllObstacleAs2DArray();
    for (i = 0; i < obstaclesPosFromMap.length; i++) {
      if (arraysEqual(obstaclesPosFromMap[i], [y, x]) || (x == startPos.x && y == startPos.y) || (x == endPos.x && y == endPos.y)) {
        canAdd = false;
      }
    }
    if (canAdd) {
			obstaclesPos.push([x, y]);
			map.arr[y][x] = CasesType.obstacle
		}
  }
});

canvas.oncontextmenu = function(e) { e.preventDefault(); e.stopPropagation(); }

canvas.addEventListener("mousedown", function (e) {
  const x = Math.floor((e.clientX - rect.left) / CASE_SIZE);
  const y = Math.floor((e.clientY - rect.top) / CASE_SIZE);
	mouseIsDown = true;
	if(map.arr[y][x] == 0) {
		switch (selectedButton) {
			case start:
				startPos.x = x;
				startPos.y = y;
				startPos.placed = true;
				currentNaiveNode = [startPos.y, startPos.x]
				break;
			case obstacle:
				if((x != startPos.x || y != startPos.y) && (x != endPos.x || y != endPos.y)) {
					obstaclesPos.push([x, y]);
					map.arr[y][x] = CasesType.obstacle
				}
				break;
			case end:
				endPos.x = x;
				endPos.y = y;
				endPos.placed = true;
				break;
			default:
				break;
		}
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
	for (i = 0; i < map.arr.length; i++) {
		for (j = 0; j < map.arr[i].length; j++) {
			switch (map.arr[i][j]) {
				case CasesType.obstacle:
					ctx.fillStyle = "black";
					ctx.fillRect(
						j * CASE_SIZE + paddingCase,
						i * CASE_SIZE + paddingCase,
						CASE_SIZE - 2*paddingCase,
						CASE_SIZE - 2*paddingCase,
					);
					break;
				case CasesType.visualiser:
					ctx.fillStyle = "green";
					ctx.fillRect(
						j * CASE_SIZE + paddingCase,
						i * CASE_SIZE + paddingCase,
						CASE_SIZE - 2*paddingCase,
						CASE_SIZE - 2*paddingCase,
					);
					break;
				default:
					break;
			}
		}
	}
	ctx.fillStyle = "black";
}

/* Algo functions and vars */

//Naive
var naiveAlgorithm 		= new Naive(NBR_CASE_WIDTH, NBR_CASE_HEIGHT);
var currentNaiveNode 	= null;

function naiveAlgo() {
	let toAdd = naiveAlgorithm.nextTurn(map, currentNaiveNode);
	if(toAdd !== undefined) {
		currentNaiveNode = toAdd[0];
		console.log(toAdd[1])
		for (let i = 0; i < toAdd[1].length; i++) {
			map.arr[toAdd[1][0]][toAdd[1][1]] = CasesType.visualiser;
		}
		return true;
	} else {
		return false;
	}
}


var isFinished = false;
function run() {
	const algo = document.getElementById("algo-select");
	ctx.clearRect(0, 0, WIDTH_PX + 1, HEIGHT_PX + 1);
	initCanvas();
	drawCanvas();
	if(!isFinished) {
		if(running) {
			if(startPos.placed && endPos.placed) {
				switch (algo.options[algo.selectedIndex].value) {
					case "NAIVE":
						if(!naiveAlgo()) {
							isFinished = true; 
							alert("Finished ...");
						}
						break;
					default:
						running = false;
						alert("Please select an algorithm")
						break;
				}
			} else {
				//force pause if start and end are not yet defined
				running = false
			}
		}
	}
  window.requestAnimationFrame(run);
}

window.requestAnimationFrame(run);
