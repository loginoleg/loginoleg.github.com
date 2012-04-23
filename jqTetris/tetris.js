var tetris = {

	table_arr: 		[[0,0,0,0,0,0,0,0],  // 0
					 [0,0,0,0,0,0,0,0],  // 1
					 [0,0,0,0,0,0,0,0],  // 2
					 [0,0,0,0,0,0,0,0],  // 3
					 [0,0,0,0,0,0,0,0],  // 4
					 [0,0,0,0,0,0,0,0],  // 5
					 [0,0,0,0,0,0,0,0],  // 6
					 [0,0,0,0,0,0,0,0],  // 7
					 [0,0,0,0,0,0,0,0],  // 8
					 [0,0,0,0,0,0,0,0],  // 9
					 [0,0,0,0,0,0,0,0],  // 10
					 [0,0,0,0,0,0,0,0]], // 11
				   // 0 1 2 3 4 5 6 7
	figures:    [					
					[[[1,1],[1,1]],[[1,1],[1,1]],[[1,1],[1,1]],[[1,1],[1,1]]], // O
					[[[1,0],[1,1],[1,0]],[[1,1,1],[0,1,0]],[[0,1],[1,1],[0,1]],[[0,1,0],[1,1,1]]], // T
				 	[[[1,0],[1,1],[0,1]],[[0,1,1],[1,1,0]],[[1,0],[1,1],[0,1]],[[0,1,1],[1,1,0]]], // S
				 	[[[0,1],[1,1],[1,0]],[[1,1,0],[0,1,1]],[[0,1],[1,1],[1,0]],[[1,1,0],[0,1,1]]],	// Z			 	
				 	[[[1,1],[1,0],[1,0]],[[1,1,1],[0,0,1]],[[0,1],[0,1],[1,1]],[[1,0,0],[1,1,1]]],	// r
				 	[[[1],[1],[1],[1]],[[1,1,1,1]],[[1],[1],[1],[1]],[[1,1,1,1]]], // I				 	
				],

checkFullRow: function()
	{
		for (y = 0; y <= 11; y++)
		{
			isfull = true;
			for(x = 0; x <= 7; x++)
			{
				if (tetris.table_arr[y][x] == 0)
				{
					isfull = false
				}
			}
			if (isfull)
			{
				for (var ly = y; ly > 0; ly--)
				{
					for (var lx = 0; lx <= 7; lx ++)
					{
						tetris.table_arr[ly][lx] = 0;
						tetris.table_arr[ly][lx] = tetris.table_arr[ly-1][lx];
					}
				}
				tetris.points += 8;
				tetris.interval -= 8;
				$('#points').text(tetris.points);
			}
		}
		tetris.render();
	},


	opportunity: function(y, x, figure)
	{
		// Проверяем не выходит ли фигура за границы экрана
		if ((x >= 0) && 
			(x - 1 + tetris.figures[figure.fid][figure.position][0].length <= 7) && 
			(y - 1 + tetris.figures[figure.fid][figure.position].length <= 11))
		{
			// Проверяем не задевает ли фигура сущестующую "постройку"
			for (i = y; i < y + tetris.figures[figure.fid][figure.position].length; i++)
			{
				for (j = x; j < x + tetris.figures[figure.fid][figure.position][0].length; j++)
				{
					if (tetris.table_arr[i][j] == 1 && tetris.figures[figure.fid][figure.position][i-y][j-x] == 1)
					// if(0)
					{
						return false;
					}
				}
			}
			return true;
		}
		else
		{
			return false;
		}
	},

	interval: 0,
	time: 1000,
	curY: 0,
	curX: 0,
	oldY: 0,
	points: 0,

	figure: {
		fid:1,
		position:0
	},

	newFigure: function()
	{
		isGO = false;
		tetris.figure.fid = Math.floor(Math.random() * (tetris.figures.length));

		for (var i = 0; i < 3; i++)
		{
			for (var j = 0; j < 3; j++)
			{
				if(tetris.table_arr[i][j] == 1)
				{
					isGO = true;
				}
			}	
		}

		if (isGO) 
		{
			window.clearInterval(tetris.interval);
			alert('Game Over');
		}
		else
		{
			tetris.curY = 0;
			tetris.curX = 0;
			tetris.printFigure(tetris.curY, tetris.curX, tetris.figure);
			tetris.interval = window.setInterval(tetris.moveDown, tetris.time);
		}
	},

	changePosition: function(initY, initX, figure)
	{
		old_position = figure.position;
		(figure.position != 3) ? figure.position++ : figure.position = 0;
		if (tetris.opportunity(tetris.curY, tetris.curX, figure))
		{
			figure.position = old_position;
			tetris.removeFigure(initY, initX, figure);
			(figure.position != 3) ? figure.position++ : figure.position = 0;
			tetris.printFigure(initY, initX, figure);
		}
		else
		{
			figure.position = old_position;
		}
	},

	printFigure: function(initY, initX, figure)
	{
		for (y = initY; y <= initY - 1 + tetris.figures[figure.fid][figure.position].length; y++)
		{
			for (x = initX; x <= initX - 1 + tetris.figures[figure.fid][figure.position][0].length; x++)
			{
				if (tetris.figures[figure.fid][figure.position][y - initY][x - initX])
				{
					$('#' + y + '_' + x).addClass('selected');
				}
			}
		}
	},

	removeFigure: function(initY, initX, figure)
	{
		for (y = initY; y <= initY - 1 + tetris.figures[figure.fid][figure.position].length; y++)
		{
			for (x = initX; x <= initX - 1 + tetris.figures[figure.fid][figure.position][0].length; x++)
			{
				if (tetris.figures[figure.fid][figure.position][y - initY][x - initX])
				{
					$('#' + y + '_' + x).removeClass('selected');
				}
			}
		}
	},

	moveLeft: function(pos)
	{
		if (tetris.opportunity(tetris.curY, tetris.curX - 1, tetris.figure))
		{
			tetris.removeFigure(tetris.curY, tetris.curX, tetris.figure);
			tetris.printFigure(tetris.curY, --tetris.curX, tetris.figure);
		}
	},

	moveRight: function(pos)
	{
		if (tetris.opportunity(tetris.curY, tetris.curX + 1, tetris.figure))
		{
			tetris.removeFigure(tetris.curY, tetris.curX, tetris.figure);
			tetris.printFigure(tetris.curY, ++tetris.curX, tetris.figure);
		}
	},

	moveDown: function(pos)
	{
		tetris.oldY = tetris.curY;
		if (tetris.opportunity(tetris.curY + 1, tetris.curX, tetris.figure))
		{
			tetris.removeFigure(tetris.curY, tetris.curX, tetris.figure);
			tetris.printFigure(++tetris.curY, tetris.curX, tetris.figure);
		}
		if (tetris.oldY == tetris.curY)
		{
			for (y = tetris.curY; y <= tetris.curY - 1 + tetris.figures[tetris.figure.fid][tetris.figure.position].length; y++)
			{
				for (x = tetris.curX; x <= tetris.curX - 1 + tetris.figures[tetris.figure.fid][tetris.figure.position][0].length; x++)
				{
					if (tetris.figures[tetris.figure.fid][tetris.figure.position][y - tetris.curY][x - tetris.curX])
					{
						$('#' + y + '_' + x).removeClass('selected');
						tetris.table_arr[y][x] = 1;
						window.clearInterval(tetris.interval);
					}
				}
			}
			tetris.checkFullRow();
			tetris.render();
			for (i = 0; i <= 11; i++)
			{
					console.log (tetris.table_arr[i][0],
						tetris.table_arr[i][1],
						tetris.table_arr[i][2],
						tetris.table_arr[i][3],
						tetris.table_arr[i][4],
						tetris.table_arr[i][5],
						tetris.table_arr[i][6],
						tetris.table_arr[i][7]
						);
			}
			tetris.newFigure();
		}
	},

	render: function()
	// Проходит по всему полю и отображает на экран его содержимое:
	// при 1 в массиве подсвечивает "пиксель", при 0 -- выключает.
	{
		for (i = 0; i <= 11; i++)
		{
			for(j = 0; j <= 7; j++)
			{
				if (tetris.table_arr[i][j] == 1)
				{
					$('#' + i + '_' + j).addClass('selected');
				}
				else
				{
					$('#' + i + '_' + j).removeClass('selected');	
				}
			}
		}
	},

	initKey: function()
	{
		$('html').keydown(function(e)
		{
			if (e.which == 37) // left arrow key
			{
				tetris.moveLeft();
			}
			else if (e.which == 38) // top arrow key
			{
				tetris.changePosition(tetris.curY, tetris.curX, tetris.figure);
			}
			else if (e.which == 39) // right arrow key
			{
				tetris.moveRight();
			}
			else if (e.which == 40) // down arrow key
			{
				tetris.moveDown();
			}
		});
	},

	init : function()
	{
		tetris.initKey();
		tetris.render();
		tetris.printFigure(tetris.curY, tetris.curX, tetris.figure);
		tetris.checkFullRow();
		tetris.interval = window.setInterval(tetris.moveDown, tetris.time);
	}
};


$(window).load(function() {
	tetris.init();
});
