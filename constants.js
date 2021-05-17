const
  //object sizes
  GAME_HEIGHT = 800,
  GAME_WIDTH = 1000,
  BLOCK_SIZE = 25,
  //map objects
  EMPTY = 0,
  WALL = 1,
  UP_SPIKE = 2,
  RIGHT_SPIKE = 3,
  DOWN_SPIKE = 4,
  LEFT_SPIKE = 5,
  //game states
  GAME_PLAYING = 0,
  GAME_MENU = 1,
  GAME_PAUSED = 2,
  GAME_FROZEN = 3,
  GAME_DEAD = 4,
  //player states
  //  animation
  PLAYER_IDLE = 1,
  //  walk
  PLAYER_STILL = 1,
  PLAYER_WALK_ACC = 2,
  PLAYER_WALK = 3,
  PLAYER_WALK_DEC = 4,
  //  fall
  PLAYER_GROUNDED = 1,
  PLAYER_FALL = 2,
  PLAYER_FAST_FALL = 3,
  PLAYER_JUMP = 4,
  PLAYER_CANCEL_JUMP = 5,
  PLAYER_HANG = 6,
  //player math
  GRAVITY = 3,
  MAX_FALL_SPEED = 12, //3 less than actually max fall speed due to acceleration being applied after
  MAX_FAST_FALL_SPEED = 17,
  JUMP_SPEED = -18,
  JUMP_DEC_SPEED = 2,
  JUMP_CANCEL_SPEED = 2.5,
  WALK_ACC_SPEED = 3.5,
  WALK_SPEED = 9,
  WALK_DEC_SPEED = 1.5,
  GROUND_FRICTION = 1,
  AIR_FRICTION = 0.5,
  //general movement
  UP = 1,
  UP_RIGHT = 2,
  RIGHT = 3,
  DOWN_RIGHT = 4,
  DOWN = 5,
  DOWN_LEFT = 6,
  LEFT = 7,
  UP_LEFT = 8