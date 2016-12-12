// Implementation of two moving rovers (myRover1 named "Ship" and myRover2 named "Alien")
// Apart from the functions that allow their movement using the console,
// a visual implementation has been done using a canvas
// JQuery is used to allow the movement of the rovers with the keyboard:
// -> arrows for myRover1
// -> wasd (w, a, s, d) for myRover2
// JQuery is also used for updating the scores to the screen
// The game is stopped when:
// 1. One of the rovers crashes against an obstacle --> The other rover gets a point
// 2. One of the rovers hits the other rover --> The one who hits gets a point

// DECLARATION OF VARIABLES

// Creates a variable to exit every movement function (goForward, goBack, turnRight, turnLeft)
// in case a rover expflodes (theEnd=true)
var theEnd = false;

// Defines the canvas and context to draw the grid and rovers
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// Defines the cardinal points in an array
var cardinalPoints = ["N","E","S","W"];

// Defines the working grid: size, the obstacles' position (array), the obstacles' sprite
// and the background
var myGrid = {
  size: 10,
  obstaclesCoords: [],
  obstaclesSprite: document.getElementById("rock"),
  background: document.getElementById("sand")
};

// Defines the rovers, with their name, current position, their nextPosition where they have to move,
// the direction they are pointing, their alive and dead images, a message and color in case they crash,
// their enemy, their score and the name of the variable holding that score
var myRover1 = {
  name: "Ship",
  position: [],
  nextPosition: [],
  direction: '',
  alive: document.getElementById("spaceship"),
  dead: document.getElementById("explosion"),
  message: "EXPLODED!",
  color: "darkred",
  enemy: "",
  score: 0,
  valueName: "#value1"
};

var myRover2 = {
  name: "Alien",
  position: [],
  nextPosition: [],
  direction: '',
  alive: document.getElementById("scorpion"),
  dead: document.getElementById("splash"),
  message: "SMASHED!",
  color: "darkblue",
  enemy: "",
  score: 0,
  valueName: "#value2"
};

myRover1.enemy = myRover2;
myRover2.enemy = myRover1;

// DECLARATION OF FUNCTIONS

// Sets the starting position and direction of the rover
function setOrigin(grid, rover) {
  rover.position[0] = Math.floor(Math.random()*grid.size);
  rover.position[1] = Math.floor(Math.random()*grid.size);

  if (isBlocked(grid, rover.position[0], rover.position[1]) ||
    isOther(grid, rover, rover.position[0], rover.position[1])) {
    setOrigin(grid, rover);
  }
  rover.direction = cardinalPoints[Math.floor(Math.random()*4)];
}

// Sets the obstacles in the grid
function setObstacles(grid){
  numberObstacles = Math.floor(Math.random()*Math.pow(grid.size,2)/10+Math.pow(grid.size,2)/20);
  for (var i = 0; i < numberObstacles; i++) {
    grid.obstaclesCoords[i] = [];
    grid.obstaclesCoords[i][0] = Math.floor(Math.random()*grid.size);
    grid.obstaclesCoords[i][1] = Math.floor(Math.random()*grid.size);
  }
}

// Draws an image of the rover in the canvas, pointing in the required direction
function drawRotatedImage(grid, rover, image, xpos, ypos, width, height) {

  // Create variable angle pointing in the rover.direction
  var angle = 0;
  switch(rover.direction) {
    case 'N':
    angle = 0;
    break;
    case 'E':
    angle = 90;
    break;
    case 'S':
    angle = 180;
    break;
    case 'W':
    angle = 270;
    break;
  }

	// save the current co-ordinate system
	ctx.save();

	// move to the middle of where we want to draw our image
	ctx.translate(xpos, ypos);

	// rotate around that point, converting the angle from degrees to radians
	ctx.rotate(angle*Math.PI/180);

	// draw it up and to the left by half the width and height of the image
	ctx.drawImage(image, -canvas.width/grid.size/2, -canvas.height/grid.size/2, width, height);

  // Restore the co-ords to how they were before
  ctx.restore();
}

// Takes the rover.nextPosition back to the grid (across the edges) if it is out of boundaries
function adjustToGrid(grid, rover) {
  if (rover.nextPosition[0] < 0) {
    rover.nextPosition[0] %= grid.size;
    rover.nextPosition[0] += grid.size;
  }
  else {
    rover.nextPosition[0] %= grid.size;
  }

  if (rover.nextPosition[1] < 0) {
    rover.nextPosition[1] %= grid.size;
    rover.nextPosition[1] += grid.size;
  }
  else {
    rover.nextPosition[1] %= grid.size;
  }
}

