var SIMONE = (function () {

    var currentPlaybackId;    var isPlayingPattern = false;    var isReadyForInput  = false;    var pattern = [];    var currentLevel=0;    var startButtonRed = "images/startButtonRed.png";    var startButtonGreen = "images/startButtonGreen.png";    var startButtonYellow = "images/startButtonYellow.png";    var clearButton = "images/clear.png";    var interval = 1000; //milliseconds    var pageButtons = [];    var isGameOver = false;    //keep track of the attempt number  (when the user clicks it increments until the next trial)    var currentTrialIndex = 0;    var animationTimers = [];    var lastButtonClicked;

    function flipBack (button) {
        button.src = button.clearImage;
    }

    
    // Clears the timers for the animations.  This is so that if a person clicks the start/reset
    // button during an animation, they will stop...
    function clearAnimationTimers () {
        var timer;
        var i;
        
        for(i = 0; i < animationTimers.length; i++) {
            timer = animationTimers.pop();
            if(timer) {
                try{
                    clearTimout(timer);
                } catch(e) {
                    //really can't do anything
                }
            }
        }
    }
       
    function gameOver () {
        clearAnimationTimers();
        changeDisplayForRunning(startButtonRed);
        isReadyForInput = false;
        isGameOver = true;
    }
        
       
    function createPattern () {
        var i = 0;
        for(i = 0; i < 50; i++) {
            var nextColor = Math.floor(Math.random() * 4);	
            pattern[i] = nextColor;
        }		
    }
        
    function nextLevel () {
        currentLevel++;
    }
        

    function runPattern () {
        changeDisplayForRunning(startButtonYellow);
        isPatternPlaying = true;
        isReadyForInput  = false;
        //give a small delay...
        setTimeout(function() {animate(0);}, 1000);
    }
    
    function animate (currentPos) {
        //play animation, if more then call self again
        if(currentPos < currentLevel) {
            playButton(pattern[currentPos]);
            animationTimers.push(setTimeout(function () { animate(++currentPos); }, interval));
        } else {
            animationTimers.push(setTimeout(function () { getReadyForInput(); }, 2));
        }
    }

    function getReadyForInput () {
        isReadyForInput  = true;
        isPlayingPattern = false;
        currentTrialIndex = 0;
        changeDisplayForRunning(startButtonGreen);
    }


    function playButton (num) {
        var button = document.getElementById("button" + num);
        button.src = button.colorImage;
        lastButtonClicked = button;
        //now tell it to flip back
        setTimeout(function () {flipBack(lastButtonClicked);}, interval - 200);			
    }


    function getButtonInput (id) {
        if(!isPlayingPattern && isReadyForInput) {
            checkPress(id);
        }
    }
         
    function getButtonNumber (id) {
        return id.charAt(id.length - 1 );
    }

    function checkPress (id) {
        //get the image number, yes this is ugly
        if(getButtonNumber(id) == pattern[currentTrialIndex]){
            currentTrialIndex++;
            //do we wait for another click? or move on?
            if(currentTrialIndex >= currentLevel) {
                nextLevel();
                changeLevelDisplay(currentLevel);
                runPattern();
            }
        } else { 
            gameOver();
        }
    }

    function changeDisplayForRunning(buttonType) {
        document.getElementById("startButton").src = buttonType;
    }

    function changeLevelDisplay (txt) {
        document.getElementById("levelDisplay").innerHTML = txt;
    }


    function setCurrentLevel (level) {
        currentLevel = level;	
    }

   function initit() {
        var i;
            
        pageButtons[0] = window.document.getElementById("button0");
        pageButtons[1] = window.document.getElementById("button1");
        pageButtons[2] = window.document.getElementById("button2");
        pageButtons[3] = window.document.getElementById("button3");


        pageButtons[0].colorImage = "images/green_led_on.png";
        pageButtons[1].colorImage = "images/red_led_on.png";
        pageButtons[2].colorImage = "images/yellow_led_on.png";
        pageButtons[3].colorImage = "images/blue_led_on.png";

        for(i = 0; i < pageButtons.length; i++) {
            pageButtons[i].clearImage = "images/clear.png";
            pageButtons[i].src = pageButtons[i].clearImage;
        }

        document.getElementById("startButton").onclick = this.startGame;
        document.getElementById("startButton").src = startButtonRed;
        changeLevelDisplay("READY");
    }
      
    function resetGame () {
        isPlayingPattern = false;
        isReadyForInput  = false;
        setCurrentLevel(0);
    }
            return {
   
        startGame: function () {
            clearAnimationTimers();
            resetGame();
            getReadyForInput();
            createPattern();
            setCurrentLevel(1);
            changeDisplayForRunning(startButtonYellow);
            changeLevelDisplay(currentLevel);
            runPattern();
        },	
         onhide: function () {
        },
        
        onshow: function () {            initit();        },
        
        swapDown: function (event) {
            if(isReadyForInput) {
                event.target.src = event.target.colorImage;
            }
        },
        
        swapUp: function (event) {
            if(isReadyForInput) {
                event.target.src = event.target.clearImage;
                getButtonInput(event.target.id);
            }
        }

        
    };        }());if(window.widget) {	widget.onhide = SIMONE.onhide();	widget.onshow = SIMONE.onshow();}