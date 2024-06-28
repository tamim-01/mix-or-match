import { getAPI } from "./utils.js";

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

//=================================================================

//dom values
const playerDisplay = document.querySelector  (".players-display")  ;
const startButton   = document.getElementById ("submit-player-name");
const playerInput   = document.getElementById ("player-name-input") ;


//here we get the url so we can change the pathname 
const mainUrl = window.location.href;
let url = new URL(mainUrl);



//this obj is the value that new users get
const object = { score : 0, flips : 0 , time : 60 , winCount : 0 , newGame : true, matched : [] ,cards : [] };
//changing it to string so we can send it to local
const objString = JSON.stringify(object);
console.log(objString);


//creating the list fpr playaers info
const creatoL = document.createElement("ol");
creatoL.classList.add("players-list");


//and we get the localstorage key values for showing usernames and scores
const listKey = Object.entries(localStorage);
console.log(listKey);

//creating a li for each player
for(let i = 0 ; i < listKey.length ; i++){

//we should parse the value from string to obj 
  let userInfo = JSON.parse(listKey[i][1]);
  console.log(userInfo);
//listkey[i][0] is the name of players
  creatoL.innerHTML += `<li><div>
  <img src = "https://source.boringavatars.com/beam/120/${listKey[i][0]}"></div>
  <div>${listKey[i][0]} </div><div> ${userInfo.score} </div></li>`;
  
};
//append them to the list 
playerDisplay.appendChild(creatoL);



//button for submiting player name if they was new or not
startButton.addEventListener("click" , () => {

    //if player entries name was in the local we dont created again
    if ((localStorage.getItem(playerInput.value))){

      console.log("same");
      
      url.pathname = "/index.html";
      url.searchParams.set( "name", playerInput.value);
      console.log(url.pathname);
      window.location.href = url;
      
    } else {//if it was not , we create and assign the object to that
      
      
            console.log("not same");
            localStorage.setItem(playerInput.value , objString);
            
            //we assign the path name to our game page
            url.pathname = "/index.html";

            //and we set the search params to player name so we can get it from another page

            url.searchParams.set( "name", playerInput.value);
            console.log(url.pathname);

            //and we set href to the url that we make 
            window.location.href = url;
    }
  }
 
);
