class CodeCollision
{
	static LeaderBoard = false;
	static Container = false;
	static Label = '';
	static Rounds = [];
	static CurrentRound = 0;
	
	static GameType = false;
	static BaseStrategy = false;
	
	static StrategySelectors = []; //the inputs, used to verify that the strategy has been selected or not...also used for 'select all/none';
	static CompetingStrategies = [];
	static Strategies = []; //these are all the registered stratetgie, not part of the game...
	
static Launch({game, container})
	{
		require([ 
		 'js/'+game+'/init.js',
		 'js/Generics/Game.js',
		 'js/Generics/GameObject.js',
		 'js/Generics/Strategy.js'
		], function() { 
		
			CodeCollision.Container = document.getElementById(container);
			
			var img = document.createElement('img');
			img.src = "smalllogo.png";
			CodeCollision.Container.appendChild(img);
			
			var h1 = document.createElement('h1');
			h1.innerText = CodeCollision.Label;
			CodeCollision.Container.appendChild(h1);
			
			var h2 = document.createElement('h2');
			h2.innerText = 'Load strategy file:';
			CodeCollision.Container.appendChild(h2);
			
			var strategyLoader = document.createElement("input");
			strategyLoader.type = "file";
			strategyLoader.multiple = true;
			strategyLoader.addEventListener('change', CodeCollision.LoadStrategies, false);
			CodeCollision.Container.appendChild(strategyLoader);
			
			CodeCollision.LeaderBoard = document.createElement("div");
			CodeCollision.LeaderBoard.className = 'leaderBoard';
			CodeCollision.LeaderBoard.style.display = 'none';
			document.body.appendChild(CodeCollision.LeaderBoard);
		});
	}
	
	static Register(type)
	{
		if (type.prototype instanceof CodeCollision.BaseStrategy)
		{
			CodeCollision.Strategies.push(type);
		}
	}
	
	static LoadStrategies(e)
	{
		let filesToLoad = 0;
		let filesLoaded = 0;
		for(let i=0;i<e.target.files.length;i++)
		{
			var file = e.target.files[i];
			if (!file)
			{
				continue;
			}
			var reader = new FileReader();
			reader.onload = function(e)
			{
				try {
				var contents = e.target.result;
				var script = document.createElement("script");
				script.textContent = contents;
				document.body.appendChild(script);
				filesLoaded++;
				} catch (e) {
					console.log(e);
				}
			};
			filesToLoad++;
			reader.readAsText(file);
		}
		
		var loadStrategyTimer = setInterval(function()
		{
			if (filesLoaded>0 && filesLoaded==filesToLoad && CodeCollision.Strategies.length>0)
			{
				clearInterval(loadStrategyTimer);
				CodeCollision.ShowGameOptions();
			}
		}, 100);
	}
	
	static ShowGameOptions()
	{
		CodeCollision.StrategySelectors = [];
		CodeCollision.Container.innerHTML = '';
		
		var img = document.createElement('img');
		img.src = "smalllogo.png";
		CodeCollision.Container.appendChild(img);
		
		var h1 = document.createElement('h1');
		h1.innerText = CodeCollision.Label;
		CodeCollision.Container.appendChild(h1);
		
		var strategyLoader = document.createElement("input");
		strategyLoader.type = "file";
		strategyLoader.multiple = true;
		strategyLoader.addEventListener('change', CodeCollision.LoadStrategies, false);
		CodeCollision.Container.appendChild(strategyLoader);
		
		var menuSelection = document.createElement('div');
		menuSelection.className = 'menuSelection';
		CodeCollision.Container.appendChild(menuSelection);
		
		var seletionBtnContainer = document.createElement('div');
		var selectAll = document.createElement('button');
		selectAll.innerText = "Select All";
		selectAll.onclick = function()
		{
			for(let i=0;i<CodeCollision.StrategySelectors.length;i++)
			{
				CodeCollision.StrategySelectors[i].checked = true;
			}
		};
		seletionBtnContainer.appendChild(selectAll);
		
		var selectNone = document.createElement('button');
		selectNone.innerText = "Select None";
		selectNone.onclick = function()
		{
			for(let i=0;i<CodeCollision.StrategySelectors.length;i++)
			{
				CodeCollision.StrategySelectors[i].checked = false;
			}
		};
		seletionBtnContainer.appendChild(selectNone);
		menuSelection.appendChild(seletionBtnContainer);

		for(let i=0;i<CodeCollision.Strategies.length;i++)
		{
			var optionContainer = document.createElement('div');
			optionContainer.className = "optionContainer";
			
			let input = document.createElement("input");
			input.id = CodeCollision.Strategies[i].name;
			input.value = CodeCollision.Strategies[i].name;
			input.type = "checkbox";
			input.checked = true;
			input.strategy = CodeCollision.Strategies[i];
			CodeCollision.StrategySelectors.push(input);
			optionContainer.appendChild(input);			
			optionContainer.appendChild(document.createElement("br"));
			let label = document.createElement("label");
			label.htmlFor = CodeCollision.Strategies[i].name;
			label.innerHTML = CodeCollision.Strategies[i].name;
			optionContainer.appendChild(label);
			
			menuSelection.appendChild(optionContainer);
		}
		
		var startBtn = document.createElement('button');
		startBtn.innerText = "Start";
		startBtn.onclick = function()
		{
			var strategies = [];
			for(let i=0;i<CodeCollision.StrategySelectors.length;i++)
			{
				if (CodeCollision.StrategySelectors[i].checked)
				{
					strategies.push(CodeCollision.StrategySelectors[i].strategy);
				}
			}
			if (strategies.length>0)
			{
				CodeCollision.StartGame(strategies);
			}
		};
		CodeCollision.Container.appendChild(startBtn);
	}
	
