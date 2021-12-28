class SumoGame extends Game
{
	static game = CodeCollision.RegisterGameLoaded({ label: 'Sumo', gameType: this, baseStrategy: SumoStrategy, playerType: SumoPlayer }); //REQUIRED
	
	maxScore = 3;
	isReady = false;
	drag = 1.075;
	timeout = 90;
	
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
		
		this.field = new CircularField({ game:this, centerX: this.canvas.width/2, centerY: this.canvas.height/2, radius:(this.width - (this.marginX*2))/2, isWalled:false });
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
		this.context.moveTo(this.canvas.width/2, this.canvas.height/2 - this.field.radius*this.scale);
		this.context.lineTo(this.canvas.width/2, this.canvas.height/2 + this.field.radius*this.scale);
		this.context.closePath();
		this.context.stroke();
		
		this.context.strokeStyle = this.strokeStyle;
		
		this.setInfoLabelPositions(
		{
			homeLabelPosition:{x:(this.marginX - this.strokeWidth*2)*this.scale,y:(this.marginY+(this.width - (this.marginX*2))/2)*this.scale, align:'right'},
			awayLabelPosition:{x:(this.marginX+(this.width - (this.marginX*2))+ this.strokeWidth*2)*this.scale,y:(this.marginY+(this.height - (this.marginY*2))/2)*this.scale, align:'left'},
			timeLabelPosition:{x:this.canvas.width/2,y:this.canvas.height/2 - (this.field.radius+10)*this.scale}
		});
	};
	
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

