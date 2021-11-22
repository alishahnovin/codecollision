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
class justGoForIt extends CaptureTheFlagStrategy
{
	static strategy = CodeCollision.Register(this); //REQUIRED

	execute //Return Power (0-100), and Angle (0 is forward, 90 is up, -90 is down, 180 is backwards)
	({
		id, //Represents the player on the field (-1, 0, 1)
		position, // { x, y }
		field, // { width, height }
		teamMates, // [ {angle, distance, x, y, ownFlag:{angle, distance}, otherFlag:{angle, distance} } ]
		otherTeam, // [ {angle, distance, x, y, ownFlag:{angle, distance}, otherFlag:{angle, distance} } ]
		ownFlag, // {angle, distance, x, y}
		otherFlag, //{angle, distance, x, y}
		ownScore, //0, 1, 2, or 3 (game over)
		otherScore //0, 1, 2, or 3 (game over)
	})
	{
		return { angle: otherFlag.angle, power:100 };
	};
}