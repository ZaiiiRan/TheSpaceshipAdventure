const spaceshipImg = new Image()
spaceshipImg.src = './img/spaceship.svg'

const asteroidImg = new Image()
asteroidImg.src = './img/asteroid.svg'

const explosionImg = new Image()
explosionImg.src = './img/explosion.svg'

const liveImg = new Image()
liveImg.src = './img/live.svg'

const shootSound = './sounds/shoot.wav'

const buttonSound = './sounds/button.mp3'

const collisionSound = './sounds/collision.mp3'

const gameOverSound = new Audio()
gameOverSound.preload = 'auto'
gameOverSound.src = './sounds/game_over.mp3'

const newRecordSound = new Audio()
newRecordSound.preload = 'auto'
newRecordSound.src = './sounds/new_record.mp3'
