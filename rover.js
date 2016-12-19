// Implementation of two moving rovers (player1 named "Ship" and badGuy1 named "Alien")
// Apart from the functions that allow their movement using the console,
// a visual implementation has been done using a canvas
// JQuery is used to allow the movement of the rovers with the arrow keys
// JQuery is also used for updating the scores to the screen
// The game is stopped when:
// 1. One of the rovers crashes against an obstacle --> The other rover gets a point
// 2. One of the rovers hits the other rover --> The one who hits gets a point

// CLASS' DECLARATION

// Definition of the class Grid, with the constructor and three methods (setObstacles,
// isBlocked and initGrid)
class Grid {
	constructor( cnv, ctx, size, obstaclesCoords, obstaclesSprite, background ) {
		this.cnv = document.getElementById( cnv );
		this.ctx = this.cnv.getContext( ctx );
		this.size = size;
		this.obstaclesCoords = obstaclesCoords;
		this.obstaclesSprite = document.getElementById( obstaclesSprite );
		this.background = document.getElementById( background );
	}

  // DECLARATION OF METHODS

  // GRID METHOD: Creates obstacles in the grid
	setObstacles() {
		var numberObstacles = Math.floor( Math.random() * Math.pow( this.size, 2 ) / 10 +
      Math.pow( this.size, 2 ) / 20 );
		for ( var i = 0; i < numberObstacles; i++ ) {
			this.obstaclesCoords[ i ] = [];
			this.obstaclesCoords[ i ][ 0 ] = Math.floor( Math.random() * this.size );
			this.obstaclesCoords[ i ][ 1 ] = Math.floor( Math.random() * this.size );
		}
	}

  // GRID METHOD: Checks if a given position is blocked by an obstacle
	isBlocked( firstCoord, secondCoord ) {
		for ( var obstacle = 0; obstacle < this.obstaclesCoords.length; obstacle++ ) {
			if ( ( firstCoord === this.obstaclesCoords[ obstacle ][ 0 ] ) &&
        ( secondCoord === this.obstaclesCoords[ obstacle ][ 1 ] ) ) {
				return true;
			}
		}
		return false;
	}

  // GRID METHOD: Draws the initial grid with obstacles and rovers in the canvas
	initGrid( rover ) {

    // Sets the position of the obstacles
		this.setObstacles();

    // Sets the origin for the rovers
		rover.setOrigin( this );
		rover.enemy.setOrigin( this );

    // Puts the scores on their screens
		$( rover.valueName ).html( rover.score );
		$( rover.enemy.valueName ).html( rover.enemy.score );

    // Loops across each tile in the grid
		for ( var i = 0; i < this.size; i++ ) {
			for ( var j = 0; j < this.size; j++ ) {

        // Draws the background and border for every tile
				this.ctx.drawImage( this.background,
          i * this.cnv.width / this.size,
          j * this.cnv.height / this.size,
          this.cnv.width / this.size,
          this.cnv.height / this.size );
				this.ctx.lineWidth = "1px";
				this.ctx.strokeStyle = "grey";
				this.ctx.strokeRect( i * this.cnv.width / this.size,
      j * this.cnv.height / this.size,
      this.cnv.width / this.size,
      this.cnv.height / this.size );

        // Draws the first rover
				if ( rover.position[ 0 ] === i && rover.position[ 1 ] === j ) {
					rover.drawRotatedImage( this );
					continue;
				} else if ( rover.enemy.position[ 0 ] === i && rover.enemy.position[ 1 ] === j ) {

          // Draws the other rover
					rover.drawRotatedImage( this );
					continue;
				} else if ( this.isBlocked( i, j ) ) {

          // Draws the obstacles
					this.ctx.drawImage( this.obstaclesSprite,
            i * this.cnv.width / this.size,
            j * this.cnv.height / this.size,
            this.cnv.width / this.size,
            this.cnv.height / this.size );
					continue;
				}
			}
		}

    // Puts the enemy in automated move
		rover.enemy.autoMove( this );
	}
}

