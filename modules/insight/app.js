// ============ 8 大开屏组件定义 ============
const components = [
  {id:1,name:'曝光时长',cls:'cc-c1',icon:'⏱',color:'#16A34A',enums:'5s / 6s',
   key:'当前 100% 模板用 5s，<b>6s 仅 0 套</b>',},
  {id:2,name:'关闭按钮展示时机',cls:'cc-c2',icon:'⏰',color:'#06B6D4',enums:'0s 出（开屏全量）',
   key:'与激励场景区别明显，可作为合规护栏'},
  {id:3,name:'关闭按钮位置',cls:'cc-c3',icon:'📍',color:'#A855F7',enums:'左上 / 左下 / 右上 / 右下',
   key:'右上 53 套（93%），左上 4 套'},
  {id:4,name:'关闭按钮大小',cls:'cc-c4',icon:'⊟',color:'#A855F7',enums:'大 / 中 / 小',
   key:'中等 50 套（88%），大尺寸 0 套'},
  {id:5,name:'点击区域',cls:'cc-c5',icon:'👆',color:'#5B5BD6',enums:'按钮尺寸 / 占屏比例',
   key:'<b>大按钮 29 套，小按钮 7 套</b>'},
  {id:6,name:'滑动区域',cls:'cc-c6',icon:'☝',color:'#5B5BD6',enums:'尺寸 + 触发方向',
   key:'竖滑 35 套，横滑 0 套'},
  {id:7,name:'互动模式',cls:'cc-c7',icon:'🎯',color:'#FF5C8D',enums:'摇 / 扭 / 滑 / 点 + 组合',
   key:'<b>摇+扭+滑组合 17 套（最多）</b>'},
  {id:8,name:'额外互动点',cls:'cc-c8',icon:'🎁',color:'#F59E0B',enums:'红包雨 / 优惠券 / 系统弹窗 / 无',
   key:'<b>无 46 套</b>，仅 11 套用了额外互动'}
];

document.getElementById('compOverview').innerHTML = components.map(c=>`
  <div class="comp-card" style="--cc-c:${c.color}">
    <div class="cc-num">组件 #${c.id}</div>
    <div class="cc-title"><div class="cc-icon">${c.icon}</div>${c.name}</div>
    <div class="cc-enums">枚举值：<b>${c.enums}</b></div>
    <div class="cc-stat">📊 ${c.key}</div>
  </div>
`).join('');

// ============ 互动模式分布 ============
const interactionDist = [
  {name:'点击 (纯点)', val:17, color:'#5B5BD6'},
  {name:'摇+扭+滑', val:17, color:'#FF5C8D'},
  {name:'滑+点', val:10, color:'#8A6CFF'},
  {name:'扭一扭', val:5, color:'#A855F7'},
  {name:'摇一摇', val:3, color:'#06B6D4'},
  {name:'滑动', val:3, color:'#16A34A'},
  {name:'摇+扭', val:2, color:'#F59E0B'}
];
const maxIx = Math.max(...interactionDist.map(d=>d.val));
document.getElementById('interactionBars').innerHTML = interactionDist.map(d=>`
  <div class="bar-row">
    <span class="br-name">${d.name}</span>
    <div class="br-track"><div class="br-fill" style="width:${d.val/maxIx*100}%;background:${d.color}"></div></div>
    <span class="br-meta"><b>${d.val}</b> 套 · ${(d.val/57*100).toFixed(0)}%</span>
  </div>
`).join('');

// ============ 按钮大小×位置 矩阵 ============
(function(){
  const svg = document.getElementById('btnMatrix');
  const W=380,H=220,padL=80,padT=30,padB=20,padR=10;
  const sizes = ['大按钮','中/默认','小按钮'];
  const positions = ['中下(默认)','左下','右下','左上'];
  // counts (estimated based on real data)
  const counts = [
    [25, 2, 2, 0],
    [19, 1, 1, 0],
    [4, 1, 1, 1]
  ];
  const cellW = (W-padL-padR)/positions.length;
  const cellH = (H-padT-padB)/sizes.length;
  let html = '';
  positions.forEach((p,i)=>{
    const x = padL + i*cellW + cellW/2;
    html += `<text x="${x}" y="${padT-6}" text-anchor="middle" font-size="10" fill="#5B5E78">${p}</text>`;
  });
  sizes.forEach((s,i)=>{
    const y = padT + i*cellH + cellH/2 + 4;
    html += `<text x="${padL-8}" y="${y}" text-anchor="end" font-size="11" fill="#1A1B2E" font-weight="600">${s}</text>`;
  });
  const max = 25;
  for(let r=0;r<sizes.length;r++){
    for(let c=0;c<positions.length;c++){
      const v = counts[r][c];
      const x = padL + c*cellW;
      const y = padT + r*cellH;
      const intensity = v/max;
      const lightness = 95 - intensity*55;
      html += `<rect x="${x+2}" y="${y+2}" width="${cellW-4}" height="${cellH-4}" rx="4" fill="hsl(248,60%,${lightness}%)" stroke="${intensity>.5?'#5B5BD6':'#ECEDF3'}"/>`;
      html += `<text x="${x+cellW/2}" y="${y+cellH/2+4}" text-anchor="middle" font-size="13" font-weight="700" fill="${intensity>.5?'#fff':v?'#1A1B2E':'#9094AD'}">${v||'·'}</text>`;
    }
  }
  svg.innerHTML = html;
})();

// ============ 简单分布 ============
function simpleDist(elId, items, total){
  document.getElementById(elId).innerHTML = items.map(i=>`
    <div class="dist-row">
      <div class="dr-l"><span class="dr-dot" style="background:${i.color}"></span>${i.name}</div>
      <div class="dr-r"><b>${i.val}</b> 套 · ${(i.val/total*100).toFixed(0)}%${i.note?` · ${i.note}`:''}</div>
    </div>
  `).join('');
}
simpleDist('durDist', [
  {name:'5 秒（默认）', val:57, color:'#16A34A', note:'当前全量'},
  {name:'6 秒', val:0, color:'#9094AD', note:'❗潜力点'},
  {name:'< 5 秒', val:0, color:'#9094AD'}
], 57);
simpleDist('extraDist', [
  {name:'无', val:46, color:'#9094AD'},
  {name:'系统弹窗诱饵', val:7, color:'#A855F7', note:'CTR 16%+'},
  {name:'红包雨/优惠券', val:3, color:'#FF5C8D', note:'CTR 19%'},
  {name:'订阅卡片', val:1, color:'#F59E0B'}
], 57);
simpleDist('orientDist', [
  {name:'竖屏 + 单向', val:40, color:'#5B5BD6'},
  {name:'横屏 + 单向', val:14, color:'#06B6D4'},
  {name:'竖屏 + 双向', val:2, color:'#FF5C8D', note:'扭两次'},
  {name:'横屏 + 双向', val:1, color:'#A855F7'}
], 57);

