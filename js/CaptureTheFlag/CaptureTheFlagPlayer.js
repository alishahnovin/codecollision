class CaptureTheFlagPlayer extends Player
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
		
		let ownFlag = this.team==this.game.homeTeam? this.game.homeTeam.flag : this.game.awayTeam.flag;
		let otherFlag = this.team==this.game.homeTeam? this.game.awayTeam.flag : this.game.homeTeam.flag;
		
		var teamMates = [];
		var otherTeam = [];
		for(let i=0;i<this.game.players.length;i++)
		{
			if (this.game.players[i]==this)
			{
				continue;
			}
			
			let playerVector = this.getVectorToPoint(this.game.players[i]);
			let ownFlagVector = this.game.players[i].getVectorToPoint(ownFlag);
			let otherFlagVector = this.game.players[i].getVectorToPoint(otherFlag);
			playerVector.ownFlag = { angle: ownFlagVector.angle, distance: ownFlagVector.distance };
			playerVector.otherFlag = { angle: otherFlagVector.angle, distance: otherFlagVector.distance };
			if (this.game.players[i].team == this.team)
			{
				teamMates.push(playerVector);
			}
			else 
			{
				otherTeam.push(playerVector);
			}
		}
		
		let ownScore = this.team==this.game.homeTeam? this.game.homeTeam.score : this.game.awayTeam.score;
		let otherScore = this.team==this.game.homeTeam? this.game.awayTeam.score : this.game.homeTeam.score;
		
		var strategy = new this.strategy();
		var strategyResult = strategy.execute({
			id:this.id,
			position: { x: this.isMirrored? this.game.fieldWidth-(this.x-this.game.fieldX) : this.x-this.game.fieldX, y:this.y-this.game.fieldY },
			field: { width:this.game.fieldWidth, height:this.game.fieldHeight }, //zero origin everything
			teamMates: teamMates,
			otherTeam: otherTeam,
			ownFlag: this.getVectorToPoint(ownFlag),
			otherFlag : this.getVectorToPoint(otherFlag),
			ownScore : ownScore,
			otherScore : otherScore
		});
		var power = Math.max(0, Math.min(this.maxpower, strategyResult.power/10));
		
		this.angle = this.isMirrored? 180+strategyResult.angle : strategyResult.angle*-1;
		this.vx = (power * Math.cos(this.angle * Math.PI / 180));
		this.vy = (power * Math.sin(this.angle * Math.PI / 180));
		
		return { x:this.x, vx:this.vx, y:this.y, vy:this.vy };
	};
	
	
}
