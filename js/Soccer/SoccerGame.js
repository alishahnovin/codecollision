class SoccerGame extends Game
{
	static game = CodeCollision.RegisterGameLoaded({ label: 'Soccer', gameType: this, baseStrategy: SoccerStrategy, playerType: Player }); //REQUIRED
	
	playerRadius = 20;
	ballRadius = 10;
	netWidth = 20;
	netHeight = 200;
	fieldColor = "#70C1B3";
	maxScore = 3;
	scoreMarkerRadius = 15;
	isReady = false;
	
	constructor(params) 
	{
		super(params);
		this.setSize({ width:1200, height:700, marginX:200, marginY: 200});
		
		const playerType = params.playerType?? Player;
		this.homeTeam = new Team({ color: "#F25F5C", strategy:params.homeStrategy, players:
			[
				new playerType({ id: 'LeftWing', game: this, radius: this.playerRadius, x: this.width/4, y: this.height/3 }),
				new playerType({ id: 'Center', game: this, radius: this.playerRadius, x: this.width/3, y: this.height/2 }),
				new playerType({ id: 'RightWing', game: this, radius: this.playerRadius, x: this.width/4, y: 2*this.height/3 })
			]
		});
		this.awayTeam = new Team({ color: "#247BA0", strategy:params.awayStrategy, isMirrored:true, players:
			[
				new playerType({ id: 'RightWing', game: this, radius: this.playerRadius, x: this.width/4*3, y: this.height/3 }),
				new playerType({ id: 'Center', game: this, radius: this.playerRadius, x: this.width/3*2, y: this.height/2 }),
				new playerType({ id: 'LeftWing', game: this, radius: this.playerRadius, x: this.width/4*3, y: 2*this.height/3 })
			]
		});
		
		//this whole constructor could use some cleaning up...
		this.players = [];
		this.objects = [];
		for(let i=0;i<this.homeTeam.players.length;i++)
		{
			this.players.push(this.homeTeam.players[i]);
			this.objects.push(this.homeTeam.players[i]);
			this.homeTeam.players[i].otherTeam = this.awayTeam;
		}
		for(let i=0;i<this.awayTeam.players.length;i++)
		{
			this.players.push(this.awayTeam.players[i]);
			this.objects.push(this.awayTeam.players[i]);
			this.awayTeam.players[i].otherTeam = this.homeTeam;
		}
		
		this.ball = new Ball({ game: this, radius: this.ballRadius, x: this.width/2, y: this.height/2, color: "#FFE066" });
		this.objects.push(this.ball);
		
		this.fieldX = this.marginX;
		this.fieldY = this.marginY;
		this.fieldWidth = this.width - (this.marginX*2);
		this.fieldHeight = this.height - (this.marginY*2);
		
		this.homeTeam.net =
		{
				topPost : { x:this.fieldX , y:this.fieldY+this.fieldHeight/2 - this.netHeight/2 },
				bottomPost : { x:this.fieldX , y:this.fieldY+this.fieldHeight/2 + this.netHeight/2}
		};
		this.awayTeam.net =
		{
				topPost : { x: this.fieldX + this.fieldWidth, y:this.fieldY+this.fieldHeight/2 - this.netHeight/2 },
				bottomPost : { x: this.fieldX + this.fieldWidth, y:this.fieldY+this.fieldHeight/2 + this.netHeight/2 }
		};
		
		this.isReady = true;
		this.redraw();
	}
	
	drawField()
	{
		if(!this.isReady) { return; }
		const isFullScreen = CodeCollision.GetIsFullScreen();
		this.canvas.style.borderWidth = isFullScreen? '0px' : '25px';
		this.canvas.style.borderRadius = isFullScreen? '0px' : '100px';
		CodeCollision.Container.style.width = isFullScreen? "100%" : 'auto';
		CodeCollision.Container.style.backgroundColor = isFullScreen? this.fieldColor : '';
		
		
		this.context.strokeStyle = this.strokeStyle;
		this.context.lineCap = 'round';
		this.context.lineWidth = Math.min(this.strokeWidth*this.scale);
		
		var x1 = this.fieldX*this.scale+this.context.lineWidth/2;
		var y1 = this.fieldY*this.scale+this.context.lineWidth/2;
		var x2 = this.fieldWidth*this.scale-this.context.lineWidth + x1;
		var y2 = this.fieldHeight*this.scale-this.context.lineWidth + y1;
		
		this.context.beginPath();
		this.context.rect(x1,y1,x2-x1, y2-y1);
		this.context.moveTo(this.canvas.width/2, y1);
		this.context.lineTo(this.canvas.width/2, y2);
		this.context.closePath();
		this.context.stroke();
		
		let scoreMarkerRadius = this.scoreMarkerRadius*this.scale;
		let scoreMarkerMarginX = (scoreMarkerRadius*3);
		let scoreMarkerMarginY = (scoreMarkerRadius*3/2);
		
		let fontSize = Math.round(30*this.scale);
		this.context.font = fontSize+"px Didact Gothic";
		this.context.fillStyle = this.homeTeam.color;
		this.context.fillText(this.homeTeam.strategy.name.toLowerCase(), x1, y1 - scoreMarkerMarginY);
		
		this.context.fillStyle = this.awayTeam.color;
		this.context.textAlign = 'right';
		this.context.fillText(this.awayTeam.strategy.name.toLowerCase(), x2, y1 - scoreMarkerMarginY);
		
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
		this.context.rect((this.homeTeam.net.topPost.x- this.netWidth) * this.scale + this.context.lineWidth/2, this.homeTeam.net.topPost.y* this.scale,this.netWidth*this.scale, this.netHeight*this.scale);
		this.context.fillStyle = this.homeTeam.color;
		this.context.closePath();
		this.context.fill();
		this.context.stroke();
		
		this.context.beginPath();
		this.context.rect(this.awayTeam.net.topPost.x * this.scale - this.context.lineWidth/2, this.awayTeam.net.topPost.y* this.scale,this.netWidth*this.scale, this.netHeight*this.scale);
		this.context.fillStyle = this.awayTeam.color;
		this.context.closePath();
		this.context.fill();
		this.context.stroke();
	};
	
	checkGameConditions()
	{
		if(!this.isReady) { return; }
		
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

