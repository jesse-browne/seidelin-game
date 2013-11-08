describe('Screen.Game', function() {
    var firstRun = jewel.screens['game-screen'].firstRun;
	var paused = jewel.screens['game-screen'].paused;
    
    it('firstRun initialized as true, helps take care of some setup', function() {
    	expect(firstRun).toBe(true);
    });
    
    it('paused state initialized as false', function() {
    	expect(paused).not.toBe(true);
    });
    
});


