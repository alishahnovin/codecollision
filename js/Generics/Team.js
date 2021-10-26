class Team
{
	constructor({ game, color, strategy, isMirrored })
	{
		this.game = game;
		this.color = color;
		this.score = 0;
		this.strategy = strategy;
		this.isMirrored = isMirrored?? false;
		this.players = [];
	}
	
	addPlayer(id, x, y)
	{
		let player = new this.game.playerType({ id: id?? this.players.length, game: this.game, x:x, y:y });
		player.team = this;
		player.strategy = this.strategy;
		player.color = this.color;
		player.isMirrored = this.isMirrored;
		player.otherTeam = (this.game.homeTeam == this)? this.game.awayTeam : this.game.homeTeam;
		this.players.push(player);
		this.game.players.push(player);
		this.game.objects.push(player);
		return player;
	}
}