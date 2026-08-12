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
   ВИНИЛ
   ============================================================ */
(function vinyl(){
  const btn = document.getElementById('vinylBtn');
  const disc = document.getElementById('vinylDisc');
  const arm = document.getElementById('vinylArm');
  const audio = document.getElementById('bgm');
  let playing = false;

  btn.addEventListener('click', async ()=>{
    playing = !playing;
    disc.classList.toggle('playing', playing);
    arm.classList.toggle('playing', playing);
    btn.textContent = playing ? 'пауза' : 'включить нашу песню';

    if(playing){
      try{ await audio.play(); }
      catch(err){ /* файла music/song.mp3 ещё нет — просто крутим пластинку без звука */ }
    } else {
      audio.pause();
    }
  });
})();


/* ============================================================
   МИНИ-ИГРА: собери сердца
   ============================================================ */
(function heartsGame(){
  const field = document.getElementById('heartField');
  const counter = document.getElementById('heartsLeft');
  const total = 8;
  let left = total;
  counter.textContent = left;

  for(let i=0;i<total;i++){
    const h = document.createElement('span');
    h.className = 'floating-heart';
    h.textContent = '♥';
    h.style.left = (5 + Math.random()*85) + '%';
    h.style.top = (5 + Math.random()*80) + '%';
    h.style.animationDelay = (Math.random()*3) + 's';
    h.style.color = Math.random() > 0.5 ? '#d4af6a' : '#f3efe6';
    h.addEventListener('click', ()=>{
      if(h.classList.contains('collected')) return;
      h.classList.add('collected');
      left--;
      counter.textContent = left;
    }, {once:true});
    field.appendChild(h);
  }
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
   МУЗЕЙ — облако + офлайн-резерв
   ============================================================ */
(async function museum(){
  const grid=document.getElementById('museumGrid');
  if(!grid) return;

  const cfg=window.MUSEUM_CONFIG || {};
  const status=document.getElementById('museumStatus');
  const statusText=document.getElementById('museumStatusText');
  const addBtn=document.getElementById('museumAddBtn');
  const refreshBtn=document.getElementById('museumRefreshBtn');
  const randomBtn=document.getElementById('museumRandomBtn');
  const featureTitle=document.getElementById('museumFeatureTitle');
  const featureText=document.getElementById('museumFeatureText');
  const empty=document.getElementById('museumEmpty');
  const addModal=document.getElementById('museumAddModal');
  const viewModal=document.getElementById('museumViewModal');
  const addClose=document.getElementById('museumAddClose');
  const viewClose=document.getElementById('museumViewClose');
  const saveBtn=document.getElementById('entrySaveBtn');
  const dateInput=document.getElementById('entryDate');
  const titleInput=document.getElementById('entryTitle');
  const textInput=document.getElementById('entryText');
  const photosInput=document.getElementById('entryPhotos');
  const preview=document.getElementById('entryPreview');
  const viewContent=document.getElementById('museumViewContent');
  const importBtn=document.getElementById('museumImportBtn');
  const importFile=document.getElementById('museumImportFile');
  const exportBtn=document.getElementById('museumExportBtn');
  const cloudHint=document.getElementById('cloudHint');

  let cache=localBackupRead();
  let tempFiles=[];
  const MAX_PHOTOS=6;
  const TABLE='memories';
  const BUCKET=cfg.bucket || 'museum-media';

  function setStatus(kind,text){
    status.className='museum-status '+kind;
    statusText.textContent=text;
  }

  function normalize(row){
    return {
      id:row.id,
      date:row.date_label || '',
      title:row.title || '',
      text:row.body || '',
      photos:Array.isArray(row.photo_paths)?row.photo_paths:[],
      createdAt:new Date(row.created_at || Date.now()).getTime(),
      createdBy:row.created_by || null,
      cloud:true
    };
  }

  async function photoUrls(entry){
    if(!supabaseClient || !entry.photos?.length) return [];
    const out=[];
    for(const path of entry.photos){
      const {data,error}=await supabaseClient.storage.from(BUCKET).createSignedUrl(path,3600);
      if(!error && data?.signedUrl) out.push(data.signedUrl);
    }
    return out;
  }

  async function loadCloud(){
    if(!supabaseClient) return null;
    const {data,error}=await supabaseClient
      .from(TABLE)
      .select('id,date_label,title,body,photo_paths,created_at,created_by')
      .eq('room_id',cfg.museumRoomId)
      .order('created_at',{ascending:false});
    if(error) throw error;
    const entries=data.map(normalize);
    cache=entries;
    localBackupWrite(entries);
    return entries;
  }

  function sorted(entries){ return [...entries].sort((a,b)=>b.createdAt-a.createdAt); }

  function render(entries){
    entries=sorted(entries);
    grid.innerHTML='';
    empty.style.display=entries.length?'none':'block';

    entries.forEach(entry=>{
      const card=document.createElement('article');
      card.className='museum-card';
      const cover=entry._signedPhotos?.[0] || '';
      card.innerHTML=`
        <div class="museum-card-photo">${cover?`<img src="${cover}" alt="" loading="lazy">`:'<span class="museum-no-photo">✦</span>'}</div>
        <span class="museum-card-sync">${entry.cloud?'облако':'офлайн'}</span>
        <div class="museum-card-body">
          <div class="museum-card-date">${escapeHtml(entry.date || new Date(entry.createdAt).toLocaleDateString('ru-RU'))}</div>
          <div class="museum-card-title">${escapeHtml(entry.title || 'без названия')}</div>
          <div class="museum-card-text">${escapeHtml(entry.text || '')}</div>
        </div>`;
      card.addEventListener('click',()=>openView(entry.id));
      grid.appendChild(card);
    });

    const first=entries[0];
    if(first){
      featureTitle.textContent=first.title || 'новая глава';
      featureText.textContent=first.text || 'Здесь уже есть ваш новый кадр.';
    }else{
      featureTitle.textContent='здесь пока тихо';
      featureText.textContent='Добавьте первое воспоминание — и музей начнёт жить.';
    }
  }

  async function attachSignedUrls(entries){
    if(!supabaseClient) return entries;
    return Promise.all(entries.map(async e=>{
      e._signedPhotos=await photoUrls(e);
      return e;
    }));
  }

  async function refresh(){
    setStatus('','синхронизирую…');
    try{
      const cloudEntries=await loadCloud();
      if(cloudEntries){
        cache=await attachSignedUrls(cloudEntries);
        render(cache);
        setStatus('online','облако синхронизировано');
      }else{
        cache=localBackupRead();
        render(cache);
        setStatus('offline','локальный режим');
      }
    }catch(error){
      console.error(error);
      cache=localBackupRead();
      render(cache);
      setStatus('error','облако недоступно · офлайн-копия');
    }
  }

  function resetForm(){
    dateInput.value=''; titleInput.value=''; textInput.value='';
    photosInput.value=''; preview.innerHTML=''; tempFiles=[];
  }

  function openAdd(){ resetForm(); addModal.classList.add('show'); }
  function closeAdd(){ addModal.classList.remove('show'); }

  async function openView(id){
    const entry=cache.find(x=>x.id===id);
    if(!entry) return;
    const urls=entry._signedPhotos?.length?entry._signedPhotos:await photoUrls(entry);
    viewContent.innerHTML=`
      <div class="museum-view-date">${escapeHtml(entry.date || new Date(entry.createdAt).toLocaleDateString('ru-RU'))}</div>
      <div class="museum-view-title">${escapeHtml(entry.title || 'без названия')}</div>
      ${urls.length?`<div class="museum-view-photos">${urls.map(u=>`<img src="${u}" alt="" loading="lazy">`).join('')}</div>`:''}
      <div class="museum-view-text">${escapeHtml(entry.text || '')}</div>
      <div class="museum-view-actions">
        <button class="museum-delete-btn" id="museumDeleteBtn">удалить</button>
      </div>`;
    document.getElementById('museumDeleteBtn').addEventListener('click',()=>deleteEntry(entry));
    viewModal.classList.add('show');
  }

  async function deleteEntry(entry){
    if(!confirm('Удалить это воспоминание из облака?')) return;
    try{
      if(supabaseClient){
        if(entry.photos?.length){
          await supabaseClient.storage.from(BUCKET).remove(entry.photos);
        }
        const {error}=await supabaseClient.from(TABLE).delete().eq('id',entry.id).eq('room_id',cfg.museumRoomId);
        if(error) throw error;
      }
      cache=cache.filter(e=>e.id!==entry.id);
      localBackupWrite(cache);
      render(cache);
      viewModal.classList.remove('show');
    }catch(error){
      console.error(error);
      alert('Не удалось удалить запись. Проверь интернет и попробуй ещё раз.');
    }
  }

  photosInput.addEventListener('change',async()=>{
    tempFiles=Array.from(photosInput.files).slice(0,MAX_PHOTOS);
    preview.innerHTML='<span class="scene-note">сжимаю фото…</span>';
    try{
      const thumbs=await Promise.all(tempFiles.map(f=>fileToCompressedBlob(f,cfg.imageMaxDimension||1800,cfg.imageQuality||.82).then(blob=>URL.createObjectURL(blob))));
      preview.innerHTML='';
      thumbs.forEach(url=>{
        const img=document.createElement('img'); img.src=url; preview.appendChild(img);
      });
    }catch(error){
      preview.innerHTML='<span class="scene-note">не удалось подготовить фото</span>';
    }
  });

  async function saveCloud(title,text,date){
    const id=uid();
    const paths=[];
    try{
      if(tempFiles.length && supabaseClient){
        for(let i=0;i<tempFiles.length;i++){
          const file=tempFiles[i];
          const blob=await fileToCompressedBlob(file,cfg.imageMaxDimension||1800,cfg.imageQuality||.82);
          const path=`${cfg.museumRoomId}/${id}/${Date.now()}-${i}.jpg`;
          const {error}=await supabaseClient.storage.from(BUCKET).upload(path,blob,{contentType:'image/jpeg',upsert:false});
          if(error) throw error;
          paths.push(path);
        }
      }

      if(supabaseClient){
        const {data,error}=await supabaseClient.from(TABLE).insert({
          id,room_id:cfg.museumRoomId,date_label:date,title,body:text,photo_paths:paths,created_by:currentUser?.id||null
        }).select().single();
        if(error) throw error;
        return normalize(data);
      }

      const local={id,date,title,text,photos:[],createdAt:Date.now(),cloud:false};
      cache=[local,...cache]; localBackupWrite(cache); return local;
    }catch(error){
      // если облачная запись не завершилась после части загрузок — пытаемся почистить хвост
      if(supabaseClient && paths.length){
        await supabaseClient.storage.from(BUCKET).remove(paths).catch(()=>{});
      }
      throw error;
    }
  }

  saveBtn.addEventListener('click',async()=>{
    const title=titleInput.value.trim(), text=textInput.value.trim(), date=dateInput.value.trim();
    if(!title && !text && !tempFiles.length){ alert('Добавьте хотя бы заголовок, текст или фото.'); return; }
    saveBtn.disabled=true; saveBtn.textContent='сохраняю…';
    try{
      const entry=await saveCloud(title,text,date);
      if(entry){
        if(supabaseClient){
          const cloud=await loadCloud();
          cache=await attachSignedUrls(cloud);
        }
        render(cache);
        closeAdd();
      }
    }catch(error){
      console.error(error);
      alert('Не удалось сохранить. Проверьте облако и интернет. Ваша форма не потеряна.');
    }finally{
      saveBtn.disabled=false; saveBtn.textContent='сохранить в музей';
    }
  });

  randomBtn.addEventListener('click',async()=>{
    if(!cache.length) return;
    const entry=cache[Math.floor(Math.random()*cache.length)];
    await openView(entry.id);
  });

  refreshBtn.addEventListener('click',refresh);
  addBtn.addEventListener('click',openAdd);
  addClose.addEventListener('click',closeAdd);
  viewClose.addEventListener('click',()=>viewModal.classList.remove('show'));
  addModal.addEventListener('click',e=>{if(e.target===addModal)closeAdd();});
  viewModal.addEventListener('click',e=>{if(e.target===viewModal)viewModal.classList.remove('show');});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeAdd();viewModal.classList.remove('show');}});

  exportBtn.addEventListener('click',()=>{
    const plain=cache.map(({_signedPhotos,...entry})=>entry);
    const blob=new Blob([JSON.stringify(plain,null,2)],{type:'application/json'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob);
    a.download=`our-museum-backup-${new Date().toISOString().slice(0,10)}.json`; a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  });

  importBtn.addEventListener('click',()=>importFile.click());
  importFile.addEventListener('change',()=>{
    const file=importFile.files?.[0]; if(!file)return;
    const reader=new FileReader();
    reader.onload=async()=>{
      try{
        const incoming=JSON.parse(reader.result);
        if(!Array.isArray(incoming)) throw new Error('bad format');
        if(!supabaseClient){
          const existingIds=new Set(cache.map(x=>x.id));
          cache=[...cache,...incoming.filter(x=>x?.id&&!existingIds.has(x.id))];
          localBackupWrite(cache); render(cache);
          alert(`Восстановлено: ${incoming.length} записей.`);
          return;
        }
        let added=0;
        for(const x of incoming){
          if(!x?.id || cache.some(e=>e.id===x.id)) continue;
          const {error}=await supabaseClient.from(TABLE).insert({
            id:x.id,room_id:cfg.museumRoomId,date_label:x.date||'',title:x.title||'',body:x.text||'',photo_paths:Array.isArray(x.photos)?x.photos:[],created_by:currentUser?.id||null
          });
          if(!error) added++;
        }
        await refresh();
        alert(`Импорт завершён. Добавлено: ${added}.`);
      }catch(error){
        console.error(error); alert('Не удалось восстановить резервную копию.');
      }finally{ importFile.value=''; }
    };
    reader.readAsText(file);
  });

  if(!cfg.enabled){
    cloudHint.textContent='Сейчас включён локальный режим. Чтобы музей был общим для двух устройств, заполни config.js и SQL из папки setup.';
  }

  await initCloud();
  await refresh();
})();
