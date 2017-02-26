var ctracker;
var responses = ["yes", "no", "maybe", "hey!", "see you soon", "come over", "where are you?", "call me"];
var index = 0;
var changed = false;
var mouthOpen = false;

function setup() {

  // setup camera capture
  var videoInput = createCapture(VIDEO);
  videoInput.size(400, 300);
  videoInput.position(0, 0);
  
  //hide video feed
  videoInput.hide();
  
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
  background(255,255,255);
  
    // get array of face marker positions [x, y] format
  var positions = ctracker.getCurrentPosition();
  
  for (var i=0; i<positions.length; i++) {
    // set the color of the ellipse based on position on screen
    fill(map(positions[i][0], width*0.33, width*0.66, 0, 255), map(positions[i][1], height*0.33, height*0.66, 0, 255), 255);
    // draw ellipse at each position point
    ellipse(400-positions[i][0], positions[i][1], 10, 10);
  }

  if(positions.length > 0){
    fill(255, 0, 0);
    ellipse(400-positions[62][0], positions[62][1], 10, 10);
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
    words(browDistance, mouthDistance);
  }
  
}

function words(browDistance, mouthDistance){
  textSize(75);
  stroke(255, 0, 0);
  fill(0);

  //eyebrows raised
  if(!mouthOpen) {
    if(browDistance>25){
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
  if (index >= responses.length) {
    index = 0;
  }
  console.log(index);

  text(responses[index], innerWidth/2, innerHeight/2);
  // console.log(index);
  mouth(responses[index], mouthDistance);
}

function mouth(word, mouthDistance){

  console.log(mouthDistance);
  
  if( mouthDistance > 18){
    mouthOpen = true;
    fill(255, 0, 0);
    text(word, innerWidth/2, innerHeight/2);
  } else {
    mouthOpen = false;
  }
} 

//distance formula
function getDistance(x1, y1, x2, y2){
  var distance = sqrt( Math.pow( (y2 - y1) , 2) + Math.pow( (x2 - x1) , 2) );
  return distance;
}
