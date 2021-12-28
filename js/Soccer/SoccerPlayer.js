class SoccerPlayer extends Player
{
	maxpower=10;
		
	constructor(params)
	{
		super(params);
		this.radius = MEDIUM;
		this.id = params.id;
		this.strategy = params.strategy;
	}
	
	strategyImplementation = false;
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
			
			let playerVector = this.getVectorToPoint(this.game.players[i]);
			let ballVector = this.game.players[i].getVectorToPoint(this.game.ball);
			playerVector.ball = { angle: ballVector.angle, distance: ballVector.distance };
			if (this.game.players[i].team == this.team)
			{
				teamMates.push(playerVector);
			}
			else 
			{
				otherTeam.push(playerVector);
			}
		}
		
		let ownGoal = { topPost: this.getVectorToPoint(this.team.net.topPost),  bottomPost: this.getVectorToPoint(this.team.net.bottomPost) };
		let otherGoal = { topPost: this.getVectorToPoint(this.otherTeam.net.topPost),  bottomPost: this.getVectorToPoint(this.otherTeam.net.bottomPost) };
		
		let ownScore = this.team==this.game.homeTeam? this.game.homeTeam.score : this.game.awayTeam.score;
		let otherScore = this.team==this.game.homeTeam? this.game.awayTeam.score : this.game.homeTeam.score;
		
		this.strategyImplementation = new this.strategy();
		let strategyResult = this.strategyImplementation.execute({
			id:this.id,
			position: { x: this.isMirrored? this.game.fieldWidth-(this.x-this.game.fieldX) : this.x-this.game.fieldX, y:this.y-this.game.fieldY },
			field: { width:this.game.fieldWidth, height:this.game.fieldHeight }, //zero origin everything
			teamMates: teamMates,
			otherTeam: otherTeam,
			ball: this.getVectorToPoint(this.game.ball),
			ownGoal: ownGoal,
			otherGoal : otherGoal,
			ownScore : ownScore,
			otherScore : otherScore
		});
		let power = Math.max(0, Math.min(this.maxpower, strategyResult.power/10));
		
		this.angle = this.isMirrored? 180+strategyResult.angle : strategyResult.angle*-1;
		this.vx = (power * Math.cos(this.angle * Math.PI / 180)) * (MEDIUM/this.radius);
		this.vy = (power * Math.sin(this.angle * Math.PI / 180)) * (MEDIUM/this.radius);
		
		return { x:this.x, vx:this.vx, y:this.y, vy:this.vy };
	};
	
	
}
