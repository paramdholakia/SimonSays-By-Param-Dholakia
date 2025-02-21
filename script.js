// Select all buttons with the class 'semi-circle'
let buttons = document.querySelectorAll(".semi-circle");

// Select the element to display the player's score
let playerScore = document.querySelector(".score");

// Initialize player's high score
let playerHighScore = 0;

// Array to store the generated sequence (the sequence the game generates for the player to follow)
let generatedSequence = [];

// Array to store the player's sequence (the sequence the player inputs)
let playerSequence = [];

// Variable to keep track of the current level (how many sequences the player has successfully completed)
let level = 0;

// Flag to prevent multiple keydown events from starting the game
let gameStarted = false;

// Audio Files for each button color
let redSound = new Audio("assets/red.mp3");
let blueSound = new Audio("assets/blue.mp3");
let yellowSound = new Audio("assets/yellow.mp3");
let greenSound = new Audio("assets/green.mp3");

// Disable text selection on the page to prevent accidental highlighting during gameplay
document.addEventListener('selectstart', function(e) {
    e.preventDefault(); // Prevents text selection
    return false;
});

/**
 * Function to get the audio file based on the button index.
 * @param {number} index - The index of the button (0: Red, 1: Blue, 2: Yellow, 3: Green).
 * @returns {Audio|null} - Returns the corresponding audio file or null if the index is invalid.
 */
function getAudio(index) {
    switch (index) {
        case 0:
            return redSound; // Red button sound
        case 1:
            return blueSound; // Blue button sound
        case 2:
            return yellowSound; // Yellow button sound
        case 3:
            return greenSound; // Green button sound
        default:
            return null; // Invalid index returns null
    }
}

/**
 * Function to start the game.
 * This function initializes the game by resetting the sequences and levels,
 * and then adds the first button to the generated sequence.
 */
function startGame() {
    if (!gameStarted) { // Check if the game hasn't already started
        gameStarted = true; // Set the flag to indicate that the game has started

        // Reset sequences and level
        generatedSequence = [];
        playerSequence = [];
        level = 0;

        // Add the first button to the sequence
        addToSequence();
    }
}

/**
 * Function to add a random button to the generated sequence.
 * This function generates a random number between 0 and 3 (inclusive),
 * which corresponds to one of the four buttons (Red, Blue, Yellow, Green),
 * and adds it to the `generatedSequence` array.
 */
function addToSequence() {
    const colors = ["red", "blue", "green", "yellow"]; // Array of colors corresponding to button indices
    const randomIndex = Math.floor(Math.random() * colors.length); // Generate a random index (0-3)

    // Add the random index to the generated sequence
    generatedSequence.push(randomIndex);

    // Play the sequence with glowing effect, but only flash the last button
    playSequence();
}

/**
 * Function to play the sequence with glowing effect.
 * This function flashes the last button in the generated sequence after a delay.
 */
function playSequence() {
    playerSequence = []; // Reset the player's sequence

    // Get the last button in the generated sequence
    const lastIndex = generatedSequence.length - 1;
    const button = buttons[generatedSequence[lastIndex]];

    // Flash the last button after a 1-second delay
    setTimeout(() => {
        flashButton(generatedSequence[lastIndex], true);
    }, 1000);
}

/**
 * Function to handle player input.
 * This function is called when the player clicks or touches a button.
 * It checks if the player's input matches the generated sequence.
 * @param {number} index - The index of the button the player pressed.
 */
function handlePlayerInput(index) {
    playerSequence.push(index); // Add the player's input to the player sequence

    // Flash the button based on player input
    flashButton(index, false);

    // Check if the last button pressed matches the last button in the generated sequence
    if (playerSequence[playerSequence.length - 1] !== generatedSequence[playerSequence.length - 1]) {
        // If the player presses the wrong button, alert them and reset the game
        alert('Wrong sequence! Game Over.');
        resetGame();
        return;
    }

    // If the player has completed the sequence
    if (playerSequence.length === generatedSequence.length) {
        level++; // Increment the level
        updateScore(); // Update the score display
        addToSequence(); // Add a new button to the sequence
    }
}

/**
 * Function to flash a button.
 * This function visually highlights the button and plays the corresponding sound.
 * @param {number} index - The index of the button to flash.
 * @param {boolean} isGenerated - Indicates whether the button is part of the generated sequence.
 */
function flashButton(index, isGenerated) {
    const button = buttons[index];

    // Add the 'clicked' class for a flash effect
    button.classList.add('clicked');

    // Play the corresponding audio
    const audio = getAudio(index);
    if (audio) {
        audio.currentTime = 0; // Rewind the audio to the beginning
        audio.play().catch(error => {
            console.error("Audio playback failed:", error); // Log any errors during audio playback
        });
    }

    // If the button is part of the generated sequence, add the 'active' class for glowing effect
    if (isGenerated) {
        button.classList.add('active');
        setTimeout(() => {
            // Remove the 'active' class after 1 second
            button.classList.remove('active');
        }, 1000);
    }

    // Remove the 'clicked' class after 300 milliseconds
    setTimeout(() => {
        button.classList.remove('clicked');
    }, 300);
}

/**
 * Function to update the score.
 * This function updates the player's score display and checks if the current level is a new high score.
 */
function updateScore() {
    // Update the player's score display
    playerScore.textContent = level;

    // Check if the current level is a new high score
    if (level > playerHighScore) {
        playerHighScore = level;
        // Optionally, update high score display if needed
    }
}

/**
 * Function to reset the game.
 * This function resets the sequences, level, and game state.
 */
function resetGame() {
    // Reset sequences and level
    generatedSequence = [];
    playerSequence = [];
    level = 0;

    // Update the score display
    updateScore();

    // Reset the game started flag
    gameStarted = false;

    // Optionally, show a game over message or restart prompt
}

/**
 * Event listeners for buttons (both click and touch events).
 * These event listeners allow the player to interact with the buttons using either a mouse or touch input.
 */
buttons.forEach((button, index) => {
    // Add click event listener for desktop users
    button.addEventListener('click', () => handlePlayerInput(index));
    
    // Add touch event listener for mobile users
    button.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent default touch behavior (e.g., scrolling)
        e.stopPropagation(); // Stop event propagation to parent elements
        handlePlayerInput(index);
    });
});

/**
 * Start the game when any key is pressed.
 * This event listener listens for any keypress on the keyboard to start the game.
 */
document.addEventListener('keydown', () => {
    startGame();
});

/**
 * Start the game when the screen is touched (for mobile devices).
 * This event listener listens for a touch event anywhere on the screen to start the game.
 */
document.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent default touch behavior (e.g., scrolling)
    startGame();
});