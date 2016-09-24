//--------------------------------------------------
// Rock,Paper Scissors multi-player using Firebase
// 9/20/2016 RJF
//--------------------------------------------------
/* --- Design thought process ---
  1) Layout multi-player HMTL5
  2) Setup the Firebase DB
  3) Stitch UI, Code and Firebase events together
*/


// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyCXpo00q0fX-prcxijeDJaFCK3Vy-LBgKo",
    authDomain: "rock-paper-scissors-14a81.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-14a81.firebaseio.com",
    storageBucket: "rock-paper-scissors-14a81.appspot.com",
    messagingSenderId: "721003169139"
};

firebase.initializeApp(config);

var database = firebase.database();

var myName = null;
var myKey = "";

var playerNum = 0;  
var playersRef = null;

var p1wins = 0;
var p2wins = 0;
var p1losses = 0;
var p2losses = 0;

var p1Weapon = "";
var p2Weapon = "";


database.ref("Players/1/name").on("value", function(snapshot){
   $(player1Name).html(snapshot.val());
});

database.ref("Players/2/name").on("value", function(snapshot){
   $(player2Name).html(snapshot.val());
});


database.ref("Players/1/choice").on("value", function(snapshot){
   var thisPlayerNum = $(myplayerNum).html();


  if(snapshot.val()==null || snapshot.val()=="" || thisPlayerNum != "1")
      return;

   $(myplayerChoice).html(snapshot.val());
   
   p1Weapon = snapshot.val();

   if(thisPlayerNum == "1")  //only show if player 1
      $('#resDiv').html(p1Weapon);

   database.ref("Players/turn").set("2");
});


database.ref("Players/2/choice").on("value", function(snapshot){
  var thisPlayerNum = $(myplayerNum).html();
  
  if(snapshot.val()==null || snapshot.val()=="" || thisPlayerNum<1)
      return;
  
  p2Weapon = snapshot.val();
  

  $('#resDiv').html(getPlayerChoice('1') + "    " + getPlayerChoice('2'));

  p1Weapon = getPlayerChoice('1');
  p2Weapon = getPlayerChoice('2');

  if(thisPlayerNum != "2")
      return;

  $(myplayerChoice).html(snapshot.val());
  
  if(p1Weapon == p2Weapon && p1Weapon != "")
  {
    $('#winnerDiv').html("Tie!");
     database.ref("Players/2/wins").set(p2wins);
     database.ref("Players/1/losses").set(p1losses);
  }
  
  if(p1Weapon=="Rock" && p2Weapon=="Paper")
  {
     p1losses++;
     p2wins++;
     database.ref("Players/2/wins").set(p2wins);
     database.ref("Players/1/losses").set(p1losses);
  }
    
  if(p1Weapon=="Rock" && p2Weapon=="Scissors")
  {
     p2losses++;
     p1wins++;
     database.ref("Players/1/wins").set(p1wins);
     database.ref("Players/2/losses").set(p1losses);
  }
  if(p1Weapon=="Paper" && p2Weapon=="Rock")
    {
     p1wins++;
     p2losses++;
     database.ref("Players/1/wins").set(p1wins);
     database.ref("Players/2/losses").set(p2losses);
  }
  
  if(p1Weapon=="Paper" && p2Weapon=="Scissors")
  {
     p1losses++;
     p2wins++;
     database.ref("Players/2/wins").set(p2wins);
     database.ref("Players/1/losses").set(p1losses);
  }
  if(p1Weapon=="Scissors" && p2Weapon=="Paper")
    {
     p1wins++;
     p2losses++;
     database.ref("Players/1/wins").set(p1wins);
     database.ref("Players/2/losses").set(p2losses);
    }

  if(p1Weapon=="Scissors" && p2Weapon=="Rock")
    {
     p1losses++;
     p2wins++;
     database.ref("Players/2/wins").set(p2wins);
     database.ref("Players/1/losses").set(p1losses);
    }


   
   setTimeout(function(){
        ResetGame();
    }, 3000); 
});

database.ref("Players/1/wins").on("value", function(snapshot){
  var winnerName;
  var thisPlayerNum = $(myplayerNum).html();
   
   var c = getPlayerChoice('1');
   
   if(snapshot.val()==null || c == "")
      return;
  
     winnerName = getPlayerName('1');
      
   $('#winnerDiv').html(winnerName + " Wins");
    $('#p1-wins').html(snapshot.val());
  
});



database.ref("Players/2/wins").on("value", function(snapshot){
  
  var thisPlayerNum = $(myplayerNum).html();
  var winnerName;
  
  var c = getPlayerChoice('2');
  
   if(snapshot.val()==null || c == "")
      return;

    winnerName = getPlayerName('2');
    console.log(winnerName);

    $('#winnerDiv').html(winnerName + " Wins");
    $('#p2-wins').html(snapshot.val());
 
  
});

