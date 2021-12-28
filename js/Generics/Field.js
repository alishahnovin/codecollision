class Field
{
	isWalled = false;
	
	constructor()
	{
	}
	
	checkCollision(object)
	{
		if (!this.isWalled) { return { x:1, y: 1}; }
		return { x:1, y: 1};
	}
}

class RectangularField extends Field
{
	width = 1;
	height = 1;
	x = 1;
	y = 1;
	
	constructor({ x, y, width, height, isWalled })
	{
		super();
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.isWalled = isWalled;
	}
	
	checkCollision(object)
	{
		if (!this.isWalled) { return { x:1, y: 1}; }
		
		var returnCollision = { x:1, y: 1};
		returnCollision.x = (object.x - object.radius<this.x && object.vx<0) || (object.x + object.radius > this.x + this.width && object.vx>0)?-1:1;
		returnCollision.y = (object.y - object.radius<this.y && object.vy<0) || (object.y + object.radius > this.y + this.height && object.vy>0)?-1:1;
		
		return returnCollision;
	}
}

class CircularField extends Field
{
	radius = 1;
	
	constructor({ centerX, centerY, radius, isWalled })
	{
		super();
		this.centerX = centerX;
		this.centerY = centerY;
		this.radius = radius;
		this.isWalled = isWalled;
	}
	
	checkCollision(object)
	{
		if (!this.isWalled) { return { x:1, y: 1}; }
		
		let dist = Math.sqrt((this.centerX - object.x)**2 + (this.centerY - object.y)**2);
		if (dist > this.radius + this.radius)
		{
			//https://jsfiddle.net/jacquesc/wd5aa1wv/9/
		}
		return false;
	}
}

class EllipticalField extends Field
{
	radiusX = 1;
	radiusY = 1;
	
	constructor({ centerX, centerY, radiusX, radiusY, isWalled })
	{
		super();
		this.centerX = centerX;
		this.centerY = centerY;
		this.radiusX = radiusX;
		this.radiusY = radiusY;
		this.isWalled = isWalled;
	}
	
	checkCollision(object)
	{
		if (!this.isWalled) { return { x:false, y: false}; }
		
		var dx = object.x-this.centerX;
		var dy = object.y-this.centerY;
		var d = 1/Math.sqrt(dx*dx + dy*dy);
		var nx = dx*d;
		var ny = dy*d;
		dx -= nx*object.radius;
		dy -= ny*object.radius;
		
		if(this.outerRadiusX*this.outerRadiusY*dx*dx + this.outerRadiusX*this.outerRadiusY*dy*dy < this.outerRadiusX*this.outerRadiusX*this.outerRadiusY*this.outerRadiusY)
		{
			return true;
		}
		return false;
	}
}


class ToroidalField extends EllipticalField
{
	innerRadiusX = 1;
	innerRadiusY = 1;
	
	constructor({ centerX, centerY, outerRadiusX, outerRadiusY, innerRadiusX, innerRadiusY, isWalled })
	{
		super({ centerX:centerX, centerY:centerY, radiusX:outerRadiusX, radiusY: outerRadiusY, isWalled:isWalled});
		this.innerRadiusX = innerRadiusX;
		this.innerRadiusY = innerRadiusY;
	}
	
	checkCollision(object)
	{
		if (!this.isWalled) { return { x:false, y: false}; }
		super.checkCollision(object);
		return false;
	}
}