/**
    OG TOOLS / OpalGamesQuest OBJ
    ABSTRACT TOOLS /
        TOOLS
        BOARD

    Assumes:

        box.sprites holds all sprites (pawns, cards, etc)
            sprites.objName obj list by unique slug in a list by spriteType
            e.g. box.sprites.hero.gary-grobeck
            these nodes hold .ui data as well, changes during game but doesn't need to be saved

        box.board holds all tiles

        state = only what is needed to save the game
        state.sprites holds an array of jsut sprites with slug, health, items

        nodes and tiles have ui.x and ui.y
        x and y values are top left corner

        tiles are numbered 1 to x with ids 0 to x-1

        a var options is set with:
            tileSize
            columns
            rows
**/

/**
    super global tools
    global tool kit
    ran as og.tools
    manipulate state.state here
    og.tools.msg
**/
var OpalGamesQuest = function(){

    var cl = function(msg){
        console.log(msg);
    }

    //get sprite from box
    var getNodeBySlug = function(slug){
        for (var spriteType in box.sprites) {
            if (box.sprites.hasOwnProperty(spriteType)) {
                var node = null;
                for (var key in box.sprites[spriteType]) {
                    if (box.sprites[spriteType].hasOwnProperty(key)) {
                        node = box.sprites[spriteType][key];
                        if(node.slug === slug){
                            return node;
                        }
                    }
                }
            }
        }
    }

    var getSpriteBySlug = function(slug){
        for (var spriteType in state.sprites) {
            if (state.sprites.hasOwnProperty(spriteType)) {
                var sprite = null;
                for (var i = 0; i < state.sprites[spriteType].length; i++) {
                    sprite = state.sprites[spriteType][i];
                    if(sprite.slug === slug){
                        return sprite;
                    }
                }
            }
        }
    }

    /**
        ran as og.tools
        basic, node, sprite, deck tools
    **/
    var tools = function (){

        var msg = function(msg){
            state.state.history.push(msg);
        }

        var getRandomSlugByType = function(spriteType){
            if (state.sprites.hasOwnProperty(spriteType)) {
                var list = state.sprites[spriteType];
                if(list.length < 1) return;
                var spriteKey = Math.floor( (Math.random() * list.length ) );
                return state.sprites[spriteType][spriteKey].slug;
            }
        }

        //get sprite from box
        var getNode = function(slug){
            return getNodeBySlug(slug);
        }
        //get sprite from state
        var getSprite = function(slug){
            return getSpriteBySlug(slug);
        }

        var dynamicSort = function(property) {
            var sortOrder = 1;
            if(property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function (a,b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
           }
        }

        var getRandomFromList = function(list){
            var item = null;
            /**
            var i = 0;
            var loopLength = list.length;
            for(i; i < loopLength; i++) {
            }
            **/
            var key = Math.floor((Math.random() * list.length));
            item = list[key];
            return item;
        }

        return{
            mouse : mouse,
            msg : msg,
            getRandomSlugByType : getRandomSlugByType,
            getNode : getNode,
            getSprite : getSprite,
            dynamicSort : dynamicSort,
            getRandomFromList : getRandomFromList,
        }

    }
    /* end tools obj */

    /**
        ran as og.board
        all board functions
    **/
    var board = function () {

        var setStartingTiles = function(spriteType){
            if (!state.sprites.hasOwnProperty(spriteType)){
                return;
            }
            var loopLength = state.sprites[spriteType].length;
            var tileNum = null;
            var sprite = null;
            var tempPos = null;
            var i = 0;
            for(i = 0; i < loopLength; i++) {
                sprite = state.sprites[spriteType][i];
                tileNum = state.sprites[spriteType][i].tile;
                tempPos = getPosFromTileNum(tileNum);
                moveSpriteToTile(sprite.slug,tileNum);
                snapSpriteToTile(sprite.slug,tempPos);
            }
        }

        //on reset -- scramble the board
        var scrambleSprites = function (spriteType) {
            if (!state.sprites.hasOwnProperty(spriteType)){
                return;
            }
            var loopLength = state.sprites[spriteType].length;
            var tileNum = null;
            var sprite = null;
            var tempPos = null;
            var i = 0;
            for(i = 0; i < loopLength; i++) {
                sprite = state.sprites[spriteType][i];
                tileNum = getRandomUnoccupiedTile();
                tempPos = getPosFromTileNum(tileNum);
                moveSpriteToTile(sprite.slug,tileNum);
                snapSpriteToTile(sprite.slug,tempPos);
            }
        }

        var getPosFromTileNum = function (tileNum) {
            var pos = {};
            var tileId = convertTileNumToId(tileNum);

            pos.x = box.board[tileId].ui.x;
            pos.y = box.board[tileId].ui.y;
            return pos;
        }

        var getTileByNum = function (num){
            var tileId = convertTileNumToId(num);
            return box.board[tileId];
        }

        //look through tiles and find empty
        //could need rules edits for double occupants
        var getRandomUnoccupiedTile = function () {
            var getTileNum = Math.floor( (Math.random() * options.rows * options.columns) + 1 );
            var availableTiles = [];
            var loopLength = box.board.length;
            for(i = 0; i < loopLength; i++) {
                if( box.board[i].contains.length === 0 && box.board[i].tileType === 'tile'){
                    availableTiles.push( box.board[i].num );
                }
            }
            var randomKey = Math.floor((Math.random() * availableTiles.length));
            getTileNum = availableTiles[randomKey];
            return getTileNum;
        }

        //Set the sprite state
        var moveSpriteToTile = function (slug,tileNum){
            var sprite = getSpriteBySlug(slug);
            if(!sprite) return;
            var tileId = convertTileNumToId(sprite.tile);
            box.board[tileId].contains = []; //set the sprite tile to be empty
            sprite.tile = tileNum; //set the sprite tile num to the new num
            box.board[sprite.tile - 1].contains.push(sprite.slug);
        }

        var snapSpriteToTile = function (slug,pos){
            var node = getNodeBySlug(slug);
            node.ui.x = pos.x;
            node.ui.y = pos.y;
        }

        var getAdjacentTiles = function (tileNum,unoccupied){
            var tiles = [];
            var loopLength = box.board.length;
            var id = convertTileNumToId(tileNum);
            var tile = box.board[id];
            var distance = 2;
            for(i = 0; i < loopLength; i++) {
                if(
                    Math.abs(tile.col - box.board[i].col) <= (distance) &&
                    Math.abs(tile.row - box.board[i].row) <= (distance) &&
                    //box.board[i].contains.length == 0 &&
                    box.board[i].num != tileNum
                ){
                    if(unoccupied == true && box.board[i].contains.length == 0){
                        tiles.push(box.board[i].num);
                    }else if(unoccupied == false){
                        tiles.push(box.board[i].num);
                    }
                }
            }
            return tiles;
        }

        var getAdjacentUnoccupiedTiles = function (tileNum){
            var tiles = [];
            var loopLength = box.board.length;
            var id = convertTileNumToId(tileNum);
            var tile = box.board[id];
            var distance = 2;
            for(i = 0; i < loopLength; i++) {
                if(
                    Math.abs(tile.col - box.board[i].col) <= (distance) &&
                    Math.abs(tile.row - box.board[i].row) <= (distance) &&
                    box.board[i].contains.length == 0 &&
                    box.board[i].num != tileNum
                ){
                    tiles.push(box.board[i].num);
                }
            }
            return tiles;
        }

        //returns and marks for render possilbe action tiles
        var markActionTiles = function (tiles){
            var loopLength = tiles.length;
            for(i = 0; i < loopLength; i++) {
                var id = convertTileNumToId(tiles[i])
                var tile = box.board[id];
                tile.action = true;
            }
            if( rules.hasOwnProperty('processActionTiles') ){
                return rules.processActionTiles(tiles);
            }
        }

        var clearActionTiles = function (tiles){
            var loopLength = box.board.length;
            for(i = 0; i < loopLength; i++) {
                box.board[i].action = false;
                box.board[i].target = false;
                box.board[i].current = false;
            }
        }

        var clearAllTiles = function (tiles){
            var loopLength = box.board.length;
            for(i = 0; i < loopLength; i++) {
                var tile = box.board[i].contains = [];
            }
        }

        //TOOLS PRIVATE

        var getTileNumFromClick = function (click) {
            var tileNum = null;
            var iTile = 0;
            var loopLength = box.board.length;
            for(iTile; iTile < loopLength; iTile++) {
                if(
                    box.board[iTile].ui.x < mouse.x &&
                    box.board[iTile].ui.y < mouse.y &&
                    box.board[iTile].ui.x >= mouse.x - options.tileSize &&
                    box.board[iTile].ui.y >= mouse.y - options.tileSize
                ) {
                    tileNum = box.board[iTile].num;
                }
            }
            return tileNum;
        }

        var convertTileNumToId = function ( num ){
            var tileId = num - 1;
            return tileId;
        }

        return{
            getPosFromTileNum : getPosFromTileNum,
            getRandomUnoccupiedTile, getRandomUnoccupiedTile,
            moveSpriteToTile : moveSpriteToTile,
            getTileNumFromClick : getTileNumFromClick,
            getTileByNum : getTileByNum,
            setStartingTiles : setStartingTiles,
            scrambleSprites : scrambleSprites,
            snapSpriteToTile : snapSpriteToTile,
            getAdjacentTiles : getAdjacentTiles,
            markActionTiles : markActionTiles,
            clearActionTiles : clearActionTiles,
            clearAllTiles : clearAllTiles,
            convertTileNumToId : convertTileNumToId,
        }
    } //END Board OBJ

    //return global tools obj
    //og.tools & og.board
    return{
        cl : cl,
        tools : new tools(),
        board : new board(),
    }
}