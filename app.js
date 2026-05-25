// ===== 基座 Demo 交互逻辑 v0.2 =====

// ===== 模型切换 =====
let currentModel = '混元';
function switchModel(name) {
  currentModel = name;
  document.querySelectorAll('.model-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.model-tab[data-model="${name}"]`).classList.add('active');
}

// ===== Skills 挂载（个人）=====
function openMountPicker() {
  document.getElementById('mountPicker').style.display = 'block';
}
function closeMountPicker() {
  document.getElementById('mountPicker').style.display = 'none';
}
function mountUserSkill(name) {
  const wrap = document.getElementById('userMounted');
  const nameEl = document.getElementById('userMountedName');
  nameEl.textContent = name;
  wrap.style.display = 'inline-flex';
  closeMountPicker();
}
function unmountUserSkill() {
  document.getElementById('userMounted').style.display = 'none';
}

// ===== AI 对话提交（语义路由 · 含 Skill 调用提示）=====
function handleAISubmit() {
  const input = document.getElementById('aiInput');
  const text = input.value.trim();
  if (!text) {
    alert('试试描述你想做的事，例如：「模板 1001200 改成只在流量 A 下出，帮我评估风险」');
    return;
  }
  const route = routeByKeywords(text);
  const skillCalled = detectSkillCall(text);
  if (route) {
    showRoutingHint(route.module, text, skillCalled);
    setTimeout(() => { window.location.href = route.url; }, 1200);
  } else {
    alert('暂未识别到对应模块，下一版会接入完整 AI 对话能力。\n你提的内容：' + text);
  }
}

function routeByKeywords(text) {
  const rules = [
    { kw: ['新建', '生产', '迭代', '设计模板', '上线模板'], module: '样式生产管理', url: 'demo-生产.html' },
    { kw: ['规则', '冲突', '白名单', '黑名单', '配置', '上限', '审批'], module: '规则配置', url: 'demo-规则.html' },
    { kw: ['洞察', '归因', '效果', 'CTR', '转化', '消耗', '建议', '趋势'], module: '洞察样式效果', url: 'demo-洞察.html' },
    { kw: ['排查', '为什么', '无法', '失败', '不出', '诊断', '标签'], module: '样式问题排查', url: 'demo-排查.html' },
  ];
  for (const r of rules) {
    if (r.kw.some(k => text.toLowerCase().includes(k.toLowerCase()))) return r;
  }
  return null;
}

function detectSkillCall(text) {
  if (/规则|冲突|白名单|改成/.test(text)) return '官方 · 模板规则审查';
  if (/为什么|无法|不出|排查|标签/.test(text)) return '官方 · 模板问题排查';
  return null;
}

function showRoutingHint(module, text, skill) {
  const hint = document.createElement('div');
  hint.style.cssText = `
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    background: #fff; padding: 22px 28px; border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2); z-index: 1000;
    text-align: left; min-width: 360px; max-width: 480px;
  `;
  const skillLine = skill
    ? `<div style="font-size:12px; color:#22543d; background:#f0fff4; padding:6px 10px; border-radius:4px; margin-bottom:10px;">🎯 调用了 Skill：<strong>${skill}</strong></div>`
    : '';
  hint.innerHTML = `
    <div style="font-size:13px; color:#718096; margin-bottom:6px;">模型：${currentModel} · 已识别意图</div>
    <div style="font-size:14px; color:#1a202c; margin-bottom:10px; line-height:1.6;">「${text}」</div>
    ${skillLine}
    <div style="font-size:14px; color:#2b6cb0; font-weight:500;">→ 正在跳转到「${module}」模块...</div>
  `;
  document.body.appendChild(hint);
}

function fillHint(text) {
  const input = document.getElementById('aiInput');
  input.value = text;
  input.focus();
}

// ===== 视角筛选 =====
function switchMode(mode) {
  document.querySelectorAll('.filter-mode').forEach(t => t.classList.remove('active'));
  document.querySelector(`.filter-mode[data-mode="${mode}"]`).classList.add('active');
  document.getElementById('filterDetail').style.display = mode === 'custom' ? 'block' : 'none';
  if (mode === 'all') {
    document.getElementById('filterSummary').textContent = '大盘全量 · 不做视角筛选';
  }
}

function applyFilter() {
  const groups = { '赛道': [], '场景': [], '预算KPI': [], '预算微信': [] };
  document.querySelectorAll('.filter-options input[type=checkbox]:checked').forEach(c => {
    const dim = c.getAttribute('data-dim');
    if (groups[dim]) groups[dim].push(c.value);
  });
  const parts = [];
  if (groups['赛道'].length) parts.push(`赛道：${groups['赛道'].join('/')}`);
  if (groups['场景'].length) parts.push(`场景：${groups['场景'].join('/')}`);
  const budgetParts = [];
  if (groups['预算KPI'].length) budgetParts.push(`KPI：${groups['预算KPI'].join('/')}`);
  if (groups['预算微信'].length) budgetParts.push(`微信：${groups['预算微信'].join('/')}`);
  if (budgetParts.length) parts.push(`预算 [${budgetParts.join('，')}]`);
  document.getElementById('filterSummary').textContent = parts.length
    ? '已筛选 · ' + parts.join('｜')
    : '未选择任何条件 · 默认大盘全量';
}

function resetFilter() {
  document.querySelectorAll('.filter-options input[type=checkbox]').forEach(c => c.checked = false);
  document.getElementById('filterSummary').textContent = '已重置 · 大盘全量';
}

// ===== Skills Tab 切换 =====
function switchSkillTab(tab) {
  document.querySelectorAll('.skill-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('skill-grid-official').classList.toggle('hidden', tab !== 'official');
  document.getElementById('skill-grid-community').classList.toggle('hidden', tab !== 'community');
}

// 回车提交
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('aiInput');
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleAISubmit();
    });
  }
});
