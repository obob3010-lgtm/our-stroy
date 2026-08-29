const CONFIG = {
  introText: "Для самой прекрасной девушки...",
  questAnswer: 1271 + 3004 + 1612 + 1703, // = 7590
  meetingISO: "2026-08-10T10:00:00+05:00", // Ташкент, UTC+5
  reasons: [
    "Потому что от твоего «уммм, как вкусно» я готов скупить все десертные меню города.",
    "Потому что ты умудряешься быть самым неуклюжим человеком на планете — и при этом самым моим.",
    "Потому что на самокате ты держишься за меня так, будто боишься упасть, а я — самый счастливый водитель на свете.",
    "Потому что после каждой нашей глупой драки понарошку ты всё равно первая смеёшься.",
    "Потому что ты смотришь дорамы, которые я ненавижу всем сердцем, — а я смотрю их с тобой всем сердцем.",
    "Потому что у тебя расширяются зрачки, и я вижу в них своё отражение — так меня ещё никто не видел.",
    "Потому что ты — светик, который умеет быть светом даже в мой самый тёмный день.",
    "Потому что удача, которая должна была достаться тебе, зачем-то перешла мне — но я всё равно рядом разгребать твои приключения.",
    "Потому что «милая дверь» стала нашей дверью, а не просто кафе с клубничным десертом.",
    "Потому что ты — пингвинёнок и гномик одновременно, и я обожаю фотографировать доказательства.",
    "Потому что даже когда ты — ведьма и исчадие ада в 6 утра без кофе, я всё равно хочу быть рядом.",
    "Потому что ты умеешь превращать парк аттракционов в лучший день лета даже после ссоры.",
    "Потому что лодка на озере, честный разговор и твоя рука в моей — это ровно то, что я называю домом.",
    "Потому что 51 шаг из 100 — это не предел, просто я всегда начинаю первым.",
    "Потому что твоё «жоним» звучит теплее, чем любое другое слово, которое я знаю.",
    "Потому что кроха, которая держит на себе половину моего мира, даже не подозревает, какая она сильная.",
    "Потому что рядом с тобой даже плохой день выглядит терпимым.",
    "Потому что ты моя Дильнурочка, и это единственное имя, которое хочется повторять просто так.",
    "Потому что с тобой всё ощущается как «в первый раз».",
    "Потому что я всё ещё помню тепло твоей головы у меня на плече на самокате.",
    "Потому что буся — это не просто слово, это то, кем ты стала для меня.",
    "Потому что твоя улыбка чинит мне настроение быстрее любого другого способа, который я пробовал.",
    "Потому что я готов слушать твои дорамы хоть каждый вечер, лишь бы ты сидела рядом.",
    "Потому что даже спустя месяц вдали я точно знаю: 10 августа, 10 утра — и я обниму тебя так, что мы оба забудем как дышать.",
  ],
  secretText:
`Нашла. Значит правда всё здесь потрогала — как и должна, пингвинёнок.

Вот что я нигде больше не написал: что бы ни случилось между нами, я выберу тебя снова. Каждый раз. Даже вредную ведьму-исчадие ада версию тебя в 6 утра без кофе — тоже выберу, не глядя.

Это была самая настоящая тайна на этом сайте. Спасибо, что нашла её — совсем как меня.`,
  letterText:
`Дорогая, я очень люблю тебя и рад, что ты есть в моей жизни. Ты моё сокровище и причина для счастья — рядом с тобой всё ощущается по-другому, а всё, что было до тебя, кажется неискренним и чужим. Поэтому всё, что происходит у нас с тобой, я проживаю как будто «в первый раз».

Я очень тебя оберегаю и, честно говоря, ревную — не потому что не доверяю тебе, а потому что скучаю и переживаю, когда не могу быть рядом. Знаю, что иногда веду себя слишком тревожно, и работаю над этим. Просто хочу, чтобы ты знала: пока тебя нет рядом, я буду думать о тебе каждый час — как ты, всё ли в порядке, не нужна ли тебе помощь.

Ты чудо для меня. Спасибо, что ты моя.

Милая, я люблю тебя. Сейчас 4 утра, и я просто хочу тебя обнять.`,
};
const STORAGE_KEYS = { unlocked:'ourStory_unlocked', museum:'ourStory_museum' };
function safeGet(key){try{return localStorage.getItem(key)}catch(_){return null}}
function safeSet(key,value){try{localStorage.setItem(key,value);return true}catch(_){return false}}

/* ============================================================
   АКТИВАЦИЯ — один раз на устройстве
   ============================================================ */
