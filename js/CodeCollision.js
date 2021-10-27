class CodeCollision
{
	static LeaderBoard = false;
	static Container = false;
	static InGameOptions = false;
	
	static Rounds = [];
	static CurrentRound = 0;
	
	static StrategySelectors = []; //the inputs, used to verify that the strategy has been selected or not...also used for 'select all/none';
	static CompetingStrategies = []; //these are the strategies that are selected to go head to head for a competition
	static Strategies = []; //these are all the registered stratetgie, not part of the game...
	
	static GameTypes =
	{
		'Floor is Lava':'floorislava',
		'Soccer':'soccer',
		'Soccer Chess':'soccerchess',
		'Sumo':'sumo',
	};
	static GameType = false;
	
	static Initialize()
	{
		var gameTypes = CodeCollision.GameTypes;
		CodeCollision.GameTypes = [];
		for(var gameType in gameTypes)
		{
			CodeCollision.RegisterGameType(gameType, gameTypes[gameType]);
		}		
		
		CodeCollision.Container = document.createElement("div");
		CodeCollision.Container.className = 'gameContainer';
		document.body.appendChild(CodeCollision.Container);
				
		CodeCollision.LeaderBoard = document.createElement("div");
		CodeCollision.LeaderBoard.className = 'leaderBoard';
		CodeCollision.LeaderBoard.style.display = 'none';
		document.body.appendChild(CodeCollision.LeaderBoard);
		
		CodeCollision.InGameOptions = document.createElement("div");
		CodeCollision.InGameOptions.className = 'ingameOptions';
		CodeCollision.InGameOptions.style.display = 'none';
		document.body.appendChild(CodeCollision.InGameOptions);
		
		let skipBtn = document.createElement("button");
		skipBtn.innerHTML = '&#187;';
		skipBtn.title = 'Skip Match';
		skipBtn.onclick = function() {
			if (confirm("Skip this match?"))
			{
				CodeCollision.SkipMatch(CodeCollision.Game.homeTeam.score!=CodeCollision.Game.awayTeam.score && confirm("Award game to " + (CodeCollision.Game.homeTeam.score>CodeCollision.Game.awayTeam.score ? CodeCollision.Game.homeTeam.strategy.name :  CodeCollision.Game.awayTeam.strategy.name) + "?"));
			}
		};
		CodeCollision.InGameOptions.appendChild(skipBtn);
		
		let stopBtn = document.createElement("button");
		stopBtn.innerHTML = '&#215;';
		stopBtn.title = 'End Game';
		stopBtn.onclick = function() {
			if (confirm("End all rounds?"))
			{
				CodeCollision.StopGame();
			}
		};
		CodeCollision.InGameOptions.appendChild(stopBtn);
		
		let fullScreenBtn = document.createElement("button");
		fullScreenBtn.innerHTML = '&#8689;';
		fullScreenBtn.title = 'Toggle full-screen mode';
		fullScreenBtn.onclick = function() { CodeCollision.ToggleFullScreen(true); };
		CodeCollision.InGameOptions.appendChild(fullScreenBtn);
		if (document.addEventListener)
		{
			document.addEventListener('fullscreenchange', function() { CodeCollision.ToggleFullScreen(CodeCollision.GetIsFullScreen());}, false);
			document.addEventListener('mozfullscreenchange', function() { CodeCollision.ToggleFullScreen(CodeCollision.GetIsFullScreen()); }, false);
			document.addEventListener('MSFullscreenChange', function() { CodeCollision.ToggleFullScreen(CodeCollision.GetIsFullScreen()); }, false);
			document.addEventListener('webkitfullscreenchange', function() { CodeCollision.ToggleFullScreen(CodeCollision.GetIsFullScreen()); }, false);
		}
		CodeCollision.PresentHeader();
	}
	
	static Launch(game)
	{
		require('js/'+game+'/init.js');
	}
	
	static RegisterGameLoaded({ label, gameType, baseStrategy, playerType, teamType })
	{
		CodeCollision.GameTypes[label].label = label;
		CodeCollision.GameTypes[label].baseStrategy = baseStrategy;
		CodeCollision.GameTypes[label].gameType = gameType;
		CodeCollision.GameTypes[label].playerType = playerType;
		CodeCollision.GameTypes[label].teamType = teamType;
		CodeCollision.GameTypes[label].hasLaunched = true;
		CodeCollision.PresentGameOptions();
	}
	
	static RegisterGameType(label, path)
	{
		CodeCollision.GameTypes[label] = { path:path, hasLaunched:false };
	}
	
	static Register(type)
	{
		if (type.prototype instanceof CodeCollision.GameType.baseStrategy)
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
				var contents = e.target.result;
				var script = document.createElement("script");
				script.textContent = 'try { ' + contents + ' } catch(e) { console.log("Failed to load file: " + e); }';
				document.body.appendChild(script);
				filesLoaded++;
			};
			filesToLoad++;
			reader.readAsText(file);
		}
		
		var loadStrategyTimer = setInterval(function()
		{
			if (filesLoaded>0 && filesLoaded==filesToLoad && CodeCollision.Strategies.length>0)
			{
				clearInterval(loadStrategyTimer);
				CodeCollision.PresentGameOptions();
			}
		}, 100);
	}
	
	static PresentHeader()
	{
		CodeCollision.Container.innerHTML = '';
		var img = document.createElement('img');
		img.src = "assets/smalllogo.png";
		CodeCollision.Container.appendChild(img);
		
		var selectGame = document.createElement('select');
		CodeCollision.Container.appendChild(selectGame);
		
		var defaultOption = document.createElement('option');
		defaultOption.innerText = 'Select game';
		defaultOption.game = false;
		selectGame.appendChild(defaultOption);
		
		for(var game in CodeCollision.GameTypes)
		{
			var gameOption = document.createElement('option');
			gameOption.innerText = game.toLowerCase();
			gameOption.game = CodeCollision.GameTypes[game];
			if (CodeCollision.GameType == gameOption.game)
			{
				gameOption.selected = true;
			}			
			selectGame.appendChild(gameOption);
		}
		selectGame.onchange = function(e)
		{
			const selection = e.currentTarget;
			if (!selection.options[selection.selectedIndex].game) { return; }
			CodeCollision.GameType = selection.options[selection.selectedIndex].game;
			if (CodeCollision.GameType.hasLaunched)
			{
				CodeCollision.PresentGameOptions();				
			} else {
				CodeCollision.Launch(CodeCollision.GameType.path);
			}
		};
	}
	
	static PresentGameOptions()
	{
		CodeCollision.Container.innerHTML = '';
		
		CodeCollision.Container.className = "gameContainer";
		
		document.title = ("code / collision: " + CodeCollision.GameType.label).toLowerCase();
		CodeCollision.PresentHeader();
		
		CodeCollision.InGameOptions.style.display = 'none';
		CodeCollision.StrategySelectors = [];
		var strategyFiles = document.createElement("input");
		strategyFiles.type = "file";
		strategyFiles.multiple = true;
		strategyFiles.id = "strategyFiles";
		strategyFiles.accept = ".js";
		strategyFiles.style.display = "none";
		strategyFiles.addEventListener('change', CodeCollision.LoadStrategies, false);
		CodeCollision.Container.appendChild(strategyFiles);
		
		var strategyActionBtn = document.createElement("button");
		strategyActionBtn.innerHTML = "Load Strategies";
		strategyActionBtn.onclick = function() { strategyFiles.click(); }
		CodeCollision.Container.appendChild(strategyActionBtn);
		
		if (CodeCollision.Strategies.filter(x => x.prototype instanceof CodeCollision.GameType.baseStrategy).length>0)
		{
			var startBtn = document.createElement('button');
			startBtn.innerText = "Start";
			startBtn.className = "redBtn";
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
					CodeCollision.StartGame(strategies.sort(()=>{ return Math.random() - 0.5; }));
				}
			};
			CodeCollision.Container.appendChild(startBtn);
					
			var menuSelection = document.createElement('div');
			menuSelection.className = 'menuSelection';
			CodeCollision.Container.appendChild(menuSelection);
			
			for(let i=0;i<CodeCollision.Strategies.length;i++)
			{
				if (!(CodeCollision.Strategies[i].prototype instanceof CodeCollision.GameType.baseStrategy))
				{
					continue;
				}
				
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
				label.htmlFor = input.id;
				label.innerHTML = CodeCollision.Strategies[i].name;
				optionContainer.appendChild(label);
				
				menuSelection.appendChild(optionContainer);
			}
			
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
			CodeCollision.Container.appendChild(seletionBtnContainer);
		}
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
	return rounds.length==0? [ { a:items[0],  b:items[0] } ] : rounds.sort(()=>{return Math.random() - 0.5;});
	}
	
	static PresentMatch()
	{	
		if(CodeCollision.CurrentRound>=CodeCollision.Rounds.length)
		{
			return;
		}
		CodeCollision.Container.className = "gameContainer";
		CodeCollision.InGameOptions.style.display = 'none';
		CodeCollision.PresentLeaderBoard();
		CodeCollision.CurrentRound++;
		let team1 = CodeCollision.Rounds[CodeCollision.CurrentRound].a;
		let team2 = CodeCollision.Rounds[CodeCollision.CurrentRound].b;
		
		CodeCollision.CompetingStrategies[team1.name].hasCompeted = true;
		CodeCollision.CompetingStrategies[team2.name].hasCompeted = true;
		
		CodeCollision.Container.innerHTML = '';
		if(CodeCollision.Rounds.length>1)
		{
			var h2 = document.createElement('h2');
			h2.innerHTML = 'Round '+(CodeCollision.CurrentRound+1)+' of '+CodeCollision.Rounds.length;
			CodeCollision.Container.appendChild(h2);
		}
		
		var h1 = document.createElement('h1');
		h1.innerHTML = '<span class="home">'+team1.name+'</span> vs. <span class="away">'+team2.name+'</span>';
		CodeCollision.Container.appendChild(h1);
		
		document.title = ("code / collision: " + CodeCollision.GameType.label + " - " + team1.name + " vs. " + team2.name).toLowerCase();
		
		setTimeout(function() { CodeCollision.StartMatch(team1, team2); }, 3000);
	}
	
	static HideLeaderBoard()
	{
		CodeCollision.LeaderBoard.innerHTML = '';
		CodeCollision.LeaderBoard.style.display = 'none';
	}
	
	static SkipMatch(award)
	{
		CodeCollision.Game.stop();
		CodeCollision.Game.winner = award? (CodeCollision.Game.homeTeam.score>CodeCollision.Game.awayTeam.score ? CodeCollision.Game.homeTeam.strategy : CodeCollision.Game.awayTeam.strategy) : false;
		CodeCollision.FinishMatch();
	}
	
	static StopGame()
	{
		if (CodeCollision.Game!=null)
		{
			CodeCollision.Game.stop();
		}
		CodeCollision.PresentGameOptions();
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
		table.innerHTML = '<tr><td colspan="2"><strong>Strategy</strong></td><td><strong>Wins</strong></td></tr>';
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
		document.title = ("code / collision: " + CodeCollision.GameType.label).toLowerCase();
		
		CodeCollision.InGameOptions.style.display = 'none';
		CodeCollision.Container.className = "gameContainer";
		CodeCollision.Container.innerHTML = '';
		var h1 = document.createElement('h1');
		let h1Class = CodeCollision.Game.winner && CodeCollision.Game.winner == CodeCollision.Game.homeTeam.strategy? 'home' : 'away';
		h1.innerHTML = CodeCollision.Game.winner? '<span class="'+h1Class+'">'+CodeCollision.Game.winner.name + '</span> wins!' : 'Game ended in draw';
		CodeCollision.Game.stop();
		if (CodeCollision.Game.winner)
		{
			CodeCollision.CompetingStrategies[CodeCollision.Game.winner.name].wins++;
		}
		CodeCollision.Container.appendChild(h1);
		
		CodeCollision.PresentLeaderBoard();
		
		CodeCollision.Game = null;
		if(CodeCollision.CurrentRound+1<CodeCollision.Rounds.length)
		{
			setTimeout(function() { CodeCollision.PresentMatch(); }, 3000);
		} else {
			setTimeout(function() { CodeCollision.PresentGameOptions(); }, 3000);
		}
	}
	
	static GetIsFullScreen()
	{
		return document.fullscreenElement || document.webkitFullscreenElement ||  document.msFullscreenElement;
	}
	
	static ToggleFullScreen(toggle)
	{
		if (CodeCollision.Game)
		{
			CodeCollision.Game.scale = toggle? 1 : 0.5;
			CodeCollision.Game.redraw();
		}
		if (toggle && !document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement)
		{
			if (document.documentElement.requestFullscreen)
			{
				document.documentElement.requestFullscreen();
			}
			else if (document.documentElement.msRequestFullscreen)
			{
				document.documentElement.msRequestFullscreen();
			}
			else if (document.documentElement.mozRequestFullScreen)
			{
				document.documentElement.mozRequestFullScreen();
			}
			else if (document.documentElement.webkitRequestFullscreen)
			{
				document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			}
		}
		CodeCollision.Container.className = toggle? "fullScreenGameContainer" : "gameContainer";
		CodeCollision.InGameOptions.style.display = toggle? 'none' : 'block';
	}
	
	static StartMatch(team1, team2)
	{
		CodeCollision.Container.innerHTML = '';
		CodeCollision.HideLeaderBoard();
		CodeCollision.InGameOptions.style.display = CodeCollision.GetIsFullScreen()? 'none' : 'block';
		CodeCollision.Container.className = CodeCollision.GetIsFullScreen()? "fullScreenGameContainer" : "gameContainer";
		
		CodeCollision.Game = new CodeCollision.GameType.gameType({ homeStrategy:team1, awayStrategy:team2, playerType:CodeCollision.GameType.playerType, teamType: CodeCollision.GameType.teamType });
		CodeCollision.Container.appendChild(CodeCollision.Game.canvas);
		
		setTimeout(function() { CodeCollision.Game.start(); }, 1000);
	}
}