/**
 * Module handles user input and translates it game events
 */

jewel.input = (function(){
	var keys = {
			37 : 'KEY_LEFT',
			38 : 'KEY_UP',
			39 : 'KEY_RIGHT',
			40 : 'KEY_DOWN',
			13 : 'KEY_ENTER',
			32 : 'KEY_SPACE',
			65 : 'KEY_A',
			66 : 'KEY_B',
			67 : 'KEY_C',
			68 : 'KEY_D',
			69 : 'KEY_E',
			70 : 'KEY_F',
			71 : 'KEY_G',
			72 : 'KEY_H',
			73 : 'KEY_I',
			74 : 'KEY_J',
			75 : 'KEY_K',
			76 : 'KEY_L',
			77 : 'KEY_M',
			78 : 'KEY_N',
			79 : 'KEY_O',
			80 : 'KEY_P',
			81 : 'KEY_Q',
			82 : 'KEY_R',
			83 : 'KEY_S',
			84 : 'KEY_T',
			85 : 'KEY_U',
			86 : 'KEY_V',
			87 : 'KEY_W',
			88 : 'KEY_X',
			89 : 'KEY_Y',
			90 : 'KEY_Z'
	};
	
	var dom = jewel.dom,
	    $ = dom.$,
	    settings = jewel.settings,
	    inputHandlers;
	
	function initialize() {
		inputHandlers = {};
		var board = $('#game-screen .game-board')[0];
		
		dom.bind(board, 'mousedown', function(event) {
			handleClick(event, 'CLICK', event);
		});
		
		dom.bind(board, 'touchstart', function(event) {
			handleClick(event, 'TOUCH', event.targetTouches[0]);
		});
		
		dom.bind(document, 'keydown', function(event) {
			var keyName = keys[event.keyCode];
			if (keyName && settings.controls[keyName]) {
				event.preventDefault();
				trigger(settings.controls[keyName]);
			}
		});
	}
	
	function bind(action, handler) {
		if (!inputHandlers[action]) {
			inputHandlers[action] = [];
		}
		inputHandlers[action].push(handler);
	}
	
	function trigger(action) {
		var handlers = inputHandlers[action],
		    args = Array.prototype.slice.call(arguments, 1);
		
		if (handlers) {
			for (var i = 0; i < handlers.length; i++) {
				handlers[i].apply(null, args);
			}
		}
	}
	
	function handleClick(event, control, click) {
		var action = settings.controls[control];
		if (!action) {
			return;
		}
		
		var board = $('#game-screen .game-board')[0],
		    rect = board.getBoundingClientRect(),
		    relX,
		    relY,
		    jewelX,
		    jewelY;
		
		// click position relative to board
		relX = click.clientX - rect.left;
		relY = click.clientY - rect.top;

		// jewel coordinates
		jewelX = Math.floor(relX / rect.width * settings.cols);
		jewelY = Math.floor(relY / rect.height * settings.rows);
		
		// trigger functions bound to action
		trigger(action, jewelX, jewelY);
		
		// prevent default click behaviour
		event.preventDefault();
	}
	
	return {
		initialize : initialize,
		bind : bind
	};
	
})();