const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};

const SKILLS={
 algebra:{name:'Algebra',icon:'⚔',color:'#ff8d62',trait:'Attack',desc:'Expressions, equations, simultaneous equations & substitution'},
 geometry:{name:'Geometry',icon:'🛡',color:'#5ef0a4',trait:'Defence',desc:'Straight lines, gradient, distance, area, perimeter, surface area & volume'},
 trigonometry:{name:'Trigonometry',icon:'🎯',color:'#60e9ff',trait:'Precision',desc:'Trig ratios, Pythagoras, sine rule, cosine rule & triangle area'},
 statistics:{name:'Statistics',icon:'📊',color:'#b18cff',trait:'Tactics',desc:'Averages, probability, quartiles, SD & data displays'}
};
const defaultState={player:{name:'Player One',avatar:'🐲',level:1,xp:0,crystals:250},clan:{name:'Merlion Scholars',guardian:'🐉',region:'Central',rating:1500,influence:18},skills:{algebra:8,geometry:7,trigonometry:6,statistics:7},history:[],streak:0};
let state=JSON.parse(localStorage.getItem('mathclans-v1')||'null')||structuredClone(defaultState);
const save=()=>localStorage.setItem('mathclans-v1',JSON.stringify(state));

const rivals=[
 {name:'Pi-Rates',crest:'🐙',region:'Tampines',rating:1548,skills:{algebra:62,geometry:70,trigonometry:48,statistics:74}},
 {name:'Angle Rangers',crest:'🦊',region:'Jurong',rating:1472,skills:{algebra:54,geometry:58,trigonometry:82,statistics:49}},
 {name:'Panda Prime',crest:'🐼',region:'Punggol',rating:1602,skills:{algebra:64,geometry:86,trigonometry:43,statistics:68}},
 {name:'Data Drakes',crest:'🐲',region:'Bedok',rating:1513,skills:{algebra:70,geometry:51,trigonometry:60,statistics:79}}
];
const members=[
 {name:'Ari',avatar:'🐲',role:'algebra',online:1,skills:{algebra:78,geometry:42,trigonometry:58,statistics:51}},
 {name:'Mei',avatar:'🐰',role:'trigonometry',online:1,skills:{algebra:49,geometry:55,trigonometry:84,statistics:57}},
 {name:'Zane',avatar:'🦊',role:'statistics',online:1,skills:{algebra:54,geometry:48,trigonometry:64,statistics:81}},
 {name:'Nora',avatar:'🐼',role:'geometry',online:1,skills:{algebra:52,geometry:87,trigonometry:43,statistics:61}},
 {name:'Kai',avatar:'🤖',role:'algebra',online:1,skills:{algebra:82,geometry:58,trigonometry:61,statistics:44}},
 {name:'Lina',avatar:'🐧',role:'statistics',online:1,skills:{algebra:51,geometry:66,trigonometry:47,statistics:79}},
 {name:'Theo',avatar:'🦖',role:'geometry',online:1,skills:{algebra:63,geometry:77,trigonometry:52,statistics:48}},
 {name:'Sora',avatar:'🐱',role:'trigonometry',online:1,skills:{algebra:47,geometry:55,trigonometry:80,statistics:65}},
 {name:'Ben',avatar:'🐶',role:'algebra',online:0,skills:{algebra:74,geometry:49,trigonometry:51,statistics:56}},
 {name:'Ivy',avatar:'🦄',role:'geometry',online:1,skills:{algebra:55,geometry:75,trigonometry:65,statistics:60}}
];
let selectedMembers=new Set();
let activeSkill=null,currentQuestion=null,battle=null;

