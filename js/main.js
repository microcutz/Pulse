//Bryan's giving this ago!
//Testing github


// 1 Start enchant.js
enchant();
var scene;
// On document load
window.onload = function() {
// Starting point for new game
    var game = new Game(640, 440);
// 4 - Preload resources
    game.preload('res/BG.png',
    'res/redSheet.png',
        'res/blueSheet.png',
        'res/greenSheet.png',
        'res/yellowSheet.png',
    'res/Hit.mp3',
    'res/bgm.mp3',
    'res/heartFull.mp3',
        'res/heartHalf.mp3',
        'res/heartLow.mp3',
    'res/pBar.png',
    'res/pBarB.png');
    console.log("Resources preloaded");
// Game settings
    game.fps = 30;
    game.scale = 1;
    console.log("Settings initialised")
    game.onload = function() {
// Once Game finshes loading
        console.log("Game loaded");
        //Load game scene
        scene = new SceneGame();
        game.pushScene(scene);
        console.log("Game scene loaded");

    }
// Start game
    game.start();
    console.log("Game started");

// SceneGame class - class which will control the game scene
    var SceneGame = Class.create(Scene, {
// The main gameplay scene constructor
        initialize: function() {
            var game, sLabel, pLabel, bg, player, orbGroup, progress, pBar, pBarB, maxOrbs, lvl, ctrl, orbCount, currHeart;
            console.log("SceneGame vars created");
            this.currHeart = 1;
            this.lastHeart = 1;
            this.maxOrbs = 0;
            this.lvl = 2;
            this.ctrl = 4
            this.orbCount = 0;

// Call superclass constructor
            Scene.apply(this);
// Access to the game singleton instance
            game = Game.instance;
            this.progress = 50;
            console.log("Progress set to 50");
// Create child nodes
            pBar = new ProgressBar();
            this.pBar = pBar;
            pBar.x = 120;
            pBar.y = 10;
            pBarB = new Sprite(430,50);
            pBarB.x = 105;
            pBarB.y = 0;
            pBarB.image = game.assets['res/pBarB.png'];
            bg = new Sprite(640,440);
            bg.image = game.assets['res/BG.png'];
            console.log("Background image created");
            player = new Player();
            this.player = player;
            console.log("Player object created");
            orbGroup = new Group();
            this.orbGroup = orbGroup;
            console.log("Obstacle objects grouped")
// Add child nodes
            this.addChild(bg);
            this.addChild(orbGroup);
            this.addChild(player);
            this.addChild(pBarB);
            this.addChild(pBar);

            console.log("Children added to SceneGame");
            //Add event listeners
            this.addEventListener(Event.ENTER_FRAME, this.update);
            console.log("Event listeners created");
            //Instance vars
            this.generateOrbTimer = 0;
            this.progTimer = 0;
            this.countTimer =0;
            this.count = false;
            console.log("Instance variables initialised");
            //Background music
            this.bgm = game.assets['res/bgm.mp3'];
           // this.bgm.play();
            this.heartFull = game.assets['res/heartFull.mp3'];
            this.heartHalf = game.assets['res/heartHalf.mp3'];
            this.heartLow = game.assets['res/heartLow.mp3'];
            this.heartFull.play();
            console.log("Background music created");
            this.colour = "none";
        },
        //Class for updating status
        update : function (evt) {

            //Update progress label
            this.progTimer += evt.elapsed * 0.001;
            if ( this.progTimer >= 0.5) {
                this.pBar.updateBar(this.progress-1);
                this.setProgress(this.progress-1);
                this.progTimer -= 0.5;
            }
                if ( this.count == true) {
                    this.countTimer += evt.elapsed * 0.001;
                        if ( this.countTimer >= 1.5) {
                        this.countTimer -= 1.5;
                        this.colour = "none";
                        this.count = false;
                    }
                }
            //Check to see if time to create new Ice
            this.generateOrbTimer += evt.elapsed * 0.001;
            if (this.generateOrbTimer >= 0.5 ) {
                var orb;
                this.maxOrbs = (6*(this.lvl * this.lvl)+this.lvl)-this.ctrl;
                this.generateOrbTimer -= 0.5;
                if ( this.orbCount < this.maxOrbs ) {
                    this.orbCount++;
                var rndOrb = Math.floor(Math.random()*(4))
                if ( rndOrb == 1 ) {
                    orb = new OrbG(Math.floor(Math.random()*3)/*CHANGE THIS, remove the random parameter
                     and have the x and y coordinates generated at random in the constructor*/);
                    this.orbGroup.addChild(orb);
                }
                else if (rndOrb == 2) {
                    orb = new OrbB(Math.floor(Math.random()*3));
                    this.orbGroup.addChild(orb);
                }
                else if (rndOrb == 3) {
                    orb = new OrbY(Math.floor(Math.random()*3));
                    this.orbGroup.addChild(orb);
                }
                else  {
                    orb = new Orb(Math.floor(Math.random()*3));
                    this.orbGroup.addChild(orb);
                }
                }
            }

            //Loop the background music
           // if (this.bgm.currentTime >= this.bgm.duration ) {
           //     this.bgm.play();
           //     console.log("Restarting background music");
            //}
            if ( this.currHeart == 1){
            if (this.heartFull.currentTime >= this.heartFull.duration ) {
                this.heartFull.play();
            }
            }
            else if (this.currHeart == 2){
                if (this.heartHalf.currentTime >= this.heartHalf.duration ) {
                    this.heartHalf.play();
                }
            }
            else if (this.currHeart == 3){
                if (this.heartLow.currentTime >= this.heartLow.duration ) {
                    this.heartLow.play();
                }
            }

        },
        startCountTimer: function(col) {
            //Start orb timer here
            //Simple boolean, which if true, will cause the timer to run during update function
            this.count = true;
            this.colour = col;
        },
        setProgress: function(value) {
            this.progress = value;
            if ( this.progress > 100)
            {
                this.progress = 100;
            }
            if ( this.progress > 75 )
            {
                this.currHeart=1;
                scene.checkHeart(this.currHeart);
            }
            if ( this.progress > 35 )
            {
                this.currHeart=2;
                scene.checkHeart(this.currHeart);
            }
            if ( this.progress > 0 )
            {
                this.currHeart=3;
                scene.checkHeart(this.currHeart);
            }

            if ( this.progress < 1 ) {
                //Background music will then stop and game will progress to game-over scene
                var game = Game.instance;
                this.bgm.stop();
                game.replaceScene(new SceneGameOver(this.score));
                console.log("Player progress dropped to zero; music stopping, Gameover scene loading");
                scene.pBar.updateBar(value);
            }

        },
        decOrbCount:function()
        {
            this.orbCount--;
        },
        checkHeart:function(num)
        {
            if (num!=this.lastHeart)
            {
                if ( this.lastHeart = 1)
                {
                    scene.heartFull.stop();
                }
                if ( this.lastHeart = 2)
                {
                    scene.heartHalf.stop();

                }
                if ( this.lastHeart = 3)
                {
                    scene.heartLow.stop();

                }
                if ( num = 1)
                {
                    scene.heartFull.play();
                }
                if ( num = 2)
                {
                    scene.heartHalf.play();

                }
                if ( num = 3)
                {
                    scene.heartLow.play();

                }
                this.lastHeart = num;
            }
        }
    });
    //PLayer class
    var Player = Class.create(Sprite, {
        //Player constructor
        initialize: function() {
            //Call superclass constructor
            var progress, time, completeTime, level;
            Sprite.apply(this,[30,43]);
            this.image=Game.instance.assets['res/penguinSheet.png'];
            //Animate
            this.animationDuration = 0;
            this.addEventListener(Event.ENTER_FRAME, this.updateAnimation);
            console.log("Player sprite loaded")
        },
        //Animation method
        updateAnimation: function (evt) {
            //As time progresses, spritesheet progresses
            this.animationDuration += evt.elapsed * 0.001;
            if ( this.animationDuration >= 0.25) {
                this.frame = (this.frame + 1) % 2;
                this.animationDuration -= 0.25;
            }
        },
        //compTimer will dertermine level progression
        //When active, player will need to hold progress until timer depletes
        startCompTimer: function() {
            //Timer that depletes
            //If interrupted by progress lowering below 75, penalty
            //If reaches zero, level progress
            //
            //Code starts the timer here by setting a value to true, then while loop in update
        }
    })

    //Orb Red class
    var Orb = Class.create(Sprite, {
        //Orb Constructor

        initialize : function() {
            //call superclass constructor
            var xSpeed, ySpeed, x, y, colour;
            this.ySpeed = 30;
            this.xSpeed = Math.floor(Math.random()*5 + 5);
            if (Math.floor(Math.random()*4)>2){
                this.xSpeed*= -1;
            }
            this.colour = "red";
            Sprite.apply(this,[32,30]);
            this.image = Game.instance.assets['res/redSheet.png'];
            this.rotationSpeed = 0;
            x=0;
            y=0;
            //Animate
            this.animationDuration = 0;
            //If appearing at edges, generate 0 or 1, 0 then generates random y coordinate and random x of EITHER side
            //If 1, generate random x coordinate and random y of EITHER side
            var decision = Math.floor(Math.random() * 2);
            if (decision == 1)
            {
               y = (Math.floor(Math.random()*game.height));
                decision = Math.floor(Math.random()*2);
                if (decision ==1)
                {
                    x=0;
                }
                else {
                    x=game.width;
                }
            }
            else
            {
               x = Math.floor(Math.random()*game.width);
               decision = Math.floor(Math.random()*2);
               if (decision ==1)
               {
                    y=0;
               }
               else {
                        y=-(game.height);
                    }
            }
            //then simply this.x and this.y = random generated nums
            console.log(x,y);
            this.x = x;
            this.y = y;
            //Generate random direction and calculate xspeed and yspeed - need maths?
            this.addEventListener(Event.ENTER_FRAME,this.update);
            this.addEventListener(Event.TOUCH_START,this.absorb);
            //No console log; Update method for SceneGame already logs this
        },

        //Animation method
        updateAnimation: function (evt) {
        //As time progresses, spritesheet progresses
        this.animationDuration += evt.elapsed * 0.001;
        if ( this.animationDuration >= 0.25) {
            this.frame = (this.frame + 1) % 4;
            this.animationDuration -= 0.25;
        }
    },

        //Update function for obstacle
        update : function(evt) {
            //vars

            //remove yspeed set too
            game = Game.instance;
            if (this.y > game.height - this.height && this.ySpeed > 0 ) {
                this.ySpeed *= -1;
                this.y = game.height - this.height -1;
            }
            else if (this.y < 0 && this.ySpeed < 0)
            {
                this.ySpeed *= -1;
                this.y = 0;
            }
            if (this.x > game.width - this.width && this.xSpeed > 0 ) {
                this.xSpeed *= -1;
                this.x = game.width - this.width -1;
            }
            else if (this.x < 0 && this.xSpeed < 0)
            {
                this.xSpeed *= -1;
                this.x = 0;
            }

            //Update position - this will be based on randomly generated directions, and will change when colliding with
            //wall - direction change plus random factor, and random factor for reflected speed
            this.y += this.ySpeed * evt.elapsed * 0.001;
            this.x += this.xSpeed * evt.elapsed * 0.001;
            this.rotation += this.rotationSpeed * evt.elapsed * 0.001;


        },
        absorb: function() {

                    var game = Game.instance;
                    game.assets['res/Hit.mp3'].play();
            //This algorithm will assign a positive or negative score based on count
//Count is a status for whether player is clicking a combo orb
//If not, normal progress to add is 5
//If so, and player gets the right colour next, progress to add is 10
//If so, but player clicks wrong colour, 5 progress is deducted
            if ( scene.count == true ) {
                if ( this.colour == scene.colour) {
                    scene.setProgress(scene.progress +10);
                    scene.count = false;
                    console.log("Colour match");
                }
                else
                {
                    scene.setProgress(scene.progress -5);
                    scene.count = false;
                }
            }
            else
            {
                scene.setProgress(scene.progress + 5);
//play heartbeat
                scene.startCountTimer(this.colour);
                scene.colour = this.colour;
                console.log(this.colour);
            }
            scene.decOrbCount();

                    scene.orbGroup.removeChild(this);


            //on click 'evt', check for clicking on an Orb
            //If so, set the 'lastColour' variable to the colour of that orb, and begin the orbTimer.
            //orbTimer will countdown and if reaches 0, no points will be gained, otherwise add points when clicking the
            //correct orb next
        }
    })
    //Orb Blue class
    var OrbB = Class.create(Sprite, {
        //Orb Constructor

        initialize : function() {
            //call superclass constructor
            var xSpeed, ySpeed, x, y, colour;
            this.ySpeed = 35;
            this.xSpeed = Math.floor(Math.random()*25);
            if (Math.floor(Math.random()*4)>2){
                this.xSpeed*= -1;
            }
            this.colour = "blue";
            Sprite.apply(this,[32,30]);
            this.image = Game.instance.assets['res/blueSheet.png'];
            this.rotationSpeed = 0;
            x=0;
            y=0;
            //Animate
            this.animationDuration = 0;
            //If appearing at edges, generate 0 or 1, 0 then generates random y coordinate and random x of EITHER side
            //If 1, generate random x coordinate and random y of EITHER side
            var decision = Math.floor(Math.random() * 2);
            if (decision == 1)
            {
                y = (Math.floor(Math.random()*game.height));
                decision = Math.floor(Math.random()*2);
                if (decision ==1)
                {
                    x=0;
                }
                else {
                    x=game.width;
                }
            }
            else
            {
                x = Math.floor(Math.random()*game.width);
                decision = Math.floor(Math.random()*2);
                if (decision ==1)
                {
                    y=0;
                }
                else {
                    y=-(game.height);
                }
            }
            //then simply this.x and this.y = random generated nums
            console.log(x,y);
            this.x = x;
            this.y = y;
            //Generate random direction and calculate xspeed and yspeed - need maths?
            this.addEventListener(Event.ENTER_FRAME,this.update);
            this.addEventListener(Event.TOUCH_START,this.absorb);
            //No console log; Update method for SceneGame already logs this
        },

        //Animation method
        updateAnimation: function (evt) {
            //As time progresses, spritesheet progresses
            this.animationDuration += evt.elapsed * 0.001;
            if ( this.animationDuration >= 0.25) {
                this.frame = (this.frame + 1) % 4;
                this.animationDuration -= 0.25;
            }
        },

        //Update function for obstacle
        update : function(evt) {
            //vars

            //remove yspeed set too
            game = Game.instance;
            if (this.y > game.height - this.height && this.ySpeed > 0 ) {
                this.ySpeed *= -1;
                this.y = game.height - this.height -1;
            }
            else if (this.y < 0 && this.ySpeed < 0)
            {
                this.ySpeed *= -1;
                this.y = 0;
            }
            if (this.x > game.width - this.width && this.xSpeed > 0 ) {
                this.xSpeed *= -1;
                this.x = game.width - this.width -1;
            }
            else if (this.x < 0 && this.xSpeed < 0)
            {
                this.xSpeed *= -1;
                this.x = 0;
            }

            //Update position - this will be based on randomly generated directions, and will change when colliding with
            //wall - direction change plus random factor, and random factor for reflected speed
            this.y += this.ySpeed * evt.elapsed * 0.001;
            this.x += this.xSpeed * evt.elapsed * 0.001;
            this.rotation += this.rotationSpeed * evt.elapsed * 0.001;


        },
        absorb: function() {

            var game = Game.instance;
            game.assets['res/Hit.mp3'].play();
            //This algorithm will assign a positive or negative score based on count
//Count is a status for whether player is clicking a combo orb
//If not, normal progress to add is 5
//If so, and player gets the right colour next, progress to add is 10
//If so, but player clicks wrong colour, 5 progress is deducted
            if ( scene.count == true ) {
                if ( this.colour == scene.colour) {
                    scene.setProgress(scene.progress +10);
                    scene.count = false;
                }
                else
                {
                    scene.setProgress(scene.progress -5);
                    scene.count = false;
                }
            }
            else
            {
                scene.setProgress(scene.progress + 5);
//play heartbeat
                scene.startCountTimer(this.colour);
                scene.colour = this.colour;
                console.log(this.colour);
            }

            scene.decOrbCount();
            scene.orbGroup.removeChild(this);


            //on click 'evt', check for clicking on an Orb
            //If so, set the 'lastColour' variable to the colour of that orb, and begin the orbTimer.
            //orbTimer will countdown and if reaches 0, no points will be gained, otherwise add points when clicking the
            //correct orb next
        }
    })
    //Orb Green class
    var OrbG = Class.create(Sprite, {
        //Orb Constructor

        initialize : function() {
            //call superclass constructor
            var xSpeed, ySpeed, x, y, colour;
            this.ySpeed = Math.floor(Math.random()*25 + 25);
            this.xSpeed = Math.floor(Math.random()*25 + 10);
            if (Math.floor(Math.random()*4)>2){
                this.xSpeed*= -1;
            }
            this.colour = "green";
            Sprite.apply(this,[32,30]);
            this.image = Game.instance.assets['res/greenSheet.png'];
            this.rotationSpeed = 0;
            x=0;
            y=0;
            //Animate
            this.animationDuration = 0;
            //If appearing at edges, generate 0 or 1, 0 then generates random y coordinate and random x of EITHER side
            //If 1, generate random x coordinate and random y of EITHER side
            var decision = Math.floor(Math.random() * 2);
            if (decision == 1)
            {
                y = (Math.floor(Math.random()*game.height));
                decision = Math.floor(Math.random()*2);
                if (decision ==1)
                {
                    x=0;
                }
                else {
                    x=game.width;
                }
            }
            else
            {
                x = Math.floor(Math.random()*game.width);
                decision = Math.floor(Math.random()*2);
                if (decision ==1)
                {
                    y=0;
                }
                else {
                    y=-(game.height);
                }
            }
            //then simply this.x and this.y = random generated nums
            console.log(x,y);
            this.x = x;
            this.y = y;
            //Generate random direction and calculate xspeed and yspeed - need maths?
            this.addEventListener(Event.ENTER_FRAME,this.update);
            this.addEventListener(Event.TOUCH_START,this.absorb);
            //No console log; Update method for SceneGame already logs this
        },

        //Animation method
        updateAnimation: function (evt) {
            //As time progresses, spritesheet progresses
            this.animationDuration += evt.elapsed * 0.001;
            if ( this.animationDuration >= 0.25) {
                this.frame = (this.frame + 1) % 4;
                this.animationDuration -= 0.25;
            }
        },

        //Update function for obstacle
        update : function(evt) {
            //vars

            //remove yspeed set too
            game = Game.instance;
            if (this.y > game.height - this.height && this.ySpeed > 0 ) {
                this.ySpeed *= -1;
                this.y = game.height - this.height -1;
            }
            else if (this.y < 0 && this.ySpeed < 0)
            {
                this.ySpeed *= -1;
                this.y = 0;
            }
            if (this.x > game.width - this.width && this.xSpeed > 0 ) {
                this.xSpeed *= -1;
                this.x = game.width - this.width -1;
            }
            else if (this.x < 0 && this.xSpeed < 0)
            {
                this.xSpeed *= -1;
                this.x = 0;
            }

            //Update position - this will be based on randomly generated directions, and will change when colliding with
            //wall - direction change plus random factor, and random factor for reflected speed
            this.y += this.ySpeed * evt.elapsed * 0.001;
            this.x += this.xSpeed * evt.elapsed * 0.001;
            this.rotation += this.rotationSpeed * evt.elapsed * 0.001;


        },
        absorb: function() {

            var game = Game.instance;
            game.assets['res/Hit.mp3'].play();
            //This algorithm will assign a positive or negative score based on count
//Count is a status for whether player is clicking a combo orb
//If not, normal progress to add is 5
//If so, and player gets the right colour next, progress to add is 10
//If so, but player clicks wrong colour, 5 progress is deducted
            if ( scene.count == true ) {
                if ( this.colour == scene.colour) {
                    scene.setProgress(scene.progress +10);
                    scene.count = false;
                }
                else
                {
                    scene.setProgress(scene.progress -5);
                    scene.count = false;
                }
            }
            else
            {
                scene.setProgress(scene.progress + 5);
//play heartbeat
                scene.startCountTimer(this.colour);
                scene.colour = this.colour;
                console.log(this.colour);
            }

            scene.decOrbCount();
            scene.orbGroup.removeChild(this);



            //on click 'evt', check for clicking on an Orb
            //If so, set the 'lastColour' variable to the colour of that orb, and begin the orbTimer.
            //orbTimer will countdown and if reaches 0, no points will be gained, otherwise add points when clicking the
            //correct orb next
        }
    })
    //Orb Yellow class
    var OrbY = Class.create(Sprite, {
        //Orb Constructor

        initialize : function() {
            //call superclass constructor
            var xSpeed, ySpeed, x, y, colour;
            this.ySpeed = 65;
            this.xSpeed = Math.floor(Math.random()*25 + 50);
            if (Math.floor(Math.random()*4)>2){
                this.xSpeed*= -1;
            }
            this.colour = "yellow";
            Sprite.apply(this,[32,30]);
            this.image = Game.instance.assets['res/yellowSheet.png'];
            this.rotationSpeed = 0;
            x=0;
            y=0;
            //Animate
            this.animationDuration = 0;
            //If appearing at edges, generate 0 or 1, 0 then generates random y coordinate and random x of EITHER side
            //If 1, generate random x coordinate and random y of EITHER side
            var decision = Math.floor(Math.random() * 2);
            if (decision == 1)
            {
                y = (Math.floor(Math.random()*game.height));
                decision = Math.floor(Math.random()*2);
                if (decision ==1)
                {
                    x=0;
                }
                else {
                    x=game.width;
                }
            }
            else
            {
                x = Math.floor(Math.random()*game.width);
                decision = Math.floor(Math.random()*2);
                if (decision ==1)
                {
                    y=0;
                }
                else {
                    y=-(game.height);
                }
            }
            //then simply this.x and this.y = random generated nums
            console.log(x,y);
            this.x = x;
            this.y = y;
            //Generate random direction and calculate xspeed and yspeed - need maths?
            this.addEventListener(Event.ENTER_FRAME,this.update);
            this.addEventListener(Event.TOUCH_START,this.absorb);
            //No console log; Update method for SceneGame already logs this
        },

        //Animation method
        updateAnimation: function (evt) {
            //As time progresses, spritesheet progresses
            this.animationDuration += evt.elapsed * 0.001;
            if ( this.animationDuration >= 0.25) {
                this.frame = (this.frame + 1) % 4;
                this.animationDuration -= 0.25;
            }
        },

        //Update function for obstacle
        update : function(evt) {
            //vars

            //remove yspeed set too
            game = Game.instance;
            if (this.y > game.height - this.height && this.ySpeed > 0 ) {
                this.ySpeed *= -1;
                this.y = game.height - this.height -1;
            }
            else if (this.y < 0 && this.ySpeed < 0)
            {
                this.ySpeed *= -1;
                this.y = 0;
            }
            if (this.x > game.width - this.width && this.xSpeed > 0 ) {
                this.xSpeed *= -1;
                this.x = game.width - this.width -1;
            }
            else if (this.x < 0 && this.xSpeed < 0)
            {
                this.xSpeed *= -1;
                this.x = 0;
            }

            //Update position - this will be based on randomly generated directions, and will change when colliding with
            //wall - direction change plus random factor, and random factor for reflected speed
            this.y += this.ySpeed * evt.elapsed * 0.001;
            this.x += this.xSpeed * evt.elapsed * 0.001;
            this.rotation += this.rotationSpeed * evt.elapsed * 0.001;


        },
        absorb: function() {

            var game = Game.instance;
            game.assets['res/Hit.mp3'].play();
            //This algorithm will assign a positive or negative score based on count
//Count is a status for whether player is clicking a combo orb
//If not, normal progress to add is 5
//If so, and player gets the right colour next, progress to add is 10
//If so, but player clicks wrong colour, 5 progress is deducted
            if ( scene.count == true ) {
                if ( this.colour == scene.colour) {
                    scene.setProgress(scene.progress +10);
                    scene.count = false;
                }
                else
                {
                    scene.setProgress(scene.progress -5);
                    scene.count = false;
                }
            }
            else
            {
                scene.setProgress(scene.progress + 5);
//play heartbeat
                scene.startCountTimer(this.colour);
                scene.colour = this.colour;
                console.log(this.colour);
            }

            scene.decOrbCount();
            scene.orbGroup.removeChild(this);


            //on click 'evt', check for clicking on an Orb
            //If so, set the 'lastColour' variable to the colour of that orb, and begin the orbTimer.
            //orbTimer will countdown and if reaches 0, no points will be gained, otherwise add points when clicking the
            //correct orb next
        }
    })

    //Scene for game over
    var SceneGameOver = Class.create(Scene, {
        //Constructor
        initialize: function(score) {
            //vars
            var gameOverLabel, scoreLabel;
            Scene.apply(this);
            this.backgroundColor = 'black';
            //Game over label
            gameOverLabel = new Label("GAME OVER<br>Tap to Restart");
            gameOverLabel.x = 8;
            gameOverLabel.y = 128;
            gameOverLabel.color = 'white';
            gameOverLabel.font = '32px strong';
            gameOverLabel.textAlign = 'centre';
            console.log("Game over label created");
            //Add labels
            this.addChild(gameOverLabel);
            console.log("Labels added")
            //Add event listener for mouse click
            this.addEventListener(Event.TOUCH_START, this.touchToRestart);
            console.log("Event listener for Game Over added");


        },
        //method for restarting game - this just loads a new SceneGame scene
        touchToRestart: function(evt) {
            //Load new SceneGame scene
            var game = Game.instance;
            game.replaceScene(new SceneGame());
            console.log("Loading new game scene");
        }
    })
    var ProgressBar = Class.create( Sprite, {
        //Player constructor
        initialize: function() {
            //Call superclass constructor
            var progress;
            Sprite.apply(this,[400,30]);
            this.image=Game.instance.assets['res/pBar.png'];
            console.log("Progress bar[green] sprite loaded")
        },
        updateBar: function(value) {
            this.progress = value;
            //Set bar size to value/100 * bar.width
            this.width = (value/100)*400;
        }
    })
};