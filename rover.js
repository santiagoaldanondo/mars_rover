// Check widths to be changed by heights in drawings

var myGrid = {
  size: 8,
  obstacles: [[5,5], [2,2], [6,6], [4,4]]
};

var myRover = {
  position: [3,4],
  nextPosition: [0,0],
  direction: 'N'
};

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// onload is used to wait for the execution until the DOM and images are ready
window.onload = function() {
  var rock = document.getElementById("rock");
    var spaceship = document.getElementById("spaceship");

};


// Draws a rotated image for the rover
function drawRotatedImage(grid, rover, image, x, y, width, height) {

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
	// before we screw with it
	ctx.save();

	// move to the middle of where we want to draw our image
	ctx.translate(x, y);

	// rotate around that point, converting our
	// angle from degrees to radians
	ctx.rotate(angle*Math.PI/180);

	// draw it up and to the left by half the width
	// and height of the image
	ctx.drawImage(image, -canvas.width/grid.size/2, -canvas.width/grid.size/2, width, height);

  // Restore the co-ords to how they were before rotateImage
  ctx.restore();

}

// Takes back the rover.nextPosition to the grid if it is out of boundaries
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
  for (var obstacle = 0; obstacle < grid.obstacles.length; obstacle++) {
    if ((firstCoord == grid.obstacles[obstacle][0]) &&
    (secondCoord == grid.obstacles[obstacle][1])) {
      return true;
    }
  }
  return false;
}

// Prints current position to console
function getPosition(grid, rover) {
  console.log("New Rover Position: [" + rover.position[0] + ", " + rover.position[1] + "]");
}

// Prints current direction to console
function getDirection(grid, rover) {
  console.log("New Rover Direction: " + rover.direction);
}

// Moves forward (towards the current direction)
function goForward(grid, rover) {

    rover.nextPosition[0] = rover.position[0];
    rover.nextPosition[1] = rover.position[1];
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
    adjustToGrid(grid, rover);
    if (isBlocked(myGrid, rover.nextPosition[0], rover.nextPosition[1])) {
      console.log("Obstacle on the way. Rover stops");
      return;
    }
    drawRotatedImage(grid,
      rover,
      spaceship,
      rover.nextPosition[0]*canvas.width/grid.size+canvas.width/grid.size/2,
      rover.nextPosition[1]*canvas.width/grid.size+canvas.width/grid.size/2,
      canvas.width/grid.size,
      canvas.width/grid.size);
    ctx.fillStyle = "white";
    ctx.fillRect(rover.position[0]*canvas.width/grid.size,rover.position[1]*canvas.width/grid.size,canvas.width/grid.size,canvas.width/grid.size);
    ctx.lineWidth ="1px";
    ctx.strokeStyle = "grey";
    ctx.strokeRect(rover.position[0]*canvas.width/grid.size,rover.position[1]*canvas.width/grid.size,canvas.width/grid.size,canvas.width/grid.size);
    rover.position[0] = rover.nextPosition[0];
    rover.position[1] = rover.nextPosition[1];
    getPosition(grid, rover);
}

// Moves back (against the current direction)
function goBack(grid, rover) {

    rover.nextPosition[0] = rover.position[0];
    rover.nextPosition[1] = rover.position[1];
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
    adjustToGrid(grid, rover);
    if (isBlocked(myGrid, rover.nextPosition[0], rover.nextPosition[1])) {
      console.log("Obstacle on the way. Rover stops");
      return;
    }
    drawRotatedImage(grid,
      rover,
      spaceship,
      rover.nextPosition[0]*canvas.width/grid.size+canvas.width/grid.size/2,
      rover.nextPosition[1]*canvas.width/grid.size+canvas.width/grid.size/2,
      canvas.width/grid.size,
      canvas.width/grid.size);
    ctx.fillStyle = "white";
    ctx.fillRect(rover.position[0]*canvas.width/grid.size,rover.position[1]*canvas.width/grid.size,canvas.width/grid.size,canvas.width/grid.size);
    ctx.lineWidth ="1px";
    ctx.strokeStyle = "grey";
    ctx.strokeRect(rover.position[0]*canvas.width/grid.size,rover.position[1]*canvas.width/grid.size,canvas.width/grid.size,canvas.width/grid.size);
    rover.position[0] = rover.nextPosition[0];
    rover.position[1] = rover.nextPosition[1];
    getPosition(grid, rover);
}

// Turns left
function turnLeft(grid, rover) {

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
  getDirection(grid, rover);
  drawRotatedImage(grid,
    rover,
    spaceship,
    rover.position[0]*canvas.width/grid.size+canvas.width/grid.size/2,
    rover.position[1]*canvas.width/grid.size+canvas.width/grid.size/2,
    canvas.width/grid.size,
    canvas.width/grid.size);
}

// Turns right
function turnRight(grid, rover) {
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
  getDirection(grid, rover);
  drawRotatedImage(grid,
    rover,
    spaceship,
    rover.position[0]*canvas.width/grid.size+canvas.width/grid.size/2,
    rover.position[1]*canvas.width/grid.size+canvas.width/grid.size/2,
    canvas.width/grid.size,
    canvas.width/grid.size);
}

// Follows instructions introduced as a string (f:forward, b: back, r: right, l: left)
function followInstructions(grid, rover, directions) {
  console.log("Initial Rover Position: [" + rover.position[0] + ", " + rover.position[1] +
              "]   ||   Initial Rover Direction: " + rover.direction);
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

// Creates a map of the grid with obstacles and rover in a canvas
function map(grid, rover) {
  for (var i = 0; i < grid.size; i++) {
    for (var j = 0; j < grid.size; j++) {
      if (rover.position[0] == j && rover.position[1] == i) {
        drawRotatedImage(grid,
          rover,
          spaceship,
          rover.position[0]*canvas.width/grid.size+canvas.width/grid.size/2,
          rover.position[1]*canvas.width/grid.size+canvas.width/grid.size/2,
          canvas.width/grid.size,
          canvas.width/grid.size);      }
      else if (isBlocked(grid, i, j)) {
        ctx.drawImage(rock, i*canvas.width/grid.size,j*canvas.width/grid.size,canvas.width/grid.size,canvas.width/grid.size);
      }
      else {

      }
      ctx.lineWidth ="1px";
      ctx.strokeStyle = "grey";
      ctx.strokeRect(i*canvas.width/grid.size,j*canvas.width/grid.size,canvas.width/grid.size,canvas.width/grid.size);
    }
  }
}


window.onload = function() {
  // Draw the map with the obstacles and rover
  map(myGrid, myRover);

  // Check some of the functions
  getPosition(myGrid, myRover);
  getDirection(myGrid, myRover);
  // goForward(myGrid, myRover);
  // goBack(myGrid, myRover);
  // followInstructions(myGrid, myRover, 'ffrffllbbbfffffrflrflff');
};
