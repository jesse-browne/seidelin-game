describe('Screen.Game', function() {
    var firstRun = jewel.screens['game-screen'].firstRun;
	var paused = jewel.screens['game-screen'].paused;
    
    it('has a first run boolean which should start as true, helps take care of some setup', function() {
    	expect(firstRun).toBe(true);
    });
    
    it('has a paused boolean which should start as false', function() {
    	expect(paused).not.toBe(true);
    });
    
});


