class SoccerChessGame extends SoccerGame
{
	static game = CodeCollision.RegisterGameLoaded({ label: 'Soccer Chess', gameType: this, baseStrategy: SoccerStrategy, playerType: SoccerChessPlayer, teamType: SoccerTeam }); //REQUIRED
	
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

