class SoccerGame extends Game
{
	static game = CodeCollision.RegisterGameLoaded({ label: 'Soccer', gameType: this, baseStrategy: SoccerStrategy, playerType: SoccerPlayer, teamType: SoccerTeam }); //REQUIRED
	
	maxScore = 3;
	scoreMarkerRadius = 15;
	isReady = false;
	timeout = 90;
	
	initialPositions =
	{
		'-1':{ home:{x: 1/4, y:1/3}, away:{x: 3/4, y:1/3} },
		'0':{ home:{x: 1/3, y:1/2}, away:{x: 2/3, y:1/2} },
		'1':{ home:{x: 1/4, y:2/3}, away:{x: 3/4, y:2/3} }
	};
	
	constructor(params) 
	{
		super(params);
		this.setSize({ width:1200, height:700, marginX:200, marginY: 200});
		this.field = new RectangularField({ x:this.marginX, y:this.marginY, width:this.width - (this.marginX*2), height:this.height - (this.marginY*2), isWalled:true });
		
		this.homeTeam.net = new SoccerNet({ x: this.field.x, y:this.field.y+this.field.height/2 });
		this.awayTeam.net = new SoccerNet({ x: this.field.x + this.field.width, y:this.field.y+this.field.height/2 })
		
		for(let key in this.initialPositions)
		{
			this.homeTeam.addPlayer(key, this.width * this.initialPositions[key].home.x, this.height * this.initialPositions[key].home.y);
			this.awayTeam.addPlayer(key, this.width * this.initialPositions[key].away.x, this.height * this.initialPositions[key].away.y);
		}
		
		this.ball = new SoccerBall({ game: this, x: this.width/2, y: this.height/2, color: "#FDCA00" });
		this.objects.push(this.ball);
		
		this.isReady = true;
		this.redraw();
	}
	
	drawField()
	{
		if(!this.isReady) { return; }
		const isFullScreen = CodeCollision.GetIsFullScreen();
		this.canvas.style.borderWidth = isFullScreen? '0px' : '25px';
		this.canvas.style.borderRadius = isFullScreen? '0px' : '100px';
		
		this.context.strokeStyle = this.fieldLines;
		this.context.lineCap = 'round';
		this.context.lineWidth = Math.min(this.strokeWidth*this.scale);
		
		var x1 = this.field.x*this.scale+this.context.lineWidth/2;
		var y1 = this.field.y*this.scale+this.context.lineWidth/2;
		var x2 = this.field.width*this.scale-this.context.lineWidth + x1;
		var y2 = this.field.height*this.scale-this.context.lineWidth + y1;
		
		this.context.beginPath();
		this.context.rect(x1,y1,x2-x1, y2-y1);
		this.context.moveTo(this.canvas.width/2, y1);
		this.context.lineTo(this.canvas.width/2, y2);
		this.context.closePath();
		this.context.stroke();
		
		this.context.strokeStyle = this.strokeStyle;
		let scoreMarkerRadius = this.scoreMarkerRadius*this.scale;
		let scoreMarkerMarginX = (scoreMarkerRadius*3);
		let scoreMarkerMarginY = (scoreMarkerRadius*3/2);
		
		this.setInfoLabelPositions(
		{
			homeLabelPosition:{x:x1,y:y1 - scoreMarkerMarginY},
			awayLabelPosition:{x:x2,y:y1 - scoreMarkerMarginY},
			timeLabelPosition:{x:this.canvas.width/2,y:y1 - scoreMarkerMarginY}
		});
		
		for(let i=0;i<this.maxScore;i++)
		{
			this.context.beginPath();
			this.context.arc(x1 + (scoreMarkerMarginX*i) + scoreMarkerRadius, y2 + scoreMarkerRadius + scoreMarkerMarginY, scoreMarkerRadius, 0, 2 * Math.PI);
			this.context.fillStyle = this.homeTeam.score >= i+1? this.homeTeam.color : this.strokeStyle;
			this.context.closePath();
			this.context.fill();
			
			this.context.beginPath();
			this.context.arc(x2 - (scoreMarkerMarginX*i) - scoreMarkerRadius, y2 + scoreMarkerRadius + scoreMarkerMarginY, scoreMarkerRadius, 0, 2 * Math.PI);
			this.context.fillStyle = this.awayTeam.score >= i+1? this.awayTeam.color : this.strokeStyle
			this.context.closePath();
			this.context.fill();
		}
		
		this.context.beginPath();
		this.context.rect(Math.ceil((this.homeTeam.net.topPost.x- this.homeTeam.net.width) * this.scale + this.context.lineWidth), this.homeTeam.net.topPost.y* this.scale,this.homeTeam.net.width*this.scale, this.homeTeam.net.height*this.scale);
		this.context.fillStyle = this.homeTeam.color;
		this.context.closePath();
		this.context.fill();
		//this.context.stroke();
		
		this.context.beginPath();
		this.context.rect(Math.floor(this.awayTeam.net.topPost.x * this.scale - this.context.lineWidth), this.awayTeam.net.topPost.y* this.scale,this.homeTeam.net.width*this.scale, this.homeTeam.net.height*this.scale);
		this.context.fillStyle = this.awayTeam.color;
		this.context.closePath();
		this.context.fill();
		//this.context.stroke();
		
	};
	
	checkGameConditions()
	{
		if(!this.isReady) { return; }
		
		if (this.timer.hasTimedOut)
		{
			if (this.awayTeam.score==this.homeTeam.score)
			{
				this.winner = false;
			} else {
				this.winner = this.awayTeam.score>this.homeTeam.score? this.awayTeam.strategy : this.homeTeam.strategy;
			}
			CodeCollision.FinishMatch();
			return;
		}
		
		if (this.ball.x - this.ball.radius*this.scale - this.context.lineWidth <= this.homeTeam.net.topPost.x+this.context.lineWidth && this.ball.y>=this.homeTeam.net.topPost.y && this.ball.y<=this.homeTeam.net.bottomPost.y)
		{
			this.awayTeam.score++;
			if (this.awayTeam.score < this.maxScore)
			{
				this.reset();
			} else {
				this.stop();
				this.winner = this.awayTeam.strategy;
				CodeCollision.FinishMatch();
			}
		}
		else if (this.ball.x + this.ball.radius*this.scale + this.context.lineWidth >= this.awayTeam.net.topPost.x-this.context.lineWidth && this.ball.y>=this.awayTeam.net.topPost.y && this.ball.y<=this.awayTeam.net.bottomPost.y)
		{
			this.homeTeam.score++;
			if (this.homeTeam.score < this.maxScore)
			{
				this.reset();
			} else {
				this.stop();
				this.winner = this.homeTeam.strategy;
				CodeCollision.FinishMatch();
			}
		}
	};
}

