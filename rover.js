// Implementation of one moving rover (player1 named "Ship").
// There are several enemies as badGuy1, badGu2, etc. named "Alien")
// Instead of the functions needed to move the rover from the console,
// a visual implementation has been done using a canvas
// JQuery is used to allow the movement of the rovers with the arrow keys
// JQuery is also used for updating the scores to the screen
// The game is stopped when:
// 1. The rovers crashes against an obstacle or an enemy--> The rover loses one life


// CLASS DEFINITION

// Definition of the class Grid, with the constructor and two methods (setObstacles and
// isBlocked)

class Grid {
	constructor(cnv, ctx, size, obstaclesCoords, obstaclesSprite, background) {
		this.cnv = document.getElementById(cnv);
		this.ctx = this.cnv.getContext(ctx);
		this.size = size;
		this.obstaclesCoords = obstaclesCoords;
		this.obstaclesSprite = document.getElementById(obstaclesSprite);
		this.background = document.getElementById(background);
	}

  // DECLARATION OF METHODS

  // GRID METHOD: Creates obstacles in the grid
	setObstacles() {
		var numberObstacles = Math.floor(Math.random() * Math.pow(this.size, 2) / 10 +
      Math.pow(this.size, 2) / 20);
		for (var i = 0; i < numberObstacles; i++) {
			this.obstaclesCoords[i] = [];
			this.obstaclesCoords[i][0] = Math.floor(Math.random() * this.size);
			this.obstaclesCoords[i][1] = Math.floor(Math.random() * this.size);
		}
	}

  // GRID METHOD: Checks if a given position is blocked by an obstacle
	isBlocked(firstCoord, secondCoord) {
		for (var obstacle = 0; obstacle < this.obstaclesCoords.length; obstacle++) {
			if ((firstCoord === this.obstaclesCoords[obstacle][0]) &&
        (secondCoord === this.obstaclesCoords[obstacle][1])) {
				return true;
			}
		}
		return false;
	}
}


// Defines the class rover, with the name, current position, their nextPosition (to where they have to move),
// the direction they are pointing at, their alive and dead images, a message and color in case they crash,
// their enemy, their score and the name of the variable holding that score, and the boolean automated
// showing if they are on autoMove. It also defines methods for the class
class Rover {

	constructor(name, position, nextPosition, direction, alive, dead, message, color,
  enemy, score, scoreId, lifes, lifesId, automated) {
		this.name = name;
		this.position = position;
		this.nextPosition = nextPosition;
		this.direction = direction;
		this.alive = document.getElementById(alive);
		this.dead = document.getElementById(dead);
		this.message = message;
		this.color = color;
		this.enemy = enemy;
		this.score = score;
		this.scoreId = scoreId;
		this.lifes = lifes;
		this.lifesId = lifesId;
		this.automated = automated;

		// Includes this instance in the array
		Rover.allInstances.push(this);
	}

  // DECLARATION OF METHODS

  // ROVER METHOD: Sets the starting position and direction of the rover
	setOrigin(grid) {
		this.position[0] = Math.floor(Math.random() * grid.size);
		this.position[1] = Math.floor(Math.random() * grid.size);

		if (grid.isBlocked(this.position[0], this.position[1]) ||
			this.isSame(this.position[0], this.position[1]) ||
      this.isOther(this.position[0], this.position[1])) {
			this.setOrigin(grid);
		}
		this.direction = Math.floor(Math.random() * 4);

		// Sets the rover's nextPosition to the current position
		this.nextPosition[0] = this.position[0];
		this.nextPosition[1] = this.position[1];
	}