(function activation(){
  const GATE_KEY = 'ourStory_activated_v3';
  const gate = document.getElementById('gate');
  const btn = document.getElementById('introBtn');
  const resetBtn = document.getElementById('gateResetBtn');
  const intro = document.getElementById('introType');

  const activated = safeGet(GATE_KEY) === '1';
  if(activated){
    gate.classList.add('unlocked');
    document.body.classList.remove('locked');
  }

  const text = CONFIG.introText;
  let i = 0;
  function type(){
    if(!intro) return;
    if(i <= text.length){
      intro.textContent = text.slice(0,i++);
      setTimeout(type, 45);
    }
  }
  setTimeout(type, 500);

  btn?.addEventListener('click', ()=>{
    safeSet(GATE_KEY,'1');
    gate.classList.add('unlocked');
    document.body.classList.remove('locked');
    window.dispatchEvent(new CustomEvent('museum:activated'));
  });

  resetBtn?.addEventListener('click', ()=>{
    localStorage.removeItem(GATE_KEY);
    gate.classList.remove('unlocked');
    document.body.classList.add('locked');
    window.scrollTo({top:0,behavior:'smooth'});
  });
})();


/* ============================================================
   ЛОКАЛЬНЫЕ УТИЛИТЫ
   ============================================================ */
const localMuseumKey = 'ourStory_museum_backup_v3';

