class scaredyCat extends SoccerStrategy
{
	static strategy = CodeCollision.Register(this); //REQUIRED
	
	
	execute = function //Return Power (0-100), and Angle (0 is forward, 90 is up, -90 is down, 180 is backwards)
	({
		id, //Values = Center, LeftWing, RightWing
		teamMates, // [ {angle, distance},  {angle, distance} ]
		otherTeam, // [ {angle, distance},  {angle, distance},  {angle, distance} ]
		ball, // {angle, distance}
		ownGoal, //{ topPost{angle, distance},  bottomPost{angle, distance} }
		otherGoal //{ topPost{angle, distance},  bottomPost{angle, distance} }
		
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
	})
	{
		return { angle:  -90, power:100 };
	};
}