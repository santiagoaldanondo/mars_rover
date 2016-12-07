// Requires the library from http://underscorejs.org/ to use the .intersection()
var _ = require('underscore');

var myGrid = {
  size: 15,
  obstacles: [[5,5], [2,2], [6,6], [4,4]]
};

var myRover = {
  position: [0,0],
  direction: 'N'
};

// Takes back to the grid if off limits
function adjustToGrid(rover, grid) {
  if (rover.position[0] < 0) {
    rover.position[0] %= grid.size;
    rover.position[0] += grid.size;
  }
  else {
    rover.position[0] %= grid.size;
  }

  if (rover.position[1] < 0) {
    rover.position[1] %= grid.size;
    rover.position[1] += grid.size;
  }
  else {
    rover.position[1] %= grid.size;
  }
}

function currentPosition(rover) {
  adjustToGrid(rover, myGrid);
  console.log("New Rover Position: [" + rover.position[0] + ", " + rover.position[1] + "]");
}

function currentDirection(rover) {
  console.log("New Rover Direction: " + rover.direction);
}

function isBlocked(rover, grid) {
  for (var obstacle = 0; obstacle < grid.obstacles.length; obstacle++) {
  switch(rover.direction) {
    case 'N':
      if (rover.position[0] + 1 === grid.obstacles[obstacle][0] &&
        rover.position[1] === grid.obstacles[obstacle][1]) {
        console.log("Obstacle on my way. I STOP.");
        return true;
      }
      break;
    case 'E':
      if (rover.position[1] + 1 === grid.obstacles[obstacle][1] &&
        rover.position[0] === grid.obstacles[obstacle][0]) {
        console.log("Obstacle on my way. I STOP.");
        return true;
      }
      break;
    case 'S':
      if (rover.position[0] - 1 === grid.obstacles[obstacle][0] &&
        rover.position[1] === grid.obstacles[obstacle][1]) {
        console.log("Obstacle on my way. I STOP.");
        return true;
      }
      break;
    case 'W':
      if (rover.position[1] - 1 === grid.obstacles[obstacle][1] &&
        rover.position[0] === grid.obstacles[obstacle][0]) {
        console.log("Obstacle on my way. I STOP.");
        return true;
      }
      break;
    }
  }
  return false;
}

function goForward(rover) {
  if (isBlocked(rover, myGrid)) {
      return;
  }
  switch(rover.direction) {
    case 'N':
      rover.position[0]++;
      break;
    case 'E':
      rover.position[1]++;
      break;
    case 'S':
      rover.position[0]--;
      break;
    case 'W':
      rover.position[1]--;
      break;
  }
  currentPosition(rover);
}

function goBack(rover) {
  if (isBlocked(rover, myGrid)) {
      return;
  }
  switch(rover.direction) {
    case 'N':
      rover.position[0]--;
      break;
    case 'E':
      rover.position[1]--;
      break;
    case 'S':
      rover.position[0]++;
      break;
    case 'W':
      rover.position[1]++;
      break;
  }
  currentPosition(rover);
}

// Implement commands to turn the rover left or right (l,r)

function turnLeft(rover) {
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
  currentDirection(rover);
}

function turnRight(rover) {
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
  currentDirection(rover);
}

function getInput(rover, directions) {
  console.log("Initial Rover Position: " + rover.position +
              "   ||   Initial Rover Direction: " + rover.direction);

  for (var order  = 0; order < directions.length; order++) {
    if (isBlocked(rover, myGrid)) {
        return;
    }
    switch( directions[order].toLowerCase()) {
      case 'f':
        goForward(rover);
        break;
      case 'b':
        goBack(rover);
        break;
      case 'l':
        turnLeft(rover);
        break;
      case 'r':
        turnRight(rover);
        break;
    }
  }
}


currentPosition(myRover);
currentDirection(myRover);
goForward(myRover);
goBack(myRover);
getInput(myRover, 'BBBBBLFFFFFFFFFFFFFRRRRRFFFFFFFFFF');