// Defines the class rover, with the name, current position, their nextPosition where they have to move,
// the direction they are pointing, their alive and dead images, a message and color in case they crash,
// their enemy, their score and the name of the variable holding that score, and the boolean automated
// showing if they are on autoMove. It also defines methods for the class

class Rover {
	constructor( name, position, nextPosition, direction, alive, dead, message, color,
    enemy, score, valueName, automated ) {
		this.name = name;
		this.position = position;
		this.nextPosition = nextPosition;
		this.direction = direction;
		this.alive = document.getElementById( alive );
		this.dead = document.getElementById( dead );
		this.message = message;
		this.color = color;
		this.enemy = enemy;
		this.score = score;
		this.valueName = valueName;
		this.automated = automated;
	}

  // DECLARATION OF METHODS

  // ROVER METHOD: Sets the starting position and direction of the rover
	setOrigin( grid ) {
		this.position[ 0 ] = Math.floor( Math.random() * grid.size );
		this.position[ 1 ] = Math.floor( Math.random() * grid.size );

		if ( myMap.isBlocked( this.position[ 0 ], this.position[ 1 ] ) ||
      this.isOther( grid, this, this.position[ 0 ], this.position[ 1 ] ) ) {
			this.setOrigin( grid );
		}
		this.direction = cardinalPoints[ Math.floor( Math.random() * 4 ) ];
	}

  // ROVER METHOD: Draws an image of the rover in the canvas, pointing in the required direction (includes background)
	drawRotatedImage( grid ) {

    // Draws the background in the rover's position (to hide the previous image of the rover)
		grid.ctx.drawImage( grid.background,
      this.position[ 0 ] * grid.cnv.width / grid.size,
      this.position[ 1 ] * grid.cnv.height / grid.size,
      grid.cnv.width / grid.size,
      grid.cnv.height / grid.size ); grid.ctx.lineWidth = "1px";
		grid.ctx.strokeStyle = "grey";
		grid.ctx.strokeRect( this.position[ 0 ] * grid.cnv.width / grid.size,
      this.position[ 1 ] * grid.cnv.height / grid.size, grid.cnv.width / grid.size,
      grid.cnv.height / grid.size );

    // Create variable angle pointing in the this.direction
		var angle = 0;
		switch ( this.direction ) {
		case "N":
			angle = 0;
			break;
		case "E":
			angle = 90;
			break;
		case "S":
			angle = 180;
			break;
		case "W":
			angle = 270;
			break;
		}

    // save the current co-ordinate system
		grid.ctx.save();

    // move to the middle of where we want to draw our image
		grid.ctx.translate( this.position[ 0 ] * grid.cnv.width / grid.size +
      grid.cnv.width / grid.size / 2,
      this.position[ 1 ] * grid.cnv.height / grid.size + grid.cnv.height / grid.size / 2 );

    // rotate around that point, converting the angle from degrees to radians
		grid.ctx.rotate( angle * Math.PI / 180 );

    // draw it up and to the left by half the width and height of the image
		grid.ctx.drawImage( this.alive, -grid.cnv.width / grid.size / 2,
      -grid.cnv.height / grid.size / 2, grid.cnv.width / grid.size, grid.cnv.height / grid.size );

    // Restore the co-ords to how they were before
		grid.ctx.restore();
	}

  // ROVER METHOD: Takes the this.nextPosition back to the grid (across the edges) if it is out of boundaries
	adjustToGrid( grid ) {
		if ( this.nextPosition[ 0 ] < 0 ) {
			this.nextPosition[ 0 ] %= grid.size;
			this.nextPosition[ 0 ] += grid.size;
		}  else {
			this.nextPosition[ 0 ] %= grid.size;
		}

		if ( this.nextPosition[ 1 ] < 0 ) {
			this.nextPosition[ 1 ] %= grid.size;
			this.nextPosition[ 1 ] += grid.size;
		}  else {
			this.nextPosition[ 1 ] %= grid.size;
		}
	}

