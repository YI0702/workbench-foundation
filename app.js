// ===== 基座 Demo 交互逻辑 v0.3 =====

// ===== 模型切换（下拉菜单）=====
let currentModel = '混元 HY3';
function toggleModelDropdown(e) {
  e.stopPropagation();
  const dd = document.getElementById('modelDropdown');
  const isOpen = dd.classList.contains('open');
  closeAllDropdowns();
  if (!isOpen) dd.classList.add('open');
}
function switchModel(name, icon) {
  currentModel = name;
  document.getElementById('currentModelName').textContent = name;
  document.querySelector('.ms-icon').textContent = icon;
  document.querySelectorAll('.md-item').forEach(i => i.classList.remove('active'));
  event.target.closest('.md-item').classList.add('active');
  document.getElementById('modelDropdown').classList.remove('open');
}

// ===== 技能面板 =====
function toggleSkillPanel(e) {
  e.stopPropagation();
  const panel = document.getElementById('skillPanel');
  const isOpen = panel.style.display === 'block';
  closeAllDropdowns();
  panel.style.display = isOpen ? 'none' : 'block';
}

function closeAllDropdowns() {
  document.getElementById('modelDropdown').classList.remove('open');
  document.getElementById('skillPanel').style.display = 'none';
  document.querySelectorAll('.tool-pop').forEach(p => p.style.display = 'none');
}

// ===== @ / 附件 工具弹层 =====
function toggleToolPop(e, id) {
  e.stopPropagation();
  const pop = document.getElementById(id);
  const isOpen = pop.style.display === 'block';
  closeAllDropdowns();
  pop.style.display = isOpen ? 'none' : 'block';
}

// ===== 路由策略：真实意图交互 =====
function tryRoute(type) {
  const mask = document.createElement('div');
  mask.className = 'intent-modal-mask';
  mask.onclick = (e) => { if (e.target === mask) mask.remove(); };

  let inner = '';
  if (type === 'single') {
    inner = `
      <div class="im-q">你输入了：<strong>「帮我新建一个金融行业的开屏样式模板」</strong></div>
      <div class="im-sub">系统识别：命中唯一意图，置信度高 → 直接进入对应模块</div>
      <div class="im-single-note">✓ 单意图命中「新建模板」→ 无需选择，直达模板生产</div>
      <div class="im-choice" onclick="location.href='modules/produce/index.html'">
        <span class="im-choice-icon">🎨</span>
        <span class="im-choice-main">
          <span class="im-choice-name">模板生产</span>
          <span class="im-choice-why">带参进入：action=create · scene=开屏 · industry=金融</span>
        </span>
        <span class="im-choice-go">直达 →</span>
      </div>
      <div class="im-foot">点击进入 · 或点空白关闭</div>`;
  } else {
    inner = `
      <div class="im-q">你输入了：<strong>「这个开屏模板为什么效果差，是不是规则屏蔽了」</strong></div>
      <div class="im-sub">系统识别到 2 个可能意图，置信度接近 → 请你确认要去哪：</div>
      <div class="im-choice" onclick="location.href='modules/insight/index.html'">
        <span class="im-choice-icon">🔍</span>
        <span class="im-choice-main">
          <span class="im-choice-name">洞察归因 · 看为什么效果差</span>
          <span class="im-choice-why">命中「效果差/为什么」→ 组件级归因分析</span>
        </span>
        <span class="im-choice-go">去这里 →</span>
      </div>
      <div class="im-choice" onclick="location.href='modules/rule/index.html'">
        <span class="im-choice-icon">⚙️</span>
        <span class="im-choice-main">
          <span class="im-choice-name">规则配置 · 查是否被屏蔽</span>
          <span class="im-choice-why">命中「规则/屏蔽」→ 查该模板分发规则</span>
        </span>
        <span class="im-choice-go">去这里 →</span>
      </div>
      <div class="im-foot">多意图时由用户决定 · 或点空白关闭</div>`;
  }
  const modal = document.createElement('div');
  modal.className = 'intent-modal';
  modal.innerHTML = inner;
  mask.appendChild(modal);
  document.body.appendChild(mask);
}

// 官方技能列表展开/收起
function toggleOfficialList(e) {
  e.stopPropagation();
  const list = document.getElementById('officialList');
  const arrow = document.getElementById('officialArrow');
  const collapsed = list.classList.toggle('sp-list-collapsed');
  arrow.textContent = collapsed ? '▸' : '▾';
}

// 点击页面其他位置关闭下拉
document.addEventListener('click', e => {
  if (!e.target.closest('.model-selector') && !e.target.closest('.skill-mount-btn') && !e.target.closest('.skill-panel')) {
    closeAllDropdowns();
  }
});

