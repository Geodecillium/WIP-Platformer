//sorry if I don't have many comments, I'm not used to working on code with others

let map;
let player;
let levelList;
let gamestate;

function preload() {
  //load levels from levelList.json
  levelList = loadJSON("levelList.json");
}

function setup() {
  createCanvas(1000, 800);
  noStroke();

  map = new Map("temp");
}

function draw() {
  background(0, 128, 255);
  map.draw();
}