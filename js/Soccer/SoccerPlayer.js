class SoccerPlayer extends Player
{
	maxpower=10;
	radius=20;
		
	constructor(params)
	{
		super(params);
		this.id = params.id;
		this.strategy = params.strategy;
	}
	
	setDirection()
	{
		if (this.strategy===undefined)
		{
			return { x:this.x, vx:0, y:this.y, vy:0 };
		}
		
		var teamMates = [];
		var otherTeam = [];
		for(let i=0;i<this.game.players.length;i++)
		{
			if (this.game.players[i]==this)
			{
				continue;
			}
			
			if (this.game.players[i].team == this.team)
			{
				teamMates.push(this.getVectorToPoint(this.game.players[i]));
			}
			else 
			{
				otherTeam.push(this.getVectorToPoint(this.game.players[i]));
			}
		}
		
		let ownGoal = { topPost: this.getVectorToPoint(this.team.net.topPost),  bottomPost: this.getVectorToPoint(this.team.net.bottomPost) }
		let otherGoal = { topPost: this.getVectorToPoint(this.otherTeam.net.topPost),  bottomPost: this.getVectorToPoint(this.otherTeam.net.bottomPost) }
		
		var strategy = new this.strategy();
		var strategyResult = strategy.execute({
			id:this.id,
			position: { x: this.isMirrored? this.game.fieldWidth-(this.x-this.game.fieldX) : this.x-this.game.fieldX, y:this.y-this.game.fieldY },
			field: { width:this.game.fieldWidth, height:this.game.fieldHeight }, //zero origin everything
			teamMates: teamMates,
			otherTeam: otherTeam,
			ball: this.getVectorToPoint(this.game.ball),
			ownGoal: ownGoal,
			otherGoal : otherGoal
		});
		var power = Math.max(1, Math.min(this.maxpower, strategyResult.power/10));
		
		this.angle = this.isMirrored? 180+strategyResult.angle : strategyResult.angle*-1;
		this.vx = (power * Math.cos(this.angle * Math.PI / 180));
		this.vy = (power * Math.sin(this.angle * Math.PI / 180));
		
		return { x:this.x, vx:this.vx, y:this.y, vy:this.vy };
	};
	
	
}
