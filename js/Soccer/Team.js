class Team
{
	constructor({ color, players, strategy, isMirrored })
	{
		this.color = color;
		this.players = players;
		this.score = 0;
		this.strategy = strategy;
		this.isMirrored = isMirrored;
		
		for(let i=0;i<this.players.length;i++)
		{
			this.players[i].team = this;
			this.players[i].strategy = this.strategy;
			this.players[i].color = this.color;
			this.players[i].isMirrored = this.isMirrored;
		}
	}
}