// Checks if a given position is blocked by an obstacle
function isBlocked(grid, firstCoord, secondCoord) {
  for (var obstacle = 0; obstacle < grid.obstaclesCoords.length; obstacle++) {
    if ((firstCoord == grid.obstaclesCoords[obstacle][0]) && (secondCoord == grid.obstaclesCoords[obstacle][1])) {
      return true;
    }
  }
  return false;
}

// Checks if a given position is blocked by the other rover
function isOther(grid, rover, firstCoord, secondCoord) {
  if ((firstCoord == rover.enemy.position[0]) && (secondCoord == rover.enemy.position[1])) {
    return true;
  }
  return false;
}

// Prints current position to console
function printPosition(grid, rover) {
  console.log("New " + rover.name + " Position: [" + rover.position[0] + ", " + rover.position[1] + "]");
}

// Prints current direction to console
function printDirection(grid, rover) {
  console.log("New " + rover.name + " Direction: " + rover.direction);
}

// Moves forward (towards the current direction)
function goForward(grid, rover) {

  // Exits function if a rover has exploded
  if (theEnd) {
    return;
  }

  // Resets the rover's nextPosition to the current position
  rover.nextPosition[0] = rover.position[0];
  rover.nextPosition[1] = rover.position[1];

  // Changes rover's nextPosition depending on the direction
  switch(rover.direction) {
    case 'N':
      rover.nextPosition[1]--;
      break;
    case 'E':
      rover.nextPosition[0]++;
      break;
    case 'S':
      rover.nextPosition[1]++;
      break;
    case 'W':
      rover.nextPosition[0]--;
      break;
  }

  // Adjust nextPosition if off limits
  adjustToGrid(grid, rover);

  // In case the nextPosition is blocked by an obstacle, the rover explodes and loses the game
  if (isBlocked(myGrid, rover.nextPosition[0], rover.nextPosition[1])) {
    console.log(rover.name + " " + rover.message);
    ctx.drawImage(rover.dead,
      rover.position[0]*canvas.width/grid.size-0.5*canvas.width/grid.size/2,
      rover.position[1]*canvas.height/grid.size-0.5*canvas.height/grid.size/2,
      1.5*canvas.width/grid.size,
      1.5*canvas.height/grid.size);

    // Final message asking to reload page
    ctx.fillStyle = rover.color;
    ctx.font = 0.07*canvas.width +"px Ubuntu";
    ctx.textAlign = "center";
    ctx.fillText(rover.name + " " + rover.message,0.5*canvas.width,0.4*canvas.height);
    ctx.fillText("Press enter to continue",0.5*canvas.width,0.6*canvas.height);

    // Changes variable theEnd to true
    theEnd = true;

    // Adds one point to the other rover's score
    rover.enemy.score+=1;
    $(rover.enemy.valueName).html(rover.enemy.score);

    return;
  }

  // Checks if the next position is blocked by the other rover
  if (isOther(myGrid, rover, rover.nextPosition[0], rover.nextPosition[1])) {
    console.log(rover.enemy.name + " was destroyed by " + rover.name);
    ctx.drawImage(rover.enemy.dead,
      rover.enemy.position[0]*canvas.width/grid.size-0.5*canvas.width/grid.size/2,
      rover.enemy.position[1]*canvas.height/grid.size-0.5*canvas.height/grid.size/2,
      1.5*canvas.width/grid.size,
      1.5*canvas.height/grid.size);

    // Final message asking to reload page
    ctx.fillStyle = rover.enemy.color;
    ctx.font = 0.07*canvas.width +"px Ubuntu";
    ctx.textAlign = "center";
    ctx.fillText(rover.enemy.name + " was destroyed by " + rover.name,0.5*canvas.width,0.4*canvas.height);
    ctx.fillText("Press enter to continue",0.5*canvas.width,0.6*canvas.height);

    // Changes variable theEnd to true
    theEnd = true;

    // Adds one point to this rover's score
    rover.score+=1;
    $(rover.valueName).html(rover.score);

    return;
  }

  // Draws the background in the rover's position (which is moving to nextPosition)
  ctx.drawImage(grid.background,
    rover.position[0]*canvas.width/grid.size,
    rover.position[1]*canvas.height/grid.size,
    canvas.width/grid.size,
    canvas.height/grid.size);ctx.lineWidth ="1px";
  ctx.strokeStyle = "grey";
  ctx.strokeRect(rover.position[0]*canvas.width/grid.size,rover.position[1]*canvas.height/grid.size,canvas.width/grid.size,canvas.height/grid.size);

  // Draws the rover in the nextPosition
  drawRotatedImage(grid,
    rover,
    rover.alive,
    rover.nextPosition[0]*canvas.width/grid.size+canvas.width/grid.size/2,
    rover.nextPosition[1]*canvas.height/grid.size+canvas.height/grid.size/2,
    canvas.width/grid.size,
    canvas.height/grid.size);

  // Updates position with nextPosition
  rover.position[0] = rover.nextPosition[0];
  rover.position[1] = rover.nextPosition[1];

  // Prints position to console
  printPosition(grid, rover);
}

