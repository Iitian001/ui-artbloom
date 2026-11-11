var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t,t.exports),e=null),t.exports),s=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},c=(n,r,o)=>(o=n==null?{}:e(i(n)),s(r||!n||!n.__esModule||!a.call(n,`default`)?t(o,`default`,{value:n,enumerable:!0}):o,n));(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function l(e){if(e===void 0)throw ReferenceError(`this hasn't been initialised - super() hasn't been called`);return e}function u(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e.__proto__=t}var d={autoSleep:120,force3D:`auto`,nullTargetWarn:1,units:{lineHeight:``}},f={duration:.5,overwrite:!1,delay:0},p,m,h,g=1e8,_=1/g,v=Math.PI*2,y=v/4,b=0,x=Math.sqrt,S=Math.cos,C=Math.sin,w=function(e){return typeof e==`string`},T=function(e){return typeof e==`function`},E=function(e){return typeof e==`number`},D=function(e){return e===void 0},O=function(e){return typeof e==`object`},k=function(e){return e!==!1},A=function(){return typeof window<`u`},j=function(e){return T(e)||w(e)},M=typeof ArrayBuffer==`function`&&ArrayBuffer.isView||function(){},N=Array.isArray,P=/random\([^)]+\)/g,F=/,\s*/g,I=/(?:-?\.?\d|\.)+/gi,ee=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,L=/[-+=.]*\d+[.e-]*\d*[a-z%]*/g,te=/[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,ne=/[+-]=-?[.\d]+/,R=/[^,'"\[\]\s]+/gi,re=/^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,z,ie,ae,oe,B={},se={},ce,V=function(e){return(se=Ne(e,B))&&$n},le=function(e,t){return console.warn(`Invalid property`,e,`set to`,t,`Missing plugin? gsap.registerPlugin()`)},ue=function(e,t){return!t&&console.warn(e)},de=function(e,t){return e&&(B[e]=t)&&se&&(se[e]=t)||B},fe=function(){return 0},pe={suppressEvents:!0,isStart:!0,kill:!1},me={suppressEvents:!0,kill:!1},he={suppressEvents:!0},ge={},H=[],_e={},ve,U={},W={},ye=30,G=[],K=``,be=function(e){var t=e[0],n,r;if(O(t)||T(t)||(e=[e]),!(n=(t._gsap||{}).harness)){for(r=G.length;r--&&!G[r].targetTest(t););n=G[r]}for(r=e.length;r--;)e[r]&&(e[r]._gsap||(e[r]._gsap=new ln(e[r],n)))||e.splice(r,1);return e},xe=function(e){return e._gsap||be(gt(e))[0]._gsap},Se=function(e,t,n){return(n=e[t])&&T(n)?e[t]():D(n)&&e.getAttribute&&e.getAttribute(t)||n},Ce=function(e,t){return(e=e.split(`,`)).forEach(t)||e},q=function(e){return Math.round(e*1e5)/1e5||0},we=function(e){return Math.round(e*1e7)/1e7||0},J=function(e,t){var n=t.charAt(0),r=parseFloat(t.substr(2));return e=parseFloat(e),n===`+`?e+r:n===`-`?e-r:n===`*`?e*r:e/r},Te=function(e,t){for(var n=t.length,r=0;e.indexOf(t[r])<0&&++r<n;);return r<n},Ee=function(){var e=H.length,t=H.slice(0),n,r;for(_e={},H.length=0,n=0;n<e;n++)r=t[n],r&&r._lazy&&(r.render(r._lazy[0],r._lazy[1],!0)._lazy=0)},De=function(e){return!!(e._initted||e._startAt||e.add)},Oe=function(e,t,n,r){H.length&&!m&&Ee(),e.render(t,n,r||!!(m&&t<0&&De(e))),H.length&&!m&&Ee()},ke=function(e){var t=parseFloat(e);return(t||t===0)&&(e+``).match(R).length<2?t:w(e)?e.trim():e},Ae=function(e){return e},je=function(e,t){for(var n in t)n in e||(e[n]=t[n]);return e},Me=function(e){return function(t,n){for(var r in n)r in t||r===`duration`&&e||r===`ease`||(t[r]=n[r])}},Ne=function(e,t){for(var n in t)e[n]=t[n];return e},Pe=function e(t,n){for(var r in n)r!==`__proto__`&&r!==`constructor`&&r!==`prototype`&&(t[r]=O(n[r])?e(t[r]||(t[r]={}),n[r]):n[r]);return t},Fe=function(e,t){var n={},r;for(r in e)r in t||(n[r]=e[r]);return n},Ie=function(e){var t=e.parent||z,n=e.keyframes?Me(N(e.keyframes)):je;if(k(e.inherit))for(;t;)n(e,t.vars.defaults),t=t.parent||t._dp;return e},Le=function(e,t){for(var n=e.length,r=n===t.length;r&&n--&&e[n]===t[n];);return n<0},Re=function(e,t,n,r,i){n===void 0&&(n=`_first`),r===void 0&&(r=`_last`);var a=e[r],o;if(i)for(o=t[i];a&&a[i]>o;)a=a._prev;return a?(t._next=a._next,a._next=t):(t._next=e[n],e[n]=t),t._next?t._next._prev=t:e[r]=t,t._prev=a,t.parent=t._dp=e,t},ze=function(e,t,n,r){n===void 0&&(n=`_first`),r===void 0&&(r=`_last`);var i=t._prev,a=t._next;i?i._next=a:e[n]===t&&(e[n]=a),a?a._prev=i:e[r]===t&&(e[r]=i),t._next=t._prev=t.parent=null},Be=function(e,t){e.parent&&(!t||e.parent.autoRemoveChildren)&&e.parent.remove&&e.parent.remove(e),e._act=0},Ve=function(e,t){if(e&&(!t||t._end>e._dur||t._start<0))for(var n=e;n;)n._dirty=1,n=n.parent;return e},He=function(e){for(var t=e.parent;t&&t.parent;)t._dirty=1,t.totalDuration(),t=t.parent;return e},Ue=function(e,t,n,r){return e._startAt&&(m?e._startAt.revert(me):e.vars.immediateRender&&!e.vars.autoRevert||e._startAt.render(t,!0,r))},We=function e(t){return!t||t._ts&&e(t.parent)},Ge=function(e){return e._repeat?Ke(e._tTime,e=e.duration()+e._rDelay)*e:0},Ke=function(e,t){var n=Math.floor(e=we(e/t));return e&&n===e?n-1:n},qe=function(e,t){return(e-t._start)*t._ts+(t._ts>=0?0:t._dirty?t.totalDuration():t._tDur)},Je=function(e){return e._end=we(e._start+(e._tDur/Math.abs(e._ts||e._rts||_)||0))},Ye=function(e,t){var n=e._dp;return n&&n.smoothChildTiming&&e._ts&&(e._start=we(n._time-(e._ts>0?t/e._ts:((e._dirty?e.totalDuration():e._tDur)-t)/-e._ts)),Je(e),n._dirty||Ve(n,e)),e},Xe=function(e,t){var n;if((t._time||!t._dur&&t._initted||t._start<e._time&&(t._dur||!t.add))&&(n=qe(e.rawTime(),t),(!t._dur||ut(0,t.totalDuration(),n)-t._tTime>_)&&t.render(n,!0)),Ve(e,t)._dp&&e._initted&&e._time>=e._dur&&e._ts){if(e._dur<e.duration())for(n=e;n._dp;)n.rawTime()>=0&&n.totalTime(n._tTime),n=n._dp;e._zTime=-_}},Ze=function(e,t,n,r){return t.parent&&Be(t),t._start=we((E(n)?n:!n&&tt(t)&&(!e._last||e._last._start>=e._time)?e._last?e._last._start:e._time:n||e!==z?st(e,n,t):e._time)+t._delay),t._end=we(t._start+(t.totalDuration()/Math.abs(t.timeScale())||0)),Re(e,t,`_first`,`_last`,e._sort?`_start`:0),tt(t)||(e._recent=t),r||Xe(e,t),e._ts<0&&Ye(e,e._tTime),e},Qe=function(e,t){return(B.ScrollTrigger||le(`scrollTrigger`,t))&&B.ScrollTrigger.create(t,e)},$e=function(e,t,n,r,i){if(vn(e,t,i),!e._initted)return 1;if(!n&&e._pt&&!m&&(e._dur&&e.vars.lazy!==!1||!e._dur&&e.vars.lazy)&&ve!==Jt.frame)return H.push(e),e._lazy=[i,r],1},et=function e(t){var n=t.parent;return n&&n._ts&&n._initted&&!n._lock&&(n.rawTime()<0||e(n))},tt=function(e){var t=e.data;return t===`isFromStart`||t===`isStart`},nt=function(e,t,n,r){var i=e.ratio,a=t<0||!t&&(!e._start&&et(e)&&(e._initted||!tt(e))||(e._ts<0||e._dp._ts<0)&&!tt(e))?0:1,o=e._rDelay,s=0,c,l,u;if(o&&e._repeat&&(s=ut(0,e._tDur,t),l=Ke(s,o),e._yoyo&&l&1&&(a=1-a),l!==Ke(e._tTime,o)&&(i=1-a,e.vars.repeatRefresh&&e._initted&&e.invalidate())),a!==i||m||r||e._zTime===_||!t&&e._zTime){if(!e._initted&&$e(e,t,r,n,s))return;for(u=e._zTime,e._zTime=t||(n?_:0),n||=t&&!u,e.ratio=a,e._from&&(a=1-a),e._time=0,e._tTime=s,c=e._pt;c;)c.r(a,c.d),c=c._next;t<0&&Ue(e,t,n,!0),e._onUpdate&&!n&&Nt(e,`onUpdate`),s&&e._repeat&&!n&&e.parent&&Nt(e,`onRepeat`),(t>=e._tDur||t<0)&&e.ratio===a&&(a&&Be(e,1),!n&&!m&&(Nt(e,a?`onComplete`:`onReverseComplete`,!0),e._prom&&e._prom()))}else e._zTime||=t},rt=function(e,t,n){var r;if(n>t)for(r=e._first;r&&r._start<=n;){if(r.data===`isPause`&&r._start>t)return r;r=r._next}else for(r=e._last;r&&r._start>=n;){if(r.data===`isPause`&&r._start<t)return r;r=r._prev}},it=function(e,t,n,r){var i=e._repeat,a=we(t)||0,o=e._tTime/e._tDur;return o&&!r&&(e._time*=a/e._dur),e._dur=a,e._tDur=i?i<0?1e10:we(a*(i+1)+e._rDelay*i):a,o>0&&!r&&Ye(e,e._tTime=e._tDur*o),e.parent&&Je(e),n||Ve(e.parent,e),e},at=function(e){return e instanceof dn?Ve(e):it(e,e._dur)},ot={_start:0,endTime:fe,totalDuration:fe},st=function e(t,n,r){var i=t.labels,a=t._recent||ot,o=t.duration()>=g?a.endTime(!1):t._dur,s,c,l;return w(n)&&(isNaN(n)||n in i)?(c=n.charAt(0),l=n.substr(-1)===`%`,s=n.indexOf(`=`),c===`<`||c===`>`?(s>=0&&(n=n.replace(/=/,``)),(c===`<`?a._start:a.endTime(a._repeat>=0))+(parseFloat(n.substr(1))||0)*(l?(s<0?a:r).totalDuration()/100:1)):s<0?(n in i||(i[n]=o),i[n]):(c=parseFloat(n.charAt(s-1)+n.substr(s+1)),l&&r&&(c=c/100*(N(r)?r[0]:r).totalDuration()),s>1?e(t,n.substr(0,s-1),r)+c:o+c)):n==null?o:+n},ct=function(e,t,n){var r=E(t[1]),i=(r?2:1)+(e<2?0:1),a=t[i],o,s;if(r&&(a.duration=t[1]),a.parent=n,e){for(o=a,s=n;s&&!(`immediateRender`in o);)o=s.vars.defaults||{},s=k(s.vars.inherit)&&s.parent;a.immediateRender=k(o.immediateRender),e<2?a.runBackwards=1:a.startAt=t[i-1]}return new Tn(t[0],a,t[i+1])},lt=function(e,t){return e||e===0?t(e):t},ut=function(e,t,n){return n<e?e:n>t?t:n},dt=function(e,t){return!w(e)||!(t=re.exec(e))?``:t[1]},ft=function(e,t,n){return lt(n,function(n){return ut(e,t,n)})},pt=[].slice,mt=function(e,t){return e&&O(e)&&`length`in e&&(!t&&!e.length||e.length-1 in e&&O(e[0]))&&!e.nodeType&&e!==ie},ht=function(e,t,n){return n===void 0&&(n=[]),e.forEach(function(e){var r;return w(e)&&!t||mt(e,1)?(r=n).push.apply(r,gt(e)):n.push(e)})||n},gt=function(e,t,n){return h&&!t&&h.selector?h.selector(e):w(e)&&!n&&(ae||!Yt())?pt.call((t||oe).querySelectorAll(e),0):N(e)?ht(e,n):mt(e)?pt.call(e,0):e?[e]:[]},_t=function(e){return e=gt(e)[0]||ue(`Invalid scope`)||{},function(t){var n=e.current||e.nativeElement||e;return gt(t,n.querySelectorAll?n:n===e?ue(`Invalid scope`)||oe.createElement(`div`):e)}},vt=function(e){return e.sort(function(){return .5-Math.random()})},yt=function(e){if(T(e))return e;var t=O(e)?e:{each:e},n=rn(t.ease),r=t.from||0,i=parseFloat(t.base)||0,a={},o=r>0&&r<1,s=isNaN(r)||o,c=t.axis,l=r,u=r;return w(r)?l=u={center:.5,edges:.5,end:1}[r]||0:!o&&s&&(l=r[0],u=r[1]),function(e,o,d){var f=(d||t).length,p=a[f],m,h,_,v,y,b,S,C,w;if(!p){if(w=t.grid===`auto`?0:(t.grid||[1,g])[1],!w){for(S=-g;S<(S=d[w++].getBoundingClientRect().left)&&w<f;);w<f&&w--}for(p=a[f]=[],m=s?Math.min(w,f)*l-.5:r%w,h=w===g?0:s?f*u/w-.5:r/w|0,S=0,C=g,b=0;b<f;b++)_=b%w-m,v=h-(b/w|0),p[b]=y=c?Math.abs(c===`y`?v:_):x(_*_+v*v),y>S&&(S=y),y<C&&(C=y);r===`random`&&vt(p),p.max=S-C,p.min=C,p.v=f=(parseFloat(t.amount)||parseFloat(t.each)*(w>f?f-1:c?c===`y`?f/w:w:Math.max(w,f/w))||0)*(r===`edges`?-1:1),p.b=f<0?i-f:i,p.u=dt(t.amount||t.each)||0,n=n&&f<0?nn(n):n}return f=(p[e]-p.min)/p.max||0,we(p.b+(n?n(f):f)*p.v)+p.u}},bt=function(e){var t=10**((e+``).split(`.`)[1]||``).length;return function(n){var r=we(Math.round(parseFloat(n)/e)*e*t);return(r-r%1)/t+(E(n)?0:dt(n))}},xt=function(e,t){var n=N(e),r,i;return!n&&O(e)&&(r=n=e.radius||g,e.values?(e=gt(e.values),(i=!E(e[0]))&&(r*=r)):e=bt(e.increment)),lt(t,n?T(e)?function(t){return i=e(t),Math.abs(i-t)<=r?i:t}:function(t){for(var n=parseFloat(i?t.x:t),a=parseFloat(i?t.y:0),o=g,s=0,c=e.length,l,u;c--;)i?(l=e[c].x-n,u=e[c].y-a,l=l*l+u*u):l=Math.abs(e[c]-n),l<o&&(o=l,s=c);return s=!r||o<=r?e[s]:t,i||s===t||E(t)?s:s+dt(t)}:bt(e))},St=function(e,t,n,r){return lt(N(e)?!t:n===!0?!!(n=0):!r,function(){return N(e)?e[~~(Math.random()*e.length)]:(n||=1e-5)&&(r=n<1?10**((n+``).length-2):1)&&Math.floor(Math.round((e-n/2+Math.random()*(t-e+n*.99))/n)*n*r)/r})},Ct=function(){var e=[...arguments];return function(t){return e.reduce(function(e,t){return t(e)},t)}},wt=function(e,t){return function(n){return e(parseFloat(n))+(t||dt(n))}},Tt=function(e,t,n){return At(e,t,0,1,n)},Et=function(e,t,n){return lt(n,function(n){return e[~~t(n)]})},Dt=function e(t,n,r){var i=n-t;return N(t)?Et(t,e(0,t.length),n):lt(r,function(e){return(i+(e-t)%i)%i+t})},Ot=function e(t,n,r){var i=n-t,a=i*2;return N(t)?Et(t,e(0,t.length-1),n):lt(r,function(e){return e=(a+(e-t)%a)%a||0,t+(e>i?a-e:e)})},kt=function(e){return e.replace(P,function(e){var t=e.indexOf(`[`)+1,n=e.substring(t||7,t?e.indexOf(`]`):e.length-1).split(F);return St(t?n:+n[0],t?0:+n[1],+n[2]||1e-5)})},At=function(e,t,n,r,i){var a=t-e,o=r-n;return lt(i,function(t){return n+((t-e)/a*o||0)})},jt=function e(t,n,r,i){var a=isNaN(t+n)?0:function(e){return(1-e)*t+e*n};if(!a){var o=w(t),s={},c,l,u,d,f;if(r===!0&&(i=1)&&(r=null),o)t={p:t},n={p:n};else if(N(t)&&!N(n)){for(u=[],d=t.length,f=d-2,l=1;l<d;l++)u.push(e(t[l-1],t[l]));d--,a=function(e){e*=d;var t=Math.min(f,~~e);return u[t](e-t)},r=n}else i||(t=Ne(N(t)?[]:{},t));if(!u){for(c in n)pn.call(s,t,c,`get`,n[c]);a=function(e){return Pn(e,s)||(o?t.p:t)}}}return lt(r,a)},Mt=function(e,t,n){var r=e.labels,i=g,a,o,s;for(a in r)o=r[a]-t,o<0==!!n&&o&&i>(o=Math.abs(o))&&(s=a,i=o);return s},Nt=function(e,t,n){var r=e.vars,i=r[t],a=h,o=e._ctx,s,c,l;if(i)return s=r[t+`Params`],c=r.callbackScope||e,n&&H.length&&Ee(),o&&(h=o),l=s?i.apply(c,s):i.call(c),h=a,l},Pt=function(e){return Be(e),e.scrollTrigger&&e.scrollTrigger.kill(!!m),e.progress()<1&&Nt(e,`onInterrupt`),e},Ft,It=[],Lt=function(e){if(e){if(e=!e.name&&e.default||e,A()||e.headless){var t=e.name,n=T(e),r=t&&!n&&e.init?function(){this._props=[]}:e,i={init:fe,render:Pn,add:pn,kill:In,modifier:Fn,rawVars:0},a={targetTest:0,get:0,getSetter:An,aliases:{},register:0};if(Yt(),e!==r){if(U[t])return;je(r,je(Fe(e,i),a)),Ne(r.prototype,Ne(i,Fe(e,a))),U[r.prop=t]=r,e.targetTest&&(G.push(r),ge[t]=1),t=(t===`css`?`CSS`:t.charAt(0).toUpperCase()+t.substr(1))+`Plugin`}de(t,r),e.register&&e.register($n,r,zn)}else It.push(e)}},Rt=255,zt={aqua:[0,Rt,Rt],lime:[0,Rt,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,Rt],navy:[0,0,128],white:[Rt,Rt,Rt],olive:[128,128,0],yellow:[Rt,Rt,0],orange:[Rt,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[Rt,0,0],pink:[Rt,192,203],cyan:[0,Rt,Rt],transparent:[Rt,Rt,Rt,0]},Bt=function(e,t,n){return e+=e<0?1:e>1?-1:0,(e*6<1?t+(n-t)*e*6:e<.5?n:e*3<2?t+(n-t)*(2/3-e)*6:t)*Rt+.5|0},Vt=function(e,t,n){var r=e?E(e)?[e>>16,e>>8&Rt,e&Rt]:0:zt.black,i,a,o,s,c,l,u,d,f,p;if(!r){if(e.substr(-1)===`,`&&(e=e.substr(0,e.length-1)),zt[e])r=zt[e];else if(e.charAt(0)===`#`){if(e.length<6&&(i=e.charAt(1),a=e.charAt(2),o=e.charAt(3),e=`#`+i+i+a+a+o+o+(e.length===5?e.charAt(4)+e.charAt(4):``)),e.length===9)return r=parseInt(e.substr(1,6),16),[r>>16,r>>8&Rt,r&Rt,parseInt(e.substr(7),16)/255];e=parseInt(e.substr(1),16),r=[e>>16,e>>8&Rt,e&Rt]}else if(e.substr(0,3)===`hsl`){if(r=p=e.match(I),!t)s=r[0]%360/360,c=r[1]/100,l=r[2]/100,a=l<=.5?l*(c+1):l+c-l*c,i=l*2-a,r.length>3&&(r[3]*=1),r[0]=Bt(s+1/3,i,a),r[1]=Bt(s,i,a),r[2]=Bt(s-1/3,i,a);else if(~e.indexOf(`=`))return r=e.match(ee),n&&r.length<4&&(r[3]=1),r}else r=e.match(I)||zt.transparent;r=r.map(Number)}return t&&!p&&(i=r[0]/Rt,a=r[1]/Rt,o=r[2]/Rt,u=Math.max(i,a,o),d=Math.min(i,a,o),l=(u+d)/2,u===d?s=c=0:(f=u-d,c=l>.5?f/(2-u-d):f/(u+d),s=u===i?(a-o)/f+(a<o?6:0):u===a?(o-i)/f+2:(i-a)/f+4,s*=60),r[0]=~~(s+.5),r[1]=~~(c*100+.5),r[2]=~~(l*100+.5)),n&&r.length<4&&(r[3]=1),r},Ht=function(e){var t=[],n=[],r=-1;return e.split(Wt).forEach(function(e){var i=e.match(L)||[];t.push.apply(t,i),n.push(r+=i.length+1)}),t.c=n,t},Ut=function(e,t,n){var r=``,i=(e+r).match(Wt),a=t?`hsla(`:`rgba(`,o=0,s,c,l,u;if(!i)return e;if(i=i.map(function(e){return(e=Vt(e,t,1))&&a+(t?e[0]+`,`+e[1]+`%,`+e[2]+`%,`+e[3]:e.join(`,`))+`)`}),n&&(l=Ht(e),s=n.c,s.join(r)!==l.c.join(r)))for(c=e.replace(Wt,`1`).split(L),u=c.length-1;o<u;o++)r+=c[o]+(~s.indexOf(o)?i.shift()||a+`0,0,0,0)`:(l.length?l:i.length?i:n).shift());if(!c)for(c=e.split(Wt),u=c.length-1;o<u;o++)r+=c[o]+i[o];return r+c[u]},Wt=function(){var e=`(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b`,t;for(t in zt)e+=`|`+t+`\\b`;return RegExp(e+`)`,`gi`)}(),Gt=/hsl[a]?\(/,Kt=function(e){var t=e.join(` `),n;if(Wt.lastIndex=0,Wt.test(t))return n=Gt.test(t),e[1]=Ut(e[1],n),e[0]=Ut(e[0],n,Ht(e[1])),!0},qt,Jt=function(){var e=Date.now,t=500,n=33,r=e(),i=r,a=1e3/240,o=a,s=[],c,l,u,d,f,p,m=function u(m){var h=e()-i,g=m===!0,_,v,y,b;if((h>t||h<0)&&(r+=h-n),i+=h,y=i-r,_=y-o,(_>0||g)&&(b=++d.frame,f=y-d.time*1e3,d.time=y/=1e3,o+=_+(_>=a?0:a-_),v=1),g||(c=l(u)),v)for(p=0;p<s.length;p++)s[p](y,f,b,m)};return d={time:0,frame:0,tick:function(){m(!0)},deltaRatio:function(e){return f/(1e3/(e||60))},wake:function(){ce&&(!ae&&A()&&(ie=ae=window,oe=ie.document||{},B.gsap=$n,(ie.gsapVersions||(ie.gsapVersions=[])).push($n.version),V(se||ie.GreenSockGlobals||!ie.gsap&&ie||{}),It.forEach(Lt)),u=typeof requestAnimationFrame<`u`&&requestAnimationFrame,c&&d.sleep(),l=u||function(e){return setTimeout(e,o-d.time*1e3+1|0)},qt=1,m(2))},sleep:function(){(u?cancelAnimationFrame:clearTimeout)(c),qt=0,l=fe},lagSmoothing:function(e,r){t=e||1/0,n=Math.min(r||33,t)},fps:function(e){a=1e3/(e||240),o=d.time*1e3+a},add:function(e,t,n){var r=t?function(t,n,i,a){e(t,n,i,a),d.remove(r)}:e;return d.remove(e),s[n?`unshift`:`push`](r),Yt(),r},remove:function(e,t){~(t=s.indexOf(e))&&s.splice(t,1)&&p>=t&&p--},_listeners:s},d}(),Yt=function(){return!qt&&Jt.wake()},Xt={},Zt=/^[\d.\-M][\d.\-,\s]/,Qt=/["']/g,$t=function(e){for(var t={},n=e.substr(1,e.length-3).split(`:`),r=n[0],i=1,a=n.length,o,s,c;i<a;i++)s=n[i],o=i===a-1?s.length:s.lastIndexOf(`,`),c=s.substr(0,o),t[r]=isNaN(c)?c.replace(Qt,``).trim():+c,r=s.substr(o+1).trim();return t},en=function(e){var t=e.indexOf(`(`)+1,n=e.indexOf(`)`),r=e.indexOf(`(`,t);return e.substring(t,~r&&r<n?e.indexOf(`)`,n+1):n)},tn=function(e){var t=(e+``).split(`(`),n=Xt[t[0]];return n&&t.length>1&&n.config?n.config.apply(null,~e.indexOf(`{`)?[$t(t[1])]:en(e).split(`,`).map(ke)):Xt._CE&&Zt.test(e)?Xt._CE(``,e):n},nn=function(e){return function(t){return 1-e(1-t)}},rn=function(e,t){return e&&(T(e)?e:Xt[e]||tn(e))||t},an=function(e,t,n,r){n===void 0&&(n=function(e){return 1-t(1-e)}),r===void 0&&(r=function(e){return e<.5?t(e*2)/2:1-t((1-e)*2)/2});var i={easeIn:t,easeOut:n,easeInOut:r},a;return Ce(e,function(e){for(var t in Xt[e]=B[e]=i,Xt[a=e.toLowerCase()]=n,i)Xt[a+(t===`easeIn`?`.in`:t===`easeOut`?`.out`:`.inOut`)]=Xt[e+`.`+t]=i[t]}),i},on=function(e){return function(t){return t<.5?(1-e(1-t*2))/2:.5+e((t-.5)*2)/2}},sn=function e(t,n,r){var i=n>=1?n:1,a=(r||(t?.3:.45))/(n<1?n:1),o=a/v*(Math.asin(1/i)||0),s=function(e){return e===1?1:i*2**(-10*e)*C((e-o)*a)+1},c=t===`out`?s:t===`in`?function(e){return 1-s(1-e)}:on(s);return a=v/a,c.config=function(n,r){return e(t,n,r)},c},cn=function e(t,n){n===void 0&&(n=1.70158);var r=function(e){return e?--e*e*((n+1)*e+n)+1:0},i=t===`out`?r:t===`in`?function(e){return 1-r(1-e)}:on(r);return i.config=function(n){return e(t,n)},i};Ce(`Linear,Quad,Cubic,Quart,Quint,Strong`,function(e,t){var n=t<5?t+1:t;an(e+`,Power`+(n-1),t?function(e){return e**+n}:function(e){return e},function(e){return 1-(1-e)**n},function(e){return e<.5?(e*2)**n/2:1-((1-e)*2)**n/2})}),Xt.Linear.easeNone=Xt.none=Xt.Linear.easeIn,an(`Elastic`,sn(`in`),sn(`out`),sn()),(function(e,t){var n=1/t,r=2*n,i=2.5*n,a=function(a){return a<n?e*a*a:a<r?e*(a-1.5/t)**2+.75:a<i?e*(a-=2.25/t)*a+.9375:e*(a-2.625/t)**2+.984375};an(`Bounce`,function(e){return 1-a(1-e)},a)})(7.5625,2.75),an(`Expo`,function(e){return 2**(10*(e-1))*e+e*e*e*e*e*e*(1-e)}),an(`Circ`,function(e){return-(x(1-e*e)-1)}),an(`Sine`,function(e){return e===1?1:-S(e*y)+1}),an(`Back`,cn(`in`),cn(`out`),cn()),Xt.SteppedEase=Xt.steps=B.SteppedEase={config:function(e,t){e===void 0&&(e=1);var n=1/e,r=e+ +!t,i=+!!t,a=1-_;return function(e){return((r*ut(0,a,e)|0)+i)*n}}},f.ease=Xt[`quad.out`],Ce(`onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt`,function(e){return K+=e+`,`+e+`Params,`});var ln=function(e,t){this.id=b++,e._gsap=this,this.target=e,this.harness=t,this.get=t?t.get:Se,this.set=t?t.getSetter:An},un=function(){function e(e){this.vars=e,this._delay=+e.delay||0,(this._repeat=e.repeat===1/0?-2:e.repeat||0)&&(this._rDelay=e.repeatDelay||0,this._yoyo=!!e.yoyo||!!e.yoyoEase),this._ts=1,it(this,+e.duration,1,1),this.data=e.data,h&&(this._ctx=h,h.data.push(this)),qt||Jt.wake()}var t=e.prototype;return t.delay=function(e){return e||e===0?(this.parent&&this.parent.smoothChildTiming&&this.startTime(this._start+e-this._delay),this._delay=e,this):this._delay},t.duration=function(e){return arguments.length?this.totalDuration(this._repeat>0?e+(e+this._rDelay)*this._repeat:e):this.totalDuration()&&this._dur},t.totalDuration=function(e){return arguments.length?(this._dirty=0,it(this,this._repeat<0?e:(e-this._repeat*this._rDelay)/(this._repeat+1))):this._tDur},t.totalTime=function(e,t){if(Yt(),!arguments.length)return this._tTime;var n=this._dp;if(n&&n.smoothChildTiming&&this._ts){for(Ye(this,e),!n._dp||n.parent||Xe(n,this);n&&n.parent;)n.parent._time!==n._start+(n._ts>=0?n._tTime/n._ts:(n.totalDuration()-n._tTime)/-n._ts)&&n.totalTime(n._tTime,!0),n=n.parent;!this.parent&&this._dp.autoRemoveChildren&&(this._ts>0&&e<this._tDur||this._ts<0&&e>0||!this._tDur&&!e)&&Ze(this._dp,this,this._start-this._delay)}return(this._tTime!==e||!this._dur&&!t||this._initted&&Math.abs(this._zTime)===_||!this._initted&&this._dur&&e||!e&&!this._initted&&(this.add||this._ptLookup))&&(this._ts||(this._pTime=e),Oe(this,e,t)),this},t.time=function(e,t){return arguments.length?this.totalTime(Math.min(this.totalDuration(),e+Ge(this))%(this._dur+this._rDelay)||(e?this._dur:0),t):this._time},t.totalProgress=function(e,t){return arguments.length?this.totalTime(this.totalDuration()*e,t):this.totalDuration()?Math.min(1,this._tTime/this._tDur):this.rawTime()>=0&&this._initted?1:0},t.progress=function(e,t){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&!(this.iteration()&1)?1-e:e)+Ge(this),t):this.duration()?Math.min(1,this._time/this._dur):+(this.rawTime()>0)},t.iteration=function(e,t){var n=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(e-1)*n,t):this._repeat?Ke(this._tTime,n)+1:1},t.timeScale=function(e,t){if(!arguments.length)return this._rts===-_?0:this._rts;if(this._rts===e)return this;var n=this.parent&&this._ts?qe(this.parent._time,this):this._tTime,r=this._rts<0;this._rts=+e||0,this._ts=this._ps||e===-_?0:this._rts;var i=this.totalDuration();return(r!==this._rts<0||n>0&&n<i)&&this.totalTime(ut(-Math.abs(this._delay),i,n),t!==!1),Je(this),He(this)},t.paused=function(e){if(!arguments.length)return this._ps;if(this._ps!==e){if(this._ps=e,e)this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0;else{Yt(),this._ts=this._rts;var t=this.parent&&!this.parent.smoothChildTiming?this.rawTime():this._tTime||this._pTime,n=this.progress()===1&&Math.abs(this._zTime)!==_,r;if(n)for(this._tTime-=_,r=this._first;r;){if(!r._dur&&r._zTime<0&&r._ts&&r._start<=t+_){n=!1;break}r=r._next}this.totalTime(t,n)}}return this},t.startTime=function(e){if(arguments.length){this._start=we(e);var t=this.parent||this._dp;return t&&(t._sort||!this.parent)&&Ze(t,this,this._start-this._delay),this}return this._start},t.endTime=function(e){return this._start+(k(e)?this.totalDuration():this.duration())/Math.abs(this._ts||1)},t.rawTime=function(e){var t=this.parent||this._dp;return t?e&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?qe(t.rawTime(e),this):this._tTime:this._tTime},t.revert=function(e){e===void 0&&(e=he);var t=m;return m=e,De(this)&&(this.timeline&&this.timeline.revert(e),this.totalTime(-.01,e.suppressEvents)),this.data!==`nested`&&e.kill!==!1&&this.kill(),m=t,this},t.globalTime=function(e){for(var t=this,n=arguments.length?e:t.rawTime();t;)n=t._start+n/(Math.abs(t._ts)||1),t=t._dp;return!this.parent&&this._sat?this._sat.globalTime(e):n},t.repeat=function(e){return arguments.length?(this._repeat=e===1/0?-2:e,at(this)):this._repeat===-2?1/0:this._repeat},t.repeatDelay=function(e){if(arguments.length){var t=this._time;return this._rDelay=e,at(this),t?this.time(t):this}return this._rDelay},t.yoyo=function(e){return arguments.length?(this._yoyo=e,this):this._yoyo},t.seek=function(e,t){return this.totalTime(st(this,e),k(t))},t.restart=function(e,t){return this.play().totalTime(e?-this._delay:0,k(t)),this._dur||(this._zTime=-_),this},t.play=function(e,t){return e!=null&&this.seek(e,t),this.reversed(!1).paused(!1)},t.reverse=function(e,t){return e!=null&&this.seek(e||this.totalDuration(),t),this.reversed(!0).paused(!1)},t.pause=function(e,t){return e!=null&&this.seek(e,t),this.paused(!0)},t.resume=function(){return this.paused(!1)},t.reversed=function(e){return arguments.length?(!!e!==this.reversed()&&this.timeScale(-this._rts||(e?-_:0)),this):this._rts<0},t.invalidate=function(){return this._initted=this._act=0,this._zTime=-_,this},t.isActive=function(){var e=this.parent||this._dp,t=this._start,n;return!!(!e||this._ts&&this._initted&&e.isActive()&&(n=e.rawTime(!0))>=t&&n<this.endTime(!0)-_)},t.eventCallback=function(e,t,n){var r=this.vars;return arguments.length>1?(t?(r[e]=t,n&&(r[e+`Params`]=n),e===`onUpdate`&&(this._onUpdate=t)):delete r[e],this):r[e]},t.then=function(e){var t=this,n=t._prom;return new Promise(function(r){var i=T(e)?e:Ae,a=function(){var e=t.then;t.then=null,n&&n(),T(i)&&(i=i(t))&&(i.then||i===t)&&(t.then=e),r(i),t.then=e};t._initted&&t.totalProgress()===1&&t._ts>=0||!t._tTime&&t._ts<0?a():t._prom=a})},t.kill=function(){Pt(this)},e}();je(un.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:null,_initted:!1,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-_,_prom:0,_ps:!1,_rts:1});var dn=function(e){u(t,e);function t(t,n){var r;return t===void 0&&(t={}),r=e.call(this,t)||this,r.labels={},r.smoothChildTiming=!!t.smoothChildTiming,r.autoRemoveChildren=!!t.autoRemoveChildren,r._sort=k(t.sortChildren),z&&Ze(t.parent||z,l(r),n),t.reversed&&r.reverse(),t.paused&&r.paused(!0),t.scrollTrigger&&Qe(l(r),t.scrollTrigger),r}var n=t.prototype;return n.to=function(e,t,n){return ct(0,arguments,this),this},n.from=function(e,t,n){return ct(1,arguments,this),this},n.fromTo=function(e,t,n,r){return ct(2,arguments,this),this},n.set=function(e,t,n){return t.duration=0,t.parent=this,Ie(t).repeatDelay||(t.repeat=0),t.immediateRender=!!t.immediateRender,new Tn(e,t,st(this,n),1),this},n.call=function(e,t,n){return Ze(this,Tn.delayedCall(0,e,t),n)},n.staggerTo=function(e,t,n,r,i,a,o){return n.duration=t,n.stagger=n.stagger||r,n.onComplete=a,n.onCompleteParams=o,n.parent=this,new Tn(e,n,st(this,i)),this},n.staggerFrom=function(e,t,n,r,i,a,o){return n.runBackwards=1,Ie(n).immediateRender=k(n.immediateRender),this.staggerTo(e,t,n,r,i,a,o)},n.staggerFromTo=function(e,t,n,r,i,a,o,s){return r.startAt=n,Ie(r).immediateRender=k(r.immediateRender),this.staggerTo(e,t,r,i,a,o,s)},n.render=function(e,t,n){var r=this._time,i=this._dirty?this.totalDuration():this._tDur,a=this._dur,o=e<=0?0:we(e),s=this._zTime<0!=e<0&&(this._initted||!a),c,l,u,d,f,p,h,g,v,y,b,x;if(this!==z&&o>i&&e>=0&&(o=i),o!==this._tTime||n||s){if(r!==this._time&&a&&(o+=this._time-r,e+=this._time-r),c=o,v=this._start,g=this._ts,p=!g,s&&(a||(r=this._zTime),(e||!t)&&(this._zTime=e)),this._repeat){if(b=this._yoyo,f=a+this._rDelay,this._repeat<-1&&e<0)return this.totalTime(f*100+e,t,n);if(c=we(o%f),o===i?(d=this._repeat,c=a):(y=we(o/f),d=~~y,d&&d===y&&(c=a,d--),c>a&&(c=a)),y=Ke(this._tTime,f),!r&&this._tTime&&y!==d&&this._tTime-y*f-this._dur<=0&&(y=d),b&&d&1&&(c=a-c,x=1),d!==y&&!this._lock){var S=b&&y&1,C=S===(b&&d&1);if(d<y&&(S=!S),r=S?0:o%a?a:o,this._lock=1,this.render(r||(x?0:we(d*f)),t,!a)._lock=0,this._tTime=o,!t&&this.parent&&Nt(this,`onRepeat`),this.vars.repeatRefresh&&!x&&(this.invalidate()._lock=1,y=d),r&&r!==this._time||p!==!this._ts||this.vars.onRepeat&&!this.parent&&!this._act||(a=this._dur,i=this._tDur,C&&(this._lock=2,r=S?a:-1e-4,this.render(r,!0),this.vars.repeatRefresh&&!x&&this.invalidate()),this._lock=0,!this._ts&&!p))return this}}if(this._hasPause&&!this._forcing&&this._lock<2&&(h=rt(this,we(r),we(c)),h&&(o-=c-(c=h._start))),this._tTime=o,this._time=c,this._act=!!g,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1,this._zTime=e,r=0),!r&&o&&a&&!t&&!y&&(Nt(this,`onStart`),this._tTime!==o))return this;if(c>=r&&e>=0)for(l=this._first;l;){if(u=l._next,(l._act||c>=l._start)&&l._ts&&h!==l){if(l.parent!==this)return this.render(e,t,n);if(l.render(l._ts>0?(c-l._start)*l._ts:(l._dirty?l.totalDuration():l._tDur)+(c-l._start)*l._ts,t,n),c!==this._time||!this._ts&&!p){h=0,u&&(o+=this._zTime=-_);break}}l=u}else{l=this._last;for(var w=e<0?e:c;l;){if(u=l._prev,(l._act||w<=l._end)&&l._ts&&h!==l){if(l.parent!==this)return this.render(e,t,n);if(l.render(l._ts>0?(w-l._start)*l._ts:(l._dirty?l.totalDuration():l._tDur)+(w-l._start)*l._ts,t,n||m&&De(l)),c!==this._time||!this._ts&&!p){h=0,u&&(o+=this._zTime=w?-_:_);break}}l=u}}if(h&&!t&&(this.pause(),h.render(c>=r?0:-_)._zTime=c>=r?1:-1,this._ts))return this._start=v,Je(this),this.render(e,t,n);this._onUpdate&&!t&&Nt(this,`onUpdate`,!0),(o===i&&this._tTime>=this.totalDuration()||!o&&r)&&(v!==this._start&&Math.abs(g)===Math.abs(this._ts)||this._lock||((e||!a)&&(o===i&&this._ts>0||!o&&this._ts<0)&&Be(this,1),t||e<0&&!r||!o&&!r&&i||(Nt(this,o===i&&e>=0?`onComplete`:`onReverseComplete`,!0),this._prom&&!(o<i&&this.timeScale()>0)&&this._prom())))}return this},n.add=function(e,t){var n=this;if(E(t)||(t=st(this,t,e)),!(e instanceof un)){if(N(e))return e.forEach(function(e){return n.add(e,t)}),this;if(w(e))return this.addLabel(e,t);if(T(e))e=Tn.delayedCall(0,e);else return this}return this===e?this:Ze(this,e,t)},n.getChildren=function(e,t,n,r){e===void 0&&(e=!0),t===void 0&&(t=!0),n===void 0&&(n=!0),r===void 0&&(r=-g);for(var i=[],a=this._first;a;)a._start>=r&&(a instanceof Tn?t&&i.push(a):(n&&i.push(a),e&&i.push.apply(i,a.getChildren(!0,t,n)))),a=a._next;return i},n.getById=function(e){for(var t=this.getChildren(1,1,1),n=t.length;n--;)if(t[n].vars.id===e)return t[n]},n.remove=function(e){return w(e)?this.removeLabel(e):T(e)?this.killTweensOf(e):(e.parent===this&&ze(this,e),e===this._recent&&(this._recent=this._last),Ve(this))},n.totalTime=function(t,n){return arguments.length?(this._forcing=1,!this._dp&&this._ts&&(this._start=we(Jt.time-(this._ts>0?t/this._ts:(this.totalDuration()-t)/-this._ts))),e.prototype.totalTime.call(this,t,n),this._forcing=0,this):this._tTime},n.addLabel=function(e,t){return this.labels[e]=st(this,t),this},n.removeLabel=function(e){return delete this.labels[e],this},n.addPause=function(e,t,n){var r=Tn.delayedCall(0,t||fe,n);return r.data=`isPause`,this._hasPause=1,Ze(this,r,st(this,e))},n.removePause=function(e){var t=this._first;for(e=st(this,e);t;)t._start===e&&t.data===`isPause`&&Be(t),t=t._next},n.killTweensOf=function(e,t,n){for(var r=this.getTweensOf(e,n),i=r.length;i--;)gn!==r[i]&&r[i].kill(e,t);return this},n.getTweensOf=function(e,t){for(var n=[],r=gt(e),i=this._first,a=E(t),o;i;)i instanceof Tn?Te(i._targets,r)&&(a?(!gn||i._initted&&i._ts)&&i.globalTime(0)<=t&&i.globalTime(i.totalDuration())>t:!t||i.isActive())&&n.push(i):(o=i.getTweensOf(r,t)).length&&n.push.apply(n,o),i=i._next;return n},n.tweenTo=function(e,t){t||={};var n=this,r=st(n,e),i=t,a=i.startAt,o=i.onStart,s=i.onStartParams,c=i.immediateRender,l,u=Tn.to(n,je({ease:t.ease||`none`,lazy:!1,immediateRender:!1,time:r,overwrite:`auto`,duration:t.duration||Math.abs((r-(a&&`time`in a?a.time:n._time))/n.timeScale())||_,onStart:function(){if(n.pause(),!l){var e=t.duration||Math.abs((r-(a&&`time`in a?a.time:n._time))/n.timeScale());u._dur!==e&&it(u,e,0,1).render(u._time,!0,!0),l=1}o&&o.apply(u,s||[])}},t));return c?u.render(0):u},n.tweenFromTo=function(e,t,n){return this.tweenTo(t,je({startAt:{time:st(this,e)}},n))},n.recent=function(){return this._recent},n.nextLabel=function(e){return e===void 0&&(e=this._time),Mt(this,st(this,e))},n.previousLabel=function(e){return e===void 0&&(e=this._time),Mt(this,st(this,e),1)},n.currentLabel=function(e){return arguments.length?this.seek(e,!0):this.previousLabel(this._time+_)},n.shiftChildren=function(e,t,n){n===void 0&&(n=0);var r=this._first,i=this.labels,a;for(e=we(e);r;)r._start>=n&&(r._start+=e,r._end+=e),r=r._next;if(t)for(a in i)i[a]>=n&&(i[a]+=e);return Ve(this)},n.invalidate=function(t){var n=this._first;for(this._lock=0;n;)n.invalidate(t),n=n._next;return e.prototype.invalidate.call(this,t)},n.clear=function(e){e===void 0&&(e=!0);for(var t=this._first,n;t;)n=t._next,this.remove(t),t=n;return this._dp&&(this._time=this._tTime=this._pTime=0),e&&(this.labels={}),Ve(this)},n.totalDuration=function(e){var t=0,n=this,r=n._last,i=g,a,o,s;if(arguments.length)return n.timeScale((n._repeat<0?n.duration():n.totalDuration())/(n.reversed()?-e:e));if(n._dirty){for(s=n.parent;r;)a=r._prev,r._dirty&&r.totalDuration(),o=r._start,o>i&&n._sort&&r._ts&&!n._lock?(n._lock=1,Ze(n,r,o-r._delay,1)._lock=0):i=o,o<0&&r._ts&&(t-=o,(!s&&!n._dp||s&&s.smoothChildTiming)&&(n._start+=we(o/n._ts),n._time-=o,n._tTime-=o),n.shiftChildren(-o,!1,-1/0),i=0),r._end>t&&r._ts&&(t=r._end),r=a;it(n,n===z&&n._time>t?n._time:t,1,1),n._dirty=0}return n._tDur},t.updateRoot=function(e){if(z._ts&&(Oe(z,qe(e,z)),ve=Jt.frame),Jt.frame>=ye){ye+=d.autoSleep||120;var t=z._first;if((!t||!t._ts)&&d.autoSleep&&Jt._listeners.length<2){for(;t&&!t._ts;)t=t._next;t||Jt.sleep()}}},t}(un);je(dn.prototype,{_lock:0,_hasPause:0,_forcing:0});var fn=function(e,t,n,r,i,a,o){var s=new zn(this._pt,e,t,0,1,Nn,null,i),c=0,l=0,u,d,f,p,m,h,g,_;for(s.b=n,s.e=r,n+=``,r+=``,(g=~r.indexOf(`random(`))&&(r=kt(r)),a&&(_=[n,r],a(_,e,t),n=_[0],r=_[1]),d=n.match(te)||[];u=te.exec(r);)p=u[0],m=r.substring(c,u.index),f?f=(f+1)%5:m.substr(-5)===`rgba(`&&(f=1),p!==d[l++]&&(h=parseFloat(d[l-1])||0,s._pt={_next:s._pt,p:m||l===1?m:`,`,s:h,c:p.charAt(1)===`=`?J(h,p)-h:parseFloat(p)-h,m:f&&f<4?Math.round:0},c=te.lastIndex);return s.c=c<r.length?r.substring(c,r.length):``,s.fp=o,(ne.test(r)||g)&&(s.e=0),this._pt=s,s},pn=function(e,t,n,r,i,a,o,s,c,l){T(r)&&(r=r(i||0,e,a));var u=e[t],f=n===`get`?T(u)?c?e[t.indexOf(`set`)||!T(e[`get`+t.substr(3)])?t:`get`+t.substr(3)](c):e[t]():u:n,p=T(u)?c?On:Dn:En,m;if(w(r)&&(~r.indexOf(`random(`)&&(r=kt(r)),r.charAt(1)===`=`&&(m=J(f,r)+(dt(f)||0),(m||m===0)&&(r=m))),!l||f!==r||_n)return!isNaN(f*r)&&r!==``?(m=new zn(this._pt,e,t,+f||0,r-(f||0),typeof u==`boolean`?Mn:jn,0,p),c&&(m.fp=c),o&&m.modifier(o,this,e),this._pt=m):(!u&&!(t in e)&&le(t,r),fn.call(this,e,t,f,r,p,s||d.stringFilter,c))},mn=function(e,t,n,r,i){if(T(e)&&(e=Sn(e,i,t,n,r)),!O(e)||e.style&&e.nodeType||N(e)||M(e))return w(e)?Sn(e,i,t,n,r):e;var a={},o;for(o in e)a[o]=Sn(e[o],i,t,n,r);return a},hn=function(e,t,n,r,i,a){var o,s,c,l;if(U[e]&&(o=new U[e]).init(i,o.rawVars?t[e]:mn(t[e],r,i,a,n),n,r,a)!==!1&&(n._pt=s=new zn(n._pt,i,e,0,1,o.render,o,0,o.priority),n!==Ft))for(c=n._ptLookup[n._targets.indexOf(i)],l=o._props.length;l--;)c[o._props[l]]=s;return o},gn,_n,vn=function e(t,n,r){var i=t.vars,a=i.ease,o=i.startAt,s=i.immediateRender,c=i.lazy,l=i.onUpdate,u=i.runBackwards,d=i.yoyoEase,h=i.keyframes,v=i.autoRevert,y=t._dur,b=t._startAt,x=t._targets,S=t.parent,C=S&&S.data===`nested`?S.vars.targets:x,w=t._overwrite===`auto`&&!p,T=t.timeline,E=i.easeReverse||d,D,O,A,j,M,N,P,F,I,ee,L,te,ne;if(!T||h&&a||(a=`none`),t._ease=rn(a,f.ease),t._rEase=E&&(rn(E)||t._ease),t._from=!T&&!!i.runBackwards,t._from&&(t.ratio=1),!T||h&&!i.stagger){if(F=x[0]?xe(x[0]).harness:0,te=F&&i[F.prop],D=Fe(i,ge),b&&(b._zTime<0&&b.progress(1),n<0&&u&&s&&!v?b.render(-1,!0):b.revert(u&&y?me:pe),b._lazy=0),o){if(Be(t._startAt=Tn.set(x,je({data:`isStart`,overwrite:!1,parent:S,immediateRender:!0,lazy:!b&&k(c),startAt:null,delay:0,onUpdate:l&&function(){return Nt(t,`onUpdate`)},stagger:0},o))),t._startAt._dp=0,t._startAt._sat=t,n<0&&(m||!s&&!v)&&t._startAt.revert(me),s&&y&&n<=0&&r<=0){n&&(t._zTime=n);return}}else if(u&&y&&!b){if(n&&(s=!1),A=je({overwrite:!1,data:`isFromStart`,lazy:s&&!b&&k(c),immediateRender:s,stagger:0,parent:S},D),te&&(A[F.prop]=te),Be(t._startAt=Tn.set(x,A)),t._startAt._dp=0,t._startAt._sat=t,n<0&&(m?t._startAt.revert(me):t._startAt.render(-1,!0)),t._zTime=n,!s)e(t._startAt,_,_);else if(!n)return}for(t._pt=t._ptCache=0,c=y&&k(c)||c&&!y,O=0;O<x.length;O++){if(M=x[O],P=M._gsap||be(x)[O]._gsap,t._ptLookup[O]=ee={},_e[P.id]&&H.length&&Ee(),L=C===x?O:C.indexOf(M),F&&(I=new F).init(M,te||D,t,L,C)!==!1&&(t._pt=j=new zn(t._pt,M,I.name,0,1,I.render,I,0,I.priority),I._props.forEach(function(e){ee[e]=j}),I.priority&&(N=1)),!F||te)for(A in D)U[A]&&(I=hn(A,D,t,L,M,C))?I.priority&&(N=1):ee[A]=j=pn.call(t,M,A,`get`,D[A],L,C,0,i.stringFilter);t._op&&t._op[O]&&t.kill(M,t._op[O]),w&&t._pt&&(gn=t,z.killTweensOf(M,ee,t.globalTime(n)),ne=!t.parent,gn=0),t._pt&&c&&(_e[P.id]=1)}N&&Rn(t),t._onInit&&t._onInit(t)}t._onUpdate=l,t._initted=(!t._op||t._pt)&&!ne,h&&n<=0&&T.render(g,!0,!0)},yn=function(e,t,n,r,i,a,o,s){var c=(e._pt&&e._ptCache||(e._ptCache={}))[t],l,u,d,f;if(!c)for(c=e._ptCache[t]=[],d=e._ptLookup,f=e._targets.length;f--;){if(l=d[f][t],l&&l.d&&l.d._pt)for(l=l.d._pt;l&&l.p!==t&&l.fp!==t;)l=l._next;if(!l)return _n=1,e.vars[t]=`+=0`,vn(e,o),_n=0,s?ue(t+` not eligible for reset. Try splitting into individual properties`):1;c.push(l)}for(f=c.length;f--;)u=c[f],l=u._pt||u,l.s=(r||r===0)&&!i?r:l.s+(r||0)+a*l.c,l.c=n-l.s,u.e&&(u.e=q(n)+dt(u.e)),u.b&&(u.b=l.s+dt(u.b))},bn=function(e,t){var n=e[0]?xe(e[0]).harness:0,r=n&&n.aliases,i,a,o,s;if(!r)return t;for(a in i=Ne({},t),r)if(a in i)for(s=r[a].split(`,`),o=s.length;o--;)i[s[o]]=i[a];return i},xn=function(e,t,n,r){var i=t.ease||r||`power1.inOut`,a,o;if(N(t))o=n[e]||(n[e]=[]),t.forEach(function(e,n){return o.push({t:n/(t.length-1)*100,v:e,e:i})});else for(a in t)o=n[a]||(n[a]=[]),a===`ease`||o.push({t:parseFloat(e),v:t[a],e:i})},Sn=function(e,t,n,r,i){return T(e)?e.call(t,n,r,i):w(e)&&~e.indexOf(`random(`)?kt(e):e},Cn=K+`repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert`,wn={};Ce(Cn+`,id,stagger,delay,duration,paused,scrollTrigger`,function(e){return wn[e]=1}),Cn=Cn.split(`,`);var Tn=function(e){u(t,e);function t(t,n,r,i){var a;typeof n==`number`&&(r.duration=n,n=r,r=null),a=e.call(this,i?n:Ie(n))||this;var o=a.vars,s=o.duration,c=o.delay,u=o.immediateRender,f=o.stagger,m=o.overwrite,h=o.keyframes,g=o.defaults,v=o.scrollTrigger,y=n.parent||z,b=(N(t)||M(t)?E(t[0]):`length`in n)?[t]:gt(t),x,S,C,w,T,D,A,P;if(a._targets=b.length?be(b):ue(`GSAP target `+t+` not found. https://gsap.com`,!d.nullTargetWarn)||[],a._ptLookup=[],a._overwrite=m,h||f||j(s)||j(c)){n=a.vars;var F=n.easeReverse||n.yoyoEase;if(x=a.timeline=new dn({data:`nested`,defaults:g||{},targets:y&&y.data===`nested`?y.vars.targets:b}),x.kill(),x.parent=x._dp=l(a),x._start=0,f||j(s)||j(c)){if(w=b.length,A=f&&yt(f),O(f))for(T in f)~Cn.indexOf(T)&&(P||={},P[T]=f[T]);for(S=0;S<w;S++)C=Fe(n,wn),C.stagger=0,F&&(C.easeReverse=F),P&&Ne(C,P),D=b[S],C.duration=+Sn(s,l(a),S,D,b),C.delay=(+Sn(c,l(a),S,D,b)||0)-a._delay,!f&&w===1&&C.delay&&(a._delay=c=C.delay,a._start+=c,C.delay=0),x.to(D,C,A?A(S,D,b):0),x._ease=Xt.none;x.duration()?s=c=0:a.timeline=0}else if(h){Ie(je(x.vars.defaults,{ease:`none`})),x._ease=rn(h.ease||n.ease||`none`);var I=0,ee,L,te;if(N(h))h.forEach(function(e){return x.to(b,e,`>`)}),x.duration();else{for(T in C={},h)T===`ease`||T===`easeEach`||xn(T,h[T],C,h.easeEach);for(T in C)for(ee=C[T].sort(function(e,t){return e.t-t.t}),I=0,S=0;S<ee.length;S++)L=ee[S],te={ease:L.e,duration:(L.t-(S?ee[S-1].t:0))/100*s},te[T]=L.v,x.to(b,te,I),I+=te.duration;x.duration()<s&&x.to({},{duration:s-x.duration()})}}s||a.duration(s=x.duration())}else a.timeline=0;return m===!0&&!p&&(gn=l(a),z.killTweensOf(b),gn=0),Ze(y,l(a),r),n.reversed&&a.reverse(),n.paused&&a.paused(!0),(u||!s&&!h&&a._start===we(y._time)&&k(u)&&We(l(a))&&y.data!==`nested`)&&(a._tTime=-_,a.render(Math.max(0,-c)||0)),v&&Qe(l(a),v),a}var n=t.prototype;return n.render=function(e,t,n){var r=this._time,i=this._tDur,a=this._dur,o=e<0,s=e>i-_&&!o?i:e<_?0:e,c,l,u,d,f,p,m,h;if(!a)nt(this,e,t,n);else if(s!==this._tTime||!e||n||!this._initted&&this._tTime||this._startAt&&this._zTime<0!==o||this._lazy){if(c=s,h=this.timeline,this._repeat){if(d=a+this._rDelay,this._repeat<-1&&o)return this.totalTime(d*100+e,t,n);if(c=we(s%d),s===i?(u=this._repeat,c=a):(f=we(s/d),u=~~f,u&&u===f?(c=a,u--):c>a&&(c=a)),p=this._yoyo&&u&1,p&&(c=a-c),f=Ke(this._tTime,d),c===r&&!n&&this._initted&&u===f)return this._tTime=s,this;u!==f&&this.vars.repeatRefresh&&!p&&!this._lock&&c!==d&&this._initted&&(this._lock=n=1,this.render(we(d*u),!0).invalidate()._lock=0)}if(!this._initted){if($e(this,o?e:c,n,t,s))return this._tTime=0,this;if(r!==this._time&&!(n&&this.vars.repeatRefresh&&u!==f))return this;if(a!==this._dur)return this.render(e,t,n)}if(this._rEase){var g=c<r;if(g!==this._inv){var v=g?r:a-r;this._inv=g,this._from&&(this.ratio=1-this.ratio),this._invRatio=this.ratio,this._invTime=r,this._invRecip=v?(g?-1:1)/v:0,this._invScale=g?-this.ratio:1-this.ratio,this._invEase=g?this._rEase:this._ease}this.ratio=m=this._invRatio+this._invScale*this._invEase((c-this._invTime)*this._invRecip)}else this.ratio=m=this._ease(c/a);if(this._from&&(this.ratio=m=1-m),this._tTime=s,this._time=c,!this._act&&this._ts&&(this._act=1,this._lazy=0),!r&&s&&!t&&!f&&(Nt(this,`onStart`),this._tTime!==s))return this;for(l=this._pt;l;)l.r(m,l.d),l=l._next;h&&h.render(e<0?e:h._dur*h._ease(c/this._dur),t,n)||this._startAt&&(this._zTime=e),this._onUpdate&&!t&&(o&&Ue(this,e,t,n),Nt(this,`onUpdate`)),this._repeat&&u!==f&&this.vars.onRepeat&&!t&&this.parent&&Nt(this,`onRepeat`),s!==this._tDur&&s||this._tTime!==s||(o&&!this._onUpdate&&Ue(this,e,!0,!0),(e||!a)&&(s===this._tDur&&this._ts>0||!s&&this._ts<0)&&Be(this,1),!t&&(!o||r)&&(s||r||p)&&(Nt(this,s===i?`onComplete`:`onReverseComplete`,!0),this._prom&&!(s<i&&this.timeScale()>0)&&this._prom()))}return this},n.targets=function(){return this._targets},n.invalidate=function(t){return t&&this.vars.runBackwards||(this._startAt=0),this._pt=this._op=this._onUpdate=this._lazy=this.ratio=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(t),e.prototype.invalidate.call(this,t)},n.resetTo=function(e,t,n,r,i){qt||Jt.wake(),this._ts||this.play();var a=Math.min(this._dur,(this._dp._time-this._start)*this._ts),o;return this._initted||vn(this,a),o=this._ease(a/this._dur),yn(this,e,t,n,r,o,a,i)?this.resetTo(e,t,n,r,1):(Ye(this,0),this.parent||Re(this._dp,this,`_first`,`_last`,this._dp._sort?`_start`:0),this.render(0))},n.kill=function(e,t){if(t===void 0&&(t=`all`),!e&&(!t||t===`all`))return this._lazy=this._pt=0,this.parent?Pt(this):this.scrollTrigger&&this.scrollTrigger.kill(!!m),this;if(this.timeline){var n=this.timeline.totalDuration();return this.timeline.killTweensOf(e,t,gn&&gn.vars.overwrite!==!0)._first||Pt(this),this.parent&&n!==this.timeline.totalDuration()&&it(this,this._dur*this.timeline._tDur/n,0,1),this}var r=this._targets,i=e?gt(e):r,a=this._ptLookup,o=this._pt,s,c,l,u,d,f,p;if((!t||t===`all`)&&Le(r,i))return t===`all`&&(this._pt=0),Pt(this);for(s=this._op=this._op||[],t!==`all`&&(w(t)&&(d={},Ce(t,function(e){return d[e]=1}),t=d),t=bn(r,t)),p=r.length;p--;)if(~i.indexOf(r[p]))for(d in c=a[p],t===`all`?(s[p]=t,u=c,l={}):(l=s[p]=s[p]||{},u=t),u)f=c&&c[d],f&&(`kill`in f.d&&f.d.kill(d)!==!0||ze(this,f,`_pt`),delete c[d]),l!==`all`&&(l[d]=1);return this._initted&&!this._pt&&o&&Pt(this),this},t.to=function(e,n){return new t(e,n,arguments[2])},t.from=function(e,t){return ct(1,arguments)},t.delayedCall=function(e,n,r,i){return new t(n,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:e,onComplete:n,onReverseComplete:n,onCompleteParams:r,onReverseCompleteParams:r,callbackScope:i})},t.fromTo=function(e,t,n){return ct(2,arguments)},t.set=function(e,n){return n.duration=0,n.repeatDelay||(n.repeat=0),new t(e,n)},t.killTweensOf=function(e,t,n){return z.killTweensOf(e,t,n)},t}(un);je(Tn.prototype,{_targets:[],_lazy:0,_startAt:0,_op:0,_onInit:0}),Ce(`staggerTo,staggerFrom,staggerFromTo`,function(e){Tn[e]=function(){var t=new dn,n=pt.call(arguments,0);return n.splice(e===`staggerFromTo`?5:4,0,0),t[e].apply(t,n)}});var En=function(e,t,n){return e[t]=n},Dn=function(e,t,n){return e[t](n)},On=function(e,t,n,r){return e[t](r.fp,n)},kn=function(e,t,n){return e.setAttribute(t,n)},An=function(e,t){return T(e[t])?Dn:D(e[t])&&e.setAttribute?kn:En},jn=function(e,t){return t.set(t.t,t.p,Math.round((t.s+t.c*e)*1e6)/1e6,t)},Mn=function(e,t){return t.set(t.t,t.p,!!(t.s+t.c*e),t)},Nn=function(e,t){var n=t._pt,r=``;if(!e&&t.b)r=t.b;else if(e===1&&t.e)r=t.e;else{for(;n;)r=n.p+(n.m?n.m(n.s+n.c*e):Math.round((n.s+n.c*e)*1e4)/1e4)+r,n=n._next;r+=t.c}t.set(t.t,t.p,r,t)},Pn=function(e,t){for(var n=t._pt;n;)n.r(e,n.d),n=n._next},Fn=function(e,t,n,r){for(var i=this._pt,a;i;)a=i._next,i.p===r&&i.modifier(e,t,n),i=a},In=function(e){for(var t=this._pt,n,r;t;)r=t._next,t.p===e&&!t.op||t.op===e?ze(this,t,`_pt`):t.dep||(n=1),t=r;return!n},Ln=function(e,t,n,r){r.mSet(e,t,r.m.call(r.tween,n,r.mt),r)},Rn=function(e){for(var t=e._pt,n,r,i,a;t;){for(n=t._next,r=i;r&&r.pr>t.pr;)r=r._next;(t._prev=r?r._prev:a)?t._prev._next=t:i=t,(t._next=r)?r._prev=t:a=t,t=n}e._pt=i},zn=function(){function e(e,t,n,r,i,a,o,s,c){this.t=t,this.s=r,this.c=i,this.p=n,this.r=a||jn,this.d=o||this,this.set=s||En,this.pr=c||0,this._next=e,e&&(e._prev=this)}var t=e.prototype;return t.modifier=function(e,t,n){this.mSet=this.mSet||this.set,this.set=Ln,this.m=e,this.mt=n,this.tween=t},e}();Ce(K+`parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse`,function(e){return ge[e]=1}),B.TweenMax=B.TweenLite=Tn,B.TimelineLite=B.TimelineMax=dn,z=new dn({sortChildren:!1,defaults:f,autoRemoveChildren:!0,id:`root`,smoothChildTiming:!0}),d.stringFilter=Kt;var Bn=[],Vn={},Hn=[],Un=0,Wn=0,Gn=function(e){return(Vn[e]||Hn).map(function(e){return e()})},Kn=function(){var e=Date.now(),t=[];e-Un>2&&(Gn(`matchMediaInit`),Bn.forEach(function(e){var n=e.queries,r=e.conditions,i,a,o,s;for(a in n)i=ie.matchMedia(n[a]).matches,i&&(o=1),i!==r[a]&&(r[a]=i,s=1);s&&(e.revert(),o&&t.push(e))}),Gn(`matchMediaRevert`),t.forEach(function(e){return e.onMatch(e,function(t){return e.add(null,t)})}),Un=e,Gn(`matchMedia`))},qn=function(){function e(e,t){this.selector=t&&_t(t),this.data=[],this._r=[],this.isReverted=!1,this.id=Wn++,e&&this.add(e)}var t=e.prototype;return t.add=function(e,t,n){T(e)&&(n=t,t=e,e=T);var r=this,i=function(){var e=h,i=r.selector,a;return e&&e!==r&&e.data.push(r),n&&(r.selector=_t(n)),h=r,a=t.apply(r,arguments),T(a)&&r._r.push(a),h=e,r.selector=i,r.isReverted=!1,a};return r.last=i,e===T?i(r,function(e){return r.add(null,e)}):e?r[e]=i:i},t.ignore=function(e){var t=h;h=null,e(this),h=t},t.getTweens=function(){var t=[];return this.data.forEach(function(n){return n instanceof e?t.push.apply(t,n.getTweens()):n instanceof Tn&&!(n.parent&&n.parent.data===`nested`)&&t.push(n)}),t},t.clear=function(){this._r.length=this.data.length=0},t.kill=function(e,t){var n=this;if(e?(function(){for(var t=n.getTweens(),r=n.data.length,i;r--;)i=n.data[r],i.data===`isFlip`&&(i.revert(),i.getChildren(!0,!0,!1).forEach(function(e){return t.splice(t.indexOf(e),1)}));for(t.map(function(e){return{g:e._dur||e._delay||e._sat&&!e._sat.vars.immediateRender?e.globalTime(0):-1/0,t:e}}).sort(function(e,t){return t.g-e.g||-1/0}).forEach(function(t){return t.t.revert(e)}),r=n.data.length;r--;)i=n.data[r],i instanceof dn?i.data!==`nested`&&(i.scrollTrigger&&i.scrollTrigger.revert(),i.kill()):!(i instanceof Tn)&&i.revert&&i.revert(e);n._r.forEach(function(t){return t(e,n)}),n.isReverted=!0})():this.data.forEach(function(e){return e.kill&&e.kill()}),this.clear(),t){for(var r=Bn.length;r--;)Bn[r].id===this.id&&Bn.splice(r,1);this._mqs&&this._mqs.forEach(function(e){return e.removeListener?e.removeListener(Kn):e.removeEventListener(`change`,Kn)}),this._mqs=null}},t.revert=function(e){this.kill(e||{})},e}(),Jn=function(){function e(e){this.contexts=[],this.scope=e,h&&h.data.push(this)}var t=e.prototype;return t.add=function(e,t,n){O(e)||(e={matches:e});var r=new qn(0,n||this.scope),i=r.conditions={},a,o,s;for(o in h&&!r.selector&&(r.selector=h.selector),this.contexts.push(r),t=r.add(`onMatch`,t),r.queries=e,e)o===`all`?s=1:(a=ie.matchMedia(e[o]),a&&(Bn.indexOf(r)<0&&Bn.push(r),(i[o]=a.matches)&&(s=1),a.addListener?a.addListener(Kn):a.addEventListener(`change`,Kn),(r._mqs||=[]).push(a)));return s&&t(r,function(e){return r.add(null,e)}),this},t.revert=function(e){this.kill(e||{})},t.kill=function(e){this.contexts.forEach(function(t){return t.kill(e,!0)})},e}(),Yn={registerPlugin:function(){[...arguments].forEach(function(e){return Lt(e)})},timeline:function(e){return new dn(e)},getTweensOf:function(e,t){return z.getTweensOf(e,t)},getProperty:function(e,t,n,r){w(e)&&(e=gt(e)[0]);var i=xe(e||{}).get,a=n?Ae:ke;return n===`native`&&(n=``),e&&(t?a((U[t]&&U[t].get||i)(e,t,n,r)):function(t,n,r){return a((U[t]&&U[t].get||i)(e,t,n,r))})},quickSetter:function(e,t,n){if(e=gt(e),e.length>1){var r=e.map(function(e){return $n.quickSetter(e,t,n)}),i=r.length;return function(e){for(var t=i;t--;)r[t](e)}}e=e[0]||{};var a=U[t],o=xe(e),s=o.harness&&(o.harness.aliases||{})[t]||t,c=a?function(t){var r=new a;Ft._pt=0,r.init(e,n?t+n:t,Ft,0,[e]),r.render(1,r),Ft._pt&&Pn(1,Ft)}:o.set(e,s);return a?c:function(t){return c(e,s,n?t+n:t,o,1)}},quickTo:function(e,t,n){var r,i=$n.to(e,je((r={},r[t]=`+=0.1`,r.paused=!0,r.stagger=0,r),n||{})),a=function(e,n,r){return i.resetTo(t,e,n,r)};return a.tween=i,a},isTweening:function(e){return z.getTweensOf(e,!0).length>0},defaults:function(e){return e&&e.ease&&(e.ease=rn(e.ease,f.ease)),Pe(f,e||{})},config:function(e){return Pe(d,e||{})},registerEffect:function(e){var t=e.name,n=e.effect,r=e.plugins,i=e.defaults,a=e.extendTimeline;(r||``).split(`,`).forEach(function(e){return e&&!U[e]&&!B[e]&&ue(t+` effect requires `+e+` plugin.`)}),W[t]=function(e,t,r){return n(gt(e),je(t||{},i),r)},a&&(dn.prototype[t]=function(e,n,r){return this.add(W[t](e,O(n)?n:(r=n)&&{},this),r)})},registerEase:function(e,t){Xt[e]=rn(t)},parseEase:function(e,t){return arguments.length?rn(e,t):Xt},getById:function(e){return z.getById(e)},exportRoot:function(e,t){e===void 0&&(e={});var n=new dn(e),r,i;for(n.smoothChildTiming=k(e.smoothChildTiming),z.remove(n),n._dp=0,n._time=n._tTime=z._time,r=z._first;r;)i=r._next,(t||!(!r._dur&&r instanceof Tn&&r.vars.onComplete===r._targets[0]))&&Ze(n,r,r._start-r._delay),r=i;return Ze(z,n,0),n},context:function(e,t){return e?new qn(e,t):h},matchMedia:function(e){return new Jn(e)},matchMediaRefresh:function(){return Bn.forEach(function(e){var t=e.conditions,n,r;for(r in t)t[r]&&(t[r]=!1,n=1);n&&e.revert()})||Kn()},addEventListener:function(e,t){var n=Vn[e]||(Vn[e]=[]);~n.indexOf(t)||n.push(t)},removeEventListener:function(e,t){var n=Vn[e],r=n&&n.indexOf(t);r>=0&&n.splice(r,1)},utils:{wrap:Dt,wrapYoyo:Ot,distribute:yt,random:St,snap:xt,normalize:Tt,getUnit:dt,clamp:ft,splitColor:Vt,toArray:gt,selector:_t,mapRange:At,pipe:Ct,unitize:wt,interpolate:jt,shuffle:vt},install:V,effects:W,ticker:Jt,updateRoot:dn.updateRoot,plugins:U,globalTimeline:z,core:{PropTween:zn,globals:de,Tween:Tn,Timeline:dn,Animation:un,getCache:xe,_removeLinkedListItem:ze,reverting:function(){return m},context:function(e){return e&&h&&(h.data.push(e),e._ctx=h),h},suppressOverwrites:function(e){return p=e}}};Ce(`to,from,fromTo,delayedCall,set,killTweensOf`,function(e){return Yn[e]=Tn[e]}),Jt.add(dn.updateRoot),Ft=Yn.to({},{duration:0});var Xn=function(e,t){for(var n=e._pt;n&&n.p!==t&&n.op!==t&&n.fp!==t;)n=n._next;return n},Zn=function(e,t){var n=e._targets,r,i,a;for(r in t)for(i=n.length;i--;)a=e._ptLookup[i][r],(a&&=a.d)&&(a._pt&&(a=Xn(a,r)),a&&a.modifier&&a.modifier(t[r],e,n[i],r))},Qn=function(e,t){return{name:e,headless:1,rawVars:1,init:function(e,n,r){r._onInit=function(e){var r,i;if(w(n)&&(r={},Ce(n,function(e){return r[e]=1}),n=r),t){for(i in r={},n)r[i]=t(n[i]);n=r}Zn(e,n)}}}},$n=Yn.registerPlugin({name:`attr`,init:function(e,t,n,r,i){var a,o,s;for(a in this.tween=n,t)s=e.getAttribute(a)||``,o=this.add(e,`setAttribute`,(s||0)+``,t[a],r,i,0,0,a),o.op=a,o.b=s,this._props.push(a)},render:function(e,t){for(var n=t._pt;n;)m?n.set(n.t,n.p,n.b,n):n.r(e,n.d),n=n._next}},{name:`endArray`,headless:1,init:function(e,t){for(var n=t.length;n--;)this.add(e,n,e[n]||0,t[n],0,0,0,0,0,1)}},Qn(`roundProps`,bt),Qn(`modifiers`),Qn(`snap`,xt))||Yn;Tn.version=dn.version=$n.version=`3.15.1`,ce=1,A()&&Yt(),Xt.Power0,Xt.Power1,Xt.Power2,Xt.Power3,Xt.Power4,Xt.Linear,Xt.Quad,Xt.Cubic,Xt.Quart,Xt.Quint,Xt.Strong,Xt.Elastic,Xt.Back,Xt.SteppedEase,Xt.Bounce,Xt.Sine,Xt.Expo,Xt.Circ;var er,tr,nr,rr,ir,ar,or,sr=function(){return typeof window<`u`},cr={},lr=180/Math.PI,ur=Math.PI/180,dr=Math.atan2,fr=1e8,pr=/([A-Z])/g,mr=/(left|right|width|margin|padding|x)/i,hr=/[\s,\(]\S/,gr={autoAlpha:`opacity,visibility`,scale:`scaleX,scaleY`,alpha:`opacity`},_r=function(e,t){return t.set(t.t,t.p,Math.round((t.s+t.c*e)*1e4)/1e4+t.u,t)},vr=function(e,t){return t.set(t.t,t.p,e===1?t.e:Math.round((t.s+t.c*e)*1e4)/1e4+t.u,t)},yr=function(e,t){return t.set(t.t,t.p,e?Math.round((t.s+t.c*e)*1e4)/1e4+t.u:t.b,t)},br=function(e,t){return t.set(t.t,t.p,e===1?t.e:e?Math.round((t.s+t.c*e)*1e4)/1e4+t.u:t.b,t)},xr=function(e,t){var n=t.s+t.c*e;t.set(t.t,t.p,~~(n+(n<0?-.5:.5))+t.u,t)},Sr=function(e,t){return t.set(t.t,t.p,e?t.e:t.b,t)},Cr=function(e,t){return t.set(t.t,t.p,e===1?t.e:t.b,t)},wr=function(e,t,n){return e.style[t]=n},Tr=function(e,t,n){return e.style.setProperty(t,n)},Er=function(e,t,n){return e._gsap[t]=n},Dr=function(e,t,n){return e._gsap.scaleX=e._gsap.scaleY=n},Or=function(e,t,n,r,i){var a=e._gsap;a.scaleX=a.scaleY=n,a.renderTransform(i,a)},kr=function(e,t,n,r,i){var a=e._gsap;a[t]=n,a.renderTransform(i,a)},Ar=`transform`,jr=Ar+`Origin`,Mr=function e(t,n){var r=this,i=this.target,a=i.style,o=i._gsap;if(t in cr&&a){if(this.tfm=this.tfm||{},t!==`transform`)t=gr[t]||t,~t.indexOf(`,`)?t.split(`,`).forEach(function(e){return r.tfm[e]=Zr(i,e)}):this.tfm[t]=o.x?o[t]:Zr(i,t),t===jr&&(this.tfm.zOrigin=o.zOrigin);else return gr.transform.split(`,`).forEach(function(t){return e.call(r,t,n)});if(this.props.indexOf(Ar)>=0)return;o.svg&&(this.svgo=i.getAttribute(`data-svg-origin`),this.props.push(jr,n,``)),t=Ar}(a||n)&&this.props.push(t,n,a[t])},Nr=function(e){e.translate&&(e.removeProperty(`translate`),e.removeProperty(`scale`),e.removeProperty(`rotate`))},Pr=function(){for(var e=this.props,t=this.target,n=t.style,r=t._gsap,i=0,a;i<e.length;i+=3)e[i+1]?e[i+1]===2?t[e[i]](e[i+2]):t[e[i]]=e[i+2]:e[i+2]?n[e[i]]=e[i+2]:n.removeProperty(e[i].substr(0,2)===`--`?e[i]:e[i].replace(pr,`-$1`).toLowerCase());if(this.tfm){for(a in this.tfm)r[a]=this.tfm[a];r.svg&&(r.renderTransform(),t.setAttribute(`data-svg-origin`,this.svgo||``)),i=or(),i&&i.isStart||n[Ar]||(Nr(n),r.zOrigin&&n[jr]&&(n[jr]+=` `+r.zOrigin+`px`,r.zOrigin=0,r.renderTransform()),r.uncache=1)}},Fr=function(e,t){var n={target:e,props:[],revert:Pr,save:Mr};return e._gsap||$n.core.getCache(e),t&&e.style&&e.nodeType&&t.split(`,`).forEach(function(e){return n.save(e)}),n},Ir,Lr=function(e,t){var n=tr.createElementNS?tr.createElementNS((t||`http://www.w3.org/1999/xhtml`).replace(/^https/,`http`),e):tr.createElement(e);return n&&n.style?n:tr.createElement(e)},Rr=function e(t,n,r){var i=getComputedStyle(t);return i[n]||i.getPropertyValue(n.replace(pr,`-$1`).toLowerCase())||i.getPropertyValue(n)||!r&&e(t,Br(n)||n,1)||``},zr=`O,Moz,ms,Ms,Webkit`.split(`,`),Br=function(e,t,n){var r=(t||ir).style,i=5;if(e in r&&!n)return e;for(e=e.charAt(0).toUpperCase()+e.substr(1);i--&&!(zr[i]+e in r););return i<0?null:(i===3?`ms`:i>=0?zr[i]:``)+e},Vr=function(){sr()&&window.document&&(er=window,tr=er.document,nr=tr.documentElement,ir=Lr(`div`)||{style:{}},Lr(`div`),Ar=Br(Ar),jr=Ar+`Origin`,ir.style.cssText=`border-width:0;line-height:0;position:absolute;padding:0`,Ir=!!Br(`perspective`),or=$n.core.reverting,rr=1)},Hr=function(e){var t=e.ownerSVGElement,n=Lr(`svg`,t&&t.getAttribute(`xmlns`)||`http://www.w3.org/2000/svg`),r=e.cloneNode(!0),i;r.style.display=`block`,n.appendChild(r),nr.appendChild(n);try{i=r.getBBox()}catch{}return n.removeChild(r),nr.removeChild(n),i},Ur=function(e,t){for(var n=t.length;n--;)if(e.hasAttribute(t[n]))return e.getAttribute(t[n])},Wr=function(e){var t,n;try{t=e.getBBox()}catch{t=Hr(e),n=1}return t&&(t.width||t.height)||n||(t=Hr(e)),t&&!t.width&&!t.x&&!t.y?{x:+Ur(e,[`x`,`cx`,`x1`])||0,y:+Ur(e,[`y`,`cy`,`y1`])||0,width:0,height:0}:t},Gr=function(e){return!(!e.getCTM||e.parentNode&&!e.ownerSVGElement||!Wr(e))},Kr=function(e,t){if(t){var n=e.style,r;t in cr&&t!==jr&&(t=Ar),n.removeProperty?(r=t.substr(0,2),(r===`ms`||t.substr(0,6)===`webkit`)&&(t=`-`+t),n.removeProperty(r===`--`?t:t.replace(pr,`-$1`).toLowerCase())):n.removeAttribute(t)}},qr=function(e,t,n,r,i,a){var o=new zn(e._pt,t,n,0,1,a?Cr:Sr);return e._pt=o,o.b=r,o.e=i,e._props.push(n),o},Jr={deg:1,rad:1,turn:1},Yr={grid:1,flex:1},Xr=function e(t,n,r,i){var a=parseFloat(r)||0,o=(r+``).trim().substr((a+``).length)||`px`,s=ir.style,c=mr.test(n),l=t.tagName.toLowerCase()===`svg`,u=(l?`client`:`offset`)+(c?`Width`:`Height`),d=100,f=i===`px`,p=i===`%`,m,h,g,_;if(i===o||!a||Jr[i]||Jr[o])return a;if(o!==`px`&&!f&&(a=e(t,n,r,`px`)),_=t.getCTM&&Gr(t),(p||o===`%`)&&(cr[n]||~n.indexOf(`adius`)))return m=_?t.getBBox()[c?`width`:`height`]:t[u],q(p?a/m*d:a/100*m);if(s[c?`width`:`height`]=d+(f?o:i),h=i!==`rem`&&~n.indexOf(`adius`)||i===`em`&&t.appendChild&&!l?t:t.parentNode,_&&(h=(t.ownerSVGElement||{}).parentNode),h&&h!==tr&&h.appendChild||(h=tr.body),g=h._gsap,g&&p&&g.width&&c&&g.time===Jt.time&&!g.uncache)return q(a/g.width*d);if(p&&(n===`height`||n===`width`)){var v=t.style[n];t.style[n]=d+i,m=t[u],v?t.style[n]=v:Kr(t,n)}else(p||o===`%`)&&!Yr[Rr(h,`display`)]&&(s.position=Rr(t,`position`)),h===t&&(s.position=`static`),h.appendChild(ir),m=ir[u],h.removeChild(ir),s.position=`absolute`;return c&&p&&(g=xe(h),g.time=Jt.time,g.width=h[u]),q(f?m*a/d:m&&a?d/m*a:0)},Zr=function(e,t,n,r){var i;return rr||Vr(),t in gr&&t!==`transform`&&(t=gr[t],~t.indexOf(`,`)&&(t=t.split(`,`)[0])),cr[t]&&t!==`transform`?(i=li(e,r),i=t===`transformOrigin`?i.svg?i.origin:ui(Rr(e,jr))+` `+i.zOrigin+`px`:i[t]):(i=e.style[t],(!i||i===`auto`||r||~(i+``).indexOf(`calc(`))&&(i=ni[t]&&ni[t](e,t,n)||Rr(e,t)||Se(e,t)||+(t===`opacity`))),n&&!~(i+``).trim().indexOf(` `)?Xr(e,t,i,n)+n:i},Qr=function(e,t,n,r){if(!n||n===`none`){var i=Br(t,e,1),a=i&&Rr(e,i,1);a&&a!==n?(t=i,n=a):t===`borderColor`&&(n=Rr(e,`borderTopColor`))}var o=new zn(this._pt,e.style,t,0,1,Nn),s=0,c=0,l,u,f,p,m,h,g,_,v,y,b,x;if(o.b=n,o.e=r,n+=``,r+=``,r.substring(0,6)===`var(--`&&(r=Rr(e,r.substring(4,r.indexOf(`)`)))),r===`auto`&&(h=e.style[t],e.style[t]=r,r=Rr(e,t)||r,h?e.style[t]=h:Kr(e,t)),l=[n,r],Kt(l),n=l[0],r=l[1],f=n.match(L)||[],x=r.match(L)||[],x.length){for(;u=L.exec(r);)g=u[0],v=r.substring(s,u.index),m?m=(m+1)%5:(v.substr(-5)===`rgba(`||v.substr(-5)===`hsla(`)&&(m=1),g!==(h=f[c++]||``)&&(p=parseFloat(h)||0,b=h.substr((p+``).length),g.charAt(1)===`=`&&(g=J(p,g)+b),_=parseFloat(g),y=g.substr((_+``).length),s=L.lastIndex-y.length,y||(y=y||d.units[t]||b,s===r.length&&(r+=y,o.e+=y)),b!==y&&(p=Xr(e,t,h,y)||0),o._pt={_next:o._pt,p:v||c===1?v:`,`,s:p,c:_-p,m:m&&m<4||t===`zIndex`?Math.round:0});o.c=s<r.length?r.substring(s,r.length):``}else o.r=t===`display`&&r===`none`?Cr:Sr;return ne.test(r)&&(o.e=0),this._pt=o,o},$r={top:`0%`,bottom:`100%`,left:`0%`,right:`100%`,center:`50%`},ei=function(e){var t=e.split(` `),n=t[0],r=t[1]||`50%`;return(n===`top`||n===`bottom`||r===`left`||r===`right`)&&(e=n,n=r,r=e),t[0]=$r[n]||n,t[1]=$r[r]||r,t.join(` `)},ti=function(e,t){if(t.tween&&t.tween._time===t.tween._dur){var n=t.t,r=n.style,i=t.u,a=n._gsap,o,s,c;if(i===`all`||i===!0)r.cssText=``,s=1;else for(i=i.split(`,`),c=i.length;--c>-1;)o=i[c],cr[o]&&(s=1,o=o===`transformOrigin`?jr:Ar),Kr(n,o);s&&(Kr(n,Ar),a&&(a.svg&&n.removeAttribute(`transform`),r.scale=r.rotate=r.translate=`none`,li(n,1),a.uncache=1,Nr(r)))}},ni={clearProps:function(e,t,n,r,i){if(i.data!==`isFromStart`){var a=e._pt=new zn(e._pt,t,n,0,0,ti);return a.u=r,a.pr=-10,a.tween=i,e._props.push(n),1}}},ri=[1,0,0,1,0,0],ii={},ai=function(e){return e===`matrix(1, 0, 0, 1, 0, 0)`||e===`none`||!e},oi=function(e){var t=Rr(e,Ar);return ai(t)?ri:t.substr(7).match(ee).map(q)},si=function(e,t){var n=e._gsap||xe(e),r=e.style,i=oi(e),a,o,s,c;return n.svg&&e.getAttribute(`transform`)?(s=e.transform.baseVal.consolidate().matrix,i=[s.a,s.b,s.c,s.d,s.e,s.f],i.join(`,`)===`1,0,0,1,0,0`?ri:i):(i===ri&&!e.offsetParent&&e!==nr&&!n.svg&&(s=r.display,r.display=`block`,a=e.parentNode,a&&(e.offsetParent||e.getBoundingClientRect().width)||(c=1,o=e.nextElementSibling,nr.appendChild(e)),i=oi(e),s?r.display=s:Kr(e,`display`),c&&(o?a.insertBefore(e,o):a?a.appendChild(e):nr.removeChild(e))),t&&i.length>6?[i[0],i[1],i[4],i[5],i[12],i[13]]:i)},ci=function(e,t,n,r,i,a){var o=e._gsap,s=i||si(e,!0),c=o.xOrigin||0,l=o.yOrigin||0,u=o.xOffset||0,d=o.yOffset||0,f=s[0],p=s[1],m=s[2],h=s[3],g=s[4],_=s[5],v=t.split(` `),y=parseFloat(v[0])||0,b=parseFloat(v[1])||0,x,S,C,w;n?s!==ri&&(S=f*h-p*m)&&(C=h/S*y+b*(-m/S)+(m*_-h*g)/S,w=y*(-p/S)+f/S*b-(f*_-p*g)/S,y=C,b=w):(x=Wr(e),y=x.x+(~v[0].indexOf(`%`)?y/100*x.width:y),b=x.y+(~(v[1]||v[0]).indexOf(`%`)?b/100*x.height:b)),r||r!==!1&&o.smooth?(g=y-c,_=b-l,o.xOffset=u+(g*f+_*m)-g,o.yOffset=d+(g*p+_*h)-_):o.xOffset=o.yOffset=0,o.xOrigin=y,o.yOrigin=b,o.smooth=!!r,o.origin=t,o.originIsAbsolute=!!n,e.style[jr]=`0px 0px`,a&&(qr(a,o,`xOrigin`,c,y),qr(a,o,`yOrigin`,l,b),qr(a,o,`xOffset`,u,o.xOffset),qr(a,o,`yOffset`,d,o.yOffset)),e.setAttribute(`data-svg-origin`,y+` `+b)},li=function(e,t){var n=e._gsap||new ln(e);if(`x`in n&&!t&&!n.uncache)return n;var r=e.style,i=n.scaleX<0,a=`px`,o=`deg`,s=getComputedStyle(e),c=Rr(e,jr)||`0`,l=u=f=h=g=_=v=y=b=0,u,f,p=m=1,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,ee,L,te,ne,R;return n.svg=!!(e.getCTM&&Gr(e)),s.translate&&((s.translate!==`none`||s.scale!==`none`||s.rotate!==`none`)&&(r[Ar]=(s.translate===`none`?``:`translate3d(`+(s.translate+` 0 0`).split(` `).slice(0,3).join(`, `)+`) `)+(s.rotate===`none`?``:`rotate(`+s.rotate+`) `)+(s.scale===`none`?``:`scale(`+s.scale.split(` `).join(`,`)+`) `)+(s[Ar]===`none`?``:s[Ar])),r.scale=r.rotate=r.translate=`none`),C=si(e,n.svg),n.svg&&(n.uncache?(P=e.getBBox(),c=n.xOrigin-P.x+`px `+(n.yOrigin-P.y)+`px`,N=``):N=!t&&e.getAttribute(`data-svg-origin`),ci(e,N||c,!!N||n.originIsAbsolute,n.smooth!==!1,C)),x=n.xOrigin||0,S=n.yOrigin||0,C!==ri&&(D=C[0],O=C[1],k=C[2],A=C[3],l=j=C[4],u=M=C[5],C.length===6?(p=Math.sqrt(D*D+O*O),m=Math.sqrt(A*A+k*k),h=D||O?dr(O,D)*lr:0,v=k||A?dr(k,A)*lr+h:0,v&&(m*=Math.abs(Math.cos(v*ur))),n.svg&&(l-=x-(x*D+S*k),u-=S-(x*O+S*A))):(R=C[6],te=C[7],I=C[8],ee=C[9],L=C[10],ne=C[11],l=C[12],u=C[13],f=C[14],w=dr(R,L),g=w*lr,w&&(T=Math.cos(-w),E=Math.sin(-w),N=j*T+I*E,P=M*T+ee*E,F=R*T+L*E,I=j*-E+I*T,ee=M*-E+ee*T,L=R*-E+L*T,ne=te*-E+ne*T,j=N,M=P,R=F),w=dr(-k,L),_=w*lr,w&&(T=Math.cos(-w),E=Math.sin(-w),N=D*T-I*E,P=O*T-ee*E,F=k*T-L*E,ne=A*E+ne*T,D=N,O=P,k=F),w=dr(O,D),h=w*lr,w&&(T=Math.cos(w),E=Math.sin(w),N=D*T+O*E,P=j*T+M*E,O=O*T-D*E,M=M*T-j*E,D=N,j=P),g&&Math.abs(g)+Math.abs(h)>359.9&&(g=h=0,_=180-_),p=q(Math.sqrt(D*D+O*O+k*k)),m=q(Math.sqrt(M*M+R*R)),w=dr(j,M),v=Math.abs(w)>2e-4?w*lr:0,b=ne?1/(ne<0?-ne:ne):0),n.svg&&(N=e.getAttribute(`transform`),n.forceCSS=e.setAttribute(`transform`,``)||!ai(Rr(e,Ar)),N&&e.setAttribute(`transform`,N))),Math.abs(v)>90&&Math.abs(v)<270&&(i?(p*=-1,v+=h<=0?180:-180,h+=h<=0?180:-180):(m*=-1,v+=v<=0?180:-180)),t||=n.uncache,n.x=l-((n.xPercent=l&&(!t&&n.xPercent||(Math.round(e.offsetWidth/2)===Math.round(-l)?-50:0)))?e.offsetWidth*n.xPercent/100:0)+a,n.y=u-((n.yPercent=u&&(!t&&n.yPercent||(Math.round(e.offsetHeight/2)===Math.round(-u)?-50:0)))?e.offsetHeight*n.yPercent/100:0)+a,n.z=f+a,n.scaleX=q(p),n.scaleY=q(m),n.rotation=q(h)+o,n.rotationX=q(g)+o,n.rotationY=q(_)+o,n.skewX=v+o,n.skewY=y+o,n.transformPerspective=b+a,(n.zOrigin=parseFloat(c.split(` `)[2])||!t&&n.zOrigin||0)&&(r[jr]=ui(c)),n.xOffset=n.yOffset=0,n.force3D=d.force3D,n.renderTransform=n.svg?_i:Ir?gi:fi,n.uncache=0,n},ui=function(e){return(e=e.split(` `))[0]+` `+e[1]},di=function(e,t,n){var r=dt(t);return q(parseFloat(t)+parseFloat(Xr(e,`x`,n+`px`,r)))+r},fi=function(e,t){t.z=`0px`,t.rotationY=t.rotationX=`0deg`,t.force3D=0,gi(e,t)},pi=`0deg`,mi=`0px`,hi=`) `,gi=function(e,t){var n=t||this,r=n.xPercent,i=n.yPercent,a=n.x,o=n.y,s=n.z,c=n.rotation,l=n.rotationY,u=n.rotationX,d=n.skewX,f=n.skewY,p=n.scaleX,m=n.scaleY,h=n.transformPerspective,g=n.force3D,_=n.target,v=n.zOrigin,y=``,b=g===`auto`&&e&&e!==1||g===!0;if(v&&(u!==pi||l!==pi)){var x=parseFloat(l)*ur,S=Math.sin(x),C=Math.cos(x),w;x=parseFloat(u)*ur,w=Math.cos(x),a=di(_,a,S*w*-v),o=di(_,o,-Math.sin(x)*-v),s=di(_,s,C*w*-v+v)}h!==mi&&(y+=`perspective(`+h+hi),(r||i)&&(y+=`translate(`+r+`%, `+i+`%) `),(b||a!==mi||o!==mi||s!==mi)&&(y+=s!==mi||b?`translate3d(`+a+`, `+o+`, `+s+`) `:`translate(`+a+`, `+o+hi),c!==pi&&(y+=`rotate(`+c+hi),l!==pi&&(y+=`rotateY(`+l+hi),u!==pi&&(y+=`rotateX(`+u+hi),(d!==pi||f!==pi)&&(y+=`skew(`+d+`, `+f+hi),(p!==1||m!==1)&&(y+=`scale(`+p+`, `+m+hi),_.style[Ar]=y||`translate(0, 0)`},_i=function(e,t){var n=t||this,r=n.xPercent,i=n.yPercent,a=n.x,o=n.y,s=n.rotation,c=n.skewX,l=n.skewY,u=n.scaleX,d=n.scaleY,f=n.target,p=n.xOrigin,m=n.yOrigin,h=n.xOffset,g=n.yOffset,_=n.forceCSS,v=parseFloat(a),y=parseFloat(o),b,x,S,C,w;s=parseFloat(s),c=parseFloat(c),l=parseFloat(l),l&&(l=parseFloat(l),c+=l,s+=l),s||c?(s*=ur,c*=ur,b=Math.cos(s)*u,x=Math.sin(s)*u,S=Math.sin(s-c)*-d,C=Math.cos(s-c)*d,c&&(l*=ur,w=Math.tan(c-l),w=Math.sqrt(1+w*w),S*=w,C*=w,l&&(w=Math.tan(l),w=Math.sqrt(1+w*w),b*=w,x*=w)),b=q(b),x=q(x),S=q(S),C=q(C)):(b=u,C=d,x=S=0),(v&&!~(a+``).indexOf(`px`)||y&&!~(o+``).indexOf(`px`))&&(v=Xr(f,`x`,a,`px`),y=Xr(f,`y`,o,`px`)),(p||m||h||g)&&(v=q(v+p-(p*b+m*S)+h),y=q(y+m-(p*x+m*C)+g)),(r||i)&&(w=f.getBBox(),v=q(v+r/100*w.width),y=q(y+i/100*w.height)),w=`matrix(`+b+`,`+x+`,`+S+`,`+C+`,`+v+`,`+y+`)`,f.setAttribute(`transform`,w),_&&(f.style[Ar]=w)},vi=function(e,t,n,r,i){var a=360,o=w(i),s=parseFloat(i)*(o&&~i.indexOf(`rad`)?lr:1)-r,c=r+s+`deg`,l,u;return o&&(l=i.split(`_`)[1],l===`short`&&(s%=a,s!==s%(a/2)&&(s+=s<0?a:-a)),l===`cw`&&s<0?s=(s+a*fr)%a-~~(s/a)*a:l===`ccw`&&s>0&&(s=(s-a*fr)%a-~~(s/a)*a)),e._pt=u=new zn(e._pt,t,n,r,s,vr),u.e=c,u.u=`deg`,e._props.push(n),u},yi=function(e,t){for(var n in t)e[n]=t[n];return e},bi=function(e,t,n){var r=yi({},n._gsap),i=`perspective,force3D,transformOrigin,svgOrigin`,a=n.style,o,s,c,l,u,d,f,p;for(s in r.svg?(c=n.getAttribute(`transform`),n.setAttribute(`transform`,``),a[Ar]=t,o=li(n,1),Kr(n,Ar),n.setAttribute(`transform`,c)):(c=getComputedStyle(n)[Ar],a[Ar]=t,o=li(n,1),a[Ar]=c),cr)c=r[s],l=o[s],c!==l&&i.indexOf(s)<0&&(f=dt(c),p=dt(l),u=f===p?parseFloat(c):Xr(n,s,c,p),d=parseFloat(l),e._pt=new zn(e._pt,o,s,u,d-u,_r),e._pt.u=p||0,e._props.push(s));yi(o,r)};Ce(`padding,margin,Width,Radius`,function(e,t){var n=`Top`,r=`Right`,i=`Bottom`,a=`Left`,o=(t<3?[n,r,i,a]:[n+a,n+r,i+r,i+a]).map(function(n){return t<2?e+n:`border`+n+e});ni[t>1?`border`+e:e]=function(e,t,n,r,i){var a,s;if(arguments.length<4)return a=o.map(function(t){return Zr(e,t,n)}),s=a.join(` `),s.split(a[0]).length===5?a[0]:s;a=(r+``).split(` `),s={},o.forEach(function(e,t){return s[e]=a[t]=a[t]||a[(t-1)/2|0]}),e.init(t,s,i)}});var xi={name:`css`,register:Vr,targetTest:function(e){return e.style&&e.nodeType},init:function(e,t,n,r,i){var a=this._props,o=e.style,s=n.vars.startAt,c,l,u,f,p,m,h,g,_,v,y,b,x,S,C,T,E;for(h in rr||Vr(),this.styles=this.styles||Fr(e),T=this.styles.props,this.tween=n,t)if(h!==`autoRound`&&(l=t[h],!(U[h]&&hn(h,t,n,r,e,i)))){if(p=typeof l,m=ni[h],p===`function`&&(l=l.call(n,r,e,i),p=typeof l),p===`string`&&~l.indexOf(`random(`)&&(l=kt(l)),m)m(this,e,h,l,n)&&(C=1);else if(h.substr(0,2)===`--`)c=(getComputedStyle(e).getPropertyValue(h)+``).trim(),l+=``,Wt.lastIndex=0,Wt.test(c)||(g=dt(c),_=dt(l),_?g!==_&&(c=Xr(e,h,c,_)+_):g&&(l+=g)),this.add(o,`setProperty`,c,l,r,i,0,0,h),a.push(h),T.push(h,0,o[h]);else if(p!==`undefined`){if(s&&h in s?(c=typeof s[h]==`function`?s[h].call(n,r,e,i):s[h],w(c)&&~c.indexOf(`random(`)&&(c=kt(c)),dt(c+``)||c===`auto`||(c+=d.units[h]||dt(Zr(e,h))||``),(c+``).charAt(1)===`=`&&(c=Zr(e,h))):c=Zr(e,h),f=parseFloat(c),v=p===`string`&&l.charAt(1)===`=`&&l.substr(0,2),v&&(l=l.substr(2)),u=parseFloat(l),h in gr&&(h===`autoAlpha`&&(f===1&&Zr(e,`visibility`)===`hidden`&&u&&(f=0),T.push(`visibility`,0,o.visibility),qr(this,o,`visibility`,f?`inherit`:`hidden`,u?`inherit`:`hidden`,!u)),h!==`scale`&&h!==`transform`&&(h=gr[h],~h.indexOf(`,`)&&(h=h.split(`,`)[0]))),y=h in cr,y){if(this.styles.save(h),E=l,p===`string`&&l.substring(0,6)===`var(--`){if(l=Rr(e,l.substring(4,l.indexOf(`)`))),l.substring(0,5)===`calc(`){var D=e.style.perspective;e.style.perspective=l,l=Rr(e,`perspective`),D?e.style.perspective=D:Kr(e,`perspective`)}u=parseFloat(l)}if(b||(x=e._gsap,x.renderTransform&&!t.parseTransform||li(e,t.parseTransform),S=t.smoothOrigin!==!1&&x.smooth,b=this._pt=new zn(this._pt,o,Ar,0,1,x.renderTransform,x,0,-1),b.dep=1),h===`scale`)this._pt=new zn(this._pt,x,`scaleY`,x.scaleY,(v?J(x.scaleY,v+u):u)-x.scaleY||0,_r),this._pt.u=0,a.push(`scaleY`,h),h+=`X`;else if(h===`transformOrigin`){T.push(jr,0,o[jr]),l=ei(l),x.svg?ci(e,l,0,S,0,this):(_=parseFloat(l.split(` `)[2])||0,_!==x.zOrigin&&qr(this,x,`zOrigin`,x.zOrigin,_),qr(this,o,h,ui(c),ui(l)));continue}else if(h===`svgOrigin`){ci(e,l,1,S,0,this);continue}else if(h in ii){vi(this,x,h,f,v?J(f,v+l):l);continue}else if(h===`smoothOrigin`){qr(this,x,`smooth`,x.smooth,l);continue}else if(h===`force3D`){x[h]=l;continue}else if(h===`transform`){bi(this,l,e);continue}}else h in o||(h=Br(h)||h);if(y||(u||u===0)&&(f||f===0)&&!hr.test(l)&&h in o)g=(c+``).substr((f+``).length),u||=0,_=dt(l)||(h in d.units?d.units[h]:g),g!==_&&(f=Xr(e,h,c,_)),this._pt=new zn(this._pt,y?x:o,h,f,(v?J(f,v+u):u)-f,!y&&(_===`px`||h===`zIndex`)&&t.autoRound!==!1?xr:_r),this._pt.u=_||0,y&&E!==l?(this._pt.b=c,this._pt.e=E,this._pt.r=br):g!==_&&_!==`%`&&(this._pt.b=c,this._pt.r=yr);else if(h in o)Qr.call(this,e,h,c,v?v+l:l);else if(h in e)this.add(e,h,c||e[h],v?v+l:l,r,i);else if(h!==`parseTransform`){le(h,l);continue}y||(h in o?T.push(h,0,o[h]):typeof e[h]==`function`?T.push(h,2,e[h]()):T.push(h,1,c||e[h])),a.push(h)}}C&&Rn(this)},render:function(e,t){if(t.tween._time||!or())for(var n=t._pt;n;)n.r(e,n.d),n=n._next;else t.styles.revert()},get:Zr,aliases:gr,getSetter:function(e,t,n){var r=gr[t];return r&&r.indexOf(`,`)<0&&(t=r),t in cr&&t!==jr&&(e._gsap.x||Zr(e,`x`))?n&&ar===n?t===`scale`?Dr:Er:(ar=n||{})&&(t===`scale`?Or:kr):e.style&&!D(e.style[t])?wr:~t.indexOf(`-`)?Tr:An(e,t)},core:{_removeProperty:Kr,_getMatrix:si}};$n.utils.checkPrefix=Br,$n.core.getStyleSaver=Fr,(function(e,t,n,r){var i=Ce(e+`,`+t+`,`+n,function(e){cr[e]=1});Ce(t,function(e){d.units[e]=`deg`,ii[e]=1}),gr[i[13]]=e+`,`+t,Ce(r,function(e){var t=e.split(`:`);gr[t[1]]=i[t[0]]})})(`x,y,z,scale,scaleX,scaleY,xPercent,yPercent`,`rotation,rotationX,rotationY,skewX,skewY`,`transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective`,`0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY`),Ce(`x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective`,function(e){d.units[e]=`px`}),$n.registerPlugin(xi);var Si=$n.registerPlugin(xi)||$n;Si.core.Tween;function Ci(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,`value`in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function wi(e,t,n){return t&&Ci(e.prototype,t),n&&Ci(e,n),e}var Ti,Ei,Di,Oi,ki,Ai,ji,Mi,Ni,Pi,Fi,Ii,Li,Ri=function(){return Ti||typeof window<`u`&&(Ti=window.gsap)&&Ti.registerPlugin&&Ti},zi=1,Bi=[],Vi=[],Hi=[],Ui=Date.now,Wi=function(e,t){return t},Gi=function(){var e=Ni.core,t=e.bridge||{},n=e._scrollers,r=e._proxies;n.push.apply(n,Vi),r.push.apply(r,Hi),Vi=n,Hi=r,Wi=function(e,n){return t[e](n)}},Ki=function(e,t){return~Hi.indexOf(e)&&Hi[Hi.indexOf(e)+1][t]},qi=function(e){return!!~Pi.indexOf(e)},Ji=function(e,t,n,r,i){return e.addEventListener(t,n,{passive:r!==!1,capture:!!i})},Yi=function(e,t,n,r){return e.removeEventListener(t,n,!!r)},Xi=`scrollLeft`,Zi=`scrollTop`,Qi=function(){return Fi&&Fi.isPressed||Vi.cache++},$i=function(e,t){var n=function n(r){if(r||r===0){zi&&Di.history.scrollRestoration!==`manual`&&(Di.history.scrollRestoration=`manual`);var i=Fi&&Fi.isPressed;r=n.v=Math.round(r)||(Fi&&Fi.iOS?1:0),e(r),n.cacheID=Vi.cache,i&&Wi(`ss`,r)}else(t||Vi.cache!==n.cacheID||Wi(`ref`))&&(n.cacheID=Vi.cache,n.v=e());return n.v+n.offset};return n.offset=0,e&&n},ea={s:Xi,p:`left`,p2:`Left`,os:`right`,os2:`Right`,d:`width`,d2:`Width`,a:`x`,sc:$i(function(e){return arguments.length?Di.scrollTo(e,ta.sc()):Di.pageXOffset||Oi[Xi]||ki[Xi]||Ai[Xi]||0})},ta={s:Zi,p:`top`,p2:`Top`,os:`bottom`,os2:`Bottom`,d:`height`,d2:`Height`,a:`y`,op:ea,sc:$i(function(e){return arguments.length?Di.scrollTo(ea.sc(),e):Di.pageYOffset||Oi[Zi]||ki[Zi]||Ai[Zi]||0})},na=function(e,t){return(t&&t._ctx&&t._ctx.selector||Ti.utils.toArray)(e)[0]||(typeof e==`string`&&Ti.config().nullTargetWarn!==!1?console.warn(`Element not found:`,e):null)},ra=function(e,t){for(var n=t.length;n--;)if(t[n]===e||t[n].contains(e))return!0;return!1},ia=function(e,t){var n=t.s,r=t.sc;qi(e)&&(e=Oi.scrollingElement||ki);var i=Vi.indexOf(e),a=r===ta.sc?1:2;!~i&&(i=Vi.push(e)-1),Vi[i+a]||Ji(e,`scroll`,Qi);var o=Vi[i+a],s=o||(Vi[i+a]=$i(Ki(e,n),!0)||(qi(e)?r:$i(function(t){return arguments.length?e[n]=t:e[n]})));return s.target=e,o||(s.smooth=Ti.getProperty(e,`scrollBehavior`)===`smooth`),s},aa=function(e,t,n){var r=e,i=e,a=Ui(),o=a,s=t||50,c=Math.max(500,s*3),l=function(e,t){var c=Ui();t||c-a>s?(i=r,r=e,o=a,a=c):n?r+=e:r=i+(e-i)/(c-o)*(a-o)};return{update:l,reset:function(){i=r=n?0:r,o=a=0},getVelocity:function(e){var t=o,s=i,u=Ui();return(e||e===0)&&e!==r&&l(e),a===o||u-o>c?0:(r+(n?s:-s))/((n?u:a)-t)*1e3}}},oa=function(e,t){return t&&!e._gsapAllow&&e.cancelable!==!1&&e.preventDefault(),e.changedTouches?e.changedTouches[0]:e},sa=function(e){var t=Math.max.apply(Math,e),n=Math.min.apply(Math,e);return Math.abs(t)>=Math.abs(n)?t:n},ca=function(){Ni=Ti.core.globals().ScrollTrigger,Ni&&Ni.core&&Gi()},la=function(e){return Ti=e||Ri(),!Ei&&Ti&&typeof document<`u`&&document.body&&(Di=window,Oi=document,ki=Oi.documentElement,Ai=Oi.body,Pi=[Di,Oi,ki,Ai],Ti.utils.clamp,Li=Ti.core.context||function(){},Mi=`onpointerenter`in Ai?`pointer`:`mouse`,ji=ua.isTouch=Di.matchMedia&&Di.matchMedia(`(hover: none), (pointer: coarse)`).matches?1:`ontouchstart`in Di||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0?2:0,Ii=ua.eventTypes=(`ontouchstart`in ki?`touchstart,touchmove,touchcancel,touchend`:`onpointerdown`in ki?`pointerdown,pointermove,pointercancel,pointerup`:`mousedown,mousemove,mouseup,mouseup`).split(`,`),setTimeout(function(){return zi=0},500),Ei=1),Ni||ca(),Ei};ea.op=ta,Vi.cache=0;var ua=function(){function e(e){this.init(e)}var t=e.prototype;return t.init=function(e){Ei||la(Ti)||console.warn(`Please gsap.registerPlugin(Observer)`),Ni||ca();var t=e.tolerance,n=e.dragMinimum,r=e.type,i=e.target,a=e.lineHeight,o=e.debounce,s=e.preventDefault,c=e.onStop,l=e.onStopDelay,u=e.ignore,d=e.wheelSpeed,f=e.event,p=e.onDragStart,m=e.onDragEnd,h=e.onDrag,g=e.onPress,_=e.onRelease,v=e.onRight,y=e.onLeft,b=e.onUp,x=e.onDown,S=e.onChangeX,C=e.onChangeY,w=e.onChange,T=e.onToggleX,E=e.onToggleY,D=e.onHover,O=e.onHoverEnd,k=e.onMove,A=e.ignoreCheck,j=e.isNormalizer,M=e.onGestureStart,N=e.onGestureEnd,P=e.onWheel,F=e.onEnable,I=e.onDisable,ee=e.onClick,L=e.scrollSpeed,te=e.capture,ne=e.allowClicks,R=e.lockAxis,re=e.onLockAxis;this.target=i=na(i)||ki,this.vars=e,u&&=Ti.utils.toArray(u),t||=1e-9,n||=0,d||=1,L||=1,r||=`wheel,touch,pointer`,o=o!==!1,a||=parseFloat(Di.getComputedStyle(Ai).lineHeight)||22;var z,ie,ae,oe,B,se,ce,V=this,le=0,ue=0,de=e.passive||!s&&e.passive!==!1,fe=ia(i,ea),pe=ia(i,ta),me=fe(),he=pe(),ge=~r.indexOf(`touch`)&&!~r.indexOf(`pointer`)&&Ii[0]===`pointerdown`,H=qi(i),_e=i.ownerDocument||Oi,ve=[0,0,0],U=[0,0,0],W=0,ye=function(){return W=Ui()},G=function(e,t){return(V.event=e)&&u&&ra(e.target,u)||t&&ge&&e.pointerType!==`touch`||A&&A(e,t)},K=function(){V._vx.reset(),V._vy.reset(),ie.pause(),c&&c(V)},be=function(){var e=V.deltaX=sa(ve),n=V.deltaY=sa(U),r=Math.abs(e)>=t,i=Math.abs(n)>=t;w&&(r||i)&&w(V,e,n,ve,U),r&&(v&&V.deltaX>0&&v(V),y&&V.deltaX<0&&y(V),S&&S(V),T&&V.deltaX<0!=le<0&&T(V),le=V.deltaX,ve[0]=ve[1]=ve[2]=0),i&&(x&&V.deltaY>0&&x(V),b&&V.deltaY<0&&b(V),C&&C(V),E&&V.deltaY<0!=ue<0&&E(V),ue=V.deltaY,U[0]=U[1]=U[2]=0),(oe||ae)&&(k&&k(V),ae&&=(p&&ae===1&&p(V),h&&h(V),0),oe=!1),se&&!(se=!1)&&re&&re(V),B&&=(P(V),!1),z=0},xe=function(e,t,n){ve[n]+=e,U[n]+=t,V._vx.update(e),V._vy.update(t),o?z||=requestAnimationFrame(be):be()},Se=function(e,t){R&&!ce&&(V.axis=ce=Math.abs(e)>Math.abs(t)?`x`:`y`,se=!0),ce!==`y`&&(ve[2]+=e,V._vx.update(e,!0)),ce!==`x`&&(U[2]+=t,V._vy.update(t,!0)),o?z||=requestAnimationFrame(be):be()},Ce=function(e){if(!G(e,1)){e=oa(e,s);var t=e.clientX,r=e.clientY,i=t-V.x,a=r-V.y,o=V.isDragging;V.x=t,V.y=r,(o||(i||a)&&(Math.abs(V.startX-t)>=n||Math.abs(V.startY-r)>=n))&&(ae||=o?2:1,o||(V.isDragging=!0),Se(i,a))}},q=V.onPress=function(e){G(e,1)||e&&e.button||(V.axis=ce=null,ie.pause(),V.isPressed=!0,e=oa(e),le=ue=0,V.startX=V.x=e.clientX,V.startY=V.y=e.clientY,V._vx.reset(),V._vy.reset(),Ji(j?i:_e,Ii[1],Ce,de,!0),V.deltaX=V.deltaY=0,g&&g(V))},we=V.onRelease=function(e){if(!G(e,1)){Yi(j?i:_e,Ii[1],Ce,!0);var t=!isNaN(V.y-V.startY),n=V.isDragging,r=n&&(Math.abs(V.x-V.startX)>3||Math.abs(V.y-V.startY)>3),a=oa(e);!r&&t&&(V._vx.reset(),V._vy.reset(),s&&ne&&Ti.delayedCall(.08,function(){if(Ui()-W>300&&!e.defaultPrevented){if(e.target.click)e.target.click();else if(_e.createEvent){var t=_e.createEvent(`MouseEvents`);t.initMouseEvent(`click`,!0,!0,Di,1,a.screenX,a.screenY,a.clientX,a.clientY,!1,!1,!1,!1,0,null),e.target.dispatchEvent(t)}}})),V.isDragging=V.isGesturing=V.isPressed=!1,c&&n&&!j&&ie.restart(!0),ae&&be(),m&&n&&m(V),_&&_(V,r)}},J=function(e){return e.touches&&e.touches.length>1&&(V.isGesturing=!0)&&M(e,V.isDragging)},Te=function(){return(V.isGesturing=!1)||N(V)},Ee=function(e){if(!G(e)){var t=fe(),n=pe();xe((t-me)*L,(n-he)*L,1),me=t,he=n,c&&ie.restart(!0)}},De=function(e){if(!G(e)){e=oa(e,s),P&&(B=!0);var t=(e.deltaMode===1?a:e.deltaMode===2?Di.innerHeight:1)*d;xe(e.deltaX*t,e.deltaY*t,0),c&&!j&&ie.restart(!0)}},Oe=function(e){if(!G(e)){var t=e.clientX,n=e.clientY,r=t-V.x,i=n-V.y;V.x=t,V.y=n,oe=!0,c&&ie.restart(!0),(r||i)&&Se(r,i)}},ke=function(e){V.event=e,D(V)},Ae=function(e){V.event=e,O(V)},je=function(e){return G(e)||oa(e,s)&&ee(V)};ie=V._dc=Ti.delayedCall(l||.25,K).pause(),V.deltaX=V.deltaY=0,V._vx=aa(0,50,!0),V._vy=aa(0,50,!0),V.scrollX=fe,V.scrollY=pe,V.isDragging=V.isGesturing=V.isPressed=!1,Li(this),V.enable=function(e){return V.isEnabled||(Ji(H?_e:i,`scroll`,Qi),r.indexOf(`scroll`)>=0&&Ji(H?_e:i,`scroll`,Ee,de,te),r.indexOf(`wheel`)>=0&&Ji(i,`wheel`,De,de,te),(r.indexOf(`touch`)>=0&&ji||r.indexOf(`pointer`)>=0)&&(Ji(i,Ii[0],q,de,te),Ji(_e,Ii[2],we),Ji(_e,Ii[3],we),ne&&Ji(i,`click`,ye,!0,!0),ee&&Ji(i,`click`,je),M&&Ji(_e,`gesturestart`,J),N&&Ji(_e,`gestureend`,Te),D&&Ji(i,Mi+`enter`,ke),O&&Ji(i,Mi+`leave`,Ae),k&&Ji(i,Mi+`move`,Oe)),V.isEnabled=!0,V.isDragging=V.isGesturing=V.isPressed=oe=ae=!1,V._vx.reset(),V._vy.reset(),me=fe(),he=pe(),e&&e.type&&q(e),F&&F(V)),V},V.disable=function(){V.isEnabled&&(Bi.filter(function(e){return e!==V&&qi(e.target)}).length||Yi(H?_e:i,`scroll`,Qi),V.isPressed&&(V._vx.reset(),V._vy.reset(),Yi(j?i:_e,Ii[1],Ce,!0)),Yi(H?_e:i,`scroll`,Ee,te),Yi(i,`wheel`,De,te),Yi(i,Ii[0],q,te),Yi(_e,Ii[2],we),Yi(_e,Ii[3],we),Yi(i,`click`,ye,!0),Yi(i,`click`,je),Yi(_e,`gesturestart`,J),Yi(_e,`gestureend`,Te),Yi(i,Mi+`enter`,ke),Yi(i,Mi+`leave`,Ae),Yi(i,Mi+`move`,Oe),V.isEnabled=V.isPressed=V.isDragging=!1,I&&I(V))},V.kill=V.revert=function(){V.disable();var e=Bi.indexOf(V);e>=0&&Bi.splice(e,1),Fi===V&&(Fi=0)},Bi.push(V),j&&qi(i)&&(Fi=V),V.enable(f)},wi(e,[{key:`velocityX`,get:function(){return this._vx.getVelocity()}},{key:`velocityY`,get:function(){return this._vy.getVelocity()}}]),e}();ua.version=`3.15.1`,ua.create=function(e){return new ua(e)},ua.register=la,ua.getAll=function(){return Bi.slice()},ua.getById=function(e){return Bi.filter(function(t){return t.vars.id===e})[0]},Ri()&&Ti.registerPlugin(ua);var Y,da,fa,pa,ma,ha,ga,_a,va,ya,ba,xa,Sa,Ca,wa,Ta,Ea,Da,Oa,ka,Aa,ja,Ma,Na,Pa,Fa,Ia,La,Ra,za,Ba,Va,Ha,Ua,Wa=1,Ga=Date.now,Ka=Ga(),qa=0,Ja=0,Ya=function(e,t,n){var r=fo(e)&&(e.substr(0,6)===`clamp(`||e.indexOf(`max`)>-1);return n[`_`+t+`Clamp`]=r,r?e.substr(6,e.length-7):e},Xa=function(e,t){return t&&(!fo(e)||e.substr(0,6)!==`clamp(`)?`clamp(`+e+`)`:e},Za=function e(){return Ja&&requestAnimationFrame(e)},Qa=function(){return Ca=1},$a=function(){return Ca=0},eo=function(e){return e},to=function(e){return Math.round(e*1e5)/1e5||0},no=function(){return typeof window<`u`},ro=function(){return Y||no()&&(Y=window.gsap)&&Y.registerPlugin&&Y},io=function(e){return!!~ga.indexOf(e)},ao=function(e){return(e===`Height`?Ba:fa[`inner`+e])||ma[`client`+e]||ha[`client`+e]},oo=function(e){return Ki(e,`getBoundingClientRect`)||(io(e)?function(){return Ps.width=fa.innerWidth,Ps.height=Ba,Ps}:function(){return Lo(e)})},so=function(e,t,n){var r=n.d,i=n.d2,a=n.a;return(a=Ki(e,`getBoundingClientRect`))?function(){return a()[r]}:function(){return(t?ao(i):e[`client`+i])||0}},co=function(e,t){return!t||~Hi.indexOf(e)?oo(e):function(){return Ps}},lo=function(e,t){var n=t.s,r=t.d2,i=t.d,a=t.a;return Math.max(0,(n=`scroll`+r)&&(a=Ki(e,n))?a()-oo(e)()[i]:io(e)?(ma[n]||ha[n])-ao(r):e[n]-e[`offset`+r])},uo=function(e,t){for(var n=0;n<Oa.length;n+=3)(!t||~t.indexOf(Oa[n+1]))&&e(Oa[n],Oa[n+1],Oa[n+2])},fo=function(e){return typeof e==`string`},po=function(e){return typeof e==`function`},mo=function(e){return typeof e==`number`},ho=function(e){return typeof e==`object`},go=function(e,t,n){return e&&e.progress(+!t)&&n&&e.pause()},_o=function(e,t,n){if(e.enabled){var r=e._ctx?e._ctx.add(function(){return t(e,n)}):t(e,n);r&&r.totalTime&&(e.callbackAnimation=r)}},vo=Math.abs,yo=`left`,bo=`top`,xo=`right`,So=`bottom`,Co=`width`,wo=`height`,To=`Right`,Eo=`Left`,Do=`Top`,Oo=`Bottom`,ko=`padding`,Ao=`margin`,jo=`Width`,Mo=`Height`,No=`px`,Po=function(e){return fa.getComputedStyle(e.nodeType===Node.DOCUMENT_NODE?e.scrollingElement:e)},Fo=function(e){var t=Po(e).position;e.style.position=t===`absolute`||t===`fixed`?t:`relative`},Io=function(e,t){for(var n in t)n in e||(e[n]=t[n]);return e},Lo=function(e,t){var n=t&&Po(e)[wa]!==`matrix(1, 0, 0, 1, 0, 0)`&&Y.to(e,{x:0,y:0,xPercent:0,yPercent:0,rotation:0,rotationX:0,rotationY:0,scale:1,skewX:0,skewY:0}).progress(1),r=e.getBoundingClientRect?e.getBoundingClientRect():e.scrollingElement.getBoundingClientRect();return n&&n.progress(0).kill(),r},Ro=function(e,t){var n=t.d2;return e[`offset`+n]||e[`client`+n]||0},zo=function(e){var t=[],n=e.labels,r=e.duration(),i;for(i in n)t.push(n[i]/r);return t},Bo=function(e){return function(t){return Y.utils.snap(zo(e),t)}},Vo=function(e){var t=Y.utils.snap(e),n=Array.isArray(e)&&e.slice(0).sort(function(e,t){return e-t});return n?function(e,r,i){i===void 0&&(i=.001);var a;if(!r)return t(e);if(r>0){for(e-=i,a=0;a<n.length;a++)if(n[a]>=e)return n[a];return n[a-1]}for(a=n.length,e+=i;a--;)if(n[a]<=e)return n[a];return n[0]}:function(n,r,i){i===void 0&&(i=.001);var a=t(n);return!r||Math.abs(a-n)<i||a-n<0==r<0?a:t(r<0?n-e:n+e)}},Ho=function(e){return function(t,n){return Vo(zo(e))(t,n.direction)}},Uo=function(e,t,n,r){return n.split(`,`).forEach(function(n){return e(t,n,r)})},Wo=function(e,t,n,r,i){return e.addEventListener(t,n,{passive:!r,capture:!!i})},Go=function(e,t,n,r){return e.removeEventListener(t,n,!!r)},Ko=function(e,t,n){n&&=n.wheelHandler,n&&(e(t,`wheel`,n),e(t,`touchmove`,n))},qo={startColor:`green`,endColor:`red`,indent:0,fontSize:`16px`,fontWeight:`normal`},Jo={toggleActions:`play`,anticipatePin:0},Yo={top:0,left:0,center:.5,bottom:1,right:1},Xo=function(e,t){if(fo(e)){var n=e.indexOf(`=`),r=~n?+(e.charAt(n-1)+1)*parseFloat(e.substr(n+1)):0;~n&&(e.indexOf(`%`)>n&&(r*=t/100),e=e.substr(0,n-1)),e=r+(e in Yo?Yo[e]*t:~e.indexOf(`%`)?parseFloat(e)*t/100:parseFloat(e)||0)}return e},Zo=function(e,t,n,r,i,a,o,s){var c=i.startColor,l=i.endColor,u=i.fontSize,d=i.indent,f=i.fontWeight,p=pa.createElement(`div`),m=io(n)||Ki(n,`pinType`)===`fixed`,h=e.indexOf(`scroller`)!==-1,g=m?ha:n.tagName===`IFRAME`?n.contentDocument.body:n,_=e.indexOf(`start`)!==-1,v=_?c:l,y=`border-color:`+v+`;font-size:`+u+`;color:`+v+`;font-weight:`+f+`;pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;`;return y+=`position:`+((h||s)&&m?`fixed;`:`absolute;`),(h||s||!m)&&(y+=(r===ta?xo:So)+`:`+(a+parseFloat(d))+`px;`),o&&(y+=`box-sizing:border-box;text-align:left;width:`+o.offsetWidth+`px;`),p._isStart=_,p.setAttribute(`class`,`gsap-marker-`+e+(t?` marker-`+t:``)),p.style.cssText=y,p.innerText=t||t===0?e+`-`+t:e,g.children[0]?g.insertBefore(p,g.children[0]):g.appendChild(p),p._offset=p[`offset`+r.op.d2],Qo(p,0,r,_),p},Qo=function(e,t,n,r){var i={display:`block`},a=n[r?`os2`:`p2`],o=n[r?`p2`:`os2`];e._isFlipped=r,i[n.a+`Percent`]=r?-100:0,i[n.a]=r?`1px`:0,i[`border`+a+jo]=1,i[`border`+o+jo]=0,i[n.p]=t+`px`,Y.set(e,i)},$o=[],es={},ts,ns=function(){return Ga()-qa>34&&(ts||=requestAnimationFrame(Ts))},rs=function(){(!Ma||!Ma.isPressed||Ma.startX>ha.clientWidth)&&(Vi.cache++,Ma?ts||=requestAnimationFrame(Ts):Ts(),qa||ls(`scrollStart`),qa=Ga())},is=function(){Fa=fa.innerWidth,Pa=fa.innerHeight},as=function(e){Vi.cache++,(e===!0||!Sa&&!ja&&!pa.fullscreenElement&&!pa.webkitFullscreenElement&&(!Na||Fa!==fa.innerWidth||Math.abs(fa.innerHeight-Pa)>fa.innerHeight*.25))&&_a.restart(!0)},os={},ss=[],cs=function e(){return Go(X,`scrollEnd`,e)||xs(!0)},ls=function(e){return os[e]&&os[e].map(function(e){return e()})||ss},us=[],ds=function(e){for(var t=0;t<us.length;t+=5)(!e||us[t+4]&&us[t+4].query===e)&&(us[t].style.cssText=us[t+1],us[t].getBBox&&us[t].setAttribute(`transform`,us[t+2]||``),us[t+3].uncache=1)},fs=function(){Vi.cache++,Vi.forEach(function(e){return po(e)&&(e.rec=e())})},ps=function(e,t){var n;for(Ta=0;Ta<$o.length;Ta++)n=$o[Ta],n&&(!t||n._ctx===t)&&(e?n.kill(1):n.revert(!0,!0));Va=!0,t&&ds(t),t||ls(`revert`)},ms=function(e,t){Vi.cache++,(t||!hs)&&Vi.forEach(function(e){return po(e)&&e.cacheID++&&(e.rec=0)}),fo(e)&&(Ra=e,fa.history.scrollRestoration!==e&&(fa.history.scrollRestoration=e))},hs,gs=0,_s,vs=function(){if(_s!==gs){var e=_s=gs;requestAnimationFrame(function(){return e===gs&&xs(!0)})}},ys=function(){ha.appendChild(za),Ba=!Ma&&za.offsetHeight||fa.innerHeight,ha.removeChild(za)},bs=function(e){return va(`.gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end`).forEach(function(t){return t.style.display=e?`none`:`block`})},xs=function(e,t){if(ma=pa.documentElement,ha=pa.body,ga=[fa,pa,ma,ha],qa&&!e&&!Va)Wo(X,`scrollEnd`,cs);else{ys(),hs=X.isRefreshing=!0,Va||fs();var n=ls(`refreshInit`);ka&&X.sort(),t||ps(),Vi.forEach(function(e){po(e)&&(e.smooth&&(e.target.style.scrollBehavior=`auto`),e(0))}),$o.slice(0).forEach(function(e){return e.refresh()}),Va=!1,$o.forEach(function(e){if(e._subPinOffset&&e.pin){var t=e.vars.horizontal?`offsetWidth`:`offsetHeight`,n=e.pin[t];e.revert(!0,1),e.adjustPinSpacing(e.pin[t]-n),e.refresh()}}),Ha=1,bs(!0),$o.forEach(function(e){var t=lo(e.scroller,e._dir),n=e.vars.end===`max`||e._endClamp&&e.end>t,r=e._startClamp&&e.start>=t;(n||r)&&e.setPositions(r?t-1:e.start,n?Math.max(r?t:e.start+1,t):e.end,!0)}),bs(!1),Ha=0,n.forEach(function(e){return e&&e.render&&e.render(-1)}),Vi.forEach(function(e){po(e)&&(e.smooth&&requestAnimationFrame(function(){return e.target.style.scrollBehavior=`smooth`}),e.rec&&e(e.rec))}),ms(Ra,1),_a.pause(),gs++,hs=2,Ts(2),$o.forEach(function(e){return po(e.vars.onRefresh)&&e.vars.onRefresh(e)}),hs=X.isRefreshing=!1,ls(`refresh`)}},Ss=0,Cs=1,ws,Ts=function(e){if(e===2||!hs&&!Va){X.isUpdating=!0,ws&&ws.update(0);var t=$o.length,n=Ga(),r=n-Ka>=50,i=t&&$o[0].scroll();if(Cs=Ss>i?-1:1,hs||(Ss=i),r&&(qa&&!Ca&&n-qa>200&&(qa=0,ls(`scrollEnd`)),ba=Ka,Ka=n),Cs<0){for(Ta=t;Ta-->0;)$o[Ta]&&$o[Ta].update(0,r);Cs=1}else for(Ta=0;Ta<t;Ta++)$o[Ta]&&$o[Ta].update(0,r);X.isUpdating=!1}ts=0},Es=[yo,bo,So,xo,Ao+Oo,Ao+To,Ao+Do,Ao+Eo,`display`,`flexShrink`,`float`,`zIndex`,`gridColumnStart`,`gridColumnEnd`,`gridRowStart`,`gridRowEnd`,`gridArea`,`justifySelf`,`alignSelf`,`placeSelf`,`order`],Ds=Es.concat([Co,wo,`boxSizing`,`max`+jo,`max`+Mo,`position`,Ao,ko,ko+Do,ko+To,ko+Oo,ko+Eo]),Os=function(e,t,n){js(n);var r=e._gsap;if(r.spacerIsNative)js(r.spacerState);else if(e._gsap.swappedIn){var i=t.parentNode;i&&(i.insertBefore(e,t),i.removeChild(t))}e._gsap.swappedIn=!1},ks=function(e,t,n,r){if(!e._gsap.swappedIn){for(var i=Es.length,a=t.style,o=e.style,s;i--;)s=Es[i],a[s]=n[s];a.position=n.position===`absolute`?`absolute`:`relative`,n.display===`inline`&&(a.display=`inline-block`),o[So]=o[xo]=`auto`,a.flexBasis=n.flexBasis||`auto`,a.overflow=`visible`,a.boxSizing=`border-box`,a[Co]=Ro(e,ea)+No,a[wo]=Ro(e,ta)+No,a[ko]=o[Ao]=o[bo]=o[yo]=`0`,js(r),o[Co]=o[`max`+jo]=n[Co],o[wo]=o[`max`+Mo]=n[wo],o[ko]=n[ko],e.parentNode!==t&&(e.parentNode.insertBefore(t,e),t.appendChild(e)),e._gsap.swappedIn=!0}},As=/([A-Z])/g,js=function(e){if(e){var t=e.t.style,n=e.length,r=0,i,a;for((e.t._gsap||Y.core.getCache(e.t)).uncache=1;r<n;r+=2)a=e[r+1],i=e[r],a?t[i]=a:t[i]&&t.removeProperty(i.replace(As,`-$1`).toLowerCase())}},Ms=function(e){for(var t=Ds.length,n=e.style,r=[],i=0;i<t;i++)r.push(Ds[i],n[Ds[i]]);return r.t=e,r},Ns=function(e,t,n){for(var r=[],i=e.length,a=n?8:0,o;a<i;a+=2)o=e[a],r.push(o,o in t?t[o]:e[a+1]);return r.t=e.t,r},Ps={left:0,top:0},Fs=function(e,t,n,r,i,a,o,s,c,l,u,d,f,p){po(e)&&(e=e(s)),fo(e)&&e.substr(0,3)===`max`&&(e=d+(e.charAt(4)===`=`?Xo(`0`+e.substr(3),n):0));var m=f?f.time():0,h,g,_;if(f&&f.seek(0),isNaN(e)||(e=+e),mo(e))f&&(e=Y.utils.mapRange(f.scrollTrigger.start,f.scrollTrigger.end,0,d,e)),o&&Qo(o,n,r,!0);else{po(t)&&(t=t(s));var v=(e||`0`).split(` `),y,b,x,S;_=na(t,s)||ha,y=Lo(_)||{},y&&(y.left||y.top)||Po(_).display!==`none`||(S=_.style.display,_.style.display=`block`,y=Lo(_),S?_.style.display=S:_.style.removeProperty(`display`)),b=Xo(v[0],y[r.d]),x=Xo(v[1]||`0`,n),e=y[r.p]-c[r.p]-l+b+i-x,o&&Qo(o,x,r,n-x<20||o._isStart&&x>20),n-=n-x}if(p&&(s[p]=e||-.001,e<0&&(e=0)),a){var C=e+n,w=a._isStart;h=`scroll`+r.d2,Qo(a,C,r,w&&C>20||!w&&(u?Math.max(ha[h],ma[h]):a.parentNode[h])<=C+1),u&&(c=Lo(o),u&&(a.style[r.op.p]=c[r.op.p]-r.op.m-a._offset+No))}return f&&_&&(h=Lo(_),f.seek(d),g=Lo(_),f._caScrollDist=h[r.p]-g[r.p],e=e/f._caScrollDist*d),f&&f.seek(m),f?e:Math.round(e)},Is=/(webkit|moz|length|cssText|inset)/i,Ls=function(e,t,n,r){if(e.parentNode!==t){var i=e.style,a,o;if(t===ha){for(a in e._stOrig=i.cssText,o=Po(e),o)!+a&&!Is.test(a)&&o[a]&&typeof i[a]==`string`&&a!==`0`&&(i[a]=o[a]);i.top=n,i.left=r}else i.cssText=e._stOrig;Y.core.getCache(e).uncache=1,t.appendChild(e)}},Rs=function(e,t,n){var r=t,i=r;return function(t){var a=Math.round(e());return a!==r&&a!==i&&Math.abs(a-r)>3&&Math.abs(a-i)>3&&(t=a,n&&n()),i=r,r=Math.round(t),r}},zs=function(e,t,n){var r={};r[t.p]=`+=`+n,Y.set(e,r)},Bs=function(e,t){var n=ia(e,t),r=`_scroll`+t.p2,i=function t(i,a,o,s,c){var l=t.tween,u=a.onComplete,d={};o||=n();var f=Rs(n,o,function(){l.kill(),t.tween=0});return c=s&&c||0,s||=i-o,l&&l.kill(),a[r]=i,a.inherit=!1,a.modifiers=d,d[r]=function(){return f(o+s*l.ratio+c*l.ratio*l.ratio)},a.onUpdate=function(){Vi.cache++,t.tween&&Ts()},a.onComplete=function(){t.tween=0,u&&u.call(l)},l=t.tween=Y.to(e,a),l};return e[r]=n,n.wheelHandler=function(){return i.tween&&i.tween.kill()&&(i.tween=0)},Wo(e,`wheel`,n.wheelHandler),X.isTouch&&Wo(e,`touchmove`,n.wheelHandler),i},X=function(){function e(t,n){da||e.register(Y)||console.warn(`Please gsap.registerPlugin(ScrollTrigger)`),La(this),this.init(t,n)}var t=e.prototype;return t.init=function(t,n){if(this.progress=this.start=0,this.vars&&this.kill(!0,!0),!Ja)this.update=this.refresh=this.kill=eo;else{t=Io(fo(t)||mo(t)||t.nodeType?{trigger:t}:t,Jo);var r=t,i=r.onUpdate,a=r.toggleClass,o=r.id,s=r.onToggle,c=r.onRefresh,l=r.scrub,u=r.trigger,d=r.pin,f=r.pinSpacing,p=r.invalidateOnRefresh,m=r.anticipatePin,h=r.onScrubComplete,g=r.onSnapComplete,_=r.once,v=r.snap,y=r.pinReparent,b=r.pinSpacer,x=r.containerAnimation,S=r.fastScrollEnd,C=r.preventOverlaps,w=t.horizontal||t.containerAnimation&&t.horizontal!==!1?ea:ta,T=!l&&l!==0,E=na(t.scroller||fa),D=Y.core.getCache(E),O=io(E),k=(`pinType`in t?t.pinType:Ki(E,`pinType`)||O&&`fixed`)===`fixed`,A=[t.onEnter,t.onLeave,t.onEnterBack,t.onLeaveBack],j=T&&t.toggleActions.split(` `),M=`markers`in t?t.markers:Jo.markers,N=O?0:parseFloat(Po(E)[`border`+w.p2+jo])||0,P=this,F=t.onRefreshInit&&function(){return t.onRefreshInit(P)},I=so(E,O,w),ee=co(E,O),L=0,te=0,ne=0,R=ia(E,w),re,z,ie,ae,oe,B,se,ce,V,le,ue,de,fe,pe,me,he,ge,H,_e,ve,U,W,ye,G,K,be,xe,Se,Ce,q,we,J,Te,Ee,De,Oe,ke,Ae,je;if(P._startClamp=P._endClamp=!1,P._dir=w,m*=45,P.scroller=E,P.scroll=x?x.time.bind(x):R,ae=R(),Va&&R.rec==null&&(R.rec=ae),P.vars=t,n||=t.animation,`refreshPriority`in t&&(ka=1,t.refreshPriority===-9999&&(ws=P)),D.tweenScroll=D.tweenScroll||{top:Bs(E,ta),left:Bs(E,ea)},P.tweenTo=re=D.tweenScroll[w.p],P.scrubDuration=function(e){Te=mo(e)&&e,Te?J?J.duration(e):J=Y.to(n,{ease:`expo`,totalProgress:`+=0`,inherit:!1,duration:Te,paused:!0,onComplete:function(){return h&&h(P)}}):(J&&J.progress(1).kill(),J=0)},n&&(n.vars.lazy=!1,n._initted&&!P.isReverted||n.vars.immediateRender!==!1&&t.immediateRender!==!1&&n.duration()&&n.render(0,!0,!0),P.animation=n.pause(),n.scrollTrigger=P,P.scrubDuration(l),q=0,o||=n.vars.id),v&&((!ho(v)||v.push)&&(v={snapTo:v}),`scrollBehavior`in ha.style&&Y.set(O?[ha,ma]:E,{scrollBehavior:`auto`}),Vi.forEach(function(e){return po(e)&&e.target===(O?pa.scrollingElement||ma:E)&&(e.smooth=!1)}),ie=po(v.snapTo)?v.snapTo:v.snapTo===`labels`?Bo(n):v.snapTo===`labelsDirectional`?Ho(n):v.directional===!1?Y.utils.snap(v.snapTo):function(e,t){return Vo(v.snapTo)(e,Ga()-te<500?0:t.direction)},Ee=v.duration||{min:.1,max:2},Ee=ho(Ee)?ya(Ee.min,Ee.max):ya(Ee,Ee),De=Y.delayedCall(v.delay||Te/2||.1,function(){var e=R(),t=Ga()-te<500,r=re.tween;if((t||Math.abs(P.getVelocity())<10)&&!r&&!Ca&&L!==e){var i=(e-B)/pe,a=n&&!T?n.totalProgress():i,o=t?0:(a-we)/(Ga()-ba)*1e3||0,s=Y.utils.clamp(-i,1-i,vo(o/2)*o/.185),c=i+(v.inertia===!1?0:s),l,u,d=v,f=d.onStart,p=d.onInterrupt,m=d.onComplete;if(l=ie(c,P),mo(l)||(l=c),u=Math.max(0,Math.round(B+l*pe)),e<=se&&e>=B&&u!==e){if(r&&!r._initted&&r.data<=vo(u-e))return;v.inertia===!1&&(s=l-i),re(u,{duration:Ee(vo(Math.max(vo(c-a),vo(l-a))*.185/o/.05||0)),ease:v.ease||`power3`,data:vo(u-e),onInterrupt:function(){return De.restart(!0)&&p&&_o(P,p)},onComplete:function(){P.update(),L=R(),n&&!T&&(J?J.resetTo(`totalProgress`,l,n._tTime/n._tDur):n.progress(l)),q=we=n&&!T?n.totalProgress():P.progress,g&&g(P),m&&_o(P,m)}},e,s*pe,u-e-s*pe),f&&_o(P,f,re.tween)}}else P.isActive&&L!==e&&De.restart(!0)}).pause()),o&&(es[o]=P),u=P.trigger=na(u||d!==!0&&d),je=u&&u._gsap&&u._gsap.stRevert,je&&=je(P),d=d===!0?u:na(d),fo(a)&&(a={targets:u,className:a}),d&&(f===!1||f===Ao||(f=!f&&d.parentNode&&d.parentNode.style&&Po(d.parentNode).display===`flex`?!1:ko),P.pin=d,z=Y.core.getCache(d),z.spacer?me=z.pinState:(b&&(b=na(b),b&&!b.nodeType&&(b=b.current||b.nativeElement),z.spacerIsNative=!!b,b&&(z.spacerState=Ms(b))),z.spacer=H=b||pa.createElement(`div`),H.classList.add(`pin-spacer`),o&&H.classList.add(`pin-spacer-`+o),z.pinState=me=Ms(d)),t.force3D!==!1&&Y.set(d,{force3D:!0}),P.spacer=H=z.spacer,Ce=Po(d),G=Ce[f+w.os2],ve=Y.getProperty(d),U=Y.quickSetter(d,w.a,No),ks(d,H,Ce),ge=Ms(d)),M){de=ho(M)?Io(M,qo):qo,le=Zo(`scroller-start`,o,E,w,de,0),ue=Zo(`scroller-end`,o,E,w,de,0,le),_e=le[`offset`+w.op.d2];var Me=na(Ki(E,`content`)||E);ce=this.markerStart=Zo(`start`,o,Me,w,de,_e,0,x),V=this.markerEnd=Zo(`end`,o,Me,w,de,_e,0,x),x&&(Ae=Y.quickSetter([ce,V],w.a,No)),!k&&!(Hi.length&&Ki(E,`fixedMarkers`)===!0)&&(Fo(O?ha:E),Y.set([le,ue],{force3D:!0}),be=Y.quickSetter(le,w.a,No),Se=Y.quickSetter(ue,w.a,No))}if(x){var Ne=x.vars.onUpdate,Pe=x.vars.onUpdateParams;x.eventCallback(`onUpdate`,function(){P.update(0,0,1),Ne&&Ne.apply(x,Pe||[])})}if(P.previous=function(){return $o[$o.indexOf(P)-1]},P.next=function(){return $o[$o.indexOf(P)+1]},P.revert=function(e,t){if(!t)return P.kill(!0);var r=e!==!1||!P.enabled,i=Sa;r!==P.isReverted&&(r&&(Oe=Math.max(R(),P.scroll.rec||0),ne=P.progress,ke=n&&n.progress()),ce&&[ce,V,le,ue].forEach(function(e){return e.style.display=r?`none`:`block`}),r&&(Sa=P,P.update(r)),!d||y&&P.isActive||(r?Os(d,H,me):ks(d,H,Po(d),K)),r||P.update(r),Sa=i,P.isReverted=r)},P.refresh=function(r,i,a,o){if(!Sa&&P.enabled||i){if(d&&r&&qa)Wo(e,`scrollEnd`,cs);else{!hs&&F&&F(P),Sa=P,re.tween&&!a&&(re.tween.kill(),re.tween=0),J&&J.pause(),p&&n&&(n.revert({kill:!1}).invalidate(),n.getChildren?n.getChildren(!0,!0,!1).forEach(function(e){return e.vars.immediateRender&&e.render(0,!0,!0)}):n.vars.immediateRender&&n.render(0,!0,!0)),P.isReverted||P.revert(!0,!0),P._subPinOffset=!1;var s=I(),l=ee(),m=x?x.duration():lo(E,w),h=pe<=.01||!pe,g=0,_=o||0,v=ho(a)?a.end:t.end,b=t.endTrigger||u,S=ho(a)?a.start:t.start||(t.start===0||!u?0:d?`0 0`:`0 100%`),C=P.pinnedContainer=t.pinnedContainer&&na(t.pinnedContainer,P),D=u&&Math.max(0,$o.indexOf(P))||0,A=D,j,z,ie,de,_e,U,G,be,Se,Ce,q,we,Te;for(M&&ho(a)&&(we=Y.getProperty(le,w.p),Te=Y.getProperty(ue,w.p));A-->0;)U=$o[A],U.end||U.refresh(0,1)||(Sa=P),G=U.pin,G&&(G===u||G===d||G===C)&&!U.isReverted&&(Ce||=[],Ce.unshift(U),U.revert(!0,!0)),U!==$o[A]&&(D--,A--);for(po(S)&&(S=S(P)),S=Ya(S,`start`,P),B=Fs(S,u,s,w,R(),ce,le,P,l,N,k,m,x,P._startClamp&&`_startClamp`)||(d?-.001:0),po(v)&&(v=v(P)),fo(v)&&!v.indexOf(`+=`)&&(~v.indexOf(` `)?v=(fo(S)?S.split(` `)[0]:``)+v:(g=Xo(v.substr(2),s),v=fo(S)?S:(x?Y.utils.mapRange(0,x.duration(),x.scrollTrigger.start,x.scrollTrigger.end,B):B)+g,b=u)),v=Ya(v,`end`,P),se=Math.max(B,Fs(v||(b?`100% 0`:m),b,s,w,R()+g,V,ue,P,l,N,k,m,x,P._endClamp&&`_endClamp`))||-.001,g=0,A=D;A--;)U=$o[A]||{},G=U.pin,G&&U.start-U._pinPush<=B&&!x&&U.end>0&&(j=U.end-(P._startClamp?Math.max(0,U.start):U.start),(G===u&&U.start-U._pinPush<B||G===C)&&isNaN(S)&&(g+=j*(1-U.progress)),G===d&&(_+=j));if(B+=g,se+=g,P._startClamp&&(P._startClamp+=g),P._endClamp&&!hs&&(P._endClamp=se||-.001,se=Math.min(se,lo(E,w))),pe=se-B||(B-=.01)&&.001,h&&(ne=Y.utils.clamp(0,1,Y.utils.normalize(B,se,Oe))),P._pinPush=_,ce&&g&&(j={},j[w.a]=`+=`+g,C&&(j[w.p]=`-=`+R()),Y.set([ce,V],j)),d&&!(Ha&&P.end>=lo(E,w)))j=Po(d),de=w===ta,ie=R(),W=parseFloat(ve(w.a))+_,!m&&se>1&&(q=(O?pa.scrollingElement||ma:E).style,q={style:q,value:q[`overflow`+w.a.toUpperCase()]},O&&Po(ha)[`overflow`+w.a.toUpperCase()]!==`scroll`&&(q.style[`overflow`+w.a.toUpperCase()]=`scroll`)),ks(d,H,j),ge=Ms(d),z=Lo(d,!0),be=k&&ia(E,de?ea:ta)(),f?(K=[f+w.os2,pe+_+No],K.t=H,A=f===ko?Ro(d,w)+pe+_:0,A&&(K.push(w.d,A+No),H.style.flexBasis!==`auto`&&(H.style.flexBasis=A+No)),js(K),C&&$o.forEach(function(e){e.pin===C&&e.vars.pinSpacing!==!1&&(e._subPinOffset=!0)}),k&&R(Oe)):(A=Ro(d,w),A&&H.style.flexBasis!==`auto`&&(H.style.flexBasis=A+No)),k&&(_e={top:z.top+(de?ie-B:be)+No,left:z.left+(de?be:ie-B)+No,boxSizing:`border-box`,position:`fixed`},_e[Co]=_e[`max`+jo]=Math.ceil(z.width)+No,_e[wo]=_e[`max`+Mo]=Math.ceil(z.height)+No,_e[Ao]=_e[Ao+Do]=_e[Ao+To]=_e[Ao+Oo]=_e[Ao+Eo]=`0`,_e[ko]=j[ko],_e[ko+Do]=j[ko+Do],_e[ko+To]=j[ko+To],_e[ko+Oo]=j[ko+Oo],_e[ko+Eo]=j[ko+Eo],he=Ns(me,_e,y),hs&&R(0)),n?(Se=n._initted,Aa(1),n.render(n.duration(),!0,!0),ye=ve(w.a)-W+pe+_,xe=Math.abs(pe-ye)>1,k&&xe&&he.splice(he.length-2,2),n.render(0,!0,!0),Se||n.invalidate(!0),n.parent||n.totalTime(n.totalTime()),Aa(0)):ye=pe,q&&(q.value?q.style[`overflow`+w.a.toUpperCase()]=q.value:q.style.removeProperty(`overflow-`+w.a));else if(u&&R()&&!x)for(z=u.parentNode;z&&z!==ha;)z._pinOffset&&(B-=z._pinOffset,se-=z._pinOffset),z=z.parentNode;Ce&&Ce.forEach(function(e){return e.revert(!1,!0)}),P.start=B,P.end=se,ae=oe=hs?Oe:R(),x||hs||Va||(ae<Oe&&R(Oe),P.scroll.rec=0),P.revert(!1,!0),te=Ga(),De&&(L=-1,De.restart(!0)),Sa=0,n&&T&&(n._initted||ke)&&n.progress()!==ke&&n.progress(ke||0,!0).render(n.time(),!0,!0),(h||ne!==P.progress||x||p||n&&!n._initted)&&(n&&!T&&(n._initted||ne||n.vars.immediateRender!==!1)&&n.totalProgress(x&&B<-.001&&!ne?Y.utils.normalize(B,se,0):ne,!0),P.progress=h||(ae-B)/pe===ne?0:ne),d&&f&&(H._pinOffset=Math.round(P.progress*ye)),J&&J.invalidate(),isNaN(we)||(we-=Y.getProperty(le,w.p),Te-=Y.getProperty(ue,w.p),zs(le,w,we),zs(ce,w,we-(o||0)),zs(ue,w,Te),zs(V,w,Te-(o||0))),h&&!hs&&P.update(),c&&!hs&&!fe&&(fe=!0,c(P),fe=!1)}}},P.getVelocity=function(){return(R()-oe)/(Ga()-ba)*1e3||0},P.endAnimation=function(){go(P.callbackAnimation),n&&(J?J.progress(1):n.paused()?T||go(n,P.direction<0,1):go(n,n.reversed()))},P.labelToScroll=function(e){return n&&n.labels&&(B||P.refresh()||B)+n.labels[e]/n.duration()*pe||0},P.getTrailing=function(e){var t=$o.indexOf(P),n=P.direction>0?$o.slice(0,t).reverse():$o.slice(t+1);return(fo(e)?n.filter(function(t){return t.vars.preventOverlaps===e}):n).filter(function(e){return P.direction>0?e.end<=B:e.start>=se})},P.update=function(e,t,r){if(!x||r||e){var o=hs===!0?Oe:P.scroll(),c=e?0:(o-B)/pe,u=c<0?0:c>1?1:c||0,p=P.progress,h,g,b,D,O,M,N,F;if(t&&(oe=ae,ae=x?R():o,v&&(we=q,q=n&&!T?n.totalProgress():u)),m&&d&&!Sa&&!Wa&&qa&&(!u&&B<o+(o-oe)/(Ga()-ba)*m?u=1e-4:u===1&&se>o+(o-oe)/(Ga()-ba)*m&&(u=.9999)),u!==p&&P.enabled){if(h=P.isActive=!!u&&u<1,g=!!p&&p<1,M=h!==g,O=M||!!u!=!!p,P.direction=u>p?1:-1,P.progress=u,O&&!Sa&&(b=u&&!p?0:u===1?1:p===1?2:3,T&&(D=!M&&j[b+1]!==`none`&&j[b+1]||j[b],F=n&&(D===`complete`||D===`reset`||D in n))),C&&(M||F)&&(F||l||!n)&&(po(C)?C(P):P.getTrailing(C).forEach(function(e){return e.endAnimation()})),T||(J&&!Sa&&!Wa?(J._dp._time-J._start!==J._time&&J.render(J._dp._time-J._start),J.resetTo?J.resetTo(`totalProgress`,u,n._tTime/n._tDur):(J.vars.totalProgress=u,J.invalidate().restart())):n&&n.totalProgress(u,!!(Sa&&(te||e)))),d){if(e&&f&&(H.style[f+w.os2]=G),!k)U(to(W+ye*u));else if(O){if(N=!e&&u>p&&se+1>o&&o+1>=lo(E,w),y){if(!e&&(h||N)){var I=Lo(d,!0),ee=o-B;Ls(d,ha,I.top+(w===ta?ee:0)+No,I.left+(w===ta?0:ee)+No)}else Ls(d,H)}js(h||N?he:ge),xe&&u<1&&h||U(W+(u===1&&!N?ye:0))}}v&&!re.tween&&!Sa&&!Wa&&De.restart(!0),a&&(M||_&&u&&(u<1||!Ua))&&va(a.targets).forEach(function(e){return e.classList[h||_?`add`:`remove`](a.className)}),i&&!T&&!e&&i(P),O&&!Sa?(T&&(F&&(D===`complete`?n.pause().totalProgress(1):D===`reset`?n.restart(!0).pause():D===`restart`?n.restart(!0):n[D]()),i&&i(P)),(M||!Ua)&&(s&&M&&_o(P,s),A[b]&&_o(P,A[b]),_&&(u===1?P.kill(!1,1):A[b]=0),M||(b=u===1?1:3,A[b]&&_o(P,A[b]))),S&&!h&&Math.abs(P.getVelocity())>(mo(S)?S:2500)&&(go(P.callbackAnimation),J?J.progress(1):go(n,D===`reverse`?1:!u,1))):T&&i&&!Sa&&i(P)}if(Se){var L=x?o/x.duration()*(x._caScrollDist||0):o;be(L+ +!!le._isFlipped),Se(L)}Ae&&Ae(-o/x.duration()*(x._caScrollDist||0))}},P.enable=function(t,n){P.enabled||(P.enabled=!0,Wo(E,`resize`,as),O||Wo(E,`scroll`,rs),F&&Wo(e,`refreshInit`,F),t!==!1&&(P.progress=ne=0,ae=oe=L=R()),n!==!1&&P.refresh())},P.getTween=function(e){return e&&re?re.tween:J},P.setPositions=function(e,t,n,r){if(x){var i=x.scrollTrigger,a=x.duration(),o=i.end-i.start;e=i.start+o*e/a,t=i.start+o*t/a}P.refresh(!1,!1,{start:Xa(e,n&&!!P._startClamp),end:Xa(t,n&&!!P._endClamp)},r),P.update()},P.adjustPinSpacing=function(e){if(K&&e){var t=K.indexOf(w.d)+1;K[t]=parseFloat(K[t])+e+No,K[1]=parseFloat(K[1])+e+No,js(K)}},P.disable=function(t,n){if(t!==!1&&P.revert(!0,!0),P.enabled&&(P.enabled=P.isActive=!1,n||J&&J.pause(),Oe=0,z&&(z.uncache=1),F&&Go(e,`refreshInit`,F),De&&(De.pause(),re.tween&&re.tween.kill()&&(re.tween=0)),!O)){for(var r=$o.length;r--;)if($o[r].scroller===E&&$o[r]!==P)return;Go(E,`resize`,as),O||Go(E,`scroll`,rs)}},P.kill=function(e,r){P.disable(e,r),J&&!r&&J.kill(),o&&delete es[o];var i=$o.indexOf(P);i>=0&&$o.splice(i,1),i===Ta&&Cs>0&&Ta--,i=0,$o.forEach(function(e){return e.scroller===P.scroller&&(i=1)}),i||hs||Va||(P.scroll.rec=0),n&&(n.scrollTrigger=null,e&&n.revert({kill:!1}),r||n.kill()),ce&&[ce,V,le,ue].forEach(function(e){return e.parentNode&&e.parentNode.removeChild(e)}),ws===P&&(ws=0),d&&(z&&(z.uncache=1),i=0,$o.forEach(function(e){return e.pin===d&&i++}),i||(z.spacer=0)),t.onKill&&t.onKill(P)},$o.push(P),P.enable(!1,!1),je&&je(P),n&&n.add&&!pe){var Fe=P.update;P.update=function(){P.update=Fe,Vi.cache++,B||se||P.refresh()},Y.delayedCall(.01,P.update),pe=.01,B=se=0}else P.refresh();d&&vs()}},e.register=function(t){return da||=(Y=t||ro(),no()&&window.document&&e.enable(),Ja),da},e.defaults=function(e){if(e)for(var t in e)Jo[t]=e[t];return Jo},e.disable=function(e,t){Ja=0,$o.forEach(function(n){return n[t?`kill`:`disable`](e)}),Go(fa,`wheel`,rs),Go(pa,`scroll`,rs),clearInterval(xa),Go(pa,`touchcancel`,eo),Go(ha,`touchstart`,eo),Uo(Go,pa,`pointerdown,touchstart,mousedown`,Qa),Uo(Go,pa,`pointerup,touchend,mouseup`,$a),_a.kill(),uo(Go);for(var n=0;n<Vi.length;n+=3)Ko(Go,Vi[n],Vi[n+1]),Ko(Go,Vi[n],Vi[n+2])},e.enable=function(){if(fa=window,pa=document,ma=pa.documentElement,ha=pa.body,Y){if(va=Y.utils.toArray,ya=Y.utils.clamp,La=Y.core.context||eo,Aa=Y.core.suppressOverwrites||eo,Ra=fa.history.scrollRestoration||`auto`,Ss=fa.pageYOffset||0,Y.core.globals(`ScrollTrigger`,e),ha){Ja=1,za=document.createElement(`div`),za.style.height=`100vh`,za.style.position=`absolute`,ys(),Za(),ua.register(Y),e.isTouch=ua.isTouch,Ia=ua.isTouch&&/(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent),Na=ua.isTouch===1,Wo(fa,`wheel`,rs),ga=[fa,pa,ma,ha],Y.matchMedia?(e.matchMedia=function(e){var t=Y.matchMedia(),n;for(n in e)t.add(n,e[n]);return t},Y.addEventListener(`matchMediaInit`,function(){fs(),ps()}),Y.addEventListener(`matchMediaRevert`,function(){return ds()}),Y.addEventListener(`matchMedia`,function(){xs(0,1),ls(`matchMedia`)}),Y.matchMedia().add(`(orientation: portrait)`,function(){return is(),is})):console.warn(`Requires GSAP 3.11.0 or later`),is(),Wo(pa,`scroll`,rs);var t=ha.hasAttribute(`style`),n=ha.style,r=n.borderTopStyle,i=Y.core.Animation.prototype,a,o;for(i.revert||Object.defineProperty(i,"revert",{value:function(){return this.time(-.01,!0)}}),n.borderTopStyle=`solid`,a=Lo(ha),ta.m=Math.round(a.top+ta.sc())||0,ea.m=Math.round(a.left+ea.sc())||0,r?n.borderTopStyle=r:n.removeProperty(`border-top-style`),t||(ha.setAttribute(`style`,``),ha.removeAttribute(`style`)),xa=setInterval(ns,250),Y.delayedCall(.5,function(){return Wa=0}),Wo(pa,`touchcancel`,eo),Wo(ha,`touchstart`,eo),Uo(Wo,pa,`pointerdown,touchstart,mousedown`,Qa),Uo(Wo,pa,`pointerup,touchend,mouseup`,$a),wa=Y.utils.checkPrefix(`transform`),Ds.push(wa),da=Ga(),_a=Y.delayedCall(.2,xs).pause(),Oa=[pa,`visibilitychange`,function(){var e=fa.innerWidth,t=fa.innerHeight;pa.hidden?(Ea=e,Da=t):(Ea!==e||Da!==t)&&as()},pa,`DOMContentLoaded`,xs,fa,`load`,xs,fa,`resize`,as],uo(Wo),$o.forEach(function(e){return e.enable(0,1)}),o=0;o<Vi.length;o+=3)Ko(Go,Vi[o],Vi[o+1]),Ko(Go,Vi[o],Vi[o+2])}else pa&&pa.addEventListener(`DOMContentLoaded`,function t(){e.enable(),pa.removeEventListener(`DOMContentLoaded`,t)})}},e.config=function(t){`limitCallbacks`in t&&(Ua=!!t.limitCallbacks);var n=t.syncInterval;n&&clearInterval(xa)||(xa=n)&&setInterval(ns,n),`ignoreMobileResize`in t&&(Na=e.isTouch===1&&t.ignoreMobileResize),`autoRefreshEvents`in t&&(uo(Go)||uo(Wo,t.autoRefreshEvents||`none`),ja=(t.autoRefreshEvents+``).indexOf(`resize`)===-1)},e.scrollerProxy=function(e,t){var n=na(e),r=Vi.indexOf(n),i=io(n);~r&&Vi.splice(r,i?6:2),t&&(i?Hi.unshift(fa,t,ha,t,ma,t):Hi.unshift(n,t))},e.clearMatchMedia=function(e){$o.forEach(function(t){return t._ctx&&t._ctx.query===e&&t._ctx.kill(!0,!0)})},e.isInViewport=function(e,t,n){var r=(fo(e)?na(e):e).getBoundingClientRect(),i=r[n?Co:wo]*t||0;return n?r.right-i>0&&r.left+i<fa.innerWidth:r.bottom-i>0&&r.top+i<fa.innerHeight},e.positionInViewport=function(e,t,n){fo(e)&&(e=na(e));var r=e.getBoundingClientRect(),i=r[n?Co:wo],a=t==null?i/2:t in Yo?Yo[t]*i:~t.indexOf(`%`)?parseFloat(t)*i/100:parseFloat(t)||0;return n?(r.left+a)/fa.innerWidth:(r.top+a)/fa.innerHeight},e.killAll=function(e){if($o.slice(0).forEach(function(e){return e.vars.id!==`ScrollSmoother`&&e.kill()}),e!==!0){var t=os.killAll||[];os={},t.forEach(function(e){return e()})}},e}();X.version=`3.15.1`,X.saveStyles=function(e){return e?va(e).forEach(function(e){if(e&&e.style){var t=us.indexOf(e);t>=0&&us.splice(t,5),us.push(e,e.style.cssText,e.getBBox&&e.getAttribute(`transform`),Y.core.getCache(e),La())}}):us},X.revert=function(e,t){return ps(!e,t)},X.create=function(e,t){return new X(e,t)},X.refresh=function(e){return e?as(!0):(da||X.register())&&xs(!0)},X.update=function(e){return++Vi.cache&&Ts(e===!0?2:0)},X.clearScrollMemory=ms,X.maxScroll=function(e,t){return lo(e,t?ea:ta)},X.getScrollFunc=function(e,t){return ia(na(e),t?ea:ta)},X.getById=function(e){return es[e]},X.getAll=function(){return $o.filter(function(e){return e.vars.id!==`ScrollSmoother`})},X.isScrolling=function(){return!!qa},X.snapDirectional=Vo,X.addEventListener=function(e,t){var n=os[e]||(os[e]=[]);~n.indexOf(t)||n.push(t)},X.removeEventListener=function(e,t){var n=os[e],r=n&&n.indexOf(t);r>=0&&n.splice(r,1)},X.batch=function(e,t){var n=[],r={},i=t.interval||.016,a=t.batchMax||1e9,o=function(e,t){var n=[],r=[],o=Y.delayedCall(i,function(){t(n,r),n=[],r=[]}).pause();return function(e){n.length||o.restart(!0),n.push(e.trigger),r.push(e),a<=n.length&&o.progress(1)}},s;for(s in t)r[s]=s.substr(0,2)===`on`&&po(t[s])&&s!==`onRefreshInit`?o(s,t[s]):t[s];return po(a)&&(a=a(),Wo(X,`refresh`,function(){return a=t.batchMax()})),va(e).forEach(function(e){var t={};for(s in r)t[s]=r[s];t.trigger=e,n.push(X.create(t))}),n};var Vs=function(e,t,n,r){return t>r?e(r):t<0&&e(0),n>r?(r-t)/(n-t):n<0?t/(t-n):1},Hs=function e(t,n){n===!0?t.style.removeProperty(`touch-action`):t.style.touchAction=n===!0?`auto`:n?`pan-`+n+(ua.isTouch?` pinch-zoom`:``):`none`,t===ma&&e(ha,n)},Us={auto:1,scroll:1},Ws=function(e){var t=e.event,n=e.target,r=e.axis,i=(t.changedTouches?t.changedTouches[0]:t).target,a=i._gsap||Y.core.getCache(i),o=Ga(),s;if(!a._isScrollT||o-a._isScrollT>2e3){for(;i&&i!==ha&&(i.scrollHeight<=i.clientHeight&&i.scrollWidth<=i.clientWidth||!(Us[(s=Po(i)).overflowY]||Us[s.overflowX]));)i=i.parentNode;a._isScroll=i&&i!==n&&!io(i)&&(Us[(s=Po(i)).overflowY]||Us[s.overflowX]),a._isScrollT=o}(a._isScroll||r===`x`)&&(t.stopPropagation(),t._gsapAllow=!0)},Gs=function(e,t,n,r){return ua.create({target:e,capture:!0,debounce:!1,lockAxis:!0,type:t,onWheel:r&&=Ws,onPress:r,onDrag:r,onScroll:r,onEnable:function(){return n&&Wo(pa,ua.eventTypes[0],Js,!1,!0)},onDisable:function(){return Go(pa,ua.eventTypes[0],Js,!0)}})},Ks=/(input|label|select|textarea)/i,qs,Js=function(e){var t=Ks.test(e.target.tagName);(t||qs)&&(e._gsapAllow=!0,qs=t)},Ys=function(e){ho(e)||(e={}),e.preventDefault=e.isNormalizer=e.allowClicks=!0,e.type||(e.type=`wheel,touch`),e.debounce=!!e.debounce,e.id=e.id||`normalizer`;var t=e,n=t.normalizeScrollX,r=t.momentum,i=t.allowNestedScroll,a=t.onRelease,o,s,c=na(e.target)||ma,l=Y.core.globals().ScrollSmoother,u=l&&l.get(),d=Ia&&(e.content&&na(e.content)||u&&e.content!==!1&&!u.smooth()&&u.content()),f=ia(c,ta),p=ia(c,ea),m=1,h=(ua.isTouch&&fa.visualViewport?fa.visualViewport.scale*fa.visualViewport.width:fa.outerWidth)/fa.innerWidth,g=0,_=po(r)?function(){return r(o)}:function(){return r||2.8},v,y,b=Gs(c,e.type,!0,i),x=function(){return y=!1},S=eo,C=eo,w=function(){s=lo(c,ta),C=ya(+!!Ia,s),n&&(S=ya(0,lo(c,ea))),v=gs},T=function(){d._gsap.y=to(parseFloat(d._gsap.y)+f.offset)+`px`,d.style.transform=`matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, `+parseFloat(d._gsap.y)+`, 0, 1)`,f.offset=f.cacheID=0},E=function(){if(y){requestAnimationFrame(x);var e=to(o.deltaY/2),t=C(f.v-e);if(d&&t!==f.v+f.offset){f.offset=t-f.v;var n=to((parseFloat(d&&d._gsap.y)||0)-f.offset);d.style.transform=`matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, `+n+`, 0, 1)`,d._gsap.y=n+`px`,f.cacheID=Vi.cache,Ts()}return!0}f.offset&&T(),y=!0},D,O,k,A,j=function(){w(),D.isActive()&&D.vars.scrollY>s&&(f()>s?D.progress(1)&&f(s):D.resetTo(`scrollY`,s))};return d&&Y.set(d,{y:`+=0`}),e.ignoreCheck=function(e){return Ia&&e.type===`touchmove`&&E(e)||m>1.05&&e.type!==`touchstart`||o.isGesturing||e.touches&&e.touches.length>1},e.onPress=function(){y=!1;var e=m;m=to((fa.visualViewport&&fa.visualViewport.scale||1)/h),D.pause(),e!==m&&Hs(c,m>1.01||!n&&`x`),O=p(),k=f(),w(),v=gs},e.onRelease=e.onGestureStart=function(e,t){if(f.offset&&T(),!t)A.restart(!0);else{Vi.cache++;var r=_(),i,o;n&&(i=p(),o=i+r*.05*-e.velocityX/.227,r*=Vs(p,i,o,lo(c,ea)),D.vars.scrollX=S(o)),i=f(),o=i+r*.05*-e.velocityY/.227,r*=Vs(f,i,o,lo(c,ta)),D.vars.scrollY=C(o),D.invalidate().duration(r).play(.01),(Ia&&D.vars.scrollY>=s||i>=s-1)&&Y.to({},{onUpdate:j,duration:r})}a&&a(e)},e.onWheel=function(){D._ts&&D.pause(),Ga()-g>1e3&&(v=0,g=Ga())},e.onChange=function(e,t,r,i,a){if(gs!==v&&w(),t&&n&&p(S(i[2]===t?O+(e.startX-e.x):p()+t-i[1])),r){f.offset&&T();var o=a[2]===r,s=o?k+e.startY-e.y:f()+r-a[1],c=C(s);o&&s!==c&&(k+=c-s),f(c)}(r||t)&&Ts()},e.onEnable=function(){Hs(c,!n&&`x`),X.addEventListener(`refresh`,j),Wo(fa,`resize`,j),f.smooth&&=(f.target.style.scrollBehavior=`auto`,p.smooth=!1),b.enable()},e.onDisable=function(){Hs(c,!0),Go(fa,`resize`,j),X.removeEventListener(`refresh`,j),b.kill()},e.lockAxis=e.lockAxis!==!1,o=new ua(e),o.iOS=Ia,Ia&&!f()&&f(1),Ia&&Y.ticker.add(eo),A=o._dc,D=Y.to(o,{ease:`power4`,paused:!0,inherit:!1,scrollX:n?`+=0.1`:`+=0`,scrollY:`+=0.1`,modifiers:{scrollY:Rs(f,f(),function(){return D.pause()})},onUpdate:Ts,onComplete:A.vars.onComplete}),o};X.sort=function(e){if(po(e))return $o.sort(e);var t=fa.pageYOffset||0;return X.getAll().forEach(function(e){return e._sortY=e.trigger?t+e.trigger.getBoundingClientRect().top:e.start+fa.innerHeight}),$o.sort(e||function(e,t){return(e.vars.refreshPriority||0)*-1e6+(e.vars.containerAnimation?1e6:e._sortY)-((t.vars.containerAnimation?1e6:t._sortY)+(t.vars.refreshPriority||0)*-1e6)})},X.observe=function(e){return new ua(e)},X.normalizeScroll=function(e){if(e===void 0)return Ma;if(e===!0&&Ma)return Ma.enable();if(e===!1)Ma&&Ma.kill(),Ma=e;else{var t=e instanceof ua?e:Ys(e);return Ma&&Ma.target===t.target&&Ma.kill(),io(t.target)&&(Ma=t),t}},X.core={_getVelocityProp:aa,_inputObserver:Gs,_scrollers:Vi,_proxies:Hi,bridge:{ss:function(){qa||ls(`scrollStart`),qa=Ga()},ref:function(){return Sa}}},ro()&&Y.registerPlugin(X);var Xs=`1.3.27`;function Zs(e,t,n){return Math.max(e,Math.min(t,n))}function Qs(e,t,n){return(1-n)*e+n*t}function $s(e,t,n,r){return Qs(e,t,1-Math.exp(-n*r))}function ec(e,t){return(e%t+t)%t}var tc=class{isRunning=!1;value=0;from=0;to=0;currentTime=0;lerp;duration;easing;onUpdate;advance(e){if(!this.isRunning)return;let t=!1;if(this.duration&&this.easing){this.currentTime+=e;let n=Zs(0,this.currentTime/this.duration,1);t=n>=1;let r=t?1:this.easing(n);this.value=this.from+(this.to-this.from)*r}else this.lerp?(this.value=$s(this.value,this.to,this.lerp*60,e),Math.round(this.value)===Math.round(this.to)&&(this.value=this.to,t=!0)):(this.value=this.to,t=!0);t&&this.stop(),this.onUpdate?.(this.value,t)}stop(){this.isRunning=!1}fromTo(e,t,{lerp:n,duration:r,easing:i,onStart:a,onUpdate:o}){this.from=this.value=e,this.to=t,this.lerp=n,this.duration=r,this.easing=i,this.currentTime=0,this.isRunning=!0,a?.(),this.onUpdate=o}};function nc(e,t){let n;return function(...r){clearTimeout(n),n=setTimeout(()=>{n=void 0,e.apply(this,r)},t)}}var rc=class{width=0;height=0;scrollHeight=0;scrollWidth=0;debouncedResize;wrapperResizeObserver;contentResizeObserver;constructor(e,t,{autoResize:n=!0,debounce:r=250}={}){this.wrapper=e,this.content=t,n&&(this.debouncedResize=nc(this.resize,r),this.wrapper instanceof Window?window.addEventListener(`resize`,this.debouncedResize):(this.wrapperResizeObserver=new ResizeObserver(this.debouncedResize),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(this.debouncedResize),this.contentResizeObserver.observe(this.content)),this.resize()}destroy(){this.wrapperResizeObserver?.disconnect(),this.contentResizeObserver?.disconnect(),this.wrapper===window&&this.debouncedResize&&window.removeEventListener(`resize`,this.debouncedResize)}resize=()=>{this.onWrapperResize(),this.onContentResize()};onWrapperResize=()=>{this.wrapper instanceof Window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)};onContentResize=()=>{this.wrapper instanceof Window?(this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth):(this.scrollHeight=this.wrapper.scrollHeight,this.scrollWidth=this.wrapper.scrollWidth)};get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}},ic=class{events={};emit(e,...t){let n=this.events[e]||[];for(let e=0,r=n.length;e<r;e++)n[e]?.(...t)}on(e,t){return this.events[e]?this.events[e].push(t):this.events[e]=[t],()=>{this.events[e]=this.events[e]?.filter(e=>t!==e)}}off(e,t){this.events[e]=this.events[e]?.filter(e=>t!==e)}destroy(){this.events={}}},ac=100/6,oc={passive:!1};function sc(e,t){return e===1?ac:e===2?t:1}var cc=class{touchStart={x:0,y:0};lastDelta={x:0,y:0};window={width:0,height:0};emitter=new ic;constructor(e,t={wheelMultiplier:1,touchMultiplier:1}){this.element=e,this.options=t,window.addEventListener(`resize`,this.onWindowResize),this.onWindowResize(),this.element.addEventListener(`wheel`,this.onWheel,oc),this.element.addEventListener(`touchstart`,this.onTouchStart,oc),this.element.addEventListener(`touchmove`,this.onTouchMove,oc),this.element.addEventListener(`touchend`,this.onTouchEnd,oc)}on(e,t){return this.emitter.on(e,t)}destroy(){this.emitter.destroy(),window.removeEventListener(`resize`,this.onWindowResize),this.element.removeEventListener(`wheel`,this.onWheel,oc),this.element.removeEventListener(`touchstart`,this.onTouchStart,oc),this.element.removeEventListener(`touchmove`,this.onTouchMove,oc),this.element.removeEventListener(`touchend`,this.onTouchEnd,oc)}onTouchStart=e=>{let{clientX:t,clientY:n}=e.targetTouches?e.targetTouches[0]:e;this.touchStart.x=t,this.touchStart.y=n,this.lastDelta={x:0,y:0},this.emitter.emit(`scroll`,{deltaX:0,deltaY:0,event:e})};onTouchMove=e=>{let{clientX:t,clientY:n}=e.targetTouches?e.targetTouches[0]:e,r=-(t-this.touchStart.x)*this.options.touchMultiplier,i=-(n-this.touchStart.y)*this.options.touchMultiplier;this.touchStart.x=t,this.touchStart.y=n,this.lastDelta={x:r,y:i},this.emitter.emit(`scroll`,{deltaX:r,deltaY:i,event:e})};onTouchEnd=e=>{this.emitter.emit(`scroll`,{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:e})};onWheel=e=>{let{deltaX:t,deltaY:n,deltaMode:r}=e,i=sc(r,this.window.width),a=sc(r,this.window.height);t*=i,n*=a,t*=this.options.wheelMultiplier,n*=this.options.wheelMultiplier,this.emitter.emit(`scroll`,{deltaX:t,deltaY:n,event:e})};onWindowResize=()=>{this.window={width:window.innerWidth,height:window.innerHeight}}},lc=e=>Math.min(1,1.001-2**(-10*e)),uc=class{_isScrolling=!1;_isStopped=!1;_isLocked=!1;_preventNextNativeScrollEvent=!1;_resetVelocityTimeout=null;_rafId=null;_isDraggingSelection=!1;reducedMotionMediaQuery=window.matchMedia(`(prefers-reduced-motion: reduce)`);isTouching;isIos;time=0;userData={};lastVelocity=0;velocity=0;direction=0;options;targetScroll;animatedScroll;animate=new tc;emitter=new ic;dimensions;virtualScroll;constructor({wrapper:e=window,content:t=document.documentElement,eventsTarget:n=e,smoothWheel:r=!0,syncTouch:i=!1,syncTouchLerp:a=.075,touchInertiaExponent:o=1.7,duration:s,easing:c,lerp:l=.1,infinite:u=!1,orientation:d=`vertical`,gestureOrientation:f=d===`horizontal`?`both`:`vertical`,touchMultiplier:p=1,wheelMultiplier:m=1,autoResize:h=!0,prevent:g,virtualScroll:_,overscroll:v=!0,autoRaf:y=!1,anchors:b=!1,autoToggle:x=!1,allowNestedScroll:S=!1,__experimental__naiveDimensions:C=!1,naiveDimensions:w=C,stopInertiaOnNavigate:T=!1,respectReducedMotion:E=!0}={}){window.lenisVersion=Xs,window.lenis||(window.lenis={}),window.lenis.version=Xs,d===`horizontal`&&(window.lenis.horizontal=!0),i===!0&&(window.lenis.touch=!0),this.isIos=/(iPad|iPhone|iPod)/g.test(navigator.userAgent),e&&e!==document.documentElement||(e=window),typeof s==`number`&&typeof c!=`function`?c=lc:typeof c==`function`&&typeof s!=`number`&&(s=1),this.options={wrapper:e,content:t,eventsTarget:n,smoothWheel:r,syncTouch:i,syncTouchLerp:a,touchInertiaExponent:o,duration:s,easing:c,lerp:l,infinite:u,gestureOrientation:f,orientation:d,touchMultiplier:p,wheelMultiplier:m,autoResize:h,prevent:g,virtualScroll:_,overscroll:v,autoRaf:y,anchors:b,autoToggle:x,allowNestedScroll:S,naiveDimensions:w,stopInertiaOnNavigate:T,respectReducedMotion:E},this.dimensions=new rc(e,t,{autoResize:h}),this.updateClassName(),this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener(`scroll`,this.onNativeScroll),this.options.wrapper.addEventListener(`scrollend`,this.onScrollEnd,{capture:!0}),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.addEventListener(`click`,this.onClick),this.options.wrapper.addEventListener(`pointerdown`,this.onPointerDown),this.virtualScroll=new cc(n,{touchMultiplier:p,wheelMultiplier:m}),this.virtualScroll.on(`scroll`,this.onVirtualScroll),this.options.autoToggle&&(this.checkOverflow(),this.rootElement.addEventListener(`transitionend`,this.onTransitionEnd)),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))}destroy(){this.emitter.destroy(),this._resetVelocityTimeout!==null&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this.options.wrapper.removeEventListener(`scroll`,this.onNativeScroll),this.options.wrapper.removeEventListener(`scrollend`,this.onScrollEnd,{capture:!0}),this.options.wrapper.removeEventListener(`pointerdown`,this.onPointerDown),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.removeEventListener(`click`,this.onClick),this.virtualScroll.destroy(),this.dimensions.destroy(),this.cleanUpClassName(),this._rafId&&cancelAnimationFrame(this._rafId)}on(e,t){return this.emitter.on(e,t)}off(e,t){return this.emitter.off(e,t)}onScrollEnd=e=>{e instanceof CustomEvent||(this.isScrolling===`smooth`||this.isScrolling===!1)&&e.stopPropagation()};dispatchScrollendEvent=()=>{this.options.wrapper.dispatchEvent(new CustomEvent(`scrollend`,{bubbles:this.options.wrapper===window,detail:{lenisScrollEnd:!0}}))};get overflow(){let e=this.isHorizontal?`overflow-x`:`overflow-y`;return getComputedStyle(this.rootElement)[e]}checkOverflow(){[`hidden`,`clip`].includes(this.overflow)?this.internalStop():this.internalStart()}onTransitionEnd=e=>{e.propertyName?.includes(`overflow`)&&e.target===this.rootElement&&this.checkOverflow()};setScroll(e){this.isHorizontal?this.options.wrapper.scrollTo({left:e,behavior:`instant`}):this.options.wrapper.scrollTo({top:e,behavior:`instant`})}onClick=e=>{let t=e.composedPath().filter(e=>e instanceof HTMLAnchorElement&&e.href).map(e=>new URL(e.href)),n=new URL(window.location.href);if(this.options.anchors){let e=t.find(e=>n.host===e.host&&n.pathname===e.pathname&&e.hash);if(e){let t=typeof this.options.anchors==`object`&&this.options.anchors?this.options.anchors:void 0,n=decodeURIComponent(e.hash);this.scrollTo(n,t);return}}this.options.stopInertiaOnNavigate&&t.some(e=>n.host===e.host&&n.pathname!==e.pathname)&&this.reset()};onPointerDown=e=>{e.button===1&&this.reset()};isTouchOnSelectionHandle(e){let t=window.getSelection();if(!t||t.isCollapsed||t.rangeCount===0)return!1;let n=e.targetTouches[0]??e.changedTouches[0];if(!n)return!1;let r=t.getRangeAt(0).getClientRects();if(r.length===0)return!1;let i=r[0],a=r[r.length-1],o=Math.hypot(n.clientX-i.left,n.clientY-i.top)<=40,s=Math.hypot(n.clientX-a.right,n.clientY-a.bottom)<=40;return o||s}onVirtualScroll=e=>{if(typeof this.options.virtualScroll==`function`&&this.options.virtualScroll(e)===!1)return;let{deltaX:t,deltaY:n,event:r}=e;if(this.emitter.emit(`virtual-scroll`,{deltaX:t,deltaY:n,event:r}),r.ctrlKey||r.lenisStopPropagation)return;let i=r.type.includes(`touch`),a=r.type.includes(`wheel`);if(i&&this.isIos&&(r.type===`touchstart`&&(this._isDraggingSelection=this.isTouchOnSelectionHandle(r)),this._isDraggingSelection)){r.type===`touchend`&&(this._isDraggingSelection=!1);return}this.isTouching=r.type===`touchstart`||r.type===`touchmove`;let o=t===0&&n===0;if(this.options.syncTouch&&i&&r.type===`touchstart`&&o&&!this.isStopped&&!this.isLocked){this.reset();return}let s=this.options.gestureOrientation===`vertical`&&n===0||this.options.gestureOrientation===`horizontal`&&t===0;if(o||s)return;let c=r.composedPath();c=c.slice(0,c.indexOf(this.rootElement));let l=this.options.prevent,u=Math.abs(t)>=Math.abs(n)?`horizontal`:`vertical`;if(c.find(e=>e instanceof HTMLElement&&(typeof l==`function`&&l?.(e)||e.hasAttribute?.(`data-lenis-prevent`)||u===`vertical`&&e.hasAttribute?.(`data-lenis-prevent-vertical`)||u===`horizontal`&&e.hasAttribute?.(`data-lenis-prevent-horizontal`)||i&&e.hasAttribute?.(`data-lenis-prevent-touch`)||a&&e.hasAttribute?.(`data-lenis-prevent-wheel`)||this.options.allowNestedScroll&&this.hasNestedScroll(e,{deltaX:t,deltaY:n}))))return;if(this.isStopped||this.isLocked){r.cancelable&&r.preventDefault();return}if(!(this.options.syncTouch&&i||this.options.smoothWheel&&a)){this.isScrolling=`native`,this.animate.stop(),r.lenisStopPropagation=!0;return}let d=n;this.options.gestureOrientation===`both`?d=Math.abs(n)>Math.abs(t)?n:t:this.options.gestureOrientation===`horizontal`&&(d=t),(!this.options.overscroll||this.options.infinite||this.options.wrapper!==window&&this.limit>0&&(this.animatedScroll>0&&this.animatedScroll<this.limit||this.animatedScroll===0&&n>0||this.animatedScroll===this.limit&&n<0))&&(r.lenisStopPropagation=!0),r.cancelable&&r.preventDefault();let f=i&&this.options.syncTouch,p=i&&r.type===`touchend`;p&&(d=Math.sign(d)*Math.abs(this.velocity)**this.options.touchInertiaExponent),this.scrollTo(this.targetScroll+d,{programmatic:!1,...f?{lerp:p?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}})};resize(){this.dimensions.resize(),this.animatedScroll=this.targetScroll=this.actualScroll,this.emit()}emit(){this.emitter.emit(`scroll`,this)}onNativeScroll=()=>{if(this._resetVelocityTimeout!==null&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this._preventNextNativeScrollEvent)this._preventNextNativeScrollEvent=!1;else if(this.isScrolling===!1||this.isScrolling===`native`){let e=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity,this.velocity=this.animatedScroll-e,this.direction=Math.sign(this.animatedScroll-e),this.isStopped||(this.isScrolling=`native`),this.emit(),this.velocity!==0&&(this._resetVelocityTimeout=setTimeout(()=>{this.lastVelocity=this.velocity,this.velocity=0,this.isScrolling=!1,this.emit()},400))}};reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity=0,this.animate.stop()}start(){this.isStopped&&(this.options.autoToggle?this.rootElement.style.removeProperty(`overflow`):this.internalStart())}internalStart(){this.isStopped&&(this.reset(),this.isStopped=!1,this.emit())}stop(){this.isStopped||(this.options.autoToggle?this.rootElement.style.setProperty(`overflow`,`clip`):this.internalStop())}internalStop(){this.isStopped||(this.reset(),this.isStopped=!0,this.emit())}raf=e=>{let t=e-(this.time||e);this.time=e,this.animate.advance(t*.001),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))};scrollTo(e,{offset:t=0,immediate:n=!1,lock:r=!1,programmatic:i=!0,lerp:a=i?this.options.lerp:void 0,duration:o=i?this.options.duration:void 0,easing:s=i?this.options.easing:void 0,onStart:c,onComplete:l,force:u=!1,userData:d}={}){if(this.prefersReducedMotion&&(i?n=!0:(a=1,o=void 0,s=void 0)),(this.isStopped||this.isLocked)&&!u)return;let f=e,p=t;if(typeof f==`string`&&[`top`,`left`,`start`,`#`].includes(f))f=0;else if(typeof f==`string`&&[`bottom`,`right`,`end`].includes(f))f=this.limit;else{let e=null;if(typeof f==`string`?(e=f.startsWith(`#`)?document.getElementById(f.slice(1)):document.querySelector(f),e||(f===`#top`?f=0:console.warn(`Lenis: Target not found`,f))):f instanceof Element&&(e=f),e){if(this.options.wrapper!==window){let e=this.rootElement.getBoundingClientRect();p-=this.isHorizontal?e.left:e.top}let t=e.getBoundingClientRect(),n=getComputedStyle(e),r=this.isHorizontal?Number.parseFloat(n.scrollMarginLeft):Number.parseFloat(n.scrollMarginTop),i=getComputedStyle(this.rootElement),a=this.isHorizontal?Number.parseFloat(i.scrollPaddingLeft):Number.parseFloat(i.scrollPaddingTop);f=(this.isHorizontal?t.left:t.top)+this.animatedScroll-(Number.isNaN(r)?0:r)-(Number.isNaN(a)?0:a)}}if(typeof f==`number`){if(f+=p,this.options.infinite){if(i){this.targetScroll=this.animatedScroll=this.scroll;let e=f-this.animatedScroll;e>this.limit/2?f-=this.limit:e<-this.limit/2&&(f+=this.limit)}}else f=Zs(0,f,this.limit);f===this.targetScroll?(c?.(this),l?.(this)):(this.userData=d??{},n?(this.animatedScroll=this.targetScroll=f,this.setScroll(this.scroll),this.reset(),this.preventNextNativeScrollEvent(),this.emit(),l?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()})):(i||(this.targetScroll=f),typeof o==`number`&&typeof s!=`function`?s=lc:typeof s==`function`&&typeof o!=`number`&&(o=1),this.animate.fromTo(this.animatedScroll,f,{duration:o,easing:s,lerp:a,onStart:()=>{r&&(this.isLocked=!0),this.isScrolling=`smooth`,c?.(this)},onUpdate:(e,t)=>{this.isScrolling=`smooth`,this.lastVelocity=this.velocity,this.velocity=e-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=e,this.setScroll(this.scroll),i&&(this.targetScroll=e),t||this.emit(),t&&(this.reset(),this.emit(),l?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()}),this.preventNextNativeScrollEvent())}})))}}preventNextNativeScrollEvent(){this._preventNextNativeScrollEvent=!0,requestAnimationFrame(()=>{this._preventNextNativeScrollEvent=!1})}hasNestedScroll(e,{deltaX:t,deltaY:n}){let r=Date.now();e._lenis||={};let i=e._lenis,a,o,s,c,l,u,d,f,p,m;if(r-(i.time??0)>2e3){i.time=Date.now();let t=window.getComputedStyle(e);if(i.computedStyle=t,a=[`auto`,`overlay`,`scroll`].includes(t.overflowX),o=[`auto`,`overlay`,`scroll`].includes(t.overflowY),l=[`auto`].includes(t.overscrollBehaviorX),u=[`auto`].includes(t.overscrollBehaviorY),i.hasOverflowX=a,i.hasOverflowY=o,!(a||o))return!1;d=e.scrollWidth,f=e.scrollHeight,p=e.clientWidth,m=e.clientHeight,s=d>p,c=f>m,i.isScrollableX=s,i.isScrollableY=c,i.scrollWidth=d,i.scrollHeight=f,i.clientWidth=p,i.clientHeight=m,i.hasOverscrollBehaviorX=l,i.hasOverscrollBehaviorY=u}else s=i.isScrollableX,c=i.isScrollableY,a=i.hasOverflowX,o=i.hasOverflowY,d=i.scrollWidth,f=i.scrollHeight,p=i.clientWidth,m=i.clientHeight,l=i.hasOverscrollBehaviorX,u=i.hasOverscrollBehaviorY;if(!(a&&s||o&&c))return!1;let h=Math.abs(t)>=Math.abs(n)?`horizontal`:`vertical`,g,_,v,y,b,x;if(h===`horizontal`)g=Math.round(e.scrollLeft),_=d-p,v=t,y=a,b=s,x=l;else if(h===`vertical`)g=Math.round(e.scrollTop),_=f-m,v=n,y=o,b=c,x=u;else return!1;return!x&&(g>=_||g<=0)||(v>0?g<_:g>0)&&y&&b}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.options.naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?`x`:`y`]}get isHorizontal(){return this.options.orientation===`horizontal`}get actualScroll(){let e=this.options.wrapper;return this.isHorizontal?e.scrollX??e.scrollLeft:e.scrollY??e.scrollTop}get scroll(){return this.options.infinite?ec(this.animatedScroll,this.limit):this.animatedScroll}get progress(){return this.limit===0?1:this.scroll/this.limit}get isScrolling(){return this._isScrolling}set isScrolling(e){this._isScrolling!==e&&(this._isScrolling=e,this.updateClassName())}get isStopped(){return this._isStopped}set isStopped(e){this._isStopped!==e&&(this._isStopped=e,this.updateClassName())}get isLocked(){return this._isLocked}set isLocked(e){this._isLocked!==e&&(this._isLocked=e,this.updateClassName())}get isSmooth(){return this.isScrolling===`smooth`}get prefersReducedMotion(){return this.options.respectReducedMotion&&this.reducedMotionMediaQuery.matches}get className(){let e=`lenis`;return this.options.autoToggle&&(e+=` lenis-autoToggle`),this.isStopped&&(e+=` lenis-stopped`),this.isLocked&&(e+=` lenis-locked`),this.isScrolling&&(e+=` lenis-scrolling`),this.isScrolling===`smooth`&&(e+=` lenis-smooth`),e}updateClassName(){this.cleanUpClassName(),this.className.split(` `).forEach(e=>{this.rootElement.classList.add(e)})}cleanUpClassName(){for(let e of Array.from(this.rootElement.classList))(e===`lenis`||e.startsWith(`lenis-`))&&this.rootElement.classList.remove(e)}},dc=c(o(((e,t,n)=>{(function(n,r){typeof e==`object`&&typeof t==`object`?t.exports=r():typeof define==`function`&&define.amd?define(`Matter`,[],r):typeof e==`object`?e.Matter=r():n.Matter=r()})(n,function(){return(function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){typeof Symbol<`u`&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:`Module`}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(t&1&&(e=n(e)),t&8||t&4&&typeof e==`object`&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),t&2&&typeof e!=`string`)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,`a`,t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p=``,n(n.s=20)})([(function(e,t){var n={};e.exports=n,(function(){n._baseDelta=1e3/60,n._nextId=0,n._seed=0,n._nowStartTime=+new Date,n._warnedOnce={},n._decomp=null,n.extend=function(e,t){var r,i;typeof t==`boolean`?(r=2,i=t):(r=1,i=!0);for(var a=r;a<arguments.length;a++){var o=arguments[a];if(o)for(var s in o)i&&o[s]&&o[s].constructor===Object&&(!e[s]||e[s].constructor===Object)?(e[s]=e[s]||{},n.extend(e[s],i,o[s])):e[s]=o[s]}return e},n.clone=function(e,t){return n.extend({},t,e)},n.keys=function(e){if(Object.keys)return Object.keys(e);var t=[];for(var n in e)t.push(n);return t},n.values=function(e){var t=[];if(Object.keys){for(var n=Object.keys(e),r=0;r<n.length;r++)t.push(e[n[r]]);return t}for(var i in e)t.push(e[i]);return t},n.get=function(e,t,n,r){t=t.split(`.`).slice(n,r);for(var i=0;i<t.length;i+=1)e=e[t[i]];return e},n.set=function(e,t,r,i,a){var o=t.split(`.`).slice(i,a);return n.get(e,t,0,-1)[o[o.length-1]]=r,r},n.shuffle=function(e){for(var t=e.length-1;t>0;t--){var r=Math.floor(n.random()*(t+1)),i=e[t];e[t]=e[r],e[r]=i}return e},n.choose=function(e){return e[Math.floor(n.random()*e.length)]},n.isElement=function(e){return typeof HTMLElement<`u`?e instanceof HTMLElement:!!(e&&e.nodeType&&e.nodeName)},n.isArray=function(e){return Object.prototype.toString.call(e)===`[object Array]`},n.isFunction=function(e){return typeof e==`function`},n.isPlainObject=function(e){return typeof e==`object`&&e.constructor===Object},n.isString=function(e){return toString.call(e)===`[object String]`},n.clamp=function(e,t,n){return e<t?t:e>n?n:e},n.sign=function(e){return e<0?-1:1},n.now=function(){if(typeof window<`u`&&window.performance){if(window.performance.now)return window.performance.now();if(window.performance.webkitNow)return window.performance.webkitNow()}return Date.now?Date.now():new Date-n._nowStartTime},n.random=function(t,n){return t=t===void 0?0:t,n=n===void 0?1:n,t+e()*(n-t)};var e=function(){return n._seed=(n._seed*9301+49297)%233280,n._seed/233280};n.colorToNumber=function(e){return e=e.replace(`#`,``),e.length==3&&(e=e.charAt(0)+e.charAt(0)+e.charAt(1)+e.charAt(1)+e.charAt(2)+e.charAt(2)),parseInt(e,16)},n.logLevel=1,n.log=function(){console&&n.logLevel>0&&n.logLevel<=3&&console.log.apply(console,[`matter-js:`].concat(Array.prototype.slice.call(arguments)))},n.info=function(){console&&n.logLevel>0&&n.logLevel<=2&&console.info.apply(console,[`matter-js:`].concat(Array.prototype.slice.call(arguments)))},n.warn=function(){console&&n.logLevel>0&&n.logLevel<=3&&console.warn.apply(console,[`matter-js:`].concat(Array.prototype.slice.call(arguments)))},n.warnOnce=function(){var e=Array.prototype.slice.call(arguments).join(` `);n._warnedOnce[e]||(n.warn(e),n._warnedOnce[e]=!0)},n.deprecated=function(e,t,r){e[t]=n.chain(function(){n.warnOnce(`🔅 deprecated 🔅`,r)},e[t])},n.nextId=function(){return n._nextId++},n.indexOf=function(e,t){if(e.indexOf)return e.indexOf(t);for(var n=0;n<e.length;n++)if(e[n]===t)return n;return-1},n.map=function(e,t){if(e.map)return e.map(t);for(var n=[],r=0;r<e.length;r+=1)n.push(t(e[r]));return n},n.topologicalSort=function(e){var t=[],r=[],i=[];for(var a in e)!r[a]&&!i[a]&&n._topologicalSort(a,r,i,e,t);return t},n._topologicalSort=function(e,t,r,i,a){var o=i[e]||[];r[e]=!0;for(var s=0;s<o.length;s+=1){var c=o[s];r[c]||t[c]||n._topologicalSort(c,t,r,i,a)}r[e]=!1,t[e]=!0,a.push(e)},n.chain=function(){for(var e=[],t=0;t<arguments.length;t+=1){var n=arguments[t];n._chained?e.push.apply(e,n._chained):e.push(n)}var r=function(){for(var t,n=Array(arguments.length),r=0,i=arguments.length;r<i;r++)n[r]=arguments[r];for(r=0;r<e.length;r+=1){var a=e[r].apply(t,n);a!==void 0&&(t=a)}return t};return r._chained=e,r},n.chainPathBefore=function(e,t,r){return n.set(e,t,n.chain(r,n.get(e,t)))},n.chainPathAfter=function(e,t,r){return n.set(e,t,n.chain(n.get(e,t),r))},n.setDecomp=function(e){n._decomp=e},n.getDecomp=function(){var e=n._decomp;try{!e&&typeof window<`u`&&(e=window.decomp),!e&&typeof global<`u`&&(e=global.decomp)}catch{e=null}return e}})()}),(function(e,t){var n={};e.exports=n,(function(){n.create=function(e){var t={min:{x:0,y:0},max:{x:0,y:0}};return e&&n.update(t,e),t},n.update=function(e,t,n){e.min.x=1/0,e.max.x=-1/0,e.min.y=1/0,e.max.y=-1/0;for(var r=0;r<t.length;r++){var i=t[r];i.x>e.max.x&&(e.max.x=i.x),i.x<e.min.x&&(e.min.x=i.x),i.y>e.max.y&&(e.max.y=i.y),i.y<e.min.y&&(e.min.y=i.y)}n&&(n.x>0?e.max.x+=n.x:e.min.x+=n.x,n.y>0?e.max.y+=n.y:e.min.y+=n.y)},n.contains=function(e,t){return t.x>=e.min.x&&t.x<=e.max.x&&t.y>=e.min.y&&t.y<=e.max.y},n.overlaps=function(e,t){return e.min.x<=t.max.x&&e.max.x>=t.min.x&&e.max.y>=t.min.y&&e.min.y<=t.max.y},n.translate=function(e,t){e.min.x+=t.x,e.max.x+=t.x,e.min.y+=t.y,e.max.y+=t.y},n.shift=function(e,t){var n=e.max.x-e.min.x,r=e.max.y-e.min.y;e.min.x=t.x,e.max.x=t.x+n,e.min.y=t.y,e.max.y=t.y+r}})()}),(function(e,t){var n={};e.exports=n,(function(){n.create=function(e,t){return{x:e||0,y:t||0}},n.clone=function(e){return{x:e.x,y:e.y}},n.magnitude=function(e){return Math.sqrt(e.x*e.x+e.y*e.y)},n.magnitudeSquared=function(e){return e.x*e.x+e.y*e.y},n.rotate=function(e,t,n){var r=Math.cos(t),i=Math.sin(t);n||={};var a=e.x*r-e.y*i;return n.y=e.x*i+e.y*r,n.x=a,n},n.rotateAbout=function(e,t,n,r){var i=Math.cos(t),a=Math.sin(t);r||={};var o=n.x+((e.x-n.x)*i-(e.y-n.y)*a);return r.y=n.y+((e.x-n.x)*a+(e.y-n.y)*i),r.x=o,r},n.normalise=function(e){var t=n.magnitude(e);return t===0?{x:0,y:0}:{x:e.x/t,y:e.y/t}},n.dot=function(e,t){return e.x*t.x+e.y*t.y},n.cross=function(e,t){return e.x*t.y-e.y*t.x},n.cross3=function(e,t,n){return(t.x-e.x)*(n.y-e.y)-(t.y-e.y)*(n.x-e.x)},n.add=function(e,t,n){return n||={},n.x=e.x+t.x,n.y=e.y+t.y,n},n.sub=function(e,t,n){return n||={},n.x=e.x-t.x,n.y=e.y-t.y,n},n.mult=function(e,t){return{x:e.x*t,y:e.y*t}},n.div=function(e,t){return{x:e.x/t,y:e.y/t}},n.perp=function(e,t){return t=t===!0?-1:1,{x:t*-e.y,y:t*e.x}},n.neg=function(e){return{x:-e.x,y:-e.y}},n.angle=function(e,t){return Math.atan2(t.y-e.y,t.x-e.x)},n._temp=[n.create(),n.create(),n.create(),n.create(),n.create(),n.create()]})()}),(function(e,t,n){var r={};e.exports=r;var i=n(2),a=n(0);(function(){r.create=function(e,t){for(var n=[],r=0;r<e.length;r++){var i=e[r],a={x:i.x,y:i.y,index:r,body:t,isInternal:!1};n.push(a)}return n},r.fromPath=function(e,t){var n=/L?\s*([-\d.e]+)[\s,]*([-\d.e]+)*/gi,i=[];return e.replace(n,function(e,t,n){i.push({x:parseFloat(t),y:parseFloat(n)})}),r.create(i,t)},r.centre=function(e){for(var t=r.area(e,!0),n={x:0,y:0},a,o,s,c=0;c<e.length;c++)s=(c+1)%e.length,a=i.cross(e[c],e[s]),o=i.mult(i.add(e[c],e[s]),a),n=i.add(n,o);return i.div(n,6*t)},r.mean=function(e){for(var t={x:0,y:0},n=0;n<e.length;n++)t.x+=e[n].x,t.y+=e[n].y;return i.div(t,e.length)},r.area=function(e,t){for(var n=0,r=e.length-1,i=0;i<e.length;i++)n+=(e[r].x-e[i].x)*(e[r].y+e[i].y),r=i;return t?n/2:Math.abs(n)/2},r.inertia=function(e,t){for(var n=0,r=0,a=e,o,s,c=0;c<a.length;c++)s=(c+1)%a.length,o=Math.abs(i.cross(a[s],a[c])),n+=o*(i.dot(a[s],a[s])+i.dot(a[s],a[c])+i.dot(a[c],a[c])),r+=o;return t/6*(n/r)},r.translate=function(e,t,n){n=n===void 0?1:n;for(var r=e.length,i=t.x*n,a=t.y*n,o=0;o<r;o++)e[o].x+=i,e[o].y+=a;return e},r.rotate=function(e,t,n){if(t!==0){for(var r=Math.cos(t),i=Math.sin(t),a=n.x,o=n.y,s=e.length,c,l,u,d=0;d<s;d++)c=e[d],l=c.x-a,u=c.y-o,c.x=a+(l*r-u*i),c.y=o+(l*i+u*r);return e}},r.contains=function(e,t){for(var n=t.x,r=t.y,i=e.length,a=e[i-1],o,s=0;s<i;s++){if(o=e[s],(n-a.x)*(o.y-a.y)+(r-a.y)*(a.x-o.x)>0)return!1;a=o}return!0},r.scale=function(e,t,n,a){if(t===1&&n===1)return e;a||=r.centre(e);for(var o,s,c=0;c<e.length;c++)o=e[c],s=i.sub(o,a),e[c].x=a.x+s.x*t,e[c].y=a.y+s.y*n;return e},r.chamfer=function(e,t,n,r,o){typeof t==`number`?t=[t]:t||=[8],n=n===void 0?-1:n,r||=2,o||=14;for(var s=[],c=0;c<e.length;c++){var l=e[c-1>=0?c-1:e.length-1],u=e[c],d=e[(c+1)%e.length],f=t[c<t.length?c:t.length-1];if(f===0)s.push(u);else{var p=i.normalise({x:u.y-l.y,y:l.x-u.x}),m=i.normalise({x:d.y-u.y,y:u.x-d.x}),h=Math.sqrt(2*f**2),g=i.mult(a.clone(p),f),_=i.normalise(i.mult(i.add(p,m),.5)),v=i.sub(u,i.mult(_,h)),y=n;n===-1&&(y=f**.32*1.75),y=a.clamp(y,r,o),y%2==1&&(y+=1);for(var b=Math.acos(i.dot(p,m))/y,x=0;x<y;x++)s.push(i.add(i.rotate(g,b*x),v))}}return s},r.clockwiseSort=function(e){var t=r.mean(e);return e.sort(function(e,n){return i.angle(t,e)-i.angle(t,n)}),e},r.isConvex=function(e){var t=0,n=e.length,r,i,a,o;if(n<3)return null;for(r=0;r<n;r++)if(i=(r+1)%n,a=(r+2)%n,o=(e[i].x-e[r].x)*(e[a].y-e[i].y),o-=(e[i].y-e[r].y)*(e[a].x-e[i].x),o<0?t|=1:o>0&&(t|=2),t===3)return!1;return t!==0||null},r.hull=function(e){var t=[],n=[],r,a;for(e=e.slice(0),e.sort(function(e,t){var n=e.x-t.x;return n===0?e.y-t.y:n}),a=0;a<e.length;a+=1){for(r=e[a];n.length>=2&&i.cross3(n[n.length-2],n[n.length-1],r)<=0;)n.pop();n.push(r)}for(a=e.length-1;a>=0;--a){for(r=e[a];t.length>=2&&i.cross3(t[t.length-2],t[t.length-1],r)<=0;)t.pop();t.push(r)}return t.pop(),n.pop(),t.concat(n)}})()}),(function(e,t,n){var r={};e.exports=r;var i=n(3),a=n(2),o=n(7),s=n(0),c=n(1),l=n(11);(function(){r._timeCorrection=!0,r._inertiaScale=4,r._nextCollidingGroupId=1,r._nextNonCollidingGroupId=-1,r._nextCategory=1,r._baseDelta=1e3/60,r.create=function(t){var n={id:s.nextId(),type:`body`,label:`Body`,parts:[],plugin:{},angle:0,vertices:i.fromPath(`L 0 0 L 40 0 L 40 40 L 0 40`),position:{x:0,y:0},force:{x:0,y:0},torque:0,positionImpulse:{x:0,y:0},constraintImpulse:{x:0,y:0,angle:0},totalContacts:0,speed:0,angularSpeed:0,velocity:{x:0,y:0},angularVelocity:0,isSensor:!1,isStatic:!1,isSleeping:!1,motion:0,sleepThreshold:60,density:.001,restitution:0,friction:.1,frictionStatic:.5,frictionAir:.01,collisionFilter:{category:1,mask:4294967295,group:0},slop:.05,timeScale:1,render:{visible:!0,opacity:1,strokeStyle:null,fillStyle:null,lineWidth:null,sprite:{xScale:1,yScale:1,xOffset:0,yOffset:0}},events:null,bounds:null,chamfer:null,circleRadius:0,positionPrev:null,anglePrev:0,parent:null,axes:null,area:0,mass:0,inertia:0,deltaTime:1e3/60,_original:null},r=s.extend(n,t);return e(r,t),r},r.nextGroup=function(e){return e?r._nextNonCollidingGroupId--:r._nextCollidingGroupId++},r.nextCategory=function(){return r._nextCategory<<=1,r._nextCategory};var e=function(e,t){t||={},r.set(e,{bounds:e.bounds||c.create(e.vertices),positionPrev:e.positionPrev||a.clone(e.position),anglePrev:e.anglePrev||e.angle,vertices:e.vertices,parts:e.parts||[e],isStatic:e.isStatic,isSleeping:e.isSleeping,parent:e.parent||e}),i.rotate(e.vertices,e.angle,e.position),l.rotate(e.axes,e.angle),c.update(e.bounds,e.vertices,e.velocity),r.set(e,{axes:t.axes||e.axes,area:t.area||e.area,mass:t.mass||e.mass,inertia:t.inertia||e.inertia});var n=e.isStatic?`#14151f`:s.choose([`#f19648`,`#f5d259`,`#f55a3c`,`#063e7b`,`#ececd1`]),o=e.isStatic?`#555`:`#ccc`,u=e.isStatic&&e.render.fillStyle===null?1:0;e.render.fillStyle=e.render.fillStyle||n,e.render.strokeStyle=e.render.strokeStyle||o,e.render.lineWidth=e.render.lineWidth||u,e.render.sprite.xOffset+=-(e.bounds.min.x-e.position.x)/(e.bounds.max.x-e.bounds.min.x),e.render.sprite.yOffset+=-(e.bounds.min.y-e.position.y)/(e.bounds.max.y-e.bounds.min.y)};r.set=function(e,t,n){for(var i in typeof t==`string`&&(i=t,t={},t[i]=n),t)if(Object.prototype.hasOwnProperty.call(t,i))switch(n=t[i],i){case`isStatic`:r.setStatic(e,n);break;case`isSleeping`:o.set(e,n);break;case`mass`:r.setMass(e,n);break;case`density`:r.setDensity(e,n);break;case`inertia`:r.setInertia(e,n);break;case`vertices`:r.setVertices(e,n);break;case`position`:r.setPosition(e,n);break;case`angle`:r.setAngle(e,n);break;case`velocity`:r.setVelocity(e,n);break;case`angularVelocity`:r.setAngularVelocity(e,n);break;case`speed`:r.setSpeed(e,n);break;case`angularSpeed`:r.setAngularSpeed(e,n);break;case`parts`:r.setParts(e,n);break;case`centre`:r.setCentre(e,n);break;default:e[i]=n}},r.setStatic=function(e,t){for(var n=0;n<e.parts.length;n++){var r=e.parts[n];t?(r.isStatic||(r._original={restitution:r.restitution,friction:r.friction,mass:r.mass,inertia:r.inertia,density:r.density,inverseMass:r.inverseMass,inverseInertia:r.inverseInertia}),r.restitution=0,r.friction=1,r.mass=r.inertia=r.density=1/0,r.inverseMass=r.inverseInertia=0,r.positionPrev.x=r.position.x,r.positionPrev.y=r.position.y,r.anglePrev=r.angle,r.angularVelocity=0,r.speed=0,r.angularSpeed=0,r.motion=0):r._original&&=(r.restitution=r._original.restitution,r.friction=r._original.friction,r.mass=r._original.mass,r.inertia=r._original.inertia,r.density=r._original.density,r.inverseMass=r._original.inverseMass,r.inverseInertia=r._original.inverseInertia,null),r.isStatic=t}},r.setMass=function(e,t){e.inertia=e.inertia/(e.mass/6)*(t/6),e.inverseInertia=1/e.inertia,e.mass=t,e.inverseMass=1/e.mass,e.density=e.mass/e.area},r.setDensity=function(e,t){r.setMass(e,t*e.area),e.density=t},r.setInertia=function(e,t){e.inertia=t,e.inverseInertia=1/e.inertia},r.setVertices=function(e,t){e.vertices=t[0].body===e?t:i.create(t,e),e.axes=l.fromVertices(e.vertices),e.area=i.area(e.vertices),r.setMass(e,e.density*e.area);var n=i.centre(e.vertices);i.translate(e.vertices,n,-1),r.setInertia(e,r._inertiaScale*i.inertia(e.vertices,e.mass)),i.translate(e.vertices,e.position),c.update(e.bounds,e.vertices,e.velocity)},r.setParts=function(e,t,n){var a;for(t=t.slice(0),e.parts.length=0,e.parts.push(e),e.parent=e,a=0;a<t.length;a++){var o=t[a];o!==e&&(o.parent=e,e.parts.push(o))}if(e.parts.length!==1){if(n=n===void 0||n,n){var s=[];for(a=0;a<t.length;a++)s=s.concat(t[a].vertices);i.clockwiseSort(s);var c=i.hull(s),l=i.centre(c);r.setVertices(e,c),i.translate(e.vertices,l)}var u=r._totalProperties(e);e.area=u.area,e.parent=e,e.position.x=u.centre.x,e.position.y=u.centre.y,e.positionPrev.x=u.centre.x,e.positionPrev.y=u.centre.y,r.setMass(e,u.mass),r.setInertia(e,u.inertia),r.setPosition(e,u.centre)}},r.setCentre=function(e,t,n){n?(e.positionPrev.x+=t.x,e.positionPrev.y+=t.y,e.position.x+=t.x,e.position.y+=t.y):(e.positionPrev.x=t.x-(e.position.x-e.positionPrev.x),e.positionPrev.y=t.y-(e.position.y-e.positionPrev.y),e.position.x=t.x,e.position.y=t.y)},r.setPosition=function(e,t,n){var r=a.sub(t,e.position);n?(e.positionPrev.x=e.position.x,e.positionPrev.y=e.position.y,e.velocity.x=r.x,e.velocity.y=r.y,e.speed=a.magnitude(r)):(e.positionPrev.x+=r.x,e.positionPrev.y+=r.y);for(var o=0;o<e.parts.length;o++){var s=e.parts[o];s.position.x+=r.x,s.position.y+=r.y,i.translate(s.vertices,r),c.update(s.bounds,s.vertices,e.velocity)}},r.setAngle=function(e,t,n){var r=t-e.angle;n?(e.anglePrev=e.angle,e.angularVelocity=r,e.angularSpeed=Math.abs(r)):e.anglePrev+=r;for(var o=0;o<e.parts.length;o++){var s=e.parts[o];s.angle+=r,i.rotate(s.vertices,r,e.position),l.rotate(s.axes,r),c.update(s.bounds,s.vertices,e.velocity),o>0&&a.rotateAbout(s.position,r,e.position,s.position)}},r.setVelocity=function(e,t){var n=e.deltaTime/r._baseDelta;e.positionPrev.x=e.position.x-t.x*n,e.positionPrev.y=e.position.y-t.y*n,e.velocity.x=(e.position.x-e.positionPrev.x)/n,e.velocity.y=(e.position.y-e.positionPrev.y)/n,e.speed=a.magnitude(e.velocity)},r.getVelocity=function(e){var t=r._baseDelta/e.deltaTime;return{x:(e.position.x-e.positionPrev.x)*t,y:(e.position.y-e.positionPrev.y)*t}},r.getSpeed=function(e){return a.magnitude(r.getVelocity(e))},r.setSpeed=function(e,t){r.setVelocity(e,a.mult(a.normalise(r.getVelocity(e)),t))},r.setAngularVelocity=function(e,t){var n=e.deltaTime/r._baseDelta;e.anglePrev=e.angle-t*n,e.angularVelocity=(e.angle-e.anglePrev)/n,e.angularSpeed=Math.abs(e.angularVelocity)},r.getAngularVelocity=function(e){return(e.angle-e.anglePrev)*r._baseDelta/e.deltaTime},r.getAngularSpeed=function(e){return Math.abs(r.getAngularVelocity(e))},r.setAngularSpeed=function(e,t){r.setAngularVelocity(e,s.sign(r.getAngularVelocity(e))*t)},r.translate=function(e,t,n){r.setPosition(e,a.add(e.position,t),n)},r.rotate=function(e,t,n,i){if(!n)r.setAngle(e,e.angle+t,i);else{var a=Math.cos(t),o=Math.sin(t),s=e.position.x-n.x,c=e.position.y-n.y;r.setPosition(e,{x:n.x+(s*a-c*o),y:n.y+(s*o+c*a)},i),r.setAngle(e,e.angle+t,i)}},r.scale=function(e,t,n,a){var o=0,s=0;a||=e.position;for(var u=0;u<e.parts.length;u++){var d=e.parts[u];i.scale(d.vertices,t,n,a),d.axes=l.fromVertices(d.vertices),d.area=i.area(d.vertices),r.setMass(d,e.density*d.area),i.translate(d.vertices,{x:-d.position.x,y:-d.position.y}),r.setInertia(d,r._inertiaScale*i.inertia(d.vertices,d.mass)),i.translate(d.vertices,{x:d.position.x,y:d.position.y}),u>0&&(o+=d.area,s+=d.inertia),d.position.x=a.x+(d.position.x-a.x)*t,d.position.y=a.y+(d.position.y-a.y)*n,c.update(d.bounds,d.vertices,e.velocity)}e.parts.length>1&&(e.area=o,e.isStatic||(r.setMass(e,e.density*o),r.setInertia(e,s))),e.circleRadius&&(t===n?e.circleRadius*=t:e.circleRadius=null)},r.update=function(e,t){t=(t===void 0?1e3/60:t)*e.timeScale;var n=t*t,o=r._timeCorrection?t/(e.deltaTime||t):1,u=1-e.frictionAir*(t/s._baseDelta),d=(e.position.x-e.positionPrev.x)*o,f=(e.position.y-e.positionPrev.y)*o;e.velocity.x=d*u+e.force.x/e.mass*n,e.velocity.y=f*u+e.force.y/e.mass*n,e.positionPrev.x=e.position.x,e.positionPrev.y=e.position.y,e.position.x+=e.velocity.x,e.position.y+=e.velocity.y,e.deltaTime=t,e.angularVelocity=(e.angle-e.anglePrev)*u*o+e.torque/e.inertia*n,e.anglePrev=e.angle,e.angle+=e.angularVelocity;for(var p=0;p<e.parts.length;p++){var m=e.parts[p];i.translate(m.vertices,e.velocity),p>0&&(m.position.x+=e.velocity.x,m.position.y+=e.velocity.y),e.angularVelocity!==0&&(i.rotate(m.vertices,e.angularVelocity,e.position),l.rotate(m.axes,e.angularVelocity),p>0&&a.rotateAbout(m.position,e.angularVelocity,e.position,m.position)),c.update(m.bounds,m.vertices,e.velocity)}},r.updateVelocities=function(e){var t=r._baseDelta/e.deltaTime,n=e.velocity;n.x=(e.position.x-e.positionPrev.x)*t,n.y=(e.position.y-e.positionPrev.y)*t,e.speed=Math.sqrt(n.x*n.x+n.y*n.y),e.angularVelocity=(e.angle-e.anglePrev)*t,e.angularSpeed=Math.abs(e.angularVelocity)},r.applyForce=function(e,t,n){var r={x:t.x-e.position.x,y:t.y-e.position.y};e.force.x+=n.x,e.force.y+=n.y,e.torque+=r.x*n.y-r.y*n.x},r._totalProperties=function(e){for(var t={mass:0,area:0,inertia:0,centre:{x:0,y:0}},n=e.parts.length===1?0:1;n<e.parts.length;n++){var r=e.parts[n],i=r.mass===1/0?1:r.mass;t.mass+=i,t.area+=r.area,t.inertia+=r.inertia,t.centre=a.add(t.centre,a.mult(r.position,i))}return t.centre=a.div(t.centre,t.mass),t}})()}),(function(e,t,n){var r={};e.exports=r;var i=n(0);(function(){r.on=function(e,t,n){for(var r=t.split(` `),i,a=0;a<r.length;a++)i=r[a],e.events=e.events||{},e.events[i]=e.events[i]||[],e.events[i].push(n);return n},r.off=function(e,t,n){if(!t)e.events={};else{typeof t==`function`&&(n=t,t=i.keys(e.events).join(` `));for(var r=t.split(` `),a=0;a<r.length;a++){var o=e.events[r[a]],s=[];if(n&&o)for(var c=0;c<o.length;c++)o[c]!==n&&s.push(o[c]);e.events[r[a]]=s}}},r.trigger=function(e,t,n){var r,a,o,s,c=e.events;if(c&&i.keys(c).length>0){n||={},r=t.split(` `);for(var l=0;l<r.length;l++)if(a=r[l],o=c[a],o){s=i.clone(n,!1),s.name=a,s.source=e;for(var u=0;u<o.length;u++)o[u].apply(e,[s])}}}})()}),(function(e,t,n){var r={};e.exports=r;var i=n(5),a=n(0),o=n(1),s=n(4);(function(){r.create=function(e){return a.extend({id:a.nextId(),type:`composite`,parent:null,isModified:!1,bodies:[],constraints:[],composites:[],label:`Composite`,plugin:{},cache:{allBodies:null,allConstraints:null,allComposites:null}},e)},r.setModified=function(e,t,n,i){if(e.isModified=t,t&&e.cache&&(e.cache.allBodies=null,e.cache.allConstraints=null,e.cache.allComposites=null),n&&e.parent&&r.setModified(e.parent,t,n,i),i)for(var a=0;a<e.composites.length;a++){var o=e.composites[a];r.setModified(o,t,n,i)}},r.add=function(e,t){var n=[].concat(t);i.trigger(e,`beforeAdd`,{object:t});for(var o=0;o<n.length;o++){var s=n[o];switch(s.type){case`body`:if(s.parent!==s){a.warn(`Composite.add: skipped adding a compound body part (you must add its parent instead)`);break}r.addBody(e,s);break;case`constraint`:r.addConstraint(e,s);break;case`composite`:r.addComposite(e,s);break;case`mouseConstraint`:r.addConstraint(e,s.constraint)}}return i.trigger(e,`afterAdd`,{object:t}),e},r.remove=function(e,t,n){var a=[].concat(t);i.trigger(e,`beforeRemove`,{object:t});for(var o=0;o<a.length;o++){var s=a[o];switch(s.type){case`body`:r.removeBody(e,s,n);break;case`constraint`:r.removeConstraint(e,s,n);break;case`composite`:r.removeComposite(e,s,n);break;case`mouseConstraint`:r.removeConstraint(e,s.constraint)}}return i.trigger(e,`afterRemove`,{object:t}),e},r.addComposite=function(e,t){return e.composites.push(t),t.parent=e,r.setModified(e,!0,!0,!1),e},r.removeComposite=function(e,t,n){var i=a.indexOf(e.composites,t);if(i!==-1){var o=r.allBodies(t);r.removeCompositeAt(e,i);for(var s=0;s<o.length;s++)o[s].sleepCounter=0}if(n)for(var s=0;s<e.composites.length;s++)r.removeComposite(e.composites[s],t,!0);return e},r.removeCompositeAt=function(e,t){return e.composites.splice(t,1),r.setModified(e,!0,!0,!1),e},r.addBody=function(e,t){return e.bodies.push(t),r.setModified(e,!0,!0,!1),e},r.removeBody=function(e,t,n){var i=a.indexOf(e.bodies,t);if(i!==-1&&(r.removeBodyAt(e,i),t.sleepCounter=0),n)for(var o=0;o<e.composites.length;o++)r.removeBody(e.composites[o],t,!0);return e},r.removeBodyAt=function(e,t){return e.bodies.splice(t,1),r.setModified(e,!0,!0,!1),e},r.addConstraint=function(e,t){return e.constraints.push(t),r.setModified(e,!0,!0,!1),e},r.removeConstraint=function(e,t,n){var i=a.indexOf(e.constraints,t);if(i!==-1&&r.removeConstraintAt(e,i),n)for(var o=0;o<e.composites.length;o++)r.removeConstraint(e.composites[o],t,!0);return e},r.removeConstraintAt=function(e,t){return e.constraints.splice(t,1),r.setModified(e,!0,!0,!1),e},r.clear=function(e,t,n){if(n)for(var i=0;i<e.composites.length;i++)r.clear(e.composites[i],t,!0);return t?e.bodies=e.bodies.filter(function(e){return e.isStatic}):e.bodies.length=0,e.constraints.length=0,e.composites.length=0,r.setModified(e,!0,!0,!1),e},r.allBodies=function(e){if(e.cache&&e.cache.allBodies)return e.cache.allBodies;for(var t=[].concat(e.bodies),n=0;n<e.composites.length;n++)t=t.concat(r.allBodies(e.composites[n]));return e.cache&&(e.cache.allBodies=t),t},r.allConstraints=function(e){if(e.cache&&e.cache.allConstraints)return e.cache.allConstraints;for(var t=[].concat(e.constraints),n=0;n<e.composites.length;n++)t=t.concat(r.allConstraints(e.composites[n]));return e.cache&&(e.cache.allConstraints=t),t},r.allComposites=function(e){if(e.cache&&e.cache.allComposites)return e.cache.allComposites;for(var t=[].concat(e.composites),n=0;n<e.composites.length;n++)t=t.concat(r.allComposites(e.composites[n]));return e.cache&&(e.cache.allComposites=t),t},r.get=function(e,t,n){var i,a;switch(n){case`body`:i=r.allBodies(e);break;case`constraint`:i=r.allConstraints(e);break;case`composite`:i=r.allComposites(e).concat(e)}return i?(a=i.filter(function(e){return e.id.toString()===t.toString()}),a.length===0?null:a[0]):null},r.move=function(e,t,n){return r.remove(e,t),r.add(n,t),e},r.rebase=function(e){for(var t=r.allBodies(e).concat(r.allConstraints(e)).concat(r.allComposites(e)),n=0;n<t.length;n++)t[n].id=a.nextId();return e},r.translate=function(e,t,n){for(var i=n?r.allBodies(e):e.bodies,a=0;a<i.length;a++)s.translate(i[a],t);return e},r.rotate=function(e,t,n,i){for(var a=Math.cos(t),o=Math.sin(t),c=i?r.allBodies(e):e.bodies,l=0;l<c.length;l++){var u=c[l],d=u.position.x-n.x,f=u.position.y-n.y;s.setPosition(u,{x:n.x+(d*a-f*o),y:n.y+(d*o+f*a)}),s.rotate(u,t)}return e},r.scale=function(e,t,n,i,a){for(var o=a?r.allBodies(e):e.bodies,c=0;c<o.length;c++){var l=o[c],u=l.position.x-i.x,d=l.position.y-i.y;s.setPosition(l,{x:i.x+u*t,y:i.y+d*n}),s.scale(l,t,n)}return e},r.bounds=function(e){for(var t=r.allBodies(e),n=[],i=0;i<t.length;i+=1){var a=t[i];n.push(a.bounds.min,a.bounds.max)}return o.create(n)}})()}),(function(e,t,n){var r={};e.exports=r;var i=n(4),a=n(5),o=n(0);(function(){r._motionWakeThreshold=.18,r._motionSleepThreshold=.08,r._minBias=.9,r.update=function(e,t){for(var n=t/o._baseDelta,a=r._motionSleepThreshold,s=0;s<e.length;s++){var c=e[s],l=i.getSpeed(c),u=i.getAngularSpeed(c),d=l*l+u*u;if(c.force.x!==0||c.force.y!==0)r.set(c,!1);else{var f=Math.min(c.motion,d),p=Math.max(c.motion,d);c.motion=r._minBias*f+(1-r._minBias)*p,c.sleepThreshold>0&&c.motion<a?(c.sleepCounter+=1,c.sleepCounter>=c.sleepThreshold/n&&r.set(c,!0)):c.sleepCounter>0&&--c.sleepCounter}}},r.afterCollisions=function(e){for(var t=r._motionSleepThreshold,n=0;n<e.length;n++){var i=e[n];if(i.isActive){var a=i.collision,o=a.bodyA.parent,s=a.bodyB.parent;if(!(o.isSleeping&&s.isSleeping||o.isStatic||s.isStatic)&&(o.isSleeping||s.isSleeping)){var c=o.isSleeping&&!o.isStatic?o:s,l=c===o?s:o;!c.isStatic&&l.motion>t&&r.set(c,!1)}}}},r.set=function(e,t){var n=e.isSleeping;t?(e.isSleeping=!0,e.sleepCounter=e.sleepThreshold,e.positionImpulse.x=0,e.positionImpulse.y=0,e.positionPrev.x=e.position.x,e.positionPrev.y=e.position.y,e.anglePrev=e.angle,e.speed=0,e.angularSpeed=0,e.motion=0,n||a.trigger(e,`sleepStart`)):(e.isSleeping=!1,e.sleepCounter=0,n&&a.trigger(e,`sleepEnd`))}})()}),(function(e,t,n){var r={};e.exports=r;var i=n(3),a=n(9);(function(){var e=[],t={overlap:0,axis:null},n={overlap:0,axis:null};r.create=function(e,t){return{pair:null,collided:!1,bodyA:e,bodyB:t,parentA:e.parent,parentB:t.parent,depth:0,normal:{x:0,y:0},tangent:{x:0,y:0},penetration:{x:0,y:0},supports:[null,null],supportCount:0}},r.collides=function(e,o,s){if(r._overlapAxes(t,e.vertices,o.vertices,e.axes),t.overlap<=0||(r._overlapAxes(n,o.vertices,e.vertices,o.axes),n.overlap<=0))return null;var c=s&&s.table[a.id(e,o)],l;c?l=c.collision:(l=r.create(e,o),l.collided=!0,l.bodyA=e.id<o.id?e:o,l.bodyB=e.id<o.id?o:e,l.parentA=l.bodyA.parent,l.parentB=l.bodyB.parent),e=l.bodyA,o=l.bodyB;var u=t.overlap<n.overlap?t:n,d=l.normal,f=l.tangent,p=l.penetration,m=l.supports,h=u.overlap,g=u.axis,_=g.x,v=g.y,y=o.position.x-e.position.x,b=o.position.y-e.position.y;_*y+v*b>=0&&(_=-_,v=-v),d.x=_,d.y=v,f.x=-v,f.y=_,p.x=_*h,p.y=v*h,l.depth=h;var x=r._findSupports(e,o,d,1),S=0;if(i.contains(e.vertices,x[0])&&(m[S++]=x[0]),i.contains(e.vertices,x[1])&&(m[S++]=x[1]),S<2){var C=r._findSupports(o,e,d,-1);i.contains(o.vertices,C[0])&&(m[S++]=C[0]),S<2&&i.contains(o.vertices,C[1])&&(m[S++]=C[1])}return S===0&&(m[S++]=x[0]),l.supportCount=S,l},r._overlapAxes=function(e,t,n,r){for(var i=t.length,a=n.length,o=t[0].x,s=t[0].y,c=n[0].x,l=n[0].y,u=r.length,d=Number.MAX_VALUE,f=0,p,m,h,g,_=0,v;_<u;_++){var y=r[_],b=y.x,x=y.y,S=o*b+s*x,C=c*b+l*x,w=S,T=C;for(v=1;v<i;v+=1)g=t[v].x*b+t[v].y*x,g>w?w=g:g<S&&(S=g);for(v=1;v<a;v+=1)g=n[v].x*b+n[v].y*x,g>T?T=g:g<C&&(C=g);if(m=w-C,h=T-S,p=m<h?m:h,p<d&&(d=p,f=_,p<=0))break}e.axis=r[f],e.overlap=d},r._findSupports=function(t,n,r,i){for(var a=n.vertices,o=a.length,s=t.position.x,c=t.position.y,l=r.x*i,u=r.y*i,d=a[0],f=d,p=l*(s-f.x)+u*(c-f.y),m,h,g=1;g<o;g+=1)f=a[g],h=l*(s-f.x)+u*(c-f.y),h<p&&(p=h,d=f);return m=a[(o+d.index-1)%o],p=l*(s-m.x)+u*(c-m.y),f=a[(d.index+1)%o],l*(s-f.x)+u*(c-f.y)<p?(e[0]=d,e[1]=f,e):(e[0]=d,e[1]=m,e)}})()}),(function(e,t,n){var r={};e.exports=r;var i=n(16);(function(){r.create=function(e,t){var n=e.bodyA,a=e.bodyB,o={id:r.id(n,a),bodyA:n,bodyB:a,collision:e,contacts:[i.create(),i.create()],contactCount:0,separation:0,isActive:!0,isSensor:n.isSensor||a.isSensor,timeCreated:t,timeUpdated:t,inverseMass:0,friction:0,frictionStatic:0,restitution:0,slop:0};return r.update(o,e,t),o},r.update=function(e,t,n){var r=t.supports,i=t.supportCount,a=e.contacts,o=t.parentA,s=t.parentB;e.isActive=!0,e.timeUpdated=n,e.collision=t,e.separation=t.depth,e.inverseMass=o.inverseMass+s.inverseMass,e.friction=o.friction<s.friction?o.friction:s.friction,e.frictionStatic=o.frictionStatic>s.frictionStatic?o.frictionStatic:s.frictionStatic,e.restitution=o.restitution>s.restitution?o.restitution:s.restitution,e.slop=o.slop>s.slop?o.slop:s.slop,e.contactCount=i,t.pair=e;var c=r[0],l=a[0],u=r[1],d=a[1];(d.vertex===c||l.vertex===u)&&(a[1]=l,a[0]=l=d,d=a[1]),l.vertex=c,d.vertex=u},r.setActive=function(e,t,n){t?(e.isActive=!0,e.timeUpdated=n):(e.isActive=!1,e.contactCount=0)},r.id=function(e,t){return e.id<t.id?e.id.toString(36)+`:`+t.id.toString(36):t.id.toString(36)+`:`+e.id.toString(36)}})()}),(function(e,t,n){var r={};e.exports=r;var i=n(3),a=n(2),o=n(7),s=n(1),c=n(11),l=n(0);(function(){r._warming=.4,r._torqueDampen=1,r._minLength=1e-6,r.create=function(e){var t=e;t.bodyA&&!t.pointA&&(t.pointA={x:0,y:0}),t.bodyB&&!t.pointB&&(t.pointB={x:0,y:0});var n=t.bodyA?a.add(t.bodyA.position,t.pointA):t.pointA,r=t.bodyB?a.add(t.bodyB.position,t.pointB):t.pointB,i=a.magnitude(a.sub(n,r));t.length=t.length===void 0?i:t.length,t.id=t.id||l.nextId(),t.label=t.label||`Constraint`,t.type=`constraint`,t.stiffness=t.stiffness||(t.length>0?1:.7),t.damping=t.damping||0,t.angularStiffness=t.angularStiffness||0,t.angleA=t.bodyA?t.bodyA.angle:t.angleA,t.angleB=t.bodyB?t.bodyB.angle:t.angleB,t.plugin={};var o={visible:!0,lineWidth:2,strokeStyle:`#ffffff`,type:`line`,anchors:!0};return t.length===0&&t.stiffness>.1?(o.type=`pin`,o.anchors=!1):t.stiffness<.9&&(o.type=`spring`),t.render=l.extend(o,t.render),t},r.preSolveAll=function(e){for(var t=0;t<e.length;t+=1){var n=e[t],r=n.constraintImpulse;n.isStatic||r.x===0&&r.y===0&&r.angle===0||(n.position.x+=r.x,n.position.y+=r.y,n.angle+=r.angle)}},r.solveAll=function(e,t){for(var n=l.clamp(t/l._baseDelta,0,1),i=0;i<e.length;i+=1){var a=e[i],o=!a.bodyA||a.bodyA&&a.bodyA.isStatic,s=!a.bodyB||a.bodyB&&a.bodyB.isStatic;(o||s)&&r.solve(e[i],n)}for(i=0;i<e.length;i+=1)a=e[i],o=!a.bodyA||a.bodyA&&a.bodyA.isStatic,s=!a.bodyB||a.bodyB&&a.bodyB.isStatic,!o&&!s&&r.solve(e[i],n)},r.solve=function(e,t){var n=e.bodyA,i=e.bodyB,o=e.pointA,s=e.pointB;if(n||i){n&&!n.isStatic&&(a.rotate(o,n.angle-e.angleA,o),e.angleA=n.angle),i&&!i.isStatic&&(a.rotate(s,i.angle-e.angleB,s),e.angleB=i.angle);var c=o,l=s;if(n&&(c=a.add(n.position,o)),i&&(l=a.add(i.position,s)),c&&l){var u=a.sub(c,l),d=a.magnitude(u);d<r._minLength&&(d=r._minLength);var f=(d-e.length)/d,p=e.stiffness>=1||e.length===0?e.stiffness*t:e.stiffness*t*t,m=e.damping*t,h=a.mult(u,f*p),g=(n?n.inverseMass:0)+(i?i.inverseMass:0),_=g+((n?n.inverseInertia:0)+(i?i.inverseInertia:0)),v,y,b,x,S;if(m>0){var C=a.create();b=a.div(u,d),S=a.sub(i&&a.sub(i.position,i.positionPrev)||C,n&&a.sub(n.position,n.positionPrev)||C),x=a.dot(b,S)}n&&!n.isStatic&&(y=n.inverseMass/g,n.constraintImpulse.x-=h.x*y,n.constraintImpulse.y-=h.y*y,n.position.x-=h.x*y,n.position.y-=h.y*y,m>0&&(n.positionPrev.x-=m*b.x*x*y,n.positionPrev.y-=m*b.y*x*y),v=a.cross(o,h)/_*r._torqueDampen*n.inverseInertia*(1-e.angularStiffness),n.constraintImpulse.angle-=v,n.angle-=v),i&&!i.isStatic&&(y=i.inverseMass/g,i.constraintImpulse.x+=h.x*y,i.constraintImpulse.y+=h.y*y,i.position.x+=h.x*y,i.position.y+=h.y*y,m>0&&(i.positionPrev.x+=m*b.x*x*y,i.positionPrev.y+=m*b.y*x*y),v=a.cross(s,h)/_*r._torqueDampen*i.inverseInertia*(1-e.angularStiffness),i.constraintImpulse.angle+=v,i.angle+=v)}}},r.postSolveAll=function(e){for(var t=0;t<e.length;t++){var n=e[t],l=n.constraintImpulse;if(!(n.isStatic||l.x===0&&l.y===0&&l.angle===0)){o.set(n,!1);for(var u=0;u<n.parts.length;u++){var d=n.parts[u];i.translate(d.vertices,l),u>0&&(d.position.x+=l.x,d.position.y+=l.y),l.angle!==0&&(i.rotate(d.vertices,l.angle,n.position),c.rotate(d.axes,l.angle),u>0&&a.rotateAbout(d.position,l.angle,n.position,d.position)),s.update(d.bounds,d.vertices,n.velocity)}l.angle*=r._warming,l.x*=r._warming,l.y*=r._warming}}},r.pointAWorld=function(e){return{x:(e.bodyA?e.bodyA.position.x:0)+(e.pointA?e.pointA.x:0),y:(e.bodyA?e.bodyA.position.y:0)+(e.pointA?e.pointA.y:0)}},r.pointBWorld=function(e){return{x:(e.bodyB?e.bodyB.position.x:0)+(e.pointB?e.pointB.x:0),y:(e.bodyB?e.bodyB.position.y:0)+(e.pointB?e.pointB.y:0)}},r.currentLength=function(e){var t=(e.bodyA?e.bodyA.position.x:0)+(e.pointA?e.pointA.x:0),n=(e.bodyA?e.bodyA.position.y:0)+(e.pointA?e.pointA.y:0),r=(e.bodyB?e.bodyB.position.x:0)+(e.pointB?e.pointB.x:0),i=(e.bodyB?e.bodyB.position.y:0)+(e.pointB?e.pointB.y:0),a=t-r,o=n-i;return Math.sqrt(a*a+o*o)}})()}),(function(e,t,n){var r={};e.exports=r;var i=n(2),a=n(0);(function(){r.fromVertices=function(e){for(var t={},n=0;n<e.length;n++){var r=(n+1)%e.length,o=i.normalise({x:e[r].y-e[n].y,y:e[n].x-e[r].x}),s=o.y===0?1/0:o.x/o.y;s=s.toFixed(3).toString(),t[s]=o}return a.values(t)},r.rotate=function(e,t){if(t!==0)for(var n=Math.cos(t),r=Math.sin(t),i=0;i<e.length;i++){var a=e[i],o=a.x*n-a.y*r;a.y=a.x*r+a.y*n,a.x=o}}})()}),(function(e,t,n){var r={};e.exports=r;var i=n(3),a=n(0),o=n(4),s=n(1),c=n(2);(function(){r.rectangle=function(e,t,n,r,s){s||={};var c={label:`Rectangle Body`,position:{x:e,y:t},vertices:i.fromPath(`L 0 0 L `+n+` 0 L `+n+` `+r+` L 0 `+r)};if(s.chamfer){var l=s.chamfer;c.vertices=i.chamfer(c.vertices,l.radius,l.quality,l.qualityMin,l.qualityMax),delete s.chamfer}return o.create(a.extend({},c,s))},r.trapezoid=function(e,t,n,r,s,c){c||={},s>=1&&a.warn(`Bodies.trapezoid: slope parameter must be < 1.`),s*=.5;var l=(1-s*2)*n,u=n*s,d=u+l,f=d+u,p=s<.5?`L 0 0 L `+u+` `+-r+` L `+d+` `+-r+` L `+f+` 0`:`L 0 0 L `+d+` `+-r+` L `+f+` 0`,m={label:`Trapezoid Body`,position:{x:e,y:t},vertices:i.fromPath(p)};if(c.chamfer){var h=c.chamfer;m.vertices=i.chamfer(m.vertices,h.radius,h.quality,h.qualityMin,h.qualityMax),delete c.chamfer}return o.create(a.extend({},m,c))},r.circle=function(e,t,n,i,o){i||={};var s={label:`Circle Body`,circleRadius:n};o||=25;var c=Math.ceil(Math.max(10,Math.min(o,n)));return c%2==1&&(c+=1),r.polygon(e,t,c,n,a.extend({},s,i))},r.polygon=function(e,t,n,s,c){if(c||={},n<3)return r.circle(e,t,s,c);for(var l=2*Math.PI/n,u=``,d=l*.5,f=0;f<n;f+=1){var p=d+f*l,m=Math.cos(p)*s,h=Math.sin(p)*s;u+=`L `+m.toFixed(3)+` `+h.toFixed(3)+` `}var g={label:`Polygon Body`,position:{x:e,y:t},vertices:i.fromPath(u)};if(c.chamfer){var _=c.chamfer;g.vertices=i.chamfer(g.vertices,_.radius,_.quality,_.qualityMin,_.qualityMax),delete c.chamfer}return o.create(a.extend({},g,c))},r.fromVertices=function(e,t,n,r,l,u,d,f){var p=a.getDecomp(),m=!!(p&&p.quickDecomp),h,g,_,v,y,b,x,S,C,w;for(r||={},g=[],l=l!==void 0&&l,u=u===void 0?.01:u,d=d===void 0?10:d,f=f===void 0?.01:f,a.isArray(n[0])||(n=[n]),C=0;C<n.length;C+=1)if(y=n[C],_=i.isConvex(y),v=!_,v&&!m&&a.warnOnce(`Bodies.fromVertices: Install the 'poly-decomp' library and use Common.setDecomp or provide 'decomp' as a global to decompose concave vertices.`),_||!m)y=_?i.clockwiseSort(y):i.hull(y),g.push({position:{x:e,y:t},vertices:y});else{var T=y.map(function(e){return[e.x,e.y]});p.makeCCW(T),u!==!1&&p.removeCollinearPoints(T,u),f!==!1&&p.removeDuplicatePoints&&p.removeDuplicatePoints(T,f);var E=p.quickDecomp(T);for(b=0;b<E.length;b++){var D=E[b].map(function(e){return{x:e[0],y:e[1]}});d>0&&i.area(D)<d||g.push({position:i.centre(D),vertices:D})}}for(b=0;b<g.length;b++)g[b]=o.create(a.extend(g[b],r));if(l){var O=5;for(b=0;b<g.length;b++){var k=g[b];for(x=b+1;x<g.length;x++){var A=g[x];if(s.overlaps(k.bounds,A.bounds)){var j=k.vertices,M=A.vertices;for(S=0;S<k.vertices.length;S++)for(w=0;w<A.vertices.length;w++){var N=c.magnitudeSquared(c.sub(j[(S+1)%j.length],M[w])),P=c.magnitudeSquared(c.sub(j[S],M[(w+1)%M.length]));N<O&&P<O&&(j[S].isInternal=!0,M[w].isInternal=!0)}}}}}return g.length>1?(h=o.create(a.extend({parts:g.slice(0)},r)),o.setPosition(h,{x:e,y:t}),h):g[0]}})()}),(function(e,t,n){var r={};e.exports=r;var i=n(0),a=n(8);(function(){r.create=function(e){return i.extend({bodies:[],collisions:[],pairs:null},e)},r.setBodies=function(e,t){e.bodies=t.slice(0)},r.clear=function(e){e.bodies=[],e.collisions=[]},r.collisions=function(e){var t=e.pairs,n=e.bodies,i=n.length,o=r.canCollide,s=a.collides,c=e.collisions,l=0,u,d;for(n.sort(r._compareBoundsX),u=0;u<i;u++){var f=n[u],p=f.bounds,m=f.bounds.max.x,h=f.bounds.max.y,g=f.bounds.min.y,_=f.isStatic||f.isSleeping,v=f.parts.length,y=v===1;for(d=u+1;d<i;d++){var b=n[d],x=b.bounds;if(x.min.x>m)break;if(!(h<x.min.y||g>x.max.y)&&!(_&&(b.isStatic||b.isSleeping))&&o(f.collisionFilter,b.collisionFilter)){var S=b.parts.length;if(y&&S===1){var C=s(f,b,t);C&&(c[l++]=C)}else for(var w=+(v>1),T=+(S>1),E=w;E<v;E++)for(var D=f.parts[E],p=D.bounds,O=T;O<S;O++){var k=b.parts[O],x=k.bounds;if(!(p.min.x>x.max.x||p.max.x<x.min.x||p.max.y<x.min.y||p.min.y>x.max.y)){var C=s(D,k,t);C&&(c[l++]=C)}}}}}return c.length!==l&&(c.length=l),c},r.canCollide=function(e,t){return e.group===t.group&&e.group!==0?e.group>0:(e.mask&t.category)!==0&&(t.mask&e.category)!==0},r._compareBoundsX=function(e,t){return e.bounds.min.x-t.bounds.min.x}})()}),(function(e,t,n){var r={};e.exports=r;var i=n(0);(function(){r.create=function(e){var t={};return e||i.log(`Mouse.create: element was undefined, defaulting to document.body`,`warn`),t.element=e||document.body,t.absolute={x:0,y:0},t.position={x:0,y:0},t.mousedownPosition={x:0,y:0},t.mouseupPosition={x:0,y:0},t.offset={x:0,y:0},t.scale={x:1,y:1},t.wheelDelta=0,t.button=-1,t.pixelRatio=parseInt(t.element.getAttribute(`data-pixel-ratio`),10)||1,t.sourceEvents={mousemove:null,mousedown:null,mouseup:null,mousewheel:null},t.mousemove=function(e){var n=r._getRelativeMousePosition(e,t.element,t.pixelRatio);e.changedTouches&&(t.button=0,e.preventDefault()),t.absolute.x=n.x,t.absolute.y=n.y,t.position.x=t.absolute.x*t.scale.x+t.offset.x,t.position.y=t.absolute.y*t.scale.y+t.offset.y,t.sourceEvents.mousemove=e},t.mousedown=function(e){var n=r._getRelativeMousePosition(e,t.element,t.pixelRatio);e.changedTouches?(t.button=0,e.preventDefault()):t.button=e.button,t.absolute.x=n.x,t.absolute.y=n.y,t.position.x=t.absolute.x*t.scale.x+t.offset.x,t.position.y=t.absolute.y*t.scale.y+t.offset.y,t.mousedownPosition.x=t.position.x,t.mousedownPosition.y=t.position.y,t.sourceEvents.mousedown=e},t.mouseup=function(e){var n=r._getRelativeMousePosition(e,t.element,t.pixelRatio);e.changedTouches&&e.preventDefault(),t.button=-1,t.absolute.x=n.x,t.absolute.y=n.y,t.position.x=t.absolute.x*t.scale.x+t.offset.x,t.position.y=t.absolute.y*t.scale.y+t.offset.y,t.mouseupPosition.x=t.position.x,t.mouseupPosition.y=t.position.y,t.sourceEvents.mouseup=e},t.mousewheel=function(e){t.wheelDelta=Math.max(-1,Math.min(1,e.wheelDelta||-e.detail)),e.preventDefault(),t.sourceEvents.mousewheel=e},r.setElement(t,t.element),t},r.setElement=function(e,t){e.element=t,t.addEventListener(`mousemove`,e.mousemove,{passive:!0}),t.addEventListener(`mousedown`,e.mousedown,{passive:!0}),t.addEventListener(`mouseup`,e.mouseup,{passive:!0}),t.addEventListener(`wheel`,e.mousewheel,{passive:!1}),t.addEventListener(`touchmove`,e.mousemove,{passive:!1}),t.addEventListener(`touchstart`,e.mousedown,{passive:!1}),t.addEventListener(`touchend`,e.mouseup,{passive:!1})},r.clearSourceEvents=function(e){e.sourceEvents.mousemove=null,e.sourceEvents.mousedown=null,e.sourceEvents.mouseup=null,e.sourceEvents.mousewheel=null,e.wheelDelta=0},r.setOffset=function(e,t){e.offset.x=t.x,e.offset.y=t.y,e.position.x=e.absolute.x*e.scale.x+e.offset.x,e.position.y=e.absolute.y*e.scale.y+e.offset.y},r.setScale=function(e,t){e.scale.x=t.x,e.scale.y=t.y,e.position.x=e.absolute.x*e.scale.x+e.offset.x,e.position.y=e.absolute.y*e.scale.y+e.offset.y},r._getRelativeMousePosition=function(e,t,n){var r=t.getBoundingClientRect(),i=document.documentElement||document.body.parentNode||document.body,a=window.pageXOffset===void 0?i.scrollLeft:window.pageXOffset,o=window.pageYOffset===void 0?i.scrollTop:window.pageYOffset,s=e.changedTouches,c,l;return s?(c=s[0].pageX-r.left-a,l=s[0].pageY-r.top-o):(c=e.pageX-r.left-a,l=e.pageY-r.top-o),{x:c/(t.clientWidth/(t.width||t.clientWidth)*n),y:l/(t.clientHeight/(t.height||t.clientHeight)*n)}}})()}),(function(e,t,n){var r={};e.exports=r;var i=n(0);(function(){r._registry={},r.register=function(e){if(r.isPlugin(e)||i.warn(`Plugin.register:`,r.toString(e),`does not implement all required fields.`),e.name in r._registry){var t=r._registry[e.name],n=r.versionParse(e.version).number,a=r.versionParse(t.version).number;n>a?(i.warn(`Plugin.register:`,r.toString(t),`was upgraded to`,r.toString(e)),r._registry[e.name]=e):n<a?i.warn(`Plugin.register:`,r.toString(t),`can not be downgraded to`,r.toString(e)):e!==t&&i.warn(`Plugin.register:`,r.toString(e),`is already registered to different plugin object`)}else r._registry[e.name]=e;return e},r.resolve=function(e){return r._registry[r.dependencyParse(e).name]},r.toString=function(e){return typeof e==`string`?e:(e.name||`anonymous`)+`@`+(e.version||e.range||`0.0.0`)},r.isPlugin=function(e){return e&&e.name&&e.version&&e.install},r.isUsed=function(e,t){return e.used.indexOf(t)>-1},r.isFor=function(e,t){var n=e.for&&r.dependencyParse(e.for);return!e.for||t.name===n.name&&r.versionSatisfies(t.version,n.range)},r.use=function(e,t){if(e.uses=(e.uses||[]).concat(t||[]),e.uses.length===0)i.warn(`Plugin.use:`,r.toString(e),`does not specify any dependencies to install.`);else{for(var n=r.dependencies(e),a=i.topologicalSort(n),o=[],s=0;s<a.length;s+=1)if(a[s]!==e.name){var c=r.resolve(a[s]);c?r.isUsed(e,c.name)||(r.isFor(c,e)||(i.warn(`Plugin.use:`,r.toString(c),`is for`,c.for,`but installed on`,r.toString(e)+`.`),c._warned=!0),c.install?c.install(e):(i.warn(`Plugin.use:`,r.toString(c),`does not specify an install function.`),c._warned=!0),c._warned?(o.push(`🔶 `+r.toString(c)),delete c._warned):o.push(`✅ `+r.toString(c)),e.used.push(c.name)):o.push(`❌ `+a[s])}o.length>0&&i.info(o.join(`  `))}},r.dependencies=function(e,t){var n=r.dependencyParse(e),a=n.name;if(t||={},!(a in t)){e=r.resolve(e)||e,t[a]=i.map(e.uses||[],function(t){r.isPlugin(t)&&r.register(t);var a=r.dependencyParse(t),o=r.resolve(t);return o&&!r.versionSatisfies(o.version,a.range)?(i.warn(`Plugin.dependencies:`,r.toString(o),`does not satisfy`,r.toString(a),`used by`,r.toString(n)+`.`),o._warned=!0,e._warned=!0):o||(i.warn(`Plugin.dependencies:`,r.toString(t),`used by`,r.toString(n),`could not be resolved.`),e._warned=!0),a.name});for(var o=0;o<t[a].length;o+=1)r.dependencies(t[a][o],t);return t}},r.dependencyParse=function(e){return i.isString(e)?(/^[\w-]+(@(\*|[\^~]?\d+\.\d+\.\d+(-[0-9A-Za-z-+]+)?))?$/.test(e)||i.warn(`Plugin.dependencyParse:`,e,`is not a valid dependency string.`),{name:e.split(`@`)[0],range:e.split(`@`)[1]||`*`}):{name:e.name,range:e.range||e.version}},r.versionParse=function(e){var t=/^(\*)|(\^|~|>=|>)?\s*((\d+)\.(\d+)\.(\d+))(-[0-9A-Za-z-+]+)?$/;t.test(e)||i.warn(`Plugin.versionParse:`,e,`is not a valid version or range.`);var n=t.exec(e),r=Number(n[4]),a=Number(n[5]),o=Number(n[6]);return{isRange:!!(n[1]||n[2]),version:n[3],range:e,operator:n[1]||n[2]||``,major:r,minor:a,patch:o,parts:[r,a,o],prerelease:n[7],number:r*1e8+a*1e4+o}},r.versionSatisfies=function(e,t){t||=`*`;var n=r.versionParse(t),i=r.versionParse(e);if(n.isRange){if(n.operator===`*`||e===`*`)return!0;if(n.operator===`>`)return i.number>n.number;if(n.operator===`>=`)return i.number>=n.number;if(n.operator===`~`)return i.major===n.major&&i.minor===n.minor&&i.patch>=n.patch;if(n.operator===`^`)return n.major>0?i.major===n.major&&i.number>=n.number:n.minor>0?i.minor===n.minor&&i.patch>=n.patch:i.patch===n.patch}return e===t||e===`*`}})()}),(function(e,t){var n={};e.exports=n,(function(){n.create=function(e){return{vertex:e,normalImpulse:0,tangentImpulse:0}}})()}),(function(e,t,n){var r={};e.exports=r;var i=n(7),a=n(18),o=n(13),s=n(19),c=n(5),l=n(6),u=n(10),d=n(0),f=n(4);(function(){r._deltaMax=1e3/60,r.create=function(e){e||={};var t=d.extend({positionIterations:6,velocityIterations:4,constraintIterations:2,enableSleeping:!1,events:[],plugin:{},gravity:{x:0,y:1,scale:.001},timing:{timestamp:0,timeScale:1,lastDelta:0,lastElapsed:0,lastUpdatesPerFrame:0}},e);return t.world=e.world||l.create({label:`World`}),t.pairs=e.pairs||s.create(),t.detector=e.detector||o.create(),t.detector.pairs=t.pairs,t.grid={buckets:[]},t.world.gravity=t.gravity,t.broadphase=t.grid,t.metrics={},t},r.update=function(e,t){var n=d.now(),f=e.world,p=e.detector,m=e.pairs,h=e.timing,g=h.timestamp,_;t>r._deltaMax&&d.warnOnce(`Matter.Engine.update: delta argument is recommended to be less than or equal to`,r._deltaMax.toFixed(3),`ms.`),t=t===void 0?d._baseDelta:t,t*=h.timeScale,h.timestamp+=t,h.lastDelta=t;var v={timestamp:h.timestamp,delta:t};c.trigger(e,`beforeUpdate`,v);var y=l.allBodies(f),b=l.allConstraints(f);for(f.isModified&&(o.setBodies(p,y),l.setModified(f,!1,!1,!0)),e.enableSleeping&&i.update(y,t),r._bodiesApplyGravity(y,e.gravity),t>0&&r._bodiesUpdate(y,t),c.trigger(e,`beforeSolve`,v),u.preSolveAll(y),_=0;_<e.constraintIterations;_++)u.solveAll(b,t);u.postSolveAll(y);var x=o.collisions(p);s.update(m,x,g),e.enableSleeping&&i.afterCollisions(m.list),m.collisionStart.length>0&&c.trigger(e,`collisionStart`,{pairs:m.collisionStart,timestamp:h.timestamp,delta:t});var S=d.clamp(20/e.positionIterations,0,1);for(a.preSolvePosition(m.list),_=0;_<e.positionIterations;_++)a.solvePosition(m.list,t,S);for(a.postSolvePosition(y),u.preSolveAll(y),_=0;_<e.constraintIterations;_++)u.solveAll(b,t);for(u.postSolveAll(y),a.preSolveVelocity(m.list),_=0;_<e.velocityIterations;_++)a.solveVelocity(m.list,t);return r._bodiesUpdateVelocities(y),m.collisionActive.length>0&&c.trigger(e,`collisionActive`,{pairs:m.collisionActive,timestamp:h.timestamp,delta:t}),m.collisionEnd.length>0&&c.trigger(e,`collisionEnd`,{pairs:m.collisionEnd,timestamp:h.timestamp,delta:t}),r._bodiesClearForces(y),c.trigger(e,`afterUpdate`,v),e.timing.lastElapsed=d.now()-n,e},r.merge=function(e,t){if(d.extend(e,t),t.world){e.world=t.world,r.clear(e);for(var n=l.allBodies(e.world),a=0;a<n.length;a++){var o=n[a];i.set(o,!1),o.id=d.nextId()}}},r.clear=function(e){s.clear(e.pairs),o.clear(e.detector)},r._bodiesClearForces=function(e){for(var t=e.length,n=0;n<t;n++){var r=e[n];r.force.x=0,r.force.y=0,r.torque=0}},r._bodiesApplyGravity=function(e,t){var n=t.scale===void 0?.001:t.scale,r=e.length;if(!(t.x===0&&t.y===0||n===0))for(var i=0;i<r;i++){var a=e[i];a.isStatic||a.isSleeping||(a.force.y+=a.mass*t.y*n,a.force.x+=a.mass*t.x*n)}},r._bodiesUpdate=function(e,t){for(var n=e.length,r=0;r<n;r++){var i=e[r];i.isStatic||i.isSleeping||f.update(i,t)}},r._bodiesUpdateVelocities=function(e){for(var t=e.length,n=0;n<t;n++)f.updateVelocities(e[n])}})()}),(function(e,t,n){var r={};e.exports=r;var i=n(3),a=n(0),o=n(1);(function(){r._restingThresh=2,r._restingThreshTangent=Math.sqrt(6),r._positionDampen=.9,r._positionWarming=.8,r._frictionNormalMultiplier=5,r._frictionMaxStatic=Number.MAX_VALUE,r.preSolvePosition=function(e){var t,n,r,i=e.length;for(t=0;t<i;t++)n=e[t],n.isActive&&(r=n.contactCount,n.collision.parentA.totalContacts+=r,n.collision.parentB.totalContacts+=r)},r.solvePosition=function(e,t,n){var i,o,s,c,l,u,d,f,p=r._positionDampen*(n||1),m=a.clamp(t/a._baseDelta,0,1),h=e.length;for(i=0;i<h;i++)o=e[i],o.isActive&&!o.isSensor&&(s=o.collision,c=s.parentA,l=s.parentB,u=s.normal,o.separation=s.depth+u.x*(l.positionImpulse.x-c.positionImpulse.x)+u.y*(l.positionImpulse.y-c.positionImpulse.y));for(i=0;i<h;i++)o=e[i],o.isActive&&!o.isSensor&&(s=o.collision,c=s.parentA,l=s.parentB,u=s.normal,f=o.separation-o.slop*m,(c.isStatic||l.isStatic)&&(f*=2),c.isStatic||c.isSleeping||(d=p/c.totalContacts,c.positionImpulse.x+=u.x*f*d,c.positionImpulse.y+=u.y*f*d),l.isStatic||l.isSleeping||(d=p/l.totalContacts,l.positionImpulse.x-=u.x*f*d,l.positionImpulse.y-=u.y*f*d))},r.postSolvePosition=function(e){for(var t=r._positionWarming,n=e.length,a=i.translate,s=o.update,c=0;c<n;c++){var l=e[c],u=l.positionImpulse,d=u.x,f=u.y,p=l.velocity;if(l.totalContacts=0,d!==0||f!==0){for(var m=0;m<l.parts.length;m++){var h=l.parts[m];a(h.vertices,u),s(h.bounds,h.vertices,p),h.position.x+=d,h.position.y+=f}l.positionPrev.x+=d,l.positionPrev.y+=f,d*p.x+f*p.y<0?(u.x=0,u.y=0):(u.x*=t,u.y*=t)}}},r.preSolveVelocity=function(e){for(var t=e.length,n=0,r;n<t;n++){var i=e[n];if(i.isActive&&!i.isSensor){var a=i.contacts,o=i.contactCount,s=i.collision,c=s.parentA,l=s.parentB,u=s.normal,d=s.tangent;for(r=0;r<o;r++){var f=a[r],p=f.vertex,m=f.normalImpulse,h=f.tangentImpulse;if(m!==0||h!==0){var g=u.x*m+d.x*h,_=u.y*m+d.y*h;c.isStatic||c.isSleeping||(c.positionPrev.x+=g*c.inverseMass,c.positionPrev.y+=_*c.inverseMass,c.anglePrev+=c.inverseInertia*((p.x-c.position.x)*_-(p.y-c.position.y)*g)),l.isStatic||l.isSleeping||(l.positionPrev.x-=g*l.inverseMass,l.positionPrev.y-=_*l.inverseMass,l.anglePrev-=l.inverseInertia*((p.x-l.position.x)*_-(p.y-l.position.y)*g))}}}}},r.solveVelocity=function(e,t){for(var n=t/a._baseDelta,i=n*n*n,o=-r._restingThresh*n,s=r._restingThreshTangent,c=r._frictionNormalMultiplier*n,l=r._frictionMaxStatic,u=e.length,d,f,p=0,m;p<u;p++){var h=e[p];if(h.isActive&&!h.isSensor){var g=h.collision,_=g.parentA,v=g.parentB,y=g.normal.x,b=g.normal.y,x=g.tangent.x,S=g.tangent.y,C=h.inverseMass,w=h.friction*h.frictionStatic*c,T=h.contacts,E=h.contactCount,D=1/E,O=_.position.x-_.positionPrev.x,k=_.position.y-_.positionPrev.y,A=_.angle-_.anglePrev,j=v.position.x-v.positionPrev.x,M=v.position.y-v.positionPrev.y,N=v.angle-v.anglePrev;for(m=0;m<E;m++){var P=T[m],F=P.vertex,I=F.x-_.position.x,ee=F.y-_.position.y,L=F.x-v.position.x,te=F.y-v.position.y,ne=O-ee*A,R=k+I*A,re=j-te*N,z=M+L*N,ie=ne-re,ae=R-z,oe=y*ie+b*ae,B=x*ie+S*ae,se=h.separation+oe,ce=Math.min(se,1);ce=se<0?0:ce;var V=ce*w;B<-V||B>V?(f=B>0?B:-B,d=h.friction*(B>0?1:-1)*i,d<-f?d=-f:d>f&&(d=f)):(d=B,f=l);var le=I*b-ee*y,ue=L*b-te*y,de=D/(C+_.inverseInertia*le*le+v.inverseInertia*ue*ue),fe=(1+h.restitution)*oe*de;if(d*=de,oe<o)P.normalImpulse=0;else{var pe=P.normalImpulse;P.normalImpulse+=fe,P.normalImpulse>0&&(P.normalImpulse=0),fe=P.normalImpulse-pe}if(B<-s||B>s)P.tangentImpulse=0;else{var me=P.tangentImpulse;P.tangentImpulse+=d,P.tangentImpulse<-f&&(P.tangentImpulse=-f),P.tangentImpulse>f&&(P.tangentImpulse=f),d=P.tangentImpulse-me}var he=y*fe+x*d,ge=b*fe+S*d;_.isStatic||_.isSleeping||(_.positionPrev.x+=he*_.inverseMass,_.positionPrev.y+=ge*_.inverseMass,_.anglePrev+=(I*ge-ee*he)*_.inverseInertia),v.isStatic||v.isSleeping||(v.positionPrev.x-=he*v.inverseMass,v.positionPrev.y-=ge*v.inverseMass,v.anglePrev-=(L*ge-te*he)*v.inverseInertia)}}}}})()}),(function(e,t,n){var r={};e.exports=r;var i=n(9),a=n(0);(function(){r.create=function(e){return a.extend({table:{},list:[],collisionStart:[],collisionActive:[],collisionEnd:[]},e)},r.update=function(e,t,n){for(var r=i.update,a=i.create,o=i.setActive,s=e.table,c=e.list,l=c.length,u=l,d=e.collisionStart,f=e.collisionEnd,p=e.collisionActive,m=t.length,h=0,g=0,_=0,v,y,b=0;b<m;b++)v=t[b],y=v.pair,y?(y.isActive&&(p[_++]=y),r(y,v,n)):(y=a(v,n),s[y.id]=y,d[h++]=y,c[u++]=y);for(u=0,l=c.length,b=0;b<l;b++)y=c[b],y.timeUpdated>=n?c[u++]=y:(o(y,!1,n),y.collision.bodyA.sleepCounter>0&&y.collision.bodyB.sleepCounter>0?c[u++]=y:(f[g++]=y,delete s[y.id]));c.length!==u&&(c.length=u),d.length!==h&&(d.length=h),f.length!==g&&(f.length=g),p.length!==_&&(p.length=_)},r.clear=function(e){return e.table={},e.list.length=0,e.collisionStart.length=0,e.collisionActive.length=0,e.collisionEnd.length=0,e}})()}),(function(e,t,n){var r=e.exports=n(21);r.Axes=n(11),r.Bodies=n(12),r.Body=n(4),r.Bounds=n(1),r.Collision=n(8),r.Common=n(0),r.Composite=n(6),r.Composites=n(22),r.Constraint=n(10),r.Contact=n(16),r.Detector=n(13),r.Engine=n(17),r.Events=n(5),r.Grid=n(23),r.Mouse=n(14),r.MouseConstraint=n(24),r.Pair=n(9),r.Pairs=n(19),r.Plugin=n(15),r.Query=n(25),r.Render=n(26),r.Resolver=n(18),r.Runner=n(27),r.SAT=n(28),r.Sleeping=n(7),r.Svg=n(29),r.Vector=n(2),r.Vertices=n(3),r.World=n(30),r.Engine.run=r.Runner.run,r.Common.deprecated(r.Engine,`run`,`Engine.run ➤ use Matter.Runner.run(engine) instead`)}),(function(e,t,n){var r={};e.exports=r;var i=n(15),a=n(0);(function(){r.name=`matter-js`,r.version=`0.20.0`,r.uses=[],r.used=[],r.use=function(){i.use(r,Array.prototype.slice.call(arguments))},r.before=function(e,t){return e=e.replace(/^Matter./,``),a.chainPathBefore(r,e,t)},r.after=function(e,t){return e=e.replace(/^Matter./,``),a.chainPathAfter(r,e,t)}})()}),(function(e,t,n){var r={};e.exports=r;var i=n(6),a=n(10),o=n(0),s=n(4),c=n(12),l=o.deprecated;(function(){r.stack=function(e,t,n,r,a,o,c){for(var l=i.create({label:`Stack`}),u=e,d=t,f,p=0,m=0;m<r;m++){for(var h=0,g=0;g<n;g++){var _=c(u,d,g,m,f,p);if(_){var v=_.bounds.max.y-_.bounds.min.y,y=_.bounds.max.x-_.bounds.min.x;v>h&&(h=v),s.translate(_,{x:y*.5,y:v*.5}),u=_.bounds.max.x+a,i.addBody(l,_),f=_,p+=1}else u+=a}d+=h+o,u=e}return l},r.chain=function(e,t,n,r,s,c){for(var l=e.bodies,u=1;u<l.length;u++){var d=l[u-1],f=l[u],p=d.bounds.max.y-d.bounds.min.y,m=d.bounds.max.x-d.bounds.min.x,h=f.bounds.max.y-f.bounds.min.y,g=f.bounds.max.x-f.bounds.min.x,_={bodyA:d,pointA:{x:m*t,y:p*n},bodyB:f,pointB:{x:g*r,y:h*s}},v=o.extend(_,c);i.addConstraint(e,a.create(v))}return e.label+=` Chain`,e},r.mesh=function(e,t,n,r,s){for(var c=e.bodies,l=0,u,d,f,p;l<n;l++){for(u=1;u<t;u++)d=c[u-1+l*t],f=c[u+l*t],i.addConstraint(e,a.create(o.extend({bodyA:d,bodyB:f},s)));if(l>0)for(u=0;u<t;u++)d=c[u+(l-1)*t],f=c[u+l*t],i.addConstraint(e,a.create(o.extend({bodyA:d,bodyB:f},s))),r&&u>0&&(p=c[u-1+(l-1)*t],i.addConstraint(e,a.create(o.extend({bodyA:p,bodyB:f},s)))),r&&u<t-1&&(p=c[u+1+(l-1)*t],i.addConstraint(e,a.create(o.extend({bodyA:p,bodyB:f},s))))}return e.label+=` Mesh`,e},r.pyramid=function(e,t,n,i,a,o,c){return r.stack(e,t,n,i,a,o,function(t,r,o,l,u,d){var f=Math.min(i,Math.ceil(n/2)),p=u?u.bounds.max.x-u.bounds.min.x:0;if(!(l>f)){l=f-l;var m=l,h=n-1-l;if(!(o<m||o>h))return d===1&&s.translate(u,{x:(o+(n%2==1?1:-1))*p,y:0}),c(e+(u?o*p:0)+o*a,r,o,l,u,d)}})},r.newtonsCradle=function(e,t,n,r,o){for(var s=i.create({label:`Newtons Cradle`}),l=0;l<n;l++){var u=1.9,d=c.circle(e+r*u*l,t+o,r,{inertia:1/0,restitution:1,friction:0,frictionAir:1e-4,slop:1}),f=a.create({pointA:{x:e+r*u*l,y:t},bodyB:d});i.addBody(s,d),i.addConstraint(s,f)}return s},l(r,`newtonsCradle`,`Composites.newtonsCradle ➤ moved to newtonsCradle example`),r.car=function(e,t,n,r,o){var l=s.nextGroup(!0),u=20,d=-n*.5+u,f=n*.5-u,p=0,m=i.create({label:`Car`}),h=c.rectangle(e,t,n,r,{collisionFilter:{group:l},chamfer:{radius:r*.5},density:2e-4}),g=c.circle(e+d,t+p,o,{collisionFilter:{group:l},friction:.8}),_=c.circle(e+f,t+p,o,{collisionFilter:{group:l},friction:.8}),v=a.create({bodyB:h,pointB:{x:d,y:p},bodyA:g,stiffness:1,length:0}),y=a.create({bodyB:h,pointB:{x:f,y:p},bodyA:_,stiffness:1,length:0});return i.addBody(m,h),i.addBody(m,g),i.addBody(m,_),i.addConstraint(m,v),i.addConstraint(m,y),m},l(r,`car`,`Composites.car ➤ moved to car example`),r.softBody=function(e,t,n,i,a,s,l,u,d,f){d=o.extend({inertia:1/0},d),f=o.extend({stiffness:.2,render:{type:`line`,anchors:!1}},f);var p=r.stack(e,t,n,i,a,s,function(e,t){return c.circle(e,t,u,d)});return r.mesh(p,n,i,l,f),p.label=`Soft Body`,p},l(r,`softBody`,`Composites.softBody ➤ moved to softBody and cloth examples`)})()}),(function(e,t,n){var r={};e.exports=r;var i=n(9),a=n(0),o=a.deprecated;(function(){r.create=function(e){return a.extend({buckets:{},pairs:{},pairsList:[],bucketWidth:48,bucketHeight:48},e)},r.update=function(e,t,n,i){var a,o,s,c=n.world,l=e.buckets,u,d,f=!1;for(a=0;a<t.length;a++){var p=t[a];if((!p.isSleeping||i)&&!(c.bounds&&(p.bounds.max.x<c.bounds.min.x||p.bounds.min.x>c.bounds.max.x||p.bounds.max.y<c.bounds.min.y||p.bounds.min.y>c.bounds.max.y))){var m=r._getRegion(e,p);if(!p.region||m.id!==p.region.id||i){(!p.region||i)&&(p.region=m);var h=r._regionUnion(m,p.region);for(o=h.startCol;o<=h.endCol;o++)for(s=h.startRow;s<=h.endRow;s++){d=r._getBucketId(o,s),u=l[d];var g=o>=m.startCol&&o<=m.endCol&&s>=m.startRow&&s<=m.endRow,_=o>=p.region.startCol&&o<=p.region.endCol&&s>=p.region.startRow&&s<=p.region.endRow;!g&&_&&_&&u&&r._bucketRemoveBody(e,u,p),(p.region===m||g&&!_||i)&&(u||=r._createBucket(l,d),r._bucketAddBody(e,u,p))}p.region=m,f=!0}}}f&&(e.pairsList=r._createActivePairsList(e))},o(r,`update`,`Grid.update ➤ replaced by Matter.Detector`),r.clear=function(e){e.buckets={},e.pairs={},e.pairsList=[]},o(r,`clear`,`Grid.clear ➤ replaced by Matter.Detector`),r._regionUnion=function(e,t){var n=Math.min(e.startCol,t.startCol),i=Math.max(e.endCol,t.endCol),a=Math.min(e.startRow,t.startRow),o=Math.max(e.endRow,t.endRow);return r._createRegion(n,i,a,o)},r._getRegion=function(e,t){var n=t.bounds,i=Math.floor(n.min.x/e.bucketWidth),a=Math.floor(n.max.x/e.bucketWidth),o=Math.floor(n.min.y/e.bucketHeight),s=Math.floor(n.max.y/e.bucketHeight);return r._createRegion(i,a,o,s)},r._createRegion=function(e,t,n,r){return{id:e+`,`+t+`,`+n+`,`+r,startCol:e,endCol:t,startRow:n,endRow:r}},r._getBucketId=function(e,t){return`C`+e+`R`+t},r._createBucket=function(e,t){return e[t]=[]},r._bucketAddBody=function(e,t,n){for(var r=e.pairs,a=i.id,o=t.length,s=0;s<o;s++){var c=t[s];if(!(n.id===c.id||n.isStatic&&c.isStatic)){var l=a(n,c),u=r[l];u?u[2]+=1:r[l]=[n,c,1]}}t.push(n)},r._bucketRemoveBody=function(e,t,n){var r=e.pairs,o=i.id,s;t.splice(a.indexOf(t,n),1);var c=t.length;for(s=0;s<c;s++){var l=r[o(n,t[s])];l&&--l[2]}},r._createActivePairsList=function(e){for(var t,n=e.pairs,r=a.keys(n),i=r.length,o=[],s=0;s<i;s++)t=n[r[s]],t[2]>0?o.push(t):delete n[r[s]];return o}})()}),(function(e,t,n){var r={};e.exports=r;var i=n(3),a=n(7),o=n(14),s=n(5),c=n(13),l=n(10),u=n(6),d=n(0),f=n(1);(function(){r.create=function(e,t){var n=(e?e.mouse:null)||(t?t.mouse:null);n||(e&&e.render&&e.render.canvas?n=o.create(e.render.canvas):t&&t.element?n=o.create(t.element):(n=o.create(),d.warn(`MouseConstraint.create: options.mouse was undefined, options.element was undefined, may not function as expected`)));var i=l.create({label:`Mouse Constraint`,pointA:n.position,pointB:{x:0,y:0},length:.01,stiffness:.1,angularStiffness:1,render:{strokeStyle:`#90EE90`,lineWidth:3}}),a={type:`mouseConstraint`,mouse:n,element:null,body:null,constraint:i,collisionFilter:{category:1,mask:4294967295,group:0}},c=d.extend(a,t);return s.on(e,`beforeUpdate`,function(){var t=u.allBodies(e.world);r.update(c,t),r._triggerEvents(c)}),c},r.update=function(e,t){var n=e.mouse,r=e.constraint,o=e.body;if(n.button===0){if(r.bodyB)a.set(r.bodyB,!1),r.pointA=n.position;else for(var l=0;l<t.length;l++)if(o=t[l],f.contains(o.bounds,n.position)&&c.canCollide(o.collisionFilter,e.collisionFilter))for(var u=+(o.parts.length>1);u<o.parts.length;u++){var d=o.parts[u];if(i.contains(d.vertices,n.position)){r.pointA=n.position,r.bodyB=e.body=o,r.pointB={x:n.position.x-o.position.x,y:n.position.y-o.position.y},r.angleB=o.angle,a.set(o,!1),s.trigger(e,`startdrag`,{mouse:n,body:o});break}}}else r.bodyB=e.body=null,r.pointB=null,o&&s.trigger(e,`enddrag`,{mouse:n,body:o})},r._triggerEvents=function(e){var t=e.mouse,n=t.sourceEvents;n.mousemove&&s.trigger(e,`mousemove`,{mouse:t}),n.mousedown&&s.trigger(e,`mousedown`,{mouse:t}),n.mouseup&&s.trigger(e,`mouseup`,{mouse:t}),o.clearSourceEvents(t)}})()}),(function(e,t,n){var r={};e.exports=r;var i=n(2),a=n(8),o=n(1),s=n(12),c=n(3);(function(){r.collides=function(e,t){for(var n=[],r=t.length,i=e.bounds,s=a.collides,c=o.overlaps,l=0;l<r;l++){var u=t[l],d=u.parts.length,f=d===1?0:1;if(c(u.bounds,i))for(var p=f;p<d;p++){var m=u.parts[p];if(c(m.bounds,i)){var h=s(m,e);if(h){n.push(h);break}}}}return n},r.ray=function(e,t,n,a){a||=1e-100;for(var o=i.angle(t,n),c=i.magnitude(i.sub(t,n)),l=(n.x+t.x)*.5,u=(n.y+t.y)*.5,d=s.rectangle(l,u,c,a,{angle:o}),f=r.collides(d,e),p=0;p<f.length;p+=1){var m=f[p];m.body=m.bodyB=m.bodyA}return f},r.region=function(e,t,n){for(var r=[],i=0;i<e.length;i++){var a=e[i],s=o.overlaps(a.bounds,t);(s&&!n||!s&&n)&&r.push(a)}return r},r.point=function(e,t){for(var n=[],r=0;r<e.length;r++){var i=e[r];if(o.contains(i.bounds,t))for(var a=i.parts.length===1?0:1;a<i.parts.length;a++){var s=i.parts[a];if(o.contains(s.bounds,t)&&c.contains(s.vertices,t)){n.push(i);break}}}return n}})()}),(function(e,t,n){var r={};e.exports=r;var i=n(4),a=n(0),o=n(6),s=n(1),c=n(5),l=n(2),u=n(14);(function(){var e,t;typeof window<`u`&&(e=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||function(e){window.setTimeout(function(){e(a.now())},1e3/60)},t=window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame||window.msCancelAnimationFrame),r._goodFps=30,r._goodDelta=1e3/60,r.create=function(e){var t={engine:null,element:null,canvas:null,mouse:null,frameRequestId:null,timing:{historySize:60,delta:0,deltaHistory:[],lastTime:0,lastTimestamp:0,lastElapsed:0,timestampElapsed:0,timestampElapsedHistory:[],engineDeltaHistory:[],engineElapsedHistory:[],engineUpdatesHistory:[],elapsedHistory:[]},options:{width:800,height:600,pixelRatio:1,background:`#14151f`,wireframeBackground:`#14151f`,wireframeStrokeStyle:`#bbb`,hasBounds:!!e.bounds,enabled:!0,wireframes:!0,showSleeping:!0,showDebug:!1,showStats:!1,showPerformance:!1,showBounds:!1,showVelocity:!1,showCollisions:!1,showSeparations:!1,showAxes:!1,showPositions:!1,showAngleIndicator:!1,showIds:!1,showVertexNumbers:!1,showConvexHulls:!1,showInternalEdges:!1,showMousePosition:!1}},n=a.extend(t,e);return n.canvas&&(n.canvas.width=n.options.width||n.canvas.width,n.canvas.height=n.options.height||n.canvas.height),n.mouse=e.mouse,n.engine=e.engine,n.canvas=n.canvas||f(n.options.width,n.options.height),n.context=n.canvas.getContext(`2d`),n.textures={},n.bounds=n.bounds||{min:{x:0,y:0},max:{x:n.canvas.width,y:n.canvas.height}},n.controller=r,n.options.showBroadphase=!1,n.options.pixelRatio!==1&&r.setPixelRatio(n,n.options.pixelRatio),a.isElement(n.element)&&n.element.appendChild(n.canvas),n},r.run=function(t){(function i(a){t.frameRequestId=e(i),n(t,a),r.world(t,a),t.context.setTransform(t.options.pixelRatio,0,0,t.options.pixelRatio,0,0),(t.options.showStats||t.options.showDebug)&&r.stats(t,t.context,a),(t.options.showPerformance||t.options.showDebug)&&r.performance(t,t.context,a),t.context.setTransform(1,0,0,1,0,0)})()},r.stop=function(e){t(e.frameRequestId)},r.setPixelRatio=function(e,t){var n=e.options,r=e.canvas;t===`auto`&&(t=p(r)),n.pixelRatio=t,r.setAttribute(`data-pixel-ratio`,t),r.width=n.width*t,r.height=n.height*t,r.style.width=n.width+`px`,r.style.height=n.height+`px`},r.setSize=function(e,t,n){e.options.width=t,e.options.height=n,e.bounds.max.x=e.bounds.min.x+t,e.bounds.max.y=e.bounds.min.y+n,e.options.pixelRatio===1?(e.canvas.width=t,e.canvas.height=n):r.setPixelRatio(e,e.options.pixelRatio)},r.lookAt=function(e,t,n,r){r=r===void 0||r,t=a.isArray(t)?t:[t],n||={x:0,y:0};for(var i={min:{x:1/0,y:1/0},max:{x:-1/0,y:-1/0}},o=0;o<t.length;o+=1){var s=t[o],c=s.bounds?s.bounds.min:s.min||s.position||s,l=s.bounds?s.bounds.max:s.max||s.position||s;c&&l&&(c.x<i.min.x&&(i.min.x=c.x),l.x>i.max.x&&(i.max.x=l.x),c.y<i.min.y&&(i.min.y=c.y),l.y>i.max.y&&(i.max.y=l.y))}var d=i.max.x-i.min.x+2*n.x,f=i.max.y-i.min.y+2*n.y,p=e.canvas.height,m=e.canvas.width/p,h=d/f,g=1,_=1;h>m?_=h/m:g=m/h,e.options.hasBounds=!0,e.bounds.min.x=i.min.x,e.bounds.max.x=i.min.x+d*g,e.bounds.min.y=i.min.y,e.bounds.max.y=i.min.y+f*_,r&&(e.bounds.min.x+=d*.5-d*g*.5,e.bounds.max.x+=d*.5-d*g*.5,e.bounds.min.y+=f*.5-f*_*.5,e.bounds.max.y+=f*.5-f*_*.5),e.bounds.min.x-=n.x,e.bounds.max.x-=n.x,e.bounds.min.y-=n.y,e.bounds.max.y-=n.y,e.mouse&&(u.setScale(e.mouse,{x:(e.bounds.max.x-e.bounds.min.x)/e.canvas.width,y:(e.bounds.max.y-e.bounds.min.y)/e.canvas.height}),u.setOffset(e.mouse,e.bounds.min))},r.startViewTransform=function(e){var t=e.bounds.max.x-e.bounds.min.x,n=e.bounds.max.y-e.bounds.min.y,r=t/e.options.width,i=n/e.options.height;e.context.setTransform(e.options.pixelRatio/r,0,0,e.options.pixelRatio/i,0,0),e.context.translate(-e.bounds.min.x,-e.bounds.min.y)},r.endViewTransform=function(e){e.context.setTransform(e.options.pixelRatio,0,0,e.options.pixelRatio,0,0)},r.world=function(e,t){var n=a.now(),i=e.engine,d=i.world,f=e.canvas,p=e.context,m=e.options,g=e.timing,_=o.allBodies(d),v=o.allConstraints(d),y=m.wireframes?m.wireframeBackground:m.background,b=[],x=[],S,C={timestamp:i.timing.timestamp};if(c.trigger(e,`beforeRender`,C),e.currentBackground!==y&&h(e,y),p.globalCompositeOperation=`source-in`,p.fillStyle=`transparent`,p.fillRect(0,0,f.width,f.height),p.globalCompositeOperation=`source-over`,m.hasBounds){for(S=0;S<_.length;S++){var w=_[S];s.overlaps(w.bounds,e.bounds)&&b.push(w)}for(S=0;S<v.length;S++){var T=v[S],E=T.bodyA,D=T.bodyB,O=T.pointA,k=T.pointB;E&&(O=l.add(E.position,T.pointA)),D&&(k=l.add(D.position,T.pointB)),O&&k&&(s.contains(e.bounds,O)||s.contains(e.bounds,k))&&x.push(T)}r.startViewTransform(e),e.mouse&&(u.setScale(e.mouse,{x:(e.bounds.max.x-e.bounds.min.x)/e.options.width,y:(e.bounds.max.y-e.bounds.min.y)/e.options.height}),u.setOffset(e.mouse,e.bounds.min))}else x=v,b=_,e.options.pixelRatio!==1&&e.context.setTransform(e.options.pixelRatio,0,0,e.options.pixelRatio,0,0);!m.wireframes||i.enableSleeping&&m.showSleeping?r.bodies(e,b,p):(m.showConvexHulls&&r.bodyConvexHulls(e,b,p),r.bodyWireframes(e,b,p)),m.showBounds&&r.bodyBounds(e,b,p),(m.showAxes||m.showAngleIndicator)&&r.bodyAxes(e,b,p),m.showPositions&&r.bodyPositions(e,b,p),m.showVelocity&&r.bodyVelocity(e,b,p),m.showIds&&r.bodyIds(e,b,p),m.showSeparations&&r.separations(e,i.pairs.list,p),m.showCollisions&&r.collisions(e,i.pairs.list,p),m.showVertexNumbers&&r.vertexNumbers(e,b,p),m.showMousePosition&&r.mousePosition(e,e.mouse,p),r.constraints(x,p),m.hasBounds&&r.endViewTransform(e),c.trigger(e,`afterRender`,C),g.lastElapsed=a.now()-n},r.stats=function(e,t,n){for(var r=e.engine,i=r.world,a=o.allBodies(i),s=0,c=55,l=44,u=0,d=0,f=0;f<a.length;f+=1)s+=a[f].parts.length;var p={Part:s,Body:a.length,Cons:o.allConstraints(i).length,Comp:o.allComposites(i).length,Pair:r.pairs.list.length};for(var m in t.fillStyle=`#0e0f19`,t.fillRect(u,d,c*5.5,l),t.font=`12px Arial`,t.textBaseline=`top`,t.textAlign=`right`,p){var h=p[m];t.fillStyle=`#aaa`,t.fillText(m,u+c,d+8),t.fillStyle=`#eee`,t.fillText(h,u+c,d+26),u+=c}},r.performance=function(e,t){var n=e.engine,i=e.timing,o=i.deltaHistory,s=i.elapsedHistory,c=i.timestampElapsedHistory,l=i.engineDeltaHistory,u=i.engineUpdatesHistory,f=i.engineElapsedHistory,p=n.timing.lastUpdatesPerFrame,m=n.timing.lastDelta,h=d(o),g=d(s),_=d(l),v=d(u),y=d(f),b=d(c)/h||0,x=Math.round(h/m),S=1e3/h||0,C=4,w=12,T=60,E=34,D=10,O=69;t.fillStyle=`#0e0f19`,t.fillRect(0,50,w*5+T*6+22,E),r.status(t,D,O,T,C,o.length,Math.round(S)+` fps`,S/r._goodFps,function(e){return o[e]/h-1}),r.status(t,D+w+T,O,T,C,l.length,m.toFixed(2)+` dt`,r._goodDelta/m,function(e){return l[e]/_-1}),r.status(t,D+(w+T)*2,O,T,C,u.length,p+` upf`,a.clamp(v/x||1,0,1)**4,function(e){return u[e]/v-1}),r.status(t,D+(w+T)*3,O,T,C,f.length,y.toFixed(2)+` ut`,1-p*y/r._goodFps,function(e){return f[e]/y-1}),r.status(t,D+(w+T)*4,O,T,C,s.length,g.toFixed(2)+` rt`,1-g/r._goodFps,function(e){return s[e]/g-1}),r.status(t,D+(w+T)*5,O,T,C,c.length,b.toFixed(2)+` x`,b*b*b,function(e){return(c[e]/o[e]/b||0)-1})},r.status=function(e,t,n,r,i,o,s,c,l){e.strokeStyle=`#888`,e.fillStyle=`#444`,e.lineWidth=1,e.fillRect(t,n+7,r,1),e.beginPath(),e.moveTo(t,n+7-i*a.clamp(.4*l(0),-2,2));for(var u=0;u<r;u+=1)e.lineTo(t+u,n+7-(u<o?i*a.clamp(.4*l(u),-2,2):0));e.stroke(),e.fillStyle=`hsl(`+a.clamp(25+95*c,0,120)+`,100%,60%)`,e.fillRect(t,n-7,4,4),e.font=`12px Arial`,e.textBaseline=`middle`,e.textAlign=`right`,e.fillStyle=`#eee`,e.fillText(s,t+r,n-5)},r.constraints=function(e,t){for(var n=t,r=0;r<e.length;r++){var i=e[r];if(i.render.visible&&i.pointA&&i.pointB){var o=i.bodyA,s=i.bodyB,c=o?l.add(o.position,i.pointA):i.pointA,u;if(i.render.type===`pin`)n.beginPath(),n.arc(c.x,c.y,3,0,2*Math.PI),n.closePath();else{if(u=s?l.add(s.position,i.pointB):i.pointB,n.beginPath(),n.moveTo(c.x,c.y),i.render.type===`spring`)for(var d=l.sub(u,c),f=l.perp(l.normalise(d)),p=Math.ceil(a.clamp(i.length/5,12,20)),m,h=1;h<p;h+=1)m=h%2==0?1:-1,n.lineTo(c.x+d.x*(h/p)+f.x*m*4,c.y+d.y*(h/p)+f.y*m*4);n.lineTo(u.x,u.y)}i.render.lineWidth&&(n.lineWidth=i.render.lineWidth,n.strokeStyle=i.render.strokeStyle,n.stroke()),i.render.anchors&&(n.fillStyle=i.render.strokeStyle,n.beginPath(),n.arc(c.x,c.y,3,0,2*Math.PI),n.arc(u.x,u.y,3,0,2*Math.PI),n.closePath(),n.fill())}}},r.bodies=function(e,t,n){var r=n;e.engine;for(var i=e.options,a=i.showInternalEdges||!i.wireframes,o,s,c=0,l;c<t.length;c++)if(o=t[c],o.render.visible){for(l=+(o.parts.length>1);l<o.parts.length;l++)if(s=o.parts[l],s.render.visible){if(i.showSleeping&&o.isSleeping?r.globalAlpha=.5*s.render.opacity:s.render.opacity!==1&&(r.globalAlpha=s.render.opacity),s.render.sprite&&s.render.sprite.texture&&!i.wireframes){var u=s.render.sprite,d=m(e,u.texture);r.translate(s.position.x,s.position.y),r.rotate(s.angle),r.drawImage(d,d.width*-u.xOffset*u.xScale,d.height*-u.yOffset*u.yScale,d.width*u.xScale,d.height*u.yScale),r.rotate(-s.angle),r.translate(-s.position.x,-s.position.y)}else{if(s.circleRadius)r.beginPath(),r.arc(s.position.x,s.position.y,s.circleRadius,0,2*Math.PI);else{r.beginPath(),r.moveTo(s.vertices[0].x,s.vertices[0].y);for(var f=1;f<s.vertices.length;f++)!s.vertices[f-1].isInternal||a?r.lineTo(s.vertices[f].x,s.vertices[f].y):r.moveTo(s.vertices[f].x,s.vertices[f].y),s.vertices[f].isInternal&&!a&&r.moveTo(s.vertices[(f+1)%s.vertices.length].x,s.vertices[(f+1)%s.vertices.length].y);r.lineTo(s.vertices[0].x,s.vertices[0].y),r.closePath()}i.wireframes?(r.lineWidth=1,r.strokeStyle=e.options.wireframeStrokeStyle,r.stroke()):(r.fillStyle=s.render.fillStyle,s.render.lineWidth&&(r.lineWidth=s.render.lineWidth,r.strokeStyle=s.render.strokeStyle,r.stroke()),r.fill())}r.globalAlpha=1}}},r.bodyWireframes=function(e,t,n){var r=n,i=e.options.showInternalEdges,a,o,s,c,l;for(r.beginPath(),s=0;s<t.length;s++)if(a=t[s],a.render.visible)for(l=+(a.parts.length>1);l<a.parts.length;l++){for(o=a.parts[l],r.moveTo(o.vertices[0].x,o.vertices[0].y),c=1;c<o.vertices.length;c++)!o.vertices[c-1].isInternal||i?r.lineTo(o.vertices[c].x,o.vertices[c].y):r.moveTo(o.vertices[c].x,o.vertices[c].y),o.vertices[c].isInternal&&!i&&r.moveTo(o.vertices[(c+1)%o.vertices.length].x,o.vertices[(c+1)%o.vertices.length].y);r.lineTo(o.vertices[0].x,o.vertices[0].y)}r.lineWidth=1,r.strokeStyle=e.options.wireframeStrokeStyle,r.stroke()},r.bodyConvexHulls=function(e,t,n){var r=n,i,a,o;for(r.beginPath(),a=0;a<t.length;a++)if(i=t[a],i.render.visible&&i.parts.length!==1){for(r.moveTo(i.vertices[0].x,i.vertices[0].y),o=1;o<i.vertices.length;o++)r.lineTo(i.vertices[o].x,i.vertices[o].y);r.lineTo(i.vertices[0].x,i.vertices[0].y)}r.lineWidth=1,r.strokeStyle=`rgba(255,255,255,0.2)`,r.stroke()},r.vertexNumbers=function(e,t,n){for(var r=n,i=0,a,o;i<t.length;i++){var s=t[i].parts;for(o=+(s.length>1);o<s.length;o++){var c=s[o];for(a=0;a<c.vertices.length;a++)r.fillStyle=`rgba(255,255,255,0.2)`,r.fillText(i+`_`+a,c.position.x+(c.vertices[a].x-c.position.x)*.8,c.position.y+(c.vertices[a].y-c.position.y)*.8)}}},r.mousePosition=function(e,t,n){var r=n;r.fillStyle=`rgba(255,255,255,0.8)`,r.fillText(t.position.x+`  `+t.position.y,t.position.x+5,t.position.y-5)},r.bodyBounds=function(e,t,n){var r=n;e.engine;var i=e.options;r.beginPath();for(var a=0;a<t.length;a++)if(t[a].render.visible)for(var o=t[a].parts,s=+(o.length>1);s<o.length;s++){var c=o[s];r.rect(c.bounds.min.x,c.bounds.min.y,c.bounds.max.x-c.bounds.min.x,c.bounds.max.y-c.bounds.min.y)}r.strokeStyle=i.wireframes?`rgba(255,255,255,0.08)`:`rgba(0,0,0,0.1)`,r.lineWidth=1,r.stroke()},r.bodyAxes=function(e,t,n){var r=n;e.engine;var i=e.options,a,o,s,c;for(r.beginPath(),o=0;o<t.length;o++){var l=t[o],u=l.parts;if(l.render.visible){if(i.showAxes)for(s=+(u.length>1);s<u.length;s++)for(a=u[s],c=0;c<a.axes.length;c++){var d=a.axes[c];r.moveTo(a.position.x,a.position.y),r.lineTo(a.position.x+d.x*20,a.position.y+d.y*20)}else for(s=+(u.length>1);s<u.length;s++)for(a=u[s],c=0;c<a.axes.length;c++)r.moveTo(a.position.x,a.position.y),r.lineTo((a.vertices[0].x+a.vertices[a.vertices.length-1].x)/2,(a.vertices[0].y+a.vertices[a.vertices.length-1].y)/2)}}i.wireframes?(r.strokeStyle=`indianred`,r.lineWidth=1):(r.strokeStyle=`rgba(255, 255, 255, 0.4)`,r.globalCompositeOperation=`overlay`,r.lineWidth=2),r.stroke(),r.globalCompositeOperation=`source-over`},r.bodyPositions=function(e,t,n){var r=n;e.engine;var i=e.options,a,o,s,c;for(r.beginPath(),s=0;s<t.length;s++)if(a=t[s],a.render.visible)for(c=0;c<a.parts.length;c++)o=a.parts[c],r.arc(o.position.x,o.position.y,3,0,2*Math.PI,!1),r.closePath();for(r.fillStyle=i.wireframes?`indianred`:`rgba(0,0,0,0.5)`,r.fill(),r.beginPath(),s=0;s<t.length;s++)a=t[s],a.render.visible&&(r.arc(a.positionPrev.x,a.positionPrev.y,2,0,2*Math.PI,!1),r.closePath());r.fillStyle=`rgba(255,165,0,0.8)`,r.fill()},r.bodyVelocity=function(e,t,n){var r=n;r.beginPath();for(var a=0;a<t.length;a++){var o=t[a];if(o.render.visible){var s=i.getVelocity(o);r.moveTo(o.position.x,o.position.y),r.lineTo(o.position.x+s.x,o.position.y+s.y)}}r.lineWidth=3,r.strokeStyle=`cornflowerblue`,r.stroke()},r.bodyIds=function(e,t,n){for(var r=n,i=0,a;i<t.length;i++)if(t[i].render.visible){var o=t[i].parts;for(a=+(o.length>1);a<o.length;a++){var s=o[a];r.font=`12px Arial`,r.fillStyle=`rgba(255,255,255,0.5)`,r.fillText(s.id,s.position.x+10,s.position.y-10)}}},r.collisions=function(e,t,n){var r=n,i=e.options,a,o,s,c;for(r.beginPath(),s=0;s<t.length;s++)if(a=t[s],a.isActive)for(o=a.collision,c=0;c<a.contactCount;c++){var l=a.contacts[c].vertex;r.rect(l.x-1.5,l.y-1.5,3.5,3.5)}for(r.fillStyle=i.wireframes?`rgba(255,255,255,0.7)`:`orange`,r.fill(),r.beginPath(),s=0;s<t.length;s++)if(a=t[s],a.isActive&&(o=a.collision,a.contactCount>0)){var u=a.contacts[0].vertex.x,d=a.contacts[0].vertex.y;a.contactCount===2&&(u=(a.contacts[0].vertex.x+a.contacts[1].vertex.x)/2,d=(a.contacts[0].vertex.y+a.contacts[1].vertex.y)/2),o.bodyB===o.supports[0].body||o.bodyA.isStatic===!0?r.moveTo(u-o.normal.x*8,d-o.normal.y*8):r.moveTo(u+o.normal.x*8,d+o.normal.y*8),r.lineTo(u,d)}r.strokeStyle=i.wireframes?`rgba(255,165,0,0.7)`:`orange`,r.lineWidth=1,r.stroke()},r.separations=function(e,t,n){var r=n,i=e.options,a,o,s,c,l;for(r.beginPath(),l=0;l<t.length;l++)if(a=t[l],a.isActive){o=a.collision,s=o.bodyA,c=o.bodyB;var u=1;!c.isStatic&&!s.isStatic&&(u=.5),c.isStatic&&(u=0),r.moveTo(c.position.x,c.position.y),r.lineTo(c.position.x-o.penetration.x*u,c.position.y-o.penetration.y*u),u=1,!c.isStatic&&!s.isStatic&&(u=.5),s.isStatic&&(u=0),r.moveTo(s.position.x,s.position.y),r.lineTo(s.position.x+o.penetration.x*u,s.position.y+o.penetration.y*u)}r.strokeStyle=i.wireframes?`rgba(255,165,0,0.5)`:`orange`,r.stroke()},r.inspector=function(e,t){e.engine;var n=e.selected,r=e.render,i=r.options,a;if(i.hasBounds){var o=r.bounds.max.x-r.bounds.min.x,s=r.bounds.max.y-r.bounds.min.y,c=o/r.options.width,l=s/r.options.height;t.scale(1/c,1/l),t.translate(-r.bounds.min.x,-r.bounds.min.y)}for(var u=0;u<n.length;u++){var d=n[u].data;switch(t.translate(.5,.5),t.lineWidth=1,t.strokeStyle=`rgba(255,165,0,0.9)`,t.setLineDash([1,2]),d.type){case`body`:a=d.bounds,t.beginPath(),t.rect(Math.floor(a.min.x-3),Math.floor(a.min.y-3),Math.floor(a.max.x-a.min.x+6),Math.floor(a.max.y-a.min.y+6)),t.closePath(),t.stroke();break;case`constraint`:var f=d.pointA;d.bodyA&&(f=d.pointB),t.beginPath(),t.arc(f.x,f.y,10,0,2*Math.PI),t.closePath(),t.stroke()}t.setLineDash([]),t.translate(-.5,-.5)}e.selectStart!==null&&(t.translate(.5,.5),t.lineWidth=1,t.strokeStyle=`rgba(255,165,0,0.6)`,t.fillStyle=`rgba(255,165,0,0.1)`,a=e.selectBounds,t.beginPath(),t.rect(Math.floor(a.min.x),Math.floor(a.min.y),Math.floor(a.max.x-a.min.x),Math.floor(a.max.y-a.min.y)),t.closePath(),t.stroke(),t.fill(),t.translate(-.5,-.5)),i.hasBounds&&t.setTransform(1,0,0,1,0,0)};var n=function(e,t){var n=e.engine,i=e.timing,a=i.historySize,o=n.timing.timestamp;i.delta=t-i.lastTime||r._goodDelta,i.lastTime=t,i.timestampElapsed=o-i.lastTimestamp||0,i.lastTimestamp=o,i.deltaHistory.unshift(i.delta),i.deltaHistory.length=Math.min(i.deltaHistory.length,a),i.engineDeltaHistory.unshift(n.timing.lastDelta),i.engineDeltaHistory.length=Math.min(i.engineDeltaHistory.length,a),i.timestampElapsedHistory.unshift(i.timestampElapsed),i.timestampElapsedHistory.length=Math.min(i.timestampElapsedHistory.length,a),i.engineUpdatesHistory.unshift(n.timing.lastUpdatesPerFrame),i.engineUpdatesHistory.length=Math.min(i.engineUpdatesHistory.length,a),i.engineElapsedHistory.unshift(n.timing.lastElapsed),i.engineElapsedHistory.length=Math.min(i.engineElapsedHistory.length,a),i.elapsedHistory.unshift(i.lastElapsed),i.elapsedHistory.length=Math.min(i.elapsedHistory.length,a)},d=function(e){for(var t=0,n=0;n<e.length;n+=1)t+=e[n];return t/e.length||0},f=function(e,t){var n=document.createElement(`canvas`);return n.width=e,n.height=t,n.oncontextmenu=function(){return!1},n.onselectstart=function(){return!1},n},p=function(e){var t=e.getContext(`2d`);return(window.devicePixelRatio||1)/(t.webkitBackingStorePixelRatio||t.mozBackingStorePixelRatio||t.msBackingStorePixelRatio||t.oBackingStorePixelRatio||t.backingStorePixelRatio||1)},m=function(e,t){var n=e.textures[t];return n||(n=e.textures[t]=new Image,n.src=t,n)},h=function(e,t){var n=t;/(jpg|gif|png)$/.test(t)&&(n=`url(`+t+`)`),e.canvas.style.background=n,e.canvas.style.backgroundSize=`contain`,e.currentBackground=t}})()}),(function(e,t,n){var r={};e.exports=r;var i=n(5),a=n(17),o=n(0);(function(){r._maxFrameDelta=1e3/15,r._frameDeltaFallback=1e3/60,r._timeBufferMargin=1.5,r._elapsedNextEstimate=1,r._smoothingLowerBound=.1,r._smoothingUpperBound=.9,r.create=function(e){var t=o.extend({delta:1e3/60,frameDelta:null,frameDeltaSmoothing:!0,frameDeltaSnapping:!0,frameDeltaHistory:[],frameDeltaHistorySize:100,frameRequestId:null,timeBuffer:0,timeLastTick:null,maxUpdates:null,maxFrameTime:1e3/30,lastUpdatesDeferred:0,enabled:!0},e);return t.fps=0,t},r.run=function(e,t){return e.timeBuffer=r._frameDeltaFallback,(function n(i){e.frameRequestId=r._onNextFrame(e,n),i&&e.enabled&&r.tick(e,t,i)})(),e},r.tick=function(t,n,s){var c=o.now(),l=t.delta,u=0,d=s-t.timeLastTick;if((!d||!t.timeLastTick||d>Math.max(r._maxFrameDelta,t.maxFrameTime))&&(d=t.frameDelta||r._frameDeltaFallback),t.frameDeltaSmoothing){t.frameDeltaHistory.push(d),t.frameDeltaHistory=t.frameDeltaHistory.slice(-t.frameDeltaHistorySize);var f=t.frameDeltaHistory.slice(0).sort();d=e(t.frameDeltaHistory.slice(f.length*r._smoothingLowerBound,f.length*r._smoothingUpperBound))||d}t.frameDeltaSnapping&&(d=1e3/Math.round(1e3/d)),t.frameDelta=d,t.timeLastTick=s,t.timeBuffer+=t.frameDelta,t.timeBuffer=o.clamp(t.timeBuffer,0,t.frameDelta+l*r._timeBufferMargin),t.lastUpdatesDeferred=0;var p=t.maxUpdates||Math.ceil(t.maxFrameTime/l),m={timestamp:n.timing.timestamp};i.trigger(t,`beforeTick`,m),i.trigger(t,`tick`,m);for(var h=o.now();l>0&&t.timeBuffer>=l*r._timeBufferMargin;){i.trigger(t,`beforeUpdate`,m),a.update(n,l),i.trigger(t,`afterUpdate`,m),t.timeBuffer-=l,u+=1;var g=o.now()-c,_=o.now()-h,v=g+r._elapsedNextEstimate*_/u;if(u>=p||v>t.maxFrameTime){t.lastUpdatesDeferred=Math.round(Math.max(0,t.timeBuffer/l-r._timeBufferMargin));break}}n.timing.lastUpdatesPerFrame=u,i.trigger(t,`afterTick`,m),t.frameDeltaHistory.length>=100&&(t.lastUpdatesDeferred&&Math.round(t.frameDelta/l)>p?o.warnOnce(`Matter.Runner: runner reached runner.maxUpdates, see docs.`):t.lastUpdatesDeferred&&o.warnOnce(`Matter.Runner: runner reached runner.maxFrameTime, see docs.`),t.isFixed!==void 0&&o.warnOnce(`Matter.Runner: runner.isFixed is now redundant, see docs.`),(t.deltaMin||t.deltaMax)&&o.warnOnce(`Matter.Runner: runner.deltaMin and runner.deltaMax were removed, see docs.`),t.fps!==0&&o.warnOnce(`Matter.Runner: runner.fps was replaced by runner.delta, see docs.`))},r.stop=function(e){r._cancelNextFrame(e)},r._onNextFrame=function(e,t){if(typeof window<`u`&&window.requestAnimationFrame)e.frameRequestId=window.requestAnimationFrame(t);else throw Error(`Matter.Runner: missing required global window.requestAnimationFrame.`);return e.frameRequestId},r._cancelNextFrame=function(e){if(typeof window<`u`&&window.cancelAnimationFrame)window.cancelAnimationFrame(e.frameRequestId);else throw Error(`Matter.Runner: missing required global window.cancelAnimationFrame.`)};var e=function(e){for(var t=0,n=e.length,r=0;r<n;r+=1)t+=e[r];return t/n||0}})()}),(function(e,t,n){var r={};e.exports=r;var i=n(8),a=n(0).deprecated;(function(){r.collides=function(e,t){return i.collides(e,t)},a(r,`collides`,`SAT.collides ➤ replaced by Collision.collides`)})()}),(function(e,t,n){var r={};e.exports=r,n(1);var i=n(0);(function(){r.pathToVertices=function(e,t){typeof window<`u`&&!(`SVGPathSeg`in window)&&i.warn(`Svg.pathToVertices: SVGPathSeg not defined, a polyfill is required.`);var n,a,o,s,c,l,u,d,f,p,m=[],h,g,_=0,v=0,y=0;t||=15;var b=function(e,t,n){var r=n%2==1&&n>1;if(!f||e!=f.x||t!=f.y){f&&r?(h=f.x,g=f.y):(h=0,g=0);var i={x:h+e,y:g+t};(r||!f)&&(f=i),m.push(i),v=h+e,y=g+t}},x=function(e){var t=e.pathSegTypeAsLetter.toUpperCase();if(t!==`Z`){switch(t){case`M`:case`L`:case`T`:case`C`:case`S`:case`Q`:v=e.x,y=e.y;break;case`H`:v=e.x;break;case`V`:y=e.y}b(v,y,e.pathSegType)}};for(r._svgPathToAbsolute(e),o=e.getTotalLength(),l=[],n=0;n<e.pathSegList.numberOfItems;n+=1)l.push(e.pathSegList.getItem(n));for(u=l.concat();_<o;){if(p=e.getPathSegAtLength(_),c=l[p],c!=d){for(;u.length&&u[0]!=c;)x(u.shift());d=c}switch(c.pathSegTypeAsLetter.toUpperCase()){case`C`:case`T`:case`S`:case`Q`:case`A`:s=e.getPointAtLength(_),b(s.x,s.y,0)}_+=t}for(n=0,a=u.length;n<a;++n)x(u[n]);return m},r._svgPathToAbsolute=function(e){for(var t,n,r,i,a,o,s=e.pathSegList,c=0,l=0,u=s.numberOfItems,d=0;d<u;++d){var f=s.getItem(d),p=f.pathSegTypeAsLetter;if(/[MLHVCSQTA]/.test(p))`x`in f&&(c=f.x),`y`in f&&(l=f.y);else switch(`x1`in f&&(r=c+f.x1),`x2`in f&&(a=c+f.x2),`y1`in f&&(i=l+f.y1),`y2`in f&&(o=l+f.y2),`x`in f&&(c+=f.x),`y`in f&&(l+=f.y),p){case`m`:s.replaceItem(e.createSVGPathSegMovetoAbs(c,l),d);break;case`l`:s.replaceItem(e.createSVGPathSegLinetoAbs(c,l),d);break;case`h`:s.replaceItem(e.createSVGPathSegLinetoHorizontalAbs(c),d);break;case`v`:s.replaceItem(e.createSVGPathSegLinetoVerticalAbs(l),d);break;case`c`:s.replaceItem(e.createSVGPathSegCurvetoCubicAbs(c,l,r,i,a,o),d);break;case`s`:s.replaceItem(e.createSVGPathSegCurvetoCubicSmoothAbs(c,l,a,o),d);break;case`q`:s.replaceItem(e.createSVGPathSegCurvetoQuadraticAbs(c,l,r,i),d);break;case`t`:s.replaceItem(e.createSVGPathSegCurvetoQuadraticSmoothAbs(c,l),d);break;case`a`:s.replaceItem(e.createSVGPathSegArcAbs(c,l,f.r1,f.r2,f.angle,f.largeArcFlag,f.sweepFlag),d);break;case`z`:case`Z`:c=t,l=n}(p==`M`||p==`m`)&&(t=c,n=l)}}})()}),(function(e,t,n){var r={};e.exports=r;var i=n(6);n(0),(function(){r.create=i.create,r.add=i.add,r.remove=i.remove,r.clear=i.clear,r.addComposite=i.addComposite,r.addBody=i.addBody,r.addConstraint=i.addConstraint})()})])})}))(),1),fc={name:`Shreyash`,surname:`Mishra`,role:`Full stack developer & AI engineer`,location:`India`,timezone:`Asia/Kolkata`,email:`hello@shreyashmishra.in`,status:`Open to freelance work and new roles`,manifesto:`I build robust web applications and intelligent systems, blending bleeding-edge technology with bold, unapologetic design.`,about:[`I’m a creative developer who works across the whole stack, from training and wiring up models to designing the interface people actually touch.`,`When I’m not writing code or automating workflows, I’m exploring new AI architectures or refining my design systems.`],work:[{slug:`bloom-chat`,title:`Bloom Chat`,tags:[`Next.js`,`TypeScript`,`Claude API`,`SQLite`],desc:`A self-hosted workbench for Claude: seven modes over one thread model, five models side by side, and an encrypted store that seals every row before it touches disk.`,url:`https://chat.artbloom.tech/`,cta:`Visit live site`},{slug:`artbloom`,title:`ArtBloom`,tags:[`AI`,`Image generation`],desc:`An AI image generation platform that turns a sentence into finished artwork.`,url:`https://www.artbloom.tech/`,cta:`Visit live site`},{slug:`autogpt`,title:`AutoGPT`,tags:[`Open source`,`Core contributor`],desc:`Shipped “Most Recently Ran” sorting in the Library of the AutoGPT platform, released in beta v0.6.70.`,url:`https://github.com/Significant-Gravitas/AutoGPT/releases/tag/autogpt-platform-beta-v0.6.70`,cta:`See the release`},{slug:`n8n`,title:`n8n Templates`,tags:[`n8n`,`Workflow automation`],desc:`A curated library of ready-to-run n8n workflows for complex business logic.`,url:`https://github.com/Iitian001/N8N_tamplets`,cta:`View on GitHub`},{slug:`shreyash-code`,title:`Shreyash Code`,tags:[`Python`,`Automation`],desc:`Python scripts for data processing, automation and backend systems.`,url:`https://github.com/Iitian001/Shreyash_code-`,cta:`View on GitHub`}],skills:[[`React`,`Next.js`,`TypeScript`,`Node.js`,`Tailwind CSS`,`UI / UX Design`,`JavaScript`],[`PyTorch`,`TensorFlow`,`scikit-learn`,`pandas`,`NumPy`,`Deep Learning`,`Machine Learning`],[`Generative AI`,`LLM APIs`,`RAG Pipelines`,`AI Agents`,`Prompt Engineering`,`Workflow Automation`,`Data Engineering`]],certificates:[{title:`Data Analytics Foundations`,by:`DeepLearning.AI`},{title:`Fast Prototyping of GenAI Apps`,by:`DeepLearning.AI`},{title:`AI Engineer for Data Scientists`,by:`DataCamp`},{title:`Data Engineer`,by:`DataCamp`},{title:`Machine Learning`,by:`Coursera`}],links:[{label:`GitHub`,url:`https://github.com/Iitian001`},{label:`LinkedIn`,url:`https://www.linkedin.com/in/shreyashautomation`},{label:`Email`,url:`mailto:hello@shreyashmishra.in`}]},pc=1e3,mc=1001,hc=1002,gc=1003,_c=1004,vc=1005,yc=1006,bc=1007,xc=1008,Sc=1009,Cc=1010,wc=1011,Tc=1012,Ec=1013,Dc=1014,Oc=1015,kc=1016,Ac=1017,jc=1018,Mc=1020,Nc=35902,Pc=35899,Fc=1021,Ic=1022,Lc=1023,Rc=1026,zc=1027,Bc=1028,Vc=1029,Hc=1030,Uc=1031,Wc=1033,Gc=33776,Kc=33777,qc=33778,Jc=33779,Yc=35840,Xc=35841,Zc=35842,Qc=35843,$c=36196,el=37492,tl=37496,nl=37488,rl=37489,il=37490,al=37491,ol=37808,sl=37809,cl=37810,ll=37811,ul=37812,dl=37813,fl=37814,pl=37815,ml=37816,hl=37817,gl=37818,_l=37819,vl=37820,yl=37821,bl=36492,xl=36494,Sl=36495,Cl=36283,wl=36284,Tl=36285,El=36286,Dl=2300,Ol=2301,kl=2302,Al=2303,jl=2400,Ml=2401,Nl=2402,Pl=3200,Fl=`srgb`,Il=`srgb-linear`,Ll=`linear`,Rl=`srgb`,zl=7680,Bl=35044,Vl=2e3;function Hl(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function Ul(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function Wl(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function Gl(){let e=Wl(`canvas`);return e.style.display=`block`,e}var Kl={};function ql(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function Jl(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function Z(...e){e=Jl(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function Yl(...e){e=Jl(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function Xl(...e){let t=e.join(` `);t in Kl||(Kl[t]=!0,Z(...e))}function Zl(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var Ql={0:0,2:6,4:4,3:5,1:1,6:2,7:7,5:3},$l=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},eu=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),tu=Math.PI/180,nu=180/Math.PI;function ru(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(eu[e&255]+eu[e>>8&255]+eu[e>>16&255]+eu[e>>24&255]+`-`+eu[t&255]+eu[t>>8&255]+`-`+eu[t>>16&15|64]+eu[t>>24&255]+`-`+eu[n&63|128]+eu[n>>8&255]+`-`+eu[n>>16&255]+eu[n>>24&255]+eu[r&255]+eu[r>>8&255]+eu[r>>16&255]+eu[r>>24&255]).toLowerCase()}function iu(e,t,n){return Math.max(t,Math.min(n,e))}function au(e,t){return(e%t+t)%t}function ou(e,t,n){return(1-n)*e+n*t}function su(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function cu(e){switch(e.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function lu(e,t){if(t.constructor===Float32Array)return e;let n=cu(t);if(n===void 0)throw Error(`THREE.MathUtils: Invalid component type.`);return Math.max(e/n,-1)}function uu(e,t){if(t.constructor===Float32Array)return e;let n=cu(t);if(n===void 0)throw Error(`THREE.MathUtils: Invalid component type.`);return Math.round(e*n)}var du=class{static{this.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=iu(this.x,e.x,t.x),this.y=iu(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=iu(this.x,e,t),this.y=iu(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(iu(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(iu(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},fu=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:Z(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(iu(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Q=class{static{this.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(mu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(mu.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=iu(this.x,e.x,t.x),this.y=iu(this.y,e.y,t.y),this.z=iu(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=iu(this.x,e,t),this.y=iu(this.y,e,t),this.z=iu(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(iu(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return pu.copy(this).projectOnVector(e),this.sub(pu)}reflect(e){return this.sub(pu.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(iu(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},pu=new Q,mu=new fu,hu=class{static{this.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return Xl(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(gu.makeScale(e,t)),this}rotate(e){return Xl(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(gu.makeRotation(-e)),this}translate(e,t){return Xl(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(gu.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},gu=new hu,_u=new hu().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),vu=new hu().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function yu(){let e={enabled:!0,workingColorSpace:Il,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=xu(e.r),e.g=xu(e.g),e.b=xu(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=Su(e.r),e.g=Su(e.g),e.b=Su(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?Ll:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[n].fromXYZ).multiply(this.spaces[t].toXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[Il]:{primaries:t,whitePoint:r,transfer:Ll,toXYZ:_u,fromXYZ:vu,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Fl},outputColorSpaceConfig:{drawingBufferColorSpace:Fl}},[Fl]:{primaries:t,whitePoint:r,transfer:Rl,toXYZ:_u,fromXYZ:vu,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Fl}}}),e}var bu=yu();function xu(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Su(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var Cu,wu=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Cu===void 0&&(Cu=Wl(`canvas`)),Cu.width=e.width,Cu.height=e.height;let t=Cu.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=Cu}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=Wl(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=xu(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(xu(t[e]/255)*255):t[e]=xu(t[e]);return{data:t,width:e.width,height:e.height}}return Z(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},Tu=0,Eu=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Tu++}),this.uuid=ru(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width||0,t.height||0,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(Du(r[t].image)):e.push(Du(r[t]))}else e=Du(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function Du(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?wu.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(Z(`Texture: Unable to serialize Texture.`),{})}var Ou=0,ku=new Q,Au=class e extends $l{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=mc,i=mc,a=yc,o=xc,s=Lc,c=Sc,l=e.DEFAULT_ANISOTROPY,u=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ou++}),this.uuid=ru(),this.name=``,this.source=new Eu(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new du(0,0),this.repeat=new du(1,1),this.center=new du(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new hu,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(ku).x}get height(){return this.source.getSize(ku).y}get depth(){return this.source.getSize(ku).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Z(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?Z(`Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case pc:e.x-=Math.floor(e.x);break;case mc:e.x=e.x<0?0:1;break;case hc:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case pc:e.y-=Math.floor(e.y);break;case mc:e.y=e.y<0?0:1;break;case hc:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Au.DEFAULT_IMAGE=null,Au.DEFAULT_MAPPING=300,Au.DEFAULT_ANISOTROPY=1;var ju=class{static{this.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=iu(this.x,e.x,t.x),this.y=iu(this.y,e.y,t.y),this.z=iu(this.z,e.z,t.z),this.w=iu(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=iu(this.x,e,t),this.y=iu(this.y,e,t),this.z=iu(this.z,e,t),this.w=iu(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(iu(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Mu=class extends $l{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:yc,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new ju(0,0,e,t),this.scissorTest=!1,this.viewport=new ju(0,0,e,t),this.textures=[];let r=n.count;for(let i=0;i<r;i++)this.textures[i]=new Au({width:e,height:t,depth:n.depth}),this.textures[i].isRenderTargetTexture=!0,this.textures[i].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:yc,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new Eu(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},Nu=class extends Mu{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Pu=class extends Au{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=gc,this.minFilter=gc,this.wrapR=mc,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Fu=class extends Au{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=gc,this.minFilter=gc,this.wrapR=mc,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},Iu=class e{static{this.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/Lu.setFromMatrixColumn(e,0).length(),i=1/Lu.setFromMatrixColumn(e,1).length(),a=1/Lu.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(zu,e,Bu)}lookAt(e,t,n){let r=this.elements;return Uu.subVectors(e,t),Uu.lengthSq()===0&&(Uu.z=1),Uu.normalize(),Vu.crossVectors(n,Uu),Vu.lengthSq()===0&&(Math.abs(n.z)===1?Uu.x+=1e-4:Uu.z+=1e-4,Uu.normalize(),Vu.crossVectors(n,Uu)),Vu.normalize(),Hu.crossVectors(Uu,Vu),r[0]=Vu.x,r[4]=Hu.x,r[8]=Uu.x,r[1]=Vu.y,r[5]=Hu.y,r[9]=Uu.y,r[2]=Vu.z,r[6]=Hu.z,r[10]=Uu.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],j=r[10],M=r[14],N=r[3],P=r[7],F=r[11],I=r[15];return i[0]=a*x+o*T+s*k+c*N,i[4]=a*S+o*E+s*A+c*P,i[8]=a*C+o*D+s*j+c*F,i[12]=a*w+o*O+s*M+c*I,i[1]=l*x+u*T+d*k+f*N,i[5]=l*S+u*E+d*A+f*P,i[9]=l*C+u*D+d*j+f*F,i[13]=l*w+u*O+d*M+f*I,i[2]=p*x+m*T+h*k+g*N,i[6]=p*S+m*E+h*A+g*P,i[10]=p*C+m*D+h*j+g*F,i[14]=p*w+m*O+h*M+g*I,i[3]=_*x+v*T+y*k+b*N,i[7]=_*S+v*E+y*A+b*P,i[11]=_*C+v*D+y*j+b*F,i[15]=_*w+v*O+y*M+b*I,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=Lu.set(r[0],r[1],r[2]).length(),o=Lu.set(r[4],r[5],r[6]).length(),s=Lu.set(r[8],r[9],r[10]).length();i<0&&(a=-a),Ru.copy(this);let c=1/a,l=1/o,u=1/s;return Ru.elements[0]*=c,Ru.elements[1]*=c,Ru.elements[2]*=c,Ru.elements[4]*=l,Ru.elements[5]*=l,Ru.elements[6]*=l,Ru.elements[8]*=u,Ru.elements[9]*=u,Ru.elements[10]*=u,t.setFromRotationMatrix(Ru),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=Vl,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=Vl,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Lu=new Q,Ru=new Iu,zu=new Q(0,0,0),Bu=new Q(1,1,1),Vu=new Q,Hu=new Q,Uu=new Q,Wu=new Iu,Gu=new fu,Ku=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(iu(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-iu(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(iu(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-iu(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(iu(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-iu(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:Z(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Wu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Wu,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Gu.setFromEuler(this),this.setFromQuaternion(Gu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Ku.DEFAULT_ORDER=`XYZ`;var qu=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},Ju=0,Yu=new Q,Xu=new fu,Zu=new Iu,Qu=new Q,$u=new Q,ed=new Q,td=new fu,nd=new Q(1,0,0),rd=new Q(0,1,0),id=new Q(0,0,1),ad={type:`added`},od={type:`removed`},sd={type:`childadded`,child:null},cd={type:`childremoved`,child:null},ld=class e extends $l{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ju++}),this.uuid=ru(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new Q,n=new Ku,r=new fu,i=new Q(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Iu},normalMatrix:{value:new hu}}),this.matrix=new Iu,this.matrixWorld=new Iu,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new qu,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Xu.setFromAxisAngle(e,t),this.quaternion.multiply(Xu),this}rotateOnWorldAxis(e,t){return Xu.setFromAxisAngle(e,t),this.quaternion.premultiply(Xu),this}rotateX(e){return this.rotateOnAxis(nd,e)}rotateY(e){return this.rotateOnAxis(rd,e)}rotateZ(e){return this.rotateOnAxis(id,e)}translateOnAxis(e,t){return Yu.copy(e).applyQuaternion(this.quaternion),this.position.add(Yu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(nd,e)}translateY(e){return this.translateOnAxis(rd,e)}translateZ(e){return this.translateOnAxis(id,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Zu.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Qu.copy(e):Qu.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),$u.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Zu.lookAt($u,Qu,this.up):Zu.lookAt(Qu,$u,this.up),this.quaternion.setFromRotationMatrix(Zu),r&&(Zu.extractRotation(r.matrixWorld),Xu.setFromRotationMatrix(Zu),this.quaternion.premultiply(Xu.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(Yl(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(ad),sd.child=e,this.dispatchEvent(sd),sd.child=null):Yl(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(od),cd.child=e,this.dispatchEvent(cd),cd.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Zu.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Zu.multiply(e.parent.matrixWorld)),e.applyMatrix4(Zu),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(ad),sd.child=e,this.dispatchEvent(sd),sd.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose($u,e,ed),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose($u,td,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};ld.DEFAULT_UP=new Q(0,1,0),ld.DEFAULT_MATRIX_AUTO_UPDATE=!0,ld.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var ud=class extends ld{constructor(){super(),this.isGroup=!0,this.type=`Group`}},dd={type:`move`},fd=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ud,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ud,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Q,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Q),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ud,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Q,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Q,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.quaternion,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.quaternion,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(dd)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new ud;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},pd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},md={h:0,s:0,l:0},hd={h:0,s:0,l:0};function gd(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var _d=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Fl){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,bu.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=bu.workingColorSpace){return this.r=e,this.g=t,this.b=n,bu.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=bu.workingColorSpace){if(e=au(e,1),t=iu(t,0,1),n=iu(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=gd(i,r,e+1/3),this.g=gd(i,r,e),this.b=gd(i,r,e-1/3)}return bu.colorSpaceToWorking(this,r),this}setStyle(e,t=Fl){function n(t){t!==void 0&&parseFloat(t)<1&&Z(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseFloat(i[1]))/100,Math.min(100,parseFloat(i[2]))/100,Math.min(100,parseFloat(i[3]))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:Z(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);Z(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Fl){let n=pd[e.toLowerCase()];return n===void 0?Z(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=xu(e.r),this.g=xu(e.g),this.b=xu(e.b),this}copyLinearToSRGB(e){return this.r=Su(e.r),this.g=Su(e.g),this.b=Su(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Fl){return bu.workingToColorSpace(vd.copy(this),e),Math.round(iu(vd.r*255,0,255))*65536+Math.round(iu(vd.g*255,0,255))*256+Math.round(iu(vd.b*255,0,255))}getHexString(e=Fl){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=bu.workingColorSpace){bu.workingToColorSpace(vd.copy(this),t);let n=vd.r,r=vd.g,i=vd.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=bu.workingColorSpace){return bu.workingToColorSpace(vd.copy(this),t),e.r=vd.r,e.g=vd.g,e.b=vd.b,e}getStyle(e=Fl){bu.workingToColorSpace(vd.copy(this),e);let t=vd.r,n=vd.g,r=vd.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(md),this.setHSL(md.h+e,md.s+t,md.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(md),e.getHSL(hd);let n=ou(md.h,hd.h,t),r=ou(md.s,hd.s,t),i=ou(md.l,hd.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},vd=new _d;_d.NAMES=pd;var yd=class extends ld{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ku,this.environmentIntensity=1,this.environmentRotation=new Ku,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background===null?null:e.background.clone(),this.environment=e.environment===null?null:e.environment.clone(),this.fog=e.fog===null?null:e.fog.clone(),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial===null?null:e.overrideMaterial.clone(),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},bd=new Q,xd=new Q,Sd=new Q,Cd=new Q,wd=new Q,Td=new Q,Ed=new Q,Dd=new Q,Od=new Q,kd=new Q,Ad=new ju,jd=new ju,Md=new ju,Nd=class e{constructor(e=new Q,t=new Q,n=new Q){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),bd.subVectors(e,t),r.cross(bd);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){bd.subVectors(r,t),xd.subVectors(n,t),Sd.subVectors(e,t);let a=bd.dot(bd),o=bd.dot(xd),s=bd.dot(Sd),c=xd.dot(xd),l=xd.dot(Sd),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Cd)!==null&&Cd.x>=0&&Cd.y>=0&&Cd.x+Cd.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,Cd)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,Cd.x),s.addScaledVector(a,Cd.y),s.addScaledVector(o,Cd.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return Ad.setScalar(0),jd.setScalar(0),Md.setScalar(0),Ad.fromBufferAttribute(e,t),jd.fromBufferAttribute(e,n),Md.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Ad,i.x),a.addScaledVector(jd,i.y),a.addScaledVector(Md,i.z),a}static isFrontFacing(e,t,n,r){return bd.subVectors(n,t),xd.subVectors(e,t),bd.cross(xd).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return bd.subVectors(this.c,this.b),xd.subVectors(this.a,this.b),bd.cross(xd).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;wd.subVectors(r,n),Td.subVectors(i,n),Dd.subVectors(e,n);let s=wd.dot(Dd),c=Td.dot(Dd);if(s<=0&&c<=0)return t.copy(n);Od.subVectors(e,r);let l=wd.dot(Od),u=Td.dot(Od);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0&&s-l>0)return a=s/(s-l),t.copy(n).addScaledVector(wd,a);kd.subVectors(e,i);let f=wd.dot(kd),p=Td.dot(kd);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(Td,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return Ed.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(Ed,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(wd,a).addScaledVector(Td,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Pd=class{constructor(e=new Q(1/0,1/0,1/0),t=new Q(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Id.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Id.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Id.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,Id):Id.fromBufferAttribute(r,t),Id.applyMatrix4(e.matrixWorld),this.expandByPoint(Id);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),Ld.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),Ld.copy(e.boundingBox)),Ld.applyMatrix4(e.matrixWorld),this.union(Ld)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Id),Id.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Wd),Gd.subVectors(this.max,Wd),Rd.subVectors(e.a,Wd),zd.subVectors(e.b,Wd),Bd.subVectors(e.c,Wd),Vd.subVectors(zd,Rd),Hd.subVectors(Bd,zd),Ud.subVectors(Rd,Bd);let t=[0,-Vd.z,Vd.y,0,-Hd.z,Hd.y,0,-Ud.z,Ud.y,Vd.z,0,-Vd.x,Hd.z,0,-Hd.x,Ud.z,0,-Ud.x,-Vd.y,Vd.x,0,-Hd.y,Hd.x,0,-Ud.y,Ud.x,0];return!Jd(t,Rd,zd,Bd,Gd)||(t=[1,0,0,0,1,0,0,0,1],!Jd(t,Rd,zd,Bd,Gd))?!1:(Kd.crossVectors(Vd,Hd),t=[Kd.x,Kd.y,Kd.z],Jd(t,Rd,zd,Bd,Gd))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Id).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Id).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(Fd[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Fd[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Fd[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Fd[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Fd[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Fd[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Fd[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Fd[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Fd)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Fd=[new Q,new Q,new Q,new Q,new Q,new Q,new Q,new Q],Id=new Q,Ld=new Pd,Rd=new Q,zd=new Q,Bd=new Q,Vd=new Q,Hd=new Q,Ud=new Q,Wd=new Q,Gd=new Q,Kd=new Q,qd=new Q;function Jd(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){qd.fromArray(e,a);let o=i.x*Math.abs(qd.x)+i.y*Math.abs(qd.y)+i.z*Math.abs(qd.z),s=t.dot(qd),c=n.dot(qd),l=r.dot(qd);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var Yd=new Q,Xd=new du,Zd=0,Qd=class extends $l{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Zd++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=Bl,this.updateRanges=[],this.gpuType=Oc,this.version=0,this._normalizationScale=e===void 0?void 0:cu(e)}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Xd.fromBufferAttribute(this,t),Xd.applyMatrix3(e),this.setXY(t,Xd.x,Xd.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Yd.fromBufferAttribute(this,t),Yd.applyMatrix3(e),this.setXYZ(t,Yd.x,Yd.y,Yd.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Yd.fromBufferAttribute(this,t),Yd.applyMatrix4(e),this.setXYZ(t,Yd.x,Yd.y,Yd.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Yd.fromBufferAttribute(this,t),Yd.applyNormalMatrix(e),this.setXYZ(t,Yd.x,Yd.y,Yd.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Yd.fromBufferAttribute(this,t),Yd.transformDirection(e),this.setXYZ(t,Yd.x,Yd.y,Yd.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),r=this._normalize(r),i=this._normalize(i)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}_denormalize(e){let t=this._normalizationScale;return t===void 0?lu(e,this.array):Math.max(e/t,-1)}_normalize(e){let t=this._normalizationScale;return t===void 0?uu(e,this.array):Math.round(e*t)}},$d=class extends Qd{constructor(e,t,n){super(new Uint16Array(e),t,n)}},ef=class extends Qd{constructor(e,t,n){super(new Uint32Array(e),t,n)}},tf=class extends Qd{constructor(e,t,n){super(new Float32Array(e),t,n)}},nf=new Pd,rf=new Q,af=new Q,of=class{constructor(e=new Q,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?nf.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;rf.subVectors(e,this.center);let t=rf.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(rf,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(af.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(rf.copy(e.center).add(af)),this.expandByPoint(rf.copy(e.center).sub(af))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},sf=0,cf=new Iu,lf=new ld,uf=new Q,df=new Pd,ff=new Pd,pf=new Q,mf=class e extends $l{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:sf++}),this.uuid=ru(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(Hl(e)?ef:$d)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new hu().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return cf.makeRotationFromQuaternion(e),this.applyMatrix4(cf),this}rotateX(e){return cf.makeRotationX(e),this.applyMatrix4(cf),this}rotateY(e){return cf.makeRotationY(e),this.applyMatrix4(cf),this}rotateZ(e){return cf.makeRotationZ(e),this.applyMatrix4(cf),this}translate(e,t,n){return cf.makeTranslation(e,t,n),this.applyMatrix4(cf),this}scale(e,t,n){return cf.makeScale(e,t,n),this.applyMatrix4(cf),this}lookAt(e){return lf.lookAt(e),lf.updateMatrix(),this.applyMatrix4(lf.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(uf).negate(),this.translate(uf.x,uf.y,uf.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new tf(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&Z(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Pd);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)Yl(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new Q(-1/0,-1/0,-1/0),new Q(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];df.setFromBufferAttribute(n),this.morphTargetsRelative?(pf.addVectors(this.boundingBox.min,df.min),this.boundingBox.expandByPoint(pf),pf.addVectors(this.boundingBox.max,df.max),this.boundingBox.expandByPoint(pf)):(this.boundingBox.expandByPoint(df.min),this.boundingBox.expandByPoint(df.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Yl(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new of);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)Yl(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new Q,1/0);else if(e){let n=this.boundingSphere.center;if(df.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];ff.setFromBufferAttribute(n),this.morphTargetsRelative?(pf.addVectors(df.min,ff.min),df.expandByPoint(pf),pf.addVectors(df.max,ff.max),df.expandByPoint(pf)):(df.expandByPoint(ff.min),df.expandByPoint(ff.max))}df.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)pf.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(pf));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)pf.fromBufferAttribute(a,t),o&&(uf.fromBufferAttribute(e,t),pf.add(uf)),r=Math.max(r,n.distanceToSquared(pf))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&Yl(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Yl(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new Qd(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[],c=new Uint8Array(n.count);for(let e=0;e<n.count;e++)o[e]=new Q,s[e]=new Q;let l=new Q,u=new Q,d=new Q,f=new du,p=new du,m=new du,h=new Q,g=new Q;function _(e,t,r){c[e]=c[t]=c[r]=1,l.fromBufferAttribute(n,e),u.fromBufferAttribute(n,t),d.fromBufferAttribute(n,r),f.fromBufferAttribute(i,e),p.fromBufferAttribute(i,t),m.fromBufferAttribute(i,r),u.sub(l),d.sub(l),p.sub(f),m.sub(f);let a=1/(p.x*m.y-m.x*p.y);isFinite(a)&&(h.copy(u).multiplyScalar(m.y).addScaledVector(d,-p.y).multiplyScalar(a),g.copy(d).multiplyScalar(p.x).addScaledVector(u,-m.x).multiplyScalar(a),o[e].add(h),o[t].add(h),o[r].add(h),s[e].add(g),s[t].add(g),s[r].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let t=0,n=v.length;t<n;++t){let n=v[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)_(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let y=new Q,b=new Q,x=new Q,S=new Q;function C(e){x.fromBufferAttribute(r,e),S.copy(x);let t=o[e];y.copy(t),y.sub(x.multiplyScalar(x.dot(t))).normalize(),b.crossVectors(S,t);let n=b.dot(s[e])<0?-1:1;a.setXYZW(e,y.x,y.y,y.z,n)}for(let e=0,t=n.count;e<t;++e)c[e]&&C(e);this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new Qd(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new Q,i=new Q,a=new Q,o=new Q,s=new Q,c=new Q,l=new Q,u=new Q;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)pf.fromBufferAttribute(e,t),pf.normalize(),e.setXYZ(t,pf.x,pf.y,pf.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new Qd(a,r,i)}if(this.index===null)return Z(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},hf=new Q,gf=new Q,_f=new hu,vf=class{constructor(e=new Q(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=hf.subVectors(n,t).cross(gf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(hf),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||_f.getNormalMatrix(e),r=this.coplanarPoint(hf).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},yf=0,bf=class extends $l{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:yf++}),this.uuid=ru(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new _d(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=zl,this.stencilZFail=zl,this.stencilZPass=zl,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Z(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?Z(`Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new _d().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new vf().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new du().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new du().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},xf=new Q,Sf=new Q,Cf=new Q,wf=new Q,Tf=class{constructor(e=new Q,t=new Q(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,xf)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=xf.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(xf.copy(this.origin).addScaledVector(this.direction,t),xf.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Sf.copy(e).add(t).multiplyScalar(.5),Cf.copy(t).sub(e).normalize(),wf.copy(this.origin).sub(Sf);let i=e.distanceTo(t)*.5,a=-this.direction.dot(Cf),o=wf.dot(this.direction),s=-wf.dot(Cf),c=wf.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Sf).addScaledVector(Cf,d),f}intersectSphere(e,t){if(e.radius<0)return null;xf.subVectors(e.center,this.origin);let n=xf.dot(this.direction),r=xf.dot(xf)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,xf)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,k,A,j,M,N;if(y>=b&&y>=x?(w=s,D=u,A=p,N=g,s>=0?(S=c,C=l,T=d,E=f,O=m,k=h,j=_,M=v):(S=l,C=c,T=f,E=d,O=h,k=m,j=v,M=_)):b>=x?(w=c,D=d,A=m,N=_,c>=0?(S=l,C=s,T=f,E=u,O=h,k=p,j=v,M=g):(S=s,C=l,T=u,E=f,O=p,k=h,j=g,M=v)):(w=l,D=f,A=h,N=v,l>=0?(S=s,C=c,T=u,E=d,O=p,k=m,j=g,M=_):(S=c,C=s,T=d,E=u,O=m,k=p,j=_,M=g)),w===0)return null;let P=S/w,F=C/w,I=1/w,ee=T-P*D,L=E-F*D,te=O-P*A,ne=k-F*A,R=j-P*N,re=M-F*N,z=R*ne-re*te,ie=ee*re-L*R,ae=te*L-ne*ee;if(r){if(z<0||ie<0||ae<0)return null}else if((z<0||ie<0||ae<0)&&(z>0||ie>0||ae>0))return null;let oe=z+ie+ae;if(oe===0)return null;let B=I*(z*D+ie*A+ae*N);return(oe>0?B<0:B>0)?null:this.at(B/oe,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Ef=class extends bf{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new _d(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ku,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Df=new Iu,Of=new Tf,kf=new of,Af=new Q,jf=new Q,Mf=new Q,Nf=new Q,Pf=new Q,Ff=new Q,If=new Q,Lf=new Q,Rf=class extends ld{constructor(e=new mf,t=new Ef){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.morphTargetInfluences=e.morphTargetInfluences===void 0?void 0:e.morphTargetInfluences.slice(),this.morphTargetDictionary=e.morphTargetDictionary===void 0?void 0:Object.assign({},e.morphTargetDictionary),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){Ff.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(Pf.fromBufferAttribute(s,e),a?Ff.addScaledVector(Pf,r):Ff.addScaledVector(Pf.sub(t),r))}t.add(Ff)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),kf.copy(n.boundingSphere),kf.applyMatrix4(i),Of.copy(e.ray).recast(e.near),kf.containsPoint(Of.origin)===!1&&(Of.intersectSphere(kf,Af)===null||Of.origin.distanceToSquared(Af)>(e.far-e.near)**2)||(Df.copy(i).invert(),Of.copy(e.ray).applyMatrix4(Df),(n.boundingBox===null||Of.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,Of)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=Bf(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=Bf(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=Bf(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=Bf(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function zf(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;Lf.copy(s),Lf.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(Lf);return l<n.near||l>n.far?null:{distance:l,point:Lf.clone(),object:e}}function Bf(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,jf),e.getVertexPosition(c,Mf),e.getVertexPosition(l,Nf);let u=zf(e,t,n,r,jf,Mf,Nf,If);if(u){let e=new Q;Nd.getBarycoord(If,jf,Mf,Nf,e),i&&(u.uv=Nd.getInterpolatedAttribute(i,s,c,l,e,new du)),a&&(u.uv1=Nd.getInterpolatedAttribute(a,s,c,l,e,new du)),o&&(u.normal=Nd.getInterpolatedAttribute(o,s,c,l,e,new Q),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new Q,materialIndex:0};Nd.getNormal(jf,Mf,Nf,t.normal),u.face=t,u.barycoord=e}return u}var Vf=class extends Au{constructor(e=null,t=1,n=1,r,i,a,o,s,c=gc,l=gc,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Hf=new of,Uf=new du(.5,.5),Wf=new Q,Gf=class{constructor(e=new vf,t=new vf,n=new vf,r=new vf,i=new vf,a=new vf){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Vl,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Hf.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Hf.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Hf)}intersectsSprite(e){return Hf.center.set(0,0,0),Hf.radius=.7071067811865476+Uf.distanceTo(e.center),Hf.applyMatrix4(e.matrixWorld),this.intersectsSphere(Hf)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Wf.x=r.normal.x>0?e.max.x:e.min.x,Wf.y=r.normal.y>0?e.max.y:e.min.y,Wf.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Wf)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Kf=new Iu,qf=class e{constructor(){this.coordinateSystem=Vl,this._frustums=[],this._count=0}setFromArrayCamera(e){let t=e.cameras,n=this._frustums;for(let e=0;e<t.length;e++){let r=t[e];Kf.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[e]===void 0&&(n[e]=new Gf),n[e].setFromProjectionMatrix(Kf,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return!0;return!1}intersectsSprite(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return!0;return!1}intersectsSphere(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return!0;return!1}intersectsBox(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return!0;return!1}containsPoint(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;let t=this._frustums,n=e._frustums;for(let r=0;r<e._count;r++)t[r]===void 0&&(t[r]=new Gf),t[r].copy(n[r]);return this._count=e._count,this}clone(){return new e().copy(this)}},Jf=class extends Au{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Yf=class extends Au{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Xf=class extends Au{constructor(e,t,n=Dc,r,i,a,o=gc,s=gc,c,l=Rc,u=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Eu(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Zf=class extends Xf{constructor(e,t=Dc,n=301,r,i,a=gc,o=gc,s,c=Rc){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Qf=class extends Au{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},$f=class e extends mf{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new tf(c,3)),this.setAttribute(`normal`,new tf(l,3)),this.setAttribute(`uv`,new tf(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new Q;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},ep=class e extends mf{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new tf(p,3)),this.setAttribute(`normal`,new tf(m,3)),this.setAttribute(`uv`,new tf(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}};function tp(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(rp(i))i.isRenderTargetTexture?(Z(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(rp(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function np(e){let t={};for(let n=0;n<e.length;n++){let r=tp(e[n]);for(let e in r)t[e]=r[e]}return t}function rp(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function ip(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function ap(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:bu.workingColorSpace}var op={clone:tp,merge:np},sp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,cp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,lp=class extends bf{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=sp,this.fragmentShader=cp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=tp(e.uniforms),this.uniformsGroups=ip(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new _d().setHex(r.value);break;case`v2`:this.uniforms[n].value=new du().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new Q().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new ju().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new hu().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new Iu().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},up=class extends lp{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},dp=class extends bf{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=Pl,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},fp=class extends bf{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function pp(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function mp(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var hp=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},gp=class extends hp{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:jl,endingEnd:jl}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case Ml:i=e,o=2*t-n;break;case Nl:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case Ml:a=e,s=2*n-t;break;case Nl:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},_p=class extends hp{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},vp=class extends hp{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},yp=class extends hp{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=Sp(n,t,g,y,r);i[p]=bp(x,o,_,b,m)}return i}};function bp(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function xp(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function Sp(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=bp(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=xp(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var Cp=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=pp(t,this.TimeBufferType),this.values=pp(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:pp(e.times,Array),values:pp(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),mp(e.settings)&&(n.settings={inTangents:pp(e.settings.inTangents,Array),outTangents:pp(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new vp(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new _p(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new gp(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new yp(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Dl:t=this.InterpolantFactoryMethodDiscrete;break;case Ol:t=this.InterpolantFactoryMethodLinear;break;case kl:t=this.InterpolantFactoryMethodSmooth;break;case Al:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return Z(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Dl;case this.InterpolantFactoryMethodLinear:return Ol;case this.InterpolantFactoryMethodSmooth:return kl;case this.InterpolantFactoryMethodBezier:return Al}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e;mp(this.settings)&&(wp(this.settings.inTangents,e),wp(this.settings.outTangents,e))}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;mp(this.settings)&&(Tp(this.settings.inTangents,e),Tp(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Yl(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(Yl(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){Yl(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){Yl(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&Ul(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){Yl(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===kl,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,mp(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function wp(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]+=t}function Tp(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}Cp.prototype.ValueTypeName=``,Cp.prototype.TimeBufferType=Float32Array,Cp.prototype.ValueBufferType=Float32Array,Cp.prototype.DefaultInterpolation=Ol;var Ep=class extends Cp{constructor(e,t,n){super(e,t,n)}};Ep.prototype.ValueTypeName=`bool`,Ep.prototype.ValueBufferType=Array,Ep.prototype.DefaultInterpolation=Dl,Ep.prototype.InterpolantFactoryMethodLinear=void 0,Ep.prototype.InterpolantFactoryMethodSmooth=void 0;var Dp=class extends Cp{constructor(e,t,n,r){super(e,t,n,r)}};Dp.prototype.ValueTypeName=`color`;var Op=class extends Cp{constructor(e,t,n,r){super(e,t,n,r)}};Op.prototype.ValueTypeName=`number`;var kp=class extends hp{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)fu.slerpFlat(i,0,a,c-o,a,c,s);return i}},Ap=class extends Cp{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new kp(this.times,this.values,this.getValueSize(),e)}};Ap.prototype.ValueTypeName=`quaternion`,Ap.prototype.InterpolantFactoryMethodSmooth=void 0;var jp=class extends Cp{constructor(e,t,n){super(e,t,n)}};jp.prototype.ValueTypeName=`string`,jp.prototype.ValueBufferType=Array,jp.prototype.DefaultInterpolation=Dl,jp.prototype.InterpolantFactoryMethodLinear=void 0,jp.prototype.InterpolantFactoryMethodSmooth=void 0;var Mp=class extends Cp{constructor(e,t,n,r){super(e,t,n,r)}};Mp.prototype.ValueTypeName=`vector`;var Np={enabled:!1,files:{},add:function(e,t){this.enabled!==!1&&(Pp(e)||(this.files[e]=t))},get:function(e){if(this.enabled!==!1&&!Pp(e))return this.files[e]},remove:function(e){delete this.files[e]},clear:function(){this.files={}}};function Pp(e){try{let t=e.slice(e.indexOf(`:`)+1);return new URL(t).protocol===`blob:`}catch{return!1}}var Fp=new class{constructor(e,t,n){let r=this,i=!1,a=0,o=0,s,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(e){o++,i===!1&&r.onStart!==void 0&&r.onStart(e,a,o),i=!0},this.itemEnd=function(e){a++,r.onProgress!==void 0&&r.onProgress(e,a,o),a===o&&(i=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(e){r.onError!==void 0&&r.onError(e)},this.resolveURL=function(e){return e=e.normalize(`NFC`),s?s(e):e},this.setURLModifier=function(e){return s=e,this},this.addHandler=function(e,t){return c.push(e,t),this},this.removeHandler=function(e){let t=c.indexOf(e);return t!==-1&&c.splice(t,2),this},this.getHandler=function(e){for(let t=0,n=c.length;t<n;t+=2){let n=c[t],r=c[t+1];if(n.global&&(n.lastIndex=0),n.test(e))return r}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||=new AbortController,this._abortController}},Ip=class{constructor(e){this.manager=e===void 0?Fp:e,this.crossOrigin=`anonymous`,this.withCredentials=!1,this.path=``,this.resourcePath=``,this.requestHeader={},this.priority=`auto`,this.cache=`default`,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(r,i){n.load(e,r,t,i)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}setPriority(e){return this.priority=e,this}setCache(e){return this.cache=e,this}abort(){return this}};Ip.DEFAULT_MATERIAL_NAME=`__DEFAULT`;var Lp=new WeakMap,Rp=class extends Ip{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=this,a=Np.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)i.manager.itemStart(e),setTimeout(function(){t&&t(a),i.manager.itemEnd(e)},0);else{let e=Lp.get(a);e===void 0&&(e=[],Lp.set(a,e)),e.push({onLoad:t,onError:r})}return a}let o=Wl(`img`);function s(){l(),t&&t(this);let n=Lp.get(this)||[];for(let e=0;e<n.length;e++){let t=n[e];t.onLoad&&t.onLoad(this)}Lp.delete(this),i.manager.itemEnd(e)}function c(t){l(),r&&r(t),Np.remove(`image:${e}`);let n=Lp.get(this)||[];for(let e=0;e<n.length;e++){let r=n[e];r.onError&&r.onError(t)}Lp.delete(this),i.manager.itemError(e),i.manager.itemEnd(e)}function l(){o.removeEventListener(`load`,s,!1),o.removeEventListener(`error`,c,!1)}return o.addEventListener(`load`,s,!1),o.addEventListener(`error`,c,!1),e.slice(0,5)!==`data:`&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Np.add(`image:${e}`,o),i.manager.itemStart(e),o.fetchPriority=this.priority,o.src=e,o}},zp=class extends Ip{constructor(e){super(e)}load(e,t,n,r){let i=new Au,a=new Rp(this.manager);return a.setPriority(this.priority),a.setCache(this.cache),a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(e){i.image=e,i.needsUpdate=!0,t!==void 0&&t(i)},n,r),i}},Bp=new Q,Vp=new fu,Hp=new Q,Up=class extends ld{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new Iu,this.projectionMatrix=new Iu,this.projectionMatrixInverse=new Iu,this.coordinateSystem=Vl,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Bp,Vp,Hp),Hp.x===1&&Hp.y===1&&Hp.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Bp,Vp,Hp.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Bp,Vp,Hp),Hp.x===1&&Hp.y===1&&Hp.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Bp,Vp,Hp.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Wp=new Q,Gp=new du,Kp=new du,qp=class extends Up{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=nu*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(tu*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return nu*2*Math.atan(Math.tan(tu*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Wp.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Wp.x,Wp.y).multiplyScalar(-e/Wp.z),Wp.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Wp.x,Wp.y).multiplyScalar(-e/Wp.z)}getViewSize(e,t){return this.getViewBounds(e,Gp,Kp),t.subVectors(Kp,Gp)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(tu*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Jp=class extends Up{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Yp=-90,Xp=1,Zp=class extends ld{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new qp(Yp,Xp,e,t);r.layers=this.layers,this.add(r);let i=new qp(Yp,Xp,e,t);i.layers=this.layers,this.add(i);let a=new qp(Yp,Xp,e,t);a.layers=this.layers,this.add(a);let o=new qp(Yp,Xp,e,t);o.layers=this.layers,this.add(o);let s=new qp(Yp,Xp,e,t);s.layers=this.layers,this.add(s);let c=new qp(Yp,Xp,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.mipmapsAutoUpdate=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Qp=class extends qp{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}},$p=`\\[\\]\\.:\\/`,em=RegExp(`[\\[\\]\\.:\\/]`,`g`),tm=`[^\\[\\]\\.:\\/]`,nm=`[^`+$p.replace(`\\.`,``)+`]`,rm=`((?:WC+[\\/:])*)`.replace(`WC`,tm),im=`(WCOD+)?`.replace(`WCOD`,nm),am=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,tm),om=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,tm),sm=RegExp(`^`+rm+im+am+om+`$`),cm=[`material`,`materials`,`bones`,`map`],lm=class{constructor(e,t,n){let r=n||um.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},um=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(em,``)}static parseTrackName(e){let t=sm.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);cm.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Z(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){Yl(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){Yl(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){Yl(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){Yl(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){Yl(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){Yl(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){Yl(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;Yl(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){Yl(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){Yl(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};um.Composite=lm,um.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},um.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},um.prototype.GetterByBindingType=[um.prototype._getValue_direct,um.prototype._getValue_array,um.prototype._getValue_arrayElement,um.prototype._getValue_toArray],um.prototype.SetterByBindingTypeAndVersioning=[[um.prototype._setValue_direct,um.prototype._setValue_direct_setNeedsUpdate,um.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[um.prototype._setValue_array,um.prototype._setValue_array_setNeedsUpdate,um.prototype._setValue_array_setMatrixWorldNeedsUpdate],[um.prototype._setValue_arrayElement,um.prototype._setValue_arrayElement_setNeedsUpdate,um.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[um.prototype._setValue_fromArray,um.prototype._setValue_fromArray_setNeedsUpdate,um.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]],class{static{this.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}};function dm(e,t,n,r){let i=fm(r);switch(n){case Fc:return e*t;case Bc:return e*t/i.components*i.byteLength;case Vc:return e*t/i.components*i.byteLength;case Hc:return e*t*2/i.components*i.byteLength;case Uc:return e*t*2/i.components*i.byteLength;case Ic:return e*t*3/i.components*i.byteLength;case Lc:return e*t*4/i.components*i.byteLength;case Wc:return e*t*4/i.components*i.byteLength;case Gc:case Kc:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case qc:case Jc:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Xc:case Qc:return Math.max(e,16)*Math.max(t,8)/4;case Yc:case Zc:return Math.max(e,8)*Math.max(t,8)/2;case $c:case el:case nl:case rl:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case tl:case il:case al:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case ol:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case sl:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case cl:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case ll:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case ul:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case dl:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case fl:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case pl:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case ml:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case hl:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case gl:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case _l:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case vl:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case yl:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case bl:case xl:case Sl:return Math.ceil(e/4)*Math.ceil(t/4)*16;case Cl:case wl:return Math.ceil(e/4)*Math.ceil(t/4)*8;case Tl:case El:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function fm(e){switch(e){case Sc:case Cc:return{byteLength:1,components:1};case Tc:case wc:case kc:return{byteLength:2,components:1};case Ac:case jc:return{byteLength:2,components:4};case Dc:case Ec:case Oc:return{byteLength:4,components:1};case Nc:case Pc:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`187`}})),typeof window<`u`&&(window.__THREE__?Z(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`187`);function pm(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function mm(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var hm={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},$={common:{diffuse:{value:new _d(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new hu},alphaMap:{value:null},alphaMapTransform:{value:new hu},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new hu}},envmap:{envMap:{value:null},envMapRotation:{value:new hu},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new hu}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new hu}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new hu},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new hu},normalScale:{value:new du(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new hu},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new hu}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new hu}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new hu}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new _d(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new _d(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new hu},alphaTest:{value:0},uvTransform:{value:new hu}},sprite:{diffuse:{value:new _d(16777215)},opacity:{value:1},center:{value:new du(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new hu},alphaMap:{value:null},alphaMapTransform:{value:new hu},alphaTest:{value:0}}},gm={basic:{uniforms:np([$.common,$.specularmap,$.envmap,$.aomap,$.lightmap,$.fog]),vertexShader:hm.meshbasic_vert,fragmentShader:hm.meshbasic_frag},lambert:{uniforms:np([$.common,$.specularmap,$.envmap,$.aomap,$.lightmap,$.emissivemap,$.bumpmap,$.normalmap,$.displacementmap,$.fog,$.lights,{emissive:{value:new _d(0)},envMapIntensity:{value:1}}]),vertexShader:hm.meshlambert_vert,fragmentShader:hm.meshlambert_frag},phong:{uniforms:np([$.common,$.specularmap,$.envmap,$.aomap,$.lightmap,$.emissivemap,$.bumpmap,$.normalmap,$.displacementmap,$.fog,$.lights,{emissive:{value:new _d(0)},specular:{value:new _d(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:hm.meshphong_vert,fragmentShader:hm.meshphong_frag},standard:{uniforms:np([$.common,$.envmap,$.aomap,$.lightmap,$.emissivemap,$.bumpmap,$.normalmap,$.displacementmap,$.roughnessmap,$.metalnessmap,$.fog,$.lights,{emissive:{value:new _d(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:hm.meshphysical_vert,fragmentShader:hm.meshphysical_frag},toon:{uniforms:np([$.common,$.aomap,$.lightmap,$.emissivemap,$.bumpmap,$.normalmap,$.displacementmap,$.gradientmap,$.fog,$.lights,{emissive:{value:new _d(0)}}]),vertexShader:hm.meshtoon_vert,fragmentShader:hm.meshtoon_frag},matcap:{uniforms:np([$.common,$.bumpmap,$.normalmap,$.displacementmap,$.fog,{matcap:{value:null}}]),vertexShader:hm.meshmatcap_vert,fragmentShader:hm.meshmatcap_frag},points:{uniforms:np([$.points,$.fog]),vertexShader:hm.points_vert,fragmentShader:hm.points_frag},dashed:{uniforms:np([$.common,$.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:hm.linedashed_vert,fragmentShader:hm.linedashed_frag},depth:{uniforms:np([$.common,$.displacementmap]),vertexShader:hm.depth_vert,fragmentShader:hm.depth_frag},normal:{uniforms:np([$.common,$.bumpmap,$.normalmap,$.displacementmap,{opacity:{value:1}}]),vertexShader:hm.meshnormal_vert,fragmentShader:hm.meshnormal_frag},sprite:{uniforms:np([$.sprite,$.fog]),vertexShader:hm.sprite_vert,fragmentShader:hm.sprite_frag},background:{uniforms:{uvTransform:{value:new hu},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:hm.background_vert,fragmentShader:hm.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new hu}},vertexShader:hm.backgroundCube_vert,fragmentShader:hm.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:hm.cube_vert,fragmentShader:hm.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:hm.equirect_vert,fragmentShader:hm.equirect_frag},distance:{uniforms:np([$.common,$.displacementmap,{referencePosition:{value:new Q},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:hm.distance_vert,fragmentShader:hm.distance_frag},shadow:{uniforms:np([$.lights,$.fog,{color:{value:new _d(0)},opacity:{value:1}}]),vertexShader:hm.shadow_vert,fragmentShader:hm.shadow_frag}};gm.physical={uniforms:np([gm.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new hu},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new hu},clearcoatNormalScale:{value:new du(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new hu},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new hu},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new hu},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new hu},sheen:{value:0},sheenColor:{value:new _d(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new hu},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new hu},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new hu},transmissionSamplerSize:{value:new du},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new hu},attenuationDistance:{value:0},attenuationColor:{value:new _d(0)},specularColor:{value:new _d(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new hu},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new hu},anisotropyVector:{value:new du},anisotropyMap:{value:null},anisotropyMapTransform:{value:new hu}}]),vertexShader:hm.meshphysical_vert,fragmentShader:hm.meshphysical_frag};var _m={r:0,b:0,g:0},vm=new Iu,ym=new hu;ym.set(-1,0,0,0,1,0,0,0,1);function bm(e,t,n,r,i,a){let o=new _d(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&i.isCubeTexture?(l===void 0&&(l=new Rf(new $f(1,1,1),new lp({name:`BackgroundCubeMaterial`,uniforms:tp(gm.backgroundCube.uniforms),vertexShader:gm.backgroundCube.vertexShader,fragmentShader:gm.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(vm.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(ym),l.material.toneMapped=bu.getTransfer(i.colorSpace)!==Rl,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new Rf(new ep(2,2),new lp({name:`BackgroundMaterial`,uniforms:tp(gm.background.uniforms),vertexShader:gm.background.vertexShader,fragmentShader:gm.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=bu.getTransfer(i.colorSpace)!==Rl,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(_m,ap(e)),n.buffers.color.setClear(_m.r,_m.g,_m.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function xm(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.isInterleavedBuffer===!0?t.stride:t.itemSize,p=s.offset;if(t.isInstancedInterleavedBuffer||t.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function Sm(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function Cm(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(Z(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`),f=n.logarithmicDepthBuffer===!0&&d===!1;n.reversedDepthBuffer===!0&&d===!1&&Z(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`),n.logarithmicDepthBuffer===!0&&d===!0&&Z(`WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:f,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function wm(e){let t=this,n=null,r=0,i=!1,a=!1,o=new vf,s=new hu,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var Tm=class extends Nu{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Jf(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new $f(5,5,5),i=new lp({name:`CubemapFromEquirect`,uniforms:tp(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new Rf(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=yc),new Zp(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}},Em=256,Dm=3,Om=20,km=256,Am=16,jm=3,Mm=new Q,Nm=new _d,Pm=class e{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new Zp(1,10,null),this._boxMesh=new Rf(new $f(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=Mm}=i,s=this._renderer;this._setSize(a);let c=this._allocateTarget(),l=this._getSourceTarget(!0);t>0&&(l.texture.mipmapsAutoUpdate=!1);let u=s.autoClear,d=s.autoClearColor,f=s.autoClearDepth,p=s.autoClearStencil,m=e.background;s.autoClear=!0,s.autoClearColor=!0,s.autoClearDepth=!0,s.autoClearStencil=!0,m===null&&(e.background=s.getClearColor(Nm));let h=new Zp(n,r,l);return h.position.copy(o),h.update(s,e),s.autoClear=u,s.autoClearColor=d,s.autoClearDepth=f,s.autoClearStencil=p,e.background=m,t>0&&(l.texture.mipmapsAutoUpdate=!0,this._blur(c,t)),this._applyPMREM(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Vm(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Bm(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(Em,su(e))}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?Em:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);let n=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(n),n}_allocateTarget(){let e=this._cubeSize,t=Fm(e,!1,!1),n=Math.log2(e)-Dm;for(let r=0;r<=n;r++)t.texture.mipmaps.push({width:e>>r,height:e>>r});return t.texture.name=`PMREM`,t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){let t=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==t||e&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=Fm(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,n){let r=this._boxMesh,i=this._cubeCamera;r.material=n,i.renderTarget=e,i.activeMipmapLevel=t;let a=e.width>>t;e.viewport.set(0,0,a,a),i.update(this._renderer,r),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===301||e.mapping===302?(this._cubemapMaterial===null&&(this._cubemapMaterial=Vm()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=Bm()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(t){this._ggxMaterial===null&&(this._ggxMaterial=Lm(),this._integrationMaterial=Rm());let n=this._cubeSize,r=t.texture.mipmaps.length-1,i=this._ggxMaterial.uniforms;i.envMap.value=this._sourceTarget.texture;let a=this._integrationMaterial.uniforms;a.envMap.value=this._sourceTarget.texture,a.sourceLod.value=Math.log2(n/Am);for(let o=0;o<=r;o++){let s=e.lodToRoughness(o,r);if(o>r-jm)a.roughness.value=s,this._renderCube(t,o,this._integrationMaterial);else{let e=s>0?Math.log2(n)+.5*Math.log2(6/(km*s**4))+.5:0;i.roughness.value=s,i.lodBias.value=e,this._renderCube(t,o,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=zm());let n=this._blurMaterial,r=n.uniforms,i=this._sourceTarget;r.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,r.envMap.value=i.texture,this._renderCube(e,0,n),r.envMap.value=e.texture,this._renderCube(i,0,n)}};function Fm(e,t,n){return new Tm(e,{minFilter:xc,generateMipmaps:t,type:kc,colorSpace:Il,depthBuffer:n})}function Im(e,t,n){return new lp({name:e,uniforms:t,vertexShader:hm.cube_vert,fragmentShader:n,side:1,blending:0,depthTest:!1,depthWrite:!1})}function Lm(){return Im(`PMREMGGXConvolution`,{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${km}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function Rm(){return Im(`PMREMGGXIntegration`,{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Am}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function zm(){return Im(`PMREMSphericalGaussianBlur`,{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${Om}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function Bm(){return Im(`PMREMEquirectangularToCubemap`,{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function Vm(){return Im(`PMREMCubemapToCubemap`,{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function Hm(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new Tm(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture&&t.isPMREMTexture!==!0){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new Pm(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new Pm(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function Um(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&Xl(`WebGLRenderer: `+e+` extension not supported.`),t}}}function Wm(e,t,n,r){let i={},a=new WeakMap,o=new FinalizationRegistry(e=>delete i[e]);function s(e){c(e.target)}function c(e){e.index!==null&&t.remove(e.index);for(let n in e.attributes)t.remove(e.attributes[n]);e.removeEventListener(`dispose`,s),delete i[e.id],o.unregister(e);let c=a.get(e);c&&(t.remove(c),a.delete(e)),r.releaseStatesOfGeometry(e),e.isInstancedBufferGeometry===!0&&delete e._maxInstanceCount,n.memory.geometries--}function l(e,t){return i[t.id]===void 0&&(t.addEventListener(`dispose`,s),i[t.id]=new WeakRef(t),o.register(t,t.id,t),n.memory.geometries++),t}function u(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function d(e){let n=e.index,r=e.attributes.position,i=0;if(r===void 0)return;let o=n===null?r.array.length/3-1:n.array.length,s=new(r.count>=65535?ef:$d)(Math.ceil(o/3)*6,1),c=s.array;if(n!==null){let e=n.array;i=n.version;for(let t=0,n=0;t<o;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];c[n++]=r,c[n++]=i,c[n++]=i,c[n++]=a,c[n++]=a,c[n++]=r}}else{i=r.version;for(let e=0,t=0;e<o;e+=3){let n=e+0,r=e+1,i=e+2;c[t++]=n,c[t++]=r,c[t++]=r,c[t++]=i,c[t++]=i,c[t++]=n}}s.version=i;let l=a.get(e);l&&t.remove(l),a.set(e,s)}function f(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&d(e)}else d(e);return a.get(e)}function p(){for(let e in i){let t=i[e].deref();t!==void 0&&c(t)}}return{get:l,update:u,getWireframeAttribute:f,dispose:p}}function Gm(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function Km(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:Yl(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function qm(e,t,n){let r=new WeakMap,i=new ju;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new Pu(h,p,m,u);g.type=Oc,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new du(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function Jm(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var Ym={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function Xm(e,t,n,r,i,a){let o=new Nu(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=null,u=new mf;u.setAttribute(`position`,new tf([-1,3,0,-1,-1,0,3,-1,0],3)),u.setAttribute(`uv`,new tf([0,2,0,0,2,0],2));let d=new up({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),f=new Rf(u,d),p=new Jp(-1,1,1,-1,0,1),m=null,h=null,g=!1,_,v=null,y=[],b=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<y.length;n++){let r=y[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){y=e,b=y.length>0&&y[0].isRenderPass===!0;let t=o.width,n=o.height;y.length>0&&s===null&&(s=new Nu(t,n,{type:kc,depthBuffer:!1,stencilBuffer:!1}),c=new Nu(t,n,{type:kc,depthBuffer:!1,stencilBuffer:!1}));let r=i===!0&&y.some(e=>e.needsDepthTexture===!0);r!==(o.depthTexture!==null)&&(r===!0&&l===null&&(l=new Xf(t,n),a===!0&&(l.format=zc,l.type=Mc)),o.dispose(),o.depthTexture=r?l:null,o.resolveDepthBuffer=r,o.storeMultisampledDepthBuffer=r);for(let e=0;e<y.length;e++){let i=y[e];i.setSize&&i.setSize(t,n),r&&i.needsDepthTexture===!0&&i.setDepthTexture&&i.setDepthTexture(l)}},this.begin=function(e,t){if(g||e.toneMapping===0&&y.length===0)return!1;if(v=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return b===!1&&e.setRenderTarget(o),_=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return b},this.end=function(e,t){e.toneMapping=_,g=!0;let n=o,r=s;for(let i=0;i<y.length;i++){let a=y[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(m!==e.outputColorSpace||h!==e.toneMapping){m=e.outputColorSpace,h=e.toneMapping,d.defines={},bu.getTransfer(m)===`srgb`&&(d.defines.SRGB_TRANSFER=``);let t=Ym[h];t&&(d.defines[t]=``),d.needsUpdate=!0}d.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(v),e.render(f,p),v=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),u.dispose(),d.dispose()}}var Zm=new Au,Qm=new Xf(1,1),$m=new Zf(1),eh=new Pu,th=new Fu,nh=new Jf,rh=[],ih=[],ah=new Float32Array(16),oh=new Float32Array(9),sh=new Float32Array(4);function ch(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=rh[i];if(a===void 0&&(a=new Float32Array(i),rh[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function lh(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function uh(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function dh(e,t){let n=ih[t];n===void 0&&(n=new Int32Array(t),ih[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function fh(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function ph(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(lh(n,t))return;e.uniform2fv(this.addr,t),uh(n,t)}}function mh(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(lh(n,t))return;e.uniform3fv(this.addr,t),uh(n,t)}}function hh(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(lh(n,t))return;e.uniform4fv(this.addr,t),uh(n,t)}}function gh(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(lh(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),uh(n,t)}else{if(lh(n,r))return;sh.set(r),e.uniformMatrix2fv(this.addr,!1,sh),uh(n,r)}}function _h(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(lh(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),uh(n,t)}else{if(lh(n,r))return;oh.set(r),e.uniformMatrix3fv(this.addr,!1,oh),uh(n,r)}}function vh(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(lh(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),uh(n,t)}else{if(lh(n,r))return;ah.set(r),e.uniformMatrix4fv(this.addr,!1,ah),uh(n,r)}}function yh(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function bh(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(lh(n,t))return;e.uniform2iv(this.addr,t),uh(n,t)}}function xh(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(lh(n,t))return;e.uniform3iv(this.addr,t),uh(n,t)}}function Sh(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(lh(n,t))return;e.uniform4iv(this.addr,t),uh(n,t)}}function Ch(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function wh(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(lh(n,t))return;e.uniform2uiv(this.addr,t),uh(n,t)}}function Th(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(lh(n,t))return;e.uniform3uiv(this.addr,t),uh(n,t)}}function Eh(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(lh(n,t))return;e.uniform4uiv(this.addr,t),uh(n,t)}}function Dh(e){return e.version===0&&(e.compareFunction=519,e.needsUpdate=!0),e}function Oh(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;a=this.type===e.SAMPLER_2D_SHADOW?Dh(Qm):Zm,n.setTexture2D(t||a,i)}function kh(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||th,i)}function Ah(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;a=this.type===e.SAMPLER_CUBE_SHADOW?Dh($m):nh,n.setTextureCube(t||a,i)}function jh(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||eh,i)}function Mh(e){switch(e){case 5126:return fh;case 35664:return ph;case 35665:return mh;case 35666:return hh;case 35674:return gh;case 35675:return _h;case 35676:return vh;case 5124:case 35670:return yh;case 35667:case 35671:return bh;case 35668:case 35672:return xh;case 35669:case 35673:return Sh;case 5125:return Ch;case 36294:return wh;case 36295:return Th;case 36296:return Eh;case 35678:case 36198:case 36298:case 36306:case 35682:return Oh;case 35679:case 36299:case 36307:return kh;case 35680:case 36300:case 36308:case 36293:return Ah;case 36289:case 36303:case 36311:case 36292:return jh}}function Nh(e,t){e.uniform1fv(this.addr,t)}function Ph(e,t){let n=ch(t,this.size,2);e.uniform2fv(this.addr,n)}function Fh(e,t){let n=ch(t,this.size,3);e.uniform3fv(this.addr,n)}function Ih(e,t){let n=ch(t,this.size,4);e.uniform4fv(this.addr,n)}function Lh(e,t){let n=ch(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function Rh(e,t){let n=ch(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function zh(e,t){let n=ch(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function Bh(e,t){e.uniform1iv(this.addr,t)}function Vh(e,t){e.uniform2iv(this.addr,t)}function Hh(e,t){e.uniform3iv(this.addr,t)}function Uh(e,t){e.uniform4iv(this.addr,t)}function Wh(e,t){e.uniform1uiv(this.addr,t)}function Gh(e,t){e.uniform2uiv(this.addr,t)}function Kh(e,t){e.uniform3uiv(this.addr,t)}function qh(e,t){e.uniform4uiv(this.addr,t)}function Jh(e,t,n){let r=this.cache,i=t.length,a=dh(n,i);lh(r,a)||(e.uniform1iv(this.addr,a),uh(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?Dh(Qm):Zm;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function Yh(e,t,n){let r=this.cache,i=t.length,a=dh(n,i);lh(r,a)||(e.uniform1iv(this.addr,a),uh(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||th,a[e])}function Xh(e,t,n){let r=this.cache,i=t.length,a=dh(n,i);lh(r,a)||(e.uniform1iv(this.addr,a),uh(r,a));let o;o=this.type===e.SAMPLER_CUBE_SHADOW?Dh($m):nh;for(let e=0;e!==i;++e)n.setTextureCube(t[e]||o,a[e])}function Zh(e,t,n){let r=this.cache,i=t.length,a=dh(n,i);lh(r,a)||(e.uniform1iv(this.addr,a),uh(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||eh,a[e])}function Qh(e){switch(e){case 5126:return Nh;case 35664:return Ph;case 35665:return Fh;case 35666:return Ih;case 35674:return Lh;case 35675:return Rh;case 35676:return zh;case 5124:case 35670:return Bh;case 35667:case 35671:return Vh;case 35668:case 35672:return Hh;case 35669:case 35673:return Uh;case 5125:return Wh;case 36294:return Gh;case 36295:return Kh;case 36296:return qh;case 35678:case 36198:case 36298:case 36306:case 35682:return Jh;case 35679:case 36299:case 36307:return Yh;case 35680:case 36300:case 36308:case 36293:return Xh;case 36289:case 36303:case 36311:case 36292:return Zh}}var $h=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Mh(t.type)}},eg=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Qh(t.type)}},tg=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},ng=/(\w+)(\])?(\[|\.)?/g;function rg(e,t){e.seq.push(t),e.map[t.id]=t}function ig(e,t,n){let r=e.name,i=r.length;for(ng.lastIndex=0;;){let a=ng.exec(r),o=ng.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){rg(n,l===void 0?new $h(s,e,t):new eg(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new tg(s),rg(n,e)),n=e}}}var ag=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);ig(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function og(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var sg=37297,cg=0;function lg(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var ug=new hu;function dg(e){bu._getMatrix(ug,bu.workingColorSpace,e);let t=`mat3( ${ug.elements.map(e=>e.toFixed(4))} )`;switch(bu.getTransfer(e)){case Ll:return[t,`LinearTransferOETF`];case Rl:return[t,`sRGBTransferOETF`];default:return Z(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function fg(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+lg(e.getShaderSource(t),r)}return i}function pg(e,t){let n=dg(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( ${n[0]} * value.rgb, value.a ) );`,`}`].join(`
`)}var mg={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function hg(e,t){let n=mg[t];return n===void 0?(Z(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var gg=new Q;function _g(){return bu.getLuminanceCoefficients(gg),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${gg.x.toFixed(4)}, ${gg.y.toFixed(4)}, ${gg.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function vg(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(xg).join(`
`)}function yg(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function bg(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function xg(e){return e!==``}function Sg(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,t.numLightProbeGrids)}function Cg(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var wg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Tg(e){return e.replace(wg,Eg)}function Eg(e,t){let n=hm[t];if(n===void 0)throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`);return Tg(n)}var Dg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Og(e){return e.replace(Dg,kg)}function kg(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function Ag(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var jg={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function Mg(e){return jg[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var Ng={302:`ENVMAP_MODE_REFRACTION`};function Pg(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:Ng[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var Fg={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function Ig(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:Fg[e.combine]||`ENVMAP_BLENDING_NONE`}function Lg(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=Mg(n),l=n.envMapPMREM===!0?`ENVMAP_TYPE_PMREM`:`ENVMAP_TYPE_CUBE`,u=Pg(n),d=Ig(n),f=vg(n),p=yg(a),m=i.createProgram(),h,g,_=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(h=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p].filter(xg).join(`
`),h.length>0&&(h+=`
`),g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p].filter(xg).join(`
`),g.length>0&&(g+=`
`)):(h=[Ag(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.diffuseRoughnessMap?`#define USE_DIFFUSE_ROUGHNESSMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.diffuseRoughnessMapUv?`#define DIFFUSE_ROUGHNESSMAP_UV `+n.diffuseRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(xg).join(`
`),g=[Ag(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,n.envMapPMREM?`#define ENVMAP_MAX_LOD `+n.envMapMaxLod+`.0`:``,n.envMapPMREM?`#define ENVMAP_SIZE `+n.envMapSize+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.diffuseRoughness?`#define USE_DIFFUSE_ROUGHNESS`:``,n.diffuseRoughnessMap?`#define USE_DIFFUSE_ROUGHNESSMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:hm.tonemapping_pars_fragment,n.toneMapping===0?``:hg(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,hm.colorspace_pars_fragment,pg(`linearToOutputTexel`,n.outputColorSpace),_g(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(xg).join(`
`)),o=Tg(o),o=Sg(o,n),o=Cg(o,n),s=Tg(s),s=Sg(s,n),s=Cg(s,n),o=Og(o),s=Og(s),n.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,h=[f,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+h,g=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+g);let v=_+h+o,y=_+g+s,b=og(i,i.VERTEX_SHADER,v),x=og(i,i.FRAGMENT_SHADER,y);i.attachShader(m,b),i.attachShader(m,x),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(m,0,`position`):i.bindAttribLocation(m,0,n.index0AttributeName),i.linkProgram(m);function S(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(m)||``,r=i.getShaderInfoLog(b)||``,a=i.getShaderInfoLog(x)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(m,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,m,b,x);else{let e=fg(i,b,`vertex`),n=fg(i,x,`fragment`);Yl(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(m,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):Z(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:h},fragmentShader:{log:c,prefix:g}})}i.deleteShader(b),i.deleteShader(x),C=new ag(i,m),w=bg(i,m)}let C;this.getUniforms=function(){return C===void 0&&S(this),C};let w;this.getAttributes=function(){return w===void 0&&S(this),w};let T=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return T===!1&&(T=i.getProgramParameter(m,sg)),T},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(m),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=cg++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=b,this.fragmentShader=x,this}var Rg=0,zg=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Bg(e),t.set(e,n)),n}},Bg=class{constructor(e){this.id=Rg++,this.code=e,this.usedTimes=0}};function Vg(e){return e===1030||e===37490||e===36285}function Hg(e,t,n,r,i,a){let o=new qu,s=new zg,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function p(e){return c.add(e),e===0?`uv`:`uv${e}`}function m(i,o,l,u,m,h){let g=u.fog,_=m.geometry,v=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,b=t.get(i.envMap||v,y),x=f[i.type],S=r.precision;i.precision!==null&&(S=r.getMaxPrecision(i.precision),S!==i.precision&&Z(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,S,`instead.`));let C=_.morphAttributes.position||_.morphAttributes.normal||_.morphAttributes.color,w=C===void 0?0:C.length,T=0;_.morphAttributes.position!==void 0&&(T=1),_.morphAttributes.normal!==void 0&&(T=2),_.morphAttributes.color!==void 0&&(T=3);let E,D,O,k;if(x){let e=gm[x];E=e.vertexShader,D=e.fragmentShader}else{E=i.vertexShader,D=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),O=e.id,k=t.id}let A=e.getRenderTarget(),j=e.state.buffers.depth.getReversed(),M=m.isInstancedMesh===!0,N=m.isBatchedMesh===!0,P=!!i.map,F=!!i.matcap,I=!!b,ee=I&&b.isPMREMTexture===!0,L=!!i.aoMap,te=!!i.lightMap,ne=!!i.bumpMap&&i.wireframe===!1,R=!!i.normalMap,re=!!i.displacementMap,z=!!i.emissiveMap,ie=!!i.metalnessMap,ae=!!i.roughnessMap,oe=i.anisotropy>0,B=i.clearcoat>0,se=i.diffuseRoughness>0,ce=i.dispersion>0,V=i.retroreflectivity>0,le=i.iridescence>0,ue=i.sheen>0,de=i.transmission>0,fe=oe&&!!i.anisotropyMap,pe=B&&!!i.clearcoatMap,me=B&&!!i.clearcoatNormalMap,he=B&&!!i.clearcoatRoughnessMap,ge=se&&!!i.diffuseRoughnessMap,H=le&&!!i.iridescenceMap,_e=le&&!!i.iridescenceThicknessMap,ve=ue&&!!i.sheenColorMap,U=ue&&!!i.sheenRoughnessMap,W=!!i.specularMap,ye=!!i.specularColorMap,G=!!i.specularIntensityMap,K=de&&!!i.transmissionMap,be=de&&!!i.thicknessMap,xe=!!i.gradientMap,Se=!!i.alphaMap,Ce=i.alphaTest>0,q=!!i.alphaHash,we=!!i.extensions,J=0;i.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(J=e.toneMapping);let Te=ee?b.isCompressedCubeTexture?b.image[0].mipmaps:b.mipmaps:null,Ee={shaderID:x,shaderType:i.type,shaderName:i.name,vertexShader:E,fragmentShader:D,defines:i.defines,customVertexShaderID:O,customFragmentShaderID:k,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:S,batching:N,batchingColor:N&&m._colorsTexture!==null,instancing:M,instancingColor:M&&m.instanceColor!==null,instancingMorph:M&&m.morphTexture!==null,outputColorSpace:A===null?e.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:bu.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:P,matcap:F,envMap:I,envMapMode:I&&b.mapping,envMapPMREM:ee,envMapMaxLod:ee?Te.length-1:null,envMapSize:ee?Te[0].width:null,aoMap:L,lightMap:te,bumpMap:ne,normalMap:R,displacementMap:re,emissiveMap:z,normalMapObjectSpace:R&&i.normalMapType===1,normalMapTangentSpace:R&&i.normalMapType===0,packedNormalMap:R&&i.normalMapType===0&&Vg(i.normalMap.format),metalnessMap:ie,roughnessMap:ae,anisotropy:oe,anisotropyMap:fe,clearcoat:B,clearcoatMap:pe,clearcoatNormalMap:me,clearcoatRoughnessMap:he,diffuseRoughness:se,diffuseRoughnessMap:ge,dispersion:ce,retroreflection:V,iridescence:le,iridescenceMap:H,iridescenceThicknessMap:_e,sheen:ue,sheenColorMap:ve,sheenRoughnessMap:U,specularMap:W,specularColorMap:ye,specularIntensityMap:G,transmission:de,transmissionMap:K,thicknessMap:be,gradientMap:xe,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Se,alphaTest:Ce,alphaHash:q,combine:i.combine,mapUv:P&&p(i.map.channel),aoMapUv:L&&p(i.aoMap.channel),lightMapUv:te&&p(i.lightMap.channel),bumpMapUv:ne&&p(i.bumpMap.channel),normalMapUv:R&&p(i.normalMap.channel),displacementMapUv:re&&p(i.displacementMap.channel),emissiveMapUv:z&&p(i.emissiveMap.channel),metalnessMapUv:ie&&p(i.metalnessMap.channel),roughnessMapUv:ae&&p(i.roughnessMap.channel),anisotropyMapUv:fe&&p(i.anisotropyMap.channel),clearcoatMapUv:pe&&p(i.clearcoatMap.channel),clearcoatNormalMapUv:me&&p(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:he&&p(i.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:ge&&p(i.diffuseRoughnessMap.channel),iridescenceMapUv:H&&p(i.iridescenceMap.channel),iridescenceThicknessMapUv:_e&&p(i.iridescenceThicknessMap.channel),sheenColorMapUv:ve&&p(i.sheenColorMap.channel),sheenRoughnessMapUv:U&&p(i.sheenRoughnessMap.channel),specularMapUv:W&&p(i.specularMap.channel),specularColorMapUv:ye&&p(i.specularColorMap.channel),specularIntensityMapUv:G&&p(i.specularIntensityMap.channel),transmissionMapUv:K&&p(i.transmissionMap.channel),thicknessMapUv:be&&p(i.thicknessMap.channel),alphaMapUv:Se&&p(i.alphaMap.channel),vertexTangents:!!_.attributes.tangent&&(R||oe),vertexNormals:!!_.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!_.attributes.color&&_.attributes.color.itemSize===4,pointsUvs:m.isPoints===!0&&!!_.attributes.uv&&(P||Se),fog:!!g,useFog:i.fog===!0,fogExp2:!!g&&g.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||_.attributes.normal===void 0&&R===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:j,skinning:m.isSkinnedMesh===!0,hasPositionAttribute:_.attributes.position!==void 0,morphTargets:_.morphAttributes.position!==void 0,morphNormals:_.morphAttributes.normal!==void 0,morphColors:_.morphAttributes.color!==void 0,morphTargetsCount:w,morphTextureStride:T,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:h.filter(e=>e.texture!==null).length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:J,decodeVideoTexture:P&&i.map.isVideoTexture===!0&&bu.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:z&&i.emissiveMap.isVideoTexture===!0&&bu.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:we&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(we&&i.extensions.multiDraw===!0||N)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Ee.vertexUv1s=c.has(1),Ee.vertexUv2s=c.has(2),Ee.vertexUv3s=c.has(3),c.clear(),Ee}function h(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(g(n,t),_(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function g(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapPMREM),e.push(t.envMapMaxLod),e.push(t.envMapSize),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.diffuseRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.numLightProbeGrids),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function _(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.diffuseRoughness&&o.enable(25),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function v(e){let t=f[e.type],n;if(t){let e=gm[t];n=op.clone(e.uniforms)}else n=e.uniforms;return n}function y(t,n){let r=u.get(n);return r===void 0?(r=new Lg(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function b(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function x(e){s.remove(e)}function S(){s.dispose()}return{getParameters:m,getProgramCacheKey:h,getUniforms:v,acquireProgram:y,releaseProgram:b,releaseShaderCache:x,programs:l,dispose:S}}function Ug(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function Wg(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Gg(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Kg(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||Wg),r.length>1&&r.sort(t||Gg),i.length>1&&i.sort(t||Gg)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function qg(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new Kg,e.set(t,[i])):n>=r.length?(i=new Kg,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function Jg(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new Q,color:new _d};break;case`SpotLight`:n={position:new Q,direction:new Q,color:new _d,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new Q,color:new _d,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new Q,skyColor:new _d,groundColor:new _d};break;case`RectAreaLight`:n={color:new _d,position:new Q,halfWidth:new Q,halfHeight:new Q}}return e[t.id]=n,n}}}function Yg(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new du};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new du};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new du,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var Xg=0;function Zg(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function Qg(e){let t=new Jg,n=Yg(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new Q);let i=new Q,a=new Iu,o=new Iu;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(Zg);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=$.LTC_FLOAT_1,r.rectAreaLTC2=$.LTC_FLOAT_2):(r.rectAreaLTC1=$.LTC_HALF_1,r.rectAreaLTC2=$.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=Xg++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function $g(e){let t=new Qg(e),n=[],r=[],i=[];function a(e){u.camera=e,n.length=0,r.length=0,i.length=0}function o(e){e.isLightProbeGrid?i.push(e):n.push(e)}function s(e){r.push(e)}function c(){t.setup(n),i.sort((e,t)=>e.priority-t.priority||e.id-t.id)}function l(e){t.setupView(n,e)}let u={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:u,setupLights:c,setupLightsView:l,pushLight:o,pushShadow:s}}function e_(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new $g(e),t.set(n,[a])):r>=i.length?(a=new $g(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var t_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,n_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,r_=[new Q(1,0,0),new Q(-1,0,0),new Q(0,1,0),new Q(0,-1,0),new Q(0,0,1),new Q(0,0,-1)],i_=[new Q(0,-1,0),new Q(0,-1,0),new Q(0,0,1),new Q(0,0,-1),new Q(0,-1,0),new Q(0,-1,0)],a_=new Iu,o_=new Q,s_=new Q;function c_(e,t,n){let r=new Gf,i=new du,a=new du,o=new ju,s=new dp,c=new fp,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new lp({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new du},radius:{value:4}},vertexShader:t_,fragmentShader:n_}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new mf;m.setAttribute(`position`,new Qd(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new Rf(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let _=this.type;this.render=function(t,n,s){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||t.length===0)return;this.type===2&&(Z(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=_!==this.type;p&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){Z(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let m=d.getFrameExtents();i.multiply(m),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/m.x),i.x=a.x*m.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/m.y),i.y=a.y*m.y,d.mapSize.y=a.y));let h=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=h,d.map===null||p===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){Z(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new Nu(i.x,i.y,{format:Hc,type:kc,minFilter:yc,magFilter:yc,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new Xf(i.x,i.y,Oc),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=Rc,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=gc,d.map.depthTexture.magFilter=gc}else l.isPointLight?(d.map=new Tm(i.x),d.map.depthTexture=new Zf(i.x,Dc)):(d.map=new Nu(i.x,i.y),d.map.depthTexture=new Xf(i.x,i.y,Dc)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=Rc,this.type===1?(d.map.depthTexture.compareFunction=h?518:515,d.map.depthTexture.minFilter=yc,d.map.depthTexture.magFilter=yc):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=gc,d.map.depthTexture.magFilter=gc);d.camera.updateProjectionMatrix()}d.map.isWebGLCubeRenderTarget!==!0&&(d.map.width!==i.x||d.map.height!==i.y)&&d.map.setSize(i.x,i.y);let g=d.map.isWebGLCubeRenderTarget?6:d.getViewportCount();l.isPointLight!==!0&&d.updateMatrices(l,s);let _=d.camera.layers.mask&4294967294?d.camera.layers:s.layers;for(let t=0;t<g;t++){let i=d.getCamera(t);if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),o_.setFromMatrixPosition(l.matrixWorld),e.position.copy(o_),s_.copy(e.position),s_.add(r_[t]),e.up.copy(i_[t]),e.lookAt(s_),e.updateMatrixWorld(),n.makeTranslation(-o_.x,-o_.y,-o_.z),a_.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(a_,e.coordinateSystem,e.reversedDepth)}if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),f.viewport(o)}r=d.getFrustum(t),b(n,s,i,l,_,this.type)}d.isPointLightShadow!==!0&&this.type===3&&v(d,s),d.needsUpdate=!1}_=this.type,g.needsUpdate=!1,e.setRenderTarget(c,l,d)};function v(n,r){let a=t.update(h);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,p.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),n.mapPass===null?n.mapPass=new Nu(i.x,i.y,{format:Hc,type:kc}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),f.uniforms.shadow_pass.value=n.map.depthTexture,f.uniforms.resolution.value.set(n.map.width,n.map.height),f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,h,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value.set(n.map.width,n.map.height),p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,p,h,null)}function y(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,x)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function b(n,i,a,o,s,c){if(n.visible===!1)return;if(n.layers.test(s)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&c===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),s=n.material;if(Array.isArray(s)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=s[u.materialIndex];if(d&&d.visible){let t=y(n,d,o,c);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(s.visible){let t=y(n,s,o,c);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let l=n.children;for(let e=0,t=l.length;e<t;e++)b(l[e],i,a,o,s,c)}function x(e){e.target.removeEventListener(`dispose`,x);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function l_(e,t){function n(){let t=!1,n=new ju,r=null,i=new ju(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?ie(e.DEPTH_TEST):ae(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=Ql[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?ie(e.STENCIL_TEST):ae(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c={},l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new _d(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,M=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),N=!1,P=0,F=e.getParameter(e.VERSION);F.indexOf(`WebGL`)===-1?F.indexOf(`OpenGL ES`)!==-1&&(P=parseFloat(/^OpenGL ES (\d)/.exec(F)[1]),N=P>=2):(P=parseFloat(/^WebGL (\d)/.exec(F)[1]),N=P>=1);let I=null,ee={},L=e.getParameter(e.SCISSOR_BOX),te=e.getParameter(e.VIEWPORT),ne=new ju().fromArray(L),R=new ju().fromArray(te);function re(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let z={};z[e.TEXTURE_2D]=re(e.TEXTURE_2D,e.TEXTURE_2D,1),z[e.TEXTURE_CUBE_MAP]=re(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),z[e.TEXTURE_2D_ARRAY]=re(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),z[e.TEXTURE_3D]=re(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),ie(e.DEPTH_TEST),o.setFunc(3),de(!1),fe(1),ie(e.CULL_FACE),le(0);function ie(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function ae(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function oe(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function B(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function se(t){return h!==t&&(e.useProgram(t),h=t,!0)}let ce={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};ce[103]=e.MIN,ce[104]=e.MAX;let V={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function le(t,n,r,i,a,o,s,c,l,u){if(t===0)g===!0&&(ae(e.BLEND),g=!1);else if(g===!1&&(ie(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:Yl(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:Yl(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:Yl(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:Yl(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}}else a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(ce[n],ce[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(V[r],V[i],V[o],V[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function ue(t,n){t.side===2?ae(e.CULL_FACE):ie(e.CULL_FACE);let r=t.side===1;n&&(r=!r),de(r),t.blending===1&&t.transparent===!1?le(0):le(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),me(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?ie(e.SAMPLE_ALPHA_TO_COVERAGE):ae(e.SAMPLE_ALPHA_TO_COVERAGE)}function de(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function fe(t){t===0?ae(e.CULL_FACE):(ie(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function pe(t){t!==k&&(N&&e.lineWidth(t),k=t)}function me(t,n,r){t?(ie(e.POLYGON_OFFSET_FILL),(A!==n||j!==r)&&(A=n,j=r,o.getReversed()&&(n=-n,r=-r),e.polygonOffset(n,r))):ae(e.POLYGON_OFFSET_FILL)}function he(t){t?ie(e.SCISSOR_TEST):ae(e.SCISSOR_TEST)}function ge(t){t===void 0&&(t=e.TEXTURE0+M-1),I!==t&&(e.activeTexture(t),I=t)}function H(t,n,r){r===void 0&&(r=I===null?e.TEXTURE0+M-1:I);let i=ee[r];i===void 0&&(i={type:void 0,texture:void 0},ee[r]=i),(i.type!==t||i.texture!==n)&&(I!==r&&(e.activeTexture(r),I=r),e.bindTexture(t,n||z[t]),i.type=t,i.texture=n)}function _e(){let t=ee[I];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function ve(){try{e.compressedTexImage2D(...arguments)}catch(e){Yl(`WebGLState:`,e)}}function U(){try{e.compressedTexImage3D(...arguments)}catch(e){Yl(`WebGLState:`,e)}}function W(){try{e.texSubImage2D(...arguments)}catch(e){Yl(`WebGLState:`,e)}}function ye(){try{e.texSubImage3D(...arguments)}catch(e){Yl(`WebGLState:`,e)}}function G(){try{e.compressedTexSubImage2D(...arguments)}catch(e){Yl(`WebGLState:`,e)}}function K(){try{e.compressedTexSubImage3D(...arguments)}catch(e){Yl(`WebGLState:`,e)}}function be(){try{e.texStorage2D(...arguments)}catch(e){Yl(`WebGLState:`,e)}}function xe(){try{e.texStorage3D(...arguments)}catch(e){Yl(`WebGLState:`,e)}}function Se(){try{e.texImage2D(...arguments)}catch(e){Yl(`WebGLState:`,e)}}function Ce(){try{e.texImage3D(...arguments)}catch(e){Yl(`WebGLState:`,e)}}function q(t){return d[t]===void 0?e.getParameter(t):d[t]}function we(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function J(t){ne.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),ne.copy(t))}function Te(t){R.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),R.copy(t))}function Ee(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),e.uniformBlockBinding(n,i,i),r.set(t,i))}function De(t,n,r){let i=l.get(n).get(t);c[i]!==r&&(e.bindBufferBase(e.UNIFORM_BUFFER,i,r),c[i]=r)}function Oe(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},I=null,ee={},f={},c={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new _d(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,ne.set(0,0,e.canvas.width,e.canvas.height),R.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:ie,disable:ae,bindFramebuffer:oe,drawBuffers:B,useProgram:se,setBlending:le,setMaterial:ue,setFlipSided:de,setCullFace:fe,setLineWidth:pe,setPolygonOffset:me,setScissorTest:he,activeTexture:ge,bindTexture:H,unbindTexture:_e,compressedTexImage2D:ve,compressedTexImage3D:U,texImage2D:Se,texImage3D:Ce,pixelStorei:we,getParameter:q,updateUBOMapping:Ee,uniformBlockBinding:De,texStorage2D:be,texStorage3D:xe,texSubImage2D:W,texSubImage3D:ye,compressedTexSubImage2D:G,compressedTexSubImage3D:K,scissor:J,viewport:Te,reset:Oe}}function u_(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new du,u=new WeakMap,d=new Set,f,p=new WeakMap,m=new Set,h=new FinalizationRegistry(e=>m.delete(e)),g=!1;try{g=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function _(e,t){return g?new OffscreenCanvas(e,t):Wl(`canvas`)}function v(e,t,n){let r=1,i=be(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);f===void 0&&(f=_(n,a));let o=t?_(n,a):f;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),Z(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&Z(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function y(e){return e.generateMipmaps}function b(t){e.generateMipmap(t)}function x(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function S(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];Z(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||Z(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?Ll:bu.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function C(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,Z(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function w(e,t){return y(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function T(e){let t=new WeakRef(e);r.get(e).__ref=t,m.add(t),h.register(e,t,t)}function E(e){let t=r.get(e).__ref;t!==void 0&&(m.delete(t),h.unregister(t))}function D(e){k(e.target)}function O(e){A(e.target)}function k(e){e.removeEventListener(`dispose`,D),E(e),M(e),e.isVideoTexture&&u.delete(e),e.isHTMLTexture&&d.delete(e)}function A(e){e.removeEventListener(`dispose`,O),E(e),P(e)}function j(){for(let e of m){let t=e.deref();t!==void 0&&(t.isRenderTarget===!0?A(t):k(t))}m.clear(),d.clear()}function M(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=p.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&N(e),Object.keys(i).length===0&&p.delete(n)}r.remove(e)}function N(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=p.get(i);delete a[n.__cacheKey],o.memory.textures--}function P(t){let n=r.get(t);n.__depthDisposeCallback&&n.__depthDisposeCallback();let i=t.depthTexture;if(i&&i.renderTarget===t&&k(i),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let a=t.textures;for(let t=0,n=a.length;t<n;t++){let n=r.get(a[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(a[t])}r.remove(t)}let F=0;function I(){F=0}function ee(){return F}function L(e){F=e}function te(){let e=F;return e>=i.maxTextures&&Z(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+i.maxTextures),F+=1,e}function ne(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.mipmapsAutoUpdate),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function R(t,i){let a=r.get(t);if(t.isVideoTexture&&G(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)Z(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)Z(`WebGLRenderer: Texture marked for update but image is incomplete`);else{ue(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function re(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?ue(a,t,i):(t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i))}function z(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?ue(a,t,i):n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function ie(t,i){let a=r.get(t);t.version>0&&a.__version!==t.version?de(a,t,i):n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let ae={[pc]:e.REPEAT,[mc]:e.CLAMP_TO_EDGE,[hc]:e.MIRRORED_REPEAT},oe={[gc]:e.NEAREST,[_c]:e.NEAREST_MIPMAP_NEAREST,[vc]:e.NEAREST_MIPMAP_LINEAR,[yc]:e.LINEAR,[bc]:e.LINEAR_MIPMAP_NEAREST,[xc]:e.LINEAR_MIPMAP_LINEAR},B={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function se(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&Z(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,ae[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,ae[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,ae[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,oe[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,oe[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,B[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function ce(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,D),T(n));let i=n.source,a=p.get(i);a===void 0&&(a={},p.set(i,a));let s=ne(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&N(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function V(e,t,n){return Math.floor(Math.floor(e/n)/t)}function le(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=V(n.start,r.width,4),c=V(t.start,r.width,4);n.start<=i+1&&a===c&&V(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function ue(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=ce(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=r.get(u);if(u.version!==f.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=bu.getPrimaries(bu.workingColorSpace),r=o.colorSpace===``?null:bu.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=v(o.image,!1,i.maxTextureSize);t=K(o,t);let r=a.convert(o.format,o.colorSpace),p=a.convert(o.type),m=S(o.internalFormat,r,p,o.normalized,o.colorSpace,o.isVideoTexture);se(c,o);let h,g=o.mipmaps,_=o.isVideoTexture!==!0,x=f.__version===void 0||l===!0,T=u.dataReady,E=w(o,t);if(o.isDepthTexture)m=C(o.format===zc,o.type),x&&(_?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,null));else if(o.isDataTexture){if(g.length>0){_&&x&&n.texStorage2D(e.TEXTURE_2D,E,m,g[0].width,g[0].height);for(let t=0,i=g.length;t<i;t++)h=g[t],_?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data);o.generateMipmaps=!1}else _?(x&&n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height),T&&le(o,t,r,p)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){_&&x&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,g[0].width,g[0].height,t.depth);for(let i=0,a=g.length;i<a;i++)if(h=g[i],o.format!==1023){if(r!==null){if(_){if(T){if(o.layerUpdates.size>0){let t=dm(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0)}else Z(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else _?T&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,p,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,p,h.data);o.layerUpdates.size>0&&o.clearLayerUpdates()}else{_&&x&&n.texStorage2D(e.TEXTURE_2D,E,m,g[0].width,g[0].height);for(let t=0,i=g.length;t<i;t++)h=g[t],o.format===1023?_?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data):r===null?Z(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):_?T&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}}else if(o.isDataArrayTexture){if(_){if(x&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,t.width,t.height,t.depth),T){if(o.layerUpdates.size>0){let i=dm(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,p,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,p,t.data)}else if(o.isData3DTexture)_?(x&&n.texStorage3D(e.TEXTURE_3D,E,m,t.width,t.height,t.depth),T&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isFramebufferTexture){if(x){if(_)n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<E;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,p,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),d.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of d)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(g.length>0){if(_&&x){let t=be(g[0]);n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height)}for(let t=0,i=g.length;t<i;t++)h=g[t],_?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,p,h):n.texImage2D(e.TEXTURE_2D,t,m,r,p,h);o.generateMipmaps=!1}else if(_){if(x){let r=be(t);n.texStorage2D(e.TEXTURE_2D,E,m,r.width,r.height)}T&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,p,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,p,t);y(o)&&o.mipmapsAutoUpdate===!0&&b(c),f.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function de(t,o,s){if(o.image.length!==6)return;let c=ce(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=bu.getPrimaries(bu.workingColorSpace),r=o.colorSpace===``?null:bu.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=v(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=K(o,m[e]);let h=m[0],g=a.convert(o.format,o.colorSpace),_=a.convert(o.type),x=S(o.internalFormat,g,_,o.normalized,o.colorSpace),T=o.isVideoTexture!==!0,E=u.__version===void 0||c===!0,D=l.dataReady,O=w(o,h);se(e.TEXTURE_CUBE_MAP,o);let k;if(o.isDepthTexture){if(x=C(o.format===zc,o.type),E){if(T)n.texStorage2D(e.TEXTURE_CUBE_MAP,1,x,h.width,h.height);else for(let t=0;t<6;t++)n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,h.width,h.height,0,g,_,null)}}else if(f){T&&E&&n.texStorage2D(e.TEXTURE_CUBE_MAP,O,x,h.width,h.height);for(let t=0;t<6;t++){k=m[t].mipmaps;for(let r=0;r<k.length;r++){let i=k[r];o.format===1023?T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,x,i.width,i.height,0,g,_,i.data):g===null?Z(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):T?D&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,x,i.width,i.height,0,i.data)}}}else{if(k=o.mipmaps,T&&E){k.length>0&&O++;let t=be(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,O,x,t.width,t.height)}for(let t=0;t<6;t++)if(p){T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,g,_,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,m[t].width,m[t].height,0,g,_,m[t].data);for(let r=0;r<k.length;r++){let i=k[r].image[t].image;T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,x,i.width,i.height,0,g,_,i.data)}}else{T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,g,_,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,g,_,m[t]);for(let r=0;r<k.length;r++){let i=k[r];T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,g,_,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,x,g,_,i.image[t])}}}y(o)&&o.mipmapsAutoUpdate===!0&&b(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function fe(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=S(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),ye(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,W(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function pe(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=C(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;ye(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,W(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,W(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=S(o.internalFormat,c,l,o.normalized,o.colorSpace);ye(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,W(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,W(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function me(t,i,a){let o=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let c=r.get(i.depthTexture);c.__renderTarget=i;let l=o?i.depthTexture.image[0]:i.depthTexture.image;c.__webglTexture&&l.width===i.width&&l.height===i.height||(l.width=i.width,l.height=i.height,i.depthTexture.needsUpdate=!0),o?ie(i.depthTexture,0):R(i.depthTexture,0);let u=c.__webglTexture,d=W(i),f=o?e.TEXTURE_CUBE_MAP_POSITIVE_X+a:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)ye(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)ye(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function he(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)me(i.__webglFramebuffer[e],t,e);else t.texture.mipmaps.length>0?me(i.__webglFramebuffer[0],t,0):me(i.__webglFramebuffer,t,0)}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),pe(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else if(t.texture.mipmaps.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),pe(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}n.bindFramebuffer(e.FRAMEBUFFER,null)}function ge(t,n,i){let a=r.get(t);n!==void 0&&fe(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&he(t)}function H(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,O),T(t);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&ye(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=S(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=W(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),pe(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),se(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)fe(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else fe(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);y(i)?b(e.TEXTURE_CUBE_MAP):i.mipmaps.length>0&&e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MAX_LEVEL,i.mipmaps.length-1),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),se(c,a),fe(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),y(a)&&b(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),se(r,i),i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)fe(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else fe(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);y(i)?b(r):i.mipmaps.length>0&&e.texParameteri(r,e.TEXTURE_MAX_LEVEL,i.mipmaps.length-1),n.unbindTexture()}t.depthBuffer&&he(t)}function _e(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(y(a)&&a.mipmapsAutoUpdate===!0){let t=x(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),b(t),n.unbindTexture()}}}let ve=[];function U(t){if(t.samples>0){if(ye(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer),t.texture.mipmaps.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(ve.length=0,ve.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&ve.push(l),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,ve))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function W(e){return Math.min(i.maxSamples,e.samples)}function ye(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function G(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function K(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(bu.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&Z(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):Yl(`WebGLTextures: Unsupported texture color space:`,n)),t}function be(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=te,this.resetTextureUnits=I,this.getTextureUnits=ee,this.setTextureUnits=L,this.setTexture2D=R,this.setTexture2DArray=re,this.setTexture3D=z,this.setTextureCube=ie,this.rebindTextures=ge,this.setupRenderTarget=H,this.updateRenderTargetMipmap=_e,this.updateMultisampleRenderTarget=U,this.setupDepthRenderbuffer=he,this.setupFrameBufferTexture=fe,this.useMultisampledRTT=ye,this.dispose=j}function d_(e,t){function n(n,r=``){let i,a=bu.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var f_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,p_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,m_=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Qf(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new lp({vertexShader:f_,fragmentShader:p_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Rf(new ep(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},h_=class extends $l{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new m_,g={},_=t.getContextAttributes(),v=null,y=null,b=[],x=[],S=new du,C=null,w=null,T=new qp;T.viewport=new ju;let E=new qp;E.viewport=new ju;let D=[T,E],O=new Qp,k=null,A=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=b[e];return t===void 0&&(t=new fd,b[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=b[e];return t===void 0&&(t=new fd,b[e]=t),t.getGripSpace()},this.getHand=function(e){let t=b[e];return t===void 0&&(t=new fd,b[e]=t),t.getHandSpace()};function j(e){let t=x.indexOf(e.inputSource);if(t===-1)return;let n=b[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function M(){r.removeEventListener(`select`,j),r.removeEventListener(`selectstart`,j),r.removeEventListener(`selectend`,j),r.removeEventListener(`squeeze`,j),r.removeEventListener(`squeezestart`,j),r.removeEventListener(`squeezeend`,j),r.removeEventListener(`end`,M),r.removeEventListener(`inputsourceschange`,N);for(let e=0;e<b.length;e++){let t=x[e];t!==null&&(x[e]=null,b[e].disconnect(t))}k=null,A=null,h.reset();for(let e in g)delete g[e];if(e.setRenderTarget(v),f=null,d=null,u=null,r=null,y=null,L.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),w!==null){let e=w.camera;e.fov=w.fov,e.zoom=w.zoom,e.updateProjectionMatrix(),w=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&Z(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&Z(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(v=e.getRenderTarget(),r.addEventListener(`select`,j),r.addEventListener(`selectstart`,j),r.addEventListener(`selectend`,j),r.addEventListener(`squeeze`,j),r.addEventListener(`squeezestart`,j),r.addEventListener(`squeezeend`,j),r.addEventListener(`end`,M),r.addEventListener(`inputsourceschange`,N),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?zc:Rc,a=_.stencil?Mc:Dc);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new Nu(d.textureWidth,d.textureHeight,{format:Lc,type:Sc,depthTexture:new Xf(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Nu(f.framebufferWidth,f.framebufferHeight,{format:Lc,type:Sc,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),L.setContext(r),L.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function N(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=x.indexOf(n);r>=0&&(x[r]=null,b[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=x.indexOf(n);if(r===-1){for(let e=0;e<b.length;e++)if(e>=x.length){x.push(n),r=e;break}else if(x[e]===null){x[e]=n,r=e;break}if(r===-1)break}let i=b[r];i&&i.connect(n)}}function P(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),O.near=E.near=T.near=t,O.far=E.far=T.far=n,(k!==O.near||A!==O.far)&&(r.updateRenderState({depthNear:O.near,depthFar:O.far}),k=O.near,A=O.far),O.layers.mask=e.layers.mask|6,T.layers.mask=O.layers.mask&-5,E.layers.mask=O.layers.mask&-3;let i=e.parent,a=O.cameras;P(O,i);for(let e=0;e<a.length;e++)P(a[e],i);O.projectionMatrix.copy(T.projectionMatrix),O.projectionMatrixInverse.copy(T.projectionMatrixInverse),w===null&&e.isPerspectiveCamera&&(w={camera:e,fov:e.fov,zoom:e.zoom}),F(e,O,i)};function F(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=nu*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(O)},this.getCameraTexture=function(e){return g[e]};let I=null;function ee(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let i=!1;t.length!==O.cameras.length&&(O.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(y,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(y))}let o=D[n];o===void 0&&(o=new qp,o.layers.enable(n),o.viewport=new ju,D[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(O.matrix.copy(o.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),i===!0&&O.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new Qf,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<b.length;e++){let t=x[e],n=b[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}I&&I(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let L=new pm;L.setAnimationLoop(ee),this.setAnimationLoop=function(e){I=e},this.dispose=function(){}}},g_=new Iu,__=new hu;__.set(-1,0,0,0,1,0,0,0,1);function v_(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,ap(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(g_.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(__),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.diffuseRoughness>0&&(e.diffuseRoughness.value=t.diffuseRoughness,t.diffuseRoughnessMap&&(e.diffuseRoughnessMap.value=t.diffuseRoughnessMap,n(t.diffuseRoughnessMap,e.diffuseRoughnessMapTransform))),t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessMinimum,e.iridescenceThicknessMaximum.value=t.iridescenceThicknessMaximum,t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function y_(e,t,n,r){let i={},a={};function o(e,t){let n=t.program;r.uniformBlockBinding(e,n,i[e.id])}function s(e,n){let o=i[e.id];o===void 0&&(m(e),o=c(e),i[e.id]=o,e.addEventListener(`dispose`,g));let s=n.program;r.updateUBOMapping(e,s);let u=t.render.frame;a[e.id]!==u&&(l(e),a[e.id]=u)}function c(t){let n=e.createBuffer(),r=t.__size,i=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,n),e.bufferData(e.UNIFORM_BUFFER,r,i),e.bindBuffer(e.UNIFORM_BUFFER,null),n}function l(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)u(t[n],e,n,a);else u(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function u(t,n,r,i){if(f(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=h(i,!0);d(i,t.__data,e),e+=a.storage/Float32Array.BYTES_PER_ELEMENT}}else d(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function d(e,t,n){typeof e==`number`||typeof e==`boolean`?t[n]=e:e.isMatrix3?(t[n]=e.elements[0],t[n+1]=e.elements[1],t[n+2]=e.elements[2],t[n+3]=0,t[n+4]=e.elements[3],t[n+5]=e.elements[4],t[n+6]=e.elements[5],t[n+7]=0,t[n+8]=e.elements[6],t[n+9]=e.elements[7],t[n+10]=e.elements[8],t[n+11]=0):ArrayBuffer.isView(e)?t.set(e.subarray(0,t.length-n),n):e.toArray(t,n)}function f(e,t,n,r){let i=e.value,a=t+`_`+n;if(Array.isArray(i)){r[a]===void 0&&(r[a]=[]);let e=r[a],t=!1;for(let n=0;n<i.length;n++)p(i[n],e,n)===!0&&(t=!0);return t}return p(i,r,a)}function p(e,t,n){if(t[n]===void 0)return t[n]=typeof e==`number`||typeof e==`boolean`?e:ArrayBuffer.isView(e)?e.slice():e.clone(),!0;{let r=t[n];if(typeof e==`number`||typeof e==`boolean`){if(r!==e)return t[n]=e,!0}else if(ArrayBuffer.isView(e))return!0;else if(r.equals(e)===!1)return r.copy(e),!0}return!1}function m(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let i=0,a=r.length;i<a;i++){let a=r[i],o=Array.isArray(a.value)?a.value:[a.value],s=Array.isArray(t[e])||Array.isArray(a.value),c=n;for(let e=0,t=o.length;e<t;e++){let t=o[e],r=h(t,s),i=n%16,a=i%r.boundary,l=i+a;n+=a,l!==0&&16-l<r.storage&&(n+=16-l),e===0&&(c=n),n+=r.storage}a.__data=new(a.type===`int`?Int32Array:a.type===`uint`?Uint32Array:Float32Array)((n-c)/Float32Array.BYTES_PER_ELEMENT),a.__offset=c}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function h(e,t){let n={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(n.boundary=4,n.storage=4):e.isVector2?(n.boundary=8,n.storage=8):e.isVector3||e.isColor?(n.boundary=16,n.storage=12):e.isVector4?(n.boundary=16,n.storage=16):e.isMatrix3?(n.boundary=16,n.storage=48):e.isMatrix4?(n.boundary=16,n.storage=64):e.isTexture?Z(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(n.boundary=16,n.storage=e.byteLength):Z(`WebGLRenderer: Unsupported uniform value type.`,e),t===!0&&(n.boundary=16,n.storage=Math.ceil(n.storage/16)*16),n}function g(t){let n=t.target;n.removeEventListener(`dispose`,g),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function _(){for(let t in i)e.deleteBuffer(i[t]);i={},a={}}return{bind:o,update:s,dispose:_}}var b_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),x_=null;function S_(){return x_===null&&(x_=new Vf(b_,16,16,Hc,kc),x_.name=`DFG_LUT`,x_.minFilter=yc,x_.magFilter=yc,x_.wrapS=mc,x_.wrapT=mc,x_.generateMipmaps=!1,x_.needsUpdate=!0),x_}var C_=class{constructor(e={}){let{canvas:t=Gl(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=Sc}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,h=new Set([Wc,Uc,Vc]),g=new Set([Sc,Dc,Tc,Mc,Ac,jc]),_=new Uint32Array(4),v=new Int32Array(4),y={textures:[],min:[],max:[],resolution:[]},b=null,x=null,S=[],C=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let T=this,E=!1,D=null,O=null,k=null,A=null;this._outputColorSpace=Fl;let j=0,M=0,N=null,P=-1,F=null,I=new ju,ee=new ju,L=null,te=new _d(0),ne=0,R=t.width,re=t.height,z=1,ie=null,ae=null,oe=new ju(0,0,R,re),B=new ju(0,0,R,re),se=!1,ce=new Gf,V=new qf,le=!1,ue=!1,de=new Iu,fe=new Q,pe=new ju,me={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},he=!1;function ge(){return N===null?z:1}let H=n;function _e(e,n){return t.getContext(e,n)}let ve,U,W,ye,G,K,be,xe,Se,Ce,q,we,J,Te,Ee,De,Oe,ke,Ae,je,Me,Ne,Pe;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r187`),t.addEventListener(`webglcontextlost`,Le,!1),t.addEventListener(`webglcontextrestored`,Re,!1),t.addEventListener(`webglcontextcreationerror`,ze,!1),H===null){let t=`webgl2`;if(H=_e(t,e),H===null)throw _e(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}Fe()}catch(e){throw t.removeEventListener(`webglcontextlost`,Le,!1),t.removeEventListener(`webglcontextrestored`,Re,!1),t.removeEventListener(`webglcontextcreationerror`,ze,!1),Yl(`WebGLRenderer: `+e.message),e}function Fe(){ve=new Um(H),ve.init(),Me=new d_(H,ve),U=new Cm(H,ve,e,Me),W=new l_(H,ve),U.reversedDepthBuffer&&d&&W.buffers.depth.setReversed(!0),O=H.createFramebuffer(),k=H.createFramebuffer(),A=H.createFramebuffer(),ye=new Km(H),G=new Ug,K=new u_(H,ve,W,G,U,Me,ye),be=new Hm(T),xe=new mm(H),Ne=new xm(H,xe),Se=new Wm(H,xe,ye,Ne),Ce=new Jm(H,Se,xe,Ne,ye),ke=new qm(H,U,K),Ee=new wm(G),q=new Hg(T,be,ve,U,Ne,Ee),we=new v_(T,G),J=new qg,Te=new e_(ve),Oe=new bm(T,be,W,Ce,p,s),De=new c_(T,Ce,U),Pe=new y_(H,ye,U,W),Ae=new Sm(H,ve,ye),je=new Gm(H,ve,ye),ye.programs=q.programs,T.capabilities=U,T.extensions=ve,T.properties=G,T.renderLists=J,T.shadowMap=De,T.state=W,T.info=ye}m!==1009&&(w=new Xm(m,t.width,t.height,o,r,i));let Ie=new h_(T,H);this.xr=Ie,this.getContext=function(){return H},this.getContextAttributes=function(){return H.getContextAttributes()},this.forceContextLoss=function(){let e=ve.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=ve.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return z},this.setPixelRatio=function(e){e!==void 0&&(z=e,this.setSize(R,re,!1))},this.getSize=function(e){return e.set(R,re)},this.setSize=function(e,n,r=!0){Ie.isPresenting?Z(`WebGLRenderer: Can't change size while VR device is presenting.`):(R=e,re=n,t.width=Math.floor(e*z),t.height=Math.floor(n*z),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(R*z,re*z).floor()},this.setDrawingBufferSize=function(e,n,r){R=e,re=n,z=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009)Yl(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);else{if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){Z(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}w.setEffects(e||[])}},this.getCurrentViewport=function(e){return e.copy(I)},this.getViewport=function(e){return e.copy(oe)},this.setViewport=function(e,t,n,r){e.isVector4?oe.set(e.x,e.y,e.z,e.w):oe.set(e,t,n,r),W.viewport(I.copy(oe).multiplyScalar(ge()).round())},this.getScissor=function(e){return e.copy(B)},this.setScissor=function(e,t,n,r){e.isVector4?B.set(e.x,e.y,e.z,e.w):B.set(e,t,n,r),W.scissor(ee.copy(B).multiplyScalar(ge()).round())},this.getScissorTest=function(){return se},this.setScissorTest=function(e){W.setScissorTest(se=e)},this.setOpaqueSort=function(e){ie=e},this.setTransparentSort=function(e){ae=e},this.getClearColor=function(e){return e.copy(Oe.getClearColor())},this.setClearColor=function(){Oe.setClearColor(...arguments)},this.getClearAlpha=function(){return Oe.getClearAlpha()},this.setClearAlpha=function(){Oe.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(N!==null){let t=N.texture.format;e=h.has(t)}if(e){let e=N.texture.type,t=g.has(e),n=Oe.getClearColor(),r=Oe.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(_[0]=i,_[1]=a,_[2]=o,_[3]=r,H.clearBufferuiv(H.COLOR,0,_)):(v[0]=i,v[1]=a,v[2]=o,v[3]=r,H.clearBufferiv(H.COLOR,0,v))}else r|=H.COLOR_BUFFER_BIT}t&&(r|=H.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=H.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&H.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),D=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,Le,!1),t.removeEventListener(`webglcontextrestored`,Re,!1),t.removeEventListener(`webglcontextcreationerror`,ze,!1),Oe.dispose(),J.dispose(),Te.dispose(),K.dispose(),G.dispose(),be.dispose(),Ce.dispose(),Se.dispose(),Ne.dispose(),Pe.dispose(),q.dispose(),Ie.dispose(),Ie.removeEventListener(`sessionstart`,Ke),Ie.removeEventListener(`sessionend`,qe),Je.stop()};function Le(e){e.preventDefault(),ql(`WebGLRenderer: Context Lost.`),E=!0}function Re(){ql(`WebGLRenderer: Context Restored.`),E=!1;let e=ye.autoReset,t=De.enabled,n=De.autoUpdate,r=De.needsUpdate,i=De.type;Fe(),ye.autoReset=e,De.enabled=t,De.autoUpdate=n,De.needsUpdate=r,De.type=i}function ze(e){Yl(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function Be(e){let t=e.target;t.removeEventListener(`dispose`,Be),Ve(t)}function Ve(e){He(e),G.remove(e)}function He(e){let t=G.get(e).programs;t!==void 0&&(t.forEach(function(e){q.releaseProgram(e)}),e.isShaderMaterial&&q.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=me);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=at(e,t,n,r,i);W.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Se.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;Ne.setup(i,r,s,n,c);let h,g=Ae;if(c!==null&&(h=xe.get(c),g=je,g.setIndex(h)),i.isMesh)r.wireframe===!0?(W.setLineWidth(r.wireframeLinewidth*ge()),g.setMode(H.LINES)):g.setMode(H.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),W.setLineWidth(e*ge()),i.isLineSegments?g.setMode(H.LINES):i.isLineLoop?g.setMode(H.LINE_LOOP):g.setMode(H.LINE_STRIP)}else i.isPoints?g.setMode(H.POINTS):i.isSprite&&g.setMode(H.TRIANGLES);if(i.isBatchedMesh){if(ve.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?xe.get(c).bytesPerElement:1,o=G.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(H,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function Ue(e,t,n,r){D!==null&&e.isNodeMaterial&&D.setObject(r,e),le===!0&&Ee.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,tt(e,t,r),e.side=0,e.needsUpdate=!0,tt(e,t,r),e.side=2):tt(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),D!==null&&D.renderStart(e,t,n),x=Te.get(n),x.init(t),C.push(x),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),x.setupLights(),D!==null&&D.updateLights(x.state.lightsArray),ue=this.localClippingEnabled,le=Ee.init(this.clippingPlanes,ue),le===!0&&Ee.setGlobalState(this.clippingPlanes,t),D!==null&&De.render(x.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];Ue(o,n,t,e),r.add(o)}else Ue(i,n,t,e),r.add(i)}}),x=C.pop(),D!==null&&D.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){let t=G.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}ve.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let We=null;function Ge(e){We&&We(e)}function Ke(){Je.stop()}function qe(){Je.start()}let Je=new pm;Je.setAnimationLoop(Ge),typeof self<`u`&&Je.setContext(self),this.setAnimationLoop=function(e){We=e,Ie.setAnimationLoop(e),e===null?Je.stop():Je.start()},Ie.addEventListener(`sessionstart`,Ke),Ie.addEventListener(`sessionend`,qe),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){Yl(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(E===!0)return;D!==null&&D.renderStart(e,t);let n=Ie.enabled===!0&&Ie.isPresenting===!0,r=w!==null&&(N===null||n)&&w.begin(T,N);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),Ie.enabled===!0&&Ie.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(Ie.cameraAutoUpdate===!0&&Ie.updateCamera(t),t=Ie.getCamera()),e.isScene===!0&&e.onBeforeRender(T,e,t,N),x=Te.get(e,C.length),x.init(t),x.state.textureUnits=K.getTextureUnits(),C.push(x),de.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),t.isArrayCamera?V.setFromArrayCamera(t):ce.setFromProjectionMatrix(de,Vl,t.reversedDepth),ue=this.localClippingEnabled,le=Ee.init(this.clippingPlanes,ue),b=J.get(e,S.length),b.init(),S.push(b),this.info.render.frame++,Ie.enabled===!0&&Ie.isPresenting===!0){let e=T.xr.getDepthSensingMesh();e!==null&&Ye(e,t,-1/0,T.sortObjects)}Ye(e,t,0,T.sortObjects),b.finish(),D!==null&&D.updateLights(x.state.lightsArray),T.sortObjects===!0&&b.sort(ie,ae),he=Ie.enabled===!1||Ie.isPresenting===!1||Ie.hasDepthSensing()===!1,he&&Oe.addToRenderList(b,e),this.info.autoReset===!0&&this.info.reset(),le===!0&&Ee.beginShadows();let i=x.state.shadowsArray;if(De.render(i,e,t),le===!0&&Ee.endShadows(),(r&&w.hasRenderPass())===!1){let n=b.opaque,r=b.transmissive;if(x.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];Ze(n,r,e,a)}he&&Oe.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];Xe(b,e,n,n.viewport)}}else r.length>0&&Ze(n,r,e,t),he&&Oe.render(e),Xe(b,e,t)}N!==null&&M===0&&(K.updateMultisampleRenderTarget(N),K.updateRenderTargetMipmap(N)),r&&w.end(T),e.isScene===!0&&e.onAfterRender(T,e,t),Ne.resetDefaultState(),P=-1,F=null,C.pop(),C.length>0?(x=C[C.length-1],K.setTextureUnits(x.state.textureUnits),le===!0&&Ee.setGlobalState(T.clippingPlanes,x.state.camera)):x=null,S.pop(),b=S.length>0?S[S.length-1]:null,D!==null&&D.renderEnd()};function Ye(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLight)x.pushLight(e),e.castShadow&&x.pushShadow(e);else if(e.isSprite){let i=t.isArrayCamera?V:ce;if(!e.frustumCulled||e.intersectsFrustum(i)){r&&pe.setFromMatrixPosition(e.matrixWorld).applyMatrix4(de);let i=Ce.update(e),a=e.material;a.visible&&b.push(e,i,a,n,pe.z,null,t)}}else if(e.isMesh||e.isLine||e.isPoints){let i=t.isArrayCamera?V:ce;if(!e.frustumCulled||e.intersectsFrustum(i)){let i=Ce.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),pe.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),pe.copy(e.boundingSphere.center)),pe.applyMatrix4(e.matrixWorld).applyMatrix4(de)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&b.push(e,i,c,n,pe.z,s,t)}}else a.visible&&b.push(e,i,a,n,pe.z,null,t)}}}let i=e.children;for(let e=0,a=i.length;e<a;e++)Ye(i[e],t,n,r)}function Xe(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;x.setupLightsView(n),le===!0&&Ee.setGlobalState(T.clippingPlanes,n),r&&W.viewport(I.copy(r)),i.length>0&&Qe(i,t,n),a.length>0&&Qe(a,t,n),o.length>0&&Qe(o,t,n),W.buffers.depth.setTest(!0),W.buffers.depth.setMask(!0),W.buffers.color.setMask(!0),W.setPolygonOffset(!1)}function Ze(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(x.state.transmissionRenderTarget[r.id]===void 0){let e=ve.has(`EXT_color_buffer_half_float`)||ve.has(`EXT_color_buffer_float`);x.state.transmissionRenderTarget[r.id]=new Nu(1,1,{generateMipmaps:!0,type:e?kc:Sc,minFilter:xc,samples:Math.max(4,U.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:bu.workingColorSpace})}let a=x.state.transmissionRenderTarget[r.id],o=r.viewport||I;a.setSize(o.z*T.transmissionResolutionScale,o.w*T.transmissionResolutionScale);let s=T.getRenderTarget(),c=T.getActiveCubeFace(),l=T.getActiveMipmapLevel();T.setRenderTarget(a),T.getClearColor(te),ne=T.getClearAlpha(),ne<1&&T.setClearColor(16777215,.5),T.clear(),he&&Oe.render(n);let u=T.toneMapping;T.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),x.setupLightsView(r),le===!0&&Ee.setGlobalState(T.clippingPlanes,r),Qe(e,n,r),K.updateMultisampleRenderTarget(a),K.updateRenderTargetMipmap(a),ve.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,$e(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(K.updateMultisampleRenderTarget(a),K.updateRenderTargetMipmap(a))}T.setRenderTarget(s,c,l),T.setClearColor(te,ne),d!==void 0&&(r.viewport=d),T.toneMapping=u}function Qe(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&$e(o,t,n,s,l,c)}}function $e(e,t,n,r,i,a){D!==null&&i.isNodeMaterial&&D.setObject(e,i),e.onBeforeRender(T,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(T,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=2):T.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(T,t,n,r,i,a)}function et(e){let t=0;for(let n of e)n.texture!==null&&t++;return t}function tt(e,t,n){t.isScene!==!0&&(t=me);let r=G.get(e),i=x.state.lights,a=x.state.shadowsArray,o=i.state.version,s=q.getParameters(e,i.state,a,t,n,x.state.lightProbeGridArray),c=q.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=be.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,Be),l=new Map,r.programs=l,r.programVariants=new Map);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return it(e,s),d}else s.uniforms=q.getUniforms(e),D!==null&&e.isNodeMaterial&&D.build(e,n,s),e.onBeforeCompile(s,T),d=q.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Ee.uniform),it(e,s),r.needsLights=st(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.numLightProbeGrids=et(x.state.lightProbeGridArray),r.currentProgram=d,r.uniformsList=null,d}function nt(e,t,n,r,i){let a=G.get(e),o=a.currentProgram.id+`,`+r+`,`+i,s=a.programVariants.get(o);return s===void 0?(s=tt(e,t,n),a.programVariants.set(o,s)):(a.currentProgram=s,a.uniformsList=null,a.outputColorSpace=r,a.toneMapping=i),s}function rt(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=ag.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function it(e,t){let n=G.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function at(e,t,n,r,i){t.isScene!==!0&&(t=me),K.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=N===null?T.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:bu.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=be.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(h=T.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=G.get(r),b=x.state.lights;if(le===!0&&(ue===!0||e!==F)){let t=e===F&&r.id===P;Ee.setState(r,e,t)}let S=!1,C=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==b.state.version||i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?S=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Ee.numPlanes||v.numIntersection!==Ee.numIntersection)?S=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.morphTargetsCount===_&&v.numLightProbeGrids===et(x.state.lightProbeGridArray)?(v.outputColorSpace!==s||v.toneMapping!==h)&&(C=!0):S=!0:S=!0:(S=!0,v.__version=r.version);let w=v.currentProgram;(S===!0||C===!0)&&(w=C===!0?nt(r,t,i,s,h):tt(r,t,i),D&&r.isNodeMaterial&&D.onUpdateProgram(r,w,v));let E=!1,O=!1,k=!1,A=w.getUniforms(),j=v.uniforms;if(W.useProgram(w.program)&&(E=!0,O=!0,k=!0),r.id!==P&&(P=r.id,O=!0),E||F!==e){W.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),A.setValue(H,`projectionMatrix`,e.projectionMatrix),A.setValue(H,`viewMatrix`,e.matrixWorldInverse);let t=A.map.cameraPosition;t!==void 0&&t.setValue(H,fe.setFromMatrixPosition(e.matrixWorld)),U.logarithmicDepthBuffer&&A.setValue(H,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&A.setValue(H,`isOrthographic`,e.isOrthographicCamera===!0),F!==e&&(F=e,O=!0,k=!0)}if(v.needsLights&&(b.state.sunShadowMap.length>0&&A.setValue(H,`sunShadowMap`,b.state.sunShadowMap,K),b.state.directionalShadowMap.length>0&&A.setValue(H,`directionalShadowMap`,b.state.directionalShadowMap,K),b.state.spotShadowMap.length>0&&A.setValue(H,`spotShadowMap`,b.state.spotShadowMap,K),b.state.pointShadowMap.length>0&&A.setValue(H,`pointShadowMap`,b.state.pointShadowMap,K)),i.isSkinnedMesh){A.setOptional(H,i,`bindMatrix`),A.setOptional(H,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),A.setValue(H,`boneTexture`,e.boneTexture,K))}i.isBatchedMesh&&(A.setOptional(H,i,`batchingTexture`),A.setValue(H,`batchingTexture`,i._matricesTexture,K),A.setOptional(H,i,`batchingIdTexture`),A.setValue(H,`batchingIdTexture`,i._indirectTexture,K),A.setOptional(H,i,`batchingColorTexture`),i._colorsTexture!==null&&A.setValue(H,`batchingColorTexture`,i._colorsTexture,K));let M=n.morphAttributes;if((M.position!==void 0||M.normal!==void 0||M.color!==void 0)&&ke.update(i,n,w),(O||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,A.setValue(H,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(j.envMapIntensity.value=t.environmentIntensity),j.dfgLUT!==void 0&&(j.dfgLUT.value=S_()),O){if(A.setValue(H,`toneMappingExposure`,T.toneMappingExposure),v.needsLights&&ot(j,k),a&&r.fog===!0&&we.refreshFogUniforms(j,a),we.refreshMaterialUniforms(j,r,z,re,x.state.transmissionRenderTarget[e.id]),v.needsLights&&v.numLightProbeGrids>0){let e=y,t=0;for(let n of x.state.lightProbeGridArray)n.texture!==null&&(e.textures[t]=n.texture,e.min[t]=n.boundingBox.min,e.max[t]=n.boundingBox.max,e.resolution[t]=n.resolution,t++);for(let n in e)e[n].length=t;j.probesSH.value=e.textures,j.probesMin.value=e.min,j.probesMax.value=e.max,j.probesResolution.value=e.resolution}ag.upload(H,rt(v),j,K)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(ag.upload(H,rt(v),j,K),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&A.setValue(H,`center`,i.center),A.setValue(H,`modelViewMatrix`,i.modelViewMatrix),A.setValue(H,`normalMatrix`,i.normalMatrix),A.setValue(H,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];Pe.update(n,w),Pe.bind(n,w)}}return w}function ot(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function st(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return j},this.getActiveMipmapLevel=function(){return M},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(e,t,n){let r=G.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),G.get(e.texture).__webglTexture=t,G.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=G.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){N=e,j=t,M=n;let r=null,i=!1,a=!1;if(e){let o=G.get(e);if(o.__useDefaultFramebuffer!==void 0){W.bindFramebuffer(H.FRAMEBUFFER,o.__webglFramebuffer),I.copy(e.viewport),ee.copy(e.scissor),L=e.scissorTest,W.viewport(I),W.scissor(ee),W.setScissorTest(L),P=-1;return}if(o.__webglFramebuffer===void 0)K.setupRenderTarget(e);else if(o.__hasExternalTextures)K.rebindTextures(e,G.get(e.texture).__webglTexture,G.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&G.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);K.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=G.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&K.useMultisampledRTT(e)===!1?G.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,I.copy(e.viewport),ee.copy(e.scissor),L=e.scissorTest}else I.copy(oe).multiplyScalar(z).floor(),ee.copy(B).multiplyScalar(z).floor(),L=se;if(n!==0&&(r=O),W.bindFramebuffer(H.FRAMEBUFFER,r)&&W.drawBuffers(e,r),W.viewport(I),W.scissor(ee),W.setScissorTest(L),i){let r=G.get(e.texture);H.framebufferTexture2D(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=G.get(e.textures[t]);H.framebufferTextureLayer(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=G.get(e.texture);H.framebufferTexture2D(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,t.__webglTexture,n)}P=-1};function ct(e){let t=G.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=U.textureFormatReadable(e.format),t.__typeReadable=U.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){Yl(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=G.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o],Array.isArray(c)&&(c=c[0])),c){W.bindFramebuffer(H.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&H.readBuffer(H.COLOR_ATTACHMENT0+s);let u=ct(o);if(u.__formatReadable===!1){Yl(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){Yl(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&H.readPixels(t,n,r,i,Me.convert(c),Me.convert(l),a)}finally{let e=N===null?null:G.get(N).__webglFramebuffer;W.bindFramebuffer(H.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=G.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o],Array.isArray(c)&&(c=c[0])),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){W.bindFramebuffer(H.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&H.readBuffer(H.COLOR_ATTACHMENT0+s);let d=ct(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=H.createBuffer();H.bindBuffer(H.PIXEL_PACK_BUFFER,f),H.bufferData(H.PIXEL_PACK_BUFFER,a.byteLength,H.STREAM_READ),H.readPixels(t,n,r,i,Me.convert(l),Me.convert(u),0),H.bindBuffer(H.PIXEL_PACK_BUFFER,null);let p=N===null?null:G.get(N).__webglFramebuffer;W.bindFramebuffer(H.FRAMEBUFFER,p);let m=H.fenceSync(H.SYNC_GPU_COMMANDS_COMPLETE,0);return H.flush(),await Zl(H,m,4),H.bindBuffer(H.PIXEL_PACK_BUFFER,f),H.getBufferSubData(H.PIXEL_PACK_BUFFER,0,a),H.bindBuffer(H.PIXEL_PACK_BUFFER,null),H.deleteBuffer(f),H.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;K.setTexture2D(e,0),H.copyTexSubImage2D(H.TEXTURE_2D,n,0,0,o,s,i,a),W.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=Me.convert(t.format),_=Me.convert(t.type),v;t.isData3DTexture?(K.setTexture3D(t,0),v=H.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(K.setTexture2DArray(t,0),v=H.TEXTURE_2D_ARRAY):(K.setTexture2D(t,0),v=H.TEXTURE_2D),W.activeTexture(H.TEXTURE0),W.pixelStorei(H.UNPACK_FLIP_Y_WEBGL,t.flipY),W.pixelStorei(H.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),W.pixelStorei(H.UNPACK_ALIGNMENT,t.unpackAlignment);let y=W.getParameter(H.UNPACK_ROW_LENGTH),b=W.getParameter(H.UNPACK_IMAGE_HEIGHT),x=W.getParameter(H.UNPACK_SKIP_PIXELS),S=W.getParameter(H.UNPACK_SKIP_ROWS),C=W.getParameter(H.UNPACK_SKIP_IMAGES);W.pixelStorei(H.UNPACK_ROW_LENGTH,h.width),W.pixelStorei(H.UNPACK_IMAGE_HEIGHT,h.height),W.pixelStorei(H.UNPACK_SKIP_PIXELS,l),W.pixelStorei(H.UNPACK_SKIP_ROWS,u),W.pixelStorei(H.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=G.get(e),r=G.get(t),h=G.get(n.__renderTarget),g=G.get(r.__renderTarget);W.bindFramebuffer(H.READ_FRAMEBUFFER,h.__webglFramebuffer),W.bindFramebuffer(H.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(H.framebufferTextureLayer(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,G.get(e).__webglTexture,i,d+n),H.framebufferTextureLayer(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,G.get(t).__webglTexture,a,m+n)),H.blitFramebuffer(l,u,l+o,u+s,f,p,f+o,p+s,H.DEPTH_BUFFER_BIT,H.NEAREST);W.bindFramebuffer(H.READ_FRAMEBUFFER,null),W.bindFramebuffer(H.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||G.has(e)){let n=G.get(e),r=G.get(t);W.bindFramebuffer(H.READ_FRAMEBUFFER,k),W.bindFramebuffer(H.DRAW_FRAMEBUFFER,A);for(let e=0;e<c;e++)w?H.framebufferTextureLayer(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):H.framebufferTexture2D(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,n.__webglTexture,i),T?H.framebufferTextureLayer(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):H.framebufferTexture2D(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,r.__webglTexture,a),i===0?T?H.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):H.copyTexSubImage2D(v,a,f,p,l,u,o,s):H.blitFramebuffer(l,u,l+o,u+s,f,p,f+o,p+s,H.COLOR_BUFFER_BIT,H.NEAREST);W.bindFramebuffer(H.READ_FRAMEBUFFER,null),W.bindFramebuffer(H.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?H.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?H.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):H.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?H.texSubImage2D(H.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?H.compressedTexSubImage2D(H.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):H.texSubImage2D(H.TEXTURE_2D,a,f,p,o,s,g,_,h);W.pixelStorei(H.UNPACK_ROW_LENGTH,y),W.pixelStorei(H.UNPACK_IMAGE_HEIGHT,b),W.pixelStorei(H.UNPACK_SKIP_PIXELS,x),W.pixelStorei(H.UNPACK_SKIP_ROWS,S),W.pixelStorei(H.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps===!0&&t.mipmapsAutoUpdate===!0&&H.generateMipmap(v),W.unbindTexture()},this.initRenderTarget=function(e){G.get(e).__webglFramebuffer===void 0&&K.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?K.setTextureCube(e,0):e.isData3DTexture?K.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?K.setTexture2DArray(e,0):K.setTexture2D(e,0),W.unbindTexture()},this.resetState=function(){j=0,M=0,N=null,W.reset(),Ne.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return Vl}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=bu._getDrawingBufferColorSpace(e),t.unpackColorSpace=bu._getUnpackColorSpace()}},w_=`
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
}
float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 5; i++){ v += a*vnoise(p); p *= 2.03; a *= .5; } return v; }
`,T_=`
uniform sampler2D uPrev;
uniform vec2 uA;        // previous pointer (px)
uniform vec2 uB;        // current pointer (px)
uniform vec2 uRes;
uniform float uRadius;
uniform float uStrength;
uniform float uDecay;
uniform float uTime;
varying vec2 vUv;
${w_}
float seg(vec2 p, vec2 a, vec2 b){ vec2 pa = p-a, ba = b-a; float h = clamp(dot(pa,ba)/max(dot(ba,ba),1e-4), 0., 1.); return length(pa - ba*h); }
void main(){
  vec2 px = vUv * uRes;
  float prev = texture2D(uPrev, vUv).r;
  // ragged bristle edge
  float wob = (fbm(px * .012 + uTime * .4) - .5) * uRadius * .9;
  float d = seg(px, uA, uB) + wob;
  float stroke = smoothstep(uRadius, uRadius * .25, d) * uStrength;
  float v = max(prev * uDecay, stroke);
  // wet paint slowly creeps outward
  gl_FragColor = vec4(v, 0., 0., 1.);
}`,E_=`varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy * 2., 0., 1.); }`,D_=`
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,O_=`
uniform sampler2D uTex;
uniform sampler2D uMask;
uniform vec2 uImg;
uniform vec2 uSize;
uniform vec2 uRes;
uniform float uTime;
uniform float uBoil;
uniform float uDraw;
uniform float uBloom;
uniform vec2 uSeed;
uniform float uHover;
uniform float uDeckle;
uniform vec3 uLens;     // device-px x, y (bottom-left origin), radius
uniform float uLensOn;
uniform float uInk;
uniform float uAlpha;
varying vec2 vUv;
${w_}
vec2 cover(vec2 uv){
  float rs = uSize.x/uSize.y, ri = uImg.x/uImg.y;
  vec2 s = rs < ri ? vec2(rs/ri, 1.) : vec2(1., ri/rs);
  return (uv - .5) * s + .5;
}
float lum(vec3 c){ return dot(c, vec3(.299, .587, .114)); }
void main(){
  vec2 px = vUv * uSize;
  // hand-drawn line boil: jitter the sampling a little, changing 8 times a second
  vec2 boil = (vec2(vnoise(px*.05 + uBoil*17.), vnoise(px*.05 - uBoil*13.)) - .5) * 1.6 / uSize;
  vec2 uv = cover(vUv + boil);
  vec3 color = texture2D(uTex, uv).rgb;

  // ---- pencil sketch from the painting ----
  vec2 t = 1.4 / uImg;
  float l00 = lum(texture2D(uTex, uv + t*vec2(-1,-1)).rgb), l10 = lum(texture2D(uTex, uv + t*vec2(0,-1)).rgb), l20 = lum(texture2D(uTex, uv + t*vec2(1,-1)).rgb);
  float l01 = lum(texture2D(uTex, uv + t*vec2(-1, 0)).rgb),                                                    l21 = lum(texture2D(uTex, uv + t*vec2(1, 0)).rgb);
  float l02 = lum(texture2D(uTex, uv + t*vec2(-1, 1)).rgb), l12 = lum(texture2D(uTex, uv + t*vec2(0, 1)).rgb), l22 = lum(texture2D(uTex, uv + t*vec2(1, 1)).rgb);
  float gx = -l00 - 2.*l01 - l02 + l20 + 2.*l21 + l22;
  float gy = -l00 - 2.*l10 - l20 + l02 + 2.*l12 + l22;
  float edge = smoothstep(.12, .55, length(vec2(gx, gy)));
  float L = lum(color);
  // hand-drawn cross hatching: thin, wavy, broken strokes; darker tones add directions
  vec2 sp = px;
  float wav = vnoise(sp * .015 + uBoil * .3) * 7.;
  float P = 8.;
  float d1 = abs(fract((sp.x + sp.y + wav) / P) - .5) * P;
  float d2 = abs(fract((sp.x - sp.y - wav) / (P * .9)) - .5) * P * .9;
  float d3 = abs(fract((sp.y + wav * .6) / (P * .7)) - .5) * P * .7;
  float brk1 = smoothstep(.25, .45, vnoise(vec2(sp.x - sp.y, sp.x + sp.y) * vec2(.02, .25)));
  float brk2 = smoothstep(.25, .45, vnoise(vec2(sp.x + sp.y, sp.x - sp.y) * vec2(.02, .25) + 7.));
  float h1 = (1. - smoothstep(.35, 1.15, d1)) * smoothstep(.6, .32, L) * brk1;
  float h2 = (1. - smoothstep(.35, 1.1, d2)) * smoothstep(.4, .14, L) * brk2;
  float h3 = (1. - smoothstep(.3, 1., d3)) * smoothstep(.16, .03, L);
  float grain = vnoise(gl_FragCoord.xy * .9) * .35 + vnoise(gl_FragCoord.xy * .12) * .25;
  float shade = smoothstep(.85, .15, L) * .12;   // soft graphite smudge under the hatching
  float graphite = clamp(edge * .9 + (h1 * .55 + h2 * .5 + h3 * .45) * (.7 + grain) + shade, 0., 1.);
  // draw-in: strokes appear along a noisy front
  float front = fbm(px * .006) * .55 + vUv.x * .3 + (1. - vUv.y) * .15;
  graphite *= smoothstep(front, front + .08, uDraw * 1.15);
  vec3 paper = vec3(.953, .937, .906);
  vec3 lead = vec3(.17, .165, .16);
  vec3 sketch = mix(paper, lead, graphite * .92 * uInk);

  // ---- paint: cursor mask + auto bloom, with watercolor bleed ----
  float m = texture2D(uMask, gl_FragCoord.xy / uRes).r;
  vec2 a = vec2(uSize.x/uSize.y, 1.);
  float bloomD = distance(vUv * a, uSeed * a);
  float bloom = smoothstep(uBloom * 1.9, uBloom * 1.9 - .25, bloomD + (fbm(px*.01 + 3.) - .5) * .5);
  float lensD = distance(gl_FragCoord.xy, uLens.xy) / max(uLens.z, 1.);
  float lens = smoothstep(1., .45, lensD + (fbm(gl_FragCoord.xy * .006 + uTime * .15) - .5) * .5) * uLensOn;
  float wet = max(bloom * step(.001, uBloom), lens) + m * 0.;
  float n = fbm(px * .008 + vec2(uTime * .03, 0.));
  float thr = wet + (n - .5) * .55;
  float paintAmt = smoothstep(.42, .5, thr);
  // pigment pools at the edge of each wash
  float rim = smoothstep(.0, .09, thr - .42) * smoothstep(.2, .09, thr - .42);
  vec3 wash = color * mix(1., .78, rim) ;
  wash = mix(wash, wash * (.92 + .16 * fbm(px * .03)), .6);   // granulation
  vec3 col = mix(sketch, wash, paintAmt);
  // keep pencil lines faintly visible over fresh paint
  col = mix(col, col * (1. - edge * .35), paintAmt * (1. - uBloom));

  // deckled paper edge
  vec2 q = abs(vUv - .5) * 2.;
  float ragged = (fbm(px * .03) - .5) * .02 * uDeckle;
  float box = smoothstep(1., .995, max(q.x * (1. + ragged), q.y * (1. + ragged * uSize.x/uSize.y)));
  gl_FragColor = vec4(col, box * uAlpha);
}`;function k_(e){let t=new C_({canvas:e,antialias:!0,alpha:!0}),n=Math.min(window.devicePixelRatio,2);t.setPixelRatio(n);let r=new yd,i=new Jp(-1,1,1,-1,-1e3,1e3),a=new zp,o=new ep(1,1),s=[],c=1,l=1,u=.5,d={type:kc,minFilter:yc,magFilter:yc,depthBuffer:!1},f=new Nu(2,2,d),p=new Nu(2,2,d),m=new yd,h=new lp({vertexShader:E_,fragmentShader:T_,uniforms:{uPrev:{value:null},uA:{value:new du(-999,-999)},uB:{value:new du(-999,-999)},uRes:{value:new du(1,1)},uRadius:{value:60},uStrength:{value:0},uDecay:{value:.996},uTime:{value:0}}});m.add(new Rf(new ep(1,1),h));function g(){c=window.innerWidth,l=window.innerHeight,t.setSize(c,l,!1),Object.assign(i,{left:-c/2,right:c/2,top:l/2,bottom:-l/2}),i.updateProjectionMatrix(),f.setSize(Math.ceil(c*u),Math.ceil(l*u)),p.setSize(Math.ceil(c*u),Math.ceil(l*u)),h.uniforms.uRes.value.set(c*u,l*u)}g(),window.addEventListener(`resize`,g);let _={x:-999,y:-999,px:-999,py:-999,active:!1,size:1,last:0};window.addEventListener(`pointermove`,e=>{_.x=e.clientX,_.y=e.clientY,_.active=!0,_.last=performance.now()},{passive:!0}),document.addEventListener(`pointerleave`,()=>{_.active=!1});function v(e,{bloomSeed:t=[.5,.5],deckle:n=1,rectSize:i=!1,ink:d=1}={}){let f={uTex:{value:null},uMask:{value:null},uImg:{value:new du(1,1)},uSize:{value:new du(1,1)},uRes:{value:new du(c*u,l*u)},uTime:{value:0},uBoil:{value:0},uDraw:{value:0},uBloom:{value:0},uSeed:{value:new du(...t)},uHover:{value:0},uDeckle:{value:n},uLens:{value:new Q(-9999,-9999,1)},uLensOn:{value:0},uInk:{value:d},uAlpha:{value:1}},p=new Rf(o,new lp({vertexShader:D_,fragmentShader:O_,uniforms:f,transparent:!0}));p.visible=!1,r.add(p);let m={img:e,mesh:p,uniforms:f,ready:!1,rectSize:i};return a.load(e.currentSrc||e.src,t=>{t.colorSpace=Fl,f.uTex.value=t,f.uImg.value.set(t.image.width,t.image.height),m.ready=!0,e.style.opacity=`0`,e.dispatchEvent(new Event(`paint:ready`))}),s.push(m),m}let y=performance.now();function b(){let e=performance.now(),n=(e-y)/1e3,a=h.uniforms;_.active&&e-_.last;let o=Math.hypot(_.x-_.px,_.y-_.py);a.uA.value.set(_.px*u,(l-_.py)*u),a.uB.value.set(_.x*u,(l-_.y)*u),a.uRadius.value=(42+Math.min(o,80)*.5)*_.size*u*2,a.uStrength.value=0,a.uTime.value=n,a.uPrev.value=f.texture,t.setRenderTarget(p),t.render(m,i),t.setRenderTarget(null),[f,p]=[p,f],_.px=_.x,_.py=_.y;let d=Math.floor(n*8);for(let e of s){if(!e.ready)continue;let t=e.img.getBoundingClientRect(),r=e.img.closest(`.paint`)||e.img,i=parseFloat(getComputedStyle(r).opacity),a=t.bottom>-80&&t.top<l+80&&t.width>0&&i>.01;if(e.mesh.visible=a,!a)continue;let o=e.rectSize?t.width:e.img.offsetWidth,s=e.rectSize?t.height:e.img.offsetHeight,p=e.img.closest(`.paint__frame`)||e.img,m=new DOMMatrixReadOnly(getComputedStyle(p).transform===`none`?void 0:getComputedStyle(p).transform),h=Math.atan2(m.b,m.a);e.mesh.scale.set(o,s,1),e.mesh.rotation.z=-h,e.mesh.position.set(t.left+t.width/2-c/2,l/2-(t.top+t.height/2),0);let g=e.uniforms;g.uSize.value.set(o,s),g.uAlpha.value=i,g.uRes.value.set(c*u,l*u),g.uTime.value=n,g.uBoil.value=d,g.uMask.value=f.texture}t.render(r,i)}return t.setAnimationLoop(b),{add:v,items:s,brush:_,dpr:n,setDecay(e){h.uniforms.uDecay.value=e}}}var A_=1024,j_=1400,M_=j_/A_,N_=[.1,.27,.8,.6],P_=`
uniform float uT;      // 0 = lying on the right, 1 = turned to the left
uniform float uZ;
uniform float uH;
varying vec2 vUv;
varying float vShade;
varying float vX;
void main(){
  vUv = uv;
  float x = position.x;                       // 0 at the spine, 1 at the outer edge
  float yN = position.y / uH;                 // -0.5 .. 0.5
  float s = sin(3.14159 * uT);
  float K = s * (1.15 + yN * 0.7);            // bend, stronger toward the top corner so it leads
  float a = 3.14159 * uT + 0.5 * K;
  float b = max(K, 1e-4);
  float X = (sin(a) - sin(a - b * x)) / b;
  float Z = (cos(a - b * x) - cos(a)) / b;
  float theta = a - b * x;
  vShade = 0.74 + 0.26 * abs(cos(theta));
  vX = x;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(X, position.y - 0.04, Z + uZ, 1.0);
}`,F_=`
uniform sampler2D uFront, uBack, uImg;
uniform vec4 uRect;
uniform vec2 uImgSize;
uniform float uPaint, uHasArt, uTime;
varying vec2 vUv;
varying float vShade;
varying float vX;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 4; i++){ v += a*vnoise(p); p *= 2.03; a *= .5; } return v; }
float lum(vec3 c){ return dot(c, vec3(.299, .587, .114)); }
vec2 cover(vec2 uv){ float rr = (uRect.z * 1.) / (uRect.w * ${M_.toFixed(4)}), ri = uImgSize.x / uImgSize.y;
  vec2 s = rr < ri ? vec2(rr/ri, 1.) : vec2(1., ri/rr); return (uv - .5) * s + .5; }
vec3 art(vec2 iuv){
  vec2 uv = cover(iuv);
  vec3 color = texture2D(uImg, uv).rgb;
  vec2 t = 1.3 / uImgSize;
  float l00 = lum(texture2D(uImg, uv + t*vec2(-1,-1)).rgb), l20 = lum(texture2D(uImg, uv + t*vec2(1,-1)).rgb);
  float l02 = lum(texture2D(uImg, uv + t*vec2(-1, 1)).rgb), l22 = lum(texture2D(uImg, uv + t*vec2(1, 1)).rgb);
  float l10 = lum(texture2D(uImg, uv + t*vec2(0,-1)).rgb), l12 = lum(texture2D(uImg, uv + t*vec2(0, 1)).rgb);
  float l01 = lum(texture2D(uImg, uv + t*vec2(-1, 0)).rgb), l21 = lum(texture2D(uImg, uv + t*vec2(1, 0)).rgb);
  float gx = -l00 - 2.*l01 - l02 + l20 + 2.*l21 + l22, gy = -l00 - 2.*l10 - l20 + l02 + 2.*l12 + l22;
  float edge = smoothstep(.12, .55, length(vec2(gx, gy)));
  float L = lum(color);
  vec2 px = iuv * vec2(820., 840.);
  float wav = vnoise(px * .02) * 6.;
  float d1 = abs(fract((px.x + px.y + wav) / 7.) - .5) * 7.;
  float d2 = abs(fract((px.x - px.y - wav) / 6.3) - .5) * 6.3;
  float h1 = (1. - smoothstep(.35, 1.1, d1)) * smoothstep(.6, .32, L) * smoothstep(.25, .45, vnoise(vec2(px.x - px.y, px.x + px.y) * vec2(.02, .25)));
  float h2 = (1. - smoothstep(.35, 1.1, d2)) * smoothstep(.4, .14, L);
  float graphite = clamp(edge * .9 + (h1 * .55 + h2 * .5) * (.75 + vnoise(px * .9) * .4) + smoothstep(.85, .15, L) * .1, 0., 1.);
  vec3 sketch = mix(vec3(.965, .945, .905), vec3(.17, .165, .16), graphite * .9);
  // watercolour bloom from the middle of the drawing
  float n = fbm(iuv * 6. + 2.);
  float wet = smoothstep(uPaint * 1.7, uPaint * 1.7 - .3, distance(iuv, vec2(.5, .48)) + (n - .5) * .45);
  float paintAmt = smoothstep(.42, .52, wet + (fbm(iuv * 9. + uTime * .05) - .5) * .4) * step(.001, uPaint);
  float rim = smoothstep(.0, .08, wet - .42) * smoothstep(.2, .08, wet - .42);
  vec3 wash = color * mix(1., .8, rim);
  return mix(sketch, wash, paintAmt);
}
void main(){
  vec3 col;
  if (gl_FrontFacing) {
    col = texture2D(uFront, vUv).rgb;
  } else {
    vec2 uv = vec2(1. - vUv.x, vUv.y);           // the back of a leaf is mirrored
    col = texture2D(uBack, uv).rgb;
    vec2 iuv = (uv - uRect.xy) / uRect.zw;
    if (uHasArt > .5 && iuv.x > 0. && iuv.y > 0. && iuv.x < 1. && iuv.y < 1.) col = art(iuv);
  }
  float gutter = mix(.74, 1., smoothstep(0., .1, vX));     // shading into the spine
  col *= vShade * gutter;
  gl_FragColor = vec4(col, 1.);
}`;function I_(e,{margin:t=!0}={}){e.fillStyle=`#f7f2e7`,e.fillRect(0,0,A_,j_),e.fillStyle=`rgba(42,40,38,.13)`;for(let t=26;t<j_;t+=34)for(let n=26;n<A_;n+=34)e.beginPath(),e.arc(n,t,1.6,0,7),e.fill();t&&(e.fillStyle=`rgba(214,74,46,.4)`,e.fillRect(84,0,2,j_));for(let t=0;t<2600;t++)e.fillStyle=`rgba(90,80,60,${Math.random()*.05})`,e.fillRect(Math.random()*A_,Math.random()*j_,2,2)}function L_(e,t,n){let r=String(t).split(` `),i=[],a=``;for(let t of r){let r=a?`${a} ${t}`:t;e.measureText(r).width>n&&a?(i.push(a),a=t):a=r}return a&&i.push(a),i}var R_=e=>{let t=new Yf(e);return t.colorSpace=Fl,t.anisotropy=8,t};function z_(e){let t=document.createElement(`canvas`);t.width=A_,t.height=j_;let n=t.getContext(`2d`);I_(n),n.textBaseline=`alphabetic`,n.fillStyle=`#6e6a64`,n.font=`500 44px Caveat`,n.textAlign=`right`,n.fillText(e.pageNo,954,90),n.textAlign=`left`;let r=230;n.fillStyle=`#d64a2e`,n.font=`600 56px Caveat`,n.fillText(e.kicker,130,r),r+=40,n.fillStyle=`#2a2826`,n.font=`400 ${e.titleSize||132}px "Instrument Serif"`;for(let t of L_(n,e.title,800))r+=(e.titleSize||132)*.9,n.fillText(t,126,r);if(r+=96,e.lede){n.font=`400 60px "Instrument Serif"`;for(let t of L_(n,e.lede,780))n.fillText(t,130,r),r+=66;r+=18}if(e.tags){n.font=`600 50px Caveat`;let t=130;e.tags.forEach((e,i)=>{let a=n.measureText(e).width;t+a>934&&(t=130,r+=70),n.fillStyle=`#2a2826`,n.fillText(e,t,r),i===0&&(n.strokeStyle=`#d64a2e`,n.lineWidth=3.5,n.beginPath(),n.ellipse(t+a/2,r-16,a/2+22,40,-.05,.3,6.6),n.stroke()),t+=a+52}),r+=84}n.fillStyle=`#4b4740`,n.font=`400 37px Geist`;for(let t of L_(n,e.desc,780))n.fillText(t,130,r),r+=58;if(e.facts){r+=20;for(let[t,i]of e.facts)n.fillStyle=`#2a44d4`,n.font=`600 50px Caveat`,n.fillText(t,130,r),n.fillStyle=`#4b4740`,n.font=`400 34px Geist`,n.fillText(i,400,r),n.strokeStyle=`rgba(42,40,38,.18)`,n.setLineDash([6,8]),n.beginPath(),n.moveTo(130,r+22),n.lineTo(880,r+22),n.stroke(),n.setLineDash([]),r+=76}return e.note&&(n.save(),n.translate(130,Math.max(r+60,1100)),n.rotate(-.035),n.fillStyle=`#2a44d4`,n.font=`500 54px Caveat`,L_(n,e.note,760).forEach((e,t)=>n.fillText(e,0,t*58)),n.restore()),e.big&&(n.fillStyle=`#2a44d4`,n.font=`700 76px Caveat`,n.fillText(e.big,130,1230),n.strokeStyle=`#d64a2e`,n.lineWidth=4,n.beginPath(),n.moveTo(126,1255),n.bezierCurveTo(400,1240,600,1270,900,1250),n.stroke()),R_(t)}function B_(e,t){let n=document.createElement(`canvas`);n.width=A_,n.height=j_;let r=n.getContext(`2d`);I_(r,{margin:!1});let[i,a,o,s]=N_,c=i*A_,l=o*A_,u=(1-a-s)*j_,d=s*j_;return r.fillStyle=`rgba(42,40,38,.18)`,r.fillRect(c+10,u+14,l,d),r.strokeStyle=`rgba(42,40,38,.55)`,r.lineWidth=2,r.beginPath(),r.moveTo(c-6,u-4),r.lineTo(c+l+5,u-7),r.lineTo(c+l+7,u+d+5),r.lineTo(c-4,u+d+7),r.closePath(),r.stroke(),r.fillStyle=`rgba(236,216,160,.85)`,[[c+40,u-22,-.12],[c+l-170,u-18,.1]].forEach(([e,t,n])=>{r.save(),r.translate(e,t),r.rotate(n),r.fillRect(0,0,140,40),r.restore()}),r.fillStyle=`#2a2826`,r.font=`600 56px Caveat`,r.fillText(e,c,u+d+100),r.fillStyle=`#6e6a64`,r.font=`500 44px Caveat`,r.fillText(t,70,90),R_(n)}async function V_(e,t){let n=new C_({canvas:e,antialias:!0,alpha:!0});n.setPixelRatio(Math.min(devicePixelRatio,2));let r=new yd,i=new qp(30,1,.1,50),a=new ud;a.rotation.x=-.42,r.add(a);let o=new zp,s=e=>new Promise(t=>o.load(e,e=>{e.colorSpace=Fl,t(e)})),c=document.createElement(`canvas`);c.width=c.height=256;let l=c.getContext(`2d`),u=l.createRadialGradient(128,128,20,128,128,128);u.addColorStop(0,`rgba(40,30,20,.45)`),u.addColorStop(1,`rgba(40,30,20,0)`),l.fillStyle=u,l.fillRect(0,0,256,256);let d=new Rf(new ep(3.1,M_*1.6),new Ef({map:new Yf(c),transparent:!0,depthWrite:!1}));d.position.set(0,-.04,-.03),a.add(d);let f=t.length,p=t.map(e=>z_(e.text)),m=await Promise.all(t.map(async e=>({page:B_(e.art.caption,e.art.pageNo),img:await s(e.art.src)}))),h=new ep(1,M_,48,8);h.translate(.5,0,0);let g=p[0],_=[],v=(e,t,n)=>{let r={uT:{value:0},uZ:{value:n},uH:{value:M_},uFront:{value:e||g},uBack:{value:t?.page||g},uImg:{value:t?.img||g},uImgSize:{value:new du(t?.img.image.width||1,t?.img.image.height||1)},uRect:{value:new ju(...N_)},uPaint:{value:0},uHasArt:{value:+!!t},uTime:{value:0}},i=new Rf(h,new lp({uniforms:r,vertexShader:P_,fragmentShader:F_,side:2}));return a.add(i),{mesh:i,u:r}};v(p[f-1],null,0);let y=v(p[0],m[0],0);y.u.uT.value=1;for(let e=0;e<f-1;e++)_.push(v(p[e],m[e+1],0));let b=e=>e===0?y.u:_[e-1].u;function x(){let t=e.clientWidth,r=e.clientHeight;n.setSize(t,r,!1),i.aspect=t/r;let a=2.75/(2*Math.tan(i.fov*Math.PI/360)*i.aspect),o=M_*1.42/(2*Math.tan(i.fov*Math.PI/360));i.position.set(0,0,Math.max(a,o)),i.updateProjectionMatrix()}x(),addEventListener(`resize`,x);let S=new du;addEventListener(`pointermove`,e=>S.set(e.clientX/innerWidth*2-1,e.clientY/innerHeight*2-1));let C=0;return{count:f,artOf:b,set(e){C=e},paint(e,t=1,n=2.4){return{uniform:b(e).uPaint,to:t,dur:n}},painted:new Set,render(e){let t=f-1;_.forEach((n,r)=>{let i=Math.min(1,Math.max(0,C-r)),a=i*i*(3-2*i);n.u.uT.value=a,n.u.uZ.value=(1-a)*(t-r)*.004+a*(r+1)*.004+.002,n.u.uTime.value=e}),y.u.uTime.value=e,a.rotation.y+=(S.x*.09-a.rotation.y)*.05,a.rotation.x+=(-.42+S.y*.05-a.rotation.x)*.05,n.render(r,i)},resize:x}}Si.registerPlugin(X);var H_=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,U_=window.matchMedia(`(pointer: fine)`).matches,W_=e=>String(e).replace(/[&<>"]/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`})[e]),G_=e=>`paint/${e}.webp`,K_={circle:`<svg class="doodle" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M10 20 C 8 7, 52 1, 88 9 C 101 13, 99 33, 60 37 C 28 40, 2 33, 9 18 C 13 10, 30 6, 42 6"/></svg>`,underline:`<svg class="doodle underline" viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true"><path d="M2 8 C 26 2, 58 12, 98 4"/></svg>`,under2:`<svg class="doodle" viewBox="0 0 100 18" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M2 9 C 30 3, 62 14, 98 6 M 8 15 C 40 10, 70 16, 94 12"/></svg>`,arrowDown:`<svg class="doodle" viewBox="0 0 120 60" aria-hidden="true"><path pathLength="1" d="M4 8 C 40 2, 86 12, 100 50 M100 50 L 88 42 M100 50 L 104 36"/></svg>`,arrowRight:`<svg class="doodle" viewBox="0 0 70 44" aria-hidden="true"><path pathLength="1" d="M4 30 C 20 6, 44 4, 62 18 M62 18 L 50 18 M62 18 L 58 7"/></svg>`,navCircle:`<svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path d="M12 22 C 9 8, 55 2, 88 10 C 100 14, 97 33, 58 36 C 26 39, 4 32, 10 17 C 14 10, 30 7, 40 7"/></svg>`,bulb:`<svg class="doodle" viewBox="0 0 200 220" aria-hidden="true"><path pathLength="1" d="M100 20 C 50 20, 30 60, 40 95 C 48 122, 72 132, 74 160 L 126 160 C 128 132, 152 122, 160 95 C 170 60, 150 20, 100 20 Z M78 175 L 122 175 M82 190 L 118 190 M92 205 L 108 205 M100 160 L 100 110 C 100 95, 84 90, 84 102 C 84 114, 116 114, 116 102 C 116 90, 100 95, 100 110 M30 30 L 14 16 M170 30 L 186 16 M100 6 L 100 -10 M18 95 L 0 95 M182 95 L 200 95"/></svg>`,gears:`<svg class="doodle" viewBox="0 0 220 200" aria-hidden="true"><path pathLength="1" d="M80 60 m-40 0 a40 40 0 1 0 80 0 a40 40 0 1 0 -80 0 M80 60 m-14 0 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0 M80 8 L80 20 M80 100 L80 112 M28 60 L40 60 M120 60 L132 60 M44 24 L52 32 M108 88 L116 96 M44 96 L52 88 M108 32 L116 24 M160 140 m-30 0 a30 30 0 1 0 60 0 a30 30 0 1 0 -60 0 M160 140 m-10 0 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0 M160 100 L160 110 M160 170 L160 180 M120 140 L130 140 M190 140 L200 140"/></svg>`,envelope:`<svg class="doodle" viewBox="0 0 220 160" aria-hidden="true"><path pathLength="1" d="M20 30 L200 30 L200 140 L20 140 Z M20 30 L110 95 L200 30 M20 140 L85 80 M200 140 L135 80 M150 10 C 170 -4, 196 10, 186 26"/></svg>`},q_={"bloom-chat":`seven modes, one thread. every row sealed before it touches disk!`,artbloom:`type one sentence, get a painting. a bit like this site…`,autogpt:`my PR shipped in beta v0.6.70 ✓`,n8n:`automate the boring stuff, keep the fun stuff`,"shreyash-code":`python for everything else`};document.querySelector(`#app`).innerHTML=`
  <header class="nav">
    <a class="nav__logo" href="#top" aria-label="Shreyash Mishra, back to top">Shreyash.</a>
    <nav class="nav__links" aria-label="Sections">
      <a href="#work">work${K_.navCircle}</a>
      <a href="#toolbox">toolbox${K_.navCircle}</a>
      <a href="#certificates">certificates${K_.navCircle}</a>
      <a href="#contact">say hi${K_.navCircle}</a>
    </nav>
  </header>

  <div class="progress" aria-hidden="true"><svg viewBox="0 0 14 100" preserveAspectRatio="none"><path pathLength="1" d="M7 0 C 2 10, 12 20, 7 30 C 2 40, 12 50, 7 60 C 2 70, 12 80, 7 90 L 7 100"/></svg></div>

  <main id="top">
    <section class="hero" aria-label="Introduction">
      <div class="hero__stage">
        <figure class="hero__art paint"><img data-paint data-hero data-seed="0.5,0.5" src="${G_(`desk`)}" alt="Pencil sketch of a developer's desk that turns into a painting" /></figure>
        <div class="hero__copy">
          <p class="hero__kicker hand hand--red write" data-write>hello! my name is</p>
          <h1 aria-label="${W_(fc.name)} ${W_(fc.surname)}"><span class="split-line"><span class="rise">${W_(fc.name)}</span></span><span class="split-line"><span class="rise"><em>${W_(fc.surname)}</em></span></span></h1>
          <p class="hero__lede" data-fade>I sketch ideas.<br/>Then I make them real.</p>
        </div>
        <p class="hero__hint hand" data-fade>${U_?`move to paint, scroll to open the book`:`scroll to open the book`}</p>
      </div>
    </section>

    <section id="work" class="bookwrap" aria-label="Projects sketchbook">
      <div class="book__stage">
        <canvas class="book__gl" aria-hidden="true"></canvas>
        <div class="book__ui">
          <span class="book__count hand">1 / 7</span>
          <a class="book__link btn" href="#" target="_blank" rel="noopener">Open project ↗</a>
          <span class="book__hint hand">scroll to turn the page</span>
        </div>
      </div>
      <div class="book__fallback">${fc.work.map(e=>`
        <article class="fb"><img src="${G_(e.slug)}" alt="Illustration for ${W_(e.title)}" loading="lazy" /><div><h3>${W_(e.title)}</h3><p>${W_(e.desc)}</p><p class="hand">${W_(e.tags.join(`, `))}</p><a class="btn" href="${W_(e.url)}" target="_blank" rel="noopener">${W_(e.cta)} ↗</a></div></article>`).join(``)}
      </div>
    </section>

    <section id="toolbox" class="page toolbox" aria-label="Toolbox">
      <span class="pageno">p. 9</span>
      <div class="toolbox__head">
        <h2 class="split-line"><span class="rise">Stuff I use</span></h2>
        <p data-fade>${fc.skills.flat().length} tools I reach for, from first sketch to production. Grab them, throw them, stack them.</p>
      </div>
      <div class="board" data-board>
        <span class="board__hint hand write" data-write>${U_?`drag & throw them!`:`tap shake!`}</span>
        ${fc.skills.flat().map(e=>`<span class="sticker" data-cursor="grab">${W_(e)}</span>`).join(``)}
        <button class="shake" type="button">shake the board</button>
      </div>
    </section>

    <section id="certificates" class="page certs" aria-label="Certificates">
      <span class="pageno">p. 10</span>
      <div class="certs__head">
        <h2 class="split-line"><span class="rise">Pinned to the wall</span></h2>
        <span class="hand write" data-write>${fc.certificates.length} certificates, all verified</span>
      </div>
      <ul class="cards">
        ${fc.certificates.map((e,t)=>`
          <li class="card" style="--r:${[-3,2,-1.5,3,-2][t%5]}deg">
            <span class="tape"></span>
            <h3>${W_(e.title)}</h3>
            <p>${W_(e.by)}</p>
            <span class="stamp">VERIFIED</span>
          </li>`).join(``)}
      </ul>
    </section>

    <section id="contact" class="page contact" aria-label="Contact">
      <span class="pageno">p. 12</span>
      <svg class="signature" viewBox="0 0 900 230" aria-hidden="true"><text x="10" y="180">Shreyash</text></svg>
      <div class="contact__body">
        <div>
          <h2 class="split-line"><span class="rise">Got an idea?</span></h2>
          <a class="contact__mail" href="mailto:${W_(fc.email)}" data-cursor="write to me">${W_(fc.email)}${K_.under2}</a>
        </div>
        <div class="contact__side">
          <span class="hand hand--red write" data-write>I reply within a day, promise.</span>
          <a class="btn" href="mailto:${W_(fc.email)}">Send me a note ✎</a>
        </div>
      </div>
      <footer class="foot">
        <span>© ${new Date().getFullYear()} ${W_(fc.name)} ${W_(fc.surname)}. Drawn by hand, painted by you.</span>
        <ul>${fc.links.filter(e=>e.url.startsWith(`http`)).map(e=>`<li><a href="${W_(e.url)}" target="_blank" rel="noopener">${W_(e.label)}</a></li>`).join(``)}</ul>
      </footer>
    </section>
  </main>
`;var J_=document.querySelector(`#boil-noise`);if(!H_){let e=1;setInterval(()=>{e=e%6+1,J_.setAttribute(`seed`,e)},125)}var Y_=null;try{Y_=k_(document.querySelector(`#paint`))}catch(e){console.warn(`WebGL unavailable, showing paintings as-is`,e)}var X_=new Map;document.querySelectorAll(`img[data-paint]`).forEach(e=>{if(!Y_)return;let t=(e.dataset.seed||`0.5,0.5`).split(`,`).map(Number);X_.set(e,Y_.add(e,{bloomSeed:t,deckle:+!e.hasAttribute(`data-hero`),rectSize:e.hasAttribute(`data-hero`),ink:e.hasAttribute(`data-hero`)?.5:1}))}),Y_?.setDecay(.9975);var Z_=document.querySelector(`img[data-hero]`),Q_=X_.get(Z_);if(Q_&&U_&&!H_){let e={x:innerWidth/2,y:innerHeight/2,tx:innerWidth/2,ty:innerHeight/2,r:0,tr:0};addEventListener(`pointermove`,t=>{e.tx=t.clientX,e.ty=t.clientY,e.tr=Math.min(innerWidth,innerHeight)*.3}),document.addEventListener(`pointerleave`,()=>{e.tr=0}),Si.ticker.add(()=>{e.x+=(e.tx-e.x)*.12,e.y+=(e.ty-e.y)*.12,e.r+=(e.tr-e.r)*.08,Q_.uniforms.uLens.value.set(e.x*Y_.dpr,(innerHeight-e.y)*Y_.dpr,Math.max(1,e.r*Y_.dpr))}),Q_.uniforms.uLensOn.value=1}U_&&!H_&&X_.forEach((e,t)=>{if(t===Z_)return;let n=t.closest(`.paint`)||t.parentElement;n.addEventListener(`pointerenter`,n=>{let r=t.getBoundingClientRect();e.uniforms.uBloom.value<.05&&e.uniforms.uSeed.value.set(Si.utils.clamp(0,1,(n.clientX-r.left)/r.width),Si.utils.clamp(0,1,1-(n.clientY-r.top)/r.height)),Si.to(e.uniforms.uBloom,{value:1,duration:1.5,ease:`power2.out`,overwrite:!0})}),n.addEventListener(`pointerleave`,()=>Si.to(e.uniforms.uBloom,{value:0,duration:1.1,ease:`power2.inOut`,overwrite:!0}))});function $_(e,t=0){let n=X_.get(e);if(!n)return;let r=()=>{Si.to(n.uniforms.uDraw,{value:1,duration:H_?0:2.2,delay:t,ease:`power2.inOut`}),(!U_||H_)&&Si.to(n.uniforms.uBloom,{value:1,duration:H_?0:3.2,delay:t+1.6,ease:`power2.out`})};n.ready?r():e.addEventListener(`paint:ready`,r,{once:!0})}var ev=H_?null:new uc({lerp:.08});if(ev&&(ev.stop(),ev.on(`scroll`,X.update),Si.ticker.add(e=>ev.raf(e*1e3)),Si.ticker.lagSmoothing(0)),document.querySelectorAll(`a[href^="#"]`).forEach(e=>e.addEventListener(`click`,t=>{let n=document.querySelector(e.getAttribute(`href`));n&&(t.preventDefault(),ev?ev.scrollTo(n,{duration:1.8}):n.scrollIntoView())})),U_){let e=document.querySelector(`.cursor`),t=e.querySelector(`.cursor__ring`),n=e.querySelector(`.cursor__pencil`),r=e.querySelector(`.cursor__label`),i=(e,t)=>[Si.quickTo(e,`x`,{duration:t,ease:`power3`}),Si.quickTo(e,`y`,{duration:t,ease:`power3`})],[a,o]=i(t,.45),[s,c]=i(n,.08),[l,u]=i(r,.2),d=Si.quickTo(n,`rotation`,{duration:.5,ease:`power3`}),f=0;window.addEventListener(`pointermove`,e=>{a(e.clientX),o(e.clientY),s(e.clientX),c(e.clientY),l(e.clientX),u(e.clientY),d(Si.utils.clamp(-25,25,(e.clientX-f)*1.5)),f=e.clientX}),window.addEventListener(`pointerdown`,()=>Si.to(n,{scale:.85,duration:.15})),window.addEventListener(`pointerup`,()=>Si.to(n,{scale:1,duration:.4,ease:`back.out(3)`})),document.addEventListener(`pointerover`,t=>{let n=t.target.closest(`[data-cursor]`),i=t.target.closest(`a, button`),a=t.target.closest(`.paint`);e.classList.toggle(`is-link`,!!(n||i&&!a)),e.classList.toggle(`is-big`,!!a),r.textContent=n?.dataset.cursor||(i?`click`:``)})}U_&&!H_&&document.querySelectorAll(`[data-tilt]`).forEach(e=>{let t=e.querySelector(`.paint__frame`),n=Si.quickTo(t,`rotationX`,{duration:.8,ease:`power3`}),r=Si.quickTo(t,`rotationY`,{duration:.8,ease:`power3`});Si.set(e,{perspective:1200}),e.addEventListener(`pointermove`,t=>{let i=e.getBoundingClientRect();r(((t.clientX-i.left)/i.width-.5)*6),n(-((t.clientY-i.top)/i.height-.5)*6)}),e.addEventListener(`pointerleave`,()=>{n(0),r(0)})});var tv=document.querySelector(`.loader`),nv=document.querySelector(`.cover-wrap`),rv=nv.querySelector(`.cover`),iv=tv.querySelector(`.loader__pct`);async function av(){let e=Promise.all([document.fonts?.ready,Z_?.decode?.().catch(()=>{})]);if(Si.set(`.hero .rise`,{yPercent:110}),Si.set(`.hero [data-fade]`,{opacity:0,y:18}),Si.set(`.nav`,{yPercent:-130}),H_){await e,tv.remove(),nv.remove(),document.body.classList.remove(`is-loading`),Si.set([`.hero .rise`,`.hero [data-fade]`,`.nav`],{clearProps:`all`}),document.querySelectorAll(`img[data-paint]`).forEach(e=>$_(e));return}let t={v:0},n=Si.timeline().to(`.loader text`,{strokeDashoffset:0,duration:2.2,ease:`power2.inOut`}).to(t,{v:100,duration:2.2,ease:`power2.inOut`,onUpdate:()=>{iv.textContent=`${Math.round(t.v)}%`}},0).to(`.loader text`,{fill:`#2a2826`,duration:.6},`-=0.3`);await Promise.all([e,n.then()]),Si.timeline({onComplete:()=>{nv.remove(),document.body.classList.remove(`is-loading`),ev?.start(),X.refresh()}}).to(tv,{opacity:0,duration:.6,ease:`power2.out`,onComplete:()=>tv.remove()}).fromTo(`.cover__title > *`,{y:14,opacity:0},{y:0,opacity:1,duration:.9,stagger:.12,ease:`expo.out`},`-=0.2`).to(rv,{rotationY:-168,duration:2,ease:`power3.inOut`},`+=0.35`).to(rv,{opacity:0,duration:.4},`-=0.35`).add(()=>$_(Z_),`-=1.3`).to(`.hero .rise`,{yPercent:0,duration:1.4,ease:`expo.out`,stagger:.12},`-=1.1`).add(()=>ov(document.querySelectorAll(`.hero [data-write]`)),`-=1`).to(`.hero [data-fade]`,{opacity:1,y:0,duration:1,ease:`expo.out`,stagger:.07},`-=1.1`).to(`.nav`,{yPercent:0,duration:1,ease:`expo.out`},`-=1`)}function ov(e,t=0){e.forEach((e,n)=>{let r=Math.max(e.textContent.length,6);Si.fromTo(e,{clipPath:`inset(-20% 100% -20% 0)`},{clipPath:`inset(-20% 0% -20% 0)`,duration:Math.min(r*.05,2.2),delay:t+n*.25,ease:`none`})})}if(av(),!H_){Q_&&Si.timeline({scrollTrigger:{trigger:`.hero`,start:`top top`,end:`+=120%`,pin:`.hero__stage`,scrub:1}}).to(Q_.uniforms.uBloom,{value:1,duration:.55,ease:`none`},0).to(`.hero__art`,{scale:1.9,xPercent:6,yPercent:14,duration:1,ease:`power2.in`},.2).to(`.hero__copy`,{yPercent:-40,opacity:0,duration:.5,ease:`power2.in`},0).to(`.hero__hint`,{opacity:0,duration:.2},0).to(`.hero__art`,{opacity:0,duration:.25},.95),document.querySelectorAll(`main .page .rise`).forEach(e=>{Si.from(e,{yPercent:110,duration:1.3,ease:`expo.out`,scrollTrigger:{trigger:e,start:`top 88%`}})}),document.querySelectorAll(`main .page [data-fade]`).forEach(e=>{Si.fromTo(e,{opacity:0,y:20},{opacity:1,y:0,duration:1,ease:`expo.out`,scrollTrigger:{trigger:e,start:`top 90%`}})}),document.querySelectorAll(`main .page [data-write]`).forEach(e=>{Si.set(e,{clipPath:`inset(-20% 100% -20% 0)`}),X.create({trigger:e,start:`top 85%`,once:!0,onEnter:()=>ov([e])})}),Si.fromTo(`.signature text`,{strokeDashoffset:1600},{strokeDashoffset:0,ease:`none`,scrollTrigger:{trigger:`.contact`,start:`top 70%`,end:`top 10%`,scrub:1}}),Si.utils.toArray(`.card`).forEach((e,t)=>{let n=getComputedStyle(e).getPropertyValue(`--r`);Si.fromTo(e,{y:-120,rotate:parseFloat(n)*4,opacity:0},{y:0,rotate:n,opacity:1,duration:1.1,ease:`back.out(1.6)`,delay:t*.1,scrollTrigger:{trigger:`.cards`,start:`top 80%`}}),Si.fromTo(e.querySelector(`.stamp`),{scale:3.2,opacity:0},{scale:1,opacity:.8,duration:.35,ease:`power4.in`,delay:.8+t*.18,scrollTrigger:{trigger:`.cards`,start:`top 80%`}})}),Si.fromTo(`.progress path`,{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,ease:`none`,scrollTrigger:{start:0,end:`max`,scrub:!0}});let e=document.querySelector(`.nav`);X.create({start:200,end:`max`,onUpdate:t=>e.classList.toggle(`is-hidden`,t.direction===1)}),[`#work`,`#toolbox`,`#certificates`,`#contact`].forEach(e=>{let t=document.querySelector(`.nav__links a[href="${e}"]`);X.create({trigger:e,start:`top 50%`,end:`bottom 50%`,onToggle:e=>t?.classList.toggle(`is-active`,e.isActive)})})}var sv=[{text:{pageNo:`p. 2`,kicker:`hello! my name is`,title:`${fc.name} ${fc.surname}`,titleSize:118,lede:`I sketch ideas. Then I make them real.`,desc:`${fc.role}, building web apps, AI systems and automations.`,facts:[[`where`,`${fc.location}, working worldwide`],[`focus`,`Full stack + AI`],[`open source`,`AutoGPT contributor`],[`status`,`Open to work`]]},art:{src:G_(`portrait`),caption:`that's me`,pageNo:`p. 1`},link:null},...fc.work.map((e,t)=>({text:{pageNo:`p. ${4+t*2}`,kicker:`project ${t+1} of ${fc.work.length}`,title:e.title,tags:e.tags,desc:e.desc,note:q_[e.slug]},art:{src:G_(e.slug),caption:`fig. ${t+1}, ${e.title}`,pageNo:`p. ${3+t*2}`},link:e})),{text:{pageNo:`p. 14`,kicker:`the last page`,title:`Got an idea?`,desc:`${fc.status}. I reply within a day, promise.`,big:fc.email,note:`or keep scrolling, there is more…`},art:{src:G_(`desk`),caption:`where it all gets drawn`,pageNo:`p. 13`},link:{url:`mailto:${fc.email}`,cta:`Email me`}}],cv=document.querySelector(`.book__gl`),lv=!H_&&matchMedia(`(min-width: 861px)`).matches;document.querySelector(`.bookwrap`).classList.toggle(`is-gl`,lv);var uv=null;if(lv&&(async()=>{await document.fonts.ready,await Promise.all([`600 56px Caveat`,`400 120px "Instrument Serif"`,`400 36px Geist`].map(e=>document.fonts.load(e)));try{uv=await V_(cv,sv)}catch(e){console.warn(`book unavailable`,e),document.querySelector(`.bookwrap`).classList.remove(`is-gl`);return}let e=document.querySelector(`.book__count`),t=document.querySelector(`.book__link`),n=sv.length-1,r=-1,i={f:0};X.create({trigger:`.bookwrap`,start:`top top`,end:()=>`+=${n*innerHeight*.9}`,pin:`.book__stage`,scrub:.6,onUpdate:e=>{i.f=e.progress*n},refreshPriority:1}),X.sort(),X.refresh(),Si.ticker.add(a=>{let o=Math.floor(i.f),s=i.f-o,c=Math.min(n,o+Si.utils.clamp(0,1,(s-.18)/.64));uv.set(c);let l=Math.min(sv.length-1,Math.round(c));if(l!==r&&Math.abs(c-l)<.04){r=l,e.textContent=`${l+1} / ${sv.length}`;let n=sv[l].link;t.style.visibility=n?`visible`:`hidden`,n&&(t.href=n.url,t.textContent=`${n.cta} ↗`,t.target=n.url.startsWith(`http`)?`_blank`:``),uv.painted.has(l)||(uv.painted.add(l),Si.to(uv.artOf(l).uPaint,{value:1,duration:2.6,delay:.25,ease:`power2.out`}))}uv.render(a)})})(),U_&&!H_){let e=document.createElement(`canvas`);e.className=`trail`,e.setAttribute(`aria-hidden`,`true`),document.body.append(e);let t=e.getContext(`2d`),n=Math.min(devicePixelRatio,2),r=()=>{e.width=innerWidth*n,e.height=innerHeight*n};r(),addEventListener(`resize`,r);let i=[];addEventListener(`pointermove`,e=>{i.push({x:e.clientX,y:e.clientY,t:performance.now()}),i.length>80&&i.shift()}),Si.ticker.add(()=>{let e=performance.now();for(;i.length&&e-i[0].t>900;)i.shift();t.setTransform(n,0,0,n,0,0),t.clearRect(0,0,innerWidth,innerHeight),t.lineCap=`round`;for(let n=1;n<i.length;n++){let r=i[n-1],a=i[n],o=(e-a.t)/900;t.strokeStyle=`rgba(42,40,38,${(1-o)*.55})`,t.lineWidth=1.1+(1-o)*1.1,t.beginPath(),t.moveTo(r.x+Math.sin(n*1.7)*.6,r.y),t.lineTo(a.x,a.y+Math.cos(n*2.3)*.6),t.stroke()}})}(function(){let e=document.querySelector(`[data-board]`),t=[...e.querySelectorAll(`.sticker`)],{Engine:n,Bodies:r,Composite:i,Body:a,Mouse:o,MouseConstraint:s,Runner:c}=dc.default,l,u=!1;function d(){let n=e.clientWidth,r=20,i=70,a=0;t.forEach(e=>{let t=e.offsetWidth,o=e.offsetHeight;r+t>n-20&&(r=20,i+=a+14,a=0),e.style.transform=`translate(${r}px, ${i}px) rotate(${(Math.random()-.5)*8}deg)`,r+=t+14,a=Math.max(a,o)})}if(d(),H_)return;function f(){if(u)return;u=!0;let d=e.clientWidth,f=e.clientHeight;l=n.create({gravity:{y:1.1}});let p=(e,t,n,i)=>r.rectangle(e,t,n,i,{isStatic:!0});i.add(l.world,[p(d/2,f+30,d*2,60),p(-30,f/2,60,f*3),p(d+30,f/2,60,f*3),p(d/2,-600,d*2,60)]);let m=t.map((e,t)=>{let n=e.offsetWidth,i=e.offsetHeight,o=r.rectangle(40+Math.random()*(d-80),-60-t*45,n,i,{chamfer:{radius:i/2},restitution:.45,friction:.25,frictionAir:.012});return a.setAngle(o,(Math.random()-.5)*1.2),o.el=e,o.w=n,o.h=i,o});i.add(l.world,m);let h=o.create(e);h.element.removeEventListener(`wheel`,h.mousewheel),h.element.removeEventListener(`DOMMouseScroll`,h.mousewheel);let g=s.create(l,{mouse:h,constraint:{stiffness:.2,render:{visible:!1}}});i.add(l.world,g);let _=c.create();c.run(_,l),(function e(){for(let e of m)e.el.style.transform=`translate(${e.position.x-e.w/2}px, ${e.position.y-e.h/2}px) rotate(${e.angle}rad)`;requestAnimationFrame(e)})(),e.querySelector(`.shake`).addEventListener(`click`,()=>{m.forEach(e=>a.applyForce(e,e.position,{x:(Math.random()-.5)*.06*e.mass,y:-(.05+Math.random()*.06)*e.mass})),Si.fromTo(e,{rotate:-1},{rotate:0,duration:.6,ease:`elastic.out(1, 0.3)`})})}X.create({trigger:e,start:`top 70%`,once:!0,onEnter:f})})(),window.addEventListener(`load`,()=>X.refresh());