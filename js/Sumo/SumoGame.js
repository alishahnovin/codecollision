class SumoGame extends Game
{
	static game = CodeCollision.RegisterGameLoaded({ label: 'Sumo', gameType: this, baseStrategy: SumoStrategy, playerType: SumoPlayer }); //REQUIRED
	
	maxScore = 3;
	isReady = false;
	drag = 1.075;
	
	initialPositions =
	{
		1:{ home:{x: 3/7, y:1/3}, away:{x: 4/7, y:1/3} },
		2:{ home:{x: 1/3, y:1/2}, away:{x: 2/3, y:1/2} },
		3:{ home:{x: 3/7, y:2/3}, away:{x: 4/7, y:2/3} }
	};
	
	constructor(params) 
	{
		super(params);
		this.setSize({ width:700, height:700, marginX:200, marginY: 200});
		
		this.fieldRadius = (this.width - (this.marginX*2))/2;
		this.canvas.style.borderRadius = this.fieldRadius+'px';
		
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
		this.context.arc(this.canvas.width/2, this.canvas.height/2, this.fieldRadius*this.scale, 0, 2 * Math.PI);
		this.context.moveTo(this.canvas.width/2, this.canvas.height/2 - this.fieldRadius*this.scale);
		this.context.lineTo(this.canvas.width/2, this.canvas.height/2 + this.fieldRadius*this.scale);
		this.context.closePath();
		this.context.stroke();
		
		this.context.strokeStyle = this.strokeStyle;
		
		let fontSize = Math.round(30*this.scale);
		this.context.font = fontSize+"px Didact Gothic";
		this.context.textAlign = 'right';
		this.context.fillStyle = this.homeTeam.color;
		this.context.fillText(this.homeTeam.strategy.label.toLowerCase(), (this.fieldX - this.strokeWidth*2)*this.scale, (this.fieldY+this.fieldHeight/2)*this.scale);
		
		this.context.fillStyle = this.awayTeam.color;
		this.context.textAlign = 'left';
		this.context.fillText(this.awayTeam.strategy.label.toLowerCase(), (this.fieldX+this.fieldWidth+ this.strokeWidth*2)*this.scale, (this.fieldY+this.fieldHeight/2)*this.scale);
	};
	
	checkGameConditions()
	{
		if(!this.isReady) { return; }
		
		var removeItem = [];
		for(let i=0;i<this.players.length;i++)
		{
			let distance = Math.sqrt((this.players[i].x*this.scale - this.canvas.width/2)**2 + (this.players[i].y*this.scale - this.canvas.height/2)**2);
			if (distance>this.fieldRadius*this.scale)
			{
				removeItem.push(this.players[i]);
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
}

