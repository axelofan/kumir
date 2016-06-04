kumir = {};

//запуск интерпретатора
kumir.start = function(input, output) {
	kumir.input = input;
	kumir.output = output;
	kumir.output.innerHTML='';
	
	kumir.parseCommand(input.value);
}

//Парсинг команд
kumir.parseCommand = function(command) {
	
	//Скрытие текста с кавычками (чтобы он не менялся)
	var substring=command.match(/'[^']*'|"[^"]*"/g);
	for (i in substring) command = command.replace(substring[i],'$_'+i);
	
	command = ' ' + command + ' '; //волшебный костыль №1
	command = command.replace(/\s(все|кц)\s/g,'  $1  '); //волшебный костыль №2
	command = command.replace(/(нц.+|кц.+)/g,'$1\n'); //волшебный костыль №3
	
	//Проверка на наличие и парсинг команд для исполнителя Робот 
	if (/\sиспользовать\s+Робот\s/.test(command)) {
		command = command.replace(/\sиспользовать\s+Робот\s/g,'  ');
		command = robot.parseCommand(command);
	}
	
	command = command.replace(/вывод(.+)/g,'kumir.print($1);'); //замена команды вывода
	command = command.replace(/ввод(.+)/g,'[$1] := kumir.read([$1])'); //замена команды ввода
	
	command = command.replace(/(?:лог|лит|сим|цел|вещ)(.+)/g,'var$1;'); //замена объявления переменных
	command = command.replace(/([^:><])=/g,'$1=='); //замена знака сравнения
	command = command.replace(/(.+)\:\=(.+)/g,'$1 = $2;'); //замена знака присвоения
	command = command.replace(/\sда\s/g,'true'); //замена истины
	command = command.replace(/\sнет\s/g,'false'); //замена лжи
	
	command = command.replace(/(.+)<>(.+)/g,'$1!=$2'); //замена знака неравенства
	command = command.replace(/\sне\s*\(/g,' !('); // замена НЕ со скобкой
	command = command.replace(/\sне\s([^\sи\s|\sили\s|\sто\s|\)]+)/g,' !($1)'); //замена НЕ без скобок
	command = command.replace(/\sи\s/g,'&&'); //замена логического И
	command = command.replace(/\sили\s/g,'||'); //замена логического ИЛИ
	
	command = command.replace(/\sесли\s/g,' if( '); //замена начала условия
	command = command.replace(/\sто\s/g,' ){ '); //замена начала команд условия
	command = command.replace(/\sиначе\s/g,' }else{ '); //замена начала альтернативных команд
	command = command.replace(/\sвсе\s/g,' } '); //замена конца условия
	
	command = command.replace(/\sнц\s+пока\s+(.+)\s/g,' while($1){'); //замена начала цикла while
	command = command.replace(/\sкц\s+при\s+(.+)\s/g,'}while($1)\n'); //замена конца цикла do..while
	
	command = command.replace(/\sкц\s/g,' } ') //замена конца цикла while
	command = command.replace(/\sнц\s/g, ' do { '); //замена начала цикла do..while
	
	
	command = command.replace(/\sалг\s/g,' ');
	command = command.replace(/\sнач\s/g,' { '); //замена начала функции
	command = command.replace(/\sкон\s/g,' } '); //замена конца функции

	for (i in substring) command = command.replace('$_'+i,substring[i]); //Возврат текста в кавычках
	
	console.log(command); //TODO: удалить перед продакшном
	eval(command);
}

//вывод сообщений на экран
kumir.print = function() {
	for(i in arguments) kumir.output.value+= arguments[i];
}

//ввод переменных
kumir.read = function(args) {
	var s = prompt('Введите переменные через пробел');
	s = s.split(' ');
	for(i in args) isNaN(s[i]) ? args[i] = s[i] : args[i] = +s[i];
	return args;
}