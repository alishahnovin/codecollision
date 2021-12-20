class Strategy
{
	size = false;
	constructor( )
	{
	}

	initSize(size)
	{
		if (!this.size)
		{
			this.size = size;
		}
	};
	
	execute()
	{
		return { angle:0, power: 10 };
	};
}