// Moves back (against the current direction)
function goBack(grid, rover) {

  // Exits function if a rover has exploded
  if (theEnd) {
    return;
  }

  // Resets the rover's nextPosition to the current position
  rover.nextPosition[0] = rover.position[0];
  rover.nextPosition[1] = rover.position[1];

  // Changes rover's nextPosition depending on the direction
  switch(rover.direction) {
    case 'N':
      rover.nextPosition[1]++;
      break;
    case 'E':
      rover.nextPosition[0]--;
      break;
    case 'S':
      rover.nextPosition[1]--;
      break;
    case 'W':
      rover.nextPosition[0]++;
      break;
  }

  // Adjust nextPosition if off limits
  adjustToGrid(grid, rover);

  // In case the nextPosition is blocked by an obstacle, the rover explodes and loses the game
  if (isBlocked(myGrid, rover.nextPosition[0], rover.nextPosition[1])) {
    console.log(rover.name + " " + rover.message);
    ctx.drawImage(rover.dead,
      rover.position[0]*canvas.width/grid.size-0.5*canvas.width/grid.size/2,
      rover.position[1]*canvas.height/grid.size-0.5*canvas.height/grid.size/2,
      1.5*canvas.width/grid.size,
      1.5*canvas.height/grid.size);

    // Final message asking to reload page
    ctx.fillStyle = rover.color;
    ctx.font = 0.07*canvas.width +"px Ubuntu";
    ctx.textAlign = "center";
    ctx.fillText(rover.name + " " + rover.message,0.5*canvas.width,0.4*canvas.height);
    ctx.fillText("Press enter to continue",0.5*canvas.width,0.6*canvas.height);

    // Changes variable theEnd to true
    theEnd = true;

    // Adds one point to the other rover's score
    rover.enemy.score+=1;
    $(rover.enemy.valueName).html(rover.enemy.score);

    return;
  }

  // Checks if the next position is blocked by the other rover
  if (isOther(myGrid, rover, rover.nextPosition[0], rover.nextPosition[1])) {
    console.log(rover.enemy.name + " was destroyed by " + rover.name);
    ctx.drawImage(rover.enemy.dead,
      rover.enemy.position[0]*canvas.width/grid.size-0.5*canvas.width/grid.size/2,
      rover.enemy.position[1]*canvas.height/grid.size-0.5*canvas.height/grid.size/2,
      1.5*canvas.width/grid.size,
      1.5*canvas.height/grid.size);

    // Final message asking to reload page
    ctx.fillStyle = rover.enemy.color;
    ctx.font = 0.07*canvas.width +"px Ubuntu";
    ctx.textAlign = "center";
    ctx.fillText(rover.enemy.name + " was destroyed by " + rover.name,0.5*canvas.width,0.4*canvas.height);
    ctx.fillText("Press enter to continue",0.5*canvas.width,0.6*canvas.height);

    // Changes variable theEnd to true
    theEnd = true;

    // Adds one point to this rover's score
    rover.score+=1;
    $(rover.valueName).html(rover.score);

    return;
  }

  // Draws the rover in the nextPosition
  drawRotatedImage(grid,
    rover,
    rover.alive,
    rover.nextPosition[0]*canvas.width/grid.size+canvas.width/grid.size/2,
    rover.nextPosition[1]*canvas.height/grid.size+canvas.height/grid.size/2,
    canvas.width/grid.size,
    canvas.height/grid.size);

  // Draws the background in the rover's position (which is moving to nextPosition)
  ctx.drawImage(grid.background,
    rover.position[0]*canvas.width/grid.size,
    rover.position[1]*canvas.height/grid.size,
    canvas.width/grid.size,
    canvas.height/grid.size);ctx.lineWidth ="1px";
  ctx.strokeStyle = "grey";
  ctx.strokeRect(rover.position[0]*canvas.width/grid.size,rover.position[1]*canvas.height/grid.size,canvas.width/grid.size,canvas.height/grid.size);

  // Updates position with nextPosition
  rover.position[0] = rover.nextPosition[0];
  rover.position[1] = rover.nextPosition[1];

  // Prints position to console
  printPosition(grid, rover);
}

