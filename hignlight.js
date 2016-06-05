/**Код честно позаимствован (с кучей доработок) с Codepen. Безымянный автор, спасибо тебе*/
var isIE,isWinPhone,isIOS;
var highlight, textarea;
function startHighlight(h,t) {
	highlight = h;
	textarea = t;
	var ua = window.navigator.userAgent.toLowerCase();
	isIE = !!ua.match(/msie|trident\/7|edge/);
	isWinPhone = ua.indexOf('windows phone') !== -1;
	isIOS = !isWinPhone && !!ua.match(/ipad|iphone|ipod/);
	
	textarea.oninput = function(){handleInput();}
	if (isIOS) fixIOS();
	handleInput();
}

	
function applyhighlight(text) {
  text = text
    .replace(/\n$/g, '\n\n')
    .replace(/нач|кон|нц|кц|алг|ввод|вывод|если|то|иначе|при|пока|все|использовать/g, '<mark class="keyword">$&</mark>')
	.replace(/\s(и|или|не|да|нет)\s/g, ' <mark class="keyword">$1</mark> ')
	.replace(/цел|вещ|лог|сим|лит/g, '<mark class="variable">$&</mark>')
	.replace(/вправо|влево|вверх|вниз|сверху|снизу|слева|справа|свободно|стена|закрасить/g,'<mark class="exec">$&</mark>');
  
  if (isIE) text = text.replace(/ /g, ' <wbr>');
  return text;
}

function handleInput() {
  var text = textarea.value;
  var highlightedText = applyhighlight(text);
  highlight.innerHTML = highlightedText;
}

function fixIOS() {
  highlight.style='padding-left:13px; padding-right:13px';
}