let canvas = document.querySelector("canvas");
canvas.width = document.body.clientWidth * 0.99;
canvas.height = document.body.clientHeight * 0.99;
canvas.style.backgroundColor = "black";

let Pspelare1 = {
  y: canvas.height / 2 - 100,
  ySpeed: 0,
  längd: 200,
  bredd: 10,
};

let Pspelare2 = {
  y: canvas.height / 2 - 100,
  ySpeed: 0,
  längd: 200,
  bredd: 10,
};

let paddelBredd = 10;
let paddelHöjd = 200;
let hastighet = 8; 
let ball_value = 1;

let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  dx: Math.random() < 0.5 ? -3 : 3,  
  dy: (Math.random() - 0.5) * 3, 
  radie: 20, 
  acceleration: 0.005, 
};

let scoreP1 = parseInt(localStorage.getItem('scoreP1')) || 0;
let scoreP2 = parseInt(localStorage.getItem('scoreP2')) || 0;

// Variabler för power-ups
let powerUps = [];

// Färger för power-ups
const powerUpColor = "#FFA500";

// Typer av power-ups
const powerUpTypes = ["dubbla_poäng", "dubbel_bollhastighet", "halv_bollhastighet", "dubbel_bollstorlek", "halv_bollstorlek"];

// Funktion för att generera slumpmässig power-up
function genereraPowerUp() {
  const typ = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
  return {
    x: Math.random() * (canvas.width - 40) + 20, // Slumpmässig x-position inom canvas
    y: Math.random() * (canvas.height - 40) + 20, // Slumpmässig y-position inom canvas
    typ: typ
  };
}

// Funktion för att rita power-ups
function ritaPowerUps() {
  powerUps.forEach(powerUp => {
    ctx.beginPath();
    ctx.arc(powerUp.x, powerUp.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = powerUpColor;
    ctx.fill();
    ctx.closePath();
  });
}

// Funktion för att kontrollera kollision med power-ups
function kontrolleraPowerUpKollision() {
  powerUps.forEach((powerUp, index) => {
    const avstånd = Math.sqrt((ball.x - powerUp.x) ** 2 + (ball.y - powerUp.y) ** 2);
    if (avstånd < ball.radie + 10) {
      appliceraPowerUpEffekt(powerUp.typ);
      powerUps.splice(index, 1); // Ta bort power-up från arrayen
    }
  });
}

// Funktion för att applicera power-up effekter
function appliceraPowerUpEffekt(typ) {
  switch(typ) {
    case "dubbla_poäng":
      ball_value *= 2;
      ball.color = "#FF0000"; // Röd färg för power-up
      break;
    case "dubbel_bollhastighet":
      ball.acceleration *= 2;
      ball.color = "#00FF00"; // Grön färg för power-up
      break;
    case "halv_bollhastighet":
      ball.acceleration /= 2;
      ball.color = "#0000FF"; // Blå färg för power-up
      break;
    case "dubbel_bollstorlek":
      ball.radie *= 2;
      ball.color = "#FFFF00"; // Gul färg för power-up
      break;
    case "halv_bollstorlek":
      ball.radie /= 2;
      ball.color = "#00FFFF"; // Cyan färg för power-up
      break;
  }
}

// Funktion för att ångra power-up effekter
function ångraPowerUpEffekt() {
  switch(activePowerUp) {
    case "dubbla_poäng":
      ball_value /= 2;
      break;
    case "dubbel_bollhastighet":
      ball.acceleration /= 2;
      break;
    case "halv_bollhastighet":
      ball.acceleration *= 2;
      break;
    case "dubbel_bollstorlek":
      ball.radie /= 2;
      break;
    case "halv_bollstorlek":
      ball.radie *= 2;
      break;
  }
  // Återställ färgen på spelbollen till vit
  ball.color = "#FFFFFF";
  // Återställ aktiv power-up
  activePowerUp = null;
}

// Funktion för att lägga till power-up med intervall på tio sekunder
function läggTillPowerUp() {
  function genereraEttPowerUp() {
    powerUps.push(genereraPowerUp());
  }

  setInterval(() => {
    genereraEttPowerUp();
  }, 10000); // Körs var tionde sekund
}

// Funktion för att rita bollen
function ritaBoll() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radie, 0, Math.PI * 2);
  ctx.fillStyle = ball.color || "white"; // Använd aktiv power-up-färg eller vit
  ctx.fill();
  ctx.closePath();  
}

let ctx = canvas.getContext("2d");

