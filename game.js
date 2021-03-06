/**
    STATE FOR REACTOR
    Editor Board State and Options
**/
// game setup options
var options = {
    tileSize : 34,
    columns : 9,
    rows : 9,
    gameSpeed : 500,
    gameDelay : 400,
    renderTimer : false,
    renderStatic : false,
    tileActionColor : "rgba(255, 255, 255, 0)", //"rgba(255, 255, 255, 0.4)"
    tileHoverColor : "rgba(252, 251, 177, 0.25)" //"rgba(252, 251, 177, 0.5)"
};

var state = {
    heat : 0,
    energy : 0,
    money : 0
};

/**
    MAIN GAME FACTORY
    make all the game pieces
    game piece templates
**/
var gameFactory = function () {

    const tileFactory = function(num,col,row,tileType,x,y,color) {
        var tile = {
            num : num,
            col : col,
            row : row,
            tileType : tileType,
            contains : [], // reference to sprite in game list
            ui : {
                x : x,
                y : y,
                color : color,
            }
        };
        tile.ui = setUi(x,y,options.tileSize,options.tileSize,color,0,0,0);
        return tile;
    };
    
    /**
        board factory for TOT level editor
    **/
    const boardFactory = function(cols,rows) {
        var board = [];
        var tile = null;
        var iCol = 0;
        var iRow = 0;
        var num = 0;
        var color = null;
        var tileType = null;
        
        for( iRow; iRow < rows; iRow++ ) {
            for( iCol; iCol < cols; iCol++ ) {
                num++;
                if( options.columns % 2 == 0 ) {
                    if( iRow % 2 == 0 ) {
                        if( num % 2 == 0 ) color = '#aaa'; else color = '#bbb';
                    }else{
                        if( num % 2 == 0 ) color = '#bbb'; else color = '#aaa';
                    }
                }else{
                    if( num % 2 == 0 ) color = '#aaa'; else color = '#bbb';
                }
                
                tileType = 'tile';
                
                tile = tileFactory( num, iCol, iRow, tileType, iCol * options.tileSize, iRow * options.tileSize, color );
                tile.action = true; //all true for editor
                board.push(tile);
            }
            iCol = 0;
        }
        
        return board;
    }

    var getTileIdFromClick = function (click) {
        var tileNum = null;
        var iTile = 0;
        var loopLength = board.length;
        for(iTile; iTile < loopLength; iTile++) {
            if(
                board[iTile].ui.x < mouse.x &&
                board[iTile].ui.y < mouse.y &&
                board[iTile].ui.x >= mouse.x - options.tileSize &&
                board[iTile].ui.y >= mouse.y - options.tileSize
            ) {
                return iTile;
            }
        }
    }

    /**
        box is the full data modal of all rules / monster tables decks etc
    **/
    var getBox = function () {

        var board = new boardFactory(options.columns,options.rows);

        //return the game box
        return {
            board : board
        }
        
    }

    var processClick = function(click){
        console.log('test');
        var tileId = getTileIdFromClick(click);
        console.log( board[tileId] );
        return;
    }

    var setUi = function (x,y,w,h,color,ox,oy,io){
        return{
            x : x,
            y : y,
            size : {w:w,h:h},
            color : color,
            image : new Image(),
            shapeOffset : {x:ox,y:oy},
            imageOffset : io,
        }
    }
    
    return {
        getBox : getBox,
        setUi : setUi,
        processClick : processClick
    }
}
//end gameFactory OBJ
