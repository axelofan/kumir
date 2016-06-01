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
	
	command = ' ' + command + ' '; //волшебный костыль
	
	command = command.replace(/вывод(.+)/g,'kumir.print($1);'); //замена команды вывода
	
	command = command.replace(/(?:лог|лит|сим|цел|вещ)(.+)/g,'var$1;'); //замена объявления переменных
	command = command.replace(/([^:!><])=/g,'$1=='); //замена знака сравнения
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
	while (/\sвсе\s/.test(command)) command = command.replace(/\sвсе\s/g,' } '); //замена конца условия, через цикл из-за возможного повторения команд друг за другом
	
	command = command.replace(/\sнц\s+пока\s+(.+)/g,'while($1){'); //замена начала цикла while
	while (/\sкц\s/.test(command)) command = command.replace(/\sкц\s/g,' } ') //замена конца цикла, через цикл из-за возможного повторения команд друг за другом
	
	command = command.replace(/\sалг\s/g,' ');
	command = command.replace(/\sнач\s/g,' { '); //замена начала функции
	command = command.replace(/\sкон\s/g,' } '); //замена конца функции
	
	//Возврат текста в кавычках
	for (i in substring) command = command.replace('$_'+i,substring[i]);
	
	console.log(command); //TODO: удалить перед продакшном
	eval(command);
}

//вывод сообщений на экран
kumir.print = function() {
	for(i in arguments) kumir.output.innerHTML+= arguments[i];
}