function ritaAvrundadeRektangel(ctx, x, y, bredd, höjd, radieProcent) {
  const radie = Math.min(bredd, höjd) * radieProcent;
  ctx.beginPath();
  ctx.moveTo(x + radie, y);
  ctx.arcTo(x + bredd, y, x + bredd, y + höjd, radie);
  ctx.arcTo(x + bredd, y + höjd, x, y + höjd, radie);
  ctx.arcTo(x, y + höjd, x, y, radie);
  ctx.arcTo(x, y, x + bredd, y, radie);
  ctx.closePath();
  ctx.fill();
}

function uppdateraBoll() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.dx > 0) {
    ball.dx += ball.acceleration;
  } else {
    ball.dx -= ball.acceleration;
  }

  if (ball.dy > 0) {
    ball.dy += ball.acceleration;
  } else {
    ball.dy -= ball.acceleration;
  }

  if (ball.x + ball.dx > canvas.width - ball.radie || ball.x + ball.dx < ball.radie) {
    if (ball.x + ball.dx < ball.radie) {
      scoreP2 += ball_value;
      powerUps = [];
      localStorage.setItem('scoreP2', scoreP2);
    } else {
      scoreP1 += ball_value;
      powerUps = [];
      localStorage.setItem('scoreP1', scoreP1);
    }
    resetBall();
  }

  if (
    ball.x - ball.radie <= 20 + paddelBredd &&
    ball.y >= Pspelare1.y &&
    ball.y <= Pspelare1.y + paddelHöjd
  ) {
    ball.dx = -ball.dx;
  }

  if (
    ball.x + ball.radie >= canvas.width - 20 - paddelBredd &&
    ball.y >= Pspelare2.y &&
    ball.y <= Pspelare2.y + paddelHöjd
  ) {
    ball.dx = -ball.dx;
  }

  if (ball.y + ball.dy > canvas.height - ball.radie || ball.y + ball.dy < ball.radie) {
    ball.dy = -ball.dy;
  }

  kontrolleraPowerUpKollision(); // Kolla kollision med power-ups
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = Math.random() < 0.5 ? -3 : 3;
  ball.dy = (Math.random() - 0.5) * 3;
  ball.color = 'white';
  ball.radie = 20;
  ball_value = 1;
}

function animering() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ritaAvrundadeRektangel(ctx, 10, Pspelare1.y, paddelBredd, paddelHöjd, 0.02);
  ritaAvrundadeRektangel(ctx, canvas.width - 20 - paddelBredd, Pspelare2.y, paddelBredd, paddelHöjd, 0.02);
  ritaBoll();
  ritaPowerUps(); // Rita power-ups

  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(scoreP1.toString(), canvas.width / 4, 50);
  ctx.fillText(scoreP2.toString(), (canvas.width * 3) / 4, 50);

  uppdateraBoll();

  Pspelare1.y += Pspelare1.ySpeed;
  Pspelare2.y += Pspelare2.ySpeed;

  if (Pspelare1.y < 0) {
    Pspelare1.y = 0;
  } else if (Pspelare1.y + paddelHöjd > canvas.height) {
    Pspelare1.y = canvas.height - paddelHöjd;
  }

  if (Pspelare2.y < 0) {
    Pspelare2.y = 0;
  } else if (Pspelare2.y + paddelHöjd > canvas.height) {
    Pspelare2.y = canvas.height - paddelHöjd;
  }

  window.requestAnimationFrame(animering);
}

document.onkeydown = function (e) {
  const key = e.key;
  switch (key) {
    case "w":
      Pspelare1.ySpeed = -hastighet;
      break;
    case "s":
      Pspelare1.ySpeed = hastighet;
      break;
    case "ArrowUp":
      Pspelare2.ySpeed = -hastighet;
      break;
    case "ArrowDown":
      Pspelare2.ySpeed = hastighet;
      break;
    case "r": // Lägg till detta fall för tangenten "r"
      återställSpel();
      break;
  }
};

document.onkeyup = function (e) {
  const key = e.key;
  switch (key) {
    case "w":
    case "s":
      Pspelare1.ySpeed = 0;
      break;
    case "ArrowUp":
    case "ArrowDown":
      Pspelare2.ySpeed = 0;
      break;
  }
};

// Funktion för att återställa spelet och tömma skärmen på power-ups
function återställSpel() {
  // Återställ bollpositionen
  resetBall();
  powerUps = []; // Töm arrayen powerUps för att ta bort alla power-ups från skärmen
  
  // Återställ poäng
  scoreP1 = 0;
  scoreP2 = 0;
  localStorage.setItem('scoreP1', scoreP1);
  localStorage.setItem('scoreP2', scoreP2);
}

läggTillPowerUp(); // Lägg till power-ups med intervall mellan 5 och 20 studsar

window.requestAnimationFrame(animering);
