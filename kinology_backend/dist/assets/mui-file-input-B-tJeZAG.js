import{u as d,j as o}from"./react-DRlJkGHI.js";import{s as I,T as Y,I as v,a as Z,b as G}from"./@mui-BySZQJ54.js";const R=["B","kB","MB","GB","TB","PB","EB","ZB","YB"],H=["B","KiB","MiB","GiB","TiB","PiB","EiB","ZiB","YiB"],K=["b","kbit","Mbit","Gbit","Tbit","Pbit","Ebit","Zbit","Ybit"],q=["b","kibit","Mibit","Gibit","Tibit","Pibit","Eibit","Zibit","Yibit"],A=(i,e,t)=>{let n=i;return typeof e=="string"||Array.isArray(e)?n=i.toLocaleString(e,t):(e===!0||t!==void 0)&&(n=i.toLocaleString(void 0,t)),n};function j(i,e){if(!Number.isFinite(i))throw new TypeError(`Expected a finite number, got ${typeof i}: ${i}`);e={bits:!1,binary:!1,space:!0,...e};const t=e.bits?e.binary?q:K:e.binary?H:R,n=e.space?" ":"";if(e.signed&&i===0)return` 0${n}${t[0]}`;const l=i<0,u=l?"-":e.signed?"+":"";l&&(i=-i);let r;if(e.minimumFractionDigits!==void 0&&(r={minimumFractionDigits:e.minimumFractionDigits}),e.maximumFractionDigits!==void 0&&(r={maximumFractionDigits:e.maximumFractionDigits,...r}),i<1){const s=A(i,e.locale,r);return u+s+n+t[0]}const f=Math.min(Math.floor(e.binary?Math.log(i)/Math.log(1024):Math.log10(i)/3),t.length-1);i/=(e.binary?1024:1e3)**f,r||(i=i.toPrecision(3));const h=A(Number(i),e.locale,r),p=t[f];return u+h+n+p}const J=I("label")`
  position: relative;
  flex-grow: 1;

  input {
    opacity: 0 !important;
  }

  & > span {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 2;
    display: flex;
    align-items: center;
  }

  span.MuiFileInput-placeholder {
    color: gray;
  }
`,O=I("div")`
  display: flex;
  width: 100%;

  & > span {
    display: block;
  }

  & > span:first-of-type {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  & > span:last-of-type {
    flex-shrink: 0;
    display: block;
  }
`,w={Label:J,Filename:O},Q=d.forwardRef((i,e)=>{const{text:t,isPlaceholder:n,placeholder:l,...u}=i,r=d.useId();return o.jsxs(w.Label,{htmlFor:r,children:[o.jsx("input",{...u,ref:e,id:r}),t?o.jsx("span",{"aria-placeholder":l,className:n?"MuiFileInput-placeholder":"",children:typeof t=="string"?t:o.jsxs(w.Filename,{children:[o.jsx("span",{children:t.filename}),o.jsxs("span",{children:[".",t.extension]})]})}):null]})});function V(i){return i.length>0}function W(i){return i.reduce((e,t)=>e+t.size,0)}function g(i){return typeof window<"u"&&i instanceof File}function X(i){return Array.from(i)}function _(i){var n;const e=(g(i)?i.name:((n=i[0])==null?void 0:n.name)||"").split("."),t=e.pop();return{filename:e.join("."),extension:t}}const U=typeof window<"u"?d.useLayoutEffect:d.useEffect,et=d.forwardRef((i,e)=>{var B;const{value:t,onChange:n,disabled:l,getInputText:u,getSizeText:r,placeholder:f,hideSizeText:h,inputProps:p,InputProps:s,multiple:y,className:P,clearIconButtonProps:M={},...T}=i,{className:E="",...N}=M,m=d.useRef(null),{startAdornment:k,...z}=s||{},C=y||(p==null?void 0:p.multiple)||((B=s==null?void 0:s.inputProps)==null?void 0:B.multiple)||!1,x=()=>{m.current&&(m.current.value="")},D=a=>{const F=a.target.files,b=F?X(F):[];y?(n==null||n(b),b.length===0&&x()):(n==null||n(b[0]||null),b[0]||x())},$=a=>{a.preventDefault(),!l&&(n==null||n(y?[]:null))},c=Array.isArray(t)?V(t):g(t);U(()=>{const a=m.current;a&&!c&&(a.value="")},[c]);const L=()=>t===null||Array.isArray(t)&&t.length===0?f||"":typeof u=="function"&&t!==void 0?u(t):t&&c?Array.isArray(t)&&t.length>1?`${t.length} files`:_(t):"",S=()=>{if(typeof r=="function"&&t!==void 0)return r(t);if(c){if(Array.isArray(t)){const a=W(t);return j(a)}if(g(t))return j(t.size)}return""};return o.jsx(Y,{ref:e,type:"file",disabled:l,onChange:D,className:`MuiFileInput-TextField ${P||""}`,InputProps:{startAdornment:o.jsx(v,{position:"start",children:k}),endAdornment:o.jsxs(v,{position:"end",style:{visibility:c?"visible":"hidden"},children:[h?null:o.jsx(Z,{variant:"caption",mr:"2px",lineHeight:1,className:"MuiFileInput-Typography-size-text",children:S()}),o.jsx(G,{"aria-label":"Clear",title:"Clear",size:"small",disabled:l,className:`${E} MuiFileInput-ClearIconButton`,onClick:$,...N})]}),...z,inputProps:{text:L(),multiple:C,ref:m,isPlaceholder:!c,placeholder:f,...p,...s==null?void 0:s.inputProps},inputComponent:Q},...T})});export{et as s};
