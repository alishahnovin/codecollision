class FloorIsLavaGame extends Game
{
	static game = CodeCollision.RegisterGameLoaded({ label: 'Floor is Lava', gameType: this, baseStrategy: FloorIsLavaStrategy, playerType: FloorIsLavaPlayer }); //REQUIRED
	
	maxScore = 3;
	isReady = false;
	drag = 1.075;
	
	fieldColor = 'rgba(200,200,200,0.2)';
	
	initialPositions =
	{
		1:{ home:{x: 3/7, y:1/3}, away:{x: 4/7, y:1/3} },
		2:{ home:{x: 1/3, y:1/2}, away:{x: 2/3, y:1/2} },
		3:{ home:{x: 3/7, y:2/3}, away:{x: 4/7, y:2/3} }
	};
	
	holeRadiusMin = 25;
	holeRadiusMax = 50;
	holes = [];
	holeColor = '#FFFFFF';
	
	constructor(params) 
	{
		super(params);
		this.setSize({ width:700, height:700, marginX:200, marginY: 200});
		
		this.field = new CircularField({ centerX: this.canvas.width/2, centerY: this.canvas.height/2, radius:(this.width - (this.marginX*2))/2, isWalled:false });
		this.canvas.style.borderRadius = this.field.radius+'px';
		
		
		for(let id in this.initialPositions)
		{
			this.homeTeam.addPlayer(id, this.width * this.initialPositions[id].home.x, this.height * this.initialPositions[id].home.y);
			this.awayTeam.addPlayer(id, this.width * this.initialPositions[id].away.x, this.height * this.initialPositions[id].away.y);
		}
		
		this.isReady = true;
		this.redraw();
	}
	
	drawField()
	{
		if(!this.isReady) { return; }
		const isFullScreen = CodeCollision.GetIsFullScreen();
		this.canvas.style.borderWidth = isFullScreen? '0px' : '25px';
		
		this.context.strokeStyle = this.fieldLines;
		this.context.lineCap = 'round';
		this.context.lineWidth = Math.min(this.strokeWidth*this.scale);
		
		this.context.beginPath();
		this.context.arc(this.field.centerX, this.field.centerY, this.field.radius*this.scale, 0, 2 * Math.PI);
		this.context.fillStyle = this.fieldColor;
		this.context.fill();
		this.context.closePath();
		this.context.stroke();
		
		
		this.context.save();
		this.context.beginPath();
		for(let i=0;i<this.holes.length;i++)
		{
			let centerX = this.canvas.width/2 + (this.holes[i].x * this.scale);
			let centerY = this.canvas.height/2 + (this.holes[i].y * this.scale);
			this.context.moveTo(centerX, centerY);
			this.context.arc(centerX, centerY, this.holes[i].radius * this.scale, 0, 2 * Math.PI);
		}
		this.context.strokeStyle = this.fieldLines;
		this.context.lineCap = 'round';
		this.context.lineWidth = Math.min(this.strokeWidth*this.scale);
		this.context.stroke();
		this.context.globalCompositeOperation = "destination-out";
		this.context.fillStyle = this.holeColor;
		this.context.fill();
		this.context.restore();
		//this.context.fillStyle = this.holeColor;
		//this.context.fill();
		
		this.context.save();
		this.context.beginPath();
		this.context.moveTo(this.canvas.width/2, this.canvas.height/2);
		this.context.arc(this.canvas.width/2, this.canvas.height/2, this.field.radius*this.scale, 0, 2 * Math.PI);
		this.context.fillStyle = this.fieldLines;
		this.context.globalCompositeOperation = "destination-in";
		this.context.fill();
		this.context.closePath();
		this.context.restore();
			
		this.context.strokeStyle = this.strokeStyle;
		
		this.setInfoLabelPositions(
		{
			homeLabelPosition:{x:(this.marginX - this.strokeWidth*2)*this.scale,y:(this.marginY+(this.width - (this.marginX*2))/2)*this.scale, align:'right'},
			awayLabelPosition:{x:(this.marginX+(this.width - (this.marginX*2))+ this.strokeWidth*2)*this.scale,y:(this.marginY+(this.height - (this.marginY*2))/2)*this.scale, align:'left'}
		});};
	
	nextMove()
	{
		if(!this.isReady) { return; }
		
		let holeRadius = Math.floor(Math.random() * (this.holeRadiusMax - this.holeRadiusMin)) + this.holeRadiusMin;
		let angle = Math.random() * 360;
		let holeX = Math.random() *this.field.radius * Math.sin(angle);
		let holeY = Math.random() *this.field.radius * Math.cos(angle);
		this.holes.push({ x:holeX , y:holeY, radius:holeRadius});
		
		this.redraw();
		
		super.nextMove();
	}
	
	checkGameConditions()
	{
		if(!this.isReady) { return; }
		
		var removeItem = [];
		for(let i=0;i<this.players.length;i++)
		{
			let distance = Math.sqrt((this.players[i].x*this.scale - this.canvas.width/2)**2 + (this.players[i].y*this.scale - this.canvas.height/2)**2);
			if (distance>this.field.radius*this.scale)
			{
				removeItem.push(this.players[i]);
			}
			for(let j=0;j<this.holes.length;j++)
			{
				let holeX = this.canvas.width/2 + this.holes[j].x*this.scale;
				let holeY = this.canvas.height/2 + this.holes[j].y*this.scale;
				if (this.lavaCollision(this.players[i].x*this.scale, this.players[i].y*this.scale, this.players[i].radius*this.scale, holeX, holeY, this.holes[j].radius*this.scale))
				{
					removeItem.push(this.players[i]);
					break;
				}
			}
		}
		
		for(let i=0;i<removeItem.length;i++)
		{
			this.homeTeam.players = this.homeTeam.players.filter(p => p !== removeItem[i]);
			this.awayTeam.players = this.awayTeam.players.filter(p => p !== removeItem[i]);
			this.players = this.players.filter(p => p !== removeItem[i]);
			this.objects = this.objects.filter(o => o !== removeItem[i]);
		}
		
		if (this.homeTeam.players.length==0 || this.awayTeam.players.length==0)
		{
			this.stop();
			this.winner = this.homeTeam.players.length==0? this.awayTeam.strategy : this.homeTeam.strategy;
			CodeCollision.FinishMatch();
			return;
		}
	};
	
	lavaCollision(p1x, p1y, r1, p2x, p2y, r2)
	{
	  var a;
	  var x;
	  var y;

	  a = r1 + r2;
	  x = p1x - p2x;
	  y = p1y - p2y;

	  if (a > Math.sqrt((x * x) + (y * y))) {
		return true;
	  } else {
		return false;
	  }
	}
}

