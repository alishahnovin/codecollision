class Editor
{
	console = false;
	testStrategy = false;
	editsCount=0;
	enabled = false;
	strategies = [];
	strategySelection = false;
	defaultStrategy = false;
	defaultName = 'newStrategy';
	
	//todo: there's a lot going on in here too...
	
	constructor()
	{
		this.Container  = document.createElement("div");
		this.Container.className = "editorContainer";
		this.startY = 0;
		this.startHeight = 0;
		
		this.resizer = document.createElement('div');
		this.resizer.className = 'resizer';
		this.resizer.editor = this;
		document.documentElement.editor = this;
		this.Container.appendChild(this.resizer);
		this.resizer.resizeMove = function(e)
		{
			this.editor.Container.style.height = (this.editor.Container.startHeight + this.editor.Container.startY - e.clientY) + 'px';
			this.editor.editor.resize();
		};
		this.resizer.resizeStop = function(e)
		{
			document.documentElement.removeEventListener('mousemove', this.editor.resizer.resizeMove, false);
			document.documentElement.removeEventListener('mouseup', this.editor.resizer.resizeStop, false);
		};
		this.resizer.resizeStart = function(e)
		{
			this.editor.Container.startY = e.clientY;
			this.editor.Container.startHeight = parseInt(document.defaultView.getComputedStyle(this.editor.Container).height, 10);
			document.documentElement.addEventListener('mousemove', this.resizeMove, false);
			document.documentElement.addEventListener('mouseup', this.resizeStop, false);
		};
		this.resizer.addEventListener('mousedown', this.resizer.resizeStart, false);
		
		let editor = document.createElement("div");
		editor.id = 'editor';
		document.body.appendChild(this.Container);
		this.Container.appendChild(editor);
		this.editor = ace.edit("editor");
		this.editor.setTheme("ace/theme/chrome");
		this.editor.session.setMode("ace/mode/javascript");

		this.console = document.createElement("textarea");
		this.console.className = "console";
		this.console.readOnly = true;
		this.Container.appendChild(this.console);
		
		let toolbar = document.createElement('div');
		toolbar.className = 'editorToolbar';
		this.Container.appendChild(toolbar);
		
		this.strategySelection = document.createElement("select");
		this.strategySelection.editor = this;
		this.strategySelection.onchange = function() { this.editor.menuSelectionChange(); };
		toolbar.appendChild(this.strategySelection);
		this.refreshStrategySelection();
		
		this.strategyNameInput = document.createElement("input");
		this.strategyNameInput.type = 'text';
		this.strategyNameInput.value = this.defaultName;
		this.strategyNameInput.onkeypress = function(event){
			var ew = event.which;
			if(48 <= ew && ew <= 57)
				return true;
			if(65 <= ew && ew <= 90)
				return true;
			if(97 <= ew && ew <= 122)
				return true;
			return false;
		};
		toolbar.appendChild(this.strategyNameInput);
		
		let testBtn = document.createElement("button");
		testBtn.className = 'testBtn';
		testBtn.title = 'Run';
		testBtn.innerHTML = 'Run';
		testBtn.editor = this;
		testBtn.onclick = function() { this.editor.runStrategyTest(); };
		toolbar.appendChild(testBtn);
		
		let saveBtn = document.createElement("button");
		saveBtn.className = 'saveBtn';
		saveBtn.title = 'Save File';
		saveBtn.innerHTML = 'Save File';
		saveBtn.editor = this;
		saveBtn.onclick = function() { this.editor.save(); };
		toolbar.appendChild(saveBtn);
		
		let closeBtn = document.createElement("button");
		closeBtn.className = 'closeBtn';
		closeBtn.title = 'Close Editor';
		closeBtn.innerHTML = 'Close Editor';
		closeBtn.editor = this;
		closeBtn.onclick = function() { this.editor.hide(); };
		toolbar.appendChild(closeBtn);
	}
	
	menuSelectionChange()
	{
		var code = false;
		if (this.strategySelection.value==-1)
		{
			this.strategySelection.selectedIndex = 0;
			CodeCollision.BrowseLocalFiles();
			return;
		}
		else if (this.strategySelection.value == this.defaultStrategy.label)
		{	
			code = (new this.defaultStrategy()).execute.toString();
			this.strategyNameInput.value = this.defaultName;
		}
		else
		{
			for(let i=0;i<CodeCollision.Strategies.length;i++)
			{
				if (CodeCollision.Strategies[i].name.toLowerCase() == this.strategySelection.value.toLowerCase())
				{
					code = (new CodeCollision.Strategies[i]()).execute.toString();
					this.strategyNameInput.value = 'new'+CodeCollision.Strategies[i].name;
					break;
				}
			}
		}
		
		if (code)
		{
			this.editor.setValue(code, -1);
			this.output('Ready');
			this.runStrategyTest();
		}
	};
	
	refreshStrategySelection()
	{
		this.strategySelection.innerHTML = '';
		
		let newItem = document.createElement("option");
		newItem.className = 'bold';
		newItem.id = this.testStrategy;
		newItem.innerText = 'New';
		newItem.value = this.testStrategy.label;
		newItem.selected = true;
		this.strategySelection.appendChild(newItem);
		
		let loadItem = document.createElement("option");
		loadItem.className = 'bold';
		loadItem.id = -1;
		loadItem.innerText = 'Load';
		loadItem.value = -1;
		this.strategySelection.appendChild(loadItem);
		
		let group = document.createElement("optgroup");
		group.label = 'Strategies';
		for(let i=0;i<CodeCollision.Strategies.length;i++)
		{
			if (!(CodeCollision.Strategies[i].prototype instanceof CodeCollision.GameType.baseStrategy) || CodeCollision.Strategies[i].label.toLowerCase() == this.defaultName.toLowerCase())
			{
				continue;
			}
			
			let optionItem = document.createElement("option");
			optionItem.id = CodeCollision.Strategies[i].label;
			optionItem.innerText = CodeCollision.Strategies[i].label;
			optionItem.value = CodeCollision.Strategies[i].label;
			group.appendChild(optionItem);
		}
		if (group.children.length>0)
		{
			this.strategySelection.appendChild(group);
		}
	}
	
	async save()
	{
		const handle = await window.showSaveFilePicker({
			suggestedName: this.strategyNameInput.value+'.js',
            types: [
                {
                    accept: {
                        'text/plain': ['.js'],
                    },
                },
            ],
        })
  
        const writable = await handle.createWritable();
  
        await writable.write(this.getCode());
          
        await writable.close();
	}
	
	output(s)
	{
		this.console.value += ' > '+s+'\r\n';
		this.console.scrollTop = this.console.scrollHeight;
	}
	
	show()
	{
		this.console.value = '';
		this.strategies = [];
		this.defaultStrategy = CodeCollision.GameTypes[CodeCollision.GameType.label].baseStrategy;
		this.defaultStrategy.label = this.defaultName;
		this.enabled = true;
		this.Container.style.display = 'block';
		this.refreshStrategySelection();
		var code = (new this.defaultStrategy()).execute.toString();
		this.editor.setValue(code, -1);
		this.output('Ready');
		this.runStrategyTest();
	}
	
	hide()
	{
		if (CodeCollision.Game)
		{
			CodeCollision.Game.stop();
		}
		this.enabled = false;
		this.Container.style.display = 'none';
		for(let i=0;i<this.strategies.length;i++)
		{
			CodeCollision.Unregister(this.strategies[i]);
		}
		CodeCollision.PresentGameOptions();
	}
	
	getCode(label)
	{
		var strategyCode = 'class '+(label?? this.strategyNameInput.value)+' extends '+CodeCollision.GameTypes[CodeCollision.GameType.label].baseStrategy.name+' {\r\n';
		strategyCode += 'static strategy = CodeCollision.Register(this); //REQUIRED\r\n\r\n';
		strategyCode += this.editor.getValue() + '\r\n}';
		return strategyCode;
	}
	
	runStrategyTest()
	{
		this.output("Compiling...");
		
		this.testStrategy = false;
	
		this.editsCount++;	
		var strategyType = this.strategyNameInput.value+this.editsCount;
		var strategyCode = this.getCode(strategyType);
		try {
			var script = document.createElement("script");
			script.textContent = strategyCode;
			document.body.appendChild(script);
			
			for(let i=0;i<CodeCollision.Strategies.length;i++)
			{
				if (CodeCollision.Strategies[i].name.toLowerCase() == strategyType.toLowerCase())
				{
					CodeCollision.Strategies[i].label = this.strategyNameInput.value;
					this.testStrategy = CodeCollision.Strategies[i];
					this.strategies.push(this.testStrategy);
					break;
				}
			}

			if (this.testStrategy)
			{
				this.output("Running...");
				CodeCollision.StartMatch(this.testStrategy, this.testStrategy);
			} else {
				this.output('Error');
			}
		}
		catch(e)
		{
			this.output(e);
		}
	}	
}