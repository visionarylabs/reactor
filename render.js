/**
    OPAL GAMES
    VIEW / RENDER
    Just setup and render loop
    assumes box has sprites and board
    rules is loaded with functions
        general game render loop
            handle delta time updates
            draw board and sprite list from state file
        test with:
            weird quest
            away team
            beryillum
            --eventually use for:
                death dome
                monster hunter

    TODO:
        seperate out modules for
            board grid render
            UI render
                menu / score board etc
**/

//global vars
var w = window;
var d = document;
var mouse = {x:0,y:0};

//main toolkit vars
var game = null;
var box = null;
var board = null;
var ren = null;

//interface / timer / canvas
var curTime = 0;
var then = null;
var startTime = null;
var canvas = null;
var ctx = null;

/****
    INTERFACE AND CANVAS RENDER
    NO GAME LOGIC SHOULD BE HERE
    JUST VISUAL & USER INPUT / USER INTERFACE
****/

var ogRender = function(){

    //TIMER SET UP
    then = Date.now();
    startTime = Date.now();

    // create the canvas
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext("2d");
    canvas.width = options.columns * options.tileSize;
    canvas.height = options.rows * options.tileSize;
    canvas.id = 'game-canvas';

    canvas.addEventListener('mousemove', function(e) {
        mouse = getMousePos(canvas,e);
    });

    canvas.addEventListener('mouseout', function(e) {
        mouse = {x:-1,y:-1};
    });

    canvas.addEventListener('click', function(e) {
        click = getMousePos(canvas,e);
        game.processClick(click);
    });

    function getMousePos(canvas,e) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: Math.floor(e.clientX - rect.left),
          y: Math.floor(e.clientY - rect.top)
        };
    }

    var init = function () {
        render();
    };

    // Update game objects
    // Ran from loop with delta modifier
    var update = function (modifier) {
        var i = null;
        var loopLength = null;
        var size = null;
        var color = null;
        var node = null;
        var tempPos = null;
        var gameSpeed = options.gameSpeed;
        var spriteSnap = 2;
        var gameMod = gameSpeed * modifier;
    };

    // RENDERING

    // Draw everything // Ran from loop
    var render = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        renderBoard();
        renderTimer();
        if(options.renderTimer) renderTimer();
        if(options.renderStatic) renderStatic();
    };

    // draw the board
    var renderBoard = function () {
        var i = 0;
        var loopLength = board.length;
        var tile = null;
        for(i; i < loopLength; i++) {
            tile = board[i];
            //draw the tile
            ctx.fillStyle = tile.ui.color;
            ctx.fillRect(tile.ui.x,tile.ui.y,options.tileSize,options.tileSize);
            //see if the mouse if hovering draw a hover
            if(
                tile.ui.x < mouse.x &&
                tile.ui.y < mouse.y &&
                tile.ui.x >= mouse.x - options.tileSize &&
                tile.ui.y >= mouse.y - options.tileSize &&
                tile.action === true
            ){
                ctx.fillStyle = '#fcfbb1';
                ctx.fillStyle = options.tileHoverColor;
                ctx.fillRect(tile.ui.x,tile.ui.y,options.tileSize,options.tileSize);
            }
        }
    }

    // Render Static Elements
    var renderStatic = function () {
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.font = "18px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";

        if( options.gameName ){
            ctx.fillText(options.gameName, 10, 10);
        }

        if( options.levelName ){
            ctx.fillText(options.levelName, 300, 10);
        }

        if(state.state.currentSelection){
            ctx.fillText(state.state.currentSelection, 110, (options.rows * options.tileSize - options.tileSize) );
        }
        ctx.fillText(state.state.history[state.state.history.length-1], 210, (options.rows * options.tileSize - options.tileSize) );
    }

    // Render Timer
    var renderTimer = function () {
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.font = "18px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("Time: " + curTime, 10, (options.rows * options.tileSize - options.tileSize) );
        
        //vars
        var gap = 20;
        var ypos = 0;
        ypos += gap;
        ctx.fillText("Heat: " + state.heat, 10, ypos);         ypos += gap;
        ctx.fillText("Energy: " + state.energy, 10, ypos);        ypos += gap;
        ctx.fillText("Money: " + state.money, 10, ypos);        ypos += gap;
    }

    // The main game loop
    var loop = function () {
        var now = Date.now();
        var delta = now - then;
        update(delta / 1000);
        render();
        then = now;
        curTime = Math.floor( (then - startTime) / 1000 );
        requestAnimationFrame(loop);
    };

    // Cross-browser support
    requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

    return{
        init : init,
        loop : loop
    }
}

game = new gameFactory();
ren = new ogRender();
box = game.getBox();
board = box.board;
ren.init();
ren.loop();