	static StartGame(strategies)
	{
		CodeCollision.CompetingStrategies = {};
		for(let i=0;i<strategies.length;i++)
		{
			CodeCollision.CompetingStrategies[strategies[i].name] = { name:strategies[i].name, hasCompeted: false, wins: 0 };
		}
		CodeCollision.CurrentRound = -1;
		CodeCollision.Rounds = CodeCollision.RoundRobin(strategies);
		CodeCollision.PresentMatch();
	}
	
	static RoundRobin(items)
	{
		if (items.length==0)
		{
			return [];
		}
		
		var rounds = [];
		for(let i=0;i<items.length;i++)
		{
			for(let j=i+1;j<items.length;j++)
			{
				rounds.push({ a:items[i], b:items[j] });
			}
		}
		return rounds.length==0? [ { a:items[0],  b:items[0] } ] : rounds.sort(()=>Math.random() - 0.5);
	}
	
	static PresentMatch()
	{	
		if(CodeCollision.CurrentRound>=CodeCollision.Rounds)
		{
			return;
		}
		CodeCollision.PresentLeaderBoard();
		CodeCollision.CurrentRound++;
		let team1 = CodeCollision.Rounds[CodeCollision.CurrentRound].a;
		let team2 = CodeCollision.Rounds[CodeCollision.CurrentRound].b;
		
		CodeCollision.CompetingStrategies[team1.name].hasCompeted = true;
		CodeCollision.CompetingStrategies[team2.name].hasCompeted = true;
		
		CodeCollision.Container.innerHTML = '';
		var h2 = document.createElement('h2');
		h2.innerHTML = 'Round '+(CodeCollision.CurrentRound+1)+' of '+CodeCollision.Rounds.length;
		CodeCollision.Container.appendChild(h2);
		
		var h1 = document.createElement('h1');
		h1.innerHTML = '<span class="home">'+team1.name+'</span> vs. <span class="away">'+team2.name+'</span>';
		CodeCollision.Container.appendChild(h1);
		
		setTimeout(function() { CodeCollision.StartMatch(team1, team2); }, 3000);
	}
	
	static HideLeaderBoard()
	{
		CodeCollision.LeaderBoard.innerHTML = '';
		CodeCollision.LeaderBoard.style.display = 'none';
	}
	
	static PresentLeaderBoard()
	{
		CodeCollision.LeaderBoard.innerHTML = '';
		var leaders = [];
		for(var strategy in CodeCollision.CompetingStrategies)
		{
			if (CodeCollision.CompetingStrategies[strategy].hasCompeted)
			{
				leaders.push({ name: CodeCollision.CompetingStrategies[strategy].name, wins:CodeCollision.CompetingStrategies[strategy].wins });
			}
		}
		
		var h2 = document.createElement('h2');
		h2.innerHTML = 'Leader Board';
		CodeCollision.LeaderBoard.appendChild(h2);
		
		var table = document.createElement('table');
		table.innerHTML = '<tr><td colspan="2">Rank</td><td>Wins<td></tr>';
		CodeCollision.LeaderBoard.appendChild(table);
		
		leaders.sort(function(a,b) { return b.wins - a.wins; });
		for(let i=0;i<leaders.length;i++)
		{
			const oi=i;
			var code = '<tr><td>'+(i+1)+'</td>';
			code += '<td>';
			code += leaders[i].name;
			for(let j=i+1;j<leaders.length;j++)
			{
				if (leaders[j].wins!=leaders[i].wins)
				{
					break;
				}
				code += ", "+leaders[j].name;
				i++;
			}
			code += '</td>';
			code += '<td>'+leaders[oi].wins+'</td></tr>';
			table.innerHTML += code;
		}
		CodeCollision.LeaderBoard.style.display = leaders.length>0? 'block' : 'none';
	}
	
	static FinishMatch()
	{		
		CodeCollision.Container.innerHTML = '';
		var h1 = document.createElement('h1');
		h1.innerHTML = CodeCollision.Game.winner? CodeCollision.Game.winner.name + ' wins!' : 'Game ended in draw';
		
		if (CodeCollision.Game.winner)
		{
			CodeCollision.CompetingStrategies[CodeCollision.Game.winner.name].wins++;
		}
		
		CodeCollision.Container.appendChild(h1);
		
		CodeCollision.PresentLeaderBoard();
		
		CodeCollision.Game = null;
		if(CodeCollision.CurrentRound<CodeCollision.Rounds)
		{
			setTimeout(function() { CodeCollision.PresentMatch(); }, 3000);
		} else {
			setTimeout(function() { CodeCollision.ShowGameOptions(); }, 3000);
		}
	}
	
	static StartMatch(team1, team2)
	{
		CodeCollision.Container.innerHTML = '';
		CodeCollision.HideLeaderBoard();
		
		var canvas = document.createElement("canvas");
		canvas.id = "gameCanvas";
		canvas.width = "1";
		canvas.height = "1";
		CodeCollision.Container.appendChild(canvas);
		
		var btn = document.createElement("button");
		btn.innerHTML = '&#8689;';
		btn.className = 'fullScreenButton';
		btn.onclick = function() { CodeCollision.Game.toggleFullScreen(true); };
		document.body.appendChild(btn);
		
		
		CodeCollision.Game = new CodeCollision.GameType({ canvas: canvas, width:1200, height:700, homeStrategy:team1, awayStrategy:team2, fullScreenButton:btn });
		
		setTimeout(function() { CodeCollision.Game.start(); }, 1000);
	}
}