function init(){
 $('#playerName').textContent=state.player.name;$('#playerLevel').textContent=state.player.level;$('#playerXp').textContent=state.player.xp;$('#crystals').textContent=state.player.crystals;$('#miniAvatar').textContent=state.player.avatar;
 $('#mapClanName').textContent=$('#clanTitle').textContent=$('#clanNameCard').textContent=state.clan.name;$('#clanRating').textContent=state.clan.rating;$('#clanInfluence').textContent=state.clan.influence+'%';$('#memberCount').textContent=members.length;
 renderRivals();renderSkills();renderMembers();renderTeamBars();renderRanking();wire();
}
function wire(){
 $$('.bottom-nav button').forEach(b=>b.onclick=()=>goScreen(b.dataset.screen));
 $$('[data-go]').forEach(b=>b.onclick=()=>goScreen(b.dataset.go));
 $('#nextQuestionBtn').onclick=()=>newQuestion(activeSkill);
 $('#findBattleBtn').onclick=()=>openBattlePicker();
 $('#mentalForm').onsubmit=e=>{e.preventDefault();submitMental()};
 $('#editClanBtn').onclick=openClanEditor;
}
function goScreen(name){$$('.screen').forEach(s=>s.classList.remove('active'));$('#screen-'+name).classList.add('active');$$('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.screen===name));if(name==='battle'&&!battle) openBattlePicker()}
function renderRivals(){
 $('#rivalList').innerHTML=rivals.map((r,i)=>`<div class="rival-item" data-i="${i}"><div class="rival-crest">${r.crest}</div><div><strong>${r.name}</strong><small>${r.region} · ${Math.abs(r.rating-state.clan.rating)} rating gap</small></div><div class="rating-pill">${r.rating}</div></div>`).join('');
 $$('.rival-item').forEach(el=>el.onclick=()=>openRival(+el.dataset.i));
}
function renderSkills(){
 $('#skillGrid').innerHTML=Object.entries(SKILLS).map(([k,s])=>`<div class="skill-card ${activeSkill===k?'selected':''}" data-skill="${k}" style="--skill-color:${s.color}"><div class="skill-icon">${s.icon}</div><h3>${s.name}</h3><p>${s.desc}</p><div class="skill-level"><span>${s.trait}</span><b>Lv ${state.skills[k]}</b></div><div class="skill-progress"><i style="width:${Math.min(100,state.skills[k])}%"></i></div></div>`).join('');
 $$('.skill-card').forEach(c=>c.onclick=()=>{activeSkill=c.dataset.skill;renderSkills();newQuestion(activeSkill)});
}
function renderMembers(){
 $('#memberList').innerHTML=members.map((m,i)=>`<div class="member ${selectedMembers.has(i)?'selected':''} ${!m.online?'offline':''}" data-i="${i}"><div class="member-avatar">${m.avatar}</div><div><strong>${m.name}</strong><small>${SKILLS[m.role].icon} ${SKILLS[m.role].name} specialist</small></div><span class="role-tag">${m.online?'READY':'OFFLINE'}</span></div>`).join('');
 $$('.member').forEach(el=>el.onclick=()=>{const i=+el.dataset.i;if(!members[i].online)return;if(selectedMembers.has(i))selectedMembers.delete(i);else if(selectedMembers.size<10)selectedMembers.add(i);renderMembers();});
 const n=selectedMembers.size;$('#selectedCount').textContent=n;$('#armyLabel').textContent=n?`${n} troop${n>1?'s':''} ready`:'Choose 3–10 players';$('#findBattleBtn').disabled=n<3;
}
function renderTeamBars(){
 const src=selectedMembers.size?[...selectedMembers].map(i=>members[i]):members.filter(m=>m.online).slice(0,5);
 const avg=k=>Math.round(src.reduce((a,m)=>a+m.skills[k],0)/src.length);
 $('#teamBars').innerHTML=Object.entries(SKILLS).map(([k,s])=>`<div class="team-bar"><span>${s.icon}</span><div class="track"><i style="width:${avg(k)}%;background:${s.color}"></i></div><b>${avg(k)}</b></div>`).join('');
}
function renderRanking(){
 const rows=[...rivals.map(r=>({...r})),{name:state.clan.name,crest:state.clan.guardian,region:state.clan.region,rating:state.clan.rating,you:true},
 {name:'Hex Heroes',crest:'🐢',region:'Sengkang',rating:1440},{name:'Sigma Squad',crest:'🦉',region:'Bishan',rating:1398}].sort((a,b)=>b.rating-a.rating);
 $('#rankingList').innerHTML=rows.map((r,i)=>`<div class="rank-row ${r.you?'you':''}"><b>#${i+1}</b><strong>${r.crest} ${r.name}${r.you?'<small>Your clan</small>':''}</strong><span>${r.region}</span><b>${r.rating}</b></div>`).join('');
}
function openRival(i){const r=rivals[i];showModal(`<span class="eyebrow">RIVAL HQ</span><h3>${r.crest} ${r.name}</h3><p>${r.region} · Rating ${r.rating}</p><div class="team-bars">${Object.entries(SKILLS).map(([k,s])=>`<div class="team-bar"><span>${s.icon}</span><div class="track"><i style="width:${r.skills[k]}%;background:${s.color}"></i></div><b>${r.skills[k]}</b></div>`).join('')}</div><div class="modal-actions"><button class="secondary" data-close>Close</button><button class="primary" id="attackRival">Prepare Attack</button></div>`); $('[data-close]').onclick=closeModal;$('#attackRival').onclick=()=>{closeModal();goScreen('clan');toast('⚔ Rally 3–10 available members, then deploy.')};}
function openClanEditor(){showModal(`<span class="eyebrow">CLAN SETTINGS</span><h3>Edit clan identity</h3><label>Clan name</label><input id="clanNameInput" value="${state.clan.name}"><label>Home region</label><select id="clanRegionInput">${['Central','Tampines','Sengkang','Jurong','Woodlands','Bedok','Punggol','Bishan'].map(x=>`<option ${x===state.clan.region?'selected':''}>${x}</option>`).join('')}</select><div class="modal-actions"><button class="secondary" data-close>Cancel</button><button class="primary" id="saveClan">Save</button></div>`);$('[data-close]').onclick=closeModal;$('#saveClan').onclick=()=>{state.clan.name=$('#clanNameInput').value.trim()||state.clan.name;state.clan.region=$('#clanRegionInput').value;save();closeModal();init();toast('🏰 Clan identity updated.')};}
function showModal(html){$('#modal').innerHTML=html;$('#modalBackdrop').classList.remove('hidden')}function closeModal(){$('#modalBackdrop').classList.add('hidden')}
function toast(msg){const t=document.createElement('div');t.textContent=msg;Object.assign(t.style,{position:'fixed',zIndex:200,left:'50%',top:'82px',transform:'translateX(-50%)',background:'#081229',border:'1px solid #ffffff25',padding:'12px 16px',borderRadius:'14px',boxShadow:'0 15px 45px #0009'});document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}

// ----- Reasoning MCQ generation -----
const fmt=n=>Number.isInteger(n)?String(n):n.toFixed(2).replace(/0+$/,'').replace(/\.$/,'');
function makeAlgebra(){
 const type=rnd(0,3);
 if(type===0){const a=rnd(2,6),b=rnd(2,8),c=rnd(2,7),d=rnd(1,8);const correct=`${a}(${b}x ${d%2?'+':'−'} ${c}) + ${d}x<br>= ${a*b}x ${d%2?'+':'−'} ${a*c} + ${d}x<br>= ${a*b+d}x ${d%2?'+':'−'} ${a*c}`;return q('Simplifying expressions',`${a}(${b}x ${d%2?'+':'−'} ${c}) + ${d}x`,correct,[`${a*b}x ${d%2?'+':'−'} ${c} + ${d}x<br>= ${a*b+d}x ${d%2?'+':'−'} ${c}`,`${a+b}x ${d%2?'+':'−'} ${a*c+d}x<br>= ${a+b+a*c+d}x`,`${a*b}x ${d%2?'+':'−'} ${a*c+d}<br>= ${a*b}x ${d%2?'+':'−'} ${a*c+d}`],'Distribute the coefficient to every term inside the bracket, then collect only like terms.','ALG-SIM-'+type)}
 if(type===1){const x=rnd(2,12),a=rnd(2,7),b=rnd(1,12),rhs=a*x+b;const correct=`${a}x + ${b} = ${rhs}<br>${a}x = ${rhs} − ${b}<br>${a}x = ${a*x}<br>x = ${x}`;return q('Solving equations',`${a}x + ${b} = ${rhs}`,correct,[`${a}x = ${rhs} + ${b}<br>x = ${fmt((rhs+b)/a)}`,`x + ${b} = ${rhs} − ${a}<br>x = ${rhs-a-b}`,`${a}x = ${rhs} − ${b}<br>x = ${a*x}`],'Use inverse operations on both sides. After isolating the x-term, divide by its coefficient.','ALG-EQ-'+type)}
 if(type===2){const x=rnd(1,7),y=rnd(1,7),a=rnd(1,4),b=rnd(1,4),c=rnd(1,4),d=rnd(1,4),r1=a*x+b*y,r2=c*x-d*y;const correct=`${a}x + ${b}y = ${r1}<br>${c}x − ${d}y = ${r2}<br>Eliminate one variable consistently, then solve the remaining equation.`;return q('Simultaneous equations',`${a}x + ${b}y = ${r1}<br>${c}x − ${d}y = ${r2}`,correct,[`Add the two right sides but subtract the x-terms only.`,`Set ${a}x + ${b}y = ${c}x − ${d}y and ignore the constants.`,`Solve each equation separately as though the other variable were zero.`],'A valid elimination or substitution method must preserve both complete equations.','ALG-SIMUL-'+type)}
 const a=rnd(2,6),b=rnd(-5,5),v=rnd(2,8);return q('Substitution',`Given a = ${v}, find 2a² ${b>=0?'+':'−'} ${Math.abs(b)}.`,`2(${v})² ${b>=0?'+':'−'} ${Math.abs(b)}<br>= 2(${v*v}) ${b>=0?'+':'−'} ${Math.abs(b)}<br>= ${2*v*v+b}`,[`(2×${v})² ${b>=0?'+':'−'} ${Math.abs(b)}<br>= ${(2*v)**2+b}`,`2(${v}×2) ${b>=0?'+':'−'} ${Math.abs(b)}<br>= ${4*v+b}`,`2 + ${v}² ${b>=0?'+':'−'} ${Math.abs(b)}<br>= ${2+v*v+b}`],'Substitute the given value before applying the index and operation order.','ALG-SUB-'+type)};
function makeGeometry(){
 const type=rnd(0,4);
 if(type===0){const x1=rnd(-5,4),x2=x1+rnd(2,7),m=rnd(-4,5)||2,y1=rnd(-6,6),y2=y1+m*(x2-x1);return q('Gradient',`A(${x1}, ${y1}) and B(${x2}, ${y2}). Find the gradient.`,`m = (${y2} − ${y1}) / (${x2} − ${x1})<br>= ${y2-y1} / ${x2-x1}<br>= ${m}`,[`m = (${x2} − ${x1}) / (${y2} − ${y1})<br>= ${fmt(1/m)}`,`m = (${y2} + ${y1}) / (${x2} + ${x1})`,`m = (${y2} − ${x2}) / (${y1} − ${x1})`],'Gradient is change in y divided by change in x, using the same point order in numerator and denominator.','GEO-GRAD-'+type)}
 if(type===1){const m=rnd(-4,5)||3,c=rnd(-6,7);return q('Equation of a straight line',`Gradient = ${m}, y-intercept = ${c}. Find the equation.`,`y = mx + c<br>y = ${m}x ${c>=0?'+':'−'} ${Math.abs(c)}`,[`y = ${c}x ${m>=0?'+':'−'} ${Math.abs(m)}`,`x = ${m}y ${c>=0?'+':'−'} ${Math.abs(c)}`,`y = ${m+c}x`],'Use y = mx + c, where m is the gradient and c is the y-intercept.','GEO-LINE-'+type)}
 if(type===2){const dx=rnd(3,9),dy=rnd(3,9),sq=dx*dx+dy*dy;return q('Distance between 2 points',`The horizontal change is ${dx} and vertical change is ${dy}. Find the distance.`,`d = √(${dx}² + ${dy}²)<br>= √${sq}`,[`d = ${dx} + ${dy} = ${dx+dy}`,`d = √(${dx} + ${dy})`,`d = ${dx}² + ${dy}² = ${sq}`],'The distance formula comes from Pythagoras; square both coordinate differences before adding and square-rooting.','GEO-DIST-'+type)}
 if(type===3){const l=rnd(6,15),w=rnd(3,9);return q('Area & perimeter',`A rectangle has length ${l} cm and width ${w} cm. Find its area.`,`Area = length × width<br>= ${l} × ${w}<br>= ${l*w} cm²`,[`Area = 2(${l}+${w}) = ${2*(l+w)} cm²`,`Area = ${l}+${w} = ${l+w} cm²`,`Area = (${l}×${w})÷2 = ${l*w/2} cm²`],'Area of a rectangle is length × width. Perimeter uses 2(l+w).','GEO-AREA-'+type)}
 const r=rnd(2,7),h=rnd(5,14);return q('Surface area & volume',`Cylinder radius = ${r} cm, height = ${h} cm. Find its volume in terms of π.`,`V = πr²h<br>= π(${r})²(${h})<br>= ${r*r*h}π cm³`,[`V = 2πrh = ${2*r*h}π cm³`,`V = πrh = ${r*h}π cm³`,`V = πr² + h = ${r*r+h}π cm³`],'Cylinder volume is base area πr² multiplied by height.','GEO-VOL-'+type)};
function makeTrig(){
 const type=rnd(0,4);
 if(type===0){const triples=[[3,4,5],[5,12,13],[8,15,17]],t=triples[rnd(0,2)],o=t[0],a=t[1],h=t[2];return q('Trig ratios',`For angle θ: opposite = ${o}, adjacent = ${a}, hypotenuse = ${h}. Find sin θ.`,`sin θ = opposite / hypotenuse<br>= ${o}/${h}`,[`sin θ = adjacent / hypotenuse<br>= ${a}/${h}`,`sin θ = opposite / adjacent<br>= ${o}/${a}`,`sin θ = hypotenuse / opposite<br>= ${h}/${o}`],'Sine uses opposite over hypotenuse (SOH).','TRIG-RATIO-'+type)}
 if(type===1){const a=rnd(5,12),b=rnd(5,12),c2=a*a+b*b;return q('Pythagoras theorem',`A right triangle has shorter sides ${a} cm and ${b} cm. Find the hypotenuse.`,`c² = ${a}² + ${b}²<br>c = √${c2}`,[`c = ${a}+${b} = ${a+b}`,`c² = ${a}² − ${b}²`,`c = √(${a}+${b})`],'For a right triangle, the hypotenuse satisfies c² = a² + b².','TRIG-PYTH-'+type)}
 if(type===2){return q('Sine rule',`In triangle ABC, a/sin A = b/sin B. Which setup correctly finds b?`,`b / sin B = a / sin A<br>b = a sin B / sin A`,[`b = a sin A / sin B`,`b = a cos B / cos A`,`b = a + sin B − sin A`],'Match each side with its opposite angle when using the sine rule.','TRIG-SINE-'+type)}
 if(type===3){return q('Cosine rule',`Sides a and b and included angle C are known. Which method finds side c?`,`c² = a² + b² − 2ab cos C<br>c = √(a² + b² − 2ab cos C)`,[`c² = a² + b² + 2ab cos C`,`c = a + b − 2ab cos C`,`c² = a² − b² − 2ab sin C`],'For the side opposite the included angle C, use the cosine rule with −2ab cos C.','TRIG-COS-'+type)}
 const a=rnd(5,12),b=rnd(6,14),ang=[30,45,60][rnd(0,2)];return q('Area of non-right triangle',`Two sides are ${a} cm and ${b} cm with included angle ${ang}°. Which setup gives the area?`,`Area = ½ab sin C<br>= ½(${a})(${b}) sin ${ang}°`,[`Area = ab cos C`,`Area = ½ab cos C`,`Area = a² + b² − 2ab cos C`],'For two sides and their included angle, area = ½ab sin C.','TRIG-AREA-'+type)};
function makeStats(){
 const type=rnd(0,5);
 if(type===0){const vals=shuffle([4,6,7,7,11]);const sum=vals.reduce((a,b)=>a+b,0);return q('Mean, median & mode',`Find the mean of: ${vals.join(', ')}`,`Mean = sum of values / number of values<br>= ${sum}/5<br>= ${fmt(sum/5)}`,[`Mean = (${Math.min(...vals)}+${Math.max(...vals)})/2`,`Mean = 7 because 7 occurs most often`,`Mean = ${Math.max(...vals)-Math.min(...vals)} because that is the range`],'The mean is the total of all observations divided by the number of observations.','STAT-MEAN-'+type)}
 if(type===1){const fav=rnd(2,8),total=fav+rnd(3,9);return q('Probability',`${fav} of ${total} equally likely outcomes are favourable. Find the probability.`,`P = favourable / total<br>= ${fav}/${total}`,[`P = ${total}/${fav}`,`P = ${fav}/${total-fav}`,`P = ${fav}+${total}`],'Probability = number of favourable outcomes divided by total equally likely outcomes.','STAT-PROB-'+type)}
 if(type===2){const data=[2,5,7,9,12,15,18];return q('Quartiles & IQR',`For 2, 5, 7, 9, 12, 15, 18, which working finds the IQR correctly?`,`Q₁ = 5, Q₃ = 15<br>IQR = Q₃ − Q₁<br>= 10`,[`IQR = 18 − 2 = 16`,`IQR = 15 + 5 = 20`,`IQR = 9 − 5 = 4`],'Interquartile range measures the middle 50%: Q3 − Q1.','STAT-IQR-'+type)}
 if(type===3){return q('Standard deviation',`Which statement correctly describes standard deviation?`,`It measures how spread out values are around the mean. A larger standard deviation means greater spread.`,[`It is always equal to the range.`,`It gives the most frequent value in a dataset.`,`A larger standard deviation means the data are more tightly clustered.`],'Standard deviation is a measure of spread around the mean.','STAT-SD-'+type)}
 if(type===4){const f=rnd(12,30),w=rnd(3,8);return q('Histogram',`A class has frequency ${f} and class width ${w}. Which setup gives frequency density?`,`Frequency density = frequency / class width<br>= ${f}/${w}`,[`Frequency density = ${f}×${w}`,`Frequency density = ${f}+${w}`,`Frequency density = class width / frequency<br>= ${w}/${f}`],'For a histogram with unequal class widths, frequency density = frequency ÷ class width.','STAT-HIST-'+type)}
 return q('Cumulative frequency',`Which working correctly finds the interquartile range from a cumulative frequency graph?`,`Read Q₁ at 25% and Q₃ at 75% of total frequency, then calculate Q₃ − Q₁.`,[`Read the maximum and minimum values, then add them.`,`Read only the median at 50% and double it.`,`Subtract total frequency from the upper quartile.`],'Quartiles occur at 25%, 50% and 75% of cumulative frequency; IQR = Q3 − Q1.','STAT-CF-'+type)};
function q(topic,problem,correct,wrong,explanation,dna){const opts=shuffle([{html:correct,correct:true},...wrong.map(x=>({html:x,correct:false}))]);return{topic,problem,opts,explanation,dna:dna+'-'+rnd(1,9999)}}
function generateQuestion(skill){let maker={algebra:makeAlgebra,geometry:makeGeometry,trigonometry:makeTrig,statistics:makeStats}[skill],attempt=0,qv;do{qv=maker();attempt++}while(state.history.includes(qv.dna)&&attempt<12);return qv}
function newQuestion(skill){currentQuestion=generateQuestion(skill);$('#trainingEmpty').classList.add('hidden');$('#questionPanel').classList.remove('hidden');$('#qSkill').textContent=`${SKILLS[skill].icon} ${SKILLS[skill].name.toUpperCase()}`;$('#qTitle').textContent=currentQuestion.topic;$('#qDifficulty').textContent=['COMMON','SKILLED','ADVANCED'][rnd(0,2)];$('#qProblem').innerHTML=currentQuestion.problem;$('#workedOptions').innerHTML=currentQuestion.opts.map((o,i)=>`<div class="worked-option" data-i="${i}"><span class="option-letter">${'ABCD'[i]}</span><div class="math-lines">${o.html}</div></div>`).join('');$('#feedback').classList.add('hidden');$('#nextQuestionBtn').classList.add('hidden');$$('.worked-option').forEach(el=>el.onclick=()=>answerQuestion(+el.dataset.i));}
function answerQuestion(i){const chosen=currentQuestion.opts[i],correctIndex=currentQuestion.opts.findIndex(o=>o.correct);$$('.worked-option').forEach((el,j)=>{el.classList.add('disabled');if(j===correctIndex)el.classList.add('correct');else if(j===i&&!chosen.correct)el.classList.add('wrong');el.onclick=null});if(chosen.correct){state.streak++;state.player.xp+=8;state.skills[activeSkill]=Math.min(100,state.skills[activeSkill]+1);state.player.crystals+=2;$('#feedback').innerHTML=`<strong>✅ Correct reasoning</strong><br>${currentQuestion.explanation}<br><br>${SKILLS[activeSkill].icon} ${SKILLS[activeSkill].name} Mastery +1 · 💎 +2`; } else {state.streak=0;$('#feedback').innerHTML=`<strong>❌ Study the highlighted correct working</strong><br>${currentQuestion.explanation}`;}state.history.push(currentQuestion.dna);state.history=state.history.slice(-100);$('#trainStreak').textContent=state.streak;$('#feedback').classList.remove('hidden');$('#nextQuestionBtn').classList.remove('hidden');save();init();activeSkill=activeSkill;renderSkills();}

// ----- Clan clash -----
function openBattlePicker(){
 if(selectedMembers.size<3){goScreen('clan');toast('Choose at least 3 available members first.');return}
 showModal(`<span class="eyebrow">MATCHMAKING</span><h3>Choose a rival</h3><p>Your army has <b>${selectedMembers.size}</b> troops. The rival will field the same number for this prototype.</p>${rivals.map((r,i)=>`<div class="rival-item battle-pick" data-i="${i}"><div class="rival-crest">${r.crest}</div><div><strong>${r.name}</strong><small>${r.region}</small></div><div class="rating-pill">${r.rating}</div></div>`).join('')}<div class="modal-actions"><button class="secondary" data-close>Cancel</button></div>`);$('[data-close]').onclick=closeModal;$$('.battle-pick').forEach(el=>el.onclick=()=>{const r=rivals[+el.dataset.i];closeModal();startBattle(r)});
}
function startBattle(enemy){
 const team=[...selectedMembers].map(i=>members[i]);const n=team.length;const avg=k=>Math.round(team.reduce((a,m)=>a+m.skills[k],0)/n);battle={enemy,team,maxHp:10000,ourHp:10000,enemyHp:10000,seconds:90,asked:0,correct:0,combo:0,started:Date.now(),question:null,lastQAt:Date.now(),skills:Object.fromEntries(Object.keys(SKILLS).map(k=>[k,avg(k)]))};
 $('#battleOurClan').textContent=state.clan.name;$('#battleEnemyClan').textContent=enemy.name;$('#ourFormation').innerHTML=team.map(m=>`<span class="unit">${m.avatar}</span>`).join('');$('#enemyFormation').innerHTML=team.map((_,i)=>`<span class="unit">${['🐙','🐺','🦇','🐗','🦂','🦅','🐯','🦈','🐍','🦁'][i]}</span>`).join('');$('#battleSkillRunes').innerHTML=Object.entries(SKILLS).map(([k,s])=>`<div class="rune">${s.icon} ${s.name}<b>${battle.skills[k]}</b></div>`).join('');goScreen('battle');nextMental();updateBattleUi();$('#mentalAnswer').value='';$('#mentalAnswer').focus();battle.timer=setInterval(tickBattle,1000);
}
function mentalQ(){let a=rnd(8,90),b=rnd(2,35),op=['+','−','×'][rnd(0,2)],ans;if(op==='+')ans=a+b;else if(op==='−'){if(b>a)[a,b]=[b,a];ans=a-b}else{a=rnd(2,15);b=rnd(2,12);ans=a*b}return{text:`${a} ${op} ${b}`,ans}}
function nextMental(){if(!battle)return;battle.question=mentalQ();battle.lastQAt=Date.now();$('#mentalQuestion').textContent=battle.question.text;$('#mentalAnswer').value=''}
function submitMental(){if(!battle||battle.ended)return;const val=Number($('#mentalAnswer').value);if(!Number.isFinite(val))return;const elapsed=(Date.now()-battle.lastQAt)/1000;battle.asked++;if(val===battle.question.ans){battle.correct++;battle.combo++;const speed=Math.max(.35,1-Math.max(0,elapsed-1.5)*.08);let power=650*speed;power*=1+(battle.skills.algebra/1000);if(elapsed<3)power*=1+(battle.skills.trigonometry/1400);if(Math.random()<battle.skills.statistics/1200){power*=1.35;effect('📊 CRITICAL OUTLIER!')}const blocked=1-(battle.enemy.skills.geometry/1400);const dmg=Math.round(power*blocked);battle.enemyHp=Math.max(0,battle.enemyHp-dmg);if(!$('#battleEffects').textContent.includes('CRITICAL'))effect(`⚔ ${dmg} DAMAGE`);}else{battle.combo=0;const enemyDmg=Math.round(480*(1-battle.skills.geometry/1500));battle.ourHp=Math.max(0,battle.ourHp-enemyDmg);effect(`🛡 ENEMY COUNTER ${enemyDmg}`)}updateBattleUi();if(battle.enemyHp<=0||battle.ourHp<=0)return endBattle();nextMental();$('#mentalAnswer').focus()}
function tickBattle(){if(!battle||battle.ended)return;battle.seconds--;$('#battleTimer').textContent=battle.seconds;if(battle.seconds<=0)endBattle();else if(Math.random()<.22){const dmg=Math.round(180*(1-battle.skills.geometry/1500));battle.ourHp=Math.max(0,battle.ourHp-dmg);updateBattleUi();if(battle.ourHp<=0)endBattle()}}
function updateBattleUi(){if(!battle)return;$('#ourHpBar').style.width=(battle.ourHp/battle.maxHp*100)+'%';$('#enemyHpBar').style.width=(battle.enemyHp/battle.maxHp*100)+'%';$('#ourHpText').textContent=`${battle.ourHp} HP`;$('#enemyHpText').textContent=`${battle.enemyHp} HP`;$('#battleAccuracy').textContent=(battle.asked?Math.round(battle.correct/battle.asked*100):100)+'%';$('#battleCombo').textContent=battle.combo}
function effect(t){$('#battleEffects').innerHTML=`<div class="effect-text">${t}</div>`}
function endBattle(){if(!battle||battle.ended)return;battle.ended=true;clearInterval(battle.timer);const win=battle.enemyHp<battle.ourHp;const delta=win?rnd(18,28):-rnd(12,20);state.clan.rating=Math.max(1000,state.clan.rating+delta);if(win){state.player.crystals+=80;state.clan.influence=Math.min(100,state.clan.influence+2)}save();renderRanking();$('#clanRating').textContent=state.clan.rating;effect(win?'🏆 VICTORY!':'💥 DEFEAT');showModal(`<span class="eyebrow">CLAN CLASH RESULT</span><h3>${win?'🏆 Victory':'🛡 Defeat'}</h3><p>${state.clan.name} vs ${battle.enemy.name}</p><div class="clan-stats"><div><span>Accuracy</span><b>${battle.asked?Math.round(battle.correct/battle.asked*100):0}%</b></div><div><span>Rating</span><b>${delta>0?'+':''}${delta}</b></div><div><span>Crystals</span><b>${win?'+80':'0'}</b></div></div><p>Your Algebra, Geometry, Trigonometry and Statistics mastery did <b>not</b> decrease. Only clan rating changes after a loss.</p><div class="modal-actions"><button class="primary" id="returnMap">Return to Map</button></div>`);$('#returnMap').onclick=()=>{closeModal();battle=null;goScreen('map');init()}}

init();
