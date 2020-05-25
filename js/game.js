
var elem = $(".ball");

var ballx=50;
var bally=0;
const max_bally = 0;
const min_bally = 150;
const displacement = 200;

var obstacleMov;
var obstacleArray = [];
var obstacleMoveSpeed = 8;
var obstacleCreateSpeed = 4500;

const cursur_move_duration = 550;

var score = 0;


$( document ).ready(function() {

	moveleft();

	$('#myModal').modal({
		backdrop: 'static',
		keyboard: false
	});

	$('#myModal').modal('show');

	bally = max_bally;
	changeBallPosition(elem, bally, ballx, 'easeOutQuart', cursur_move_duration);

});

function moveup() {

     if ((bally + displacement) > min_bally) {
    	bally = bally - displacement; 
    	changeBallPosition(elem,  bally, ballx, 'easeOutExpo', cursur_move_duration);
    	setTimeout(movedown, 400);
    }
}

function movedown() {

	if ((bally + displacement) <= max_bally) {
		bally = bally + displacement;
		changeBallPosition(elem,  bally, ballx, 'easeInExpo', cursur_move_duration);
	}
}

function moveleft() {
	elem.velocity({
		translateX: ballx
	},
	{
		duration: 1000
	});
}

function startGame(){

	$('#myModal').modal('hide');

	removeAllObstacle();
	score = 0;
	obstacleCreateSpeed = 4500;
	$("#gameScore").html("Score : " + score);

	createObject = setInterval(createObstacle, obstacleCreateSpeed);
	updateScore = setInterval(updateGameScore, 1000);
	obstacleMov = setInterval(trackObstaclePosition, 10);
	changeSpeed = setInterval(changeObstacleMoveSpeed, 10000);

}

function createObstacle(){

	var i = Math.floor((Math.random() * 5) + 1);
	var obstacleName = "obstacle" + $.now();
	obstacleArray.push(obstacleName);
	$("#game-area").append('<div class="obstacle obstacle' + i + ' ' + obstacleName + '"></div>');
}

function removeAllObstacle(){
	$(".obstacle").remove();
}

function trackObstaclePosition(){

	var obstaclePosition = $(".obstacle").position();
	var cursorPosition = $(".ball").position();

	if(obstaclePosition !== undefined){

		if(obstaclePosition.left < 40){
			var obstacleToRemove = obstacleArray[0];
			// console.log("obstacleToRemove : " + obstacleToRemove);
			$("." + obstacleToRemove).remove();
			obstacleArray.splice(0,1);
		}

		var overlap = checkOverlap(obstaclePosition, cursorPosition);

		if (overlap) {
			// console.log("Obstacle : ", obstaclePosition);
			// console.log("Cursor : ", cursorPosition);
			stopAnimation();
			// console.log("overlaped");
		}
	}	
}

function moveObstacle(){
	// console.log("start animation");
	$(".obstacle").css("-webkit-animation-name","animateObstacle");
}

function changeObstacleMoveSpeed(){
	if((score > 0)&&((score%100) === 0)){
		if (obstacleCreateSpeed <= 1200) {
			obstacleCreateSpeed = 1400;
		}
		else{
			obstacleCreateSpeed = obstacleCreateSpeed - 250;
		}

		clearInterval(createObject);
		createObject = setInterval(createObstacle, obstacleCreateSpeed);
		// $(".obstacle").css("-webkit-animation-duration",obstacleMoveSpeed + "s");
		// $(".obstacle").css("-webkit-animation", " wave " + obstacleMoveSpeed + "s linear");
	}
}

function stopAnimation(){
	$(".obstacle").css("-webkit-animation-name","none");
	clearInterval(obstacleMov);
	clearInterval(createObject);
	clearInterval(updateScore);

	$('#startButton').text("Restart Run");
	$('#myModal').modal('show');
}

function checkOverlap(obstaclePosition, cursorPosition){

	if(((cursorPosition.left + 45) >= obstaclePosition.left) && (cursorPosition.left <= (obstaclePosition.left + 60)) &&
		(cursorPosition.top >= obstaclePosition.top)){
		clearInterval(obstacleMov);
	return true;
}
else {
	return false;
}
}

function updateGameScore(){
	score = score + 10;
	$("#gameScore").html("Score : " + score);
}


//Moves the ball up or down
function changeBallPosition(elem, propVal_y, propVal_x, easingVal, durationVal){
	elem.velocity({
		translateY: propVal_y + "px",
	},
	{
		duration: durationVal, 
		easing: easingVal
	});  
}