  // ROVER METHOD: Draws an image of the rover in the canvas, pointing in the required direction (includes background)
	drawRotatedImage(grid) {

    // Draws the background in the rover's position (to hide the previous image of the rover)
		grid.ctx.drawImage(grid.background,
      this.position[0] * grid.cnv.width / grid.size,
      this.position[1] * grid.cnv.height / grid.size,
      grid.cnv.width / grid.size,
      grid.cnv.height / grid.size); grid.ctx.lineWidth = "1px";
		grid.ctx.strokeStyle = "grey";
		grid.ctx.strokeRect(this.position[0] * grid.cnv.width / grid.size,
      this.position[1] * grid.cnv.height / grid.size, grid.cnv.width / grid.size,
      grid.cnv.height / grid.size);

    // save the current co-ordinate system
		grid.ctx.save();

    // move to the middle of where we want to draw our image
		grid.ctx.translate(this.position[0] * grid.cnv.width / grid.size +
      grid.cnv.width / grid.size / 2,
      this.position[1] * grid.cnv.height / grid.size + grid.cnv.height / grid.size / 2);

    // rotate around that point, converting the angle from degrees to radians
		grid.ctx.rotate(angle[this.direction] * Math.PI / 180);

    // draw it up and to the left by half the width and height of the image
		grid.ctx.drawImage(this.alive, -grid.cnv.width / grid.size / 2,
      -grid.cnv.height / grid.size / 2, grid.cnv.width / grid.size, grid.cnv.height / grid.size);

    // Restore the co-ords to how they were before
		grid.ctx.restore();
	}

  // ROVER METHOD: Takes the this.nextPosition back to the grid (across the edges) if it is out of boundaries
	adjustToGrid(grid) {
		if (this.nextPosition[0] < 0) {
			this.nextPosition[0] %= grid.size;
			this.nextPosition[0] += grid.size;
		}  else {
			this.nextPosition[0] %= grid.size;
		}

		if (this.nextPosition[1] < 0) {
			this.nextPosition[1] %= grid.size;
			this.nextPosition[1] += grid.size;
		}  else {
			this.nextPosition[1] %= grid.size;
		}
	}

  // ROVER METHOD: Checks if a given position is blocked by other rover (one of them is player1)
	isOther(firstCoord, secondCoord) {
		for (var i in Rover.allInstances) {
			if ((Rover.allInstances[i] !== this) &&
				(this.automated !== Rover.allInstances[i].automated) &&
				(firstCoord === Rover.allInstances[i].position[0]) &&
				(secondCoord === Rover.allInstances[i].position[1])) {
				return true;
			}
		}
		return false;
	}

	// ROVER METHOD: Checks if a given position is blocked by other rover (both of them are automated)
	isSame(firstCoord, secondCoord) {
		for (var i in Rover.allInstances) {
			if ((Rover.allInstances[i] !== this) &&
				(this.automated === Rover.allInstances[i].automated) &&
				(firstCoord === Rover.allInstances[i].position[0]) &&
				(secondCoord === Rover.allInstances[i].position[1])) {
				return true;
			}
		}
		return false;
	}

	//ROVER METHOD: Modifies the number of lifes of the rover by the given amount
	modifyLifes(amount) {
		this.lifes += amount;
	}


	//ROVER METHOD: Puts the lifes and score values on their boards
	updateHtml() {
		$(this.lifesId).html(this.lifes);
		$(this.scoreId).html(this.score);
	}


  // ROVER METHOD: Runs if grid.isBlocked is true in goMove
	runIfBlocked(grid) {
		if (!this.automated) {
			grid.ctx.drawImage(this.dead,
      this.position[0] * grid.cnv.width / grid.size - 0.5 * grid.cnv.width / grid.size / 2,
      this.position[1] * grid.cnv.height / grid.size - 0.5 *
        grid.cnv.height / grid.size / 2,
      1.5 * grid.cnv.width / grid.size,
      1.5 * grid.cnv.height / grid.size);

			// Removes one life and changes variable theEnd to true
			this.modifyLifes(-1);
			theEnd = true;

			// Puts the lifes and score values on their boards
			this.updateHtml();

			// Final message asking to reload page
			grid.ctx.fillStyle = "darkred";
			grid.ctx.font = 0.07 * grid.cnv.width + "px Ubuntu";
			grid.ctx.textAlign = "center";

			if (player1.lifes > 0) {  // Keep playing while you still have lifes
				grid.ctx.fillText("You crashed against something", 0.5 * grid.cnv.width,
				0.4 * grid.cnv.height);
				grid.ctx.fillText("Press enter to continue", 0.5 * grid.cnv.width,
				0.6 * grid.cnv.height);
			} else {  // The end, show final score
				grid.ctx.fillText("YOU LOST!!!!", 0.5 * grid.cnv.width,
				0.35 * grid.cnv.height);
				grid.ctx.fillText("FINAL SCORE: " + player1.score, 0.5 * grid.cnv.width,
				0.5 * grid.cnv.height);
				grid.ctx.fillText("Press enter to start again", 0.5 * grid.cnv.width,
				0.65 * grid.cnv.height);
			}
		}
	}

