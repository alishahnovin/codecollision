class SoccerNet
{
	width = 20;
	height = 200;
	
	constructor({x, y}) 
	{
		this.topPost = { x: x, y:y - this.height/2 };
		this.bottomPost = { x: x, y:y + this.height/2 };
	}
}
