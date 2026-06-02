/* 样式生产管理 Demo · 交互脚本 v0.2 */
(function () {
  'use strict';

  // ============ 视角切换 ============
  const roleBtns = document.querySelectorAll('.role-btn');
  roleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      roleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const role = btn.dataset.role;

      const approveTab = document.querySelector('.subtab.role-only');
      if (approveTab) {
        approveTab.style.display = role === 'product' ? '' : 'none';
        if (role !== 'product' && approveTab.classList.contains('active')) {
          activateSubTab('own');
        }
      }

      if (role === 'ops') {
        document.querySelector('#ideas-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (role === 'product') {
        activateTab('overview');
      }

      const av = document.querySelector('.user-avatar');
      if (av) {
        const map = { product: '樊', design: '桃', dev: '楠', ops: '伦' };
        av.textContent = map[role] || '客';
      }
    });
  });

  // ============ 首页 / 我的工作台 ============
  function activateTab(name) {
    document.querySelectorAll('#dashboard > .section-head .tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
    document.querySelectorAll('#dashboard > .tab-pane').forEach(p => p.classList.toggle('active', p.dataset.pane === name));
    // 创意广场：仅在"首页"Tab 显示
    const ideas = document.getElementById('ideas-section');
    if (ideas) ideas.style.display = (name === 'overview') ? '' : 'none';
  }
  document.querySelectorAll('#dashboard > .section-head .tab').forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab.dataset.tab));
  });

  // ============ 我的工作台子 Tab ============
  function activateSubTab(name) {
    document.querySelectorAll('.subtab').forEach(t => t.classList.toggle('active', t.dataset.subtab === name));
    document.querySelectorAll('.subtab-pane').forEach(p => p.classList.toggle('active', p.dataset.pane === name));
  }
  document.querySelectorAll('.subtab').forEach(tab => {
    tab.addEventListener('click', () => activateSubTab(tab.dataset.subtab));
  });

  // ============ 模板池 Tab ============
  function activatePoolTab(name) {
    document.querySelectorAll('.pool-tabs .tab').forEach(t => t.classList.toggle('active', t.dataset.pooltab === name));
    document.querySelectorAll('.pool-pane').forEach(p => p.classList.toggle('active', p.dataset.pane === name));
  }
  document.querySelectorAll('.pool-tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => activatePoolTab(tab.dataset.pooltab));
  });

  // ============ 红榜 Tab（大盘内） ============
  document.querySelectorAll('.redlist-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.redtab;
      tab.parentElement.querySelectorAll('.redlist-tab').forEach(t => t.classList.toggle('active', t === tab));
      document.querySelectorAll('.redlist-pane').forEach(p => p.classList.toggle('active', p.dataset.redpane === target));
    });
  });

  // ============ Filter Pills ============
  document.querySelectorAll('.filter-bar, .table-toolbar-right').forEach(bar => {
    const groups = [];
    let cur = [];
    bar.childNodes.forEach(n => {
      if (n.nodeType === 1) {
        if (n.classList.contains('filter-divider') || n.classList.contains('filter-label')) {
          if (cur.length) { groups.push(cur); cur = []; }
        } else if (n.classList.contains('pill')) {
          cur.push(n);
        }
      }
    });
    if (cur.length) groups.push(cur);
    groups.forEach(g => {
      g.forEach(p => {
        p.addEventListener('click', () => {
          g.forEach(x => x.classList.remove('active'));
          p.classList.add('active');
        });
      });
    });
  });

  // ============ Agent 抽屉 ============
  const agentDrawer = document.getElementById('agentDrawer');
  const agentMask = document.getElementById('agentMask');
  const openAgent = document.getElementById('openAgent');
  const closeAgent = document.getElementById('closeAgent');
  const agentBarInput = document.getElementById('agentBarInput');

  function showAgent() { agentDrawer.classList.add('show'); agentMask.classList.add('show'); }
  function hideAgent() { agentDrawer.classList.remove('show'); agentMask.classList.remove('show'); }
  openAgent?.addEventListener('click', showAgent);
  closeAgent?.addEventListener('click', hideAgent);
  agentMask?.addEventListener('click', hideAgent);
  agentBarInput?.addEventListener('focus', showAgent);

  document.querySelectorAll('.agent-tab').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.agent-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      const target = t.dataset.agentTab;
      document.querySelectorAll('.agent-pane').forEach(p => p.classList.toggle('active', p.dataset.pane === target));
    });
  });

  // ============ 二级抽屉通用 ============
  const sideMask = document.getElementById('sideDrawerMask');
  const formDrawer = document.getElementById('formDrawer');
  const pipelineDrawer = document.getElementById('pipelineDrawer');

  function showDrawer(el) {
    el.classList.add('show');
    sideMask.classList.add('show');
  }
  function hideAllDrawers() {
    formDrawer.classList.remove('show');
    pipelineDrawer.classList.remove('show');
    sideMask.classList.remove('show');
  }
  sideMask?.addEventListener('click', hideAllDrawers);
  document.querySelectorAll('[data-close]').forEach(b => {
    b.addEventListener('click', hideAllDrawers);
  });

  // ============ 形态行点击 → 实验数据抽屉 ============
  // 各形态实验数据
  const expData = {
    '原生': [
      { name: 'Android_SDK_边下边播错误优化实验', status: '100%', cost: '+0.23%', gmv: '+0.48%', ctr: '+0.29%', cvr: '+0.24%' },
      { name: 'iOS_全形态_SDN多链路优化实验', status: '100%', cost: '+0.13%', gmv: '-0.24%', ctr: '+0.05%', cvr: '-0.33%' },
      { name: '【iOS】全屏广告点击时补曝光_半屏添加到window后立即检测曝光_2', status: '100%', cost: '+0.04%', gmv: '-0.25%', ctr: '-0.93%', cvr: '+0.02%', danger: true },
      { name: '【iOS】【全形态】模板资源预加载实验', status: '100%', cost: '+0.03%', gmv: '-0.94%', ctr: '-0.11%', cvr: '+0.12%' },
      { name: '联盟SDK流量_调整联盟视频播放上报时间_V1', status: '100%', cost: '0.00%', gmv: '0.00%', ctr: '-', cvr: '-' },
      { name: 'Android_SDK_自渲染MediaView展示失败优化实验', status: '5%', cost: '-0.01%', gmv: '-0.54%', ctr: '+0.02%', cvr: '-0.04%' },
      { name: '【iOS】NSTimer切换GCDTimer实验', status: '100%', cost: '-0.23%', gmv: '-0.05%', ctr: '+0.02%', cvr: '+0.13%' },
      { name: 'Android_SDK_边下边播卡顿优化实验', status: '100%', cost: '-0.51%', gmv: '-0.75%', ctr: '-0.40%', cvr: '-0.20%', danger: true }
    ],
    '激励视频': [
      { name: '双端_激励_1003723模板实验', status: '100%', cost: '+7.34%', gmv: '+5.36%', ctr: '-0.98%', cvr: '-0.33%', big: true, danger: true },
      { name: '双端_开插激励原生_26Y618模板上线实验', status: '20%', cost: '+0.06%', gmv: '+0.17%', ctr: '-0.10%', cvr: '-0.01%' },
      { name: 'Android_激励_1003718小游戏试玩规格2264模板实验', status: '1%', cost: '-', gmv: '-', ctr: '-', cvr: '-' },
      { name: '双端_激励_蚂蚁阿福定制化点击激励模板', status: '100%', cost: '-0.29%', gmv: '+1.36%', ctr: '+0.05%', cvr: '-0.23%' }
    ],
    '开屏': [
      { name: '双端_开屏_系统弹窗大按钮_v3', status: '100%', cost: '+1.85%', gmv: '+2.24%', ctr: '+0.45%', cvr: '+0.12%', big: true },
      { name: 'iOS_开屏_竖滑视频实验', status: '10%', cost: '+0.62%', gmv: '+0.41%', ctr: '+0.18%', cvr: '+0.08%' },
      { name: 'Android_开屏_摇扭用_启动延迟优化', status: '100%', cost: '-0.11%', gmv: '-0.02%', ctr: '+0.21%', cvr: '+0.05%' }
    ],
    '插屏': [
      { name: '双端_插屏半屏_炫光岛屿模板实验', status: '100%', cost: '+2.41%', gmv: '+1.88%', ctr: '+0.62%', cvr: '+0.31%', big: true },
      { name: 'iOS_插屏_点击区域优化', status: '5%', cost: '+0.18%', gmv: '+0.22%', ctr: '+0.08%', cvr: '+0.04%' }
    ],
    'Banner': [
      { name: 'Banner_品牌横版刷新频率实验', status: '20%', cost: '+0.05%', gmv: '+0.03%', ctr: '+0.02%', cvr: '+0.01%' }
    ]
  };

  // 各形态红榜明细（详情页用）
  const redDetailData = {
    '原生': [
      { title: '自渲染_信息流_图片_大版摇一摇', id: '1001276', cost: '¥300,924.09', ctr: '9.11%', date: '2026-04-04' },
      { title: '【全突破】自渲染_信息流_图片_透明模板', id: '1001023', cost: '¥274,601.62', ctr: '8.49%', date: '2026-04-14' },
      { title: '·', id: '8002', cost: '¥226,065.59', ctr: '17.44%', date: '2026-05-05' },
      { title: '自渲染_信息流_视频_大版摇一摇', id: '1001277', cost: '¥172,718.92', ctr: '3.39%', date: '2026-04-03' },
      { title: '【全突破】自渲染_信息流_视频_透明模板', id: '1001024', cost: '¥167,797.36', ctr: '4.12%', date: '2026-04-13' },
      { title: '【七猫】激励化插页_9x16竖素材', id: '1003371', cost: '¥165,029.79', ctr: '4.21%', date: '2026-05-06' }
    ],
    '激励视频': [
      { title: '双端_激励_1003723模板', id: '1003723', cost: '¥412,580.20', ctr: '62.5%', date: '2026-04-22' },
      { title: '双端_开插激励原生_26Y618', id: '1003718', cost: '¥305,128.40', ctr: '60.2%', date: '2026-04-25' },
      { title: '蚂蚁阿福定制化点击激励模板', id: '1003680', cost: '¥218,540.10', ctr: '61.8%', date: '2026-05-01' }
    ],
    '开屏': [
      { title: '商品信息居上_系统弹窗_开屏_大按钮', id: '1003720', cost: '¥421,083.50', ctr: '9.85%', date: '2026-04-18' },
      { title: '商品信息居下_系统弹窗_开屏_摇扭用', id: '1003719', cost: '¥393,012.80', ctr: '9.10%', date: '2026-04-19' }
    ],
    '插屏': [
      { title: '商品信息_系统弹窗_插屏半屏-9x16', id: '1003721', cost: '¥182,460.50', ctr: '25.6%', date: '2026-04-20' },
      { title: '[26Y618][常规]插屏半屏_炫光岛屿_16x9', id: '1003769', cost: '¥149,802.30', ctr: '24.8%', date: '2026-05-12' }
    ],
    'Banner': [
      { title: 'Banner_品牌横版_v1', id: '1002902', cost: '¥18,420.30', ctr: '1.42%', date: '2026-04-29' }
    ]
  };

  function renderExpTable(form) {
    const list = expData[form] || [];
    const tbody = document.getElementById('expTbody');
    if (!tbody) return;
    document.getElementById('expSectionTitle').textContent = `${form} · ${list.length} 个实验`;
    tbody.innerHTML = list.map(e => {
      const cls = c => {
        if (c === '-' || c === '0.00%') return '';
        if (c.startsWith('+')) return 'up';
        if (c.startsWith('-')) return 'down';
        return '';
      };
      const arrow = c => {
        if (c === '-' || c === '0.00%') return c;
        if (c.startsWith('+')) return `▲ ${c}`;
        if (c.startsWith('-')) return `▼ ${c}`;
        return c;
      };
      const danger = e.danger ? ' danger' : '';
      const big = e.big ? ' big' : '';
      // 实验层级 → 色阶：100% 灰底 / 20%·10% 蓝底 / 5%·1% 黄底
      const layer = parseFloat(e.status);
      const stCls = layer >= 100 ? 'st-full' : (layer >= 10 ? 'st-mid' : 'st-trial');
      return `<tr>
        <td>${e.name}</td>
        <td><span class="exp-status ${stCls}">${e.status}</span></td>
        <td class="${cls(e.cost)}${big}">${arrow(e.cost)}</td>
        <td class="${cls(e.gmv)}${big}">${arrow(e.gmv)}</td>
        <td class="${cls(e.ctr)}${danger}">${arrow(e.ctr)}</td>
        <td class="${cls(e.cvr)}${danger}">${arrow(e.cvr)}</td>
        <td class="col-act"><a class="link" href="javascript:void(0)">🔗 查看</a></td>
      </tr>`;
    }).join('');
  }

  function renderRedDetail(form) {
    const list = redDetailData[form] || [];
    const wrap = document.getElementById('redDetailList');
    if (!wrap) return;
    wrap.innerHTML = `<div class="redlist-tag">🏆 红榜（TOP 表现）</div>` + list.map(r => `
      <div class="redlist-item">
        <div class="redlist-item-title"><span class="trophy">🏆</span>${r.title} · <span class="tid">${r.id}</span></div>
        <div class="redlist-item-meta">消耗 ${r.cost} · CTR ${r.ctr} · 上线 ${r.date}</div>
      </div>`).join('');
  }

  // 抽屉 Tab
  document.querySelectorAll('#formDrawer .drawer-tab').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('#formDrawer .drawer-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      const target = t.dataset.drawertab;
      document.querySelectorAll('#formDrawer .drawer-pane').forEach(p => p.classList.toggle('active', p.dataset.drawerpane === target));
    });
  });

  // 形态行点击
  document.querySelectorAll('.form-row').forEach(row => {
    row.addEventListener('click', () => {
      const form = row.dataset.form;
      document.getElementById('formDrawerTitle').textContent = `${form} · 形态详情`;
      renderExpTable(form);
      renderRedDetail(form);
      // 重置 Tab 到 实验
      document.querySelectorAll('#formDrawer .drawer-tab').forEach(x => x.classList.toggle('active', x.dataset.drawertab === 'exp'));
      document.querySelectorAll('#formDrawer .drawer-pane').forEach(p => p.classList.toggle('active', p.dataset.drawerpane === 'exp'));
      showDrawer(formDrawer);
    });
  });

  // ============ 模板行点击 → 流水线抽屉 ============
  // 阶段（pill / badge 文案）→ 步骤号 映射
  const STAGE_TO_STEP = {
    // 我经手表 stage-pill
    '编辑中':       '3',
    '测试中':       '4',
    '草稿上线':     '5',
    '实验中':       '6',
    '已上线':       '8',
    // 模板池 badge
    '待入库':       '5',
    '正式草稿':     '7',
    '待上线审批':   '7',
    '已发布':       '8'
  };

  // 哪些阶段算"已上线"（即 ⑧ 成绩单有数据）
  const ONLINE_STAGES = new Set(['已上线', '已发布']);

  // ============ 模板成绩单数据 ============
  // 仅覆盖"已上线"的模板，未上线模板进入 ⑧ 显示空态
  const reportData = {
    '1003690': {
      name: '【小店】弹窗+商品信息_自渲染_信息流_视频_图文',
      thumb: '🛍️',
      form: '原生 · 信息流',
      parent: '1002819',
      size: '0×0（自适应）',
      specIds: '2147,1766,351,865,2107,2106,1414,1413,1529,585,866,1874,862,1109',
      onlineDate: '2026-04-12',
      onlineDays: '47 天',
      cost: '¥421w',
      ctr: '9.85%',
      cvr: '26.13%',
      gmv: '+38%',
      imp: '1,820w / 日',
      rank: '原生 TOP 2',
      experiments: [
        { name: '双端_自渲染_信息流_小店弹窗模板上线实验', status: '已全量', delta: '消耗 +6.2% · GMV +12.4%' },
        { name: 'iOS_全形态_SDN多链路优化实验', status: '已全量', delta: '消耗 +0.13% · GMV -0.24%' }
      ],
      anomaly: '小米机型在折叠屏展开态下商品信息溢出（占曝光 1.8%），深度转化页 H5 加载 P95 偏高 2.1s。',
      suggest: '商品信息层切换到 ConstraintLayout 自适应；H5 引入预加载 prefetch；可一键克隆为 v2 继承数据。',
      readers: '2.4k 阅读 · 18 评论'
    },
    '1003723': {
      name: '双端_激励_1003723模板',
      thumb: '🎮',
      form: '激励视频',
      parent: '1003680',
      size: '9×16',
      specIds: '1735,1736,1874',
      onlineDate: '2026-04-25',
      onlineDays: '34 天',
      cost: '¥412w',
      ctr: '62.5%',
      cvr: '34.2%',
      gmv: '+27%',
      imp: '720w / 日',
      rank: '激励视频 TOP 3',
      experiments: [
        { name: '双端_激励_endcard交互重构实验', status: '已全量', delta: '消耗 +4.8% · GMV +9.1%' }
      ],
      anomaly: 'OPPO ColorOS 13 部分机型 endcard 关闭按钮区域被系统返回手势遮挡（占曝光 1.2%）。',
      suggest: '关闭按钮 hit-area 上移 16dp，避开手势热区；可联动激励赛道全形态复制方案。',
      readers: '1.7k 阅读 · 11 评论'
    },
    '1003721': {
      name: '商品信息_系统弹窗_插屏半屏-9x16视频-大区域-左下',
      thumb: '🎬',
      form: '插屏 · 半屏视频',
      parent: '1003216',
      size: '9×16',
      specIds: '1529,2107,2106,1414,1413,585,866,862,1109',
      onlineDate: '2026-05-02',
      onlineDays: '27 天',
      cost: '¥182w',
      ctr: '25.6%',
      cvr: '14.8%',
      gmv: '+24%',
      imp: '420w / 日',
      rank: '插屏 TOP 6',
      experiments: [
        { name: '双端_插屏半屏_左下大区域商品信息实验', status: '运行中 · 第 6 天', delta: '消耗 +2.1% · GMV +5.4%（中期）' }
      ],
      anomaly: '半屏视频在 Android 13+ 系统手势区误触关闭率较 v0 上升 0.8pp。',
      suggest: '关闭按钮位置上移 24dp 避开手势区；商品信息卡片增加 8dp 阴影增强层级感。',
      readers: '980 阅读 · 5 评论'
    },
    '1001023': {
      name: '【全突破】自渲染_信息流_图片_透明模板',
      thumb: '🖼️',
      form: '原生 · 透明模板',
      parent: '—',
      size: '0×0（自适应）',
      specIds: '351,865,866,1413,1414',
      onlineDate: '2025-09-08',
      onlineDays: '264 天（长青）',
      cost: '¥274w（近 30d）',
      ctr: '8.49%',
      cvr: '11.2%',
      gmv: '基线',
      imp: '610w / 日',
      rank: '原生 TOP 9',
      experiments: [
        { name: '（长青模板，无在跑实验，仅作为基线）', status: '已全量', delta: '—' }
      ],
      anomaly: '长期稳定运行，无显著异常。建议每月检查一次素材合规性。',
      suggest: '该模板已成为信息流场景基线，不做主动优化；新模板均以此为对照组评估增量。',
      readers: '6.2k 阅读 · 42 评论（累计）'
    },
    '1003728': {
      name: '[小说短剧]标准版深转激励-激励浏览(1735)',
      thumb: '📚',
      form: '激励视频',
      parent: '1003380',
      size: '0×0（自适应）',
      specIds: '1735',
      onlineDate: '2026-05-08',
      onlineDays: '21 天',
      cost: '¥98.2w',
      ctr: '64.3%',
      cvr: '38.7%',
      gmv: '+18.9%',
      imp: '380w / 日',
      rank: '激励视频 TOP 5',
      experiments: [
        { name: '双端_激励_深转激励浏览(1735)规格实验', status: '已全量', delta: '消耗 +5.1% · GMV +8.3%' }
      ],
      anomaly: '激励满 30s 跳转外站 H5 时，部分 Vivo 设备返回键失效（占曝光 0.6%）。',
      suggest: '在 H5 容器内监听 hardwareBack，回流时强制返回原生页；可联动小说&短剧赛道复制规格。',
      readers: '1.1k 阅读 · 6 评论'
    },
    // 一个示意：开屏-夏日冰镇风 v1（待入库，但保留作为 demo 兜底数据）
    '1003802': {
      name: '夏日冰镇风开屏 v1',
      thumb: '🌊',
      form: '开屏',
      parent: '1003062',
      size: '1080×1920',
      specIds: '866,1414,2106,2107,1413',
      onlineDate: '2026-05-22',
      onlineDays: '7 天',
      cost: '¥12.8w',
      ctr: '4.6%',
      cvr: '21.4%',
      gmv: '+38%',
      imp: '210w / 日',
      rank: '开屏 TOP 8',
      experiments: [
        { name: '双端_开屏_系统弹窗大按钮_v3', status: '已全量', delta: '消耗 +1.85% · GMV +2.24%' }
      ],
      anomaly: '华为机型在 720x1600 分辨率下副标题截断（占曝光 4.2%）。',
      suggest: '建议将副标题字号自适应缩放，或缩短 1 个字符。可一键克隆为 v2 草稿继承全部数据。',
      readers: '1.2k 阅读 · 8 评论'
    }
  };

  function renderReport(tplId, stageText) {
    const data = reportData[tplId];
    const empty = document.getElementById('reportEmpty');
    const full = document.getElementById('reportFull');
    const onlineBadge = document.getElementById('reportOnlineBadge');

    if (!data) {
      // 未上线模板：显示空态
      if (empty) empty.style.display = '';
      if (full) full.style.display = 'none';
      if (onlineBadge) {
        onlineBadge.textContent = stageText || '尚未上线';
        onlineBadge.className = 'badge wait';
      }
      return;
    }

    if (empty) empty.style.display = 'none';
    if (full) full.style.display = '';
    if (onlineBadge) {
      onlineBadge.textContent = `已上线 ${data.onlineDays}`;
      onlineBadge.className = 'badge ok';
    }

    // 顶部模板信息
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    document.getElementById('reportThumb').textContent = data.thumb;
    set('reportTplName', data.name);
    set('reportTplId', tplId);
    set('reportParentId', data.parent);
    set('reportForm', data.form);
    set('reportSize', data.size);
    set('reportOnlineDate', data.onlineDate);
    set('reportOnlineDays', data.onlineDays);
    set('reportSpecIds', data.specIds);

    // 6 宫格
    set('rkCost', data.cost);
    set('rkCtr', data.ctr);
    set('rkCvr', data.cvr);
    set('rkGmv', data.gmv);
    set('rkImp', data.imp);
    set('rkRank', data.rank);

    // 卡片副标
    set('reportSubMeta', `${data.name} · 上线 ${data.onlineDate}`);

    // 关联实验
    const expWrap = document.getElementById('reportExpList');
    if (expWrap) {
      if (data.experiments?.length) {
        expWrap.innerHTML = data.experiments.map(e => `
          <div class="report-exp-item">
            <span class="exp-status ${e.status === '已全量' ? 'st-full' : 'st-running'}">${e.status}</span>
            <span class="report-exp-name">${e.name}</span>
            <span class="report-exp-delta">${e.delta}</span>
          </div>`).join('');
      } else {
        expWrap.innerHTML = '<div class="muted">无关联实验</div>';
      }
    }

    set('reportAnomaly', data.anomaly);
    set('reportSuggest', data.suggest);

    // 企微卡片
    set('wecomTplName', data.name);
    set('wecomCtr', data.ctr);
    set('wecomCost', data.cost);
    set('wecomGmv', data.gmv);
    set('wecomAnomaly', data.anomaly);
    set('wecomSuggest', data.suggest);
    set('wecomFoot', `点击查看 · ${data.readers}`);
  }

  // 升级版 activateStep：自动维护 done / active 三态
  function activateStep(no) {
    const current = parseInt(no, 10);
    document.querySelectorAll('#pipelineDrawer .step').forEach(s => {
      const n = parseInt(s.dataset.step, 10);
      s.classList.remove('done', 'active');
      if (n < current) s.classList.add('done');
      else if (n === current) s.classList.add('done', 'active');
    });
    document.querySelectorAll('#pipelineDrawer .step-content').forEach(c => {
      c.classList.toggle('active', c.dataset.stepContent === no);
    });
  }
  document.querySelectorAll('#pipelineDrawer .step').forEach(s => {
    s.addEventListener('click', () => activateStep(s.dataset.step));
  });
  document.querySelectorAll('#pipelineDrawer .step-nav-btn').forEach(b => {
    b.addEventListener('click', () => activateStep(b.dataset.jump));
  });

  // 从行内推断当前阶段对应的步骤号
  function inferStepFromRow(row) {
    if (!row) return '2';
    const pill = row.querySelector('.stage-pill, .badge');
    const text = (pill?.textContent || '').trim();
    return STAGE_TO_STEP[text] || '2';
  }
  function inferStageText(row) {
    if (!row) return '';
    const pill = row.querySelector('.stage-pill, .badge');
    return (pill?.textContent || '').trim();
  }

  // 通过 [data-pipeline] 入口打开流水线抽屉
  document.querySelectorAll('[data-pipeline]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const tplId = a.dataset.pipeline;
      const row = a.closest('tr');
      const tplName = row?.querySelector('td:nth-child(2)')?.textContent?.trim() || '当前模板';
      const stepNo = inferStepFromRow(row);
      const stageText = inferStageText(row);
      document.getElementById('pipelineDrawerTitle').textContent = `模板生产流水线 · ${tplName}`;
      document.getElementById('pipelineDrawerSub').textContent =
        `模板ID：${tplId}${stageText ? ' · 当前阶段：' + stageText : ''} · 编辑 → 测试 → 草稿上线 → 实验 → 正式上线`;
      // 渲染成绩单（即便不在第 8 步，也提前渲染好；点过去就能看）
      renderReport(tplId, stageText);
      activateStep(stepNo);
      showDrawer(pipelineDrawer);
    });
  });

  // ====== [data-report] 入口：直接打开成绩单（即流水线抽屉直达 ⑧）======
  document.querySelectorAll('[data-report]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const tplId = a.dataset.report;
      const row = a.closest('tr');
      const tplName = row?.querySelector('td:nth-child(2)')?.textContent?.trim() || '当前模板';
      const stageText = inferStageText(row) || '已上线';
      document.getElementById('pipelineDrawerTitle').textContent = `模板数据成绩单 · ${tplName}`;
      document.getElementById('pipelineDrawerSub').textContent =
        `模板ID：${tplId} · 当前阶段：${stageText} · 已上线后自动出 v1 报告`;
      renderReport(tplId, stageText);
      activateStep('8');           // 直接定位到 ⑧
      showDrawer(pipelineDrawer);
    });
  });

  // ====== [data-edit] 入口：跳转 iDOMO 模板编辑器 ======
  // TODO: 拿到真实 iDOMO 编辑器 URL 后替换 EDITOR_BASE
  const EDITOR_BASE = 'https://idomo.tencent.com/editor';   // 占位
  document.querySelectorAll('[data-edit]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const tplId = a.dataset.edit;
      const row = a.closest('tr');
      const tplName = row?.querySelector('td:nth-child(2)')?.textContent?.trim() || '';
      // 由于 EDITOR_BASE 是占位地址，先用一个轻量的"跳转确认弹窗"，方便 demo 演示
      const ok = window.confirm(
        `即将打开 iDOMO 模板编辑器\n\n模板：${tplName}\n模板ID：${tplId}\n\n（demo 演示：实际会跳转到 iDOMO 画布；当前打开占位页 idomo-editor.html）`
      );
      if (ok) {
        window.open(`idomo-editor.html?id=${tplId}&name=${encodeURIComponent(tplName)}`, '_blank', 'noopener');
      }
    });
  });

  // 空态里"回到当前阶段"按钮
  document.querySelectorAll('[data-jump-empty]').forEach(b => {
    b.addEventListener('click', () => {
      // 当前模板的阶段已经体现在副标里，这里就跳到对应步骤
      // 简单做法：从副标解析阶段文字
      const sub = document.getElementById('pipelineDrawerSub')?.textContent || '';
      const match = sub.match(/当前阶段：(\S+?)\s/);
      const stage = match ? match[1] : '';
      const step = STAGE_TO_STEP[stage] || '2';
      activateStep(step);
    });
  });

  // ============ 顶部导航 active 切换 ============
  document.querySelectorAll('.topbar-nav .nav-link').forEach(l => {
    l.addEventListener('click', () => {
      const href = l.getAttribute('href') || '';
      if (href.startsWith('#')) {
        document.querySelectorAll('.topbar-nav .nav-link').forEach(x => x.classList.remove('active'));
        l.classList.add('active');
      }
    });
  });

  const sections = ['dashboard', 'pool', 'ideas-section'];
  window.addEventListener('scroll', () => {
    let cur = sections[0];
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top < 120) cur = id;
    }
    document.querySelectorAll('.topbar-nav .nav-link').forEach(l => {
      if (l.getAttribute('href') === '#' + cur) {
        document.querySelectorAll('.topbar-nav .nav-link').forEach(x => x.classList.remove('active'));
        l.classList.add('active');
      }
    });
  }, { passive: true });

  // ============ 创意广场 · 点赞 ============
  document.querySelectorAll('.idea-actions .btn-icon').forEach(b => {
    b.addEventListener('click', () => {
      const span = b.querySelector('span');
      if (!span) return;
      const text = b.textContent.trim();
      if (text.startsWith('👍')) {
        const n = parseInt(span.textContent, 10) || 0;
        if (b.classList.contains('liked')) {
          span.textContent = String(n - 1);
          b.classList.remove('liked');
          b.style.color = '';
        } else {
          span.textContent = String(n + 1);
          b.classList.add('liked');
          b.style.color = 'var(--color-primary)';
        }
      }
    });
  });

  // ============ Agent inline-btn 提示 ============
  document.querySelectorAll('.inline-btn').forEach(b => {
    b.addEventListener('click', e => {
      e.stopPropagation();
      const t = b.textContent.trim();
      if (t.includes('流水线')) {
        hideAgent();
        // 复用 [data-pipeline] 的逻辑：找到模板池中 1003802 这一行，按其阶段定位
        const trigger = document.querySelector('[data-pipeline="1003802"]');
        if (trigger) {
          trigger.click();
        } else {
          document.getElementById('pipelineDrawerTitle').textContent = '模板生产流水线 · 夏日冰镇风开屏 v1';
          document.getElementById('pipelineDrawerSub').textContent = '模板ID：1003802 · 当前阶段：待入库 · 编辑 → 测试 → 草稿上线 → 实验 → 正式上线';
          activateStep('5');
          showDrawer(pipelineDrawer);
        }
      }
    });
  });

  // ============ v0.3 新增 · 我参与的 · 阶段筛选实际生效 ============
  // 给"我参与的"表格的阶段 pill 单独绑定过滤逻辑（不与通用 pill 切换冲突）
  const stageFilter = document.getElementById('myTplStageFilter');
  if (stageFilter) {
    const ownPane = document.querySelector('.subtab-pane[data-pane="own"]');
    function applyMyTplFilter() {
      if (!ownPane) return;
      const activeStagePill = stageFilter.querySelector('.pill.active');
      const stage = activeStagePill?.dataset.stage || 'all';
      const kw = (document.getElementById('myTplSearch')?.value || '').trim().toLowerCase();
      ownPane.querySelectorAll('table.plain-table .tpl-row').forEach(row => {
        // 按阶段
        const pill = row.querySelector('.stage-pill, .badge');
        const text = (pill?.textContent || '').trim();
        const stageOk = stage === 'all' || text === stage;
        // 按关键字
        const rowText = row.textContent.toLowerCase();
        const kwOk = !kw || rowText.includes(kw);
        row.classList.toggle('hide-by-stage', !stageOk);
        row.classList.toggle('hide-by-search', !kwOk);
      });
    }
    stageFilter.querySelectorAll('.pill').forEach(p => {
      p.addEventListener('click', () => {
        stageFilter.querySelectorAll('.pill').forEach(x => x.classList.remove('active'));
        p.classList.add('active');
        applyMyTplFilter();
      });
    });
    document.getElementById('myTplSearch')?.addEventListener('input', applyMyTplFilter);
  }

  // ============ v0.3 新增 · 创意广场 Tab（全部 / 我的创意） ============
  document.querySelectorAll('#ideas-section .tab-group .tab[data-ideatab]').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('#ideas-section .tab-group .tab[data-ideatab]').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      const target = t.dataset.ideatab;
      document.querySelectorAll('#ideas-section .ideatab-pane').forEach(p => {
        p.classList.toggle('active', p.dataset.ideapane === target);
      });
    });
  });

  // ============ v0.3 新增 · 大盘"实验数据"场景选择器 → 直达形态详情抽屉 ============
  document.querySelectorAll('#expSceneEntry .pill[data-exp-scene]').forEach(p => {
    p.addEventListener('click', () => {
      const form = p.dataset.expScene;
      // 视觉反馈：高亮一下
      document.querySelectorAll('#expSceneEntry .pill').forEach(x => x.classList.remove('active'));
      p.classList.add('active');
      // 复用形态详情抽屉逻辑
      const titleEl = document.getElementById('formDrawerTitle');
      if (titleEl) titleEl.textContent = `${form} · 形态详情`;
      renderExpTable(form);
      renderRedDetail(form);
      // 确保 Tab 在"实验数据"
      document.querySelectorAll('#formDrawer .drawer-tab').forEach(x => x.classList.toggle('active', x.dataset.drawertab === 'exp'));
      document.querySelectorAll('#formDrawer .drawer-pane').forEach(pp => pp.classList.toggle('active', pp.dataset.drawerpane === 'exp'));
      showDrawer(formDrawer);
      // 点完恢复未选中态（保持轻量入口语义）
      setTimeout(() => p.classList.remove('active'), 600);
    });
  });

  // "我的实验数据看板"右上角"查看我的全部实验"按钮 → 默认展开开屏（你最常关注的形态）
  document.getElementById('goAllMyExp')?.addEventListener('click', () => {
    const titleEl = document.getElementById('formDrawerTitle');
    if (titleEl) titleEl.textContent = `我的实验 · 全部 8 个`;
    // 复用渲染：默认展示原生（数据最丰富）
    renderExpTable('原生');
    renderRedDetail('原生');
    document.querySelectorAll('#formDrawer .drawer-tab').forEach(x => x.classList.toggle('active', x.dataset.drawertab === 'exp'));
    document.querySelectorAll('#formDrawer .drawer-pane').forEach(pp => pp.classList.toggle('active', pp.dataset.drawerpane === 'exp'));
    const tt = document.getElementById('expSectionTitle');
    if (tt) tt.textContent = `我的实验 · 共 8 个（3 在跑 / 5 已全量）`;
    showDrawer(formDrawer);
  });
})();
