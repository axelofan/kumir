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

robot.right = function() {
	robot.moveRobot(robot.x+1,robot.y);
}
robot.left = function() {
	robot.moveRobot(robot.x-1,robot.y);
}
robot.up = function() {
	robot.moveRobot(robot.x,robot.y-1);
}
robot.down = function() {
	robot.moveRobot(robot.x,robot.y+1);
}

robot.onRight = function(wall) {
	return !(document.getElementById('v_'+(robot.x+1)+'_'+robot.y).classList.contains('active') == wall)
}
robot.onLeft = function(wall) {
	return !(document.getElementById('v_'+robot.x+'_'+robot.y).classList.contains('active') == wall)
}
robot.onTop = function(wall) {
	return !(document.getElementById('h_'+robot.x+'_'+robot.y).classList.contains('active') == wall)
}
robot.onBottom = function(wall) {
	return !(document.getElementById('h_'+robot.x+'_'+(robot.y+1)).classList.contains('active') == wall)
}
robot.parseCommand = function(command) {
	command = command.replace(/\s(влево|вправо|вверх|вниз)\s/g,'  $1  '); //волшебный костыль №3
	command = command.replace(/\sвправо\s/g,' robot.right(); ');
	command = command.replace(/\sвлево\s/g,' robot.left(); ');
	command = command.replace(/\sвверх\s/g,' robot.up(); ');
	command = command.replace(/\sвниз\s/g,' robot.down(); ');
	return command;
}