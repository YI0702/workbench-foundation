// ===== 基座 Demo 交互逻辑 =====

// AI 对话提交（语义路由模拟）
function handleAISubmit() {
  const input = document.getElementById('aiInput');
  const text = input.value.trim();
  if (!text) {
    alert('试试描述你想做的事，例如：「我要新建一个金融行业的深转激励模板」');
    return;
  }
  // 模拟语义路由：根据关键词跳转
  const route = routeByKeywords(text);
  if (route) {
    showRoutingHint(route.module, text);
    setTimeout(() => { window.location.href = route.url; }, 800);
  } else {
    alert('暂未识别到对应模块，下一版会接入完整 AI 对话能力。\n你提的内容：' + text);
  }
}

function routeByKeywords(text) {
  const rules = [
    { kw: ['新建', '生产', '模板', '设计', '迭代'], module: '模板生产', url: 'demo-生产.html' },
    { kw: ['规则', '冲突', '白名单', '黑名单', '配置', '上限'], module: '规则配置', url: 'demo-规则.html' },
    { kw: ['洞察', '归因', '效果', 'CTR', '转化', '消耗'], module: '洞察归因', url: 'demo-洞察.html' },
    { kw: ['排查', '异常', '报错', '失败', 'bug', 'case'], module: '问题排查', url: 'demo-排查.html' },
    { kw: ['总览', '大盘', '全景', '看', '查询'], module: '全景总览', url: 'demo-总览.html' },
  ];
  for (const r of rules) {
    if (r.kw.some(k => text.toLowerCase().includes(k.toLowerCase()))) return r;
  }
  return null;
}

function showRoutingHint(module, text) {
  const hint = document.createElement('div');
  hint.style.cssText = `
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    background: #fff; padding: 24px 32px; border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2); z-index: 1000;
    text-align: center; min-width: 320px;
  `;
  hint.innerHTML = `
    <div style="font-size:28px; margin-bottom:10px;">🎯</div>
    <div style="font-size:15px; font-weight:600; margin-bottom:6px;">已识别意图</div>
    <div style="font-size:13px; color:#4a5568; margin-bottom:12px;">「${text}」</div>
    <div style="font-size:14px; color:#2b6cb0;">→ 正在跳转到「${module}」模块...</div>
  `;
  document.body.appendChild(hint);
}

// 高频提示填充
function fillHint(text) {
  const input = document.getElementById('aiInput');
  input.value = text;
  input.focus();
}

// 视角切换
const viewData = {
  '赛道': {
    'm-tpl-total': '86', 'm-tpl-new': '12', 'm-tpl-pause': '3',
    'm-cost': '2,340w', 'm-ctr': '+8.2%', 'm-cvr': '+3.1%',
    'm-rule-conflict': '2', 'm-rule-active': '47',
  },
  '场景': {
    'm-tpl-total': '34', 'm-tpl-new': '5', 'm-tpl-pause': '1',
    'm-cost': '1,120w', 'm-ctr': '+5.6%', 'm-cvr': '+2.4%',
    'm-rule-conflict': '1', 'm-rule-active': '28',
  },
  '预算': {
    'm-tpl-total': '52', 'm-tpl-new': '8', 'm-tpl-pause': '2',
    'm-cost': '1,860w', 'm-ctr': '+9.1%', 'm-cvr': '+4.2%',
    'm-rule-conflict': '1', 'm-rule-active': '32',
  },
  'SDK': {
    'm-tpl-total': '—', 'm-tpl-new': '—', 'm-tpl-pause': '—',
    'm-cost': '3,420w', 'm-ctr': '+6.8%', 'm-cvr': '+2.9%',
    'm-rule-conflict': '0', 'm-rule-active': '—',
  },
};

function switchView(viewName) {
  document.querySelectorAll('.view-tab').forEach(t => t.classList.remove('active'));
  const target = document.querySelector(`.view-tab[data-view="${viewName}"]`);
  if (target) target.classList.add('active');

  const data = viewData[viewName];
  if (!data) return;
  Object.keys(data).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = data[id];
  });
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

// Skills Tab 切换
function switchSkillTab(tab) {
  document.querySelectorAll('.skill-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('skill-grid-official').classList.toggle('hidden', tab !== 'official');
  document.getElementById('skill-grid-community').classList.toggle('hidden', tab !== 'community');
}