  // ROVER METHOD: Checks if a given position is blocked by the other rover
	isOther( grid, firstCoord, secondCoord ) {
		if ( ( firstCoord === this.enemy.position[ 0 ] ) &&
   ( secondCoord === this.enemy.position[ 1 ] ) ) {
			return true;
		}
		return false;
	}

  // ROVER METHOD: Runs if myMap.isBlocked is true in goForward or goBack
	runIfBlocked( grid ) {
		if ( !this.automated ) {
			console.log( this.name + " " + this.message );
			grid.ctx.drawImage( this.dead,
      this.position[ 0 ] * grid.cnv.width / grid.size - 0.5 * grid.cnv.width / grid.size / 2,
      this.position[ 1 ] * grid.cnv.height / grid.size - 0.5 *
        grid.cnv.height / grid.size / 2,
      1.5 * grid.cnv.width / grid.size,
      1.5 * grid.cnv.height / grid.size );

    // Final message asking to reload page
			grid.ctx.fillStyle = this.color;
			grid.ctx.font = 0.07 * grid.cnv.width + "px Ubuntu";
			grid.ctx.textAlign = "center";
			grid.ctx.fillText( this.name + " " + this.message, 0.5 * grid.cnv.width,
        0.4 * grid.cnv.height );
			grid.ctx.fillText( "Press enter to continue", 0.5 * grid.cnv.width,
        0.6 * grid.cnv.height );

    // Changes variable theEnd to true
			theEnd = true;

    // Adds one point to the other rover's score
			this.enemy.score += 1;
			$( this.enemy.valueName ).html( this.enemy.score );
		}
	}

  // ROVER METHOD: Runs if isOther is true in goForward or goBack
	runIfOther( grid ) {
		console.log( this.enemy.name + " was destroyed by " + this.name );
		grid.ctx.drawImage( this.enemy.dead,
    this.enemy.position[ 0 ] * grid.cnv.width / grid.size - 0.5 * grid.cnv.width / grid.size / 2,
    this.enemy.position[ 1 ] * grid.cnv.height / grid.size - 0.5 * grid.cnv.height / grid.size / 2,
    1.5 * grid.cnv.width / grid.size,
    1.5 * grid.cnv.height / grid.size );

    // Final message asking to reload page
		grid.ctx.fillStyle = this.enemy.color;
		grid.ctx.font = 0.07 * grid.cnv.width + "px Ubuntu";
		grid.ctx.textAlign = "center";
		grid.ctx.fillText( this.enemy.name + " was destroyed by " + this.name, 0.5 * grid.cnv.width,
      0.4 * grid.cnv.height );
		grid.ctx.fillText( "Press enter to continue", 0.5 * grid.cnv.width,
      0.6 * grid.cnv.height );

    // Changes variable theEnd to true
		theEnd = true;

    // Adds one point to this rover's score
		this.score += 1;
		$( this.valueName ).html( this.score );
	}

  // ROVER METHOD: Runs if the rover finally moves in goForward or goBack
	runIfGo( grid ) {

    // Draws the background in the rover's position (which is moving to nextPosition)
		grid.ctx.drawImage( grid.background,
    this.position[ 0 ] * grid.cnv.width / grid.size,
    this.position[ 1 ] * grid.cnv.height / grid.size,
    grid.cnv.width / grid.size,
    grid.cnv.height / grid.size );
		grid.ctx.lineWidth = "1px";
		grid.ctx.strokeStyle = "grey";
		grid.ctx.strokeRect( this.position[ 0 ] * grid.cnv.width / grid.size, this.position[ 1 ] *
    grid.cnv.height / grid.size, grid.cnv.width / grid.size, grid.cnv.height / grid.size );

    // Updates position with nextPosition
		this.position[ 0 ] = this.nextPosition[ 0 ];
		this.position[ 1 ] = this.nextPosition[ 1 ];

    // Draws the rover in the nextPosition
		this.drawRotatedImage( grid );

    // Prints position to console
		this.printPosition( grid );
	}

