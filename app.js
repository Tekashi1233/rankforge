var $=function(i){return document.getElementById(i)};
$('mb').onclick=function(){$('nl').classList.toggle('open')};
var ck=$('ck');try{if(!localStorage.getItem('ck'))ck.style.display='flex'}catch(x){ck.style.display='flex'}
$('cka').onclick=function(){ck.style.display='none';try{localStorage.setItem('ck','1')}catch(x){}};
