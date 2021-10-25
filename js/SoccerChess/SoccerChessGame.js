class SoccerChessGame extends SoccerGame
{
	static game = CodeCollision.RegisterGameLoaded({ label: 'Soccer Chess', gameType: this, baseStrategy: SoccerStrategy, playerType: SoccerChessPlayer }); //REQUIRED
	
	playerRadius = 20;
	ballRadius = 10;
	netWidth = 20;
	netHeight = 200;
	fieldColor = "#70C1B3";
	maxScore = 3;
	scoreMarkerRadius = 15;
	currentTeamTurn = false;
	
	constructor(params) 
	{
		super(params);
		this.currentTeamTurn = false;
	}
	
	nextMove()
	{
		if(!this.isReady) { return; }
		this.currentTeamTurn = !this.currentTeamTurn || this.currentTeamTurn==this.awayTeam? this.homeTeam : this.awayTeam;
		super.nextMove();
	}
}

