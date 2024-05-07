let canvas = document.querySelector("canvas")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
canvas.style.width = "100%"
canvas.style.height = "100%"
canvas.style.backgroundColor = "black"

// Startläge kvadrat
// Slumpas fram med lite marginal från kanterna
// (minst 200 px till vänstermarginal, max 20 % av bredd till högermarginal)
let xPos = Math.floor((0.8 * canvas.width - 200) + 200)
let yPos = Math.floor((0.8 * canvas.height - 200) + 200)
let player1 = 0
let player2 = 0

let player = {
    y: 0,
    ySpeed: 5,
    length: 40,
    width: 20,
}

// Hastighet för kvadrat
let speed = 5
let ySpeedP1 = 0
let ySpeedP2 = 0

// Sidlängd för kvadrat
const size = 100

// Reagerar på tangenttryckningar
// Varje tangent har sin keycode, se https://keycosde.info
// När en tangent trycks ned så sätts hastigheten i x- eller y-led.
document.onkeydown = function (e) {
  console.log(e) //Inparametern e innehåller ett event-objekt med information om eventet.
  const key = e.key
  switch (key) {
    case "w":
      // w-tangenten ska göra att kvadraten rör sig uppåt (negativ y-led).
      console.log("player 1 Going up")
      ySpeedP1 = -speed
      break
    case "ArrowUp":
      // a-tangenten ska göra att kvadraten rör sig åt vänster (negativ x-led).
      console.log("player 2 going up")
      ySpeedP2 = -speed
      break
    case "s":
      // s-tangenten ska göra att kvadraten rör sig nedåt (positiv y-led).
      console.log("player 1 Going down")
      ySpeedP1 = speed
      break
    case "ArrowDown":
      // d-tangenten ska göra att kvadraten rör sig åt höger (positiv x-led).
      console.log("player 2 going down")
      ySpeedP2 = speed
      break
    case " ": // Mellanslag
      console.log(`Mellanslag`)
      break
    default: // alla övriga tangenter
      console.log("Tangenten används inte")
  }
}

// När en tangent släpps upp så vill vi stoppa rörelsen i den riktningen.
document.onkeyup = function (e) {
  const key = e.key
  switch (key) {
    case "w":
      console.log("Stop up")
      ySpeedP1 = 0
      break
    case "ArrowUp":
      console.log("Stop left")
      ySpeedP2 = 0
      break
    case "s":
      console.log("Stop down")
      ySpeedP1 = 0
      break
    case "ArrowDown":
      console.log("Stop right")
      ySpeedP2 = 0
      break
  }
}

let ctx = canvas.getContext("2d")

// Animeringsloopen
function animate() {
  // Rensar gammalt visuellt innehåll
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Sätt nya läget.
  xPos += xSpeed
  yPos += ySpeed

  // Den röda kvadraten ritas i sitt nya läge
  ctx.fillStyle = "red"
  ctx.fillRect(xPos, yPos, size, size)

  window.requestAnimationFrame(animate)
}

window.requestAnimationFrame(animate)