class SoccerSMLPlayer extends SoccerPlayer
{
	constructor(params)
	{
		super(params);
	}
	
	setDirection()
	{
		if (this.strategy===undefined)
		{
			return { x:this.x, vx:0, y:this.y, vy:0 };
		}
		return super.setDirection();
	};
}
