/*
	Infront: Angle = 0
	Behind: Angle = 180
	Above: Angle = 90
	Below: Angle = -90
	
	Above & Infront: 0 < Angle < 90
	Below & Infront: -90 < Angle < 0
	Above & Behind: 90 < Angle < 180
	Below & Behind: -180 < Angle <-90
	
	0 is directly in front, 180 is directly behind, 90 is directly above, -90 is directly below, 
*/
class SoccerSMLStrategy extends Strategy
{
	execute //Return Power (0-100), and Angle (0 is forward, 90 is up, -90 is down, 180 is backwards)
	({
		id, //Represents the player on the field (-1, 0, 1)
		position, // { x, y }
		field, // { width, height }
		teamMates, // [ {angle, distance, x, y, ball:{angle,distance} } ]
		otherTeam, // [ {angle, distance, x, y, ball:{angle,distance} } ]
		ball, // {angle, distance, x, y}
		ownGoal, //{ topPost{angle, distance, x, y},  bottomPost{angle, distance, x, y} }
		otherGoal, //{ topPost{angle, distance, x, y},  bottomPost{angle, distance, x, y} }
		ownScore, //0, 1, 2, or 3 (game over)
		otherScore //0, 1, 2, or 3 (game over)
	})
	{
		//call initSize() to set player size; possible values: SMALL, MEDIUM, LARGE
		if(Math.floor(Math.random()*3)==1)
		{
			this.initSize(LARGE); //initializes player to LARGE 
		}
		else if(Math.floor(Math.random()*2)==1)
		{
			this.initSize(SMALL); //initializes player to LARGE 
		}
		else
		{
			this.initSize(MEDIUM); //initializes player to LARGE 
		}
		
		return { angle:0, power: 10 };
	};
};