  // ROVER METHOD: Runs if isOther is true in goMove
	runIfOther(grid) {
		grid.ctx.drawImage(player1.dead,
    player1.position[0] * grid.cnv.width / grid.size - 0.5 * grid.cnv.width / grid.size / 2,
    player1.position[1] * grid.cnv.height / grid.size - 0.5 * grid.cnv.height / grid.size / 2,
    1.5 * grid.cnv.width / grid.size,
    1.5 * grid.cnv.height / grid.size);

		// Removes one life and changes variable theEnd to true
		this.modifyLifes(-1);
		theEnd = true;

		// Puts the lifes and score values on their boards
		this.updateHtml();

		// Final message asking to press enter to continue
		grid.ctx.fillStyle = "darkred";
		grid.ctx.font = 0.07 * grid.cnv.width + "px Ubuntu";
		grid.ctx.textAlign = "center";

		if (player1.lifes > 0) {  // Keep playing while you still have lifes
			grid.ctx.fillText("Player was destroyed by Alien", 0.5 * grid.cnv.width,
      0.4 * grid.cnv.height);
			grid.ctx.fillText("Press enter to continue", 0.5 * grid.cnv.width,
      0.6 * grid.cnv.height);
		} else {  // The end, show final score
			grid.ctx.fillText("YOU LOST!!!!", 0.5 * grid.cnv.width,
			0.35 * grid.cnv.height);
			grid.ctx.fillText("FINAL SCORE: " + player1.score, 0.5 * grid.cnv.width,
			0.5 * grid.cnv.height);
			grid.ctx.fillText("Press enter to start again", 0.5 * grid.cnv.width,
			0.65 * grid.cnv.height);
		}

	}

  // ROVER METHOD: Runs if the rover finally moves in goMove
	runIfGo(grid) {

    // Draws the background in the rover's position (which is moving to nextPosition)
		grid.ctx.drawImage(grid.background,
    this.position[0] * grid.cnv.width / grid.size,
    this.position[1] * grid.cnv.height / grid.size,
    grid.cnv.width / grid.size,
    grid.cnv.height / grid.size);
		grid.ctx.lineWidth = "1px";
		grid.ctx.strokeStyle = "grey";
		grid.ctx.strokeRect(this.position[0] * grid.cnv.width / grid.size, this.position[1] *
    grid.cnv.height / grid.size, grid.cnv.width / grid.size, grid.cnv.height / grid.size);

    // Updates position with nextPosition
		this.position[0] = this.nextPosition[0];
		this.position[1] = this.nextPosition[1];

    // Draws the rover in the nextPosition
		this.drawRotatedImage(grid);

	}


	// ROVER METHOD: Moves next position the number of steps in the given direction

	step(number) {
		switch (this.direction) {
		case 0:
			this.nextPosition[1] -= number;
			break;
		case 1:
			this.nextPosition[0] += number;
			break;
		case 2:
			this.nextPosition[1] += number;
			break;
		case 3:
			this.nextPosition[0] -= number;
			break;
		}
	}

