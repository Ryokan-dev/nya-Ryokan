/* ============================================================
   Ryokan — 진입 연출 시퀀스 + 헤더 + 스크롤 등장
   ============================================================ */
(function(){
  const intro = document.getElementById('intro');
  const body  = document.body;

  /* ── 진입 연출 ── */
  function startSequence(){
    if(!intro || intro.dataset.running) return;
    intro.dataset.running = '1';
    intro.classList.add('to-zoom');
    setTimeout(()=> intro.classList.add('to-open'),  1300);
    setTimeout(()=> intro.classList.add('to-bloom'), 2250);
    setTimeout(finish, 3150);
  }
  function finish(){
    intro.classList.add('done');
    body.classList.remove('intro-lock');
    try{ sessionStorage.setItem('ryokanEntered','1'); }catch(e){}
    setTimeout(()=>{ if(intro) intro.style.display='none'; }, 750);
  }
  function skip(){
    if(!intro) return;
    intro.classList.add('done');
    body.classList.remove('intro-lock');
    try{ sessionStorage.setItem('ryokanEntered','1'); }catch(e){}
    setTimeout(()=>{ if(intro) intro.style.display='none'; }, 400);
  }

  if(intro){
    let entered=false;
    try{ entered = sessionStorage.getItem('ryokanEntered')==='1'; }catch(e){}
    if(entered){
      // 같은 세션 재방문 → 연출 생략하고 메인 바로 표시
      intro.style.display='none';
      body.classList.remove('intro-lock');
    }else{
      body.classList.add('intro-lock');
      const enterBtn = document.getElementById('introEnter');
      const wide     = document.getElementById('introWide');
      enterBtn && enterBtn.addEventListener('click', e=>{ e.stopPropagation(); startSequence(); });
      wide && wide.addEventListener('click', startSequence);
      const skipBtn = document.getElementById('introSkip');
      skipBtn && skipBtn.addEventListener('click', e=>{ e.stopPropagation(); skip(); });
      document.addEventListener('keydown', e=>{
        if(intro.classList.contains('done')) return;
        if(e.key==='Enter'||e.key===' ') startSequence();
        if(e.key==='Escape') skip();
      });
    }
  }

  /* ── 입구 다시 보기 ── */
  const replay = document.getElementById('replayIntro');
  replay && replay.addEventListener('click', ()=>{
    try{ sessionStorage.removeItem('ryokanEntered'); }catch(e){}
    location.reload();
  });

  /* ── 세 료칸 탭 전환 ── */
  const rkTabs = [...document.querySelectorAll('.rk-tab')];
  const rkPanels = [...document.querySelectorAll('.rk-panel')];
  function showRk(key){
    rkTabs.forEach(t=>t.classList.toggle('is-active', t.dataset.rk===key));
    rkPanels.forEach(p=>p.classList.toggle('is-active', p.dataset.rk===key));
  }
  rkTabs.forEach(t=>t.addEventListener('click', ()=>showRk(t.dataset.rk)));

  /* ── 헤더: 스크롤 시 솔리드 ── */
  const hd = document.getElementById('hd');
  function onScroll(){ if(hd) hd.classList.toggle('hd--solid', window.scrollY>40); }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ── 스크롤 등장 ── */
  const io = new IntersectionObserver((ents)=>{
    ents.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  }, {threshold:.14, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
})();
