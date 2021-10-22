function require(srcs, onComplete)
{
	var src = Array.isArray(srcs)? srcs.pop() : srcs;
	var script = document.createElement('script');
	script.onload = function () {
		if (Array.isArray(srcs) && srcs.length>0)
		{
			require(srcs, onComplete);
		}
		else if (onComplete!=undefined)
		{
			onComplete();
		}
	};
	script.src = src;
	document.head.appendChild(script);
}

require('js/CodeCollision.js', function()
{
	CodeCollision.Launch({ game: 'Soccer', container:'gameContainer'});
});