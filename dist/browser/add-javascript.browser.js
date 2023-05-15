/*
 * add-javascript
 * v1.0.3
 * https://github.com/shuckster/add-javascript
 * License: MIT
 */
var addJs=(()=>{var N=Object.defineProperty;var Y=Object.getOwnPropertyDescriptor;var z=Object.getOwnPropertyNames;var H=Object.prototype.hasOwnProperty;var K=(e,t)=>{for(var r in t)N(e,r,{get:t[r],enumerable:!0})},Q=(e,t,r,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of z(t))!H.call(e,n)&&n!==r&&N(e,n,{get:()=>t[n],enumerable:!(i=Y(t,n))||i.enumerable});return e};var W=e=>Q(N({},"__esModule",{value:!0}),e);var ne={};K(ne,{ADD_SCRIPT_OUTCOME:()=>u,addScript:()=>x,loadScript:()=>L,makeHook:()=>J});function k(e,{getKey:t=r=>r}){let r=new Map,i=n=>()=>{r.delete(n)};return n=>{let o=t(n);return r.has(o)?r.get(o):r.set(o,e(n,i(o))).get(o)}}var O=[!0,!1];function d(e,t,r){if(!r.includes(t))throw new Error(`Invalid value for '${e}'. Got: ${JSON.stringify(t)}, expected one of: ${r.map(i=>JSON.stringify(i)).join(", ")}.`)}function w(e,t){if(typeof t!="string")throw new Error(`Invalid value for '${e}'. Got: ${JSON.stringify(t)}, expected a string.`)}function v(e,t){if(typeof t!="function")throw new Error(`Invalid value for '${e}'. Got: ${JSON.stringify(t)}, expected a function.`)}function F(e){return e===null||typeof e!="object"?!1:Object.getPrototypeOf(e)===Object.prototype}function C(e,t){if(!F(t))throw new Error(`Invalid value for '${e}'. Got: ${JSON.stringify(t)}, expected a plain object.`)}function V(e){return/^[a-z][a-zA-Z0-9]*$/.test(e)}function _(e,t){C(e,t);let r=Object.keys(t);if(r.length===0)return;if(!r.every(V))throw new Error(`Invalid value for '${e}'. Got: ${JSON.stringify(t)}, expected a plain object with camelCase keys.`)}function M(e,t){if(!($(t)||Z(t)))throw new Error(`Invalid value for '${e}'. Got: ${JSON.stringify(t)}, expected a valid URL.`)}var T=/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+/;function $(e){if(typeof e!="string"||!T.test(e))return!1;try{return new URL(e),!0}catch(t){return!1}}function Z(e){if(typeof e!="string"||!T.test(e))return!1;try{return new URL(e,"http://example.com"),!0}catch(t){return!1}}var u={ADDED:"added",ALREADY_ADDED:"already-added",ALREADY_ADDED_UNMANAGED:"already-added (unmanaged)",SKIPPED:"skipped",ERROR:"error"},q=["async","defer","blocking"],G=["","high","low","auto"],X=["","anonymous","use-credentials"],j=["","no-referrer","no-referrer-when-downgrade","origin","origin-when-cross-origin","same-origin","strict-origin","strict-origin-when-cross-origin","unsafe-url"];function I(){}function g(){return globalThis.window}var ee=k(({ttlInSeconds:e=1/0},t)=>(e!==1/0&&setTimeout(t,e*1e3),{invalidate:t}),{getKey:({src:e,ignoreQueryString:t=!0})=>{if(!t)return e;let[r]=e.split("?");return r}});function te(e,t){let{ignoreQueryString:r=!0}=t||{};return!!re().find(n=>{let o=n.src||"";if(!r)return o===e;let[c]=o.split("?");return c===e})}function re(){let e=g().document.getElementsByTagName("script");return Array.from(e).filter(t=>!t.type).filter(t=>t.src)}function x(e,t){w("src",e),M("src",e);let{skipLoading:r=I}=t||{};if(v("skipLoading",r),r!==I&&r(e))return u.SKIPPED;let{isModule:i=!1,loadBehavior:n="async",fetchPriority:o="",noopIfModulesSupported:c=!1,ignoreQueryString:l=!0,security:m={},dataSet:f={}}=t||{};d("isModule",i,O),d("loadBehavior",n,q),d("fetchPriority",o,G),d("noopIfModulesSupported",c,O),d("ignoreQueryString",l,O),C("security",m),_("dataSet",f);let{onLoad:y=I,onError:h=I}=t||{};v("onLoad",y),v("onError",h);let s=ee({src:e,ignoreQueryString:l});if(s.promise instanceof Promise)return s.promise.then(y,h),s.scriptElement?u.ALREADY_ADDED:u.ALREADY_ADDED_UNMANAGED;if(te(e,{ignoreQueryString:l}))return s.promise=Promise.resolve(),s.promise.then(y,h),u.ALREADY_ADDED_UNMANAGED;let{crossOrigin:E="",nonce:R="",integrity:D="",referrerPolicy:S=""}=m||{};d("crossOrigin",E,X),w("nonce",R),w("integrity",D),d("referrerPolicy",S,j);let A;if(D){if(!["","anonymous"].includes(E))throw new Error(`When 'integrity' is specified, 'crossOrigin' must be "anonymous".
It is currently set to "${E}".

You can also remove the 'crossOrigin' option; it will be set to
"anonymous" automatically if 'integrity' is specified.`);A="anonymous"}else A=E,$(e)&&e.indexOf(g().location.origin)!==0&&console.warn(`The script "${e}" is being loaded from a different origin
to the current page. It is recommended that you use the
'integrity' option to ensure the script has not been
tampered with.`);let B={...i?{type:"module"}:{},...c?{noModule:!0}:{},...n==="async"?{async:!0}:{},...n==="defer"?{defer:!0}:{},...o&&G.includes(o)?{fetchPriority:o}:{},...R?{nonce:R}:{},...D?{integrity:D}:{},...A?{crossOrigin:A}:{},...S&&j.includes(S)?{referrerPolicy:S}:{},...Object.keys(f).length?{dataset:f}:{},src:e},a=g().document.createElement("script");return s.src=e,s.scriptElement=a,s.promise=new Promise((b,U)=>{function P(){var p;(p=s.invalidate)==null||p.call(s),a.parentNode.removeChild(a)}a.addEventListener("load",p=>{a.removeEventListener("load",b),b({event:p,removeScriptTag:P})}),a.addEventListener("error",p=>{P(),a.removeEventListener("error",U),U({event:p,removeScriptTag:P})})}),s.promise.then(y,h),Object.assign(a,B),n==="defer"?g().document.head.appendChild(a):g().document.body.appendChild(a),u.ADDED}function L(e,t){return new Promise((r,i)=>{let n=x(e,{...t,onLoad:o=>r({type:"added",...o}),onError:o=>i({type:"error",...o})});n!=="added"&&r({type:n})})}function J({useState:e,useEffect:t}){function r(i,n){let[o,c]=e("pending"),[l,m]=e();return t(()=>{c("loading"),L(i,n).then(f=>{c("loaded"),m(f)}).catch(f=>{c("error"),m(f)})},[i]),[o,l]}return r}return W(ne);})();