// Turns left
function turnLeft(grid, rover) {

  // Exits function if a rover has exploded
  if (theEnd) {
    return;
  }

  // Changes rover's "future direction" depending on the "current direction"
  switch(rover.direction) {
    case 'N':
      rover.direction = 'W';
      break;
    case 'E':
      rover.direction = 'N';
      break;
    case 'S':
      rover.direction = 'E';
      break;
    case 'W':
      rover.direction = 'S';
      break;
  }

  // Draws the background in the rover's position (to hide the previous image of the rover)
  ctx.drawImage(grid.background,
    rover.position[0]*canvas.width/grid.size,
    rover.position[1]*canvas.height/grid.size,
    canvas.width/grid.size,
    canvas.height/grid.size);ctx.lineWidth ="1px";
    ctx.strokeStyle = "grey";
    ctx.strokeRect(rover.position[0]*canvas.width/grid.size,rover.position[1]*canvas.height/grid.size,canvas.width/grid.size,canvas.height/grid.size);

  // Draws the rover with the new direction
  drawRotatedImage(grid,
    rover,
    rover.alive,
    rover.position[0]*canvas.width/grid.size+canvas.width/grid.size/2,
    rover.position[1]*canvas.height/grid.size+canvas.height/grid.size/2,
    canvas.width/grid.size,
    canvas.height/grid.size);

  // Prints direction to console
  printDirection(grid, rover);
}

// Turns right
function turnRight(grid, rover) {

  // Exits function if a rover has exploded
  if (theEnd) {
    return;
  }

  // Changes rover's "future direction" depending on the "current direction"
  switch(rover.direction) {
    case 'N':
      rover.direction = 'E';
      break;
    case 'E':
      rover.direction = 'S';
      break;
    case 'S':
      rover.direction = 'W';
      break;
    case 'W':
      rover.direction = 'N';
      break;
  }

  // Draws the background in the rover's position (to hide the previous image of the rover)
  ctx.drawImage(grid.background,
    rover.position[0]*canvas.width/grid.size,
    rover.position[1]*canvas.height/grid.size,
    canvas.width/grid.size,
    canvas.height/grid.size);ctx.lineWidth ="1px";
    ctx.strokeStyle = "grey";
    ctx.strokeRect(rover.position[0]*canvas.width/grid.size,rover.position[1]*canvas.height/grid.size,canvas.width/grid.size,canvas.height/grid.size);

  // Draws the rover with the new direction
  drawRotatedImage(grid,
    rover,
    rover.alive,
    rover.position[0]*canvas.width/grid.size+canvas.width/grid.size/2,
    rover.position[1]*canvas.height/grid.size+canvas.height/grid.size/2,
    canvas.width/grid.size,
    canvas.height/grid.size);

  // Prints direction to console
  printDirection(grid, rover);
}

// Follows instructions introduced as a string (f:forward, b: back, r: right, l: left)
function followInstructions(grid, rover, directions) {
  // Follows the first instruction
  var order = directions.slice(0,1);
  switch(order.toLowerCase()) {
    case 'f':
      goForward(grid, rover);
      break;
    case 'b':
      goBack(grid, rover);
      break;
    case 'l':
      turnLeft(grid, rover);
      break;
    case 'r':
      turnRight(grid, rover);
      break;
  }
  if (directions.length > 1) {
    directions = directions.substr(1,directions.length-1);
    setTimeout(function() { followInstructions(grid, rover, directions); }, 300);
  }
  else {
    return;
  }
}

