(function(){
// Hangul -> IPA (approximate: basic liaison, coda neutralisation, tensification after obstruent coda, nasal assimilation omitted)
const L=['k','k͈','n','t','t͈','ɾ','m','p','p͈','s','s͈','','tɕ','t͈ɕ','tɕʰ','kʰ','tʰ','pʰ','h'];
const V=['a','ɛ','ja','jɛ','ʌ','e','jʌ','je','o','wa','wɛ','ø','jo','u','wʌ','we','wi','ju','ɯ','ɯi','i'];
const T=['','k','k','k','n','n','n','t','l','k','m','p','l','l','p','l','m','p','p','t','t','ŋ','t','t','k','t','p','t'];
const TF=['','k','k','ks','n','nt','nh','t','l','lk','lm','lp','ls','lt','lp','lh','m','p','ps','s','s','ŋ','tɕ','tɕ','kʰ','tʰ','pʰ','h'];
function koIPA(txt){
  const syl=[];const out=[];
  for(const ch of txt){const c=ch.codePointAt(0);
    if(c>=0xAC00&&c<=0xD7A3){const i=c-0xAC00;syl.push({l:Math.floor(i/588),v:Math.floor(i%588/28),t:i%28})}
    else syl.push({raw:ch});}
  for(let k=0;k<syl.length;k++){const s=syl[k];
    if(s.raw!==undefined){out.push(s.raw===' '?' ':s.raw);continue}
    let onset=L[s.l];const prev=syl[k-1];
    // liaison: previous coda moves to this onset when this onset is silent (ㅇ)
    let carried='';
    if(prev&&prev.t&&s.l===11&&!prev.raw){carried=TF[prev.t].slice(-1)==='ŋ'?'':TF[prev.t];}
    // intervocalic voicing of plain stops
    if(prev&&!prev.raw&&!prev.t&&['k','t','p','tɕ'].includes(onset)){onset={k:'g',t:'d',p:'b',tɕ:'dʑ'}[onset]}
    // tensification after obstruent coda
    if(prev&&!prev.raw&&['k','t','p'].includes(T[prev.t])&&['k','t','p','s','tɕ'].includes(L[s.l]==='tɕ'?'tɕ':L[s.l])){onset={k:'k͈',t:'t͈',p:'p͈',s:'s͈',tɕ:'t͈ɕ'}[L[s.l]]||onset}
    const nextT=syl[k+1]&&!syl[k+1].raw&&syl[k+1].l===11&&s.t&&s.t!==21;
    let coda=s.t?(nextT?'':T[s.t].replace('l','l')):'';
    if(s.l===11&&carried)onset=carried;
    out.push(onset+V[s.v]+coda);}
  return out.join('').replace(/ɯi/g,'ɯi').replace(/͈ɕ/g,'͈ɕ');
}

window.koIPA=koIPA})();
