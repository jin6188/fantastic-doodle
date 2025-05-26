// 皮肤数据（名字 + 颜色）
const skins = [
  {name:"幻影枪战", color:"#1abc9c"},
  {name:"雷霆出击", color:"#3498db"},
  {name:"烈焰之刃", color:"#9b59b6"},
  {name:"寒冰战士", color:"#e67e22"},
  {name:"风暴突击", color:"#e74c3c"},
  {name:"夜幕幽灵", color:"#34495e"},
];

// 生成随机领取名单的游戏名示例
const sampleNames = [
  "雷霆王者","火焰使者","风暴猎手","暗夜刺客","幻影枪神",
  "寒冰战魂","烈焰战狼","狂暴战士","疾风剑客","黑夜幽灵",
  "闪电侠","破晓先锋","烈火焚城","冰封战神","雷电狂徒",
  "天空守护","暗影猎人","终结者","光明骑士","龙之传人"
];

// DOM元素
const authSection = document.getElementById("authSection");
const lotterySection = document.getElementById("lotterySection");
const recordsList = document.getElementById("recordsList");

const infoForm = document.getElementById("infoForm");
const spinBtn = document.getElementById("spinBtn");
const resultDiv = document.getElementById("result");
const resultImg = document.getElementById("resultImg");
const resultName = document.getElementById("resultName");
const backBtn = document.getElementById("backBtn");

let isSpinning = false;

// 认证表单提交处理
infoForm.addEventListener("submit", e => {
  e.preventDefault();

  // 简单验证
  const gameName = document.getElementById("gameName").value.trim();
  const realName = document.getElementById("realName").value.trim();
  const idNumber = document.getElementById("idNumber").value.trim();
  const accountType = document.querySelector('input[name="accountType"]:checked').value;

  if (!gameName || !realName || !idNumber) {
    alert("请填写所有信息");
    return;
  }

  // 身份证简单格式校验
  if (!/^\d{15}$/.test(idNumber) && !/^\d{18}$/.test(idNumber)) {
    alert("请输入正确的身份证号码");
    return;
  }

  // 模拟提交认证（这里你可以改成真实接口）
  spinBtn.disabled = false;
  alert("认证成功！现在可以开始抽奖了。");
  authSection.classList.add("hidden");
  lotterySection.classList.remove("hidden");
  resultDiv.classList.add("hidden");
});

// 抽奖按钮
spinBtn.addEventListener("click", () => {
  if (isSpinning) return;
  isSpinning = true;
  spinBtn.disabled = true;

  // 模拟炫酷平行滑动动画（这里用简单的闪烁+选中效果演示）
  const wheel = document.getElementById("wheel");
  let highlightIndex = 0;
  let speed = 100;
  let totalCycles = 30;
  let currentCycle = 0;

  const interval = setInterval(() => {
    // 移除之前高亮
    [...wheel.children].forEach((child, idx) => {
      child.style.boxShadow = "0 0 8px #00ffffaa";
      if (idx === highlightIndex) {
        child.style.boxShadow = "0 0 15px 5px #00ffff";
      }
    });

    highlightIndex = (highlightIndex + 1) % skins.length;
    currentCycle++;

    if (currentCycle >= totalCycles) {
      clearInterval(interval);
      // 抽奖结果
      const winIndex = Math.floor(Math.random() * skins.length);

      // 展示结果
      const winSkin = skins[winIndex];
      resultImg.style.backgroundColor = winSkin.color;
      resultName.textContent = winSkin.name;
      resultDiv.classList.remove("hidden");

      // 加入领取名单
      addRecord(gameNameFromForm(), winSkin.name);

      isSpinning = false;
      spinBtn.disabled = false;
    }
  }, speed);
});

// 返回认证页按钮
backBtn.addEventListener("click", () => {
  lotterySection.classList.add("hidden");
  authSection.classList.remove("hidden");
  resultDiv.classList.add("hidden");
});

// 获取当前游戏昵称（表单或缓存）
function gameNameFromForm() {
  return document.getElementById("gameName").value.trim() || "匿名玩家";
}

// 生成并展示随机领取名单（100条）
function generateRecords() {
  let records = [];
  for (let i = 0; i < 100; i++) {
    const player = sampleNames[Math.floor(Math.random() * sampleNames.length)] + Math.floor(Math.random() * 999);
    const skin = skins[Math.floor(Math.random() * skins.length)].name;
    records.push(`${player} 领取了皮肤【${skin}】`);
  }
  return records;
}

// 滚动名单内容
function createScrollingRecords() {
  const records = generateRecords();

  // 清空旧内容
  recordsList.innerHTML = "";

  // 创建内容div，绝对定位做垂直滚动
  const contentDiv = document.createElement("div");
  contentDiv.className = "records-content";
  contentDiv.style.animationDuration = `${records.length * 1.5}s`;

  // 拼接内容，换行
  contentDiv.innerHTML = records.map(r => `<div>${r}</div>`).join("");

  recordsList.appendChild(contentDiv);
}

// 新领取加入名单顶部
function addRecord(name, skin) {
  const newRecord = `${name} 领取了皮肤【${skin}】`;

  const contentDiv = recordsList.querySelector(".records-content");
  if (!contentDiv) return;

  const newDiv = document.createElement("div");
  newDiv.textContent = newRecord;

  contentDiv.insertBefore(newDiv, contentDiv.firstChild);

  // 移除最后一个，保持100条
  if (contentDiv.children.length > 100) {
    contentDiv.removeChild(contentDiv.lastChild);
  }
}

// 初始化名单滚动
createScrollingRecords();