  // ROVER METHOD: Prints current position to console
	printPosition() {
		console.log( "New " + this.name + " Position: [" + this.position[ 0 ] +
   ", " + this.position[ 1 ] + "]" );
	}

  // ROVER METHOD: Prints current direction to console
	printDirection() {
		console.log( "New " + this.name + " Direction: " + this.direction );
	}

  // ROVER METHOD: Moves forward (towards the current direction)
	goForward( grid ) {

    // Exits method if a rover has exploded
		if ( theEnd ) {
			return;
		}

    // Resets the rover's nextPosition to the current position
		this.nextPosition[ 0 ] = this.position[ 0 ];
		this.nextPosition[ 1 ] = this.position[ 1 ];

    // Changes rover's nextPosition depending on the direction
		switch ( this.direction ) {
		case "N":
			this.nextPosition[ 1 ]--;
			break;
		case "E":
			this.nextPosition[ 0 ]++;
			break;
		case "S":
			this.nextPosition[ 1 ]++;
			break;
		case "W":
			this.nextPosition[ 0 ]--;
			break;
		}

    // Adjust nextPosition if off limits
		this.adjustToGrid( grid );

    // In case the nextPosition is blocked by an obstacle, the rover explodes and loses the game
		if ( myMap.isBlocked( this.nextPosition[ 0 ], this.nextPosition[ 1 ] ) ) {
			this.runIfBlocked( grid );
			return;
		}

    // Checks if the next position is blocked by the other rover
		if ( this.isOther( myMap, this.nextPosition[ 0 ], this.nextPosition[ 1 ] ) ) {
			this.runIfOther( grid );
			return;
		}
		this.runIfGo( grid );
	}

  // ROVER METHOD: Moves back (opposite to the current direction)
	goBack( grid ) {

    // Exits method if a rover has exploded
		if ( theEnd ) {
			return;
		}

    // Resets the rover's nextPosition to the current position
		this.nextPosition[ 0 ] = this.position[ 0 ];
		this.nextPosition[ 1 ] = this.position[ 1 ];

    // Changes rover's nextPosition depending on the direction
		switch ( this.direction ) {
		case "N":
			this.nextPosition[ 1 ]++;
			break;
		case "E":
			this.nextPosition[ 0 ]--;
			break;
		case "S":
			this.nextPosition[ 1 ]--;
			break;
		case "W":
			this.nextPosition[ 0 ]++;
			break;
		}

    // Adjust nextPosition if off limits
		this.adjustToGrid( grid );

    // In case the nextPosition is blocked by an obstacle, the rover explodes and loses the game
		if ( myMap.isBlocked( this.nextPosition[ 0 ], this.nextPosition[ 1 ] ) ) {
			this.runIfBlocked( grid );
			return;
		}

    // Checks if the next position is blocked by the other rover
		if ( this.isOther( myMap, this.nextPosition[ 0 ], this.nextPosition[ 1 ] ) ) {
			this.runIfOther( grid );
			return;
		}
		this.runIfGo( grid );
	}

  // ROVER METHOD: Turns left
	turnLeft( grid ) {

    // Exits method if a rover has exploded
		if ( theEnd ) {
			return;
		}

    // Changes rover's "future direction" depending on the "current direction"
		switch ( this.direction ) {
		case "N":
			this.direction = "W";
			break;
		case "E":
			this.direction = "N";
			break;
		case "S":
			this.direction = "E";
			break;
		case "W":
			this.direction = "S";
			break;
		}

    // draws the background and the rotated image
		this.drawRotatedImage( grid );

    // Prints direction to console
		this.printDirection( grid );
	}

  // ROVER METHOD: Turns right
	turnRight( grid ) {

    // Exits method if a rover has exploded
		if ( theEnd ) {
			return;
		}

    // Changes rover's "future direction" depending on the "current direction"
		switch ( this.direction ) {
		case "N":
			this.direction = "E";
			break;
		case "E":
			this.direction = "S";
			break;
		case "S":
			this.direction = "W";
			break;
		case "W":
			this.direction = "N";
			break;
		}

    // draws the background and the rotated image
		this.drawRotatedImage( grid );

    // Prints direction to console
		this.printDirection( grid );
	}