// ============ 组件组合 × CTR 关系矩阵 ============
(function(){
  const svg = document.getElementById('comboMatrix');
  const W=760,H=240,padL=120,padT=30,padB=20,padR=20;
  const ixModes = ['点击', '滑+点', '摇/扭', '摇+扭+滑'];
  const extras = ['无', '订阅卡片', '系统弹窗', '红包/优惠券'];
  // ctr matrix (actual or estimated)
  const ctrM = [
    [3.2, 6.5, 0, 0],
    [11.0, 0, 19.5, 18.97],
    [10.5, 8.5, 16.5, 0],
    [11.8, 0, 16.09, 0]
  ];
  // count matrix
  const cntM = [
    [12, 1, 0, 0],
    [6, 1, 2, 1],
    [10, 0, 5, 0],
    [12, 0, 4, 0]
  ];
  const cellW = (W-padL-padR)/extras.length;
  const cellH = (H-padT-padB)/ixModes.length;
  let html = `<text x="${padL/2}" y="${padT-12}" text-anchor="middle" font-size="10" fill="#9094AD">↓ 互动模式</text>`;
  html += `<text x="${(W-padR+padL)/2}" y="${padT-12}" text-anchor="middle" font-size="10" fill="#9094AD">→ 额外互动点</text>`;
  extras.forEach((p,i)=>{
    const x = padL + i*cellW + cellW/2;
    html += `<text x="${x}" y="${padT-2}" text-anchor="middle" font-size="11" font-weight="600" fill="#1A1B2E">${p}</text>`;
  });
  ixModes.forEach((s,i)=>{
    const y = padT + i*cellH + cellH/2 + 4;
    html += `<text x="${padL-8}" y="${y}" text-anchor="end" font-size="11" font-weight="600" fill="#1A1B2E">${s}</text>`;
  });
  for(let r=0;r<ixModes.length;r++){
    for(let c=0;c<extras.length;c++){
      const ctr = ctrM[r][c];
      const cnt = cntM[r][c];
      const x = padL + c*cellW;
      const y = padT + r*cellH;
      // color by CTR (warm = hot)
      let bg = '#F0F1F8', txt = '#9094AD';
      if(cnt>0){
        const t = Math.min(1, ctr/20);
        bg = `hsl(${Math.max(0,15-t*15)}, ${60+t*20}%, ${95-t*45}%)`;
        txt = t>.5 ? '#fff' : '#1A1B2E';
      }
      html += `<rect x="${x+2}" y="${y+2}" width="${cellW-4}" height="${cellH-4}" rx="4" fill="${bg}" stroke="${cnt>5?'#FF5C8D':'#ECEDF3'}" stroke-width="${cnt>5?1.5:1}"/>`;
      if(cnt>0){
        html += `<text x="${x+cellW/2}" y="${y+cellH/2-2}" text-anchor="middle" font-size="13" font-weight="800" fill="${txt}">CTR ${ctr.toFixed(1)}%</text>`;
        html += `<text x="${x+cellW/2}" y="${y+cellH/2+14}" text-anchor="middle" font-size="10" fill="${txt}" opacity=".75">${cnt} 套模板</text>`;
      } else {
        html += `<text x="${x+cellW/2}" y="${y+cellH/2+4}" text-anchor="middle" font-size="11" fill="#9094AD">空</text>`;
      }
    }
  }
  svg.innerHTML = html;
})();

// ============ Top 12 模板（按组件配置展开） ============
const topFamilies = [
  {rank:1,fam:'【系统弹窗】【摇扭用】开屏_大按钮单向白手_竖滑',ids:[1003062,1003063],cost:1027765,ctr:16.09,
   cfg:{ix:'摇+扭+滑',btn:'大按钮@中下',extra:'系统弹窗',scr:'竖',dir:'单向'},levers:[1,4,6]},
  {rank:2,fam:'【系统弹窗】开屏_大按钮单向白手_竖滑',ids:[1003230,1003231],cost:526050,ctr:20.44,
   cfg:{ix:'滑+点',btn:'大按钮@中下',extra:'系统弹窗',scr:'竖',dir:'单向'},levers:[1,4,6]},
  {rank:3,fam:'[CouponX][系统弹窗][大按钮]开屏_红包滑动',ids:[1003665,1003666],cost:224981,ctr:18.97,
   cfg:{ix:'滑+点',btn:'大按钮@中下',extra:'红包/系统弹窗',scr:'竖',dir:'单向'},levers:[1,4,6]},
  {rank:4,fam:'【摇扭用】开屏_新大按钮小_白手竖滑_图文-左下',ids:[1003250],cost:176075,ctr:18.23,
   cfg:{ix:'摇+扭+滑',btn:'大按钮@左下',extra:'无',scr:'竖',dir:'单向'},levers:[1,4]},
  {rank:5,fam:'【双向】原生化_开屏_摇一摇_0563',ids:[1002606,1002607],cost:162738,ctr:10.52,
   cfg:{ix:'摇',btn:'中按钮@中下',extra:'无',scr:'竖',dir:'双向'},levers:[4]},
  {rank:6,fam:'【摇扭用】开屏_大按钮单向白手_竖滑',ids:[1002604,1002605],cost:139275,ctr:9.50,
   cfg:{ix:'摇+扭+滑',btn:'大按钮@中下',extra:'无',scr:'竖',dir:'单向'},levers:[1,4]},
  {rank:7,fam:'[哈啰]【系统弹窗】【摇扭用】开屏_大按钮单向白手',ids:[1003781,1003782],cost:107761,ctr:28.06,
   cfg:{ix:'摇+扭',btn:'大按钮@中下',extra:'系统弹窗',scr:'竖',dir:'单向'},levers:[1,4,6]},
  {rank:8,fam:'开屏_大按钮单向白手_竖滑',ids:[1001357,1001358],cost:94023,ctr:11.25,
   cfg:{ix:'滑+点',btn:'大按钮@中下',extra:'无',scr:'竖',dir:'单向'},levers:[1,4]},
  {rank:9,fam:'原生化_开屏_摇一摇_0563',ids:[1000033,1000034],cost:91345,ctr:12.14,
   cfg:{ix:'摇',btn:'中按钮@中下',extra:'无',scr:'竖',dir:'单向'},levers:[4]},
  {rank:10,fam:'【摇扭用】【ADX横素材】开屏-大按钮-新滑',ids:[1002944,1002947],cost:74838,ctr:7.14,
   cfg:{ix:'摇+扭+滑',btn:'大按钮@中下',extra:'无',scr:'横',dir:'单向'},levers:[1,4]},
  {rank:11,fam:'【摇扭用】开屏_新大按钮小_白手竖滑_图文-右下',ids:[1003248],cost:74126,ctr:17.68,
   cfg:{ix:'摇+扭+滑',btn:'大按钮@右下',extra:'无',scr:'竖',dir:'单向'},levers:[1,4]},
  {rank:12,fam:'【摇扭用】开屏_大按钮单向白手_新滑',ids:[1002945,1002946],cost:64924,ctr:9.93,
   cfg:{ix:'摇+扭+滑',btn:'大按钮@中下',extra:'无',scr:'竖',dir:'单向'},levers:[1,4]}
];

