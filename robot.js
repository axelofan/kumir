const robot = {}
//стартовые настройки
robot.x = 0;
robot.y = 0;
robot.img = new Image();
robot.canvas = document.createElement('canvas');
robot.HCELLS = 13;
robot.VCELLS = 13;
robot.CELL_SIZE = 80;
robot.WALL_SIZE = 10;
robot.cells = {};
robot.walls = {};
robot.startPos = {'x': 0, 'y': 0};

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.top = (robot.CELL_SIZE + robot.WALL_SIZE) * y + robot.WALL_SIZE;
        this.left = (robot.CELL_SIZE + robot.WALL_SIZE) * x + robot.WALL_SIZE;
        this.isFill = false;
        this.isFail = false;
    }
}

class Wall {
    constructor(x, y, isVertical) {
        this.x = x;
        this.y = y;
        this.top = (robot.CELL_SIZE + robot.WALL_SIZE) * y;
        this.left = (robot.CELL_SIZE + robot.WALL_SIZE) * x;
        this.width = (isVertical) ? robot.WALL_SIZE : robot.CELL_SIZE + robot.WALL_SIZE;
        this.height = (isVertical) ? robot.CELL_SIZE + robot.WALL_SIZE : robot.WALL_SIZE;
        this.isActive = false;
        this.isHover = false;
    }
}

robot.create = function (container) {

    if(container.offsetWidth<500) robot.WALL_SIZE=20

    let a = (container.offsetHeight - robot.WALL_SIZE) / (robot.WALL_SIZE + robot.CELL_SIZE) >> 0
    let b = (container.offsetWidth - robot.WALL_SIZE) / (robot.WALL_SIZE + robot.CELL_SIZE) >> 0

    robot.HCELLS=b
    robot.VCELLS=a

    for (let i = 0; i <= robot.VCELLS; i++) {
        for (let j = 0; j <= robot.HCELLS; j++) {
            robot.cells[i + '_' + j] = new Cell(j, i);
            robot.walls['v' + i + '_' + j] = new Wall(j, i, true);
            robot.walls['h' + i + '_' + j] = new Wall(j, i, false);
        }
    }
    robot.canvas.width = (robot.CELL_SIZE + robot.WALL_SIZE) * robot.HCELLS + robot.WALL_SIZE;
    robot.canvas.height = (robot.CELL_SIZE + robot.WALL_SIZE) * robot.VCELLS + robot.WALL_SIZE;
    container.appendChild(robot.canvas);

    robot.img.src = 'robot.png';
    robot.img.onload = function () {
        robot.draw();
    }
}

robot.drawQueue = [];
setInterval(function() {
    if (robot.drawQueue.length>0) {
        let ctx = robot.canvas.getContext('2d');
        ctx.drawImage(robot.drawQueue[0],0,0);
        robot.drawQueue.shift();  
    }
},50);

robot.draw = function (move) {

    let ctx = null
    let canvas = null
    
    if(move) {
        canvas = document.createElement('canvas');
        canvas.width = (robot.CELL_SIZE + robot.WALL_SIZE) * robot.HCELLS + robot.WALL_SIZE;
        canvas.height = (robot.CELL_SIZE + robot.WALL_SIZE) * robot.VCELLS + robot.WALL_SIZE;
        ctx = canvas.getContext('2d');
    }
    else ctx = robot.canvas.getContext('2d');


    let robotCell = robot.cells[robot.y + '_' + robot.x];

    for (let i in robot.cells) {
        let cell = robot.cells[i];
        ctx.fillStyle = (cell.isFail) ? '#F44336' : (cell.isFill) ? '#9E9E9E' : '#8BC34A';
        ctx.fillRect(cell.left, cell.top, robot.CELL_SIZE, robot.CELL_SIZE);
    }

    ctx.drawImage(robot.img, robotCell.left, robotCell.top, robot.CELL_SIZE, robot.CELL_SIZE);

    for (let i in robot.walls) {
        let wall = robot.walls[i];
        ctx.fillStyle = (wall.isActive || wall.isHover) ? '#FFD54F' : '#4CAF50';
        ctx.fillRect(wall.left, wall.top, wall.width, wall.height);
    }

    if(move) robot.drawQueue.push(canvas);
}

robot.canvas.onclick = function (e) {
    for (let i in robot.walls) {
        let wall = robot.walls[i];
        let x = e.offsetX - wall.left;
        let y = e.offsetY - wall.top;
        if ((x > 0) && (x < wall.width) && (y > 0) && (y < wall.height)) wall.isActive = !wall.isActive;
    }

    for (let i in robot.cells) {
        let cell = robot.cells[i];
        let x = e.offsetX - cell.left;
        let y = e.offsetY - cell.top;
        if ((x > 0) && (x < robot.CELL_SIZE) && (y > 0) && (y < robot.CELL_SIZE)) cell.isFill = !cell.isFill;
    }
    robot.draw();
}

