const startButton = document.getElementById('start-button')
const stopButton = document.getElementById('stop-button')

stopButton.disabled = true

let easyRecord = localStorage.getItem('easy_record')
if (easyRecord === null) {
    localStorage.setItem('easy_record', '0')
    easyRecord = 0
}

let mediumRecord = localStorage.getItem('medium_record')
if (mediumRecord === null) {
    localStorage.setItem('medium_record', '0')
    mediumRecord = 0
}

let hardRecord = localStorage.getItem('hard_record')
if (hardRecord === null) {
    localStorage.setItem('hard_record', '0')
    hardRecord = 0
}

DisplayRecordsOnPage()

function DisplayRecordsOnPage() {
    document.getElementById('easy-record').innerText = 'Легкий режим: ' + easyRecord
    document.getElementById('medium-record').innerText = 'Средний режим: ' + mediumRecord
    document.getElementById('hard-record').innerText = 'Сложный режим: ' + hardRecord
}

function SaveRecords() {
    localStorage.setItem('easy_record', easyRecord.toString())
    localStorage.setItem('medium_record', mediumRecord.toString())
    localStorage.setItem('hard_record', hardRecord.toString())
}




function StartGame() {
    startButton.disabled = true
    stopButton.disabled = false

    const canvas = document.getElementById('game-canvas')
    const context = canvas.getContext('2d')

    const spaceshipImg = new Image()
    spaceshipImg.src = '../img/spaceship.svg'
    const asteroidImg = new Image()
    asteroidImg.src = '../img/asteroid.svg'
    const explosionImg = new Image()
    explosionImg.src = '../img/explosion.svg'
    const liveImg = new Image()
    liveImg.src = '../img/live.svg'

    let spaceship = {
        width: 50,
        height: 70,
        speed: 5,
        acceleration: 3,
        bulletsRemained: 10,
        cooldown: 0,
        lives: 3,
        scoreFactor: 1,
        bullets: [],
        cooldownBetweenShoots: 0,
        score: 0,
        highscore: 0,
        scoreDiv: 10000
    }
    spaceship.x = canvas.width / 2 - spaceship.width / 2;
    spaceship.y = canvas.height - spaceship.height - 30;

    const difficultyRadios = document.getElementsByName('difficulty');
    let selectedDifficulty
    for (let i = 0; i < difficultyRadios.length; i++) {
        if (difficultyRadios[i].checked) {
            selectedDifficulty = difficultyRadios[i].value
            break
        }
    }
    let intervalForAsteroids
    switch (selectedDifficulty) {
        case 'easy':
            intervalForAsteroids = 300
            spaceship.highscore = parseInt(easyRecord)
            break
        case 'medium':
            intervalForAsteroids = 250
            spaceship.highscore = parseInt(mediumRecord)
            break
        default:
            intervalForAsteroids = 200
            spaceship.highscore = parseInt(hardRecord)
            break
    }

    let isLeftPressed = false
    let isRightPressed = false
    let isUpPressed = false
    let isShiftPressed = false

    function DrawSpaceship() {
        context.drawImage(spaceshipImg, spaceship.x, spaceship.y, spaceship.width, spaceship.height)
    }

    function KeyDown(event) {
        event.preventDefault()
        if (event.key === 'ArrowLeft') isLeftPressed = true
        else if (event.key === 'ArrowRight') isRightPressed = true
        else if (event.key === 'ArrowUp' || event.key === ' ') isUpPressed = true
        else if (event.key === 'Shift' ) isShiftPressed = true
    }
    function KeyUp(event) {
        event.preventDefault()
        if (event.key === 'ArrowLeft') isLeftPressed = false
        else if (event.key === 'ArrowRight') isRightPressed = false
        else if (event.key === 'ArrowUp' || event.key === ' ') isUpPressed = false
        else if (event.key === 'Shift') isShiftPressed = false
    }

    function MoveSpaceship() {
        let speed
        if (isShiftPressed) speed = spaceship.speed + spaceship.acceleration
        else speed = spaceship.speed
        
        if (isLeftPressed && spaceship.x > 0) {
            spaceship.x -= speed
        }
        if (isRightPressed && spaceship.x < canvas.width - spaceship.width) {
            spaceship.x += speed 
        }
    }

    function CreateBullet(x, y) {
        return {
            x: x,
            y: y,
            width: 5,
            height: 10,
            speed: 5
        };
    }

    function Shoot() {
        if (isUpPressed && spaceship.bulletsRemained > 0 && spaceship.cooldownBetweenShoots === 0) {
            spaceship.bulletsRemained--
            spaceship.bullets.push(CreateBullet(spaceship.x + spaceship.width/2, spaceship.y))

            if(spaceship.bulletsRemained === 0) {
                spaceship.cooldown = 10
                const cooldownInterval = setInterval(() => {
                    spaceship.cooldown--
                    if (spaceship.cooldown === 0) {
                        spaceship.bulletsRemained = 10
                        clearInterval(cooldownInterval)
                    }
                }, 1000)
                return
            }
            
            spaceship.cooldownBetweenShoots = 50
            const bulletCooldownInterval = setInterval(() => {
                spaceship.cooldownBetweenShoots--
                if (spaceship.cooldownBetweenShoots === 0) clearInterval(bulletCooldownInterval)
            })
            
        }
    }

    function DrawBullets() {
        context.fillStyle = '#cf4c00'
        for (let bullet of spaceship.bullets) {
            context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)
        }
    }

    function MoveBullets() {
        for (let bullet of spaceship.bullets) {
            bullet.y -= bullet.speed
        }
        spaceship.bullets = spaceship.bullets.filter(bullet => bullet.y > 0)
    }

    let asteroids = []

    function CreateAsteroid() {
        const asteroid = {
            x: Math.random() * canvas.width,
            y: -50,
            width: 50,
            height: 50,
            speed: Math.random() * 3 + 1
        }
        asteroids.push(asteroid)
    }
    const asteroidsGeneration = setInterval(CreateAsteroid, intervalForAsteroids)

    function DrawAsteroids() {
        for (let asteroid of asteroids) {
            context.drawImage(asteroidImg, asteroid.x, asteroid.y, asteroid.width, asteroid.height)
        }
    }

    function MoveAsteroids() {
        for (let asteroid of asteroids) {
            asteroid.y += asteroid.speed
        }
        asteroids.filter(asteroid => asteroid.y < canvas.height)
    }

    function DrawExplosion(x, y) {
        context.drawImage(explosionImg, x, y, 50, 50)
    }

    function HandleAsteroidsEvent() {
        for (let asteroid of asteroids) {
            for (let bullet of spaceship.bullets) {
                if (
                    bullet.x > asteroid.x &&
                    bullet.x < asteroid.x + asteroid.width &&
                    bullet.y > asteroid.y &&
                    bullet.y < asteroid.y + asteroid.height - 15
                ) {
                    const asteroidIndex = asteroids.indexOf(asteroid)
                    DrawExplosion(asteroids[asteroidIndex].x, asteroids[asteroidIndex].y)
                    asteroids.splice(asteroidIndex, 1)
                    const bulletIndex = spaceship.bullets.indexOf(bullet)
                    spaceship.bullets.splice(bulletIndex, 1)
                    spaceship.score += 1000 * spaceship.scoreFactor
                }
            }

            if (
                spaceship.x < asteroid.x-15 + asteroid.width &&
                spaceship.x + spaceship.width > asteroid.x+15 &&
                spaceship.y < asteroid.y-15 + asteroid.height &&
                spaceship.y + spaceship.height > asteroid.y+15
            ) {
                const asteroidIndex = asteroids.indexOf(asteroid)
                DrawExplosion(asteroids[asteroidIndex].x, asteroids[asteroidIndex].y)
                spaceship.lives--
                asteroids.splice(asteroidIndex, 1)
            }
        }
    }
    
    function DrawInfo() {
        let dx = 15
        for (let i = 0; i < spaceship.lives; i++) {
            context.drawImage(liveImg, canvas.width - 40 - dx, 15, 40, 40)
            dx += 40
        }

        context.fillStyle = '#fff'
        context.font = '20px Arial'
        if(spaceship.bulletsRemained > 0) {
            context.fillText('Пули: ' + spaceship.bulletsRemained, 15, 30)
        } else {
            context.fillText('Перезарядка: ' + spaceship.cooldown, 15, 30)
        }
        context.fillText('Счет: ' + spaceship.score, 15, 60)
        context.fillText('Рекорд: ' + spaceship.highscore, 15, 90)
    }

    function GameProcess() {
        context.clearRect(0, 0, canvas.width, canvas.height)
        DrawSpaceship()
        MoveSpaceship()
        Shoot()
        DrawBullets()
        MoveBullets()
        DrawAsteroids()
        MoveAsteroids()
        HandleAsteroidsEvent()
        DrawInfo()

        spaceship.score += spaceship.scoreFactor

        if (spaceship.score % spaceship.scoreDiv === 0) {
            spaceship.scoreFactor += 5
            scoreDiv *= 10
        }

        if (spaceship.highscore < spaceship.score) {
            spaceship.highscore = spaceship.score
        }
        if (spaceship.lives <= 0) FinishGame()
        
    }
    const gameProcessInterval = setInterval(GameProcess, 15)

    function GameOver(resolve, reject) {
        setTimeout(() => {
            context.clearRect(0, 0, canvas.width, canvas.height)
            let i = 0
            let f = false
            let gameOverIntrval = setInterval(() => {
                if (f) {
                    context.clearRect(0, 0, canvas.width, canvas.height)
                    f = false
                }
                else {
                    context.fillStyle = '#fff'
                    context.font = '48px Arial'
                    const gameOverTextWidth = context.measureText('GAME OVER').width
                    context.fillText('GAME OVER', (canvas.width - gameOverTextWidth) / 2, canvas.height/2 - 60)
                    f = true
                }
                i++
                if (i === 5) {
                    clearInterval(gameOverIntrval)
                    context.fillStyle = '#fff'
                    context.font = '36px Arial'
                    const scoreTextWidth = context.measureText('Счет: ' + spaceship.score).width
                    context.fillText('Счет: ' + spaceship.score , (canvas.width - scoreTextWidth) / 2, canvas.height/2)
                    if (spaceship.highscore === spaceship.score) {
                        context.font = '28px Arial'
                        const recordTextWidth = context.measureText('Новый рекорд').width
                        context.fillText('Новый рекорд' , (canvas.width - recordTextWidth) / 2, canvas.height/2 + 60)
                    } 
                    resolve()
                }
            }, 500)
        }, 200)
    }

    function FinishGame() {
        stopButton.disabled = true
        clearInterval(gameProcessInterval)
        clearInterval(asteroidsGeneration)
        console.log('stopped')
        const promise = new Promise(GameOver)
        promise.then(() => {
            if (spaceship.highscore === spaceship.score) {
                switch (selectedDifficulty) {
                    case 'easy':
                        easyRecord = spaceship.highscore
                        break
                    case 'medium':
                        mediumRecord = spaceship.highscore
                        break
                    default:
                        hardRecord = spaceship.highscore
                        break
                }
            }
            StopGame()
            return
        })
    }

    document.addEventListener('keydown', KeyDown)
    document.addEventListener('keyup', KeyUp)

    stopButton.addEventListener('click', (event) => {
        event.preventDefault()
        FinishGame()
    })
}

function StopGame() {
    startButton.disabled = false
    stopButton.disabled = true

    SaveRecords()
    DisplayRecordsOnPage()
}