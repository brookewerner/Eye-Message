var ctracker;
var responses = ["Hey!", "Yes", "No", "Maybe", "I am thirsty", "I am hungry", "How are you?"];
var index = 0;
var changed = false;
var mouthOpen = false;
var instructions = true;

function setup() {

  // setup camera capture
  var videoInput = createCapture(VIDEO);
  videoInput.size(400, 300);
  videoInput.position(0, 0);
  
  //hide video feed
  //videoInput.hide();
  
  // setup canvas
  var cnv = createCanvas(800, 600);
  cnv.position(0, 0);

  // setup tracker
  ctracker = new clm.tracker();
  ctracker.init(pModel);
  ctracker.start(videoInput.elt);

  noStroke();
}

function draw() {
  background(255);

  
  stroke(100, 100, 100);
  fill(200, 200, 200);
  rect(10, 3*innerHeight/4+20, 330, 110 );
  fill(0);
  text("Welcome! The purpose of this application is to allow", 20, 3*innerHeight/4+50 );
  text("you to communicate using only facial gestures.", 20, 3*innerHeight/4+65);
  text("To change the words on the screen, move your eyebrows", 20, 3*innerHeight/4+80);
  text("up and down. To select the phrase on the screen, open", 20, 3*innerHeight/4+95);
  text("your mouth.", 20, 3*innerHeight/4+110);
  
  
  // get array of face marker positions [x, y] format
  var positions = ctracker.getCurrentPosition();
  
  for (var i=0; i<positions.length; i++) {
    // set the color of the ellipse based on position on screen
    fill(20, 20, 60, 60);
    noStroke();
    // draw ellipse at each position point
    ellipse(400-positions[i][0], positions[i][1], 10, 10);
  }

  if(positions.length > 0){
    fill(255, 0, 0);

    //top of eye and bottom of eyebrow coordinates
    var eyeX = positions[30][0];
    var eyeY = positions[30][1];
    var browX = positions[18][0];
    var browY = positions[18][1];
    var browDistance = getDistance(eyeX, eyeY, browX, browY);

    //top and bottom of the mouth coordinates
    var upMouthX = positions[60][0];
    var upMouthY = positions[60][1];
    var downMouthX = positions[57][0];
    var downMouthY = positions[57][1];
    var mouthDistance = getDistance(upMouthX, upMouthY, downMouthX, downMouthY);
    
    // console.log(browDistance);
    words(browDistance, mouthDistance, positions);
  }
}

function words(browDistance, mouthDistance, positions){
  textSize(75);
  stroke(255, 0, 0);
  fill(0);

  //eyebrows raised
  if(!mouthOpen) {
    if(browDistance>25){
      instructions = false;
      if (!changed) {
        if(index <= responses.length) {
          index++;
          changed = true;
        } else {
          index = 0;
          changed = true;
        }
      }
    } else {
      changed = false;
    }
  }
  if (changed) {
    for (var i=15; i<=22; i++) {
      fill(255, 0, 0, 60);
      noStroke();
      ellipse(400-positions[i][0], positions[i][1], 10, 10);
    }
  }
  if (index >= responses.length) {
    index = 0;
  }
  console.log(index);

  fill(0);
  noStroke();
  text(responses[index], 30, innerHeight/2+50);
  // console.log(index);
  mouth(responses[index], mouthDistance, positions);
}

function mouth(word, mouthDistance, positions){

  console.log(mouthDistance);
  
  if( mouthDistance > 18){
    instructions = false;
    mouthOpen = true;
    fill(255, 0, 0);
    noStroke();
    text(word, 30, innerHeight/2+50);

    for (var i=44; i<=61; i++) {
      noStroke();
      fill(255, 0, 0, 60);
      ellipse(400-positions[i][0], positions[i][1], 10, 10);
    }

  } else {
    mouthOpen = false;
  }
} 

//distance formula
function getDistance(x1, y1, x2, y2){
  var distance = sqrt( Math.pow( (y2 - y1) , 2) + Math.pow( (x2 - x1) , 2) );
  return distance;
}
