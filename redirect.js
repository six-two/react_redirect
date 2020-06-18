// an automatic and slimmed down version of decode.js
function fr(){
  let u = new URL(window.location.href);
  let h = u.hash;
  let r;
  let p = [...u.searchParams.values()];
  if (h) {
    h = h.substr(1);
    r = fs(h);
    if (r){
      return r;
    }
    p = [...p, ...new URLSearchParams(h).values()];
  }
  for (let v of p.reverse()) {
    r = fs(v);
    if (r) {
      return r;
    }
  }
}

function fs(s){
  try{
    if (s.startsWith("LNK")){
      s = s.substr(3).replace(/-/g, '+').replace(/_/g, '/');
      let l = s.length % 4;
      if (l !== 0) {
        s += ('===').slice(0, 4 - l);
      }
      s = atob(s);
      return s.match(/^https?:\/\//)?s:"";
    }
  }catch{
  }
}

let r = fr();
if (r) {window.location.replace(r);}
