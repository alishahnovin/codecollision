class Field
{
	isWalled = false;
	game = null;
	
	constructor({ game, isWalled })
	{
		this.game = game;
		this.isWalled = isWalled;
	}
	
	checkCollision(object)
	{
		return { x:1, y: 1, collided: false};
	}
}

class RectangularField extends Field
{
	width = 1;
	height = 1;
	x = 1;
	y = 1;
	
	constructor({ game, x, y, width, height, isWalled })
	{
		super({ game: game, isWalled: isWalled });
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	
	checkCollision(object)
	{
		if (!this.isWalled) { return { x:1, y: 1, collided:false}; }
		var returnCollision = { x:1, y: 1, collided:false };
		
		if ((object.x - object.radius<this.x && object.vx<0) || (object.x + object.radius > this.x + this.width && object.vx>0))
		{
			returnCollision.x = -1;
			returnCollision.collided = true;
		}
		
		if ((object.y - object.radius<this.y && object.vy<0) || (object.y + object.radius > this.y + this.height && object.vy>0))
		{
			returnCollision.y = -1;
			returnCollision.collided = true;
		}
		
		return returnCollision;
	}
}

class CircularField extends Field
{
	radius = 1;
	
	constructor({ game, centerX, centerY, radius, isWalled })
	{
		super({ game: game, isWalled: isWalled });
		this.centerX = centerX;
		this.centerY = centerY;
		this.radius = radius;
		this.isWalled = isWalled;
	}
	
	checkCollision(object)
	{
		if (!this.isWalled) { return { x:1, y: 1, collided:false}; }
		var returnCollision = { x:1, y: 1, collided:false };
		
		let dist = Math.sqrt((this.centerX - object.x)**2 + (this.centerY - object.y)**2);
		if (dist > this.radius + this.radius)
		{
			//https://jsfiddle.net/jacquesc/wd5aa1wv/9/
		}
		return { x:1, y: 1};
	}
}

class EllipticalField extends Field
{
	radiusX = 1;
	radiusY = 1;
	
	constructor({ game, centerX, centerY, radiusX, radiusY, isWalled })
	{
		super({ game: game, isWalled: isWalled });
		this.centerX = centerX;
		this.centerY = centerY;
		this.radiusX = radiusX;
		this.radiusY = radiusY;
		this.isWalled = isWalled;
	}   
	
	checkCollision(object)
	{
		if (!this.isWalled) { return { x:1, y: 1, collided:false}; }
		var returnCollision = { x:1, y: 1, collided:false };
		
		//http://csharphelper.com/blog/2017/08/calculate-where-a-line-segment-and-an-ellipse-intersect-in-c/#intersection_code
		/*
		let dx = (object.x - this.centerX);
		let dy = (object.y - this.centerY);
		let dh = Math.hypot(dx, dy);
		let angle = Math.atan(dy/dx);
		
		let ellipseEdgeX = this.centerX + this.radiusX * Math.cos(angle);
		let ellipseEdgeY = this.centerY - this.radiusY * Math.sin(angle);
		//object.cx = ellipseEdgeX;
		//object.cy = ellipseEdgeY;
		
		let distance = Math.hypot(ellipseEdgeX - object.x, ellipseEdgeY - object.y);
		
		if(distance <= object.radius)
		{*/
	
		 this.getIntersections(object);
		if (false)
		{
			let xVal = (ellipseEdgeX < object.x && object.vx <0) || (ellipseEdgeX > object.x  && object.vx >0)? -1 : 1;
			let yVal = (ellipseEdgeY < object.y && object.vy <0) || (ellipseEdgeY > object.y  && object.vy >0)? -1 : 1;
			return { x:xVal, y: yVal, collided:true};
		}
		return { x:1, y: 1};
	}
	
	getIntersections(object)
	{
		
	}
}


class ToroidalField extends EllipticalField
{
	innerRadiusX = 1;
	innerRadiusY = 1;
	innerField = false;
	
	constructor({ game, centerX, centerY, outerRadiusX, outerRadiusY, innerRadiusX, innerRadiusY, isWalled })
	{
		super({ game:game, centerX:centerX, centerY:centerY, radiusX:outerRadiusX, radiusY: outerRadiusY, isWalled:isWalled});
		this.innerField = new EllipticalField({ game:game, centerX:centerX, centerY:centerY, radiusX:innerRadiusX, radiusY: innerRadiusY, isWalled:isWalled});;
		this.innerRadiusX = innerRadiusX;
		this.innerRadiusY = innerRadiusY;
	}
	
	checkCollision(object)
	{
		if (!this.isWalled) { return { x:1, y: 1, collided:false}; }
		
		var outerCollision = super.checkCollision(object);
		var innerCollision = this.innerField.checkCollision(object);
		
		return { x: outerCollision.collided? outerCollision.x : (innerCollision.collided? innerCollision.x : 1), y: outerCollision.collided? outerCollision.y : (innerCollision.collided? innerCollision.y : 1), collided:outerCollision.collided || innerCollision.collided };
	}
}