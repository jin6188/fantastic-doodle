// 粒子背景动画
const particleCount = 100;
const particleBg = document.getElementById("particle-bg");
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
particleBg.appendChild(canvas);

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 1.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.alpha = Math.random() * 0.5 + 0.3;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if(this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
    if(this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,212,255,${this.alpha})`;
    ctx.fill();
  }
}

const particles = [];
for(let i=0; i<particleCount; i++) {
  particles.push(new Particle());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}
animate();

// 轮盘抽奖逻辑
const skins = [
  {name:"银河战舰", img:"assets/skin1.png"},
  {name:"极光跑车", img:"assets/skin2.png"},
  {name:"烈焰狂飙", img:"assets/skin3.png"},
  {name:"星际战甲", img:"assets/skin4.png"},
  {name:"暗影幽灵", img:"assets/skin5.png"},
  {name:"雷霆战车", img:"assets/skin6.png"},
];

const wheelCanvas = document.getElementById("wheel");
const ctxWheel = wheelCanvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const resultDiv = document.getElementById("result");
const skinImg = document.getElementById("skin-img");
const skinName = document.getElementById("skin-name");
const recordList = document.getElementById("recordList");

let startAngle = 0;
const arc = Math.PI * 2 / skins.length;
let spinTimeout = null;
let spinArcStart = 0;
let spinTime = 0;
let spinTimeTotal = 0;

function drawWheel() {
  ctxWheel.clearRect(0,0,wheelCanvas.width,wheelCanvas.height);
  ctxWheel.strokeStyle = "#000";
  ctxWheel.lineWidth = 2;
  ctxWheel.font = "bold 16px Microsoft YaHei";
  ctxWheel.textAlign = "center";
  ctxWheel.textBaseline = "middle";

  for(let i=0; i<skins.length; i++) {
    const angle = startAngle + i * arc;
    ctxWheel.fillStyle = i % 2 === 0 ? "#00d4ff" : "#0077aa";
    ctxWheel.beginPath();
    ctxWheel.moveTo(wheelCanvas.width/2, wheelCanvas.height/2);
    ctxWheel.arc(wheelCanvas.width/2, wheelCanvas.height/2, wheelCanvas.width/2 - 10, angle, angle + arc, false);
    ctxWheel.lineTo(wheelCanvas.width/2, wheelCanvas.height/2);
    ctxWheel.fill();
    ctxWheel.stroke();

    // 绘制文字
    ctxWheel.save();
    ctxWheel.translate(
      wheelCanvas.width/2 + Math.cos(angle + arc/2) * (wheelCanvas.width/2 - 70),
      wheelCanvas.height/2 + Math.sin(angle + arc/2) * (wheelCanvas.height/2 - 70)
    );
    ctxWheel.rotate(angle + arc/2 + Math.PI/2);
    ctxWheel.fillStyle = "#fff";
    ctxWheel.fillText(skins[i].name, 0, 0);
    ctxWheel.restore();
  }

  // 指针
  ctxWheel.fillStyle = "#ff4136";
  ctxWheel.beginPath();
  ctxWheel.moveTo(wheelCanvas.width/2 - 10, 10);
  ctxWheel.lineTo(wheelCanvas.width/2 + 10, 10);
  ctxWheel.lineTo(wheelCanvas.width/2, 40);
  ctxWheel.fill();
}

function spin() {
  spinBtn.disabled = true;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3 + 4 * 1000; // 4-7秒
  rotateWheel();
}

function rotateWheel() {
  spinTime += 30;
  if(spinTime >= spinTimeTotal){
    stopRotateWheel();
    return;
  }
  const spinAngle = easeOut(spinTime, 0, 10, spinTimeTotal);
  startAngle += (spinAngle * Math.PI/180);
  drawWheel();
  spinTimeout = setTimeout(rotateWheel, 30);
}

function stopRotateWheel() {
  clearTimeout(spinTimeout);
  const degrees = startAngle * 180/Math.PI + 90;
  const arcd = arc * 180/Math.PI;
  const index = Math.floor((360 - (degrees % 360)) / arcd) % skins.length;
  showResult(index);
  spinBtn.disabled = false;
}

function easeOut(t, b, c, d) {
  const ts=(t/=d)*t;
  const tc=ts*t;
  return b+c*(tc + -3*ts + 3*t);
}

function showResult(index) {
  const skin = skins[index];
  skinImg.src = skin.img;
  skinName.textContent = skin.name;
  resultDiv.classList.remove("hidden");

  addRecord(skin.name);
}

function addRecord(skinName) {
  const li = document.createElement("li");
  li.textContent = `玩家${randomId()}领取了【${skinName}】皮肤`;
  recordList.prepend(li);
  if(recordList.children.length > 20) {
    recordList.removeChild(recordList.lastChild);
  }
}

function randomId() {
  return 'QPE' + Math.floor(100000 + Math.random()*900000);
}

drawWheel();

// 认证与抽奖流程
const authForm = document.getElementById("authForm");
const wheelContainer = document.getElementById("wheel-container");

authForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const gameId = document.getElementById("gameId").value.trim();
  const realName = document.getElementById("realName").value.trim();
  if(!gameId || !realName) {
    alert("请填写完整信息");
    return;
  }
  alert("实名认证成功！开始抽奖吧！");
  authForm.classList.add("hidden");
  wheelContainer.classList.remove("hidden");
});

spinBtn.addEventListener("click", spin);

// 窗口大小改变调整canvas大小
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
