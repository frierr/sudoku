var sudoku;
var mask;
var game;
var target = [0, 0];

window.onload = function() {
    document.getElementById("actions-check").style.display = "none";
}

window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
      return;
    }
    switch (event.key) {
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
        keyPress(Number(event.key));
        break;
    default:
        return;
    }
    event.preventDefault();
}, true);

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
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
        box.addEventListener("mouseenter", (event) => {
            target[0] = posX;
            target[1] = posY;
        }, false);
    }
    box.textContent = (value == 0 ? "" : value);
    return box;
}

function generateFieldLoop() {
    var field;
    var counter = 1;
    while (counter != 0) {
        field = generateField();
        counter = arrayUndefined(field);
    }
    return field;
}

function generateField() {
    field = generateMask(0);
    field = generateSubfield(field, 0, 0);
    field = generateSubfield(field, 0, 3);
    field = generateSubfield(field, 0, 6);
    field = generateSubfield(field, 3, 0);
    field = generateSubfield(field, 6, 0);
    field = generateSubfield(field, 3, 3);
    field = generateSubfield(field, 3, 6);
    field = generateSubfield(field, 6, 3);
    field = generateSubfield(field, 6, 6);
    return field;
}

function generateSubfieldWrap(field, X, Y) {
    while (arrayUndefined(field, X, Y)) {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                field[X + i][Y + j] = 0;
            }
        }
        field = generateSubfield(field, X, Y);
    }
    return field;
}

function arrayUndefined(array, X, Y) {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (array[X + i][Y + j] == undefined || array[X + i][Y + j] == 0) {
                return true;
            }
        }
    }
    return false;
}

function arrayUndefined(array) {
    var counter = 0;
    for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array[i].length; j++) {
            if (array[i][j] == undefined || array[i][j] == 0) {
                counter++;
            }
        }
    }
    return counter;
}

function generateSubfield(field, X, Y) {
    var nums = [
        [[],[],[]],
        [[],[],[]],
        [[],[],[]]
    ];
    //check context and populate nums array
    for (var i = 0; i < nums.length; i++) {
        for (var j = 0; j < nums[i].length; j++) {
            nums[i][j] = removeContextValues(shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]), field, X + i, Y + j);
        }
    }
    //for each cell find the shortest nums list
    for (var k = 0; k < 9; k++) {
        var a = 0, b = 0;
        for (var i = 0; i < nums.length; i++) {
            for (var j = 0; j < nums[i].length; j++) {
                if (nums[i][j].length != 0 && (nums[i][j].length < nums[a][b].length || nums[a][b].length == 0)) {
                    a = i;
                    b = j;
                }
            }
        }
        //get selected value
        var cell = nums[a][b][0];
        nums[a][b] = [];
        field[X + a][Y + b] = cell;
        //remove value from other nums lists
        for (var i = 0; i < nums.length; i++) {
            for (var j = 0; j < nums[i].length; j++) {
                nums[i][j] = arrayRemove(nums[i][j], cell);
            }
        }
    }
    return field;
}

function removeContextValues(target, context, X, Y) {
    for (var i = 0; i < X; i++) {
        target = arrayRemove(target, context[i][Y]);
    }
    for (var i = 0; i < Y; i++) {
        target = arrayRemove(target, context[X][i]);
    }
    return target;
}

function arrayRemove(array, item) {
    if (array.indexOf(item) > -1) {
        array.splice(array.indexOf(item), 1);
    }
    return array;
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
    sudoku = generateFieldLoop();
    mask = generateMask(document.getElementById("diff").value);
    game = generateMask(0);
    document.getElementById("actions-start").textContent = "restart";
    document.getElementById("actions-check").style.display = "block";
    display();
}

function checkWinCondition() {
    var fail = false;
    document.getElementById("field").textContent = "";
    for (var i = 0; i < mask.length; i++) {
        for (var j = 0; j < mask[i].length; j++) {
            if(mask[i][j]) {
                fail = sudoku[i][j] != game[i][j];
                var elem = createBox(game[i][j], !mask[i][j], i, j);
                elem.style.backgroundColor = (sudoku[i][j] != game[i][j] ? "red" : "lime");
                document.getElementById("field").appendChild(elem);
            } else {
                document.getElementById("field").appendChild(createBox(sudoku[i][j], true, i, j));
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

function keyPress(num) {
    game[target[0]][target[1]] = num;
    display();
}
