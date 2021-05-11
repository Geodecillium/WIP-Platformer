//sorry if I don't have many comments, I'm not used to working on code with others

let map;
let player;
let levelList;
let gamestate;

function preload() {
  levelList = loadJSON("levelList.json");
}

function setup() {
  createCanvas(1000, 800);
  noStroke();
  frameRate(30);

  player = new Player();
  map = new Map("temp", "start");
  console.log(acos(-3/sqrt(34)))
}

function draw() {
  background(0, 128, 255);
  map.update();
  player.update();
  map.draw();
  player.draw();
}