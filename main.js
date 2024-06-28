import { getAPI , shuffle } from "./utils.js";

// background using getapi function
const KeyImage = "vLJOjEdi-noow_aYHO-UfnyM6zOkuYbxqRaUNwxAoh8";
const query = "black,stars";
const UrlImage = `https://api.unsplash.com/photos/random?query=${query}&client_id=${KeyImage}`;

 getAPI(UrlImage).then((data) => {
  const imageUrl = data.urls.regular;
  document.body.style.backgroundImage = `url('${imageUrl}')`;
})
.catch((err) =>  {
  console.log("api faced an error , backup image applied");
  document.body.style.backgroundImage = `url('./pics/bg1.jpg')`})

//----------DOM values----------

const flips = document.getElementById("flips-count");
const timeValue = document.getElementById("time");
const gameContainer = document.querySelector(".game-container");
const Overlay = document.getElementById("overlay");
const OverlayText = document.getElementById("overlay-text");
const userName = document.getElementById("player-name");
const playerScore = document.getElementById("player-score");
const playerProfile = document.getElementById("profile-image");




//we get the name that we pass from players page 
const mainUrl = window.location.href;
let url = new URL(mainUrl);
const userNameFromUrl = url.searchParams.get("name");

//here we get the object from local srorage with the user name from players page

const localUserInfoString = localStorage.getItem(userNameFromUrl) ;

let userInfo = JSON.parse(localUserInfoString);
console.log(userInfo);

//inner text of user name and their profile 
userName.innerText = userNameFromUrl ; 
playerProfile.innerHTML = `<img src = "https://source.boringavatars.com/beam/120/${userNameFromUrl}">`;



//global values
let cards;
let interval;
let firstCard = false;
let secondCard = false;
let firstCardValue;
let secondCardvalue ;


//cards array 
const items = [
    { image: "pics/bishop1.svg", name: "bishop" },
    
    { image: "pics/commoner1.svg", name: "commoner" },
    
    { image: "pics/king1.svg", name: "king" },
    
    { image: "pics/knight1.svg", name: "knight" },
    
    { image: "pics/pawn1.svg", name: "pawn" },
    
    { image: "pics/queen1.svg", name: "queen" },
    
    { image: "pics/rock1.svg", name: "rock" },
    
    { image: "pics/altChess1.svg", name: "nightCommoner" }
    
  ];


// time , move and win count from user info 
let    seconds    = userInfo.time        ;
let    flipsCount = userInfo.flips        ;
let    winCounts  = userInfo.winCount     ;
let    score      = userInfo.score        ;





console.log(winCounts);







//generate time like 09 or 08  and when time ends game will stop 
function timeGenerator () {
    
    
    seconds -= 1 ;
    
    //updating the local object
    userInfo.time = seconds ;
    localStorage.setItem(userNameFromUrl ,  JSON.stringify(userInfo));
    
    //format time
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds ;
    
    
    timeValue.innerHTML = `<span>Time : ${secondsValue}</span>` ;
    


    if (seconds <= 0){
        
      
        stopGame();
        
        Overlay.style.display = "flex";
        OverlayText.innerHTML = `${userNameFromUrl}  you lost with ${flipsCount} flips Tap to Play Again <br>
        <button class="submit-score-bord"><a href="./Players.html">Score Bord</a></button>`;
    }
};



//count and updating flip and score
function flipsCounter () {
    
    flipsCount += 1 ;
    userInfo.flips = flipsCount ;
    localStorage.setItem(userNameFromUrl ,  JSON.stringify(userInfo));
    flips.innerHTML = `<span>Flip : ${flipsCount}</span>`;
    
};

function scoreCounter (number) {

    score += number ;
    userInfo.score = score ;
    localStorage.setItem(userNameFromUrl ,  JSON.stringify(userInfo));
    playerScore.innerText = userInfo.score ;

}

function winCounter (){
  winCounts += 1 ;
  userInfo.winCount = winCounts;       
  localStorage.setItem(userNameFromUrl ,  JSON.stringify(userInfo));
};