  // ROVER METHOD: Moves forward or back one step
	goMove(grid, forwardOrBack) {

    // Exits method if a rover has exploded
		if (theEnd) {
			return;
		}

    // Sets the rover's nextPosition to the current position
		this.nextPosition[0] = this.position[0];
		this.nextPosition[1] = this.position[1];

    // Changes rover's nextPosition depending on forwardOrBack and the current direction
		if (forwardOrBack === "forward") {
			this.step(1);
		} else {
			this.step(-1);
		}

    // Adjust nextPosition if off limits
		this.adjustToGrid(grid);

		// In case the nextPosition is blocked by an obstacle, the rover explodes and loses one life
		if (grid.isBlocked(this.nextPosition[0], this.nextPosition[1])) {
			this.runIfBlocked(grid);
			return;

		} else if (this.isOther(this.nextPosition[0], this.nextPosition[1])) {

			// In case the player is colliding with an enemy, the rover explodes and loses one life
			this.runIfOther(grid);
			return;

		} else if (this.isSame(this.nextPosition[0], this.nextPosition[1])) {

			// In case the rovers to collide are both automated, exit the method without moving
			return;
		} else {
			this.runIfGo(grid);
		}
	}


  // ROVER METHOD: Turns the rover according to the parameter left or right (to the left or to the right)
	turn(grid, leftOrRight) {

    // Exits method if a rover has exploded
		if (theEnd) {
			return;
		}

		// Sets the rover's nextPosition to the current position
		this.nextPosition[0] = this.position[0];
		this.nextPosition[1] = this.position[1];

    // Changes rover's "future direction" to the left or to the right
		if (leftOrRight === "left") {
			this.direction -= 1;
			if (this.direction < 0) {
				this.direction += 4;
			}
		} else {
			this.direction += 1;
			if (this.direction > 3) {
				this.direction -= 4;
			}
		}

    // draws the background and the rotated image
		{
			this.drawRotatedImage(grid);
		}

	}


  // ROVER METHOD: Puts a rover in automated move (avoiding obstacles but not the other rover)
	autoMove(grid) {
		this.automated = true;
		if (!theEnd) {
			var order = Math.floor(Math.random() * 4);
			if (order < 2) {
				this.goMove(grid, "forward");
			}    else if (order < 2.75) {
				this.goMove(grid, "back");
			}    else if (order < 3.5) {
				this.turn(grid, "left");
			}    else {
				this.turn(grid, "right");
			}
			var self = this;
			setTimeout(function() {
				self.autoMove(grid);
			}, Math.random() * (500) + 300);
		}
	}

}


// MAIN FUNCTION: Starts the game

function initiateGame(grid, rover) {

// Sets the position of the obstacles
	grid.setObstacles();

// Sets the origin for the rover
	rover.setOrigin(grid);

// Sets the origin for the enemies
	for (var enemyIndex in rover.enemy) {
		rover.enemy[enemyIndex].setOrigin(grid);
	}

// Puts the lifes and score values on their boards
	if (rover.lifes <= 0) {
		rover.score = 0;
		rover.lifes = 3;
	}
	rover.updateHtml();

// Loops across each tile in the grid
	for (var i = 0; i < grid.size; i++) {
		for (var j = 0; j < grid.size; j++) {

    // Draws the background and border for every tile
			grid.ctx.drawImage(grid.background,
      i * grid.cnv.width / grid.size,
      j * grid.cnv.height / grid.size,
      grid.cnv.width / grid.size,
      grid.cnv.height / grid.size);
			grid.ctx.lineWidth = "1px";
			grid.ctx.strokeStyle = "grey";
			grid.ctx.strokeRect(i * grid.cnv.width / grid.size,
  j * grid.cnv.height / grid.size,
  grid.cnv.width / grid.size,
  grid.cnv.height / grid.size);

    // Draws the first rover
			if (rover.position[0] === i && rover.position[1] === j) {
				rover.drawRotatedImage(grid);
				continue;

			} else if (grid.isBlocked(i, j)) {

      // Draws the obstacles
				grid.ctx.drawImage(grid.obstaclesSprite,
        i * grid.cnv.width / grid.size,
        j * grid.cnv.height / grid.size,
        grid.cnv.width / grid.size,
        grid.cnv.height / grid.size);
				continue;

      // Draws the other rovers
			} else {
				for (var enemyCoor in rover.enemy) {

					if (rover.enemy[enemyCoor].position[0] === i &&
          rover.enemy[enemyCoor].position[1] === j) {

						rover.enemy[enemyCoor].drawRotatedImage(grid);
						continue;
					}
				}
			}
		}
	}

// Puts the enemies in automated move
	for (var enemyAuto in rover.enemy) {
		rover.enemy[enemyAuto].autoMove(grid);
	}
}


