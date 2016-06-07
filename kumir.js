kumir = {};

//запуск интерпретатора
kumir.start = function(commands) {
	kumir.print = '';
	kumir.error = '';
	
	//Скрытие текста с кавычками (чтобы он не менялся)
	var substring=commands.match(/'[^']*'|"[^"]*"/g);
	for (i in substring) commands = commands.replace(substring[i],'$_'+i);
	
	commands = ' ' + commands.replace(/\n/g,' \n ') + ' '; //волшебный костыль №1
	
	//Проверка на наличие и парсинг команд для исполнителя Робот
	if (/\sиспользовать\s+Робот\s/.test(commands) && robot) {
		commands = commands.replace(/\sиспользовать\s+Робот\s/g,'');
		commands = robot.parseCommand(commands);
	}
	
	commands = kumir.parseCommand(commands); //трансляция в JavaScript
	
	for (i in substring) commands = commands.replace('$_'+i,substring[i]); //Возврат текста в кавычках
	
	console.log(commands);
	
	/**Данная конструкция отлавливает ошибки,
		основной catch отлавливает ошибки синтаксиса,
		catch внутри eval отлавливает остальные ошибки программы*/
	try {
		eval('try{'+commands+'}catch(e){if(e=="collision") kumir.error+="Столкновение с препятствием!"; else kumir.error+="Ошибка в строке "+e.stack.match(/<anonymous>:(\\d+):/)[1]+"!";}');
	}
	catch(e) {kumir.error+='Ошибка синтаксиса!';}
	
	return {'print':kumir.print, 'error':kumir.error};
}

//Парсинг команд
kumir.parseCommand = function(commands) {

	var jsCommand ='';
	
	//Парсинг основных команд
	commands.split('\n').forEach(function(command) {
		command = command.replace(/\sвывод\s(.+)/g,' kumir.print+:=[$1].join("")'); //замена команды вывода
		command = command.replace(/\sввод\s(.+)/g,' [$1]:=kumir.read([$1])'); //замена команды ввода
	
		command = command.replace(/\s(?:лог|лит|сим|цел|вещ)\s(.+)/g,' var $1;'); //замена объявления переменных
		
		command = command.replace(/([^:><])=/g,'$1=='); //замена знака сравнения
		command = command.replace(/(.+)\:\=(.+)/g,'$1=$2;'); //замена знака присвоения
		command = command.replace(/\sда\s/g,'true'); //замена истины
		command = command.replace(/\sнет\s/g,'false'); //замена лжи
		command = command.replace(/(.+)<>(.+)/g,'$1!=$2'); //замена знака неравенства
		command = command.replace(/\sне\s*\(/g,' !('); // замена НЕ со скобкой
		command = command.replace(/\sне\s((?:.(?!\sи\s|\sили\s|\sто\s|\)))+.)/g,' !( $1 )'); //замена НЕ без скобок
		command = command.replace(/\sи\s/g,' && '); //замена логического И
		command = command.replace(/\sили\s/g,' || '); //замена логического ИЛИ
	
		command = command.replace(/\sесли\s/g,' if( '); //замена начала условия
		command = command.replace(/\sто\s/g,' ){ '); //замена начала команд условия
		command = command.replace(/\sиначе\s/g,' }else{ '); //замена начала альтернативных команд
		command = command.replace(/\sвсе\s/g,' } '); //замена конца условия
	
		command = command.replace(/\sнц\s+пока\s+(.+)/g,' while( $1 ){'); //замена начала цикла while
		command = command.replace(/\sкц\s+при\s+(.+)\s/g,'}while( $1 )'); //замена конца цикла do..while
	
		command = command.replace(/\sкц\s/g,' } ') //замена конца цикла while
		command = command.replace(/\sнц\s/g, ' do { '); //замена начала цикла do..while
	
	
		command = command.replace(/\sалг\s/g,' ');
		command = command.replace(/\sнач\s/g,' { '); //замена начала функции
		command = command.replace(/\sкон\s/g,' } '); //замена конца функции
		
		jsCommand+=command+'\n';
	});
	
	return jsCommand;
}

//ввод переменных
kumir.read = function(args) {
	var s = prompt('Введите переменные через пробел');
	s = s.split(' ');
	for(i in args) isNaN(s[i]) ? args[i] = s[i] : args[i] = +s[i];
	return args;
}