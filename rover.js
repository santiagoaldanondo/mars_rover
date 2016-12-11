// TO DO's
// Crash between sprites
// Background, transparency and sprites
// Draw background over sprite before turning and drawing it again

// DECLARATION OF VARIABLES

// Creates a variable to exit every movement function (goForward, goBack, turnRight, turnLeft)
// in case a rover explodes (theEnd=true)
var theEnd = false;

// Defines the canvas and context to draw the grid and rovers
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// Defines the working grid: size and the obstacles' position (array) and sprite
var myGrid = {
  size: 8,
  obstaclesCoords: [[4,5], [2,6], [6,4], [1,7], [6,0], [2,0], [0,1], [3,3]],
  obstaclesSprite: document.getElementById("rock")
};

// Defines the rovers, with their current position, their nextPosition where they have to move
// the direction they are pointing, and their alive and dead images
var myRover1 = {
  position: [3,4],
  nextPosition: [3,4],
  direction: 'N',
  alive: document.getElementById("spaceship"),
  dead: document.getElementById("explosion")
};

var myRover2 = {
  position: [6,7],
  nextPosition: [6,7],
  direction: 'N',
  alive: document.getElementById("alien"),
  dead: document.getElementById("explosion")
};

// DECLARATION OF FUNCTIONS

// Draws an image of the rover in the canvas pointing in the required direction
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

// Checks if a position is blocked by an obstacle
function isBlocked(grid, firstCoord, secondCoord) {
  for (var obstacle = 0; obstacle < grid.obstaclesCoords.length; obstacle++) {
    if ((firstCoord == grid.obstaclesCoords[obstacle][0]) && (secondCoord == grid.obstaclesCoords[obstacle][1])) {
      return true;
    }
  }
  return false;
}

// Alternative tried: array.includes(array) --> Not working
/* function isBlocked(grid, firstCoord, secondCoord) {
  if (grid.obstaclesCoords.includes([firstCoord, secondCoord])) {
    return true;
  }
  return false;
} */

// Prints current position to console
function printPosition(grid, rover) {
  console.log("New Rover Position: [" + rover.position[0] + ", " + rover.position[1] + "]");
}