function fmtCost(c){
  if(c>=10000) return '¥'+(c/10000).toFixed(1)+'万';
  return '¥'+c.toFixed(0);
}

const tbody = document.querySelector('#topTbl tbody');
topFamilies.forEach(t=>{
  const rc = t.rank===1?'r1':t.rank===2?'r2':t.rank===3?'r3':'rn';
  const ids = t.ids;
  let idHtml = ids.length===2
    ? `<span class="id-tag img" title="图文">${ids[0]}</span><span class="id-tag video" title="视频">${ids[1]}</span>`
    : `<span class="id-tag">${ids[0]}</span>`;
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><span class="rank ${rc}">${t.rank}</span></td>
    <td><div class="fam-info"><div class="fam-name" style="font-size:12px">${t.fam}</div><div class="fam-meta">${idHtml}</div></div></td>
    <td><span class="cfg-tag ix">${t.cfg.ix}</span></td>
    <td><span class="cfg-tag btn">${t.cfg.btn}</span></td>
    <td><span class="cfg-tag extra">${t.cfg.extra}</span></td>
    <td><span class="cfg-tag scr">${t.cfg.scr}</span></td>
    <td><span class="cfg-tag dir">${t.cfg.dir}</span></td>
    <td class="num-cell"><b>${fmtCost(t.cost)}</b></td>
    <td class="num-cell"><b>${t.ctr.toFixed(2)}%</b></td>
    <td><button class="row-btn primary" onclick="loadTemplate('${ids[0]}',true)">深钻 →</button></td>
  `;
  tbody.appendChild(tr);
});

// ============ 6 大提效手段（已改名①） ============
const levers = [
  {id:1,name:'增加可触发方式',cls:'lv1',count:36,pct:88.7,ctr:16.35,
   desc:'大按钮 / 双按钮 / 增加滑动 / 多手势叠加',
   linkComps:['#5 点击区域','#6 滑动区域','#7 互动模式']},
  {id:2,name:'延长曝光时间',cls:'lv2',count:0,pct:0,ctr:0,
   desc:'5s → 6s / 关闭后小窗挂件',
   linkComps:['#1 曝光时长','#2 关闭按钮时机']},
  {id:3,name:'外显增量信息',cls:'lv3',count:2,pct:0.1,ctr:3.4,
   desc:'标签 / 评分 / 弹幕 / 价格爆点',
   linkComps:['主视觉图','主标题','副标题']},
  {id:4,name:'创造新交互点',cls:'lv4',count:40,pct:98.3,ctr:15.88,
   desc:'摇 / 扭 / 滑 / 互动卡片 / 答题',
   linkComps:['#7 互动模式','#8 额外互动点']},
  {id:5,name:'缩短转化链路',cls:'lv5',count:0,pct:0,ctr:0,
   desc:'落地页前置 / 当前页浏览',
   linkComps:['落地页拉起方式','是否外显下载']},
  {id:6,name:'提升互动意愿',cls:'lv6',count:9,pct:33.0,ctr:17.2,
   desc:'点击激励 / 按钮引导 / 情感表达 / 系统弹窗诱饵',
   linkComps:['#8 额外互动点','CTA 文案','视觉运营化']}
];
const leverNameMap = {1:'触发方式',2:'延长曝光',3:'外显增量',4:'创造交互',5:'缩短链路',6:'提升意愿'};

document.getElementById('leverSection').innerHTML = levers.map(l=>`
  <div class="lever ${l.cls}">
    <div class="lever-h"><div class="lever-num">${l.id}</div><div class="lever-name">${l.name}</div></div>
    <div class="lever-stat">
      <div class="lk">在投套数</div>
      <div class="lv-val">${l.count}<span style="font-size:11px;color:var(--text-3);margin-left:4px">套</span></div>
    </div>
    <div class="lever-foot">
      <span>消耗 <b>${l.pct.toFixed(1)}%</b></span>
      <span>CTR <b>${l.ctr>0?l.ctr.toFixed(1)+'%':'—'}</b></span>
    </div>
    <div style="font-size:10px;color:var(--text-3);margin-top:4px;line-height:1.4">${l.desc}</div>
  </div>
`).join('');

// 提效手段 ↔ 组件 映射
document.getElementById('leverCompMap').innerHTML = `<div class="lever-comp-map">${levers.map(l=>`
  <div class="lcm lv${l.id}">
    <div class="lcm-title">${l.id}. ${l.name}</div>
    <div class="lcm-comps">${l.linkComps.map(c=>`<div class="lcm-comp">📦 ${c}</div>`).join('')}</div>
  </div>
`).join('')}</div>`;

// ============ 趋势图 ============
const trendData = {cost:[420,438,452,461,468,475,489],ctr:[12.91,13.18,13.34,13.52,13.68,13.78,13.83]};
const trendLabels = ['05/21','05/22','05/23','05/24','05/25','05/26','05/27'];
function drawTrend(metric){
  const data = trendData[metric];
  const svg = document.getElementById('trendSvg');
  const W=600,H=180,P=32;
  const min = Math.min(...data)*.95, max = Math.max(...data)*1.05;
  const xs = data.map((_,i)=>P + i*((W-2*P)/(data.length-1)));
  const ys = data.map(v=>H-P - (v-min)/(max-min)*(H-2*P));
  const pts = xs.map((x,i)=>`${x},${ys[i]}`).join(' ');
  const areaPts = `${P},${H-P} ${pts} ${W-P},${H-P}`;
  let html = `<defs><linearGradient id="g1" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#5B5BD6"/><stop offset="1" stop-color="#5B5BD6" stop-opacity="0"/></linearGradient></defs>`;
  for(let i=0;i<=4;i++){const y = P + i*(H-2*P)/4; html+=`<line x1="${P}" x2="${W-P}" y1="${y}" y2="${y}" stroke="#ECEDF3" stroke-dasharray="2 3"/>`}
  html += `<polygon points="${areaPts}" fill="url(#g1)" opacity=".25"/><polyline points="${pts}" fill="none" stroke="#5B5BD6" stroke-width="2"/>`;
  xs.forEach((x,i)=>{
    html += `<circle cx="${x}" cy="${ys[i]}" r="3.5" fill="#fff" stroke="#5B5BD6" stroke-width="2"/>`;
    html += `<text x="${x}" y="${H-8}" text-anchor="middle" fill="#9094AD" font-size="10">${trendLabels[i]}</text>`;
    const lbl = metric==='cost'?`¥${data[i]}万`:`${data[i].toFixed(2)}%`;
    html += `<text x="${x}" y="${ys[i]-10}" text-anchor="middle" fill="#5B5BD6" font-size="10" font-weight="600">${lbl}</text>`;
  });
  svg.innerHTML = html;
}
drawTrend('cost');
document.querySelectorAll('.trend-controls button[data-trend]').forEach(b=>{
  b.addEventListener('click',()=>{
    document.querySelectorAll('.trend-controls button[data-trend]').forEach(x=>x.classList.remove('on'));
    b.classList.add('on'); drawTrend(b.dataset.trend);
  });
});

// ============ 互动模式甜甜圈 ============
(function(){
  const svg = document.getElementById('donutSvg');
  let html = '', cum = 0;
  const total = interactionDist.reduce((a,b)=>a+b.val,0);
  interactionDist.forEach(seg=>{
    const dash = seg.val/total*100;
    html += `<circle cx="21" cy="21" r="15.915" fill="transparent" stroke="${seg.color}" stroke-width="6" stroke-dasharray="${dash} ${100-dash}" stroke-dashoffset="${-cum}" transform="rotate(-90 21 21)"/>`;
    cum -= dash;
  });
  html += `<text x="21" y="20" text-anchor="middle" font-size="5.5" font-weight="700" fill="#1A1B2E">${total}</text>`;
  html += `<text x="21" y="26" text-anchor="middle" font-size="2.5" fill="#9094AD">套模板</text>`;
  svg.innerHTML = html;
  document.getElementById('donutLegend').innerHTML = interactionDist.map(s=>`
    <div class="lg-row"><div class="lg-name"><span class="lg-color" style="background:${s.color}"></span>${s.name}</div><div class="lg-meta">${s.val} 套 · ${(s.val/total*100).toFixed(0)}%</div></div>
  `).join('');
})();

// ============ 模板深钻数据库 ============
const idToFamily = {};
topFamilies.forEach(f=>f.ids.forEach(id=>idToFamily[id]=f));

const templateDetails = {
  '1003062': {
    famKey:'1003062',
    name:'【系统弹窗】【摇扭用】开屏_大按钮单向白手_竖滑',
    ids:[{id:1003062,kind:'图文',cost:545820,ctr:15.21},{id:1003063,kind:'视频',cost:481945,ctr:17.10}],
    levers:[1,4,6],
    cfg:{'曝光时长':'5 秒','关闭按钮':'右上小尺寸','点击区域':'大按钮 680×120','滑动区域':'底部 1/3 全宽','互动模式':'摇+扭+滑','额外互动点':'系统弹窗诱饵','屏幕方向':'竖屏','单/双向':'单向'},
    kpis:{cost:'¥103万',ctr:'16.09%',share:'31.8%',ranking:'#1'},
    components:{
      cta:{name:'CTA 大按钮',icon:'▶',lever:1,ctr:1.85,attrs:[['尺寸','680×120 (大按钮)'],['位置','底部安全区上方'],['文案','点击查看 / 立即领取'],['背景','橙红渐变'],['可点击区占比','38%'],['显著性','p<0.01 ✓']]},
      swipe:{name:'白手竖滑引导',icon:'☝',lever:1,ctr:0.92,attrs:[['位置','底部安全区'],['动效','上滑循环'],['文案','上滑了解'],['手势识别','单向'],['可滑动区','全屏底 1/3'],['触发率','22%']]},
      gesture:{name:'摇/扭交互层',icon:'🎯',lever:4,ctr:1.34,attrs:[['类型','摇一摇 + 扭一扭'],['触发阈值','0.5g'],['提示文案','摇一摇打开'],['命中率','12%'],['误触保护','已开启'],['合规','✓']]},
      systemPopup:{name:'系统弹窗(诱饵)',icon:'⚠️',lever:6,ctr:1.78,attrs:[['类型','原生系统样式'],['触发时机','曝光后 1.5s'],['文案','您有一份新人福利待领取'],['按钮','立即领取 / 取消'],['CTR 提升','+15pp'],['留存','短期高，需关注次留']]},
      title:{name:'主标题',icon:'A',lever:3,ctr:0.45,attrs:[['文案','夏日柠檬季 / 第二件 0 元'],['字号','22pt · Black'],['行数','2'],['含具体数字','部分'],['对比度','高'],['阴影','是']]},
      brand:{name:'品牌区',icon:'🅻',lever:0,ctr:0.08,attrs:[['品牌名','LemonGo'],['Logo 尺寸','22×22'],['位置','左上'],['不透明度','92%'],['副文案','无'],['可点击','否']]},
      skip:{name:'跳过/倒计时',icon:'⏭',lever:2,ctr:-0.18,attrs:[['倒计时','5 秒'],['位置','右上'],['样式','胶囊半透明'],['关闭率','7.2%'],['每日主动关闭','7900万 (SDK)'],['潜力','可改 6s 捡回 8% 曝光']]}
    },
    order:['cta','swipe','gesture','systemPopup','title','brand','skip'],
    suggestions:[
      {prio:'high',tag:'P0 · 高优',lever:2,leverName:'延长曝光时间',conf:91,
       title:'组件 #1 曝光时长 5s → 6s，预估每日多保留 +630 万次曝光',
       detail:'SDK 数据显示开屏主动关闭事件 1010027 一日 7900 万次，这套模板每日承担约 12% 即 950 万。延长 1s 平均能多留住约 8%（来自 Top 5 模板对照实验）。',
       impacts:['预估曝光：<b>+630 万/日</b>','预估消耗：<b>+¥7.6 万/日</b>','合规：<b style="color:var(--good)">已支持</b>']},
      {prio:'high',tag:'P0 · 高优',lever:3,leverName:'外显增量信息',conf:88,
       title:'主标题套用「具体数字」赢家配方：夏日柠檬季 → 立省 ¥38',
       detail:'共性 #4 验证：含具体数字的标题在生鲜电商 CTR 比纯品牌叙事高 +18%。本套当前主标题贡献仅 +0.45pp，远低于 CTA 的 +1.85pp，是性价比最高的优化点。',
       impacts:['预估 CTR：<b>+0.85pp</b>','受影响人群：<b>女性 25-34 主力</b>','置信度：<b>高</b>']},
      {prio:'mid',tag:'P1 · 中优',lever:4,leverName:'创造新交互点',conf:74,
       title:'组件 #7 互动模式：白手提示语补充「或扭一扭」激活第二通道',
       detail:'当前手势触发率 12%，加上"扭一扭"双通道引导，可参考 1002606 双向扭模板，CTR 还有 +0.5pp 空间。',
       impacts:['预估 CTR：<b>+0.5pp</b>','误触风险：<b style="color:var(--warn)">需复核</b>']},
      {prio:'low',tag:'P2 · 低优',lever:6,leverName:'提升互动意愿',conf:62,
       title:'系统弹窗文案改成"您的¥38 福利已就位"',
       detail:'共性 #3：带具体金额的弹窗诱饵 CTR 比通用文案高 +6pp。',
       impacts:['预估 CTR：<b>+0.3pp</b>','需求：<b>仅文案修改</b>']}
    ]
  },
  '1003665':{
    famKey:'1003665',
    name:'[CouponX][系统弹窗][大按钮]开屏_红包滑动',
    ids:[{id:1003665,kind:'图文',cost:135210,ctr:18.20},{id:1003666,kind:'视频',cost:89771,ctr:20.13}],
    levers:[1,4,6],
    cfg:{'曝光时长':'5 秒','关闭按钮':'右上小尺寸','点击区域':'大按钮 720×128','滑动区域':'红包专属手势区','互动模式':'滑+点+摇','额外互动点':'红包雨 + 系统弹窗','屏幕方向':'竖屏','单/双向':'单向'},
    kpis:{cost:'¥22.5万',ctr:'18.97%',share:'7.0%',ranking:'#3'},
    components:{
      cta:{name:'CTA 红包按钮',icon:'🧧',lever:1,ctr:2.05,attrs:[['尺寸','720×128'],['文案','立即拆开'],['背景','金红渐变 + 微动效'],['可点击区占比','42%'],['CouponX 集成','✓'],['显著性','p<0.01 ✓']]},
      swipe:{name:'红包滑动手势',icon:'🎈',lever:1,ctr:1.45,attrs:[['类型','滑动开红包'],['手势','上滑/横滑'],['命中率','35%'],['提示','循环动画'],['完成态','金币飞入'],['失败兜底','弹窗保留']]},
      systemPopup:{name:'系统弹窗',icon:'⚠️',lever:6,ctr:1.92,attrs:[['文案','您的红包即将过期'],['按钮','立即领取'],['CTR 提升','+18pp'],['触发时机','0.8s'],['合规','✓'],['用户感知','较重']]},
      title:{name:'主标题',icon:'A',lever:3,ctr:0.62,attrs:[['文案','¥38 红包待领取'],['含数字','✓'],['字号','24pt'],['色值','金黄'],['位置','视觉中心'],['阴影','金属质感']]},
      gesture:{name:'摇一摇',icon:'📱',lever:4,ctr:0.88,attrs:[['类型','摇一摇'],['阈值','0.6g'],['触发率','9%'],['和滑动叠加','✓'],['冲突','低'],['合规','✓']]},
      brand:{name:'品牌区',icon:'🅻',lever:0,ctr:0.10,attrs:[['位置','左上'],['尺寸','22×22'],['不透明度','85%'],['可点击','否'],['副文案','无'],['品牌','商家自定义']]},
      skip:{name:'跳过',icon:'⏭',lever:2,ctr:-0.05,attrs:[['倒计时','5 秒'],['位置','右上'],['样式','极简白圈'],['关闭率','5.4%'],['每日关闭','约 320 万'],['潜力','改 6s']]}
    },
    order:['cta','systemPopup','swipe','gesture','title','brand','skip'],
    suggestions:[
      {prio:'high',tag:'P0 · 高优',lever:2,leverName:'延长曝光时间',conf:90,
       title:'增加「关闭后小窗挂件」承接漏出曝光',
       detail:'本套当前 5.4% 用户主动关闭，每日漏掉约 32 万次潜在转化。增加小窗挂件后用户可在主 App 内继续看到红包入口，预估 CVR 链路再延 +22%。',
       impacts:['预估 CVR：<b>+22%</b>','需 SDK 升级：<b style="color:var(--warn)">已支持但未启用</b>']},
      {prio:'mid',tag:'P1 · 中优',lever:5,leverName:'缩短转化链路',conf:72,
       title:'落地页前置：点击红包直接展开优惠券，无需跳转',
       detail:'当前所有 Top 模板都是"点击 → 跳转落地页"，但落地页打开率仅 70%。改成在当前页直接展示优惠券面额 + 一键复制，可少掉 30% 流失。',
       impacts:['预估 CVR：<b>+30%</b>','需开发：<b style="color:var(--warn)">PT12/19 适用</b>']},
      {prio:'low',tag:'P2 · 低优',lever:3,leverName:'外显增量信息',conf:65,
       title:'红包外显「已领 23,481 人」社会认同',
       detail:'共性数据：含"已领/已抢"实时数字的模板 CTR 比静态高 +9%。',
       impacts:['预估 CTR：<b>+0.4pp</b>','开发量：<b>低</b>']}
    ]
  },
  '1000033':{
    famKey:'1000033',
    name:'原生化_开屏_摇一摇_0563',
    ids:[{id:1000033,kind:'图文',cost:54989,ctr:11.40},{id:1000034,kind:'视频',cost:36356,ctr:13.27}],
    levers:[4],
    cfg:{'曝光时长':'5 秒','关闭按钮':'右上小尺寸','点击区域':'中按钮 280×80','滑动区域':'未启用','互动模式':'摇一摇','额外互动点':'无','屏幕方向':'竖屏','单/双向':'单向'},
    kpis:{cost:'¥9.1万',ctr:'12.14%',share:'2.8%',ranking:'#9'},
    components:{
      gesture:{name:'摇一摇',icon:'📱',lever:4,ctr:1.65,attrs:[['类型','摇一摇 0563'],['阈值','0.5g'],['触发率','15%'],['提示','摇动手机打开广告'],['原生化','✓'],['合规','已通过']]},
      cta:{name:'纯点击 CTA',icon:'▶',lever:1,ctr:0.42,attrs:[['尺寸','280×80 (中按钮)'],['文案','了解详情'],['可点击区占比','15%'],['对比度','一般'],['动效','无'],['可优化','建议改大按钮']]},
      title:{name:'主标题',icon:'A',lever:3,ctr:0.28,attrs:[['文案','内容自定义'],['字号','20pt'],['行数','1-2'],['含数字','看素材'],['对比度','一般'],['阴影','无']]},
      brand:{name:'品牌区',icon:'🅻',lever:0,ctr:0.05,attrs:[['位置','顶部'],['可定制','✓'],['尺寸','24×24'],['副文案','可选'],['不透明度','100%'],['可点击','否']]},
      skip:{name:'跳过',icon:'⏭',lever:2,ctr:-0.10,attrs:[['倒计时','5 秒'],['位置','右上'],['样式','圆角'],['关闭率','8.1%'],['每日关闭','约 240 万'],['潜力','可改 6s']]}
    },
    order:['gesture','cta','title','brand','skip'],
    suggestions:[
      {prio:'high',tag:'P0 · 高优',lever:1,leverName:'增加可触发方式',conf:93,
       title:'升级组件 #5 到「大按钮」+ 增加 #6「白手竖滑」组合',
       detail:'本套仅用了"创造新交互点"一个手段，加权 CTR 12.14%，远低于同时用 3 个手段的 Top 1（16.09%）。套用赢家配方后预期 CTR 可达 15.5%+。',
       impacts:['预估 CTR：<b>+3.4pp</b>','预估消耗：<b>+¥2.5万/日</b>','改造量：<b>中</b>']},
      {prio:'mid',tag:'P1 · 中优',lever:6,leverName:'提升互动意愿',conf:75,
       title:'增加组件 #8「系统弹窗」前置触发',
       detail:'共性 #3：带"系统弹窗"前缀的模板加权 CTR 普遍超 16%；本套未使用此组件，是明显的提升空间。',
       impacts:['预估 CTR：<b>+2pp</b>','合规风险：<b style="color:var(--warn)">需评估</b>']},
      {prio:'low',tag:'P2 · 低优',lever:2,leverName:'延长曝光时间',conf:60,
       title:'组件 #1 倒计时延长至 6s',
       detail:'本套关闭率 8.1% 偏高，延长 1s 可减少损失。',
       impacts:['预估曝光：<b>+15万/日</b>']}
    ]
  }
};
templateDetails['1003063'] = templateDetails['1003062'];
templateDetails['1003666'] = templateDetails['1003665'];
templateDetails['1000034'] = templateDetails['1000033'];

let currentId = '1003062';
let currentMetric = 'ctr';
let currentComp = 'cta';

function loadTemplate(id, jump){
  id = String(id || '').trim();
  if(!templateDetails[id]){
    showToast(`未找到 ${id}，已回退到示例 1003062`);
    id = '1003062';
  }
  document.getElementById('tidInput').value = id;
  currentId = id;
  currentComp = templateDetails[id].order[0];
  renderAnalysis();
  if(jump){
    document.getElementById('lookup').scrollIntoView({behavior:'smooth',block:'start'});
  }
}

function renderAnalysis(){
  const tpl = templateDetails[currentId];
  const host = document.getElementById('analysisHost');
  const lvColors = {0:'#9094AD',1:'#5B5BD6',2:'#16A34A',3:'#F59E0B',4:'#FF5C8D',5:'#06B6D4',6:'#A855F7'};
  const lvNames = {0:'基础组件',1:'触发方式',2:'延长曝光',3:'外显增量',4:'创造交互',5:'缩短链路',6:'提升意愿'};

  const idsBanner = `
    <div class="id-pair-banner">
      📌 同套模板 ${tpl.ids.length} 个 ID：
      ${tpl.ids.map(s=>`<b>${s.id}</b> (${s.kind} · ${fmtCost(s.cost)} · ${s.ctr}%)`).join('，')}
    </div>
  `;
  const cfgRows = Object.entries(tpl.cfg).map(([k,v])=>`<div class="dist-row" style="padding:5px 0"><div class="dr-l">${k}</div><div class="dr-r"><b>${v}</b></div></div>`).join('');

  host.innerHTML = `
    <div class="panel col">
      <div class="panel-h"><h3><span class="dot"></span> 模板预览 + 组件配置</h3><span class="desc">点组件查归因</span></div>
      <div class="panel-body" style="text-align:center">
        ${idsBanner}
        <div class="kind-toggle">
          ${tpl.ids.map((s,i)=>`<button class="${i===0?'on':''}" onclick="toggleKind(this)">${s.kind}</button>`).join('')}
        </div>
        <div class="phone">
          <div class="phone-notch"></div>
          <div class="phone-screen">
            <div class="splash">
              <div class="skip">跳过 5s</div>
              <div class="brand-mark"><div class="lm">L</div><div>LemonGo</div></div>
              <div class="hero-img">🍋</div>
              <div class="title">夏日柠檬季<br/>第二件 0 元</div>
              <div class="subtitle">下载 App 立享 88 折</div>
              <div class="big-cta">立即领取</div>
              <div class="swipe-hint"><div class="hand">☝️</div>上滑了解</div>
              <div class="ad-tag">广告 · 优量汇</div>
            </div>
            <div class="overlay">
              <div class="hot" data-cid="cta" style="bottom:74px;left:14px;right:14px;height:50px"><span class="hot-tag">CTA 大按钮</span></div>
              <div class="hot" data-cid="swipe" style="bottom:30px;left:50%;transform:translateX(-50%);width:120px;height:36px"><span class="hot-tag">白手竖滑</span></div>
              <div class="hot" data-cid="gesture" style="top:120px;left:50%;transform:translateX(-50%);width:140px;height:140px;border-radius:14px"><span class="hot-tag">摇/扭交互</span></div>
              <div class="hot" data-cid="systemPopup" style="top:150px;left:50%;transform:translateX(-50%);width:160px;height:60px"><span class="hot-tag">系统弹窗(诱饵)</span></div>
              <div class="hot" data-cid="title" style="top:276px;left:14px;right:14px;height:42px"><span class="hot-tag">主标题</span></div>
              <div class="hot" data-cid="brand" style="top:46px;left:12px;width:108px;height:24px"><span class="hot-tag">品牌区</span></div>
              <div class="hot" data-cid="skip" style="top:11px;right:8px;width:50px;height:20px"><span class="hot-tag">跳过/倒计时</span></div>
            </div>
          </div>
        </div>
        <div style="margin-top:12px;text-align:left;background:var(--panel-2);border:1px solid var(--line);border-radius:10px;padding:10px 12px">
          <div style="font-size:11px;color:var(--text-3);margin-bottom:6px;font-weight:600">📦 8 大组件配置</div>
          ${cfgRows}
        </div>
      </div>
    </div>

    <div class="panel col">
      <div class="panel-h"><h3><span class="dot" style="background:var(--accent)"></span> 组件解构 · 效果归因</h3><span class="desc">Shapley 值法</span></div>
      <div class="panel-body">
        <div class="summary-row">
          <div class="stat"><div class="k">总消耗</div><div class="v">${tpl.kpis.cost}</div></div>
          <div class="stat"><div class="k">加权 CTR</div><div class="v">${tpl.kpis.ctr}</div></div>
          <div class="stat"><div class="k">大盘排名</div><div class="v">${tpl.kpis.ranking}</div></div>
        </div>
        <div class="detail" id="detailCard"></div>
        <div class="section-title">所有组件 · 按贡献度排序（颜色=提效手段）</div>
        <div class="comp-list" id="compList"></div>
      </div>
    </div>

    <div class="panel col">
      <div class="panel-h"><h3><span class="dot" style="background:var(--good)"></span> AI 迭代建议</h3><span class="desc">${tpl.suggestions.length} 条</span></div>
      <div class="panel-body">
        <div class="metric-tabs" id="metricTabs">
          <button class="on" data-m="ctr">CTR 归因</button>
          <button data-m="cvr">CVR 归因</button>
        </div>
        <div class="wf" id="wf"></div>
        <div class="insight-card">
          <div class="ih">💡 一句话洞察</div>
          <div class="ic" id="oneLine"></div>
        </div>
        <div class="section-title">AI 建议（按提效手段标注）</div>
        <div class="ai-sugg">
          ${tpl.suggestions.map((s,i)=>`
            <div class="sugg ${s.prio}">
              <div class="sugg-h">
                <span style="display:flex;gap:5px;align-items:center;flex-wrap:wrap">
                  <span class="sugg-tag">${s.tag}</span>
                  <span class="sugg-lever" style="background:${lvColors[s.lever]}">${s.leverName}</span>
                </span>
                <span style="font-size:10px;color:var(--text-3)">置信度 ${s.conf}%</span>
              </div>
              <div class="sugg-title">${s.title}</div>
              <div class="sugg-detail">${s.detail}</div>
              <div class="sugg-impact">${s.impacts.map(x=>`<span>${x}</span>`).join('')}</div>
              <div class="sugg-actions">
                ${i===0?`<button class="primary" onclick="goGenerate()">一键生成新模板套</button><button onclick="showToast('已展开归因证据链')">看为什么</button>`:`<button class="primary" onclick="showToast('已加入采纳队列')">采纳</button>`}
                <button>忽略</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  document.querySelectorAll('.hot').forEach(h=>h.addEventListener('click',()=>selectComp(h.dataset.cid)));
  document.querySelectorAll('#metricTabs button').forEach(b=>{
    b.addEventListener('click',()=>{
      document.querySelectorAll('#metricTabs button').forEach(x=>x.classList.remove('on'));
      b.classList.add('on');
      currentMetric = b.dataset.m;
      renderCompList(); renderWaterfall(); selectComp(currentComp); updateInsight();
    });
  });

  renderCompList(); renderWaterfall(); selectComp(currentComp); updateInsight();
}

function toggleKind(btn){
  document.querySelectorAll('.kind-toggle button').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');
  showToast(`已切换到「${btn.textContent}」素材展示`);
}

function renderCompList(){
  const tpl = templateDetails[currentId];
  const list = document.getElementById('compList');
  if(!list) return;
  const lvColors = {0:'#9094AD',1:'#5B5BD6',2:'#16A34A',3:'#F59E0B',4:'#FF5C8D',5:'#06B6D4',6:'#A855F7'};
  const sorted = tpl.order.slice().sort((a,b)=>Math.abs(tpl.components[b].ctr)-Math.abs(tpl.components[a].ctr));
  const max = Math.max(...sorted.map(c=>Math.abs(tpl.components[c].ctr)));
  list.innerHTML = '';
  sorted.forEach(cid=>{
    const c = tpl.components[cid];
    const v = c.ctr;
    const pct = Math.abs(v)/max*100;
    const isPos = v>0;
    const color = lvColors[c.lever] || '#5B5BD6';
    const el = document.createElement('div');
    el.className = 'comp'+(cid===currentComp?' sel':'');
    el.dataset.cid = cid;
    el.innerHTML = `
      <div class="comp-top">
        <div class="comp-name"><div class="comp-icon" style="background:${color}22;color:${color}">${c.icon}</div>${c.name}</div>
        <div class="${isPos?'pos':'neg'}">${isPos?'+':''}${v.toFixed(2)}pp</div>
      </div>
      <div class="contrib-bar"><div class="contrib-fill" style="width:${pct}%;background:${isPos?color:'linear-gradient(90deg,#E11D48,#F87171)'}"></div></div>
      <div class="comp-meta"><span style="color:${color};font-weight:600">${c.lever?'手段 '+c.lever:'基础组件'}</span><span>占比 ${pct.toFixed(0)}%</span></div>
    `;
    el.addEventListener('click',()=>selectComp(cid));
    list.appendChild(el);
  });
}

function renderWaterfall(){
  const tpl = templateDetails[currentId];
  const wf = document.getElementById('wf');
  if(!wf) return;
  wf.innerHTML = '';
  const baseline = 1.5;
  const final = parseFloat(tpl.kpis.ctr);
  const cols = [{type:'base',label:'基线',val:baseline}];
  tpl.order.forEach(cid=>{
    const v = tpl.components[cid].ctr;
    cols.push({type:v>=0?'pos':'neg',label:tpl.components[cid].name,val:v,cid});
  });
  cols.push({type:'final',label:'实际值',val:final});
  const max = final*1.3;
  cols.forEach(col=>{
    const div = document.createElement('div');
    div.className = 'bar-col';
    const h = (col.type==='base'||col.type==='final')?Math.max(8,col.val/max*120):Math.max(8,Math.abs(col.val)/max*120);
    const dispVal = (col.type==='base'||col.type==='final')?`${col.val.toFixed(2)}%`:`${col.val>=0?'+':''}${col.val.toFixed(2)}pp`;
    div.innerHTML = `
      <div class="bar ${col.type}" style="height:${h}px">
        <div class="bar-val" style="color:${col.type==='neg'?'var(--bad)':col.type==='pos'?'var(--good)':'var(--text)'}">${dispVal}</div>
      </div>
      <div class="bar-label">${col.label}</div>
    `;
    if(col.cid){ div.style.cursor='pointer'; div.addEventListener('click',()=>selectComp(col.cid)); }
    wf.appendChild(div);
  });
}

function selectComp(cid){
  const tpl = templateDetails[currentId];
  if(!tpl.components[cid]) return;
  currentComp = cid;
  const c = tpl.components[cid];
  const v = c.ctr;
  const lvColors = {0:'#9094AD',1:'#5B5BD6',2:'#16A34A',3:'#F59E0B',4:'#FF5C8D',5:'#06B6D4',6:'#A855F7'};
  const lvNames = {0:'基础组件',1:'触发方式',2:'延长曝光',3:'外显增量',4:'创造交互',5:'缩短链路',6:'提升意愿'};
  const detailCard = document.getElementById('detailCard');
  if(detailCard){
    detailCard.innerHTML = `
      <div class="detail-h">
        <div>
          <div class="detail-name">${c.name}</div>
          <div style="font-size:11px;margin-top:3px"><span class="lv-tag lv${c.lever}" style="background:${lvColors[c.lever]}">${lvNames[c.lever]}</span></div>
        </div>
        <div style="text-align:right">
          <div style="font-size:10px;color:var(--text-3)">CTR 贡献度</div>
          <div style="font-size:18px;font-weight:800;color:${v>=0?'var(--good)':'var(--bad)'}">${v>=0?'+':''}${v.toFixed(2)}pp</div>
        </div>
      </div>
      <div class="detail-attrs">
        ${c.attrs.map(([k,vv])=>`<div class="attr"><div class="attr-k">${k}</div><div class="attr-v">${vv}</div></div>`).join('')}
      </div>
    `;
  }
  document.querySelectorAll('.hot').forEach(h=>h.classList.toggle('sel',h.dataset.cid===cid));
  document.querySelectorAll('.comp').forEach(h=>h.classList.toggle('sel',h.dataset.cid===cid));
}

function updateInsight(){
  const tpl = templateDetails[currentId];
  const ol = document.getElementById('oneLine');
  if(!ol) return;
  const sorted = tpl.order.slice().sort((a,b)=>tpl.components[b].ctr-tpl.components[a].ctr);
  const top = tpl.components[sorted[0]];
  const lvNames = {0:'基础',1:'触发方式',2:'延长曝光',3:'外显增量',4:'创造交互',5:'缩短链路',6:'提升意愿'};
  const usedLevers = [...new Set(tpl.order.map(o=>tpl.components[o].lever).filter(x=>x>0))];
  const missingLevers = [1,2,3,4,5,6].filter(x=>!usedLevers.includes(x));
  ol.innerHTML = `
    <span class="iv">${top.name}</span> 是当前模板 CTR 的核心驱动（贡献 <span class="iv">+${top.ctr.toFixed(2)}pp</span>），
    属于「<span class="iv">${lvNames[top.lever]}</span>」手段；
    本套已使用 <span class="iv">${usedLevers.length}/6</span> 个提效手段，
    ${missingLevers.length>0?`未使用「<span class="iv">${missingLevers.map(x=>lvNames[x]).join('、')}</span>」是潜在增量空间。`:'已组合较为充分。'}
  `;
}

function goGenerate(){
  document.getElementById('generate').scrollIntoView({behavior:'smooth',block:'start'});
  showToast('已跳转到一键生成区');
}

function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = '✓ '+msg;
  t.classList.add('show');
  clearTimeout(window._tt);
  window._tt = setTimeout(()=>t.classList.remove('show'),2400);
}

// ===== Page nav scroll =====
document.querySelectorAll('#pageNav a').forEach(a=>{
  a.addEventListener('click',()=>{
    document.getElementById(a.dataset.anchor).scrollIntoView({behavior:'smooth',block:'start'});
  });
});
window.addEventListener('scroll',()=>{
  const ids = ['overview','components','topRank','patterns','levers','lookup','generate'];
  let cur = ids[0];
  for(const id of ids){
    const el = document.getElementById(id);
    if(el && el.getBoundingClientRect().top < 150) cur = id;
  }
  document.querySelectorAll('#pageNav a').forEach(a=>a.classList.toggle('on',a.dataset.anchor===cur));
});

loadTemplate('1003062');
