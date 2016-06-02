robot={}
robot.x = 0;
robot.y = 0;
robot.board = {}
robot.board.width = 10;
robot.board.height = 10;
robot.board.size = 50
robot.board.create = function(container) {
	var s = robot.board.size;
	for (var i=0 ;i<robot.board.height;i++) {
		for (var j=0; j<robot.board.width;j++) {
			var cell = document.createElement('div');
			cell.className = 'cells';
			cell.id = 'cell'+i+'_'+j;
			cell.style='width:'+s+'px; height:'+s+'px; position:absolute; top:'+s*i+'px; left:'+s*j+'px;'
			container.appendChild(cell);
		}
	}
	robot.setRobot(robot.x, robot.y);
}
robot.setRobot = function(x,y) {
	document.getElementById('cell'+y+'_'+x).classList.add('robot');
}
robot.removeRobot = function(x,y) {
	document.getElementById('cell'+y+'_'+x).classList.remove('robot');
}
robot.right = function() {
	robot.removeRobot(robot.x,robot.y);
	robot.x = robot.x+1;
	robot.setRobot(robot.x,robot.y);
}
robot.left = function() {
	robot.removeRobot(robot.x,robot.y);
	robot.x = robot.x-1;
	robot.setRobot(robot.x,robot.y);
}
robot.up = function() {
	robot.removeRobot(robot.x,robot.y);
	robot.y = robot.y-1;
	robot.setRobot(robot.x,robot.y);
}
robot.down = function() {
	robot.removeRobot(robot.x,robot.y);
	robot.y = robot.y+1;
	robot.setRobot(robot.x,robot.y);
}
robot.parseCommand = function(command) {
	command = command.replace(/\s(влево|вправо|вверх|вниз)\s/g,'  $1  '); //волшебный костыль №3
	command = command.replace(/\sвправо\s/g,' robot.right(); ');
	command = command.replace(/\sвлево\s/g,' robot.left(); ');
	command = command.replace(/\sвверх\s/g,' robot.up(); ');
	command = command.replace(/\sвниз\s/g,' robot.down(); ');
	return command;
}