class GameObject
{
	constructor({ game, radius, x, y, color, isMirrored })
	{
		this.game = game;
		this.color = color;
		
		this.isMoving = false;
		this.vx = 0;
		this.vy = 0;
		this.x = x?? 0;
		this.y = y?? 0;
		this.isMirrored = isMirrored?? false;
		this.radius = radius;
	
		this.initialX = this.x;
		this.initialY = this.y;
	};
	
	reset()
	{
		this.x = this.initialX;
		this.y = this.initialY;
		this.vx = 0;
		this.vy = 0;
	};

	advance()
	{
		this.x+=this.vx;
		this.y+=this.vy;
		
		this.vx /= this.game.drag;
		this.vy /= this.game.drag;
	};
	
	boundaryCollision()
	{
		var collision = this.game.field.checkCollision(this);
		if (collision.collided)
		{
			this.vx *= collision.x;
			this.vy *= collision.y;
		}
	};
	
	objectCollision(that)
	{
		let dist = Math.sqrt((this.x - that.x)**2 + (this.y - that.y)**2);

		if (dist < this.radius + this.radius) {              
			let theta1 = Math.atan2(this.vy, this.vx);
			let theta2 = Math.atan2(that.vy, that.vx);
			let phi = Math.atan2(that.y - this.y, that.x - this.x);
			let m1 = this.radius;
			let m2 = that.radius;
			let v1 = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
			let v2 = Math.sqrt(that.vx * that.vx + that.vy * that.vy);

			let dx1F = (v1 * Math.cos(theta1 - phi) * (m1-m2) + 2*m2*v2*Math.cos(theta2 - phi)) / (m1+m2) * Math.cos(phi) + v1*Math.sin(theta1-phi) * Math.cos(phi+Math.PI/2);
			let dy1F = (v1 * Math.cos(theta1 - phi) * (m1-m2) + 2*m2*v2*Math.cos(theta2 - phi)) / (m1+m2) * Math.sin(phi) + v1*Math.sin(theta1-phi) * Math.sin(phi+Math.PI/2);
			let dx2F = (v2 * Math.cos(theta2 - phi) * (m2-m1) + 2*m1*v1*Math.cos(theta1 - phi)) / (m1+m2) * Math.cos(phi) + v2*Math.sin(theta2-phi) * Math.cos(phi+Math.PI/2);
			let dy2F = (v2 * Math.cos(theta2 - phi) * (m2-m1) + 2*m1*v1*Math.cos(theta1 - phi)) / (m1+m2) * Math.sin(phi) + v2*Math.sin(theta2-phi) * Math.sin(phi+Math.PI/2);

			this.vx = dx1F;                
			this.vy = dy1F;                
			that.vx = dx2F;                
			that.vy = dy2F;
	  
			//https://github.com/miskimit/miskimit.github.io/blob/master/ballsballsballs/script.js
			this.staticCollision(that);
		}
	};
	
	staticCollision(that, emergency=false)
	{
		let dist = Math.sqrt((this.x - that.x)**2 + (this.y - that.y)**2);
		let overlap = this.radius + this.radius - dist;
		let smallerObject = this.radius < that.radius ? this : that;
		let biggerObject = this.radius < that.radius ? that : this;

		// When things go normally, this line does not execute.
		// "Emergency" is when staticCollision has run, but the collision
		// still hasn't been resolved. Which implies that one of the objects
		// is likely being jammed against a corner, so we must now move the OTHER one instead.
		// in other words: this line basically swaps the "little guy" role, because
		// the actual little guy can't be moved away due to being blocked by the wall.
		if (emergency) [smallerObject, biggerObject] = [biggerObject, smallerObject]
		
		let theta = Math.atan2((biggerObject.y - smallerObject.y), (biggerObject.x - smallerObject.x));
		smallerObject.x -= overlap * Math.cos(theta);
		smallerObject.y -= overlap * Math.sin(theta); 

		if (dist < this.radius + that.radius) {
			// we don't want to be stuck in an infinite emergency.
			// so if we have already run one emergency round; just ignore the problem.
			if (!emergency) this.staticCollision(that, true)
		}
	};
	
	getVectorToPoint(that)
	{
		let distance = Math.sqrt((this.x - that.x)**2 + (this.y - that.y)**2);
		let angle = Math.atan2(that.y - this.y, that.x - this.x)*180/Math.PI;
		return { angle: this.isMirrored? (angle<0? 180+angle : angle-180) : -1*angle, distance: distance, x:this.isMirrored? this.game.field.width-(that.x-this.game.field.x) : that.x-this.game.field.x, y:that.y-this.game.field.y };
	}
}
