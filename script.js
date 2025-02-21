// Select all buttons with the class 'semi-circle'
let buttons = document.querySelectorAll(".semi-circle");

// Select the element to display the player's score
let playerScore = document.querySelector(".score");

// Initialize player's high score
let playerHighScore = 0;

// Array to store the generated sequence
let generatedSequence = [];

// Array to store the player's sequence
let playerSequence = [];

// Variable to keep track of the current level
let level = 0;

// Flag to prevent multiple keydown events from starting the game
let gameStarted = false;

// Audio Files
let redSound = new Audio("assets/red.mp3");
let blueSound = new Audio("assets/blue.mp3");
let yellowSound = new Audio("assets/yellow.mp3");
let greenSound = new Audio("assets/green.mp3");

// Disable text selection
document.addEventListener('selectstart', function(e) {
    e.preventDefault();
    return false;
});


// Function to get the audio file based on the button index
function getAudio(index) {
    switch (index) {
        case 0:
            return redSound;
        case 1:
            return blueSound;
        case 2:
            return yellowSound;
        case 3:
            return greenSound;
        default:
            return null;
    }
}

// Function to start the game
function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        // Reset sequences and level
        generatedSequence = [];
        playerSequence = [];
        level = 0;
        // Add the first button to the sequence
        addToSequence();
    }
}

// Function to add a random button to the sequence
function addToSequence() {
    // Define the colors corresponding to button indices
    const colors = ["red", "blue", "green", "yellow"];
    // Generate a random index
    const randomIndex = Math.floor(Math.random() * colors.length);
    // Add the random index to the generated sequence
    generatedSequence.push(randomIndex);
    // Play the sequence with glowing effect, but only flash the last button
    playSequence();
}

// Function to play the sequence with glowing effect
function playSequence() {
    // Reset player sequence
    playerSequence = [];
    // Get the last button in the generated sequence
    const lastIndex = generatedSequence.length - 1;
    const button = buttons[generatedSequence[lastIndex]];
    // Flash the last button after a 1-second delay
    setTimeout(() => {
        flashButton(generatedSequence[lastIndex], true);
    }, 1000);
}

// Function to handle player input
function handlePlayerInput(index) {
    // Add the player's input to the player sequence
    playerSequence.push(index);
    // Flash the button based on player input
    flashButton(index, false);
    // Check if the last button pressed matches the last button in the generated sequence
    if (playerSequence[playerSequence.length - 1] !== generatedSequence[playerSequence.length - 1]) {
        // Alert the player of a wrong sequence and reset the game
        alert('Wrong sequence! Game Over.');
        resetGame();
        return;
    }
    // If the player has completed the sequence
    if (playerSequence.length === generatedSequence.length) {
        // Increment the level
        level++;
        // Update the score display
        updateScore();
        // Add a new button to the sequence
        addToSequence();
    }
}

// Function to flash a button
function flashButton(index, isGenerated) {
    const button = buttons[index];
    // Add the 'clicked' class for a flash effect
    button.classList.add('clicked');
    // Play the corresponding audio
    const audio = getAudio(index);
    if (audio) {
        audio.currentTime = 0; // Rewind the audio to the beginning
        audio.play();
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

// Function to update the score
function updateScore() {
    // Update the player's score display
    playerScore.textContent = level;
    // Check if the current level is a new high score
    if (level > playerHighScore) {
        playerHighScore = level;
        // Optionally, update high score display if needed
    }
}

// Function to reset the game
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

// Event listeners for buttons
buttons.forEach((button, index) => {
    button.addEventListener('click', () => handlePlayerInput(index));
});

// Start the game when any key is pressed
document.addEventListener('keydown', () => {
    startGame();
});

// Code Flow:
// 1. When the game starts, `startGame` is called.
// 2. `startGame` resets the sequences and level, then calls `addToSequence`.
// 3. `addToSequence` generates a random button index and adds it to `generatedSequence`.
// 4. `playSequence` is called to flash only the last button in the sequence after a 1-second delay.
// 5. When a button is clicked, `handlePlayerInput` is called.
// 6. `handlePlayerInput` checks if the clicked button matches the sequence.
// 7. If the sequence is correct, the level is incremented, and `addToSequence` is called to add a new button.
// 8. If the sequence is incorrect, an alert is shown, and the game is reset.
// 9. The `flashButton` function handles the visual feedback for both player inputs and sequence displays.
// 10. Audio feedback is played when a button is flashed.