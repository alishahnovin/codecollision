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
class scaredyCat extends SoccerStrategy
{
	static strategy = CodeCollision.Register(this); //REQUIRED
	
	
	execute //Return Power (0-100), and Angle (0 is forward, 90 is up, -90 is down, 180 is backwards)
	({
		id, //Represents the player on the field. Center player id is 0, the left and right wing players are -1 and 1;
		position, // { x, y }
		field, // { width, height }
		teamMates, // [ {angle, distance, x, y} ]
		otherTeam, // [ {angle, distance, x, y} ]
		ball, // {angle, distance, x, y}
		ownGoal, //{ topPost{angle, distance, x, y},  bottomPost{angle, distance, x, y} }
		otherGoal //{ topPost{angle, distance, x, y},  bottomPost{angle, distance, x, y} }
	})
	{
		return { angle:  -90, power:100 };
	};
}