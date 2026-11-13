/* Lara Almeida — modelo demonstrativo da Guará Agency.
   Interações originais inspiradas em referência de layout. Nenhum dado enviado a serviços externos. */
(() => {
  'use strict';
  const $ = (s,r=document) => r.querySelector(s);
  const $$ = (s,r=document) => [...r.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav = $('#site-nav'), menuBtn = $('#menu-btn'), mobileMenu = $('#mobile-nav'), progress = $('#nav-progress');
  let lastY=window.scrollY, queued=false;
  function navScroll(){
    const y=window.scrollY, max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    nav.classList.toggle('scrolled',y>45);
    if(y>200&&!mobileMenu.classList.contains('open')&&y>lastY+6)nav.classList.add('hide-away');
    else if(y<lastY-6||y<100)nav.classList.remove('hide-away');
    progress.style.width=(Math.max(0,Math.min(1,y/max))*100)+'%';
    lastY=y;queued=false;
  }
  window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(navScroll)}},{passive:true});
  navScroll();
  function setMenu(open){
    mobileMenu.classList.toggle('open',open);
    mobileMenu.inert=!open;
    menuBtn.setAttribute('aria-expanded',String(open));
    menuBtn.querySelector('.menu-label').textContent=open?'Fechar':'Menu';
    document.body.style.overflow=open?'hidden':'';
    nav.classList.remove('hide-away');
  }
  menuBtn.addEventListener('click',()=>setMenu(!mobileMenu.classList.contains('open')));
  $$('#mobile-nav a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  window.addEventListener('resize',()=>{if(innerWidth>860)setMenu(false)},{passive:true});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mobileMenu.classList.contains('open')){setMenu(false);menuBtn.focus()}});

  // Scroll-based reveals respecting users who request reduced motion
  const reveal=$$('.reveal');
  if('IntersectionObserver' in window&&!reduce){
    const observer=new IntersectionObserver((entries,obs)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.add('in-view');obs.unobserve(entry.target)}
      });
    },{threshold:.08,rootMargin:'0px 0px -60px 0px'});
    reveal.forEach((el,i)=>observer.observe(el));
  }else reveal.forEach(el=>el.classList.add('in-view'));

  // 24 slim, gently animated slats, rendered without canvas, requests or timers
  const wall=$('#slat-wall');
  for(let i=0;i<24;i++){
    const slat=document.createElement('span');
    slat.className='slat';
    slat.style.setProperty('--xp',(i*100/23).toFixed(2)+'%');
    slat.style.setProperty('--delay',(-i*167)+'ms');
    slat.style.setProperty('--dx',(i%2===0?4:-5)+'px');
    wall.appendChild(slat);
  }

  // Original three-tab interactive information showcase
  const content=[
    {
      title:'Consultoria Preventiva',
      meta:'Organização documental e orientação para clínicas',
      desc:'Exame das rotinas profissionais, dos contratos e dos registros para identificar pontos de atenção antes da ocorrência de disputas.',
      items:['Contratos com profissionais e prestadores','Termos de ciência e consentimento','Fluxos de prontuários e documentação','Revisão de comunicações institucionais'],
      visual:'prevent',
      panel:'ROTINAS PREVENTIVAS',
      label:'Consultório e clínica',
      rows:[['Contratos','Conferência'],['Consentimento','Revisão'],['Documentos','Organização'],['Publicidade','Orientação']],
      bg:'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1100&q=70'
    },
    {
      title:'Processos ético-profissionais',
      meta:'Análise de sindicâncias e procedimentos disciplinares',
      desc:'Exame da comunicação recebida, dos elementos documentais e dos prazos para definir quais medidas cabem ao caso.',
      items:['Leitura de intimações e notificações','Organização de documentos e manifestações','Acompanhamento de procedimentos no conselho','Orientação sobre recursos pertinentes'],
      visual:'defense',
      panel:'MAPA DE ACOMPANHAMENTO',
      label:'Etapas do procedimento',
      rows:[['Comunicação','Recebida'],['Análise inicial','Em curso'],['Manifestação','A definir'],['Andamento','Acompanhar']],
      bg:'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1100&q=70'
    },
    {
      title:'Responsabilidade Civil Médica',
      meta:'Demandas relacionadas à prestação de cuidados de saúde',
      desc:'Leitura dos documentos e do histórico do atendimento para avaliar fatos, possíveis responsabilidades e meios de manifestação.',
      items:['Avaliação de documentação clínica','Orientação em ações indenizatórias','Acompanhamento de provas e perícias','Exame de alternativas legais aplicáveis'],
      visual:'civil',
      panel:'ANÁLISE DO CASO',
      label:'Documentos e contexto',
      rows:[['Prontuário','Analisar'],['Linha do tempo','Reunir'],['Documentação','Conferir'],['Estratégia','Delimitar']],
      bg:'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=1100&q=70'
    }
  ];
  const tabs=$$('.area-tabs [role=tab]'),panel=$('#area-panel'),feature=$('.area-feature');
  let areaIndex=0;
  function escape(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]))}
  function setArea(i){
    areaIndex=(i+content.length)%content.length;
    const t=content[areaIndex];
    tabs.forEach((tab,j)=>{
      tab.setAttribute('aria-selected',String(j===areaIndex));
      tab.tabIndex=j===areaIndex?0:-1;
    });
    panel.setAttribute('aria-labelledby','tab-'+areaIndex);
    $('#area-count').textContent=String(areaIndex+1).padStart(2,'0')+' // 03';
    $('#area-heading').textContent=t.title;
    $('#area-meta').textContent=t.meta;
    $('#area-desc').textContent=t.desc;
    $('#area-list').innerHTML=t.items.map(item=>'<li>'+escape(item)+'</li>').join('');
    $('#area-bg').style.backgroundImage='url("'+t.bg+'")';
    $('#area-visual-overlay').innerHTML='<div class="visual-sheet"><div class="sheet-head"><span>↗ '+escape(t.panel)+'</span><span>☰</span></div><h4>'+escape(t.label)+'</h4><p class="sheet-kicker">ACOMPANHAMENTO · MODELO CONCEITUAL</p><div class="sheet-rows">'+t.rows.map(row=>'<div class="sheet-row"><span>'+escape(row[0])+'</span><i>'+escape(row[1])+'</i></div>').join('')+'</div><div class="sheet-progress"><span></span></div><div class="sheet-bubble"><span>VISÃO EXEMPLIFICATIVA</span><span>0'+(areaIndex+1)+' / 03</span></div></div>';
  }
  tabs.forEach((tab,i)=>{
    tab.addEventListener('click',()=>setArea(i));
    tab.addEventListener('keydown',e=>{
      let next=null;
      if(e.key==='ArrowRight')next=i+1;
      else if(e.key==='ArrowLeft')next=i-1;
      else if(e.key==='Home')next=0;
      else if(e.key==='End')next=content.length-1;
      if(next!==null){e.preventDefault();setArea(next);tabs[areaIndex].focus()}
    });
  });
  setArea(0);

  // Methodology cards: one highlighted at a time
  const methodSteps=$$('.method-step');
  function selectMethod(active){
    methodSteps.forEach(el=>{const on=el===active;el.classList.toggle('active',on);el.setAttribute('aria-pressed',String(on))});
  }
  methodSteps.forEach(step=>{
    step.setAttribute('role','button');
    step.setAttribute('aria-pressed',String(step.classList.contains('active')));
    step.addEventListener('click',()=>selectMethod(step));
    step.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();selectMethod(step)}});
  });

  // Flex-grow horizontal accordion with keyboard and mobile support
  const difPanels=$$('.dif-panel');
  function expandDifference(target){
    difPanels.forEach(p=>{
      const active=p===target;
      p.classList.toggle('expanded',active);
      p.setAttribute('aria-expanded',String(active));
      const symbol=$('.dif-top>span',p);
      if(symbol)symbol.textContent=active?'⊗':'⊕';
    });
  }
  difPanels.forEach((p,i)=>{
    p.addEventListener('click',()=>expandDifference(p));
    p.addEventListener('keydown',e=>{
      if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();const x=difPanels[(i+1)%difPanels.length];expandDifference(x);x.focus()}
      if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();const x=difPanels[(i+difPanels.length-1)%difPanels.length];expandDifference(x);x.focus()}
    });
  });

  // Contact: vertical bars rise when first visible
  const bars=$('#contact-bars');
  for(let i=0;i<50;i++){
    let v=((i*7+17)%20)/20;
    const h=13+Math.floor((Math.sin(i*.73)*.5+.5)*75 + v*14);
    const bar=document.createElement('span');
    bar.style.setProperty('--h',Math.min(100,h)+'%');
    bar.style.setProperty('--delay',(i*24)+'ms');
    bars.appendChild(bar);
  }
  if('IntersectionObserver' in window&&!reduce){
    const barObs=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){bars.classList.add('is-visible');barObs.disconnect()}}),{threshold:.1});
    barObs.observe(bars);
  }else bars.classList.add('is-visible');

  // Demonstrative form: no API calls, cookies, tracking or server action
  const form=$('#contact-form'),success=$('#form-success'),region=$('#form-region'),error=$('#form-error');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    let firstBad=null;
    $$('[required]',form).forEach(input=>{
      const bad=!input.checkValidity()||!String(input.value||'').trim();
      input.setAttribute('aria-invalid',String(bad));
      if(bad&&!firstBad)firstBad=input;
    });
    if(firstBad){error.hidden=false;firstBad.focus();return}
    error.hidden=true;
    region.hidden=true;
    success.hidden=false;
    success.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});
  });
  $$('input,select,textarea',form).forEach(el=>el.addEventListener('input',()=>{
    if(el.checkValidity())el.removeAttribute('aria-invalid');
    error.hidden=true;
  }));
  $('#form-reset').addEventListener('click',()=>{
    form.reset();
    success.hidden=true;
    region.hidden=false;
    $$('[aria-invalid]',form).forEach(el=>el.removeAttribute('aria-invalid'));
    $('input',form)?.focus();
  });

  // Clock: only a timezone display, unrelated to office hours
  const clock=$('#footer-clock');
  const formatter=new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',hour:'2-digit',minute:'2-digit',hour12:false});
  function updateClock(){clock.textContent=formatter.format(new Date())}
  updateClock();
  setInterval(updateClock,45000);

  // Progressive enhancement for external imagery
  document.addEventListener('error',e=>{
    const img=e.target;
    if(!(img instanceof HTMLImageElement)||img.dataset.fallback)return;
    img.dataset.fallback='true';
    img.style.opacity='.25';
  },true);
})();
