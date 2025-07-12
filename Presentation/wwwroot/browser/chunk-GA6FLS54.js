import{Na as A,Ua as Ae,Xa as we}from"./chunk-IFNCIUGM.js";import{$ as o,A as G,Aa as F,Ab as _,Ca as ne,Cb as de,Db as ue,Ea as se,Eb as N,Ga as re,Ic as be,Jb as R,Kb as S,L as Y,Lb as le,N as q,Nc as E,Pb as he,Rb as fe,Sb as h,Tb as me,U as X,Ub as _e,Uc as ve,V as Q,Va as oe,Wc as ye,X as J,_a as L,aa as c,bc as B,ca as x,cc as pe,cd as Ie,dc as ge,ed as Ee,fa as r,j as H,jc as P,ka as ee,lb as O,m as W,mb as d,na as te,oa as ie,pb as ae,ra as k,sb as y,ta as M,w as C,wa as g,x as Z,xa as D,yb as ce,yc as j,zb as I}from"./chunk-WMH6ZWCB.js";var Ne=["*"];function Re(e,s){if(e&1&&(R(0,"span",3),pe(1),S()),e&2){let t=h();L(),ge(t.label)}}function Se(e,s){if(e&1&&le(0,"span",5),e&2){let t=h(2);N(t.icon),_("ngClass","p-avatar-icon")}}function Be(e,s){if(e&1&&y(0,Se,1,3,"span",4),e&2){let t=h(),i=B(5);_("ngIf",t.icon)("ngIfElse",i)}}function Pe(e,s){if(e&1){let t=he();R(0,"img",7),fe("error",function(n){te(t);let a=h(2);return ie(a.imageError(n))}),S()}if(e&2){let t=h(2);_("src",t.image,oe),I("aria-label",t.ariaLabel)}}function je(e,s){if(e&1&&y(0,Pe,1,2,"img",6),e&2){let t=h();_("ngIf",t.image)}}var Ke=({dt:e})=>`
.p-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${e("avatar.width")};
    height: ${e("avatar.height")};
    font-size: ${e("avatar.font.size")};
    color: ${e("avatar.color")};
    background: ${e("avatar.background")};
    border-radius: ${e("avatar.border.radius")};
}

.p-avatar-image {
    background: transparent;
}

.p-avatar-circle {
    border-radius: 50%;
}

.p-avatar-circle img {
    border-radius: 50%;
}

.p-avatar-icon {
    font-size: ${e("avatar.icon.size")};
    width: ${e("avatar.icon.size")};
    height: ${e("avatar.icon.size")};
}

.p-avatar img {
    width: 100%;
    height: 100%;
}

.p-avatar-lg {
    width: ${e("avatar.lg.width")};
    height: ${e("avatar.lg.width")};
    font-size: ${e("avatar.lg.font.size")};
}

.p-avatar-lg .p-avatar-icon {
    font-size: ${e("avatar.lg.icon.size")};
    width: ${e("avatar.lg.icon.size")};
    height: ${e("avatar.lg.icon.size")};
}

.p-avatar-xl {
    width: ${e("avatar.xl.width")};
    height: ${e("avatar.xl.width")};
    font-size: ${e("avatar.xl.font.size")};
}

.p-avatar-xl .p-avatar-icon {
    font-size: ${e("avatar.xl.font.size")};
    width: ${e("avatar.xl.icon.size")};
    height: ${e("avatar.xl.icon.size")};
}

.p-avatar-group {
    display: flex;
    align-items: center;
}

.p-avatar-group .p-avatar + .p-avatar {
    margin-inline-start: ${e("avatar.group.offset")};
}

.p-avatar-group .p-avatar {
    border: 2px solid ${e("avatar.group.border.color")};
}

.p-avatar-group .p-avatar-lg + .p-avatar-lg {
    margin-inline-start: ${e("avatar.lg.group.offset")};
}

.p-avatar-group .p-avatar-xl + .p-avatar-xl {
    margin-inline-start: ${e("avatar.xl.group.offset")};
}
`,$e={root:({props:e})=>["p-avatar p-component",{"p-avatar-image":e.image!=null,"p-avatar-circle":e.shape==="circle","p-avatar-lg":e.size==="large","p-avatar-xl":e.size==="xlarge"}],label:"p-avatar-label",icon:"p-avatar-icon"},Te=(()=>{class e extends Ae{name="avatar";theme=Ke;classes=$e;static \u0275fac=(()=>{let t;return function(n){return(t||(t=k(e)))(n||e)}})();static \u0275prov=o({token:e,factory:e.\u0275fac})}return e})();var ze=(()=>{class e extends we{label;icon;image;size="normal";shape="square";style;styleClass;ariaLabel;ariaLabelledBy;onImageError=new g;_componentStyle=r(Te);imageError(t){this.onImageError.emit(t)}get hostClass(){return this.styleClass}static \u0275fac=(()=>{let t;return function(n){return(t||(t=k(e)))(n||e)}})();static \u0275cmp=O({type:e,selectors:[["p-avatar"]],hostVars:19,hostBindings:function(i,n){i&2&&(I("data-pc-name","avatar")("aria-label",n.ariaLabel)("aria-labelledby",n.ariaLabelledBy),ue(n.style),N(n.hostClass),de("p-avatar",!0)("p-component",!0)("p-avatar-circle",n.shape==="circle")("p-avatar-lg",n.size==="large")("p-avatar-xl",n.size==="xlarge")("p-avatar-image",n.image!=null))},inputs:{label:"label",icon:"icon",image:"image",size:"size",shape:"shape",style:"style",styleClass:"styleClass",ariaLabel:"ariaLabel",ariaLabelledBy:"ariaLabelledBy"},outputs:{onImageError:"onImageError"},features:[P([Te]),ae],ngContentSelectors:Ne,decls:6,vars:2,consts:[["iconTemplate",""],["imageTemplate",""],["class","p-avatar-text",4,"ngIf","ngIfElse"],[1,"p-avatar-text"],[3,"class","ngClass",4,"ngIf","ngIfElse"],[3,"ngClass"],[3,"src","error",4,"ngIf"],[3,"error","src"]],template:function(i,n){if(i&1&&(me(),_e(0),y(1,Re,2,1,"span",2)(2,Be,1,2,"ng-template",null,0,j)(4,je,1,1,"ng-template",null,1,j)),i&2){let a=B(3);L(),_("ngIf",n.label)("ngIfElse",a)}},dependencies:[Ie,ve,ye,A],encapsulation:2,changeDetection:0})}return e})(),vt=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=d({type:e});static \u0275inj=c({imports:[ze,A,A]})}return e})();var $;try{$=typeof Intl<"u"&&Intl.v8BreakIterator}catch{$=!1}var w=(()=>{class e{_platformId=r(se);isBrowser=this._platformId?Ee(this._platformId):typeof document=="object"&&!!document;EDGE=this.isBrowser&&/(edge)/i.test(navigator.userAgent);TRIDENT=this.isBrowser&&/(msie|trident)/i.test(navigator.userAgent);BLINK=this.isBrowser&&!!(window.chrome||$)&&typeof CSS<"u"&&!this.EDGE&&!this.TRIDENT;WEBKIT=this.isBrowser&&/AppleWebKit/i.test(navigator.userAgent)&&!this.BLINK&&!this.EDGE&&!this.TRIDENT;IOS=this.isBrowser&&/iPad|iPhone|iPod/.test(navigator.userAgent)&&!("MSStream"in window);FIREFOX=this.isBrowser&&/(firefox|minefield)/i.test(navigator.userAgent);ANDROID=this.isBrowser&&/android/i.test(navigator.userAgent)&&!this.TRIDENT;SAFARI=this.isBrowser&&/safari/i.test(navigator.userAgent)&&this.WEBKIT;constructor(){}static \u0275fac=function(i){return new(i||e)};static \u0275prov=o({token:e,factory:e.\u0275fac,providedIn:"root"})}return e})();var b;function Ve(){if(b==null&&typeof window<"u")try{window.addEventListener("test",null,Object.defineProperty({},"passive",{get:()=>b=!0}))}finally{b=b||!1}return b}function Ue(e){return Ve()?e:!!e.capture}var K;function He(){if(K==null){let e=typeof document<"u"?document.head:null;K=!!(e&&(e.createShadowRoot||e.attachShadow))}return K}function We(e){if(He()){let s=e.getRootNode?e.getRootNode():null;if(typeof ShadowRoot<"u"&&ShadowRoot&&s instanceof ShadowRoot)return s}return null}function Ze(e){return e.composedPath?e.composedPath()[0]:e.target}var T=new WeakMap,Ft=(()=>{class e{_appRef;_injector=r(M);_environmentInjector=r(ee);load(t){let i=this._appRef=this._appRef||this._injector.get(ce),n=T.get(i);n||(n={loaders:new Set,refs:[]},T.set(i,n),i.onDestroy(()=>{T.get(i)?.refs.forEach(a=>a.destroy()),T.delete(i)})),n.loaders.has(t)||(n.loaders.add(t),n.refs.push(be(t,{environmentInjector:this._environmentInjector})))}static \u0275fac=function(i){return new(i||e)};static \u0275prov=o({token:e,factory:e.\u0275fac,providedIn:"root"})}return e})();function Nt(e,s=0){return Ge(e)?Number(e):arguments.length===2?s:0}function Ge(e){return!isNaN(parseFloat(e))&&!isNaN(Number(e))}function z(e){return Array.isArray(e)?e:[e]}function Rt(e){return e instanceof F?e.nativeElement:e}var qe=(()=>{class e{create(t){return typeof MutationObserver>"u"?null:new MutationObserver(t)}static \u0275fac=function(i){return new(i||e)};static \u0275prov=o({token:e,factory:e.\u0275fac,providedIn:"root"})}return e})();var xe=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=d({type:e});static \u0275inj=c({providers:[qe]})}return e})();var ke=new Set,f,Xe=(()=>{class e{_platform=r(w);_nonce=r(re,{optional:!0});_matchMedia;constructor(){this._matchMedia=this._platform.isBrowser&&window.matchMedia?window.matchMedia.bind(window):Je}matchMedia(t){return(this._platform.WEBKIT||this._platform.BLINK)&&Qe(t,this._nonce),this._matchMedia(t)}static \u0275fac=function(i){return new(i||e)};static \u0275prov=o({token:e,factory:e.\u0275fac,providedIn:"root"})}return e})();function Qe(e,s){if(!ke.has(e))try{f||(f=document.createElement("style"),s&&f.setAttribute("nonce",s),f.setAttribute("type","text/css"),document.head.appendChild(f)),f.sheet&&(f.sheet.insertRule(`@media ${e} {body{ }}`,0),ke.add(e))}catch(t){console.error(t)}}function Je(e){return{matches:e==="all"||e==="",media:e,addListener:()=>{},removeListener:()=>{}}}var De=(()=>{class e{_mediaMatcher=r(Xe);_zone=r(D);_queries=new Map;_destroySubject=new W;constructor(){}ngOnDestroy(){this._destroySubject.next(),this._destroySubject.complete()}isMatched(t){return Me(z(t)).some(n=>this._registerQuery(n).mql.matches)}observe(t){let n=Me(z(t)).map(u=>this._registerQuery(u).observable),a=Z(n);return a=G(a.pipe(q(1)),a.pipe(X(1),Y(0))),a.pipe(C(u=>{let l={matches:!1,breakpoints:{}};return u.forEach(({matches:v,query:Oe})=>{l.matches=l.matches||v,l.breakpoints[Oe]=v}),l}))}_registerQuery(t){if(this._queries.has(t))return this._queries.get(t);let i=this._mediaMatcher.matchMedia(t),a={observable:new H(u=>{let l=v=>this._zone.run(()=>u.next(v));return i.addListener(l),()=>{i.removeListener(l)}}).pipe(Q(i),C(({matches:u})=>({query:t,matches:u})),J(this._destroySubject)),mql:i};return this._queries.set(t,a),a}static \u0275fac=function(i){return new(i||e)};static \u0275prov=o({token:e,factory:e.\u0275fac,providedIn:"root"})}return e})();function Me(e){return e.map(s=>s.split(",")).reduce((s,t)=>s.concat(t)).map(s=>s.trim())}function hi(e){return e.buttons===0||e.detail===0}function fi(e){let s=e.touches&&e.touches[0]||e.changedTouches&&e.changedTouches[0];return!!s&&s.identifier===-1&&(s.radiusX==null||s.radiusX===1)&&(s.radiusY==null||s.radiusY===1)}var m=function(e){return e[e.NONE=0]="NONE",e[e.BLACK_ON_WHITE=1]="BLACK_ON_WHITE",e[e.WHITE_ON_BLACK=2]="WHITE_ON_BLACK",e}(m||{}),Fe="cdk-high-contrast-black-on-white",Le="cdk-high-contrast-white-on-black",V="cdk-high-contrast-active",et=(()=>{class e{_platform=r(w);_hasCheckedHighContrastMode;_document=r(E);_breakpointSubscription;constructor(){this._breakpointSubscription=r(De).observe("(forced-colors: active)").subscribe(()=>{this._hasCheckedHighContrastMode&&(this._hasCheckedHighContrastMode=!1,this._applyBodyHighContrastModeCssClasses())})}getHighContrastMode(){if(!this._platform.isBrowser)return m.NONE;let t=this._document.createElement("div");t.style.backgroundColor="rgb(1,2,3)",t.style.position="absolute",this._document.body.appendChild(t);let i=this._document.defaultView||window,n=i&&i.getComputedStyle?i.getComputedStyle(t):null,a=(n&&n.backgroundColor||"").replace(/ /g,"");switch(t.remove(),a){case"rgb(0,0,0)":case"rgb(45,50,54)":case"rgb(32,32,32)":return m.WHITE_ON_BLACK;case"rgb(255,255,255)":case"rgb(255,250,239)":return m.BLACK_ON_WHITE}return m.NONE}ngOnDestroy(){this._breakpointSubscription.unsubscribe()}_applyBodyHighContrastModeCssClasses(){if(!this._hasCheckedHighContrastMode&&this._platform.isBrowser&&this._document.body){let t=this._document.body.classList;t.remove(V,Fe,Le),this._hasCheckedHighContrastMode=!0;let i=this.getHighContrastMode();i===m.BLACK_ON_WHITE?t.add(V,Fe):i===m.WHITE_ON_BLACK&&t.add(V,Le)}}static \u0275fac=function(i){return new(i||e)};static \u0275prov=o({token:e,factory:e.\u0275fac,providedIn:"root"})}return e})(),mi=(()=>{class e{constructor(){r(et)._applyBodyHighContrastModeCssClasses()}static \u0275fac=function(i){return new(i||e)};static \u0275mod=d({type:e});static \u0275inj=c({imports:[xe]})}return e})(),U={},_i=(()=>{class e{_appId=r(ne);getId(t){return this._appId!=="ng"&&(t+=this._appId),U.hasOwnProperty(t)||(U[t]=0),`${t}${U[t]++}`}static \u0275fac=function(i){return new(i||e)};static \u0275prov=o({token:e,factory:e.\u0275fac,providedIn:"root"})}return e})();var tt=new x("cdk-dir-doc",{providedIn:"root",factory:it});function it(){return r(E)}var nt=/^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;function st(e){let s=e?.toLowerCase()||"";return s==="auto"&&typeof navigator<"u"&&navigator?.language?nt.test(navigator.language)?"rtl":"ltr":s==="rtl"?"rtl":"ltr"}var Ti=(()=>{class e{value="ltr";change=new g;constructor(){let t=r(tt,{optional:!0});if(t){let i=t.body?t.body.dir:null,n=t.documentElement?t.documentElement.dir:null;this.value=st(i||n||"ltr")}}ngOnDestroy(){this.change.complete()}static \u0275fac=function(i){return new(i||e)};static \u0275prov=o({token:e,factory:e.\u0275fac,providedIn:"root"})}return e})();var Ci=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=d({type:e});static \u0275inj=c({})}return e})();export{w as a,Ue as b,We as c,Ze as d,Ft as e,Nt as f,z as g,Rt as h,hi as i,fi as j,et as k,mi as l,_i as m,Ti as n,Ci as o,ze as p,vt as q};
