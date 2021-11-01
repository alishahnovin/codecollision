class Game 
{
	strokeStyle = "#50514F";
	fieldLines = "#50514F";
	strokeWidth = 5;
	winner = false;
	
	drag = 1.025;
	
	players = [];
	objects = [];
	
	constructor({ homeStrategy, awayStrategy, playerType, teamType })
	{
		this.fieldX = 0;
		this.fieldY = 0;
		this.fieldWidth = 0;
		this.fieldHeight = 0;
		this.fieldRadius = 0;
		
		this.canvas  = document.createElement("canvas");
		this.canvas.width = "1";
		this.canvas.height = "1";
		this.context = this.canvas.getContext("2d");
		
		this.playerType = playerType?? Player;
		this.teamType = teamType?? Team;
		
		this.players = [];
		this.objects = [];
		this.homeTeam = new this.teamType({ game:this, color: "#F25F5C", strategy:homeStrategy});
		this.awayTeam = new this.teamType({ game:this, color: "#247BA0", strategy:awayStrategy, isMirrored:true});
		
		this.redraw();
	}
	
	setSize({ width, height, marginX, marginY })
	{
		this.marginX = marginX??0;
		this.marginY = marginY??0;
		this.width = width + (this.marginX*2);
		this.height = height + (this.marginY*2);
		this.canvas.style.width = 'auto';
		this.canvas.style.height = 'auto';
		this.scale = CodeCollision.GetIsFullScreen() ? 1 : 0.5;
		this.canvas.width = this.width * this.scale;
		this.canvas.height = this.height * this.scale;
		this.paused = false;
		
		this.fieldX = this.marginX;
		this.fieldY = this.marginY;
		this.fieldWidth = this.width - (this.marginX*2);
		this.fieldHeight = this.height - (this.marginY*2);
	}
	
	start()
	{
		this.reset();
		this.Interval = setInterval(function() { if (CodeCollision.Game==null) { return ; } CodeCollision.Game.tick(); }, 10);
	};
	
	stop()
	{
		this.isReady = false;
		this.paused = true;
		clearInterval(this.Interval);
	};
	
	drawField()
	{
	};
	
	redraw(clear=true)
	{
		if (clear)
		{
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.canvas.width = this.width * this.scale;
			this.canvas.height = this.height * this.scale;
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
		
		this.drawField();
		if (this.objects)
		{
			for(var i=0;i<this.objects.length;i++)
			{
				this.context.beginPath();
				this.context.arc(this.objects[i].x* this.scale, this.objects[i].y* this.scale, this.objects[i].radius * this.scale, 0, 2 * Math.PI);
				this.context.fillStyle = this.objects[i].color;
				this.context.closePath();
				this.context.fill();
				//this.context.stroke();
			}
		}
	};
		
	drawVector({ color, x, y, vx, vy, amplify, radius })
	{
		if (vx==0 && vy==0) { return; }
		this.context.save();
		this.context.lineCap = 'round';
		this.context.strokeStyle = color?? this.strokeStyle;
		this.context.lineWidth = Math.min(this.strokeWidth*this.scale);
		this.context.beginPath();
		let x2 = (x + vx * amplify);
		let y2 = (y + vy * amplify);
		let angle = Math.atan2(y2-y, x2-x);
		this.context.moveTo((x + radius*Math.cos(angle))* this.scale, (y + radius*Math.sin(angle))* this.scale);
		this.context.lineTo(x2 * this.scale, y2 * this.scale);
		
		let size = 15*this.scale;
		
		this.context.translate(x2 * this.scale,y2 * this.scale);
		
		this.context.rotate(Math.atan2(y2-y, x2-x));
		this.context.moveTo(0,0);
		this.context.lineTo(-1*size, -1*size);
		this.context.moveTo(0,0);
		this.context.lineTo(-1*size, size);
		this.context.closePath();
		this.context.stroke();
		this.context.restore();
		
		this.context.translate(0,0);		
	};

	checkCollisions()
	{
		for(let i=0;i<this.objects.length;i++)
		{
			for(let j=i+1;j<this.objects.length;j++)
			{
				this.objects[i].objectCollision(this.objects[j]);
			}
			this.objects[i].boundaryCollision();
		}
	};
	
	checkGameConditions()
	{
	};
	
	reset()
	{
		for(let i=0;i<this.objects.length;i++)
		{
			this.objects[i].reset();
		}
		this.redraw();
	};

	tick()
	{
		if(this.paused)
		{
			return;
		}
		
		this.checkGameConditions();
		this.checkCollisions();
		let isThereMovement = false;
		for(let i=0;i<this.objects.length;i++)
		{
			this.objects[i].advance();
			if (Math.abs(this.objects[i].vx)>=0.25 || Math.abs(this.objects[i].vy)>=0.25)
			{
				isThereMovement = true;
			}
		}
		
		if (isThereMovement)
		{
			this.redraw();
		}
		else
		{
			this.redraw();
			this.paused = true;
			this.nextMove();
			setTimeout(function(game) { game.paused = false; }, 1000, this);
		}
	};
	
	nextMove()
	{
		for(let i=0;i<this.players.length;i++)
		{
			let vector = this.players[i].setDirection();
			vector.radius = this.players[i].radius;
			vector.color = this.players[i].color;
			vector.amplify = 20; //got this with guess work, I'll have to go back and figure out the source of this number but I'm guessing it's the decay of velocity.
			this.drawVector(vector);
		}
	}
}
