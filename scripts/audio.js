/**
 * Manage HTML5 audio 
 */

jewel.audio = (function() {
	
	var extensions,
	    sounds;
	
	function initialize() {
		extension = formatTest();
	
		if (!extension) {
			return;
		}
		
		sounds = {};
	}
	
	function createAudio(name) {
		var el = new Audio('sounds/' + name + '.' + extension);

		sounds[name] = sounds[name] || [];
		sounds[name].push(el);

		return el;
	}
	
	function formatTest() {
		var exts = ['ogg', 'mp3'],
		    i;
		for (i = 0; i < exts.length; i++) {
			if (Modernizr.audio[exts[i]] == 'probably') {
				return exts[i];
			}
		}
		for (i = 0; i < exts.length; i++) {
			if (Modernizr.audio[exts[i]] == 'maybe') {
				return exts[i];
			}
		}		
	}
	
	return {
		initialize : initialize
	};
	
})();