database.ref("Players/1/losses").on("value", function(snapshot){
  var thisPlayerNum = $(myplayerNum).html();
    if(snapshot.val()==null)
      return;
   if(thisPlayerNum != "1")
      return;
 
   $('#p1-losses').html(snapshot.val());
  
});


database.ref("Players/2/losses").on("value", function(snapshot){
  var thisPlayerNum = $(myplayerNum).html();
  if(snapshot.val()==null)
      return;
  if(thisPlayerNum != "2")
      return;

  $('#p2-losses').html(snapshot.val());
  
});



function getPlayerName(playerNum)
{
    var retString="";
    
    database.ref("Players/" + playerNum + "/name").once("value", function(snapshot)
        {
            retString= snapshot.val();
       });
    return retString;
}

function getPlayerChoice(playerNum)
{
    var retString="";
    
    database.ref("Players/" + playerNum + "/choice").once("value", function(snapshot)
        {
            retString= snapshot.val();
       });
    return retString;
}

function ResetGame()
{
  $('#resDiv').html("");
  $('#winnerDiv').html("");
  database.ref("Players/2/choice").set("");
  database.ref("Players/1/choice").set("");
  database.ref("Players/turn").set("1");
}


database.ref("Players/turn/").on("value", function(snapshot){
  
  var thisPlayerNum = $(myplayerNum).html();

  if(snapshot.val()==null || thisPlayerNum<1)
      return;

  $('#resDiv').html("");
  $('#winnerDiv').html("");

  
   if(snapshot.val() == $(myplayerNum).html())
      $(turnDiv).html("It's your turn");
   else
      $(turnDiv).html("Other players turn");

 
  //if Turn=1 and Turn = CurrentPlayerInBrowser
  if((snapshot.val() == 1) && $(myplayerNum).html() == 1)
  {
      $('#p1-weapons').css('visibility','visible');
      $('#p2-weapons').css('visibility','hidden');
  }
  if((snapshot.val() == 1) && $(myplayerNum).html() == 2)
  {
      $('#p1-weapons').css('visibility','hidden');
      $('#p2-weapons').css('visibility','hidden');
  }
  
  if((snapshot.val() == 2) && $(myplayerNum).html() == 2)
  { 
      $('#p1-weapons').css('visibility','hidden');
      $('#p2-weapons').css('visibility','visible');
  }  
  if((snapshot.val() == 2) && $(myplayerNum).html() == 1)
  { 
      $('#p1-weapons').css('visibility','hidden');
      $('#p2-weapons').css('visibility','hidden');
  } 
     
    
});

//figure out player 1 and 2
database.ref("Players/").on("value", function(snapshot) 
{
  var a = snapshot.numChildren();
  
   a++;
   playerNum=a;
  
});


database.ref("Players/").on("child_added", function(childSnapshot, prevChildKey){


 if(childSnapshot.child("name").val() == myName)
 {
   $(playerInfo).html("Hi " + myName + "! You are player " + playerNum);
   
   $(myplayerNum).html(playerNum);
   $(myplayerName).html(myName);
   
   if(playerNum==2)
       database.ref("Players/turn").set("1");
 }
});



function savePlayerToFB(playerName) {

  myName = playerName;
  if (playerNum==0)
    playerNum=1;

  var newPlayer = {
      name:  playerName,
      wins: 0,
      losses: 0,
      choice: ""
    }
 
 //used later
 myKey = database.ref("Players/" + playerNum).set(newPlayer);


};


//Chat function
$(document).on('click', '#sendText', function(){
   console.log(event.target.id);

   var str = $('#textMessage').val();
   database.ref("chat").push(myName + ": " + str);
});

//Chat listener
database.ref("chat").on("child_added", function(snapshot){
   $('#chatText').append(snapshot.val() + '&#xA;');
});


$(document).on('click', '#p1-weapons', function(){

    //event.target.style.fontWeight="bold";
    database.ref("Players/" + $(myplayerNum).html() + "/choice").set(event.target.id);
 
});

$(document).on('click', '#myplayerNum', function(){

    //event.target.style.fontWeight="bold";
    var i = getPlayerName('1');
    console.log(i);
    console.log(getPlayerChoice('1'));
  console.log(getPlayerChoice('2'));
 
});


$(document).on('click', '#p2-weapons', function(){
  
    console.log(event.target.id);

    //event.target.style.fontWeight="bold";
    database.ref("Players/" + $(myplayerNum).html() + "/choice").set(event.target.id);

});


$(document).on('click', '#resDiv', function(){
   console.log("PlayerNum=" + playerNum +"; myName=" + myName);
});



 // Handle the click of the Category Submit and add the new category to the cars array ("push" to grow the array)
$("#startGame").on("click", function()
  {
     playerName = $(".form-control").val();  //get the value of what the user typed in the textbox
      
     savePlayerToFB(playerName);

  });


 
