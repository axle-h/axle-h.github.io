(()=>{"use strict";var e={157:(e,t,n)=>{function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function s(e,t,n){return t&&r(e.prototype,t),n&&r(e,n),e}n(747);var a,l=n(622),o="hide",h="selected",u=Object.freeze({Type:"Type",Selected:"Selected",Delete:"Delete"}),c=function(){function e(t){var n=this;i(this,e),this.element=t,this.words=l(t.getElementsByClassName("headline-word")).map((function(e){return new d(e)})),this.index=0,this.state=u.Selected;for(var r=0;r<this.words.length;r++){var s=this.words[r];r!==this.index&&s.reset(),s.show()}setTimeout((function(){return n.animate()}),3e3)}return s(e,[{key:"animate",value:function(){var e=this,t=this.words[this.index],n=150;switch(this.state){case u.Selected:t.select(),this.state=u.Delete,n=400;break;case u.Delete:t.reset(),this.index=(this.index+1)%this.words.length,this.state=u.Type;break;case u.Type:t.type()||(this.state=u.Selected,n=1500)}setTimeout((function(){return e.animate()}),n)}}]),e}(),d=function(){function e(t){var n=this;i(this,e),this.element=t,this.index=0;for(var r=t.innerHTML.split("");this.element.firstChild;)this.element.removeChild(this.element.firstChild);this.letterElements=r.map((function(e){var t=document.createElement("span"),i=document.createTextNode(e);return t.appendChild(i),n.element.appendChild(t),t}))}return s(e,[{key:"show",value:function(){this.element.classList.remove(o)}},{key:"hide",value:function(){this.element.classList.add(o)}},{key:"select",value:function(){this.element.classList.add(h)}},{key:"reset",value:function(){this.element.classList.remove(h),this.letterElements.forEach((function(e){return e.classList.add(o)})),this.index=0}},{key:"type",value:function(){var e=void 0;do{var t=this.letterElements[this.index];if(t.classList.remove(o),e=t.innerHTML,++this.index===this.letterElements.length)return!1}while(" "===e);return!0}}]),e}();a=function(){new M.Sidenav(document.getElementById("nav-mobile"));var e=document.getElementById("headline-type");e&&new c(e);var t=document.getElementById("years");t&&function(e){var t=e.dataset.refYear;if(t){var n=new Date(Date.now()-new Date(t));e.innerText=Math.floor(n.getUTCFullYear()-1970)}}(t)},"loading"!==document.readyState?a():document.addEventListener("DOMContentLoaded",a)}},t={};function n(i){if(t[i])return t[i].exports;var r=t[i]={exports:{}};return e[i].call(r.exports,r,r.exports,n),r.exports}n.m=e,n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={179:0},t=[[157,908]],i=()=>{};function r(){for(var i,r=0;r<t.length;r++){for(var s=t[r],a=!0,l=1;l<s.length;l++){var o=s[l];0!==e[o]&&(a=!1)}a&&(t.splice(r--,1),i=n(n.s=s[0]))}return 0===t.length&&(n.x(),n.x=()=>{}),i}n.x=()=>{n.x=()=>{},a=a.slice();for(var e=0;e<a.length;e++)s(a[e]);return(i=r)()};var s=r=>{for(var s,a,[o,h,u,c]=r,d=0,f=[];d<o.length;d++)a=o[d],n.o(e,a)&&e[a]&&f.push(e[a][0]),e[a]=0;for(s in h)n.o(h,s)&&(n.m[s]=h[s]);for(u&&u(n),l(r);f.length;)f.shift()();return c&&t.push.apply(t,c),i()},a=self.webpackChunkaxle_h_github_io=self.webpackChunkaxle_h_github_io||[],l=a.push.bind(a);a.push=s})(),n.x()})();