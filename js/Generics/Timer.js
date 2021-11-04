class Timer
{
	ellapsed = 0;
	duration = 0;
	remaining = 99;
	startTimestamp = false;
	canTimeOut = false;
	hasTimedOut = false;
	game = false;
	
	constructor({ duration, game })
	{
		this.ellapsed = 0;
		this.duration = duration?? 0;
		this.duration = Math.max(0,this.duration);
		this.canTimeOut = this.duration>0;
		this.remaining = this.canTimeOut? this.duration : 99;
		this.game = game;
	}
	
	start()
	{
		this.startTimestamp = Date.now();
		this.interval = setInterval(function(timer) { timer.tick(); }, 10, this);
	} 
	
	tick()
	{
		this.ellapsed = Math.floor((Date.now() - this.startTimestamp)/1000);
		this.remaining = this.duration - this.ellapsed;
		if (this.remaining<0 && this.canTimeOut)
		{
			this.hasTimedOut = true;
		}
		this.game.tick()
	}
	
	stop()
	{
		clearInterval(this.interval);
	}
	
	pad(num, places)
	{
		return String(num).padStart(places, '0');
	}
	
	toString()
	{
		if (!this.canTimeOut) { return ""; }
		var minutesRemaining = Math.max(0, Math.floor(this.remaining/60));
		var secondsRemaining = Math.max(0, this.remaining - (minutesRemaining*60));
		return this.pad(minutesRemaining, 2) + ":"+ this.pad(secondsRemaining, 2);
	}
}