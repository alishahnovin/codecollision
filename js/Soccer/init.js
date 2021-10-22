CodeCollision.Label = 'Soccer';
require(
[
'js/Soccer/Ball.js',
'js/Soccer/Player.js',
'js/Soccer/Team.js',
'js/Soccer/SoccerGame.js',
'js/Soccer/SoccerStrategy.js' ],
function()
{
	CodeCollision.BaseStrategy = SoccerStrategy;
	CodeCollision.GameType = SoccerGame;
}
);