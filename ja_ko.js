// Japanese romaji -> Hangul approximation (for CHIMERA's Korean "Sing" front-end). Long vowels are shortened; pitch accent ignored.
(function(){
const LEAD=['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const VOW=['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
const TAIL=['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const C={k:'ㅋ',g:'ㄱ',s:'ㅅ',z:'ㅈ',j:'ㅈ',t:'ㅌ',d:'ㄷ',n:'ㄴ',h:'ㅎ',f:'ㅎ',b:'ㅂ',p:'ㅍ',m:'ㅁ',r:'ㄹ',w:'ㅇ',y:'ㅇ','':'ㅇ',sh:'ㅅ',ch:'ㅊ',ts:'ㅊ'};
const V={a:'ㅏ',i:'ㅣ',u:'ㅜ',e:'ㅔ',o:'ㅗ'};
const Y={a:'ㅑ',u:'ㅠ',o:'ㅛ'};
function comp(c,v,t){return String.fromCharCode(0xAC00+LEAD.indexOf(c)*588+VOW.indexOf(v)*28+TAIL.indexOf(t||''))}
function parse(word){const out=[];let i=0;const w=word;
 while(i<w.length){const rest=w.slice(i);let m;
  if((m=rest.match(/^(shi|chi|tsu|fu|ji)/))){const x=m[1];out.push({shi:['ㅅ','ㅣ'],chi:['ㅊ','ㅣ'],tsu:['ㅊ','ㅡ'],fu:['ㅎ','ㅜ'],ji:['ㅈ','ㅣ']}[x]);i+=x.length;continue}
  if((m=rest.match(/^(sh|ch|j)([auo])/))){out.push([C[m[1]],Y[m[2]]==='ㅑ'&&m[1]==='j'?'ㅏ':(m[1]==='j'?V[m[2]]:Y[m[2]])]);i+=m[0].length;continue}
  if((m=rest.match(/^([kgnhmrbp])y([auo])/))){out.push([C[m[1]],Y[m[2]]]);i+=m[0].length;continue}
  if((m=rest.match(/^([kgsztdnhfbpmryw]?)([aiueo])/))){const c=m[1],v=m[2];let cons=C[c];let vow=V[v];
    if(c==='y'){vow=({a:'ㅑ',u:'ㅠ',o:'ㅛ',i:'ㅣ',e:'ㅖ'})[v]}
    if(c==='w'&&v==='a'){cons='ㅇ';vow='ㅘ'}
    if(c==='w'&&v==='o'){cons='ㅇ';vow='ㅗ'}
    out.push([cons,vow]);i+=m[0].length;continue}
  if(rest[0]==='n'||rest[0]==='m'){out.push({tail:'ㄴ'});i++;continue}
  if(/^([kstp])\1/.test(rest)){out.push({tail:'ㅅ'});i++;continue}
  i++;}
 return out}
function jaHangul(roman){
 const clean=roman.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z\s]/g,' ').replace(/\s+/g,' ').trim();
 return clean.split(' ').map(word=>{const toks=parse(word);const syl=[];for(const t of toks){if(t.tail){if(syl.length&&!syl[syl.length-1].t)syl[syl.length-1].t=t.tail;else syl.push({c:'ㅇ',v:'ㅡ'})}else syl.push({c:t[0],v:t[1],t:''})}
  return syl.map(s=>comp(s.c,s.v,s.t)).join('')}).join(' ')}
window.jaHangul=jaHangul;
})();
