kumir = {};

//запуск интерпретатора
kumir.start = function(commands) {
	
	//Скрытие текста с кавычками (чтобы он не менялся)
	var substring=commands.match(/'[^']*'|"[^"]*"/g);
	for (i in substring) commands = commands.replace(substring[i],'$_'+i);
	
	commands = ' ' + commands.replace(/\n/g,' \n ') + ' '; //волшебный костыль №1
	
	//Проверка на наличие и парсинг команд для исполнителя Робот
	robot.tick = 0;
	if (robot) commands = robot.parseCommand(commands);

	
	commands = kumir.parseCommand(commands); //трансляция в JavaScript
	
	for (i in substring) commands = commands.replace('$_'+i,substring[i]); //Возврат текста в кавычках
	
	console.log(commands);
	
	/**
	* Данная конструкция отлавливает ошибки,
	* основной catch отлавливает ошибки синтаксиса,
	* catch внутри eval отлавливает остальные ошибки программы
	*/
	try {
		eval('try{'+commands+'}catch(e){if(e=="collision") kumir.error("Столкновение с препятствием!"); else kumir.error("Ошибка в строке "+e.stack.match(/<anonymous>:(\\d+):/)[1]+"!");}');
	}
	catch(e) {kumir.error('Ошибка синтаксиса!');}
}

//Парсинг команд
kumir.parseCommand = function(commands) {

	var jsCommand ='';
	
	//Парсинг основных команд
	commands.split('\n').forEach(function(command) {
		if(/\sалг\s/.test(command)) command = kumir.parseFunction(command); //замена объявления функции
		command = command.replace(/\sвывод(.+)/g,' kumir.print( $1 );') //замена команды вывода
		.replace(/\sввод(.+)/g,' [$1]:=kumir.read([$1])') //замена команды ввода
		.replace(/\[\d+\:\d+\]/g,':=[]') //заменяем обозначения границ массивов
		.replace(/\sзнач\s+\:=/g,'return ') //замена возвращаемого значения функции
		.replace(/\s(?:лог|лит|сим|цел|вещ)\s(.+)/g,' var $1;') //замена объявления переменных
		.replace(/([^:><])=/g,'$1==') //замена знака сравнения
		.replace(/(.+)\:\=(.+)/g,'$1=$2;') //замена знака присвоения
		.replace(/\sда\s/g,'true') //замена истины
		.replace(/\sнет\s/g,'false') //замена лжи
		.replace(/(.+)<>(.+)/g,'$1!=$2') //замена знака неравенства
		.replace(/\sне\s*\(/g,' !(') // замена НЕ со скобкой
		.replace(/\sне\s((?:.(?!\sи\s|\sили\s|\sто\s|\)))+.)/g,' !( $1 )') //замена НЕ без скобок
		.replace(/\sи\s/g,' && ') //замена логического И
		.replace(/\sили\s/g,' || ') //замена логического ИЛИ
		.replace(/\sесли\s/g,' if( ') //замена начала условия
		.replace(/\sто\s/g,' ){ ') //замена начала команд условия
		.replace(/\sиначе\s/g,' }else{ ') //замена начала альтернативных команд
		.replace(/\sвсе\s/g,' } ') //замена конца условия
		.replace(/\sнц\s+для\s(.+)\sот\s(.+)\sдо\s(.+)\sшаг\s(.+)/g,'for($1=$2;($2<$3&&$1<=$3)||($2>=$3&&$1>=$3);$1+=$4){') //замена цилка for с шагом
		.replace(/\sнц\s+для\s(.+)\sот\s(.+)\sдо\s(.+)/g,'for($1=$2;$1<=$3;$1++){') //замена цикла for без шага
		.replace(/\sнц\s+пока\s+(.+)/g,' while( $1 ){') //замена начала цикла while
		.replace(/\sкц\s+при\s+(.+)\s/g,'}while( $1 )') //замена конца цикла do..while
		.replace(/\sкц\s/g,' } ') //замена конца цикла while или for
		.replace(/\sнц\s/g, ' do { ') //замена начала цикла do..while
		.replace(/\sнач\s/g,' { ') //замена начала функции
		.replace(/\sкон\s/g,' } '); //замена конца функции
		
		jsCommand+=command+'\n';
	});
	return jsCommand;
}

//Парсинг объявления функций
kumir.parseFunction = function(command) {
	return command.replace(/алг\s+$/g,'')
				.replace(/алг\s(.+\()/g,'function $1')
				.replace(/\s*(?:цел|вещ|лог|сим|лит)(?:\s*таб|\s)/g,' ')
}

//вывод сообщений
kumir.print = function() {
	var message = '';
	for (i in arguments) message+=arguments[i];
	var event = new CustomEvent('print',{detail:message});
	document.dispatchEvent(event);
}

//вывод ошибок
kumir.error = function(errorMsg) {
	var event = new CustomEvent('error',{detail:errorMsg});
	document.dispatchEvent(event);
}

//ввод переменных
kumir.read = function(args) {
	var s = prompt('Введите переменные через пробел');
	s = s.split(' ');
	for(i in args) isNaN(s[i]) ? args[i] = s[i] : args[i] = +s[i];
	return args;
}