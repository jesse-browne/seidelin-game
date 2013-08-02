/**
 * Module uses localStorage to preserve High Score data 
 */

jewel.storage = (function() {
	var db = window.localStorage;
	
	function set(key, value) {
		value = JSON.stringify(value);
		db.setItem(key, value);
	}
	
	function get(key) {
		var value = db.getItem(key);
		try {
			return JSON.parse(value);
		} catch(e) {
			return;
		}
	}
	
	function getScores() {
		return storage.get('hiscore') || [];
	}
	
	function enterScore(score) {
		var scores = getScores(),
		    name,
		    i,
		    entry;
		
		for (i = 0; i <= scores.length; i++) {
			if (i == scores.length || score > scores[i].score) {
				name = prompt('Please enter your name:')
				entry = {
					name : name,
					score : score
				};
				scores.splice(i, 0, entry);
				storage.set('hiscore', scores.slice(0, numScores));
				populateList();
				return;
			}
		}
	}
	
	return {
		 set : set,
		 get : get
	 };

})();