function localBackupRead(){
  try{ return JSON.parse(localStorage.getItem(localMuseumKey) || '[]'); }catch(_){ return []; }
}
function localBackupWrite(entries){
  try{ localStorage.setItem(localMuseumKey, JSON.stringify(entries)); return true; }catch(_){ return false; }
}
function uid(){
  return (crypto?.randomUUID) ? crypto.randomUUID() : `m-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function escapeHtml(str){
  const d=document.createElement('div'); d.textContent=str ?? ''; return d.innerHTML;
}
function fileToCompressedBlob(file,maxDim=1800,quality=.82){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onerror=reject;
    reader.onload=()=>{
      const img=new Image();
      img.onerror=reject;
      img.onload=()=>{
        let {width:w,height:h}=img;
        if(w>maxDim||h>maxDim){
          if(w>h){h=Math.round(h*maxDim/w);w=maxDim;}
          else{w=Math.round(w*maxDim/h);h=maxDim;}
        }
        const canvas=document.createElement('canvas'); canvas.width=w; canvas.height=h;
        canvas.getContext('2d').drawImage(img,0,0,w,h);
        canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('compression failed')),'image/jpeg',quality);
      };
      img.src=reader.result;
    };
    reader.readAsDataURL(file);
  });
}


/* ============================================================
   SUPABASE
   ============================================================ */
let supabaseClient = null;
let currentUser = null;

async function initCloud(){
  const cfg=window.MUSEUM_CONFIG || {};
  if(!cfg.enabled || !window.supabase) return {enabled:false};
  try{
    supabaseClient=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey,{
      auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}
    });
    let {data:{session}}=await supabaseClient.auth.getSession();
    if(!session){
      const {data,error}=await supabaseClient.auth.signInAnonymously();
      if(error) throw error;
      session=data.session;
    }
    currentUser=session?.user || null;
    return {enabled:true,user:currentUser};
  }catch(error){
    console.error('Supabase init failed',error);
    return {enabled:false,error};
  }
}

/* ============================================================
   СЕЗОННЫЙ + СУТОЧНЫЙ ДИЗАЙН
   ============================================================ */
(function seasonalTheme(){
  const cfg=window.MUSEUM_CONFIG||{};
  const forced=String(cfg.seasonMode||'auto').toLowerCase();
  const month=new Date().getMonth()+1;
  const season=forced!=='auto'?forced:([12,1,2].includes(month)?'winter':([3,4,5].includes(month)?'spring':([6,7,8].includes(month)?'summer':'autumn')));
  document.body.classList.add(`season-${season}`); document.body.dataset.season=season;
  const labels={winter:'зима',spring:'весна',summer:'лето',autumn:'осень'};
  const badge=document.getElementById('seasonBadge'); if(badge)badge.textContent=labels[season]||season;
  const decor=document.getElementById('seasonDecor');
  const glyphs={winter:['❄','·','✦'],spring:['✿','·','❀'],summer:['·','✦','˚'],autumn:['❧','·','✦']};
  if(decor){const chars=glyphs[season]||glyphs.summer;for(let i=0;i<18;i++){const p=document.createElement('span');p.className='season-particle';p.textContent=chars[i%chars.length];p.style.left=Math.random()*100+'vw';p.style.top=(-10-Math.random()*30)+'vh';p.style.animationDelay=Math.random()*12+'s';p.style.animationDuration=10+Math.random()*12+'s';p.style.setProperty('--drift',(Math.random()*80-40)+'px');decor.appendChild(p);}}

  function updateDayNight(){
    let hour; try{hour=Number(new Intl.DateTimeFormat('en-US',{hour:'numeric',hour12:false,timeZone:'Asia/Tashkent'}).format(new Date()));}catch(_){hour=new Date().getHours();}
    const day=hour>=7&&hour<19;
    document.body.classList.toggle('time-day',day); document.body.classList.toggle('time-night',!day);
    document.body.dataset.time=day?'day':'night';
    if(badge)badge.textContent=`${labels[season]||season} · ${day?'день':'ночь'}`;
  }
  updateDayNight(); setInterval(updateDayNight,60000);
})();

/* ============================================================
   ЗВЁЗДНЫЙ ФОН
   ============================================================ */
(function stars(){
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  let w, h, particles;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  function init(){
    resize();
    const count = Math.floor((w*h)/9000);
    particles = Array.from({length:count}, () => ({
      x:Math.random()*w, y:Math.random()*h,
      r:Math.random()*1.4+0.2,
      a:Math.random(), da:(Math.random()*0.015)+0.003,
      dir: Math.random()>0.5?1:-1
    }));
  }
  function tick(){
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = '#f3efe6';
    particles.forEach(p=>{
      p.a += p.da*p.dir;
      if(p.a<=0.1||p.a>=1) p.dir*=-1;
      ctx.globalAlpha = p.a;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }
  window.addEventListener('resize', init);
  init();
  tick();
})();


/* ============================================================
   ВИНИЛ + ПОЛНОЦЕННЫЙ ПЛЕЕР
   ============================================================ */
(function vinyl(){
  const btn=document.getElementById('vinylBtn'),disc=document.getElementById('vinylDisc'),arm=document.getElementById('vinylArm');
  const audio=document.getElementById('bgm'),progress=document.getElementById('musicProgress'),current=document.getElementById('musicCurrent'),duration=document.getElementById('musicDuration');
  const status=document.getElementById('musicStatus'),mute=document.getElementById('musicMute'),title=document.getElementById('musicTitle');
  if(!btn||!audio) return;
  const fmt=sec=>Number.isFinite(sec)?`${Math.floor(sec/60)}:${String(Math.floor(sec%60)).padStart(2,'0')}`:'0:00';
  function setPlaying(on){disc?.classList.toggle('playing',on);arm?.classList.toggle('playing',on);btn.textContent=on?'Ⅱ':'▶';}
  btn.addEventListener('click',async()=>{
    if(!audio.src){if(status)status.textContent='сначала выберите песню';return;}
    if(audio.paused){try{await audio.play();setPlaying(true);if(status)status.textContent='играет сейчас';}catch(e){setPlaying(false);if(status)status.textContent='браузер не смог запустить этот файл';}}
    else{audio.pause();setPlaying(false);if(status)status.textContent='пауза';}
  });
  audio.addEventListener('loadedmetadata',()=>{if(duration)duration.textContent=fmt(audio.duration);});
  audio.addEventListener('timeupdate',()=>{if(current)current.textContent=fmt(audio.currentTime);if(progress&&audio.duration)progress.value=(audio.currentTime/audio.duration)*100;});
  progress?.addEventListener('input',()=>{if(audio.duration)audio.currentTime=Number(progress.value)/100*audio.duration;});
  audio.addEventListener('play',()=>setPlaying(true)); audio.addEventListener('pause',()=>setPlaying(false));
  audio.addEventListener('ended',()=>setPlaying(false));
  audio.addEventListener('error',()=>{setPlaying(false);if(status)status.textContent='не удалось открыть этот трек';});
  mute?.addEventListener('click',()=>{audio.muted=!audio.muted;mute.textContent=audio.muted?'×':'⌕';});
  window.addEventListener('music:select',e=>{
    const t=e.detail; if(!t?.url)return;
    audio.pause(); audio.src=t.url; audio.load(); if(title)title.textContent=t.title||'без названия';
    if(status)status.textContent=t.artist?`${t.artist} · готово к воспроизведению`:'готово к воспроизведению';
    if(current)current.textContent='0:00'; if(duration)duration.textContent='0:00'; if(progress)progress.value=0;
  });
})();

/* ============================================================
   ПИСЬМО: печатающийся текст при появлении в зоне видимости
   ============================================================ */
(function letterType(){
  const el = document.getElementById('letterType');
  const box = document.getElementById('letterBox');
  const text = CONFIG.letterText;
  let started = false;

  function run(){
    if(started) return;
    started = true;
    let i = 0;
    (function step(){
      if(i <= text.length){
        el.textContent = text.slice(0,i);
        i += 2;
        setTimeout(step, 18);
      }
    })();
  }

  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{ if(entry.isIntersecting) run(); });
  }, {threshold:0.4});
  observer.observe(box);
})();


/* ============================================================
   ГЕНЕРАТОР ПРИЧИН
   ============================================================ */
(function reasonGenerator(){
  const btn = document.getElementById('reasonBtn');
  const textEl = document.getElementById('reasonText');
  const countEl = document.getElementById('reasonCount');
  let lastIndex = -1;
  let count = 0;

  function pickIndex(){
    if(CONFIG.reasons.length === 1) return 0;
    let i;
    do { i = Math.floor(Math.random() * CONFIG.reasons.length); }
    while(i === lastIndex);
    return i;
  }

  function showNext(){
    textEl.classList.add('fading');
    setTimeout(()=>{
      lastIndex = pickIndex();
      textEl.textContent = CONFIG.reasons[lastIndex];
      textEl.classList.remove('fading');
      count++;
      countEl.textContent = count;
    }, 250);
  }

  btn.addEventListener('click', showNext);
  showNext();
})();


/* ============================================================
   СЕКРЕТНАЯ ЗВЕЗДА
   ============================================================ */
(function secretStar(){
  const star = document.getElementById('secretStar');
  const modal = document.getElementById('secretModal');
  const closeBtn = document.getElementById('secretClose');
  const textEl = document.getElementById('secretText');
  if(!star) return;

  textEl.textContent = CONFIG.secretText;

  function open(){ modal.classList.add('show'); }
  function close(){ modal.classList.remove('show'); }

  star.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e)=>{ if(e.target === modal) close(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') close(); });
})();


/* ============================================================
   СЧЁТЧИК ДО ВСТРЕЧИ
   ============================================================ */
(function countdown(){
  const target = new Date(CONFIG.meetingISO).getTime();
  const els = {
    d: document.getElementById('cdDays'),
    h: document.getElementById('cdHours'),
    m: document.getElementById('cdMinutes'),
    s: document.getElementById('cdSeconds'),
  };
  const eyebrow = document.getElementById('finalEyebrow');
  const title = document.getElementById('finalTitle');
  const countdownBox = document.getElementById('countdown');
  let switched = false;

  function pad(n){ return String(n).padStart(2,'0'); }
  function tick(){
    const diff = target - Date.now();
    if(diff <= 0){
      if(!switched){
        switched = true;
        eyebrow.textContent = 'мы снова вместе';
        title.textContent = 'и это только начало';
        countdownBox.style.display = 'none';
      }
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    els.d.textContent = pad(d);
    els.h.textContent = pad(h);
    els.m.textContent = pad(m);
    els.s.textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);
})();


/* ============================================================
   ПОДАРОЧНАЯ КОРОБКА + КОНФЕТТИ
   ============================================================ */
document.getElementById('giftBox').addEventListener('click', function(){
  this.classList.add('open');
  document.getElementById('giftHint').style.display = 'none';
  document.getElementById('giftContent').classList.add('show');
  launchConfetti();
}, {once:true});

function launchConfetti(){
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#d4af6a', '#ecdcb4', '#f3efe6', '#8c86d8'];
  const pieces = Array.from({length:140}, () => ({
    x: Math.random()*canvas.width,
    y: -20 - Math.random()*canvas.height*0.5,
    size: 4 + Math.random()*5,
    color: colors[Math.floor(Math.random()*colors.length)],
    speed: 2 + Math.random()*3,
    drift: (Math.random()-0.5)*2,
    rot: Math.random()*360,
    rotSpeed: (Math.random()-0.5)*8,
  }));

  let frame = 0;
  const maxFrames = 260;

  function draw(){
    frame++;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p=>{
      p.y += p.speed;
      p.x += p.drift;
      p.rot += p.rotSpeed;
      ctx.save();
      ctx.translate(p.x,p.y);
      ctx.rotate(p.rot*Math.PI/180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*0.6);
      ctx.restore();
    });
    if(frame < maxFrames){
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0,0,canvas.width,canvas.height);
    }
  }
  draw();
}

window.addEventListener('resize', ()=>{
  const c = document.getElementById('confetti');
  c.width = window.innerWidth;
  c.height = window.innerHeight;
});


/* ============================================================
   ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ ПРИ СКРОЛЛЕ
   ============================================================ */
(function revealOnScroll(){
  const items = document.querySelectorAll('.reveal');
  if(!items.length) return;
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:0.15});
  items.forEach(el => observer.observe(el));
})();


/* ============================================================
   БОКОВАЯ НАВИГАЦИЯ
   ============================================================ */
(function sideNav(){
  const nav = document.getElementById('sideNav');
  if(!nav) return;
  const sections = document.querySelectorAll('#story .scene[data-nav]');
  const links = [];

  sections.forEach(sec=>{
    const a = document.createElement('a');
    a.href = '#' + sec.id;
    a.innerHTML = `<span class="dot"></span><span class="navlabel">${sec.dataset.nav}</span>`;
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      sec.scrollIntoView({behavior:'smooth'});
    });
    nav.appendChild(a);
    links.push({sec, a});
  });

  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      const link = links.find(l => l.sec === entry.target);
      if(!link) return;
      if(entry.isIntersecting){
        links.forEach(l => l.a.classList.remove('active'));
        link.a.classList.add('active');
      }
    });
  }, {threshold:0.5});
  sections.forEach(sec => observer.observe(sec));
})();


/* ============================================================
   3D-НАКЛОН ПОЛАРОИДОВ
   ============================================================ */
(function polaroidTilt(){
  const desk = document.getElementById('polaroidDesk');
  if(!desk) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduceMotion) return;

  desk.querySelectorAll('.polaroid').forEach(card=>{
    const baseRotate = card.style.getPropertyValue('--r') || '0deg';
    card.addEventListener('mousemove', (e)=>{
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotate(0deg) scale(1.06) rotateX(${y*-14}deg) rotateY(${x*14}deg)`;
    });
    card.addEventListener('mouseleave', ()=>{
      card.style.transform = '';
    });
  });
})();


