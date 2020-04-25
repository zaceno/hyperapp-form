import{h}from"hyperapp";var error=e=>({errors:t})=>{let r=Object.entries(t).reduce((e,[t,r])=>e||r,"");return h("p",{...e,class:"error",hidden:!r},r)},widget=(e,t,r)=>({values:a,errors:s,submitted:o,register:i,SetValues:l,SetErrors:d})=>{t&&i((r,a)=>({...r,[e]:t(a[e],a)}));const n=[l,t=>({...a,[e]:t})],u=t?[d,r=>({...s,[e]:t(r,a)})]:e=>e;return r({disabled:o,value:a[e],error:s[e],Set:n,Validate:u})};const effect=(e=>t=>(...r)=>[e,{f:t,a:r}])((e,{f:t,a:r})=>t(e,...r)),preventDefault=effect((e,t)=>t.preventDefault()),dispatch=effect((e,t,r)=>e(t,r));var batch=(...e)=>(t,r)=>[t,...e.map(e=>dispatch(e,r))],check=e=>widget(e.name,e.validator,({value:t,error:r,disabled:a,Set:s,Validate:o},i=e.value||"on")=>h("input",{...e,type:"checkbox",class:[e.class,{error:r}],disabled:a,checked:Array.isArray(t)?t.indexOf(i)>=0:t===i,name:e.name,value:i,onchange:[batch(s,o),(e,r=[...(t?Array.isArray(t)?t:[t]:[]).filter(e=>e!==i),...e.target.checked?[i]:[]])=>r.length>1?r:1==r.length?r[0]:""]})),radio=e=>widget(e.name,e.validator,({value:t,error:r,disabled:a,Set:s,Validate:o})=>h("input",{...e,type:"radio",class:[e.class,{error:r}],value:e.value||"on",disabled:a,checked:t===(e.value||"on"),onchange:[batch(s,o),e.value||"on"]})),input=e=>"checkbox"===e.type?check(e):"radio"===e.type?radio(e):widget(e.name,e.validator,({value:t,error:r,disabled:a,Set:s,Validate:o})=>h("input",{...e,disabled:a,type:e.type||"text",class:[e.class,{error:!!r}],value:t,oninput:[r?batch(s,o):s,e=>e.target.value],...void 0===t?{}:{onblur:[o,t]}})),button=(e,t)=>({submitted:r})=>h("button",{...e,type:e.type||"button",disabled:r},t),init=(e={},t={})=>({values:e,errors:t,submitted:!1});const Submit=(e,{event:t,onsubmit:r,validators:a,getFormState:s,setFormState:o})=>{let i=s(e);if(i.submitted)return e;let l=a.reduce((e,t)=>t(e,i.values),{}),d=Object.entries(l).reduce((e,[t,r])=>e&&!r,!0);return[o(e,{...i,errors:l,submitted:d}),d&&dispatch(r,i.values),preventDefault(t)]},_Set=(e,t,r,a=t.getFormState(e))=>a.submitted?e:[t.setFormState,{...a,[r]:t[r]}],SetValues=(e,t)=>_Set(e,t,"values"),SetErrors=(e,t)=>_Set(e,t,"errors"),provide=(e,t)=>Array.isArray(t)?t.map(t=>provide(e,t)).flat():"function"==typeof t?provide(e,t(e)):"function"==typeof t.name?provide(e,t.name(e)):{...t,children:provide(e,t.children)};var form=({state:e,getFormState:t,setFormState:r,onsubmit:a},s)=>{const o=[],i=e=>({...e,setFormState:r,getFormState:t});return h("form",{onsubmit:[Submit,e=>i({event:e,onsubmit:a,validators:o})]},provide({...e,register:e=>o.push(e),SetValues:[SetValues,e=>i({values:e})],SetErrors:[SetErrors,e=>i({errors:e})]},s))},select=(e,t)=>widget(e.name,e.validator,({value:r,error:a,disabled:s,Set:o,Validate:i})=>h("select",{...e,class:[e.class,{error:a}],name:e.name,value:r,disabled:s,oninput:[batch(o,i),e=>e.target.value]},t.map(e=>"option"!==e.name||!r||e.props.value!==r&&e.children[0].name!==r?e:{...e,props:{...e.props,selected:!0}})));export{batch,button,error,form,init,input,provide,select,widget};