(function() {
    
    var clients = require('../client/client.js');
    // Global Constants
    var CONST = {};
    CONST.AVAILABLE_TANKS = ['tank_5', 'tank_4', 'tank_3', 'tank_3', 'tank_2'];
    // You are player 0 and the computer is player 1
    // The virtual player is used for generating temporary ships
    // for calculating the probability heatmap
    CONST.PLAYER = 0;
    CONST.ENEMY = 1;
    // Possible values for the parameter `type` (string)
    CONST.CSS_TYPE_EMPTY = 'empty';
    CONST.CSS_TYPE_TANK = 'tank';
    CONST.CSS_TYPE_MISS = 'miss';
    CONST.CSS_TYPE_HIT = 'hit';
    CONST.CSS_TYPE_DESTROYED = 'destroyed';
    // Grid code:
    CONST.TYPE_EMPTY = 0; // 0 = ground (empty)
    CONST.TYPE_TANK = 1; // 1 = undamaged tank
    CONST.TYPE_MISS = 2; // 2 = ground with a cannonball in it
    CONST.TYPE_HIT = 3; // 3 = damaged tank (hit shot)
    CONST.TYPE_DESTROYED = 4; // 4 = destroyed tank
    
    Game.Used_tanks = [CONST.UNUSED, CONST.UNUSED, CONST.UNUSED, CONST.UNUSED, CONST.UNUSED];
    CONST.USED = 1;
    CONST.UNUSED = 0;

    function Statis(){
        this.shots_taken = 0;
        this.shots_hit = 0;
        this.total_shots = parseInt(localStorage.getItem("total_shots"), 9) || 0;
        this.total_hits = parseInt(localStorage.getItem("total_hits"), 9) || 0;
        this.games_played = parseInt(localStorage.getItem("games_played"), 9) || 0;
        this.games_won = parseInt(localStorage.getItem("games_won"), 9) || 0;
    }
    Statis.prototype.shot_taken = function(){
        this.shots_taken ++;
    }
    Statis.prototype.shot_hit = function(){
        this.shot_hit ++;
    }
    //increment games_won and games_lost as well as sync soon
    function Game(size)
    {
        this.currentPlayer = -1;
        Game.size = size;
        this.gameover = false;
        this.shot_taken = 0;
        this.shot_hit = 0;
        this.Init();

    }
    Game.prototype.getState = function(player){
        if(CONST.PLAYER == player){
            this.PLAYER = player;
            this.ENEMY = CONST.ENEMY;
        }
        if(CONST.ENEMY == player){
            this.PLAYER = player;
            this.ENEMY = CONST.PLAYER;
        }
    }
    Game.prototype.Init() = function(){
        this.PLAYERGrid = new Grid(Game.size);
        this.ENEMYGrid = new Grid(Game.size);
        this.PLAYER_Division = new Division(this.PLAYERGrid, CONST.PLAYER);
        this.ENEMY_Division = new Division(this.ENEMYGrid, CONST.ENEMY);

        Game.Statis = new Statis();
        
    }
    Game.prototype.shoot = function(x, y, player){
        var grid;
        var division;
        if(player == CONST.PLAYER){
            grid = this.playerGrid;
            division = this.PLAYER_Division;
        }
        else if(player == CONST.ENEMY){
            grid = this.ENEMYGrid;
            division = this.ENEMY_Division;
        }
        else{
            console.log("Error in finding the correct player to shoot him");
        }
        if((grid.hit()) || (grid.miss)){
            return null;
        }
        else if(grid.undamagedTank){
            grid.updateCell(x, y, 'hit', player);
            division.getTank(x, y).takeDamage;
            this.check_win();
            return CONST.TYPE_HIT;
        }
        else{
            grid.updateCell(x, y, 'miss', player);
            this.check_win();
            return CONST.TYPE_MISS;
        }
    };
    Game.prototype.win = function(player){
        socketz.emmit("winner", player);
        Game.gameover = true;
        Game.Statis
        Game.Statis.sync();
        Game.Statis.updateStats();
    }
    Game.prototype.setTurn =function(turnState) {
        if(!this.gameover) {
          var turn = turnState;
          if(turn) {
            $('#turn-status').removeClass('alert-opponent-turn').addClass('alert-your-turn').html('It\'s your turn!');
          } else {
            $('#turn-status').removeClass('alert-your-turn').addClass('alert-opponent-turn').html('Waiting for opponent.');
          }
        }
      };
    Game.prototype.check_win = function(){
        const socketz = io();
        if(this.PLAYER_Division.allTanksDestroyed()){
            Game.win(CONST.ENEMY);
            return true;
        }
        else if(this.ENEMY_Division.allTanksDestroyed()){
            Game.win(CONST.PLAYER);
            return true;
        }
        return false;
    };
    function Grid(size){
        this.size = size;
        this.cells = [];
        this.init();
    }
    Grid.prototype.init = function(){
        for( var y = 0; y < this.size; y++){
            var row = [];
            this.cells[y] = row;
            for( var x = 0; x < this.size; x++){
                row.push(CONST.TYPE_EMPTY);
            }
        }
    }
    Grid.prototype.updateCell = function(x, y, type, playerr){
        var player;
        //check which player's grid is targeted by the function
        if(playerr == CONST.PLAYER1){
            player = 'player1';
        }
        else if(playerr == CONST.PLAYER2){
            player = 'player2';
        }
        else{
            console.log("There was an error finding the players");
        }
        //set the specific css type for the specific cell targeted by the function, considering hte type of action that 
        //took place in that cell
        switch(type){
            case CONST.CSS_TYPE_EMPTY:
                this.cells[x][y] = CONST.TYPE_EMPTY;
                break;
            case CONST.CSS_TYPE_MISS:
                this.cells[x][y] = CONST.TYPE_MISS;
                break;
            case CONST.CSS_TYPE_TANK:
                this.cells[x][y] = CONST.TYPE_TANK;
                break;
            case CONST.CSS_TYPE_HIT:
                this.cells[x][y] = CONST.TYPE_HIT;
                break;
            case CONST.CSS_TYPE_DESTROYED:
                this.cells[x][y] = CONST.TYPE_DESTROYED;
                break;
            default:
                this.cells[x][y] = CONST.TYPE_EMPTY;
                break;
        }
        var classes = ['grid_cells', 'coordinates-' + x + '-' + y, 'grid-' + type];
        //set the specific attribute for each cell, considering what that cell represents 
        document.querySelector('.' + player + 'coordinates-' + x + '-' + y).setAttribute('class', classes.join(' '));
    };
    //Checks to see if a cell contains an undamaged tank
    Grid.prototype.undamagedTank = function(x, y){
        return this.cells[x][y] === CONST.TYPE_TANK;
    };
    //Checks for a cell containing no tank and past hits from enemy's cannon ball inside of it
    Grid.prototype.miss = function(x, y){
        return this.cells[x][y] === CONST.TYPE_MISS;
    };
    //Check if a cell has already been targeted by enemy cannon ball and has parts of a tank inside of it
    Grid.prototype.hit = function(x, y){
        return (this.cells[x][y] === CONST.TYPE_HIT) || (this.cells[x][y] === CONST.TYPE_DESTROYED);
    };
    function Division(playerrGrid, playerr){
        this.remainingTanks = CONST.AVAILABLE_TANKS.length;
        this.playerGrid = playerrGrid;
        this.player = playerr;
        this.DivisionSetup = [];
        this.populate();
    }
    Division.prototype.populate = function(){
        for( var i = 0; i < this.remainingTanks; i++){
            this.DivisionSetup.push(new Tank(CONST.AVAILABLE_TANKS[i], this.playerGrid, this.player));
        }
    }
    Division.prototype.placeTank = function(x, y, direction, tankkType){
        var tankcoords;
        for( var i = 0; i < this.DivisionSetup.length; i++){
            if(tankkType == this.DivisionSetup[i].type){
                this.DivisionSetup[i].create(x, y, direction);
                tankcoords = this.DivisionSetup[i].getAllCells();
                for(var j = 0; j < tankcoords.length; j++){
                    this.playerGrid.updateCell(tankcoords[j].x, tankcoords[j].y, 'tank', this.player);
                }
            }
        }
    }
    Division.prototype.getTank = function(x, y){
        for(var i = 0; i < this.DivisionSetup.length; i++){
            var tank = this.DivisionSetup[i];
            var tankcoord = this.DivisionSetup[i].getAllCells;
            for(var j =0; j < tankcoord.length; j++){
                if((tankcoord[j].x == x) && (tankcoord[j].y == y)){
                    return tank;}
                }
            }
        }
    Division.prototype.allTanksDestroyed = function(){
        for(var i = 0; i < this.DivisionSetup.length; i++){
            if(this.DivisionSetup[i].destroyed == true){
                return true;
            }
        }
        return false;
    }
    function Tank(tanktype, playerGrid, player){
        this.damage = 0;
        this.type = tanktype;
        this.playerGrid = playerGrid;
        this.player = player;

        switch(type){
            case CONST.AVAILABLE_TANKS[0]:
                this.tankLength = 5;
                break;
            case CONST.AVAILABLE_TANKS[1]:
                this.tankLength = 4;
                break;
            case CONST.AVAILABLE_TANKS[2]:
                this.tankLength = 3;
                break;
            case CONST.AVAILABLE_TANKS[3]:
                this.tankLength = 3;
                break;
            case CONST.AVAILABLE_TANKS[4]:
                this.tankLength = 2;
                break;
        }
        this.maxDamage = this.tankLength;
        this.destroyed = false;

    }
    Tank.prototype.takeDamage = function(){
        this.damage++;
        if(this.isDestroyed()){
            this.destroyTank();
        }
    }
    Tank.prototype.isDestroyed = function(){
        if(this.damage >= this.maxDamage){
            return true;
        }
        return false;
    };
    Tank.prototype.destroyTank = function(){
        this.damage = this.maxDamage;
        this.destroyed = true;
        var deadCells = this.getAllCells();
        for(var i = 0; i < deadCells.length; i++){
            this.playerGrid.updateCell(deadCells[i].x, deadCells[i].y, 'destroyed', this.player);
        }
    };
    Tank.prototype.getAllCells = function(){
        var result = [];
        for(var i = 0; i < this.tankLength; i++){
            if(this.direction == Tank.Vertical){
                result[i] = {'x': this.xPos, 'y': this.yPos + i};
            }
            else{
                result[i] = {'x': this.xPos + i, 'y': this.yPos};
            }
        }
        return result;
    }

    Tank.prototype.create = function(x, y, direction){
        this.xPos = x;
        this.yPos = y;
        this.direction = direction;
        if(this.direction = Tank.Vertical){
            for(var i = 0; i < this.tankLength; i++){
                this.playerGrid.cells[x][y + i] = CONST.TYPE_TANK;
            }
        }
        else{
            for(var i = 0; i < this.tankLength; i++){
                this.playerGrid.cells[x + i][y] = CONST.TYPE_TANK;
            }
        }
    };
    Tank.Vertical = 1;
    Tank.Horizontal = 0;
});
