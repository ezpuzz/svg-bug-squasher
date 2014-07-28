

// Define JuneBug Symbol
var jb = new Raster('images/junebug.svg');
jb.rotate(90);

var junebug = new Symbol(jb);

// Define ladybug
var lb = new Raster('images/ladybug.svg');
lb.rotate(90);

var ladybug = new Symbol(lb);

// Define ant
var a = new Raster('images/ant.svg');
a.rotate(45);

var ant = new Symbol(a);

// Define star symbol
var starDef = new Path.Star(new Point(0, 0), 5, 20, 30);
starDef.fillColor = 'yellow';

var star = new Symbol(starDef);


// Different text displays on screen
var score = new PointText({
    point: view.center,
    justification: 'center',
    fontSize: 30,
    fillColor: 'red',
    content: '0'
});

var time = new PointText({
    point: new Point(view.size.width - 100, 50),
    justification: 'left',
    fillColor: 'red',
    fontSize: 30,
    content: '20'
});

var level = new PointText({
    point: new Point(50, 50),
    justification: 'left',
    fillColor: 'blue',
    fontSize: 30,
    content: 'Level 1'
});

// Store numeric level value for difficulty
var currLevel = 0;

// how many bugs to allow on screen
var maxBugs = currLevel * 5;

// delta for timer
var lastTime = 0;


// Create layers for clearing the screen and stuff
var bugLayer = new Layer();
var starLayer = new Layer();
var textLayer = new Layer();

// called on a bug click
// sends the bug back to random starting position
// and makes some pretty scoring stars
function killBug(event) {

    starLayer.activate();

    for(var s = 0; s < this.score; s++)
    {
	placedStar = star.place(this.position);
	var tempCurvePoint = Point.random() * view.size / 3;
	placedStar.curve = new Curve(this.position, tempCurvePoint, tempCurvePoint + 70, score.position);
	placedStar.distTraveled = 0;
	placedStar.scale(0.3 + Math.random() * 0.3);
	placedStar.deltaRot =  2 + Math.random() * 3; 
	placedStar.onFrame = starFrame;
    }

    this.position = new Point(-this.bounds.width, (0.15 + Math.random() * 0.7) * view.size.height );
    this.destination = new Point(view.size.width, (0.7 * Math.random() + 0.1) * view.size.height);
    this.vector = this.destination - this.position;
}

// used to send out a new bug
function spawnBug(bugType) {
    var currBug;

    var startPosition = new Point(-jb.bounds.width - (0.4 + Math.random()) * 1500, (0.2 + Math.random() * 0.7) * view.size.height );

    switch(bugType)
    {
	case 'junebug':
	    currBug = junebug.place(startPosition);
	    currBug.score = Math.ceil(2 + Math.random() * 3);
	    currBug.speed = 700;
	    break;
	case 'ladybug':
	    currBug = ladybug.place(startPosition);
	    currBug.score = Math.ceil(5 + Math.random() * 3);
	    currBug.speed = 400;
	    break;
	case 'ant':
	    currBug = ant.place(startPosition);
	    currBug.score = Math.ceil(10 + Math.random() * 3);
	    currBug.speed = 250;
	    break;
    }

    currBug.onMouseEnter = killBug;

    currBug.destination = new Point(view.size.width, (0.7 * Math.random() + 0.15) * view.size.height);
    currBug.vector = currBug.destination - currBug.position;

    currBug.onFrame = bugFrame;

    return currBug;
}


// flag that user is ready to continue
var ready = false;

//  pause the game, reset timer, ask for continue
function pause(){

    bugLayer.removeChildren();

    ready = false;

    textLayer.activate();

    var continueButton = new PointText({
	point: view.center + [0, 200],
	justification: 'center',
	content: 'continue',
	fontSize: 40
    });

    continueButton.onClick = function(event) {
	levelUp();
	ready = true;
	this.remove();
    };

}

function levelUp(){

    currLevel++;

    maxBugs = currLevel * 3;

    bugLayer.activate();

    while(bugLayer.children.length < maxBugs)
    {
	if(bugLayer.children.length > 0)
	{
	    if(bugLayer.children.length % 3 === 0 && bugLayer.children.length % 7 !== 0)
	    {
		spawnBug('ladybug');
		continue;
	    }

	    if(bugLayer.children.length % 7 === 0)
	    {
		spawnBug('ant');
		continue;
	    }
	}

	spawnBug('junebug');
    }

    level.content = 'Level ' + currLevel;

    time.content = 20;
}



// per frame processing for stars
starFrame = function(event){
    this.rotate(this.deltaRot);

    this.distTraveled += this.curve.length / ((this.deltaRot + 0.3) * 20);
    this.position = this.curve.getPointAt(this.distTraveled);

    var percentTraveled = 1 - this.distTraveled / this.curve.length;
    this.opacity = 1 - 1 / (1 + 100 * percentTraveled);


    if(this.distTraveled >= this.curve.length)
    {
	this.remove();
	score.content = parseInt(score.content) + 1;
	score.fillColor.hue += 1;
    }
};

//  per frame processing for bugs
bugFrame = function(event){

    // check if continue was hit
    if(!ready)
	return;

    this.position += this.vector / this.speed;

    if(this.position.x > view.size.width)
    {
	// GAME OVER
	ready = false;
	var finalScore = score.content;

	bugLayer.removeChildren();
	time.remove();

	textLayer.activate();

	var submitScore = new PointText({
	    point: view.center + 50,
	    content: 'Submit Score?'
	});

	var submitScoreBox = new Rectangle(submitScore.position - 20, new Size(40, 40));
	submitScoreBox.selected = true;
	submitScoreBox.strokeColor = 'black';
	submitScoreBox.fillColor = 'grey';
    }
};

function onFrame(event){

    if(!ready || event.count % 60 !== 0)
	return;

    if(event.time - lastTime >= 1)
    {
	lastTime = event.time;
	time.content = time.content - 1;
    }

    if(time.content <= 0)
    {
	pause();
    }
}

var startButton = new PointText({
    point: view.center + [0, 200],
    justification: 'center',
    content: 'START',
    fontSize: 40
});

startButton.onClick = function(event) {
    ready = true;
    this.remove();
    levelUp();
};
