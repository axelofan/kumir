robot={}
robot.x = 0;
robot.y = 0;
robot.board = {}
robot.board.width = 10;
robot.board.height = 10;
robot.board.cellSize = 50;
robot.board.wallSize = 3;
robot.board.create = function(container) {
	var s = robot.board.cellSize;
	var w = robot.board.wallSize;
	
	var sheet = document.createElement('style');
	sheet.innerHTML='.vertical{width:'+w+'px; height:'+(2*w+s)+'px;}.horisontal{width:'+(2*w+s)+'px; height:'+w+'px;}.cells{width:'+s+'px; height:'+s+'px;}';
	container.appendChild(sheet);
	
	for (var i=0 ;i<=robot.board.height;i++) {
		for (var j=0; j<=robot.board.width;j++) {
			if (i!=robot.board.height) {
				var wall = document.createElement('div');
				wall.classList.add('walls','vertical');
				if(j==0 || j==robot.board.width) wall.classList.add('active');
				wall.id = 'v_'+j+'_'+i;
				wall.style = 'position:absolute; top:'+(w+s)*i+'px; left:'+(w+s)*j+'px;';
				container.appendChild(wall);
				wall.onclick = robot.board.setWall(wall);
			}
			
			if (j!=robot.board.width) {
				var wall = document.createElement('div');
				wall.classList.add('walls','horisontal');
				if(i==0 || i==robot.board.height) wall.classList.add('active');
				wall.id = 'h_'+j+'_'+i;
				wall.style = 'position:absolute; top:'+(w+s)*i+'px; left:'+(w+s)*j+'px;';
				container.appendChild(wall);
				wall.onclick = robot.board.setWall(wall);
			}
			
			if(i!=robot.board.height && j!=robot.board.width) {
				var cell = document.createElement('div');
				cell.className = 'cells';
				cell.id = 'c_'+j+'_'+i;
				cell.style= 'position:absolute; top:'+(w+(s+w)*i)+'px; left:'+(w+(s+w)*j)+'px;'
				container.appendChild(cell);
				cell.onclick = robot.replaceRobot(j,i);
			}
		}
	}
	robot.moveRobot(robot.x, robot.y);
}

robot.board.setWall = function(el) {
	return function() {
		el.classList.contains('active') ? el.classList.remove('active') : el.classList.add('active');
	}
}
robot.replaceRobot = function(x,y) {
	return function() {
		robot.moveRobot(x,y);
	}
}
robot.setRobot = function(x,y) {
	document.getElementById('c_'+x+'_'+y).classList.add('robot');
}
robot.removeRobot = function(x,y) {
	document.getElementById('c_'+x+'_'+y).classList.remove('robot');
}
robot.moveRobot = function(x,y) {
	robot.removeRobot(robot.x,robot.y);
	robot.setRobot(x,y);
	robot.x = x;
	robot.y = y;
}

robot.paint = function() {
	document.getElementById('c_'+robot.x+'_'+robot.y).classList.add('fill');
}

robot.right = function() {
	if (robot.onRight(true)) robot.moveRobot(robot.x+1,robot.y);
	else robot.fail();
}
robot.left = function() {
	if (robot.onLeft(true)) robot.moveRobot(robot.x-1,robot.y);
	else robot.fail();
}
robot.up = function() {
	if (robot.onTop(true)) robot.moveRobot(robot.x,robot.y-1);
	else robot.fail();
}
robot.down = function() {
	if (robot.onBottom(true)) robot.moveRobot(robot.x,robot.y+1);
	else robot.fail();
}
robot.isFill = function(fill) {
	return document.getElementById('c_'+robot.x+'_'+robot.y).classList.contains('fill') == fill
}

robot.onRight = function(wall) {
	return !(document.getElementById('v_'+(robot.x+1)+'_'+robot.y).classList.contains('active') == wall);
}
robot.onLeft = function(wall) {
	return !(document.getElementById('v_'+robot.x+'_'+robot.y).classList.contains('active') == wall);
}
robot.onTop = function(wall) {
	return !(document.getElementById('h_'+robot.x+'_'+robot.y).classList.contains('active') == wall);
}
robot.onBottom = function(wall) {
	return !(document.getElementById('h_'+robot.x+'_'+(robot.y+1)).classList.contains('active') == wall);
}
robot.fail = function() {
	document.getElementById('c_'+robot.x+'_'+robot.y).classList.add('fail');
	document.getElementById('c_'+robot.x+'_'+robot.y).classList.remove('fill');
	throw 'collision';
}
robot.parseCommand = function(command) {
	command = command.replace(/\s(влево|вправо|вверх|вниз)\s/g,'  $1  '); //волшебный костыль №4
	command = command.replace(/\sвправо\s/g,' robot.right(); ');
	command = command.replace(/\sвлево\s/g,' robot.left(); ');
	command = command.replace(/\sвверх\s/g,' robot.up(); ');
	command = command.replace(/\sвниз\s/g,' robot.down(); ');
	command = command.replace(/\s(справа|слева|сверху|снизу)\s+(свободно|стена)/g,' $1 ( $2 )');
	command = command.replace(/\s(справа|слева|сверху|снизу)\s+не\s+(свободно|стена)/g,' $1 (! $2 )');
	command = command.replace(/\s(клетка)\s+(закрашена|чистая)/g,' $1 ( $2 )');
	command = command.replace(/\s(клетка)\s+не\s+(закрашена|чистая)/g,' $1 (! $2 )');
	command = command.replace(/\sстена\s/g,'false');
	command = command.replace(/\sсвободно\s/g,'true');
	command = command.replace(/\sчистая\s/g,'false');
	command = command.replace(/\sзакрашена\s/g,'true');
	command = command.replace(/\sклетка\s/g,' robot.isFill ');
	command = command.replace(/\sсправа\s/g,' robot.onRight ');
	command = command.replace(/\sслева\s/g,' robot.onLeft ');
	command = command.replace(/\sсверху\s/g,' robot.onTop ');
	command = command.replace(/\sснизу\s/g,' robot.onBottom ');
	command = command.replace(/\sзакрасить\s/g,' robot.paint(); ');
	return command;
}

robot.clean = function() {
	var fillCell = document.getElementsByClassName('fill');
	var errorCell = document.getElementsByClassName('fail');
	while(fillCell.length!=0) {fillCell[0].classList.remove('fill');}
	while(errorCell.length!=0) {errorCell[0].classList.remove('fail');}
}