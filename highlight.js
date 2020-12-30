/**Код честно позаимствован (с кучей доработок) с http://codepen.io/lonekorean/pen/gaLEMR. Will Boyd, спасибо тебе*/
var isIE;
var highlight, textarea;
function startHighlight(fieldId) {
	textarea = document.getElementById(fieldId);
	highlight = createDiv(fieldId);
	var ua = window.navigator.userAgent.toLowerCase();
	isIE = !!ua.match(/msie|trident\/7|edge/);
	
	textarea.oninput = handleInput;
	textarea.onscroll = handleScroll;
	handleInput();
}

	
function applyhighlight(text) {
	var keyword = /(^|\s|\()(или|и|не|да|нет|нач|кон|нц|кц|алг|ввод|вывод|если|то|иначе|при|пока|все|использовать|для|от|до|шаг)($|\s|\))/g;
	var assgn = /\:\=/g;
	var variable = /(^|\s|\()(цел|вещ|лог|сим|лит|таб|целтаб|вещтаб|логтаб|симтаб|литтаб)($|\s|\))/g;
	var command = /(^|\s|\()(вправо|влево|вверх|вниз|сверху|снизу|слева|справа|свободно|стена|закрасить|клетка|чистая|закрашена)($|\s|\))/g;
	text = text.replace(/\n$/g, '\n\n')
			   .replace(assgn, '<mark style="color:Black;">$&</mark>');
	while (keyword.test(text)) text = text.replace(keyword,'$1<mark style="color:Black;">$2</mark>$3');
	while (variable.test(text)) text = text.replace(variable,'$1<mark style="color:Orange;">$2</mark>$3');
	while (command.test(text)) text = text.replace(command,'$1<mark style="color:Blue;">$2</mark>$3');
	if (isIE) text = text.replace(/ /g, ' <wbr>');
	return text;
}

function handleInput() {
  var text = textarea.value;
  var highlightedText = applyhighlight(text);
  highlight.innerHTML = highlightedText;
}

//функция автоматической прокрутки div контейнера вслед за текстовым полем
function handleScroll() {
  highlight.scrollTop = textarea.scrollTop;
  highlight.scrollLeft = textarea.scrollLeft;
}

function fixFirefox() {
	if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
		return 'top:'+(textarea.offsetTop-1)+'px;left:'+(textarea.offsetLeft-1)+'px'+';height:'+(parseInt( getStyle(textarea,'height') )-8)+'px'
	else 
		return 'top:'+textarea.offsetTop+'px;left:'+textarea.offsetLeft+'px'+';height:'+getStyle(textarea,'height')
}

function createDiv(fieldId) {
	//Создаётся div, по стилю дублирующий текстовое поле, но расположенный над ним
	//Также у тегов mark убирается фон.
	
	var div = document.createElement('div');
	div.id = fieldId+'HighlightDiv';
	
	var sheet = document.createElement('style');
	sheet.innerHTML += '#'+ fieldId+'HighlightDiv mark {background-color:transparent}';
	sheet.innerHTML += '#'+ fieldId+'HighlightDiv{width:'+getStyle(textarea,'width')+';box-sizing:border-box;position:absolute;'+fixFirefox()+';font-family:'+getStyle(textarea,'font-family')+';font-size:'+getStyle(textarea,'font-size')+';padding-top:'+getStyle(textarea,'padding-top')+';padding-right:'+getStyle(textarea,'padding-right')+';padding-bottom:'+getStyle(textarea,'padding-bottom')+';padding-left:'+getStyle(textarea,'padding-left')+';white-space:pre-wrap;color:transparent;overflow:hidden;background-color:transparent;pointer-events:none;border:'+getStyle(textarea,'border-width')+' solid;}'
	document.head.appendChild(sheet);
	return textarea.parentNode.appendChild(div);
}

// http://www.javascriptkit.com/dhtmltutors/dhtmlcascade4.shtml
function getStyle(el, cssprop) {
	if (el.currentStyle) return el.currentStyle[cssprop]; // IE & Opera
	else if (document.defaultView && document.defaultView.getComputedStyle) // Gecko & WebKit
		return document.defaultView.getComputedStyle(el, '')[cssprop];
		else // try and get inline style
			return el.style[cssprop]; // XXX I have no idea who is using that
}