// 挂载个人技能
function mountUserSkill(name, author) {
  const tag = document.getElementById('userMountedTag');
  document.getElementById('userMountedName').textContent = `🌱 ${name}（${author}）`;
  tag.style.display = 'inline-flex';
  document.getElementById('skillCount').textContent = '3';
  closeAllDropdowns();
}
function unmountUserSkill() {
  document.getElementById('userMountedTag').style.display = 'none';
  document.getElementById('skillCount').textContent = '2';
}

// ===== AI 对话提交 =====
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
    { kw: ['新建', '生产', '迭代', '设计模板', '上线模板'], module: '样式生产管理', url: 'modules/produce/index.html' },
    { kw: ['规则', '冲突', '白名单', '黑名单', '配置', '上限', '审批'], module: '规则配置', url: 'modules/rule/index.html' },
    { kw: ['洞察', '归因', '效果', 'CTR', '转化', '消耗', '建议', '趋势'], module: '洞察样式效果', url: 'modules/insight/index.html' },
    { kw: ['排查', '为什么', '无法', '失败', '不出', '诊断', '标签'], module: '样式问题排查', url: 'modules/trouble/index.html' },
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
    ? `<div style="font-size:12px; color:#22543d; background:#f0fff4; padding:6px 10px; border-radius:4px; margin-bottom:10px;">🛠️ 调用了技能：<strong>${skill}</strong></div>`
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

// ===== 第二层：场景卡带 prompt 跳转（预制可编辑 + 按模块形态衔接）=====
function goWithPrompt(module, landing, prompt, landingName, landingDesc) {
  const urlMap = {
    produce: 'modules/produce/index.html',
    rule: 'modules/rule/index.html',
    insight: 'modules/insight/index.html',
    trouble: 'modules/trouble/index.html',
  };
  const nameMap = {
    produce: '模板生产', rule: '规则配置', insight: '洞察归因', trouble: '问题排查',
  };
  const mask = document.createElement('div');
  mask.className = 'intent-modal-mask';
  mask.onclick = (e) => { if (e.target === mask) mask.remove(); };
  const modal = document.createElement('div');
  modal.className = 'intent-modal';
  modal.innerHTML = `
    <div class="im-q">进入 <strong>${nameMap[module]}</strong> 前，可先调整这句 prompt：</div>
    <div class="im-sub">预制模板仅供起手，按你的真实需求改完再进入</div>
    <textarea class="im-edit" id="promptEdit" rows="3">${prompt}</textarea>
    <div class="im-landing">进入形态：<strong>${landingName}</strong><br><span>${landingDesc}</span></div>
    <div class="im-choice" onclick="enterModule('${urlMap[module]}')">
      <span class="im-choice-icon">➤</span>
      <span class="im-choice-main">
        <span class="im-choice-name">带这句进入 ${nameMap[module]}</span>
      </span>
      <span class="im-choice-go">进入 →</span>
    </div>
    <div class="im-foot">可编辑后进入 · 或点空白关闭</div>`;
  mask.appendChild(modal);
  document.body.appendChild(mask);
  setTimeout(() => { const t = document.getElementById('promptEdit'); if (t) t.focus(); }, 50);
}

// 带编辑后的 prompt 进入模块（URL 参数传递，模块侧解析预填）
function enterModule(url) {
  const t = document.getElementById('promptEdit');
  const prompt = t ? t.value.trim() : '';
  const sep = url.includes('?') ? '&' : '?';
  location.href = prompt ? `${url}${sep}prompt=${encodeURIComponent(prompt)}` : url;
}

// ===== 视角筛选 =====
function switchMode(mode) {
  document.querySelectorAll('.filter-mode').forEach(t => t.classList.remove('active'));
  const btn = document.querySelector(`.filter-mode[data-mode="${mode}"]`);
  if (btn) btn.classList.add('active');
  document.getElementById('filterDetail').style.display = mode === 'custom' ? 'block' : 'none';
  if (mode === 'all') {
    document.getElementById('filterSummary').textContent = '大盘全量 · 不做视角筛选';
  }
}

// ===== 时间周期筛选 =====
function switchTime(btn, mode) {
  document.querySelectorAll('.time-mode').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const custom = document.getElementById('timeCustom');
  custom.style.display = mode === '自定义' ? 'inline-flex' : 'none';
  if (mode === '自定义') {
    const end = document.getElementById('timeEnd');
    const start = document.getElementById('timeStart');
    end.onchange = start.onchange = validateTimeWindow;
  }
}
function validateTimeWindow() {
  const s = document.getElementById('timeStart').value;
  const e = document.getElementById('timeEnd').value;
  if (!s || !e) return;
  const days = (new Date(e) - new Date(s)) / 86400000;
  if (days < 0) { alert('结束日期不能早于开始日期'); document.getElementById('timeEnd').value = ''; }
  else if (days > 31) { alert('自定义时间窗口不能超过 1 个月'); document.getElementById('timeEnd').value = ''; }
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

// 回车提交（Shift+Enter 换行）
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('aiInput');
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleAISubmit();
      }
    });
  }
});