// KEYBOARD MOVING FUNCTION

// Allows the use of the arrow keys to move player1. When a game is finished, it
// waits for the "key enter" to be pressed to keep playing
$(document).bind("keydown", function(key) {
	if (key.keyCode === 38) { // key = up arrow
		player1.goMove(myMap, "forward");
	}  else if (key.keyCode === 40) { // key = down arrow
		player1.goMove(myMap, "back");
	}  else if (key.keyCode === 39) { // key = right arrow
		player1.turn(myMap, "right");
	}  else if (key.keyCode === 37) { // key = left arrow
		player1.turn(myMap, "left");
	}  else if (key.keyCode === 13 && theEnd) { // key = enter
    // Sets the origin for the rovers
		player1.setOrigin(myMap);

    // Sets theEnd back to false
		theEnd = false;

    // Draws the map with the obstacles and rovers
		initiateGame(myMap, player1);

	}

});

// CLASS VARIABLES

// Creates an array with all the instances of the Rover class
Rover.allInstances = [];

// GLOBAL VARIABLES

// Creates a variable to exit every movement method (goMove and turn)
// in case a rover explodes (theEnd=true)
var theEnd = false;

// Creates an array containing the cardinal points (ordered clockwise)
var angle = [ 0, 90, 180, 270 ];

var myMapSize = 12;

// INSTANTIATION

// Creates an instance of the class Grid
var myMap = new Grid("myCanvas", "2d", myMapSize, [], "rock", "sand");

// Creates an instance of the class Rover as player1
var player1 = new Rover("Ship", [], [], "", "spaceship", "explosion", "EXPLODED",
"darkred", [], 0, "#score-value", 3, "#lifes-value", false);


var badGuy1 = new Rover("Alien1", [], [], "", "scorpion", "splash", "SMASHED",
"darkblue", player1, 0, "", 1, "", true);

var badGuy2 = new Rover("Alien2", [], [], "", "scorpion", "splash", "SMASHED",
"darkblue", player1, 0, "", 1, "", true);

var badGuy3 = new Rover("Alien3", [], [], "", "scorpion", "splash", "SMASHED",
"darkblue", player1, 0, "", 1, "", true);

var badGuy4 = new Rover("Alien4", [], [], "", "scorpion", "splash", "SMASHED",
"darkblue", player1, 0, "", 1, "", true);

var badGuy5 = new Rover("Alien5", [], [], "", "scorpion", "splash", "SMASHED",
"darkblue", player1, 0, "", 1, "", true);

var badGuy6 = new Rover("Alien6", [], [], "", "scorpion", "splash", "SMASHED",
"darkblue", player1, 0, "", 1, "", true);

var badGuy7 = new Rover("Alien7", [], [], "", "scorpion", "splash", "SMASHED",
"darkblue", player1, 0, "", 1, "", true);

var badGuy8 = new Rover("Alien8", [], [], "", "scorpion", "splash", "SMASHED",
"darkblue", player1, 0, "", 1, "", true);

// The enemy value of player1 can be updated after badGuy1 is created.
player1.enemy.push(badGuy1);
player1.enemy.push(badGuy2);
player1.enemy.push(badGuy3);
player1.enemy.push(badGuy4);
player1.enemy.push(badGuy5);
player1.enemy.push(badGuy6);
player1.enemy.push(badGuy7);
player1.enemy.push(badGuy8);


// START GAME WHEN THE DOM AND IMAGES ARE LOADED

window.onload = function() {

  // Draws the map with the obstacles and rovers
	initiateGame(myMap, player1);

};
