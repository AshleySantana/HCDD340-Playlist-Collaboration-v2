/**
 * @fileoverview A module for managing and displaying a user's profile status
 * (e.g., 'online', 'away', 'busy', 'offline').
 * The status is stored in and retrieved from localStorage.
 * It also handles updating the status indicator and label in the DOM.
 */
(function(window){
  /**
   * The key used to store the profile status in localStorage.
   * @const {string}
   */
  const KEY = 'profileStatus';

  /**
   * Sets the user's profile status, stores it in localStorage, and updates the DOM.
   * Uses a try-catch block to gracefully handle potential localStorage errors (e.g., quota exceeded, security restrictions).
   *
   * @param {string} status The new status value (e.g., 'online', 'away', 'busy').
   */
  function set(status){
    try{ localStorage.setItem(KEY, status); }catch(e){}
    applyToDom(status);
  }

  /**
   * Retrieves the user's profile status from localStorage.
   * Defaults to 'online' if no status is found or if localStorage is inaccessible.
   *
   * @returns {string} The current profile status.
   */
  function get(){
    try{ return localStorage.getItem(KEY) || 'online'; }catch(e){ return 'online'; }
  }

  /**
   * Converts the raw status string into a human-readable, formatted string.
   *
   * @param {string|null|undefined} status The raw status string (e.g., 'online', 'busy').
   * @returns {string} The display-friendly status string (e.g., 'Online', 'Busy (DND)', 'Offline').
   */
  function pretty(status){
    if(!status) return 'Offline';
    return status === 'busy' ? 'Busy (DND)' : (status.charAt(0).toUpperCase() + status.slice(1));
  }

  /**
   * Updates the DOM elements responsible for displaying the status.
   * Specifically targets an element with ID 'statusIndicator' and an element with ID 'statusLabel'.
   *
   * For the 'statusIndicator':
   * - Sets the `data-status` attribute.
   * - Cleans up existing 's-*' classes and adds the class corresponding to the new status (e.g., 's-online').
   * - Sets the `title` attribute using the pretty-formatted status.
   *
   * @param {string|null|undefined} status The current status to apply to the DOM.
   */
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

  /**
   * Initializes the status module.
   * 1. Retrieves the saved status from localStorage and applies it to the DOM.
   * 2. If an element with ID 'statusSelect' exists (assumed to be a `<select>` dropdown),
   * it sets its value to the saved status and attaches a 'change' event listener
   * to call `set()` whenever the selection changes.
   * 3. Optionally attempts to load and display a saved profile name from localStorage
   * to the element with ID 'profileName'.
   */
  function init(){
    const saved = get();
    applyToDom(saved);

    const select = document.getElementById('statusSelect');
    if(select){
      select.value = saved;
      // Attach event listener to update status when the select value changes
      select.addEventListener('change', function(e){ set(e.target.value); });
    }

    // optionally load profile name
    try{
      const name = localStorage.getItem('profileName');
      if(name){ const el = document.getElementById('profileName'); if(el) el.textContent = name; }
    }catch(e){}
  }

  /**
   * Exposes the public API for the ProfileStatus module to the global window object.
   * @global
   * @namespace ProfileStatus
   */
  window.ProfileStatus = {
    /** @method */
    set,
    /** @method */
    get,
    /** @method */
    init
  };

  /**
   * Automatically calls the initialization function once the DOM is fully loaded.
   */
  document.addEventListener('DOMContentLoaded', function(){ window.ProfileStatus.init(); });
})(window);