  // ROVER METHOD: Follows instructions introduced as a string (f:forward, b: back, r: right, l: left)
	followInstructions( grid, directions ) {

    // Follows the first instruction
		var order = directions.slice( 0, 1 );
		switch ( order.toLowerCase() ) {
		case "f":
			this.goForward( grid );
			break;
		case "b":
			this.goBack( grid );
			break;
		case "l":
			this.turnLeft( grid );
			break;
		case "r":
			this.turnRight( grid );
			break;
		}
		if ( directions.length > 1 ) {
			directions = directions.substr( 1, directions.length - 1 );
			setTimeout( function() {
				this.followInstructions( grid, directions );
			}, 600 );
		}  else {
			return;
		}
	}

  // ROVER METHOD: Puts a rover in automated move (avoiding obstacles but not the other rover)
	autoMove( grid ) {
		this.automated = true;
		if ( !theEnd ) {
			var order = Math.floor( Math.random() * 4 );
			if ( order < 1.5 ) {
				this.goForward( grid );
			}    else if ( order < 2.5 ) {
				this.goBack( grid );
			}    else if ( order < 3.25 ) {
				this.turnLeft( grid );
			}    else {
				this.turnRight( grid );
			}
			var self = this;
			setTimeout( function() {
				self.autoMove( grid );
			}, 300 );
		}
	}

}


// Allows the use of the arrow keys to move player1. In a game is finished, it
// waits for the "key enter" to be pressed to keep playing
$( document ).bind( "keydown", function( key ) {
	if ( key.keyCode === 38 ) { // key = up arrow
		player1.goForward( myMap );
	}  else if ( key.keyCode === 40 ) { // key = down arrow
		player1.goBack( myMap );
	}  else if ( key.keyCode === 39 ) { // key = right arrow
		player1.turnRight( myMap );
	}  else if ( key.keyCode === 37 ) { // key = left arrow
		player1.turnLeft( myMap );
	}  else if ( key.keyCode === 13 && theEnd ) { // key = enter
    // Sets the origin for the rovers
		player1.setOrigin( myMap );
		badGuy1.setOrigin( myMap );

    // Sets theEnd back to false
		theEnd = false;

    // Draws the map with the obstacles and rovers
		myMap.initGrid( player1 );

    // Prints to console the initial position and direction of rovers
		player1.printPosition( myMap );
		player1.printDirection( myMap );
		badGuy1.printPosition( myMap );
		badGuy1.printDirection( myMap );
	}

} );

// GLOBAL VARIABLES

// Creates a variable to exit every movement method (goForward, goBack, turnRight, turnLeft)
// in case a rover explodes (theEnd=true)
var theEnd = false;

// Creates an array containing the cardinal points (ordered clockwise)
var cardinalPoints = [ "N", "E", "S", "W" ];

// INSTANTIATION

// Creates an instance of the class Grid
var myMap = new Grid( "myCanvas", "2d", 10, [], "rock", "sand" );

// Creates two instances of the class Rover
var player1 = new Rover( "Ship", [], [], "", "spaceship", "explosion", "EXPLODED",
"darkred", "", 0, "#value1", false );

var badGuy1 = new Rover( "Alien", [], [], "", "scorpion", "splash", "SMASHED",
"darkblue", player1, 0, "#value2", false );

// The enemy value of player1 can be updated after badGuy1 is created.
player1.enemy = badGuy1;

// INITIATES GAME AND PRINT TO CONSOLE FUNCTIONS WHEN THE DOM AND IMAGES ARE LOADED
window.onload = function() {

  // Draws the map with the obstacles and rovers
	myMap.initGrid( player1 );

  // Prints to console the initial position and direction of rovers
	player1.printPosition( myMap );
	player1.printDirection( myMap );
	badGuy1.printPosition( myMap );
	badGuy1.printDirection( myMap );
};
