kumir = {};

//запуск интерпретатора
kumir.start = function(input, output) {
	kumir.input = input;
	kumir.output = output;
	kumir.output.innerHTML='';
	kumir.variables={};
	
	kumir.parseCommand(input.value.split('\n'));
}

//Парсинг команд
kumir.parseCommand = function(strings) {
	var nesting = 0;
	var string = '';
	strings.forEach(function(item) {
		item.trim();
		if(/если/.test(item)) nesting++;
		if(/нц/.test(item)) nesting++;
		if(nesting>0) {
			string+=item+'\n';
			if(/все/.test(item)) {
				nesting--
				if(nesting == 0) {
					string = string.replace(/то/g,'\nто\n');
					string = string.replace(/иначе/g,'\nиначе\n');
					string = string.replace(/все/g,'\nвсе\n');
					kumir.runCondition(string);
					string='';
				}
			}
			if(/кц/.test(item)) {
				nesting--;
				if(nesting == 0) {
					kumir.runCycle(string);
					string='';
				}
			}
		}
		else {
			if(/вывод/.test(item)) kumir.print(item);
			if(/цел|вещ|лог|сим|лит/.test(item)) kumir.addVariable(item);
			if(/\:\=/.test(item)) kumir.setVariable(item);
		}
		
	});
}

//создание переменных
kumir.addVariable = function(string) {
	var startValue;
	if(/цел/.test(string)) startValue=0;
	if(/вещ/.test(string)) startValue=0.0;
	if(/лог/.test(string)) startValue=false;
	if(/сим/.test(string)) startValue='';
	if(/лит/.test(string)) startValue='';
	string = string.replace(/\s*цел\s*|\s*вещ\s*|\s*лог\s*|\s*сим\s*|\s*лит\s*/,'');
	string.split(/\s*,\s*/).forEach(function(item) {
		kumir.variables[item]=startValue;
	});
}

//присвоение переменных
kumir.setVariable = function(string) {
	string = string.split(/\s*\:\=\s*/);
	var name = string[0];
	var value = string[1];
	if (typeof(kumir.variables[name])!='undefined') {
		if(/[+*-/()]/.test(value)) kumir.variables[name]= kumir.calculateValue(value);
		else {
			if(typeof(kumir.variables[name])=='number') kumir.variables[name]= Number(value);
			if(typeof(kumir.variables[name])=='string') kumir.variables[name]= value.substr(1,value.length-2);
			if(typeof(kumir.variables[name])=='boolean') {
				if (value == 'да') kumir.variables[name]= true;
				if (value == 'нет') kumir.variables[name]= false;
			}
		}
	}
}

//вычисления с переменными
//TODO: добавить поддержку сложных математических операций
kumir.calculateValue = function(string) {
	for (var index in kumir.variables) {
		string = string.replace(new RegExp(index,'g'), kumir.variables[index]);
	}
	string = string.replace(/=/g,'==');
	string = string.replace(/<>/g,'!=');
	string = string.replace(/или/g,'||');
	string = string.replace(/и/g,'&&');
	string = string.replace(/не\s*\(/g,'!(');
	string = string.replace(/\s/g,'');
	string = string.replace(/true/g,'1');
	string = string.replace(/false/g,'0');
	string = string.replace(/не([0-9.>()<=]+)/g,'!($1)');
	return eval(string);
}

//вывод сообщений на экран
kumir.print = function(string) {
	string = string.replace(/\s*вывод\s*/,'');
	string.split(/\s*,\s*/).forEach(function(item) {
		if (/'.*'|".*"/.test(item)) {
			kumir.output.innerHTML+=item.substr(1,item.length-2);
		}
		else if(/[0-9+*-/()]/.test(item)) kumir.output.innerHTML+= kumir.calculateValue(item);
		else if (typeof(kumir.variables[item])!='undefined') kumir.output.innerHTML+= kumir.variables[item];
	});
	kumir.output.innerHTML+='<br>';
}

//Работа с циклом
kumir.runCycle = function(string) {
	var condition='';
	var nesting=0;
	var command=[]
	string.split('\n').forEach(function(item) {
		if(/нц\s*пока/.test(item) && (nesting==0)) {
			nesting++;
			condition = item.replace(/нц\s*пока/,'');
			item='';
		}
		if(/нц/.test(item)) nesting++;
		if(/кц/.test(item)) nesting--;
		if(nesting>0) command.push(item);
	});
	while(kumir.calculateValue(condition)) kumir.parseCommand(command);
}

//работа с условием
kumir.runCondition = function(string) {
	var isPro = false, isContra = false;
	var nesting = 0;
	var condition=false;
	var pro=[];
	var contra=[];
	string.split('\n').forEach(function(item) {	
		if(/если/.test(item) && (nesting==0)) {
			item = item.replace(/если/,'');
			condition = kumir.calculateValue(item);
		}
		if(/то/.test(item)) nesting++;
		if(/все/.test(item)) nesting--;
		if(/то/.test(item) && (nesting==1)) {isPro = true; isContra=false;}
		else if(/иначе/.test(item) && (nesting == 1)) {isPro=false; isContra=true;}
		else if(/все/.test(item) && (nesting==0)) {isPro=false; isContra=false;}
		else if(isPro) pro.push(item);
		else if(isContra) contra.push(item);
	});
	if (condition) kumir.parseCommand(pro);
	else kumir.parseCommand(contra);
}