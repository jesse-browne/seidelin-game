/**
 * Module for High Score screen
 */

jewel.screens['hiscore'] = (function() {
	var dom = jewel.dom,
	    $ = dom.$,
	    game = jewel.game,
	    storage = jewel.storage,
	    numScores = 10,
	    firstRun = true;
	
	function setup() {
		var backButton = $('#hiscore footer button[name=back]')[0];
		dom.bind(backButton, 'click', function(e) {
			game.showScreen('main-menu');
		});
	}
	
	function run(score) {
		if (firstRun) {
			setup();
			firstRun = false;
		}
		populateList();
		if (typeof score != 'undefined') {
			enterScore(score);
		}
	}
	
	function populateList() {
		var scores = getScores(),
		    list = $('#hiscore ol.score-list')[0],
		    item,
		    nameEl,
		    scoreEl,
		    i;
		
		for (var i = scores.length; i < numScores; i++) {
			scores.push({
				name : '---',
			    score : 0
			});
		}
		
		list.innerHTML = '';
		
		for (i = 0; i < scores.length; i++) {
			item = document.createElement('li');
			
			nameEl = document.createElement('span');
			nameEl.innerHTML = scores[i].name;
			
			scoreEl = document.createElement('span');
			scoreEl.innerHTML = scores[i].score;
			
			item.appendChild(nameEl);
			item.appendChild(scoreEl);
			list.appendChild(item);
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
				name = prompt('Please enter your name:');
				entry = {
					name : name,
					score : score
				};
				scores.splice(i , 0, entry);
				storage.set('hiscore', scores.slice(0, numScores));
				populateList();
				return;
			}
		}
		
	}
	
	return {
		run : run
	};
	
})();