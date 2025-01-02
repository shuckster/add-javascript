/*
 * add-javascript
 * v1.0.9
 * https://github.com/shuckster/add-javascript
 * License: MIT
 */
var addJs=(()=>{var $=Object.defineProperty;var H=Object.getOwnPropertyDescriptor;var K=Object.getOwnPropertyNames;var Q=Object.prototype.hasOwnProperty;var W=(e,t)=>{for(var r in t)$(e,r,{get:t[r],enumerable:!0})},F=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of K(t))!Q.call(e,o)&&o!==r&&$(e,o,{get:()=>t[o],enumerable:!(n=H(t,o))||n.enumerable});return e};var V=e=>F($({},"__esModule",{value:!0}),e);var ie={};W(ie,{ADD_SCRIPT_OUTCOME:()=>p,addScript:()=>R,loadScript:()=>P,makeHook:()=>Y});function M(e,{getKey:t=r=>r}){let r=new Map,n=o=>()=>{r.delete(o)};return o=>{let i=t(o);return r.has(i)?r.get(i):r.set(i,e(o,n(i))).get(i)}}var O=[!0,!1];function d(e,t,r){if(!r.includes(t))throw new Error(`Invalid value for '${e}'. Got: ${JSON.stringify(t)}, expected one of: ${r.map(n=>JSON.stringify(n)).join(", ")}.`)}function v(e,t){if(typeof t!="string")throw new Error(`Invalid value for '${e}'. Got: ${JSON.stringify(t)}, expected a string.`)}function I(e,t){if(typeof t!="function")throw new Error(`Invalid value for '${e}'. Got: ${JSON.stringify(t)}, expected a function.`)}function Z(e){return e===null||typeof e!="object"?!1:Object.getPrototypeOf(e)===Object.prototype}function b(e,t){if(!Z(t))throw new Error(`Invalid value for '${e}'. Got: ${JSON.stringify(t)}, expected a plain object.`)}function q(e){return/^[a-z][a-zA-Z0-9]*$/.test(e)}function T(e,t){b(e,t);let r=Object.keys(t);if(r.length===0)return;if(!r.every(q))throw new Error(`Invalid value for '${e}'. Got: ${JSON.stringify(t)}, expected a plain object with camelCase keys.`)}function G(e,t){if(!(L(t)||X(t)))throw new Error(`Invalid value for '${e}'. Got: ${JSON.stringify(t)}, expected a valid URL.`)}var j=/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+/;function L(e){if(typeof e!="string"||!j.test(e))return!1;try{return new URL(e),!0}catch(t){return!1}}function X(e){if(typeof e!="string"||!j.test(e))return!1;try{return new URL(e,"http://example.com"),!0}catch(t){return!1}}var p={ADDED:"added",ALREADY_ADDED:"already-added",ALREADY_ADDED_UNMANAGED:"already-added (unmanaged)",SKIPPED:"skipped",ERROR:"error"},ee=["async","defer","blocking"],B=["","high","low","auto"],te=["","anonymous","use-credentials"],J=["","no-referrer","no-referrer-when-downgrade","origin","origin-when-cross-origin","same-origin","strict-origin","strict-origin-when-cross-origin","unsafe-url"];function x(){}function m(){return globalThis.window}var re=M(({ttlInSeconds:e=1/0},t)=>(e!==1/0&&setTimeout(t,e*1e3),{invalidate:t}),{getKey:({src:e,ignoreQueryString:t=!0})=>{if(!t)return e;let[r]=e.split("?");return r}});function oe(e,t){let{ignoreQueryString:r=!0}=t||{},n=L(e)?e:new URL(e,m().location.href).href;return!!ne().find(i=>{let c=i.src||"";if(!r)return c===n;let[f]=c.split("?");return f===n})}function ne(){let e=m().document.getElementsByTagName("script");return Array.from(e).filter(t=>t.type!=="importmap").filter(t=>t.src)}function R(e,t){v("src",e),G("src",e);let{skipLoading:r=x}=t||{};if(I("skipLoading",r),r!==x&&r(e))return p.SKIPPED;let{isModule:n=!1,loadBehavior:o="async",fetchPriority:i="",noopIfModulesSupported:c=!1,ignoreQueryString:f=!0,security:g={},dataSet:u={}}=t||{};d("isModule",n,O),d("loadBehavior",o,ee),d("fetchPriority",i,B),d("noopIfModulesSupported",c,O),d("ignoreQueryString",f,O),b("security",g),T("dataSet",u);let{onLoad:y=x,onError:h=x}=t||{};I("onLoad",y),I("onError",h);let a=re({src:e,ignoreQueryString:f});if(a.promise instanceof Promise)return a.promise.then(y,h),a.scriptElement?p.ALREADY_ADDED:p.ALREADY_ADDED_UNMANAGED;if(oe(e,{ignoreQueryString:f}))return a.promise=Promise.resolve(),a.promise.then(y,h),p.ALREADY_ADDED_UNMANAGED;let{crossOrigin:E="",nonce:N="",integrity:D="",referrerPolicy:S=""}=g||{};d("crossOrigin",E,te),v("nonce",N),v("integrity",D),d("referrerPolicy",S,J);let A;if(D){if(!["","anonymous"].includes(E))throw new Error(`When 'integrity' is specified, 'crossOrigin' must be "anonymous".
It is currently set to "${E}".

You can also remove the 'crossOrigin' option; it will be set to
"anonymous" automatically if 'integrity' is specified.`);A="anonymous"}else A=E,L(e)&&e.indexOf(m().location.origin)!==0&&console.warn(`The script "${e}" is being loaded from a different origin
to the current page. It is recommended that you use the
'integrity' option to ensure the script has not been
tampered with.`);let z={...n?{type:"module"}:{},...c?{noModule:!0}:{},...o==="async"?{async:!0}:{},...o==="defer"?{defer:!0}:{},...i&&B.includes(i)?{fetchPriority:i}:{},...N?{nonce:N}:{},...D?{integrity:D}:{},...A?{crossOrigin:A}:{},...S&&J.includes(S)?{referrerPolicy:S}:{},...Object.keys(u).length?{dataset:u}:{},src:e},s=m().document.createElement("script");return a.src=e,a.scriptElement=s,a.promise=new Promise((U,k)=>{function C(){var l,w,_;(l=a.invalidate)==null||l.call(a),(_=(w=s==null?void 0:s.parentNode)==null?void 0:w.removeChild)==null||_.call(w,s)}s.addEventListener("load",l=>{s.removeEventListener("load",U),U({event:l,removeScriptTag:C})}),s.addEventListener("error",l=>{C(),s.removeEventListener("error",k),k({event:l,removeScriptTag:C})})}),a.promise.then(y,h),Object.assign(s,z),o==="defer"?m().document.head.appendChild(s):m().document.body.appendChild(s),p.ADDED}function P(e,t){return new Promise((r,n)=>{let o=R(e,{...t,onLoad:i=>r({type:"added",...i}),onError:i=>n({type:"error",...i})});o!=="added"&&r({type:o})})}function Y({useState:e,useEffect:t}){function r(n,o){let[i,c]=e("pending"),[f,g]=e();return t(()=>{c("loading"),P(n,o).then(u=>{c("loaded"),g(u)}).catch(u=>{c("error"),g(u)})},[n]),[i,f]}return r}return V(ie);})();