// Prints current direction to console
function printDirection(grid, rover) {
  console.log("New Rover Direction: " + rover.direction);
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

  // In case the nextPosition is blocked, the rover explodes
  if (isBlocked(myGrid, rover.nextPosition[0], rover.nextPosition[1])) {
    console.log("Obstacle on the way. Rover exploded!");
    drawRotatedImage(grid,
      rover,
      explosion,
      rover.position[0]*canvas.width/grid.size+canvas.width/grid.size/2,
      rover.position[1]*canvas.height/grid.size+canvas.height/grid.size/2,
      canvas.width/grid.size,
      canvas.height/grid.size);

    // Final message asking to reload page
    ctx.fillStyle = "darkred";
    ctx.font = 0.1*canvas.width +"px Arial";
    ctx.fillText("YOU CRASHED!",0.12*canvas.width,0.4*canvas.height);
    ctx.fillText("Refresh to play",0.16*canvas.width,0.6*canvas.height);

    // Changes variable theEnd to true
    theEnd = true;
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
  ctx.fillStyle = "white";
  ctx.fillRect(rover.position[0]*canvas.width/grid.size,rover.position[1]*canvas.height/grid.size,canvas.width/grid.size,canvas.height/grid.size);
  ctx.lineWidth ="1px";
  ctx.strokeStyle = "grey";
  ctx.strokeRect(rover.position[0]*canvas.width/grid.size,rover.position[1]*canvas.height/grid.size,canvas.width/grid.size,canvas.height/grid.size);

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

  // In case the nextPosition is blocked, the rover explodes
  if (isBlocked(myGrid, rover.nextPosition[0], rover.nextPosition[1])) {
    console.log("Obstacle on the way. Rover exploded!");
    drawRotatedImage(grid,
      rover,
      explosion,
      rover.position[0]*canvas.width/grid.size+canvas.width/grid.size/2,
      rover.position[1]*canvas.height/grid.size+canvas.height/grid.size/2,
      canvas.width/grid.size,
      canvas.height/grid.size);

    // Final message asking to reload page
    ctx.fillStyle = "darkred";
    ctx.font = 0.1*canvas.width +"px Arial";
    ctx.fillText("YOU CRASHED!",0.12*canvas.width,0.4*canvas.height);
    ctx.fillText("Refresh to play",0.16*canvas.width,0.6*canvas.height);

    // Changes variable theEnd to true
    theEnd = true;
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
  ctx.fillStyle = "white";
  ctx.fillRect(rover.position[0]*canvas.width/grid.size,rover.position[1]*canvas.height/grid.size,canvas.width/grid.size,canvas.height/grid.size);
  ctx.lineWidth ="1px";
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
  // Prints the initial position before starting to move
  console.log("Initial Rover Position: [" + rover.position[0] + ", " + rover.position[1] +
              "]   ||   Initial Rover Direction: " + rover.direction);

  // Follows the instructions one by one
  for (var order  = 0; order < directions.length; order++) {
    switch( directions[order].toLowerCase()) {
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
  }
}

// Creates a map of the grid with obstacles and rovers in the canvas
function map(grid, rover, enemy) {

  // Loops across each tile in the grid
  for (var i = 0; i < grid.size; i++) {
    for (var j = 0; j < grid.size; j++) {

      // Draws the rover
      if (rover.position[0] == j && rover.position[1] == i) {
        drawRotatedImage(grid,
          rover,
          rover.alive,
          rover.position[0]*canvas.width/grid.size+canvas.width/grid.size/2,
          rover.position[1]*canvas.height/grid.size+canvas.height/grid.size/2,
          canvas.width/grid.size,
          canvas.height/grid.size);
      }

      if (enemy.position[0] == j && enemy.position[1] == i) {
        drawRotatedImage(grid,
          enemy,
          enemy.alive,
          enemy.position[0]*canvas.width/grid.size+canvas.width/grid.size/2,
          enemy.position[1]*canvas.height/grid.size+canvas.height/grid.size/2,
          canvas.width/grid.size,
          canvas.height/grid.size);
      }

      // Draws the obstacles
      else if (isBlocked(grid, i, j)) {
        ctx.drawImage(myGrid.obstaclesSprite, i*canvas.width/grid.size,j*canvas.height/grid.size,canvas.width/grid.size,canvas.height/grid.size);
      }

      // Draws the empty tiles
      else {

      }

      // Draws the borders of every tile
      ctx.lineWidth ="1px";
      ctx.strokeStyle = "grey";
      ctx.strokeRect(i*canvas.width/grid.size,j*canvas.height/grid.size,canvas.width/grid.size,canvas.height/grid.size);
    }
  }
}

//
$(document).bind('keydown',function(e){
  if(e.keyCode == 38) {
    goForward(myGrid, myRover1);
  }
  else if(e.keyCode == 40) {
    goBack(myGrid, myRover1);
  }
  else if(e.keyCode == 39) {
    turnRight(myGrid, myRover1);
  }
  else if(e.keyCode == 37) {
    turnLeft(myGrid, myRover1);
  }
  else if(e.keyCode == 87) {
    goForward(myGrid, myRover2);
  }
  else if(e.keyCode == 83) {
    goBack(myGrid, myRover2);
  }
  else if(e.keyCode == 68) {
    turnRight(myGrid, myRover2);
  }
  else if(e.keyCode == 65) {
    turnLeft(myGrid, myRover2);
  }
});

// CALL MAP AND PRINT FUNCTIONS WHEN THE DOM AND IMAGES ARE LOADED
window.onload = function() {
  // Draw the map with the obstacles and rover
  map(myGrid, myRover1, myRover2);

  // Prints to console the initial position and direction of rovers
  printPosition(myGrid, myRover1);
  printDirection(myGrid, myRover1);
};
