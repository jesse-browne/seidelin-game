describe('Screen.Game', function() {
    var firstRun = jewel.screens['game-screen'].firstRun;
	
    it('has a first run boolean which should start as true, helps take care of some setup', function() {
    	expect(firstRun).toBe(true);
    }); 
});


