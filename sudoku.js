var sudoku;
var mask;
var game;

window.onload = function() {
    document.getElementById("actions-check").style.display = "none";
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function swap(array, A, B) {
    [array[A], array[B]] = [array[B], array[A]];
}

function display() {
    document.getElementById("field").textContent = "";
    for (var i = 0; i < sudoku.length; i++) {
        for (var j = 0; j < sudoku[i].length; j++) {
            document.getElementById("field").appendChild(createBox((!mask[i][j] ? sudoku[i][j] : game[i][j]), !mask[i][j], i, j));
        }
    }
}

function createBox(value, type, posX, posY) {
    var box = document.createElement("div");
    box.className = (type ? "box" : "box box-sel");
    box.style.gridRowStart = posX;
    box.style.gridRowEnd = posX + 1;
    if (posX == 2 || posX == 5) {
        box.style.marginBottom = "5px";
    }
    box.style.gridColumnStart = posY;
    box.style.gridColumnEnd = posY + 1;
    if (posY == 2 || posY == 5) {
        box.style.marginRight = "5px";
    }
    if (!type) {
        box.onclick = function () {
            boxClick(posX, posY);
        };
    }
    box.textContent = (value == 0 ? "" : value);
    return box;
}

function generateField() {
    var field = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 3, 4, 5, 6, 7, 8, 9, 1],
        [5, 6, 7, 8, 9, 1, 2, 3, 4],
        [8, 9, 1, 2, 3, 4, 5, 6, 7],
        [3, 4, 5, 6, 7, 8, 9, 1, 2],
        [6, 7, 8, 9, 1, 2, 3, 4, 5],
        [9, 1, 2, 3, 4, 5, 6, 7, 8]
    ];
    //rows
    field = shuffleField(field);
    //columns
    field = transpose(field);
    field = shuffleField(field);
    return transpose(field);
}

function shuffleField(field) {
    var temp = [
        [field[0],field[1],field[2]],
        [field[3],field[4],field[5]],
        [field[6],field[7],field[8]]
    ];
    shuffle(temp);
    field[0] = temp[0][0];
    field[1] = temp[0][1];
    field[2] = temp[0][2];
    field[3] = temp[1][0];
    field[4] = temp[1][1];
    field[5] = temp[1][2];
    field[6] = temp[2][0];
    field[7] = temp[2][1];
    field[8] = temp[2][2];
    temp = [field[0],field[1],field[2]];
    shuffle(temp);
    field[0] = temp[0];
    field[1] = temp[1];
    field[2] = temp[2];
    temp = [field[3],field[4],field[5]];
    shuffle(temp);
    field[3] = temp[0];
    field[4] = temp[1];
    field[5] = temp[2];
    temp = [field[6],field[7],field[8]];
    shuffle(temp);
    field[6] = temp[0];
    field[7] = temp[1];
    field[8] = temp[2];
    return field;
}

function transpose(matrix) {
    return matrix[0].map((col, i) => matrix.map(row => row[i]));
}

function generateMask(difficulty) {
    //difficulty range: 2-7 empty spaces per row;
    var mask = [];
    for (var i = 0; i < 9; i++) {
        mask[i] = generateSubmask(difficulty);
    }
    return mask;
}

function generateSubmask(difficulty) {
    var mask_element = [];
    for (var i = 0; i < 9; i++) {
        if (difficulty > 0) {
            mask_element[i] = 1;
            difficulty--;
        } else {
            mask_element[i] = 0;
        }
    }
    shuffle(mask_element);
    return mask_element;
}

function gameStart() {
    sudoku = generateField();
    mask = generateMask(document.getElementById("diff").value);
    game = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    document.getElementById("actions-start").textContent = "restart";
    document.getElementById("actions-check").style.display = "block";
    display();
}

function checkWinCondition() {
    var fail = false;
    for (var i = 0; i < mask.length && !fail; i++) {
        for (var j = 0; j < mask[i].length && !fail; j++) {
            if(mask[i][j]) {
                fail = sudoku[i][j] != game[i][j];
            }
        }
    }
    if (fail) {
        alert("Not solved.");
    } else {
        alert("Solved!");
    }
}

function boxClick(posX, posY) {
    if (game[posX][posY] == 9) {
        game[posX][posY] = 0;
    } else {
        game[posX][posY]++;
    }
    display();
}