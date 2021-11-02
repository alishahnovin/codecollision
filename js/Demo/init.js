require(
[
'js/Soccer/SoccerBall.js',
'js/Soccer/SoccerNet.js',
'js/Soccer/SoccerPlayer.js',
'js/Soccer/SoccerTeam.js',
'js/Soccer/SoccerStrategy.js',
'js/Soccer/SoccerGame.js'],
function()
{
	CodeCollision.GameType = CodeCollision.GameTypes['Soccer'];
	require(	
	[
	'js/Demo/demoOffrando.js',
	'js/Demo/demoJustGoBro.js'], function() {
	var demoOffrando; var demoJustGoBro;
	for(let i=0;i<CodeCollision.Strategies.length;i++)
	{
		if (CodeCollision.Strategies[i].name.toLowerCase() == 'demoOffrando'.toLowerCase())
		{
			CodeCollision.Strategies[i].label = 'offrando';
			demoOffrando = CodeCollision.Strategies[i];
		}
		else if (CodeCollision.Strategies[i].name.toLowerCase() == 'demoJustGoBro'.toLowerCase())
		{
			CodeCollision.Strategies[i].label = 'justGoBro';
			demoJustGoBro = CodeCollision.Strategies[i];
		}
	}
	CodeCollision.StartMatch(demoOffrando, demoJustGoBro);	
	})
});