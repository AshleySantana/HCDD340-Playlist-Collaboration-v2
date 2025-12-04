(function(window){
  const KEY = 'profileStatus';
  function set(status){
    try{ localStorage.setItem(KEY, status); }catch(e){}
    applyToDom(status);
  }
  function get(){
    try{ return localStorage.getItem(KEY) || 'online'; }catch(e){ return 'online'; }
  }
  function pretty(status){
    if(!status) return 'Offline';
    return status === 'busy' ? 'Busy (DND)' : (status.charAt(0).toUpperCase() + status.slice(1));
  }
  function applyToDom(status){
    const indicator = document.getElementById('statusIndicator');
    const label = document.getElementById('statusLabel');
    if(indicator){
      indicator.setAttribute('data-status', status);
      indicator.classList.remove('s-online','s-away','s-busy','s-offline');
      indicator.classList.add('s-' + (status||'offline'));
      indicator.title = pretty(status);
    }
    if(label) label.textContent = pretty(status);
  }
  function init(){
    const saved = get();
    applyToDom(saved);
    const select = document.getElementById('statusSelect');
    if(select){
      select.value = saved;
      select.addEventListener('change', function(e){ set(e.target.value); });
    }
    // optionally load profile name
    try{
      const name = localStorage.getItem('profileName');
      if(name){ const el = document.getElementById('profileName'); if(el) el.textContent = name; }
    }catch(e){}
  }
  window.ProfileStatus = { set, get, init };
  document.addEventListener('DOMContentLoaded', function(){ window.ProfileStatus.init(); });
})(window);