/*robot.canvas.onmousemove = function (e) {
    for (let i in robot.walls) {
        let wall = robot.walls[i];
        let x = e.offsetX - wall.left;
        let y = e.offsetY - wall.top;
        wall.isHover = ((x > 0) && (x < wall.width) && (y > 0) && (y < wall.height)) ? true : false;
    }

    robot.draw();
}*/

robot.canvas.ondblclick = function (e) {
    for (let i in robot.cells) {
        let cell = robot.cells[i];
        let x = e.offsetX - cell.left;
        let y = e.offsetY - cell.top;
        if ((x > 0) && (x < robot.CELL_SIZE) && (y > 0) && (y < robot.CELL_SIZE)) {
            robot.startPos = {'x': cell.x, 'y': cell.y};
            robot.setPosition(cell.x, cell.y);
        }
    }
}

robot.moveRobot = function (x, y) {
    robot.x += x;
    robot.y += y;
    robot.draw(true);
}

robot.setPosition = function (x, y) {
    robot.x = x;
    robot.y = y;
    robot.draw();
};

robot.paint = function () {
    robot.cells[robot.y + '_' + robot.x].isFill = true;
    robot.draw(true);

}

//функции проверки на закрашенность и наличие стен
robot.isFill = function (fill) {
    return robot.cells[robot.y + '_' + robot.x].isFill == fill;
}
robot.onRight = function (wall) {
    return !((robot.walls['v' + robot.y + '_' + (robot.x + 1)].isActive || (robot.x == robot.HCELLS - 1)) == wall);
}
robot.onLeft = function (wall) {
    return !((robot.walls['v' + robot.y + '_' + robot.x].isActive || (robot.x == 0)) == wall);
}
robot.onTop = function (wall) {
    return !((robot.walls['h' + robot.y + '_' + robot.x].isActive || (robot.y == 0)) == wall);
}
robot.onBottom = function (wall) {
    return !((robot.walls['h' + (robot.y + 1) + '_' + robot.x].isActive || (robot.y == robot.VCELLS - 1)) == wall);
}

//функции движения
robot.right = function () {
    if (robot.onRight(true)) robot.moveRobot(1, 0);
    else robot.fail();
}
robot.left = function () {
    if (robot.onLeft(true)) robot.moveRobot(-1, 0);
    else robot.fail();
}
robot.up = function () {
    if (robot.onTop(true)) robot.moveRobot(0, -1);
    else robot.fail();
}
robot.down = function () {
    if (robot.onBottom(true)) robot.moveRobot(0, 1);
    else robot.fail();
}

//Функция, срабатывающая при столкновении
robot.fail = function () {
    robot.cells[robot.y + '_' + robot.x].isFail = true;
    robot.draw(true);
    throw 'collision';
}

//Очистка поля
robot.clean = function () {
    for (let i in robot.cells) {
        robot.cells[i].isFill = false;
        robot.cells[i].isFail = false;
    }
    robot.draw();
}

//Парсинг команд Робота
robot.parseCommand = function (commands) {
    robot.clean();
    robot.x = robot.startPos.x;
    robot.y = robot.startPos.y;
    robot.moveRobot(0,0);
    let jsCommand = '';
    if (/\sиспользовать\s+Робот\s/.test(commands)) {
        commands = commands.replace(/\sиспользовать\s+Робот\s/g, '');
        commands.split('\n').forEach(function (command) {
            //парсинг команд движения и закрашивания
            command = command.replace(/\sвправо\s/g, ' robot.right(); ');
            command = command.replace(/\sвлево\s/g, ' robot.left(); ');
            command = command.replace(/\sвверх\s/g, ' robot.up(); ');
            command = command.replace(/\sвниз\s/g, ' robot.down(); ');
            command = command.replace(/\sзакрасить\s/g, ' robot.paint(); ');

            //Парсинг условий на наличе стен и закрашенность клетки
            command = command.replace(/\s(справа|слева|сверху|снизу)\s+(свободно|стена)/g, ' $1 ( $2 )');
            command = command.replace(/\s(справа|слева|сверху|снизу)\s+не\s+(свободно|стена)/g, ' $1 (! $2 )');
            command = command.replace(/\s(клетка)\s+(закрашена|чистая)/g, ' $1 ( $2 )');
            command = command.replace(/\s(клетка)\s+не\s+(закрашена|чистая)/g, ' $1 (! $2 )');
            command = command.replace(/\s(стена|чистая)\s/g, 'false');
            command = command.replace(/\s(свободно|закрашена)\s/g, 'true');
            command = command.replace(/\sклетка\s/g, ' robot.isFill');
            command = command.replace(/\sсправа\s/g, ' robot.onRight');
            command = command.replace(/\sслева\s/g, ' robot.onLeft');
            command = command.replace(/\sсверху\s/g, ' robot.onTop');
            command = command.replace(/\sснизу\s/g, ' robot.onBottom');

            jsCommand += command + '\n';
        });
        commands = jsCommand;
    }
    return commands;
}