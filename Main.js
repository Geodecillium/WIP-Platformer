//sorry if I don't have many comments, I'm not used to working on code with others

let map;
let player;
let levelList;
let gamestate;
let music = {};
let keysPressed = {
  ArrowUp: false,
  ArrowRight: false,
  ArrowDown: false,
  ArrowLeft: false,
  z: false,
  x: false,
  c: false,
  w: false,
  d: false,
  s: false,
  a: false,
  j: false,
  k: false,
  l: false
}

function preload() {
  levelList = loadJSON("levelList.json");
  soundFormats("m4a");
  music.main = loadSound("Main theme.m4a");
}

function setup() {
  createCanvas(1000, 800);
  noStroke();
  frameRate(30);

  music.main.loop();
  player = new Player();
  map = new Map("temp", "start");
  gamestate = GAME_PLAYING;
}

function draw() {
  background(0, 128, 255);
  map.update();
  player.update();
  map.draw();
  player.draw();
}

function keyPressed() {
  if (keysPressed[key] === false) keysPressed[key] = true;
}

function keyReleased(e) {
  if (keysPressed[e.key] === true) keysPressed[e.key] = false;
}

//intersection magic
//more on how it works at https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/
function onSegment(x1, y1, x2, y2, x3, y3) {
  return x2 <= max(x1, x3) && x2 >= min(x1, x3) && y2 <= max(y1, y3) && y2 >= min(y1, y3);
}
function orient(x1, y1, x2, y2, x3, y3) {
  val = (y2 - y1) * (x3 - x2) - (x2 - x1) * (y3 - y2);
  if (val == 0) return 0;
  return (val > 0) ? 1 : 2;
}
function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  o1 = orient(x1, y1, x2, y2, x3, y3);
  o2 = orient(x1, y1, x2, y2, x4, y4);
  o3 = orient(x3, y3, x4, y4, x1, y1);
  o4 = orient(x3, y3, x4, y4, x2, y2);
  return (o1 != o2 && o3 != o4) || (o1 == 0 && onSegment(x1, y1, x3, y3, x2, y2)) || (o2 == 0 && onSegment(x1, y1, x4, y4, x2, y2)) || (o3 == 0 && onSegment(x3, y3, x1, y1, x4, y4)) || (o4 == 0 && onSegment(x3, y3, x2, y2, x4, y4));
}