// Draws the initial grid with obstacles and rovers in the canvas
function initGrid(grid, rover) {

  // Sets the position of the obstacles
  setObstacles(myGrid);

  // Sets the origin for the rovers
  setOrigin(myGrid, rover);
  setOrigin(myGrid, rover.enemy);

  // Puts the scores on their screens
  $(rover.valueName).html(rover.score);
  $(rover.enemy.valueName).html(rover.enemy.score);

  // Loops across each tile in the grid
  for (var i = 0; i < grid.size; i++) {
    for (var j = 0; j < grid.size; j++) {

      // Draws the background and border for every tile
      ctx.drawImage(grid.background,
        i*canvas.width/grid.size,
        j*canvas.height/grid.size,
        canvas.width/grid.size,
        canvas.height/grid.size);
        ctx.lineWidth ="1px";
      ctx.strokeStyle = "grey";
      ctx.strokeRect(i*canvas.width/grid.size,
        j*canvas.height/grid.size,
        canvas.width/grid.size,
        canvas.height/grid.size);

      // Draws the first rover
      if (rover.position[0] == i && rover.position[1] == j) {
        drawRotatedImage(grid,
          rover,
          rover.alive,
          rover.position[0]*canvas.width/grid.size+canvas.width/grid.size/2,
          rover.position[1]*canvas.height/grid.size+canvas.height/grid.size/2,
          canvas.width/grid.size,
          canvas.height/grid.size);
        continue;
      }

      // Draws the other rover
      else if (rover.enemy.position[0] == i && rover.enemy.position[1] == j) {
        drawRotatedImage(grid,
          rover.enemy,
          rover.enemy.alive,
          rover.enemy.position[0]*canvas.width/grid.size+canvas.width/grid.size/2,
          rover.enemy.position[1]*canvas.height/grid.size+canvas.height/grid.size/2,
          canvas.width/grid.size,
          canvas.height/grid.size);
        continue;
      }

      // Draws the obstacles
      else if (isBlocked(grid, i, j)) {
        ctx.drawImage(myGrid.obstaclesSprite,
          i*canvas.width/grid.size,
          j*canvas.height/grid.size,
          canvas.width/grid.size,
          canvas.height/grid.size);
        continue;
      }
    }
  }
}

// Allows the use of keys to move the two rovers (myRover1: arrows, myRover2: wasd)
// And waits for the "key enter" to be pressed to start a new game
$(document).bind('keydown',function(key){
  if(key.keyCode == 38) { // key = up arrow
    goForward(myGrid, myRover1);
  }
  else if(key.keyCode == 40) { // key = down arrow
    goBack(myGrid, myRover1);
  }
  else if(key.keyCode == 39) { // key = right arrow
    turnRight(myGrid, myRover1);
  }
  else if(key.keyCode == 37) { // key = left arrow
    turnLeft(myGrid, myRover1);
  }
  else if(key.keyCode == 87) { // key = w
    goForward(myGrid, myRover2);
  }
  else if(key.keyCode == 83) { // key = s
    goBack(myGrid, myRover2);
  }
  else if(key.keyCode == 68) { // key = d
    turnRight(myGrid, myRover2);
  }
  else if(key.keyCode == 65) { // key = a
    turnLeft(myGrid, myRover2);
  }
  else if(key.keyCode == 13 && theEnd ) { // key = enter
    // Sets the origin for the rovers
    setOrigin(myGrid, myRover1);
    setOrigin(myGrid, myRover2);

    // Sets theEnd back to false
    theEnd = false;

    // Draws the map with the obstacles and rovers
    initGrid(myGrid, myRover1);

    // Prints to console the initial position and direction of rovers
    printPosition(myGrid, myRover1);
    printDirection(myGrid, myRover1);
    printPosition(myGrid, myRover2);
    printDirection(myGrid, myRover2);
  }

});

// CALL INITIAL GRID AND PRINT TO CONSOLE FUNCTIONS WHEN THE DOM AND IMAGES ARE LOADED
window.onload = function() {
  // Draws the map with the obstacles and rovers
  initGrid(myGrid, myRover1);

  // Prints to console the initial position and direction of rovers
  printPosition(myGrid, myRover1);
  printDirection(myGrid, myRover1);
  printPosition(myGrid, myRover2);
  printDirection(myGrid, myRover2);
};


// DIFFERENT APPROACHES

// TRIED "array.includes(array)" BUT I COULD NOT MAKE IT WORK
/*
function isBlocked(grid, firstCoord, secondCoord) {
  if (grid.obstaclesCoords.includes([firstCoord, secondCoord])) {
    return true;
  }
  return false;
}
*/
