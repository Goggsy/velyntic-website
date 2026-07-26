/* ============================================================
   VELYNTIC — Generic one-question-at-a-time form wizard
   Used by brand-foundation-intake.html and web-design-intake.html
   ============================================================ */
function initWizard(formId, thankYouId) {
  const form = document.getElementById(formId);
  if (!form) return;
  const panel = form.closest('.wiz-panel');
  const allSteps = Array.from(form.querySelectorAll('.wiz-step'));
  const fillEl = panel.querySelector('.wiz-fill');
  const countEl = panel.querySelector('.wiz-count');
  let cur = 0;
  let visible = allSteps;

  function computeVisible() {
    visible = allSteps.filter(function (s) {
      const cond = s.dataset.showIf;
      if (!cond) return true;
      const parts = cond.split('=');
      const field = form.querySelector('[name="' + parts[0] + '"]');
      return field && field.value === parts[1];
    });
    if (cur > visible.length - 1) cur = visible.length - 1;
    if (cur < 0) cur = 0;
  }

  function render() {
    computeVisible();
    allSteps.forEach(function (s) { s.classList.remove('wiz-active'); });
    visible.forEach(function (s, i) { if (i === cur) s.classList.add('wiz-active'); });
    const total = visible.length;
    countEl.textContent = 'Question ' + (cur + 1) + ' of ' + total;
    fillEl.style.width = (total > 1 ? Math.round((cur / (total - 1)) * 100) : 100) + '%';
    const backBtn = visible[cur].querySelector('.wiz-back-btn');
    if (backBtn) backBtn.classList.toggle('hidden-vis', cur === 0);
    const nextBtn = visible[cur].querySelector('.wiz-next-btn');
    if (nextBtn) nextBtn.textContent = cur === visible.length - 1 ? (nextBtn.dataset.submitLabel || 'Submit') : (nextBtn.dataset.label || 'Next');
  }

  function hideWarn(stepEl) {
    const w = stepEl.querySelector('.wiz-warn');
    if (w) w.style.display = 'none';
  }
  function showWarn(stepEl) {
    const w = stepEl.querySelector('.wiz-warn');
    if (w) w.style.display = 'block';
  }

  function validateStep(stepEl) {
    let ok = true;
    stepEl.querySelectorAll('[data-required="true"]').forEach(function (req) {
      if (req.type === 'hidden') {
        if (!req.value) ok = false;
      } else if (req.type === 'checkbox') {
        // handled via group check below
      } else if (!req.value.trim()) {
        ok = false;
        req.style.borderColor = 'rgba(239,68,68,0.6)';
      }
    });
    // multi-select groups: require at least one checked checkbox in a required toggle group
    const requiredGroup = stepEl.querySelector('[data-toggle-group-required="true"]');
    if (requiredGroup) {
      const name = requiredGroup.dataset.toggleGroupRequired === 'true' ? requiredGroup.dataset.name : null;
    }
    stepEl.querySelectorAll('.wiz-toggle-grid[data-required="true"]').forEach(function (grid) {
      const anyChecked = grid.querySelectorAll('input[type="checkbox"]:checked').length > 0;
      if (!anyChecked) ok = false;
    });
    if (!ok) showWarn(stepEl); else hideWarn(stepEl);
    return ok;
  }

  function goNext() {
    const stepEl = visible[cur];
    if (!validateStep(stepEl)) return;
    if (cur < visible.length - 1) {
      cur++;
      render();
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      submitForm();
    }
  }
  function goBack() {
    if (cur > 0) { cur--; render(); }
  }

  // Never let Enter-key or stray submit events bypass the wizard's own flow
  form.addEventListener('submit', function (e) { e.preventDefault(); });

  form.querySelectorAll('.wiz-next-btn').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); goNext(); });
  });
  form.querySelectorAll('.wiz-back-btn').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); goBack(); });
  });

  // single-select buttons: set a hidden input, auto-advance
  form.querySelectorAll('.wiz-opt, .wiz-card').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const targetName = btn.dataset.target;
      const hidden = form.querySelector('input[name="' + targetName + '"]');
      if (hidden) hidden.value = btn.dataset.value;
      const group = btn.closest('.wiz-opts, .wiz-cards');
      group.querySelectorAll('.wiz-opt, .wiz-card').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      hideWarn(btn.closest('.wiz-step'));
      if (btn.dataset.autonext !== 'false') { setTimeout(goNext, 180); } else { render(); }
    });
  });

  // multi-select toggle buttons
  form.querySelectorAll('.wiz-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const name = btn.dataset.name;
      const value = btn.dataset.value;
      const checkbox = form.querySelector('input[type="checkbox"][name="' + name + '"][value="' + CSS.escape(value) + '"]');
      if (checkbox) checkbox.checked = !checkbox.checked;
      btn.classList.toggle('active', checkbox ? checkbox.checked : !btn.classList.contains('active'));
    });
  });

  function submitForm() {
    const submitBtn = visible[visible.length - 1].querySelector('.wiz-next-btn');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    }).then(showThankYou).catch(showThankYou);
  }
  function showThankYou() {
    form.style.display = 'none';
    const ty = document.getElementById(thankYouId);
    if (ty) ty.style.display = 'block';
  }

  render();
}
