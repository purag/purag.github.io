function get(t,e){const o=new XMLHttpRequest;o.addEventListener("load",function(){e(JSON.parse(o.response))}),o.open("GET",t,!0),o.send()}get("//api.stackexchange.com/2.2/users/814761?site=stackoverflow",t=>{const e=t.items[0].reputation,o=100*Math.floor(e/100);document.querySelector(".so-reputation").textContent=o.toLocaleString()});class NavSection{constructor(t){this.navElem=t;const e=document.querySelector(t.getAttribute("href")).getBoundingClientRect();this.bounds={top:e.top+window.scrollY,bottom:e.bottom+window.scrollY}}shouldBeActive(){return window.scrollY>=this.bounds.top&&window.scrollY<=this.bounds.bottom}activate(){NavSection.active&&NavSection.active.deactivate(),this.navElem.classList.add("active"),NavSection.active=this}deactivate(){this.navElem.classList.remove("active"),NavSection.active=null}}const navSections=Array.from(document.querySelectorAll(".sub a")).map(t=>new NavSection(t));navSections[0].activate(),window.addEventListener("scroll",()=>{for(let t of navSections)t.shouldBeActive()&&t.activate()});