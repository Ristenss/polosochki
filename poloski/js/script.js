const adulttig = document.getElementById('adulttig')

adulttig.addEventListener('click', () => {
  adulttig.classList.toggle('open')
})

const customCursor = document.getElementById('custom-cursor')

document.addEventListener('mousemove', (e) => {
  customCursor.style.left = e.clientX + 'px'
  customCursor.style.top = e.clientY + 'px'
})

const interactiveElements = document.querySelectorAll(
  'a, button, .adulttig, .draggable-elem, .hse, .yri, .sts, .grupp, .mine'
)

interactiveElements.forEach((elem) => {
  elem.addEventListener('mouseenter', () => {
    customCursor.classList.add('hover')
  })

  elem.addEventListener('mouseleave', () => {
    customCursor.classList.remove('hover')
  })
})

const canvas = document.getElementById('drawCanvas')
const ctx = canvas.getContext('2d')
const tiger = document.getElementById('tiger')
const swapBtn = document.getElementById('swapBtn')

let isDrawing = false
let isBackTiger = false
let isAnimating = false

ctx.strokeStyle = '#1e5eff'
ctx.lineWidth = 4
ctx.lineCap = 'round'
ctx.lineJoin = 'round'

function getMousePos(event) {
  const rect = canvas.getBoundingClientRect()

  return {
    x: (event.clientX - rect.left) * (canvas.width / rect.width),
    y: (event.clientY - rect.top) * (canvas.height / rect.height)
  }
}

canvas.addEventListener('mousedown', (event) => {
  isDrawing = true
  const pos = getMousePos(event)

  ctx.beginPath()
  ctx.moveTo(pos.x, pos.y)
})

canvas.addEventListener('mousemove', (event) => {
  if (!isDrawing) return

  const pos = getMousePos(event)
  ctx.lineTo(pos.x, pos.y)
  ctx.stroke()
})

canvas.addEventListener('mouseup', () => {
  isDrawing = false
  ctx.closePath()
})

canvas.addEventListener('mouseleave', () => {
  isDrawing = false
  ctx.closePath()
})

swapBtn.addEventListener('click', () => {
  if (isAnimating) return
  isAnimating = true

  tiger.classList.add('flipping')

  setTimeout(() => {
    isBackTiger = !isBackTiger

    if (isBackTiger) {
      tiger.classList.remove('tiger-front')
      tiger.classList.add('tiger-back')
    } else {
      tiger.classList.remove('tiger-back')
      tiger.classList.add('tiger-front')
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    tiger.classList.remove('flipping')
    isAnimating = false
  }, 350)
})

const questionTriggers = document.querySelectorAll('.question-trigger')
const modals = document.querySelectorAll('.modal')

questionTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const modalId = trigger.dataset.modal
    const targetModal = document.getElementById(modalId)

    if (targetModal) {
      targetModal.classList.add('active')
    }
  })
})

modals.forEach((modal) => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active')
    }
  })
})

const game = document.querySelector('.animal-game')

const headPart = document.getElementById('headPart')
const bodyPart = document.getElementById('bodyPart')
const legsPart = document.getElementById('legsPart')

const headLeft = document.getElementById('headLeft')
const headRight = document.getElementById('headRight')
const bodyLeft = document.getElementById('bodyLeft')
const bodyRight = document.getElementById('bodyRight')
const legsLeft = document.getElementById('legsLeft')
const legsRight = document.getElementById('legsRight')

const parts = {
  head: [
    './images/bunnyhead.svg',
    './images/tighead.svg',
    './images/froghead.svg'
  ],
  body: [
    './images/bunnypuzo.svg',
    './images/tigpuzo.svg',
    './images/frogpuzo.svg'
  ],
  legs: [
    './images/bunnylegs.svg',
    './images/tiglegs.svg',
    './images/froglegs.svg'
  ]
}

let current = {
  head: 0,
  body: 0,
  legs: 0
}

const tigerCombo = {
  head: 1,
  body: 1,
  legs: 1
}

let autoShuffle = true
let shuffleInterval = null
let hasWon = false
let canCheckWin = false

function renderParts() {
  headPart.style.backgroundImage = `url('${parts.head[current.head]}')`
  bodyPart.style.backgroundImage = `url('${parts.body[current.body]}')`
  legsPart.style.backgroundImage = `url('${parts.legs[current.legs]}')`
}

function nextPart(type) {
  const total = parts[type].length
  current[type] = (current[type] + 1) % total
  renderParts()
  checkWin()
}

function prevPart(type) {
  const total = parts[type].length
  current[type] = (current[type] - 1 + total) % total
  renderParts()
  checkWin()
}

function checkWin() {
  if (!canCheckWin) return

  if (
    current.head === tigerCombo.head &&
    current.body === tigerCombo.body &&
    current.legs === tigerCombo.legs
  ) {
    hasWon = true
    stopShuffle()
    game.classList.add('win')
  }
}

function stopShuffle() {
  autoShuffle = false
  if (shuffleInterval) {
    clearInterval(shuffleInterval)
    shuffleInterval = null
  }
}

function handleUserAction(action) {
  if (hasWon) return

  stopShuffle()
  canCheckWin = true
  action()
}

function randomizeParts() {
  do {
    current.head = Math.floor(Math.random() * parts.head.length)
    current.body = Math.floor(Math.random() * parts.body.length)
    current.legs = Math.floor(Math.random() * parts.legs.length)
  } while (
    current.head === tigerCombo.head &&
    current.body === tigerCombo.body &&
    current.legs === tigerCombo.legs
  )

  renderParts()
}

function startShuffle() {
  randomizeParts()

  shuffleInterval = setInterval(() => {
    if (!autoShuffle || hasWon) return

    randomizeParts()
  }, 700)
}

headLeft.addEventListener('click', () => handleUserAction(() => prevPart('head')))
headRight.addEventListener('click', () => handleUserAction(() => nextPart('head')))

bodyLeft.addEventListener('click', () => handleUserAction(() => prevPart('body')))
bodyRight.addEventListener('click', () => handleUserAction(() => nextPart('body')))

legsLeft.addEventListener('click', () => handleUserAction(() => prevPart('legs')))
legsRight.addEventListener('click', () => handleUserAction(() => nextPart('legs')))

renderParts()
startShuffle()