/* ============================================================
   ЗВЁЗДНЫЙ ШЛЕЙФ ЗА КУРСОРОМ
   ============================================================ */
(function cursorSparkle(){
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;
  if(reduceMotion || isTouch) return;

  let lastSpawn = 0;
  document.addEventListener('mousemove', (e)=>{
    const now = Date.now();
    if(now - lastSpawn < 45) return;
    lastSpawn = now;
    const dot = document.createElement('span');
    dot.className = 'cursor-sparkle';
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
    document.body.appendChild(dot);
    setTimeout(()=> dot.remove(), 900);
  });
})();



/* ============================================================
   МУЗЕЙ — облако: фото + видео + аудио
   ============================================================ */
(async function museum(){
  const grid=document.getElementById('museumGrid'); if(!grid)return;
  const cfg=window.MUSEUM_CONFIG||{};
  const status=document.getElementById('museumStatus'),statusText=document.getElementById('museumStatusText');
  const addBtn=document.getElementById('museumAddBtn'),refreshBtn=document.getElementById('museumRefreshBtn'),randomBtn=document.getElementById('museumRandomBtn');
  const featureTitle=document.getElementById('museumFeatureTitle'),featureText=document.getElementById('museumFeatureText'),empty=document.getElementById('museumEmpty');
  const addModal=document.getElementById('museumAddModal'),viewModal=document.getElementById('museumViewModal'),addClose=document.getElementById('museumAddClose'),viewClose=document.getElementById('museumViewClose');
  const saveBtn=document.getElementById('entrySaveBtn'),dateInput=document.getElementById('entryDate'),titleInput=document.getElementById('entryTitle'),textInput=document.getElementById('entryText');
  const photosInput=document.getElementById('entryPhotos'),videosInput=document.getElementById('entryVideos'),audioInput=document.getElementById('entryAudio'),preview=document.getElementById('entryPreview');
  const viewContent=document.getElementById('museumViewContent'),importBtn=document.getElementById('museumImportBtn'),importFile=document.getElementById('museumImportFile'),exportBtn=document.getElementById('museumExportBtn'),cloudHint=document.getElementById('cloudHint');
  const BUCKET=cfg.bucket||'museum-media',TABLE='memories',MUSIC_TABLE='music_tracks';
  let cache=localBackupRead(),tempPhotos=[],tempVideos=[],tempAudio=null;
  const MAX_PHOTOS=6,MAX_VIDEOS=3,MAX_VIDEO_MB=250;

  function setStatus(kind,text){status.className='museum-status '+kind;statusText.textContent=text;}
  function normalize(row){return {id:row.id,date:row.date_label||'',title:row.title||'',text:row.body||'',photos:Array.isArray(row.photo_paths)?row.photo_paths:[],videos:Array.isArray(row.video_paths)?row.video_paths:[],audio:row.audio_path||null,createdAt:new Date(row.created_at||Date.now()).getTime(),createdBy:row.created_by||null,cloud:true};}
  async function signed(path,expires=3600){if(!supabaseClient||!path)return null;const {data,error}=await supabaseClient.storage.from(BUCKET).createSignedUrl(path,expires);return error?null:data?.signedUrl||null;}
  async function mediaUrls(paths){return (await Promise.all((paths||[]).map(signed))).filter(Boolean);}
  async function loadCloud(){if(!supabaseClient)return null;const {data,error}=await supabaseClient.from(TABLE).select('id,date_label,title,body,photo_paths,video_paths,audio_path,created_at,created_by').eq('room_id',cfg.museumRoomId).order('created_at',{ascending:false});if(error)throw error;const entries=data.map(normalize);cache=entries;localBackupWrite(entries);return entries;}
  function sorted(a){return [...a].sort((x,y)=>y.createdAt-x.createdAt);}
  function mediaBadge(e){const n=(e.photos?.length||0)+(e.videos?.length||0)+(e.audio?1:0);return n?`<span class="media-badge">${e.photos?.length?`фото ${e.photos.length}`:''}${e.videos?.length?`${e.photos?.length?' · ':''}видео ${e.videos.length}`:''}${e.audio?`${(e.photos?.length||e.videos?.length)?' · ':''}песня`:''}</span>`:'';}
  function render(entries){entries=sorted(entries);grid.innerHTML='';empty.style.display=entries.length?'none':'block';const now=Date.now(),lastVisit=Number(safeGet('ourStory_museum_last_visit')||0);let newCount=0;
    entries.forEach(e=>{const isNew=lastVisit&&e.createdAt>lastVisit;if(isNew)newCount++;const card=document.createElement('article');card.className='museum-card'+(isNew?' is-new':'');
      card.innerHTML=`<div class="museum-card-photo">${e.photos?.length?'<div class="museum-photo-placeholder">фото</div>':''}${e.videos?.length?'<div class="museum-media-corner">video</div>':''}${e.audio?'<div class="museum-audio-corner">♫</div>':''}</div><span class="museum-card-sync">${isNew?'новое · ':''}${e.cloud?'облако':'офлайн'}</span><div class="museum-card-body"><div class="museum-card-date">${escapeHtml(e.date||new Date(e.createdAt).toLocaleDateString('ru-RU'))}</div><div class="museum-card-title">${escapeHtml(e.title||'без названия')}</div><div class="museum-card-text">${escapeHtml(e.text||'')}</div>${mediaBadge(e)}</div>`;
      if(e.photos?.length){const holder=card.querySelector('.museum-card-photo');signed(e.photos[0]).then(u=>{if(u)holder.innerHTML=`<img src="${u}" alt="" loading="lazy">${e.videos?.length?'<div class="museum-media-corner">video</div>':''}${e.audio?'<div class="museum-audio-corner">♫</div>':''}`;});}
      card.addEventListener('click',()=>openView(e.id));grid.appendChild(card);});
    const stats=document.getElementById('museumStats');if(stats){const ms=new Date();ms.setDate(1);ms.setHours(0,0,0,0);const thisMonth=entries.filter(e=>e.createdAt>=ms.getTime()).length;const latest=entries[0]?.createdAt;stats.innerHTML=`<span>${entries.length} ${entries.length===1?'глава':'глав'}</span><span>${thisMonth} в этом месяце</span><span>последняя · ${latest?escapeHtml(new Date(latest).toLocaleDateString('ru-RU',{day:'numeric',month:'long'})):'пока нет'}</span>${newCount?`<span class="new-stat">+${newCount} с прошлого визита</span>`:''}`;}
    const first=entries[0];featureTitle.textContent=first?.title||'здесь пока тихо';featureText.textContent=first?.text||'Добавьте первое воспоминание — и музей начнёт жить.';if(entries.length)safeSet('ourStory_museum_last_visit',String(now));
  }
  async function refresh(){setStatus('','синхронизирую…');try{const cloud=await loadCloud();if(cloud){render(cloud);setStatus('online','облако синхронизировано');}else{cache=localBackupRead();render(cache);setStatus('offline','локальный режим');}}catch(e){console.error(e);cache=localBackupRead();render(cache);setStatus('error','облако недоступно · офлайн-копия');}}
  function resetForm(){dateInput.value='';titleInput.value='';textInput.value='';photosInput.value='';videosInput.value='';audioInput.value='';preview.innerHTML='';tempPhotos=[];tempVideos=[];tempAudio=null;}
  function openAdd(){resetForm();addModal.classList.add('show');}
  function closeAdd(){addModal.classList.remove('show');}
  function previewMedia(){preview.innerHTML='';tempPhotos.forEach(f=>{const u=URL.createObjectURL(f);const img=document.createElement('img');img.src=u;img.onload=()=>URL.revokeObjectURL(u);preview.appendChild(img);});tempVideos.forEach(f=>{const v=document.createElement('video');v.src=URL.createObjectURL(f);v.muted=true;v.controls=true;preview.appendChild(v);});if(tempAudio){const p=document.createElement('span');p.className='preview-audio';p.textContent=`♫ ${tempAudio.name}`;preview.appendChild(p);}}
  photosInput.addEventListener('change',()=>{tempPhotos=Array.from(photosInput.files||[]).slice(0,MAX_PHOTOS);previewMedia();});
  videosInput.addEventListener('change',()=>{tempVideos=Array.from(videosInput.files||[]).slice(0,MAX_VIDEOS);const tooBig=tempVideos.find(f=>f.size>MAX_VIDEO_MB*1024*1024);if(tooBig){alert(`Видео «${tooBig.name}» больше ${MAX_VIDEO_MB} МБ. Выбери файл поменьше.`);tempVideos=tempVideos.filter(f=>f.size<=MAX_VIDEO_MB*1024*1024);videosInput.value='';}previewMedia();});
  audioInput.addEventListener('change',()=>{tempAudio=(audioInput.files||[])[0]||null;previewMedia();});
  async function uploadFile(file,path,contentType){const {error}=await supabaseClient.storage.from(BUCKET).upload(path,file,{contentType:contentType||file.type||'application/octet-stream',upsert:false});if(error)throw error;return path;}
  async function uploadImage(file,path){const blob=await fileToCompressedBlob(file,cfg.imageMaxDimension||1800,cfg.imageQuality||.82);return uploadFile(blob,path,'image/jpeg');}
  async function saveCloud(title,text,date){const id=uid(),photos=[],videos=[],uploaded=[];try{for(let i=0;i<tempPhotos.length;i++){const p=await uploadImage(tempPhotos[i],`${cfg.museumRoomId}/${id}/photos/${Date.now()}-${i}.jpg`);photos.push(p);uploaded.push(p);}for(let i=0;i<tempVideos.length;i++){const p=await uploadFile(tempVideos[i],`${cfg.museumRoomId}/${id}/videos/${Date.now()}-${i}-${safeName(tempVideos[i].name)}`);videos.push(p);uploaded.push(p);}let audio=null;if(tempAudio){audio=await uploadFile(tempAudio,`${cfg.museumRoomId}/${id}/audio/${Date.now()}-${safeName(tempAudio.name)}`,tempAudio.type);uploaded.push(audio);}
      if(!supabaseClient)return {id,date,title,text,photos:[],videos:[],audio:null,createdAt:Date.now(),cloud:false};
      const {data,error}=await supabaseClient.from(TABLE).insert({id,room_id:cfg.museumRoomId,date_label:date,title,body:text,photo_paths:photos,video_paths:videos,audio_path:audio,created_by:currentUser?.id||null}).select().single();if(error)throw error;return normalize(data);
    }catch(e){if(supabaseClient&&uploaded.length)await supabaseClient.storage.from(BUCKET).remove(uploaded).catch(()=>{});throw e;}}
  function safeName(name){return String(name||'file').replace(/[^a-zA-Z0-9._-]+/g,'_').slice(-100);}
  async function openView(id){const e=cache.find(x=>x.id===id);if(!e)return;const [photos,videos,audio]=await Promise.all([mediaUrls(e.photos),mediaUrls(e.videos),signed(e.audio)]);viewContent.innerHTML=`<div class="museum-view-date">${escapeHtml(e.date||new Date(e.createdAt).toLocaleDateString('ru-RU'))}</div><div class="museum-view-title">${escapeHtml(e.title||'без названия')}</div>${photos.length?`<div class="museum-view-photos">${photos.map(u=>`<img src="${u}" alt="" loading="lazy">`).join('')}</div>`:''}${videos.length?`<div class="museum-view-videos">${videos.map(u=>`<video src="${u}" controls playsinline preload="metadata"></video>`).join('')}</div>`:''}${audio?`<div class="museum-view-audio"><span>♫ песня этого события</span><audio src="${audio}" controls preload="metadata"></audio></div>`:''}<div class="museum-view-text">${escapeHtml(e.text||'')}</div><div class="museum-view-actions"><button class="museum-delete-btn" id="museumDeleteBtn">удалить главу</button></div>`;document.getElementById('museumDeleteBtn').addEventListener('click',()=>deleteEntry(e));viewModal.classList.add('show');}
  async function deleteEntry(e){if(!confirm('Удалить эту главу вместе с фото, видео и песней?'))return;try{const paths=[...(e.photos||[]),...(e.videos||[]),...(e.audio?[e.audio]:[])];if(supabaseClient){if(paths.length)await supabaseClient.storage.from(BUCKET).remove(paths);const {error}=await supabaseClient.from(TABLE).delete().eq('id',e.id).eq('room_id',cfg.museumRoomId);if(error)throw error;}cache=cache.filter(x=>x.id!==e.id);localBackupWrite(cache);render(cache);viewModal.classList.remove('show');}catch(err){console.error(err);alert('Не удалось удалить главу. Проверь интернет и попробуй ещё раз.');}}
  saveBtn.addEventListener('click',async()=>{const title=titleInput.value.trim(),text=textInput.value.trim(),date=dateInput.value.trim();if(!title&&!text&&!tempPhotos.length&&!tempVideos.length&&!tempAudio){alert('Добавьте хотя бы заголовок, текст или медиа.');return;}if(!supabaseClient){alert('Облако сейчас не подключено. Для фото, видео и музыки нужен Supabase.');return;}saveBtn.disabled=true;saveBtn.textContent='загружаю…';try{await saveCloud(title,text,date);await refresh();closeAdd();}catch(e){console.error(e);alert(`Не удалось сохранить: ${e.message||'ошибка облака'}`);}finally{saveBtn.disabled=false;saveBtn.textContent='сохранить главу';}});
  randomBtn.addEventListener('click',async()=>{if(cache.length)await openView(cache[Math.floor(Math.random()*cache.length)].id);});refreshBtn.addEventListener('click',refresh);addBtn.addEventListener('click',openAdd);addClose.addEventListener('click',closeAdd);viewClose.addEventListener('click',()=>viewModal.classList.remove('show'));addModal.addEventListener('click',e=>{if(e.target===addModal)closeAdd();});viewModal.addEventListener('click',e=>{if(e.target===viewModal)viewModal.classList.remove('show');});
  exportBtn.addEventListener('click',()=>{const blob=new Blob([JSON.stringify(cache.map(({_signedPhotos,...x})=>x),null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`our-museum-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);});
  importBtn.addEventListener('click',()=>importFile.click());importFile.addEventListener('change',()=>{const f=importFile.files?.[0];if(!f)return;const r=new FileReader();r.onload=async()=>{try{const incoming=JSON.parse(r.result);if(!Array.isArray(incoming))throw new Error('bad format');if(!supabaseClient){alert('Для восстановления в облако сначала подключите Supabase.');return;}let added=0;for(const x of incoming){if(!x?.id||cache.some(e=>e.id===x.id))continue;const {error}=await supabaseClient.from(TABLE).insert({id:x.id,room_id:cfg.museumRoomId,date_label:x.date||'',title:x.title||'',body:x.text||'',photo_paths:Array.isArray(x.photos)?x.photos:[],video_paths:Array.isArray(x.videos)?x.videos:[],audio_path:x.audio||null,created_by:currentUser?.id||null});if(!error)added++;}await refresh();alert(`Восстановление завершено. Добавлено: ${added}.`);}catch(e){console.error(e);alert('Не удалось восстановить резервную копию.');}finally{importFile.value='';}};r.readAsText(f);});
  if(!cfg.enabled)cloudHint.textContent='Облако отключено. Для новых глав с медиа включите Supabase в config.js.';await initCloud();await refresh();
})();

/* ============================================================
   БИБЛИОТЕКА САУНДТРЕКА
   ============================================================ */
(async function musicLibrary(){
  const list=document.getElementById('musicList');if(!list)return;const cfg=window.MUSEUM_CONFIG||{};const addBtn=document.getElementById('musicAddBtn'),modal=document.getElementById('musicAddModal'),close=document.getElementById('musicAddClose'),titleInput=document.getElementById('musicTrackTitle'),artistInput=document.getElementById('musicTrackArtist'),fileInput=document.getElementById('musicTrackFile'),saveBtn=document.getElementById('musicTrackSaveBtn'),empty=document.getElementById('musicEmpty');const TABLE='music_tracks',BUCKET=cfg.bucket||'museum-media';let tracks=[];
  async function signed(path,expires=3600){if(!supabaseClient||!path)return null;const {data,error}=await supabaseClient.storage.from(BUCKET).createSignedUrl(path,expires);return error?null:data?.signedUrl||null;}
  function render(){list.innerHTML='';empty.style.display=tracks.length?'none':'block';tracks.forEach((t,i)=>{const row=document.createElement('div');row.className='music-track';row.innerHTML=`<button class="music-track-play" type="button" aria-label="Играть">${i===0?'▶':'▶'}</button><div class="music-track-info"><strong>${escapeHtml(t.title||'без названия')}</strong><span>${escapeHtml(t.artist||'')}</span></div><button class="music-track-delete" type="button" aria-label="Удалить">×</button>`;row.querySelector('.music-track-play').addEventListener('click',()=>select(t));row.querySelector('.music-track-delete').addEventListener('click',async()=>{if(!confirm('Удалить эту песню из вашего саундтрека?'))return;try{if(supabaseClient){if(t.audio_path)await supabaseClient.storage.from(BUCKET).remove([t.audio_path]);const {error}=await supabaseClient.from(TABLE).delete().eq('id',t.id).eq('room_id',cfg.museumRoomId);if(error)throw error;}tracks=tracks.filter(x=>x.id!==t.id);render();}catch(e){alert('Не удалось удалить трек.');}});list.appendChild(row);});}
  async function select(t){const url=await signed(t.audio_path);if(!url){alert('Не удалось открыть этот трек.');return;}window.dispatchEvent(new CustomEvent('music:select',{detail:{url,title:t.title,artist:t.artist}}));document.querySelectorAll('.music-track').forEach(x=>x.classList.remove('selected'));const row=[...document.querySelectorAll('.music-track')].find(x=>x.querySelector('.music-track-info strong')?.textContent===t.title);row?.classList.add('selected');}
  async function load(){if(!supabaseClient){tracks=[];render();return;}const {data,error}=await supabaseClient.from(TABLE).select('id,title,artist,audio_path,created_at').eq('room_id',cfg.museumRoomId).order('created_at',{ascending:true});if(error){console.error(error);tracks=[];render();return;}tracks=data||[];render();if(tracks[0])select(tracks[0]);}
  addBtn.addEventListener('click',()=>{titleInput.value='';artistInput.value='';fileInput.value='';modal.classList.add('show');});close.addEventListener('click',()=>modal.classList.remove('show'));modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('show');});
  saveBtn.addEventListener('click',async()=>{const title=titleInput.value.trim(),artist=artistInput.value.trim(),file=fileInput.files?.[0];if(!title||!file){alert('Укажи название и выбери аудиофайл.');return;}if(!supabaseClient){alert('Облако не подключено.');return;}saveBtn.disabled=true;saveBtn.textContent='загружаю…';const id=uid(),path=`${cfg.museumRoomId}/music/${id}-${String(file.name).replace(/[^a-zA-Z0-9._-]+/g,'_').slice(-100)}`;try{const {error:upError}=await supabaseClient.storage.from(BUCKET).upload(path,file,{contentType:file.type||'audio/mpeg',upsert:false});if(upError)throw upError;const {data,error}=await supabaseClient.from(TABLE).insert({id,room_id:cfg.museumRoomId,title,artist,audio_path:path,created_by:currentUser?.id||null}).select().single();if(error){await supabaseClient.storage.from(BUCKET).remove([path]);throw error;}tracks.push(data);render();modal.classList.remove('show');await select(data);}catch(e){console.error(e);alert(`Не удалось добавить песню: ${e.message||'ошибка'}`);}finally{saveBtn.disabled=false;saveBtn.textContent='добавить в саундтрек';}});
  await load();
})();