class SoccerSMLGame extends SoccerGame
{
	static game = CodeCollision.RegisterGameLoaded({ label: 'Soccer SML', gameType: this, baseStrategy: SoccerSMLStrategy, playerType: SoccerSMLPlayer, teamType: SoccerTeam }); //REQUIRED
	
	constructor(params) 
	{
		super(params);
		
		for(let i=0;i<this.players.length;i++)
		{
			this.players[i].setDirection();
			if (this.players[i].strategyImplementation && this.players[i].strategyImplementation.size)
			{
				this.players[i].radius = this.players[i].strategyImplementation.size;
			}
		}
		this.redraw();
	}
}

