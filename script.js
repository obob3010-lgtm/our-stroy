/* Our Story Museum V6 — rebuilt from scratch */
(() => {
  'use strict';

  const CFG = window.MUSEUM_CONFIG || {};
  const TZ = 'Asia/Tashkent';
  const ROOM = CFG.museumRoomId || 'replace-with-your-room-id';
  const BUCKET = CFG.bucket || 'museum-media';
  const TABLE = 'memories';
  const MUSIC_TABLE = 'music_tracks';
  const MAX_IMAGES = Number(CFG.maxImagesPerPost || 6);
  const MAX_VIDEOS = Number(CFG.maxVideosPerPost || 3);
  const MAX_VIDEO_BYTES = Number(CFG.maxVideoMB || 120) * 1024 * 1024;
  const MAX_AUDIO_BYTES = Number(CFG.maxAudioMB || 60) * 1024 * 1024;
  const IMAGE_MAX = Number(CFG.imageMaxDimension || 2000);
  const IMAGE_QUALITY = Number(CFG.imageQuality || .84);
  const BACKUP_KEY = 'ourStory_v6_backup';
  const LAST_VISIT_KEY = 'ourStory_v6_last_visit';
  const UNLOCK_KEY = 'ourStory_v6_unlocked';

  let supabaseClient = null;
  let currentUser = null;
  let memories = [];
  let musicTracks = [];
  let currentTrack = -1;

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  function safeGet(k){ try{return localStorage.getItem(k)}catch{return null} }
  function safeSet(k,v){ try{localStorage.setItem(k,v)}catch{} }
  function backupRead(){ try{return JSON.parse(localStorage.getItem(BACKUP_KEY)||'[]')}catch{return []} }
  function backupWrite(v){ try{localStorage.setItem(BACKUP_KEY,JSON.stringify(v))}catch{} }

  // ---------- Atmosphere: fixed to Tashkent UTC+5 ----------
  const seasonNames = {winter:'зима',spring:'весна',summer:'лето',autumn:'осень'};
  const timeNames = {predawn:'предрассвет',dawn:'рассвет',morning:'утро',day:'день',golden:'золотой час',sunset:'закат',twilight:'сумерки',night:'ночь'};
  const glyphs = {
    winter:['❄','·','✦','❅'], spring:['✿','·','❀','·'], summer:['·','✦','·','˚'], autumn:['•','❧','·','❧']
  };
  function tashkentNow(){
    const parts = new Intl.DateTimeFormat('en-GB',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(new Date());
    const p={}; for(const x of parts) p[x.type]=x.value;
    return {year:+p.year,month:+p.month,day:+p.day,hour:+p.hour,minute:+p.minute,second:+p.second};
  }
  function seasonOf(m){ return [12,1,2].includes(m)?'winter':[3,4,5].includes(m)?'spring':[6,7,8].includes(m)?'summer':'autumn'; }
  function timeOf(h,m){ const x=h+m/60; if(x<5)return'predawn'; if(x<6)return'dawn'; if(x<8)return'morning'; if(x<17)return'day'; if(x<18.5)return'golden'; if(x<20.5)return'sunset'; if(x<22)return'twilight'; return'night'; }
  function applyAtmosphere(){
    const n=tashkentNow();
    const sm=String(CFG.seasonMode||'auto').toLowerCase();
    const tm=String(CFG.timeMode||'auto').toLowerCase();
    const aliases={dusk:'sunset','pre-dawn':'predawn','golden-hour':'golden','late-night':'night'};
    const season=['winter','spring','summer','autumn'].includes(sm)?sm:seasonOf(n.month);
    const time=aliases[tm]||(['predawn','dawn','morning','day','golden','sunset','twilight','night'].includes(tm)?tm:timeOf(n.hour,n.minute));
    const b=document.body;
    const seasons=['winter','spring','summer','autumn'];
    const times=['predawn','dawn','morning','day','golden','sunset','twilight','night'];
    b.classList.remove(...seasons.map(x=>'season-'+x),...times.map(x=>'time-'+x));
    b.classList.add('season-'+season,'time-'+time);
    b.dataset.season=season;
    b.dataset.time=time;
    const badge=$('seasonBadge');
    if(badge) badge.textContent=`${seasonNames[season]} · ${timeNames[time]} · ${String(n.hour).padStart(2,'0')}:${String(n.minute).padStart(2,'0')}`;
    const decor=$('seasonDecor'); if(decor){
      const key=season+'-'+time;
      if(decor.dataset.key!==key){
        decor.dataset.key=key; decor.replaceChildren();
        const count={predawn:10,dawn:14,morning:8,day:5,golden:13,sunset:17,twilight:21,night:28}[time]||10;
        for(let i=0;i<count;i++){
          const el=document.createElement('span');
          el.className='season-particle';
          el.textContent=glyphs[season][i%glyphs[season].length];
          el.style.left=(Math.random()*100)+'vw';
          el.style.top=(-10-Math.random()*25)+'vh';
          el.style.animationDelay=(Math.random()*10)+'s';
          el.style.animationDuration=(9+Math.random()*16)+'s';
          el.style.setProperty('--drift',(Math.random()*120-60)+'px');
          decor.appendChild(el);
        }
      }
    }
  }

  // ---------- Unlock ----------
  function initGate(){
    const gate=$('gate'), intro=$('introType');
    const unlocked=safeGet(UNLOCK_KEY)==='1';
    const text='для тебя'; let i=0;
    const type=()=>{ if(!intro)return; intro.textContent=text.slice(0,i++); if(i<=text.length) setTimeout(type,70); };
    type();
    function open(){ safeSet(UNLOCK_KEY,'1'); document.body.classList.remove('locked'); gate?.setAttribute('aria-hidden','true'); }
    function reset(){ try{localStorage.removeItem(UNLOCK_KEY)}catch{}; location.reload(); }
    $('introBtn')?.addEventListener('click',open); $('gateResetBtn')?.addEventListener('click',reset);
    if(unlocked) open();
  }

  // ---------- Reveal / nav / interactive polish ----------
  function initReveal(){
    const els=[...document.querySelectorAll('.reveal')];
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
    els.forEach(e=>io.observe(e));
  }
  function initSideNav(){
    const nav=$('sideNav'); if(!nav)return; const sections=[...document.querySelectorAll('section[data-nav]')];
    nav.innerHTML=sections.map((s,i)=>`<button type="button" data-target="${s.id}" aria-label="${esc(s.dataset.nav)}" title="${esc(s.dataset.nav)}"></button>`).join('');
    nav.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.target)?.scrollIntoView({behavior:'smooth'})));
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){nav.querySelectorAll('button').forEach(x=>x.classList.remove('active'));nav.querySelector(`[data-target="${e.target.id}"]`)?.classList.add('active')}}),{threshold:.45});
    sections.forEach(s=>io.observe(s));
  }
  function initPolaroids(){
    document.querySelectorAll('.polaroid').forEach(card=>{
      let drag=false, ox=0, oy=0, startL='', startT='';
      card.addEventListener('pointerdown',e=>{drag=true;card.setPointerCapture(e.pointerId);ox=e.clientX;oy=e.clientY;startL=card.style.left;startT=card.style.top;card.style.zIndex='20'});
      card.addEventListener('pointermove',e=>{if(!drag)return;const desk=card.parentElement.getBoundingClientRect();const r=card.getBoundingClientRect();let left=parseFloat(startL)||0,top=parseFloat(startT)||0;const dx=e.clientX-ox,dy=e.clientY-oy;card.style.left=`${((left/100)*desk.width+dx)/desk.width*100}%`;card.style.top=`${((top/100)*desk.height+dy)/desk.height*100}%`});
      const up=()=>{drag=false;card.style.zIndex='';}; card.addEventListener('pointerup',up);card.addEventListener('pointercancel',up);
    });
  }
  function initHearts(){
    const field=$('heartField'); if(!field)return; let left=8; const count=$('heartsLeft');
    const spawn=()=>{field.innerHTML=''; left=8;if(count)count.textContent=left; for(let i=0;i<8;i++){const h=document.createElement('button');h.className='heart';h.type='button';h.textContent='♥';h.style.left=(8+Math.random()*84)+'%';h.style.top=(10+Math.random()*70)+'%';h.style.animationDelay=(Math.random()*1.5)+'s';h.addEventListener('click',()=>{h.remove();left--;if(count)count.textContent=left;if(left===0)confetti();});field.appendChild(h);}}; spawn();
  }
  function confetti(){const c=$('confetti'),ctx=c?.getContext('2d');if(!c||!ctx)return;c.width=innerWidth;c.height=innerHeight;const bits=Array.from({length:120},()=>({x:innerWidth/2,y:innerHeight/2,vx:(Math.random()-.5)*10,vy:-Math.random()*10-3,r:2+Math.random()*4,l:80+Math.random()*80}));let f=0;const tick=()=>{ctx.clearRect(0,0,c.width,c.height);bits.forEach(b=>{b.x+=b.vx;b.y+=b.vy;b.vy+=.18;b.l--;ctx.fillStyle=`hsla(${Math.random()*50+20},70%,70%,${Math.max(0,b.l/120)})`;ctx.fillRect(b.x,b.y,b.r,b.r)});if(++f<120)requestAnimationFrame(tick);else ctx.clearRect(0,0,c.width,c.height)};tick();}
  function initReason(){const r=$('reasonText'),b=$('reasonBtn'),c=$('reasonCount');const arr=['потому что ты умеешь делать обычный день особенным.','потому что рядом с тобой я становлюсь мягче.','потому что у нас слишком много смешных историй, чтобы остановиться.','потому что ты — человек, к которому хочется возвращаться.','потому что мне нравится наше «мы».'];let n=0;b?.addEventListener('click',()=>{r.textContent=arr[n++%arr.length];c.textContent=n});}
  function initLetter(){const target=$('letterType');if(!target)return;const text='я хочу, чтобы здесь однажды накопилось столько наших историй, что мы будем часами листать их и смеяться над собой. этот музей — не про идеальные моменты. он про настоящие.';let i=0;const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){io.disconnect();const step=()=>{target.textContent=text.slice(0,i++);if(i<=text.length)setTimeout(step,28)};step();}},{threshold:.4});io.observe(target);}
  function initGift(){const box=$('giftBox'),content=$('giftContent'),hint=$('giftHint');box?.addEventListener('click',()=>{box.classList.toggle('open');content?.classList.toggle('show');if(hint)hint.textContent=content?.classList.contains('show')?'коробка открыта':'нажми на коробку';});}

  // ---------- Supabase ----------
  async function initCloud(){
    if(!CFG.enabled || !window.supabase) return;
    const url=CFG.supabaseUrl||''; const key=CFG.supabaseAnonKey||CFG.supabaseKey||CFG.publishableKey||'';
    if(!url || !key || url.includes('YOUR-PROJECT') || key.includes('YOUR_')) return;
    try{ supabaseClient=window.supabase.createClient(url,key); const {data,error}=await supabaseClient.auth.getSession(); if(error)throw error; currentUser=data.session?.user||null; if(!currentUser){const r=await supabaseClient.auth.signInAnonymously();if(r.error)throw r.error;currentUser=r.data.user;} }
    catch(e){console.error('Cloud init failed',e);supabaseClient=null;}
  }

  function normalizeMemory(row){return{ id:row.id,roomId:row.room_id,date:row.date_label||'',title:row.title||'',text:row.body||'',photos:Array.isArray(row.photo_paths)?row.photo_paths:[],videos:Array.isArray(row.video_paths)?row.video_paths:[],audioPath:row.audio_path||'',createdAt:new Date(row.created_at||Date.now()).getTime(),createdBy:row.created_by||null,cloud:true };
  }
  async function signed(path,expires=3600){ if(!supabaseClient||!path)return null; const {data,error}=await supabaseClient.storage.from(BUCKET).createSignedUrl(path,expires); return error?null:data?.signedUrl||null; }
  async function mediaUrls(entry){const [photos,videos,audio]=await Promise.all([Promise.all((entry.photos||[]).map(p=>signed(p))),Promise.all((entry.videos||[]).map(p=>signed(p))),signed(entry.audioPath)]);return{photos:photos.filter(Boolean),videos:videos.filter(Boolean),audio};}
  async function loadMemories(){
    if(!supabaseClient) return backupRead().map(x=>({...x,cloud:false}));
    const {data,error}=await supabaseClient.from(TABLE).select('id,room_id,date_label,title,body,photo_paths,video_paths,audio_path,created_at,created_by').eq('room_id',ROOM).order('created_at',{ascending:false});
    if(error)throw error; const out=data.map(normalizeMemory); for(const e of out)e.media=await mediaUrls(e); backupWrite(out); return out;
  }
  async function deleteStorage(paths){if(!supabaseClient||!paths?.length)return;await supabaseClient.storage.from(BUCKET).remove(paths).catch(()=>{});}
  async function compressImage(file){
    const img=new Image(); const url=URL.createObjectURL(file); try{img.src=url;await new Promise((res,rej)=>{img.onload=res;img.onerror=rej});const scale=Math.min(1,IMAGE_MAX/Math.max(img.naturalWidth,img.naturalHeight));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,canvas.width,canvas.height);return await new Promise((res,rej)=>canvas.toBlob(b=>b?res(b):rej(new Error('image compression failed')),'image/jpeg',IMAGE_QUALITY));} finally{URL.revokeObjectURL(url);}
  }
  function setProgress(el,text){if(el)el.textContent=text||'';}
  async function uploadFile(path,file,contentType){if(!supabaseClient)throw new Error('Облако не настроено');const {error}=await supabaseClient.storage.from(BUCKET).upload(path,file,{contentType:contentType||file.type||'application/octet-stream',upsert:false});if(error)throw error;return path;}

  // ---------- Museum UI ----------
  async function initMuseum(){
    const grid=$('museumGrid'); if(!grid)return;
    let lastVisit=Number(safeGet(LAST_VISIT_KEY)||0);
    const modal=$('museumAddModal'), viewModal=$('museumViewModal');
    const photosInput=$('entryPhotos'), videosInput=$('entryVideos'), audioInput=$('entryAudio'), preview=$('entryPreview'), progress=$('entryProgress');

    function status(kind,text){const x=$('museumStatus');x.className='museum-status '+kind;$('museumStatusText').textContent=text;}
    function updateStats(){
      const stats=$('museumStats'); const monthStart=new Date();monthStart.setDate(1);monthStart.setHours(0,0,0,0);const thisMonth=memories.filter(e=>e.createdAt>=monthStart.getTime()).length;const latest=memories[0]?.createdAt;const latestText=latest?new Date(latest).toLocaleDateString('ru-RU',{day:'numeric',month:'long'}):'пока нет';const fresh=lastVisit?memories.filter(e=>e.createdAt>lastVisit).length:0;stats.innerHTML=`<span>${memories.length} ${memories.length===1?'глава':'глав'}</span><span>${thisMonth} в этом месяце</span><span>последняя · ${esc(latestText)}</span>${fresh?`<span>+${fresh} новых</span>`:''}`;
      const f=memories[0];$('museumFeatureTitle').textContent=f?.title||'здесь пока тихо';$('museumFeatureText').textContent=f?.text||'Добавьте первое воспоминание — и музей начнёт жить.';
    }
    function render(){
      grid.innerHTML='';$('museumEmpty').style.display=memories.length?'none':'block';let freshCount=0;
      for(const e of memories){const isNew=lastVisit&&e.createdAt>lastVisit;if(isNew)freshCount++;const c=document.createElement('article');c.className='museum-card'+(isNew?' is-new':'');const cover=e.media?.photos?.[0]||'';const badges=[e.photos.length?`фото ${e.photos.length}`:'',e.videos.length?`видео ${e.videos.length}`:'',e.audioPath?'♫ песня':''].filter(Boolean).join(' · ');c.innerHTML=`<div class="museum-card-photo">${cover?`<img src="${cover}" alt="" loading="lazy">`:'<span class="museum-no-photo">✦</span>'}</div><span class="museum-card-sync">${isNew?'новое · ':''}${badges||'глава'}</span><div class="museum-card-body"><div class="museum-card-date">${esc(e.date||new Date(e.createdAt).toLocaleDateString('ru-RU'))}</div><div class="museum-card-title">${esc(e.title||'без названия')}</div><div class="museum-card-text">${esc(e.text||'')}</div></div>`;c.addEventListener('click',()=>openView(e));grid.appendChild(c)}
      updateStats(); if(memories.length)safeSet(LAST_VISIT_KEY,String(Date.now()));
    }
    async function refresh(){status('','синхронизирую…');try{memories=await loadMemories();render();status('online','облако синхронизировано')}catch(e){console.error(e);memories=backupRead().map(x=>({...x,cloud:false}));render();status('error','облако недоступно · резервная копия')}}
    function openAdd(){['entryDate','entryTitle','entryText'].forEach(id=>$(id).value='');photosInput.value='';videosInput.value='';audioInput.value='';preview.innerHTML='';progress.textContent='';modal.classList.add('show');}
    async function previewUploads(){preview.innerHTML='';const photos=[...photosInput.files].slice(0,MAX_IMAGES), videos=[...videosInput.files].slice(0,MAX_VIDEOS), audio=audioInput.files[0];for(const f of photos){const u=URL.createObjectURL(f);const el=document.createElement('img');el.src=u;el.onload=()=>URL.revokeObjectURL(u);preview.appendChild(el)}for(const f of videos){const u=URL.createObjectURL(f);const el=document.createElement('video');el.src=u;el.controls=true;el.muted=true;el.onload=()=>URL.revokeObjectURL(u);preview.appendChild(el)}if(audio){const chip=document.createElement('div');chip.className='upload-file-chip';chip.textContent=`♫ ${audio.name}`;preview.appendChild(chip)}}
    photosInput.addEventListener('change',previewUploads);videosInput.addEventListener('change',previewUploads);audioInput.addEventListener('change',previewUploads);
    async function saveEntry(){
      const title=$('entryTitle').value.trim(), text=$('entryText').value.trim(), date=$('entryDate').value.trim();const photos=[...photosInput.files].slice(0,MAX_IMAGES),videos=[...videosInput.files].slice(0,MAX_VIDEOS),audio=audioInput.files[0];
      if(!title&&!text&&!photos.length&&!videos.length&&!audio){alert('Добавьте хотя бы что-нибудь в новую главу.');return}
      for(const v of videos)if(v.size>MAX_VIDEO_BYTES){alert(`Видео «${v.name}» слишком большое. Лимит этой версии: ${CFG.maxVideoMB||120} МБ.`);return}
      if(audio&&audio.size>MAX_AUDIO_BYTES){alert(`Песня слишком большая. Лимит этой версии: ${CFG.maxAudioMB||60} МБ.`);return}
      const btn=$('entrySaveBtn');btn.disabled=true;btn.textContent='сохраняю…';const id=uid();const paths={photos:[],videos:[],audio:''};
      try{
        if(!supabaseClient){throw new Error('Музей не подключён к облаку. Проверь config.js.')}
        for(let i=0;i<photos.length;i++){setProgress(progress,`фото ${i+1}/${photos.length}`);const blob=await compressImage(photos[i]);paths.photos.push(await uploadFile(`${ROOM}/memories/${id}/photo-${i+1}.jpg`,blob,'image/jpeg'))}
        for(let i=0;i<videos.length;i++){setProgress(progress,`видео ${i+1}/${videos.length}`);const ext=(videos[i].name.split('.').pop()||'mp4').toLowerCase().replace(/[^a-z0-9]/g,'');paths.videos.push(await uploadFile(`${ROOM}/memories/${id}/video-${i+1}.${ext}`,videos[i],videos[i].type||'video/mp4'))}
        if(audio){setProgress(progress,'загружаю песню…');const ext=(audio.name.split('.').pop()||'mp3').toLowerCase().replace(/[^a-z0-9]/g,'');paths.audio=await uploadFile(`${ROOM}/memories/${id}/event-song.${ext}`,audio,audio.type||'audio/mpeg')}
        setProgress(progress,'создаю запись…');const {data,error}=await supabaseClient.from(TABLE).insert({id,room_id:ROOM,date_label:date,title,body:text,photo_paths:paths.photos,video_paths:paths.videos,audio_path:paths.audio,created_by:currentUser?.id||null}).select().single();if(error)throw error;
        modal.classList.remove('show');memories=[normalizeMemory(data),...memories];for(const e of memories)if(e.id===id)e.media=await mediaUrls(e);backupWrite(memories);render();setProgress(progress,'');
      }catch(e){console.error(e);await deleteStorage([...paths.photos,...paths.videos,...(paths.audio?[paths.audio]:[])]);alert('Не удалось сохранить главу. Проверяй подключение Supabase и попробуй ещё раз.\n\n'+(e.message||''));}
      finally{btn.disabled=false;btn.textContent='сохранить главу';}
    }
    async function openView(e){
      const media=e.media||await mediaUrls(e);e.media=media;const c=$('museumViewContent');c.innerHTML=`<div class="museum-view-date">${esc(e.date||new Date(e.createdAt).toLocaleDateString('ru-RU'))}</div><div class="museum-view-title">${esc(e.title||'без названия')}</div>${media.photos.length?`<div class="museum-view-photos">${media.photos.map(u=>`<img src="${u}" alt="" loading="lazy">`).join('')}</div>`:''}${media.videos.length?`<div class="museum-view-videos">${media.videos.map(u=>`<video src="${u}" controls playsinline preload="metadata"></video>`).join('')}</div>`:''}<div class="museum-view-text">${esc(e.text||'')}</div>${media.audio?`<div class="event-song"><strong>♫ песня этого события</strong><audio src="${media.audio}" controls preload="metadata"></audio></div>`:''}<div class="museum-view-actions"><button class="museum-delete-btn" id="museumDeleteBtn">удалить главу</button></div>`;c.querySelector('#museumDeleteBtn')?.addEventListener('click',async()=>{if(!confirm('Удалить главу, видео, фотографии и песню?'))return;try{await deleteStorage([...e.photos,...e.videos,...(e.audioPath?[e.audioPath]:[])]);if(supabaseClient){const {error}=await supabaseClient.from(TABLE).delete().eq('id',e.id).eq('room_id',ROOM);if(error)throw error}memories=memories.filter(x=>x.id!==e.id);backupWrite(memories);render();viewModal.classList.remove('show')}catch(err){console.error(err);alert('Не удалось удалить главу.')}});viewModal.classList.add('show');}

    $('museumAddBtn').addEventListener('click',openAdd);$('museumRefreshBtn').addEventListener('click',refresh);$('museumRandomBtn').addEventListener('click',()=>memories.length&&openView(memories[Math.floor(Math.random()*memories.length)]));$('entrySaveBtn').addEventListener('click',saveEntry);
    $('museumExportBtn').addEventListener('click',()=>{const data=memories.map(({media,...e})=>e);const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));a.download=`our-story-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)});
    $('museumImportBtn').addEventListener('click',()=>$('museumImportFile').click());$('museumImportFile').addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;try{const incoming=JSON.parse(await f.text());if(!Array.isArray(incoming))throw new Error('bad backup');if(!supabaseClient)throw new Error('Для импорта в общий музей нужен Supabase');let added=0;for(const x of incoming){if(!x?.id||memories.some(m=>m.id===x.id))continue;const payload={id:x.id,room_id:ROOM,date_label:x.date||'',title:x.title||'',body:x.text||'',photo_paths:Array.isArray(x.photos)?x.photos:[],video_paths:Array.isArray(x.videos)?x.videos:[],audio_path:x.audioPath||'',created_by:currentUser?.id||null};const {error}=await supabaseClient.from(TABLE).insert(payload);if(!error)added++}await refresh();alert(`Импорт завершён. Добавлено: ${added}.`)}catch(err){console.error(err);alert('Не удалось восстановить резервную копию.\n'+(err.message||''))}finally{e.target.value=''}});
    document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.close)?.classList.remove('show')));
    [modal,viewModal].forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('show')}));
    await refresh();
  }

  // ---------- Soundtrack ----------
  async function initSoundtrack(){
    const audio=$('musicAudio'),disc=$('vinylDisc'),arm=$('vinylArm');
    const title=$('musicTitle'),artist=$('musicArtist'),note=$('musicNote'),status=$('musicStatus'),progress=$('musicProgress'),cur=$('musicCurrent'),dur=$('musicDuration'),list=$('musicTrackList');
    let muted=false;
    function fmt(sec){if(!Number.isFinite(sec))return'0:00';const m=Math.floor(sec/60),s=Math.floor(sec%60).toString().padStart(2,'0');return`${m}:${s}`}
    function renderList(){list.innerHTML='';musicTracks.forEach((t,i)=>{const b=document.createElement('button');b.className='music-track-item'+(i===currentTrack?' active':'');b.type='button';b.innerHTML=`<span>${String(i+1).padStart(2,'0')}</span><b>${esc(t.title||'трек')}</b><small>${esc(t.artist||'')}</small>`;b.addEventListener('click',()=>loadTrack(i,true));list.appendChild(b)});}
    async function loadCloudTracks(){if(!supabaseClient)return[];const {data,error}=await supabaseClient.from(MUSIC_TABLE).select('id,room_id,title,artist,note,audio_path,created_at,created_by').eq('room_id',ROOM).order('created_at',{ascending:true});if(error)throw error;const out=[];for(const r of data){const u=await signed(r.audio_path,7200);if(u)out.push({...r,url:u})}return out;}
    async function loadTrack(i,autoplay=false){if(!musicTracks.length){title.textContent='пока пусто';artist.textContent='добавьте первую песню';return}currentTrack=(i+musicTracks.length)%musicTracks.length;const t=musicTracks[currentTrack];audio.pause();audio.src=t.url;audio.load();title.textContent=t.title||'без названия';artist.textContent=t.artist||'исполнитель неизвестен';note.textContent=t.note||'ваш личный виниловый архив';renderList();status.textContent=autoplay?'запускаю…':'выберите ▶';if(autoplay){try{await audio.play()}catch{status.textContent='нажми ▶ — браузер ждёт взаимодействия'}}}
    function setPlaying(){document.body.classList.add('playing');$('musicPlay').textContent='Ⅱ';status.textContent='сейчас играет'}function setPaused(){document.body.classList.remove('playing');$('musicPlay').textContent='▶'}
    audio.addEventListener('loadedmetadata',()=>dur.textContent=fmt(audio.duration));audio.addEventListener('timeupdate',()=>{cur.textContent=fmt(audio.currentTime);progress.value=audio.duration?(audio.currentTime/audio.duration*100):0});audio.addEventListener('play',setPlaying);audio.addEventListener('pause',setPaused);audio.addEventListener('ended',()=>musicTracks.length&&loadTrack(currentTrack+1,true));
    $('musicPlay').addEventListener('click',async()=>{if(!musicTracks.length){alert('Пока нет песен. Добавьте первую.');return}if(audio.paused){try{await audio.play()}catch{status.textContent='не удалось воспроизвести трек'}}else audio.pause()});$('musicPrev').addEventListener('click',()=>musicTracks.length&&loadTrack(currentTrack-1,true));$('musicNext').addEventListener('click',()=>musicTracks.length&&loadTrack(currentTrack+1,true));$('musicMute').addEventListener('click',()=>{muted=!muted;audio.muted=muted;$('musicMute').textContent=muted?'○':'◉'});progress.addEventListener('input',()=>{if(audio.duration)audio.currentTime=(Number(progress.value)/100)*audio.duration});

    $('musicAddBtn').addEventListener('click',()=>{$('musicAddModal').classList.add('show');$('trackTitle').value='';$('trackArtist').value='';$('trackNote').value='';$('trackFileInput').value='';$('trackProgress').textContent=''});
    $('trackSaveBtn').addEventListener('click',async()=>{const f=$('trackFileInput').files?.[0],t=$('trackTitle').value.trim(),a=$('trackArtist').value.trim(),n=$('trackNote').value.trim();if(!f||!t){alert('Укажи название и выбери песню.');return}if(f.size>MAX_AUDIO_BYTES){alert(`Файл слишком большой. Лимит: ${CFG.maxAudioMB||60} МБ.`);return}if(!supabaseClient){alert('Сначала подключи Supabase в config.js.');return}const btn=$('trackSaveBtn');btn.disabled=true;btn.textContent='загружаю…';const id=uid();const ext=(f.name.split('.').pop()||'mp3').toLowerCase().replace(/[^a-z0-9]/g,'');const path=`${ROOM}/music/${id}.${ext}`;try{setProgress($('trackProgress'),'загружаю аудио…');await uploadFile(path,f,f.type||'audio/mpeg');const {data,error}=await supabaseClient.from(MUSIC_TABLE).insert({id,room_id:ROOM,title:t,artist:a,note:n,audio_path:path,created_by:currentUser?.id||null}).select().single();if(error)throw error;const url=await signed(path,7200);musicTracks.push({...data,url});currentTrack=musicTracks.length-1;renderList();await loadTrack(currentTrack,false);$('musicAddModal').classList.remove('show')}catch(e){console.error(e);await deleteStorage([path]);alert('Не удалось добавить песню.\n'+(e.message||''))}finally{btn.disabled=false;btn.textContent='загрузить в саундтрек';$('trackProgress').textContent=''}});

    try{musicTracks=await loadCloudTracks();}catch(e){console.error(e);status.textContent='не удалось загрузить облачный саундтрек'}
    if(!musicTracks.length && Array.isArray(CFG.musicTracks))musicTracks=CFG.musicTracks.filter(x=>x?.url).map((x,i)=>({...x,id:`local-${i}`}));
    renderList();if(musicTracks.length)await loadTrack(0,false);else{title.textContent='пока пусто';artist.textContent='добавьте первую песню';status.textContent='саундтрек готов к первой главе'}
  }

  // ---------- Boot ----------
  function bindGlobalModalClose(){document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.modal.show').forEach(m=>m.classList.remove('show'))});}
  function init(){applyAtmosphere();setInterval(applyAtmosphere,15000);initGate();initReveal();initSideNav();initPolaroids();initHearts();initReason();initLetter();initGift();bindGlobalModalClose();(async()=>{await initCloud();await initMuseum();await initSoundtrack()})();}
  init();
})();