function cardGenerator (cardValues) {

      //reseting the game container each time 
    gameContainer.innerHTML = "";
    
    
    //creating card inside 
    for(let i = 0 ; i < cardValues.length ; i++) {

        gameContainer.innerHTML += `
        <div class="card-container" data-card-value="${cardValues[i].name}">
        
        <div class="card-front"> <img src= pics/chest.png > </div>
        <div class="card-back"> <img src= "${cardValues[i].image}" class="image"> </div>
        
        
        </div>
        `;
    }
    
    



     
     //getting cards 
    cards = document.querySelectorAll(".card-container");

    //check if any card have class matched from before (user info matched) and if it have ,add it to them
    for (let i = 0  ; i < userInfo.matched.length ;  i++){
        

            cards.forEach((card) => {
            const dataCardVal = card.getAttribute("data-card-value");
            
           if (dataCardVal == userInfo.matched[i][0]){

            card.classList.add("matched");
            card.classList.add("flipped");
           
        }})
   }   ;
          
     
    
      //now we have "cards" ready for event 

    //-----------game logic on card events-------------

      cards.forEach((card) => {

        //if a card already clicked the game doesent acsept it
        card.addEventListener("click" , () => {
            if (card.classList.contains('flipped')) {return;};



        //if a card clicked and it does not matched yet , it gets flipped class
          if(!card.classList.contains("matched")){
           
                card.classList.add("flipped");
                flipsCounter();

            //first card in the first place has value of false 
            //here we separate the first card from the second

            //if the firstcard was false (it means the card is empty)
             if(!firstCard) {

                //we fill up the firstcard
                firstCard = card ;
                firstCardValue = card.getAttribute("data-card-value");

             } else { //it means firstcard is full

               //we fill uo the second card
                secondCard = card ;
                secondCardvalue = card.getAttribute("data-card-value");

            //if both are the same , they get a matched class
             if (firstCardValue == secondCardvalue ){

                firstCard.classList.add("matched") ;
                secondCard.classList.add("matched");

                //and here we send both card to the local 
                userInfo.matched.push([firstCardValue , secondCardvalue]);

                
                //updating  score , wincount , selected cards

                //10 score for each matched
                scoreCounter(10);
                
                //reseting cards
                firstCard  = false ;
                secondCard = false ;
                
                
                
                
                winCounter();
                //if wincount gets to the 8 that means player won
                if(winCounts == (cardValues.length / 2)){


                        //when the player won game shows an overlay :
                            Overlay.style.display = "flex";
                            OverlayText.innerText =  ` ${userNameFromUrl} 
                            You won With ${flipsCount} Flips
                             and ${seconds} second Time left 
                             TAP TO PLAY AGAIN`;

                        //and player gets 100 score and game stop
                                scoreCounter(100);
                                stopGame();
                        }

                }else { //else (guess was wrong) we copy the cards 
                       //into the temps and remove their class with a delay
                        let [tepmFirst , tempSecond ] = [firstCard , secondCard];

                        firstCard  = false ;
                        secondCard = false ;
                        
                        setTimeout(() => {
                             tepmFirst .classList.remove("flipped");
                             tempSecond.classList.remove("flipped");
                           } , 500);


                        }}
                      };
                    });
                  });

                  //after all we send the card names to the local and later if page reload they dont shuffle again
                  userInfo.cards = cardValues ;
                  localStorage.setItem(userNameFromUrl ,  JSON.stringify(userInfo));
                };



                

                
                
 //this function is for initializing values ,
 // start the timer and shuffling the cards if they dont shuffle yet      
 function startGame (){
   
    //initializing 
    interval = setInterval(timeGenerator , 1000);
    playerScore.innerText = userInfo.score;
    flipsCount = userInfo.flips ;
    seconds = userInfo.time ;
    winCounts = userInfo.winCount;
    flips.innerHTML = `<span>flip : ${flipsCount}</span>`;
    timeValue.innerHTML = `<span>Time :  ${seconds}</span>` ;


    //if  cards dont shuffle yet 
    if(userInfo.newGame){

    let cardValues = shuffle(items) ;
    console.log(cardValues)
    cardValues = [...cardValues , ...cardValues];
    cardValues.sort(() => Math.random() - 0.5);
    cardGenerator(cardValues);


    
  }else {
    
    cardGenerator(userInfo.cards);
    
  };
};

//this function removes all of the classes from cards
// and reset the valus in the local storage
function stopGame () {
  cards.forEach((card) => {
    if (card.classList.contains("flipped") || card.classList.contains("matched")){
      
            card.classList.remove("flipped");
            card.classList.remove("matched");
          };
        });

    
        clearInterval(interval);
        userInfo.newGame = true ;
        userInfo.flips = 0;
        userInfo.winCount = 0;
        userInfo.time = 60;
        userInfo.cards = [];
        userInfo.matched =[];
        localStorage.setItem(userNameFromUrl ,  JSON.stringify(userInfo));
};

//this function supposed to call when page realoded and check if player in the game or not
//if player was in middle of the game overlay does not showen again and startgame is callen 
//overlay has an event listener that start the game
function loadedFunc (){            
  if (userInfo.newGame) {
    Overlay.style.display = "flex";
    OverlayText.innerText = `WELCOME!!! ${userNameFromUrl} 
                    Tap To Start`;
                                 
  } else {
      
     startGame();
  };

  Overlay.addEventListener("click", () => {
    startGame();
  
      Overlay.style.display = "none";
      userInfo.newGame = false;
     });
    };
    
//start  

loadedFunc();



