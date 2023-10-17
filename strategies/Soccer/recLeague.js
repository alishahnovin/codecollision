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
class recLeague extends SoccerStrategy
{
	static strategy = CodeCollision.Register(this); //REQUIRED
	
	
	execute //Return Power (0-100), and Angle (0 is forward, 90 is up, -90 is down, 180 is backwards)
	({
		id, //Represents the player on the field.  (Values: -1, 0, 1)
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
	
            //forward-center player will go directly for the ball when it's infront
	    if (id==0 && Math.abs(ball.angle)<90)
	    {
		return { angle: ball.angle, power:100 };
	    }

	    //if not the forward, or otherwise the ball's behind us, cover the net!
	    if (ball.y<ownGoal.topPost.y) // if the ball's in the upper-half, cover the top goal post
            {
		return { angle: ownGoal.topPost.angle, power:100 };
	    }
	    else if (ball.y>ownGoal.bottomPost.y) // if the ball's in the lower-half, cover the bottom goal post
	    {
		return { angle: ownGoal.bottomPost.angle, power:100 };
            }

	    //if we're here, then the ball is centered on the net...
            //let's try to cut off the angle by going to the farthest post from the given player...
	    let farthestpost = ownGoal.topPost.distance < ownGoal.bottomPost.distance? ownGoal.bottomPost : ownGoal.topPost;
	    return { angle: farthestpost.angle, power:100 };
	}
}
