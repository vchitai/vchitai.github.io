/* ============================================================
   Tai VONG — Portfolio archive (/projects/)

   Search and filtering for the archive. Strictly an enhancement:
   the server-rendered page already contains every entry, grouped
   under plain anchor-linked headings. This script only runs once
   it has found the controls AND the entries, and its first act is
   to swap the no-JS category index for the live toolbar.

   No external dependencies.
   ============================================================ */
(function () {
  'use strict';

  var SEARCH_DEBOUNCE = 180;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    var toolbar = document.querySelector('[data-projects-toolbar]');
    var list = document.querySelector('[data-projects-list]');
    if (!toolbar || !list) return;

    var cardNodes = list.querySelectorAll('[data-project]');
    if (!cardNodes.length) return;

    var index = document.querySelector('[data-projects-index]');
    var searchInput = toolbar.querySelector('[data-projects-search]');
    var countEl = toolbar.querySelector('[data-projects-count]');
    var emptyEl = document.querySelector('[data-projects-empty]');
    var clearButtons = document.querySelectorAll('[data-projects-clear]');
    var groups = list.querySelectorAll('[data-category-section]');
    var categoryButtons = toolbar.querySelectorAll('[data-filter-category]');
    var techButtons = toolbar.querySelectorAll('[data-filter-tech]');

    // Cache the searchable fields once — the DOM is not re-read per keystroke.
    var cards = Array.prototype.map.call(cardNodes, function (node) {
      return {
        node: node,
        category: node.getAttribute('data-category') || '',
        tech: node.getAttribute('data-tech') || '',
        search: node.getAttribute('data-search') || ''
      };
    });

    var total = cards.length;
    var state = { query: '', category: 'all', tech: 'all' };
    var searchTimer = null;

    // Hand control over to the toolbar only now that everything resolved.
    if (index) index.hidden = true;
    toolbar.hidden = false;

    function matches(card) {
      if (state.category !== 'all' && card.category !== state.category) return false;
      if (state.tech !== 'all' && card.tech.indexOf('|' + state.tech + '|') === -1) return false;
      if (state.query) {
        var tokens = state.query.split(/\s+/).filter(Boolean);
        for (var i = 0; i < tokens.length; i++) {
          if (card.search.indexOf(tokens[i]) === -1) return false;
        }
      }
      return true;
    }

    function isFiltered() {
      return state.query !== '' || state.category !== 'all' || state.tech !== 'all';
    }

    function describe(shown) {
      if (!isFiltered()) return 'Showing all ' + total + ' entries.';
      if (shown === 0) return 'No entries match the current search and filters.';
      if (shown === 1) return 'Showing 1 entry of ' + total + '.';
      return 'Showing ' + shown + ' entries of ' + total + '.';
    }

    function apply() {
      var shown = 0;
      var i;

      for (i = 0; i < cards.length; i++) {
        var visible = matches(cards[i]);
        cards[i].node.hidden = !visible;
        if (visible) shown++;
      }

      // A category heading with nothing under it is noise — hide the whole group.
      Array.prototype.forEach.call(groups, function (group) {
        var groupCards = group.querySelectorAll('[data-project]');
        var groupShown = 0;
        Array.prototype.forEach.call(groupCards, function (node) {
          if (!node.hidden) groupShown++;
        });
        group.hidden = groupShown === 0;
        var countEls = group.querySelectorAll('[data-group-count]');
        Array.prototype.forEach.call(countEls, function (el) {
          el.textContent = groupShown + (groupShown === 1 ? ' entry' : ' entries');
        });
      });

      if (countEl) countEl.textContent = describe(shown);
      if (emptyEl) emptyEl.hidden = shown !== 0;
      list.hidden = shown === 0;

      Array.prototype.forEach.call(clearButtons, function (button) {
        button.hidden = !isFiltered();
      });
    }

    function selectInGroup(buttons, attribute, value) {
      Array.prototype.forEach.call(buttons, function (button) {
        var isActive = button.getAttribute(attribute) === value;
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    }

    function bindFilterGroup(buttons, attribute, key) {
      Array.prototype.forEach.call(buttons, function (button) {
        button.addEventListener('click', function () {
          state[key] = button.getAttribute(attribute) || 'all';
          selectInGroup(buttons, attribute, state[key]);
          apply();
        });
      });

      bindArrowKeys(buttons);
    }

    // Arrow keys move along a chip row; every chip stays tabbable so Tab
    // behaviour is unchanged for anyone not expecting the shortcut.
    function bindArrowKeys(buttons) {
      var ordered = Array.prototype.slice.call(buttons);

      ordered.forEach(function (button, position) {
        button.addEventListener('keydown', function (event) {
          var next = -1;
          if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            next = (position + 1) % ordered.length;
          } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            next = (position - 1 + ordered.length) % ordered.length;
          } else if (event.key === 'Home') {
            next = 0;
          } else if (event.key === 'End') {
            next = ordered.length - 1;
          }
          if (next === -1) return;
          event.preventDefault();
          ordered[next].focus();
        });
      });
    }

    function resetAll() {
      state.query = '';
      state.category = 'all';
      state.tech = 'all';
      if (searchInput) searchInput.value = '';
      selectInGroup(categoryButtons, 'data-filter-category', 'all');
      selectInGroup(techButtons, 'data-filter-tech', 'all');
      apply();
      if (searchInput) searchInput.focus();
    }

    bindFilterGroup(categoryButtons, 'data-filter-category', 'category');
    bindFilterGroup(techButtons, 'data-filter-tech', 'tech');

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function () {
          state.query = searchInput.value.trim().toLowerCase();
          apply();
        }, SEARCH_DEBOUNCE);
      });

      searchInput.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && searchInput.value !== '') {
          event.preventDefault();
          event.stopPropagation();
          searchInput.value = '';
          state.query = '';
          apply();
        }
      });
    }

    Array.prototype.forEach.call(clearButtons, function (button) {
      button.addEventListener('click', resetAll);
    });

    // "/" jumps to the search box, matching the prompt glyph next to it.
    document.addEventListener('keydown', function (event) {
      if (event.key !== '/' || !searchInput) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.isComposing) return;

      var consoleEl = document.getElementById('hb-console');
      if (consoleEl && !consoleEl.hidden) return;
      var boot = document.getElementById('hb-boot');
      if (boot && !boot.hidden) return;
      var mobileNav = document.querySelector('[data-mobile-nav]');
      if (mobileNav && mobileNav.classList.contains('is-open')) return;

      var active = document.activeElement;
      var tagName = active && active.tagName ? active.tagName.toLowerCase() : '';
      if (tagName === 'input' || tagName === 'textarea' || (active && active.isContentEditable)) return;

      event.preventDefault();
      searchInput.focus();
      searchInput.select();
    });

    apply();
  }

})();
