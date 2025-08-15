let board, context;


let boardWidth = window.innerWidth;
let boardHeigth = window.innerHeight;
let backgroundImg = new Image();
backgroundImg.src = "./img/Fondo1.png";
let inputLocked = false;

document.addEventListener("keydown", handleKeyDown);

let GAME_STATE = {
    MENU: "menu",
    PLAYING: "playing",
    GAME_OVER: "gameOver"
};
let currentState = GAME_STATE.MENU;

let playButton = {
    x: boardWidth / 2 - 115.5 / 2,
    y: boardHeigth / 2 - 64 / 2,
    width: 115,
    height: 64
};

let logo = {
    x: boardWidth / 2 - 300 / 2,
    y: boardHeigth / 4,
    width: 300,
    height: 100
};

let flappyBirdTextImg = new Image();
flappyBirdTextImg.src = "./img/flappyBirdLogo.png";
let gameOverImg = new Image();
gameOverImg.src = "./img/flappy-gameover.png";

let bird = {
    x: 50,
    y: boardHeigth / 2,
    width: 40,
    height: 30
};

let velocityY = 0;
let velocityX = -2;
let gravity = 0.3;
let birdY = boardHeigth / 2;
let treeWidth = 70;
let treeGap = 250;
let treeArray = [];
let treeIntervalId;
let score = 0;

let topTreeImg, bottomTreeImg, birdImg, playButtonImg;

function placeTrees() {
    createTrees();
}

function createTrees() {
    let maxTopTreeHeigth = boardHeigth - treeGap - 50;
    let topTreeHeigth = Math.floor(Math.random() * maxTopTreeHeigth);
    let bottomTreeHeigth = boardHeigth - topTreeHeigth - treeGap;

    let topTree = {
        x: boardWidth,
        y: 0,
        width: treeWidth,
        height: topTreeHeigth,
        img: topTreeImg,
        passed: false
    };

    let bottomTree = {
        x: boardWidth,
        y: topTreeHeigth + treeGap,
        width: treeWidth,
        height: bottomTreeHeigth,
        img: bottomTreeImg,
        passed: false
    };
    treeArray.push(topTree, bottomTree);
}

window.onload = function () {
    board = document.getElementById("board");
    context = board.getContext("2d");

    function resizeCanvas() {
        const container = document.getElementById("container");
        board.width = container.clientWidth;
        board.height = container.clientHeight;
        boardWidth = board.width;
        boardHeigth = board.height;

        // Recalcula posiciones dependientes del tamaño
        playButton.x = boardWidth / 2 - playButton.width / 2;
        playButton.y = boardHeigth / 2 - playButton.height / 2;
        logo.x = boardWidth / 2 - logo.width / 2;
        logo.y = boardHeigth / 4;
        bird.y = boardHeigth / 2;
        birdY = boardHeigth / 2;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    birdImg = new Image();
    birdImg.src = "./img/flappybird.png";
    topTreeImg = new Image();
    topTreeImg.src = "./img/bottom.png"; 

    bottomTreeImg = new Image();
    bottomTreeImg.src = "./img/bottom.png";
    playButtonImg = new Image();
    playButtonImg.src = "./img/flappyBirdPlayButton.png";

    board.addEventListener("click", function (e) {
        if (currentState === GAME_STATE.MENU) {
            const rect = board.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            if (
                mouseX >= playButton.x &&
                mouseX <= playButton.x + playButton.width &&
                mouseY >= playButton.y &&
                mouseY <= playButton.y + playButton.height
            ) {
                startGame();
            }
        }
    });

    requestAnimationFrame(update);
}

function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);
    if (currentState === GAME_STATE.MENU) {
        renderMenu();
    } else if (currentState === GAME_STATE.PLAYING) {
        renderGame();
    } else if (currentState === GAME_STATE.GAME_OVER) {
        renderGameOver();
    }
}

function renderMenu() {
    if (backgroundImg.complete) {
        context.drawImage(backgroundImg, 0, 0, boardWidth, boardHeigth);
    }
    if (playButtonImg.complete) {
        context.drawImage(playButtonImg, playButton.x, playButton.y, playButton.width, playButton.height);
    }
    if (flappyBirdTextImg.complete) {
        let scaledWidht = logo.width;
        let scaledHeight = (flappyBirdTextImg.height / flappyBirdTextImg.width) * scaledWidht;
        context.drawImage(flappyBirdTextImg, logo.x, logo.y, scaledWidht, scaledHeight);
    }
}

function renderGame() {
    if (backgroundImg.complete) {
        context.drawImage(backgroundImg, 0, 0, boardWidth, boardHeigth);
    }

    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        currentState = GAME_STATE.GAME_OVER;
    }

    for (let i = 0; i < treeArray.length; i++) {
        let tree = treeArray[i];
        tree.x += velocityX;

        context.drawImage(tree.img, tree.x, tree.y, tree.width, tree.height);

        if (!tree.passed && bird.x > tree.x + tree.width) {
            score += 0.5;
            tree.passed = true;
        }

        if (detectCollision(bird, tree)) {
            currentState = GAME_STATE.GAME_OVER;
        }
    }

    while (treeArray.length > 0 && treeArray[0].x < -treeWidth) {
        treeArray.shift();
    }

    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.textAlign = "left";
    context.fillText(score, 5, 105); // <-- Ahora 60px más abajo
}

function renderGameOver() {
    if (gameOverImg.complete) {
        let imgWidth = 400;
        let imgHeight = 80;
        let x = (boardWidth - imgWidth) / 2;
        let y = boardHeigth / 3;

        context.drawImage(gameOverImg, x, y, imgWidth, imgHeight);

        let scoreText = `Tu puntuacion: ${Math.floor(score)}`;
        context.fillStyle = "white";
        context.font = "45px sans-serif";
        context.textAlign = "center";
        context.fillText(scoreText, boardWidth / 2, y + imgHeight + 50);

        inputLocked = true;
        setTimeout(() => {
            inputLocked = false;
        }, 1000);
    }
}

function handleKeyDown(e) {
    if (inputLocked) return;

    if (e.code === "Space") {
        if (currentState === GAME_STATE.MENU) {
            startGame();
        } else if (currentState === GAME_STATE.GAME_OVER) {
            resetGame();
            currentState = GAME_STATE.MENU;
        } else if (currentState === GAME_STATE.PLAYING) {
            velocityY = -6;
        }
    }
}

function startGame() {
    currentState = GAME_STATE.PLAYING;
    bird.y = birdY;
    velocityY = 0;
    treeArray = [];
    score = 0;

    if (treeIntervalId) {
        clearInterval(treeIntervalId);
    }
    treeIntervalId = setInterval(placeTrees, 1500);
}

function resetGame() {
    bird.y = birdY;
    treeArray = [];
    score = 0;
    if (treeIntervalId) {
        clearInterval(treeIntervalId);
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}