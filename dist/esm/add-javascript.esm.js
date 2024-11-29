/*
 * add-javascript
 * v1.0.8
 * https://github.com/shuckster/add-javascript
 * License: MIT
 */
function _(e,{getKey:t=r=>r}){let r=new Map,n=i=>()=>{r.delete(i)};return i=>{let o=t(i);return r.has(o)?r.get(o):r.set(o,e(i,n(o))).get(o)}}var O=[!0,!1];function d(e,t,r){if(!r.includes(t))throw new Error(`Invalid value for '${e}'. Got: ${JSON.stringify(t)}, expected one of: ${r.map(n=>JSON.stringify(n)).join(", ")}.`)}function v(e,t){if(typeof t!="string")throw new Error(`Invalid value for '${e}'. Got: ${JSON.stringify(t)}, expected a string.`)}function I(e,t){if(typeof t!="function")throw new Error(`Invalid value for '${e}'. Got: ${JSON.stringify(t)}, expected a function.`)}function Y(e){return e===null||typeof e!="object"?!1:Object.getPrototypeOf(e)===Object.prototype}function N(e,t){if(!Y(t))throw new Error(`Invalid value for '${e}'. Got: ${JSON.stringify(t)}, expected a plain object.`)}function z(e){return/^[a-z][a-zA-Z0-9]*$/.test(e)}function M(e,t){N(e,t);let r=Object.keys(t);if(r.length===0)return;if(!r.every(z))throw new Error(`Invalid value for '${e}'. Got: ${JSON.stringify(t)}, expected a plain object with camelCase keys.`)}function T(e,t){if(!(L(t)||H(t)))throw new Error(`Invalid value for '${e}'. Got: ${JSON.stringify(t)}, expected a valid URL.`)}var G=/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+/;function L(e){if(typeof e!="string"||!G.test(e))return!1;try{return new URL(e),!0}catch(t){return!1}}function H(e){if(typeof e!="string"||!G.test(e))return!1;try{return new URL(e,"http://example.com"),!0}catch(t){return!1}}var l={ADDED:"added",ALREADY_ADDED:"already-added",ALREADY_ADDED_UNMANAGED:"already-added (unmanaged)",SKIPPED:"skipped",ERROR:"error"},K=["async","defer","blocking"],j=["","high","low","auto"],Q=["","anonymous","use-credentials"],B=["","no-referrer","no-referrer-when-downgrade","origin","origin-when-cross-origin","same-origin","strict-origin","strict-origin-when-cross-origin","unsafe-url"];function x(){}function m(){return globalThis.window}var W=_(({ttlInSeconds:e=1/0},t)=>(e!==1/0&&setTimeout(t,e*1e3),{invalidate:t}),{getKey:({src:e,ignoreQueryString:t=!0})=>{if(!t)return e;let[r]=e.split("?");return r}});function F(e,t){let{ignoreQueryString:r=!0}=t||{},n=L(e)?e:new URL(e,m().location.href).href;return!!V().find(o=>{let c=o.src||"";if(!r)return c===n;let[f]=c.split("?");return f===n})}function V(){let e=m().document.getElementsByTagName("script");return Array.from(e).filter(t=>t.type!=="importmap").filter(t=>t.src)}function C(e,t){v("src",e),T("src",e);let{skipLoading:r=x}=t||{};if(I("skipLoading",r),r!==x&&r(e))return l.SKIPPED;let{isModule:n=!1,loadBehavior:i="async",fetchPriority:o="",noopIfModulesSupported:c=!1,ignoreQueryString:f=!0,security:g={},dataSet:u={}}=t||{};d("isModule",n,O),d("loadBehavior",i,K),d("fetchPriority",o,j),d("noopIfModulesSupported",c,O),d("ignoreQueryString",f,O),N("security",g),M("dataSet",u);let{onLoad:y=x,onError:h=x}=t||{};I("onLoad",y),I("onError",h);let a=W({src:e,ignoreQueryString:f});if(a.promise instanceof Promise)return a.promise.then(y,h),a.scriptElement?l.ALREADY_ADDED:l.ALREADY_ADDED_UNMANAGED;if(F(e,{ignoreQueryString:f}))return a.promise=Promise.resolve(),a.promise.then(y,h),l.ALREADY_ADDED_UNMANAGED;let{crossOrigin:E="",nonce:R="",integrity:D="",referrerPolicy:S=""}=g||{};d("crossOrigin",E,Q),v("nonce",R),v("integrity",D),d("referrerPolicy",S,B);let A;if(D){if(!["","anonymous"].includes(E))throw new Error(`When 'integrity' is specified, 'crossOrigin' must be "anonymous".
It is currently set to "${E}".

You can also remove the 'crossOrigin' option; it will be set to
"anonymous" automatically if 'integrity' is specified.`);A="anonymous"}else A=E,L(e)&&e.indexOf(m().location.origin)!==0&&console.warn(`The script "${e}" is being loaded from a different origin
to the current page. It is recommended that you use the
'integrity' option to ensure the script has not been
tampered with.`);let J={...n?{type:"module"}:{},...c?{noModule:!0}:{},...i==="async"?{async:!0}:{},...i==="defer"?{defer:!0}:{},...o&&j.includes(o)?{fetchPriority:o}:{},...R?{nonce:R}:{},...D?{integrity:D}:{},...A?{crossOrigin:A}:{},...S&&B.includes(S)?{referrerPolicy:S}:{},...Object.keys(u).length?{dataset:u}:{},src:e},s=m().document.createElement("script");return a.src=e,a.scriptElement=s,a.promise=new Promise((b,U)=>{function P(){var p,w,k;(p=a.invalidate)==null||p.call(a),(k=(w=s==null?void 0:s.parentNode)==null?void 0:w.removeChild)==null||k.call(w,s)}s.addEventListener("load",p=>{s.removeEventListener("load",b),b({event:p,removeScriptTag:P})}),s.addEventListener("error",p=>{P(),s.removeEventListener("error",U),U({event:p,removeScriptTag:P})})}),a.promise.then(y,h),Object.assign(s,J),i==="defer"?m().document.head.appendChild(s):m().document.body.appendChild(s),l.ADDED}function $(e,t){return new Promise((r,n)=>{let i=C(e,{...t,onLoad:o=>r({type:"added",...o}),onError:o=>n({type:"error",...o})});i!=="added"&&r({type:i})})}function Z({useState:e,useEffect:t}){function r(n,i){let[o,c]=e("pending"),[f,g]=e();return t(()=>{c("loading"),$(n,i).then(u=>{c("loaded"),g(u)}).catch(u=>{c("error"),g(u)})},[n]),[o,f]}return r}export{l as ADD_SCRIPT_OUTCOME,C as addScript,$ as loadScript,Z as makeHook};
