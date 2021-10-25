var loadedSrcs = [];
function require(srcs, onComplete)
{
	var src = Array.isArray(srcs)? srcs.pop() : srcs;
	if (loadedSrcs[src])
	{
		if (Array.isArray(srcs) && srcs.length>0)
		{
			require(srcs, loadedSrcs[src]);
		}
		return;
	}
	
	var script = document.createElement('script');
	script.onload = function()
	{
		loadedSrcs[src] = onComplete?? function() { return true; };
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
require('js/CodeCollision.js', function() {
	CodeCollision.Initialize();
});