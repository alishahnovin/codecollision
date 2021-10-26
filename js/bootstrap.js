var loadedSrcs = [];
function require(srcs, onComplete)
{
	if (Array.isArray(srcs)) { srcs.reverse(); }
	addScripts(srcs,onComplete);
}

function addScripts(srcs, onComplete)
{
	var src = Array.isArray(srcs)? srcs.pop() : srcs;
	if (loadedSrcs[src])
	{
		if (Array.isArray(srcs) && srcs.length>0)
		{
			addScripts(srcs, loadedSrcs[src]);
		}
		return;
	}
	
	var script = document.createElement('script');
	script.onload = function()
	{
		loadedSrcs[src] = onComplete?? function() { return true; };
		if (Array.isArray(srcs) && srcs.length>0)
		{
			addScripts(srcs, onComplete);
		}
		else if (onComplete!=undefined)
		{
			onComplete();
		}
	};
	script.src = src;
	document.head.appendChild(script);
}
require([
		'js/CodeCollision.js',
		 'js/Generics/Game.js',
		 'js/Generics/GameObject.js',
		 'js/Generics/Player.js',
		 'js/Generics/Team.js',
		 'js/Generics/Strategy.js'
		],
		function() {
			CodeCollision.Initialize();
		});