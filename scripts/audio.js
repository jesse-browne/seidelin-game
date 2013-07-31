/**
 * Manage HTML5 audio 
 */

jewel.audio = (function() {
	
	var extensions,
	    sounds,
	    activeSounds;
	
	function initialize() {
		extension = formatTest();
	
		if (!extension) {
			return;
		}
		
		sounds = {};
		activeSounds = [];
	}
	
	function play(name) {
		var audio = getAudioElement(name);
		audio.play();
		activeSounds.push(audio);
	}
	
	function createAudio(name) {
		var el = new Audio('sounds/' + name + '.' + extension);

		sounds[name] = sounds[name] || [];
		sounds[name].push(el);

		return el;
	}
	
	function getAudioElement(name) {
		if (sounds[name]) {
			for (var i = 0, n = sounds[name].length; i < n; i++) {
				if (sounds[name][i].ended) {
					return sounds[name][i];
				}
			}
		}
		return createAudio(name);
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
		initialize : initialize,
		play : play
	};
	
})();