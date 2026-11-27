const UI = {
  toast(text) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = text;
    el.hidden = false;
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => { el.hidden = true; }, 1800);
  },

  fx(text, color) {
    const layer = document.getElementById('combat-fx');
    if (!layer) return;
    const el = document.createElement('div');
    el.className = 'fx-burst';
    el.textContent = text;
    el.style.color = color || '#f5c451';
    el.style.left = (30 + Math.random() * 40) + '%';
    el.style.top = (30 + Math.random() * 30) + '%';
    layer.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  },

  showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById('screen-' + name);
    if (el) el.classList.add('active');
    else console.warn('[UI] screen not found:', name);
  },

  modal(title, bodyHtml, actions) {
    const mTitle = document.getElementById('modal-title');
    const mBody = document.getElementById('modal-body');
    const mAct = document.getElementById('modal-actions');
    const modal = document.getElementById('modal');
    if (!mTitle || !mBody || !mAct || !modal) return;
    mTitle.textContent = title;
    mBody.innerHTML = bodyHtml;
    mAct.innerHTML = '';
    (actions || [{ label: 'حسنًا' }]).forEach(a => {
      const btn = document.createElement('button');
      btn.className = 'btn ' + (a.className || 'btn-primary');
      btn.textContent = a.label;
      btn.onclick = () => {
        AudioSystem.play('click');
        modal.hidden = true;
        if (a.onClick) a.onClick();
      };
      mAct.appendChild(btn);
    });
    modal.hidden = false;
  },

  updatePlayerChip() {
    const s = Game.state;
    const chip = document.getElementById('player-chip');
    if (!chip || !s) return;
    chip.innerHTML =
      '<div class="pc-name">لاعب المستوى ' + s.level + '</div>' +
      '<div class="pc-level">' + s.gold + ' 💰 · ' + s.skillPoints + ' ⭐</div>';
  },

  renderCreateScreen() {
    const grid = document.getElementById('element-grid');
    if (!grid) return;
    grid.innerHTML = '';
    Object.values(ELEMENTS).forEach(el => {
      const card = document.createElement('div');
      card.className = 'element-card';
      card.style.setProperty('--el-color', el.color);
      card.dataset.element = el.id;
      card.innerHTML =
        '<span class="element-icon">' + el.icon + '</span>' +
        '<div class="element-name">' + el.name + '</div>' +
        '<div class="element-desc">' + el.desc + '</div>';
      card.addEventListener('click', () => {
        AudioSystem.play('click');
        document.querySelectorAll('.element-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const confirmBtn = document.getElementById('btn-confirm-element');
        if (confirmBtn) confirmBtn.disabled = false;
        Game.pendingElement = el.id;
      });
      grid.appendChild(card);
    });
  },

  renderHub() {
    this.updatePlayerChip();
    const grid = document.getElementById('hub-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const tiles = [
      { key: 'world', icon: '🗺️', name: 'الخريطة', sub: 'استكشف العالم' },
      { key: 'skills', icon: '✨', name: 'المهارات', sub: 'تطوير سحرك' },
      { key: 'academy', icon: '🏰', name: 'الأكاديمية', sub: 'تعلم من المعلمين' },
      { key: 'character', icon: '👤', name: 'الشخصية', sub: 'تفاصيلك' },
      { key: 'quests', icon: '📜', name: 'المهام', sub: 'مهامك الحالية' },
      { key: 'inventory', icon: '🎒', name: 'الحقيبة', sub: 'ممتلكاتك' }
    ];
    tiles.forEach(t => {
      const tile = document.createElement('div');
      tile.className = 'hub-tile';
      tile.innerHTML =
        '<div class="tile-icon">' + t.icon + '</div>' +
        '<div class="tile-name">' + t.name + '</div>' +
        '<div class="tile-sub">' + t.sub + '</div>';
      tile.addEventListener('click', () => {
        AudioSystem.play('click');
        if (t.key === 'academy') { Game.showAcademy(); return; }
        UI.showScreen(t.key);
        const fn = UI['render' + t.key.charAt(0).toUpperCase() + t.key.slice(1)];
        if (typeof fn === 'function') fn.call(UI);
      });
      grid.appendChild(tile);
    });
  },

  renderCharacter() {
    const s = Game.state;
    const body = document.getElementById('character-body');
    if (!body || !s) return;
    const expNeeded = LEVEL_EXP(s.level);
    let html =
      '<div class="player-card">' +
        '<div class="pc-header"><h4>البطل</h4><span class="level-badge">المستوى ' + s.level + '</span></div>' +
        '<div class="bar bar-hp"><div class="bar-fill" style="width:' + (s.hp / s.maxHp * 100) + '%"></div></div>' +
        '<div class="bar-label"><span>HP</span><span>' + s.hp + ' / ' + s.maxHp + '</span></div>' +
        '<div class="bar bar-mp"><div class="bar-fill" style="width:' + (s.mp / s.maxMp * 100) + '%"></div></div>' +
        '<div class="bar-label"><span>MP</span><span>' + s.mp + ' / ' + s.maxMp + '</span></div>' +
        '<div class="bar bar-xp"><div class="bar-fill" style="width:' + (s.exp / expNeeded * 100) + '%"></div></div>' +
        '<div class="bar-label"><span>XP</span><span>' + s.exp + ' / ' + expNeeded + '</span></div>' +
        '<div class="stat-grid">' +
          '<div class="stat-box"><div class="stat-val">' + s.gold + '</div><div class="stat-name">ذهب</div></div>' +
          '<div class="stat-box"><div class="stat-val">' + s.skillPoints + '</div><div class="stat-name">نقاط مهارة</div></div>' +
          '<div class="stat-box"><div class="stat-val">' + s.elements.length + '</div><div class="stat-name">عناصر</div></div>' +
        '</div>' +
      '</div>' +
      '<h3 style="color:var(--gold);margin:16px 0 10px">عناصرك</h3>';

    html += s.elements.map(eid => {
      const el = ELEMENTS[eid];
      if (!el) return '';
      return '<div class="spell-item"><div class="spell-head"><span class="spell-name">' + el.icon + ' ' + el.name + '</span></div><div class="spell-desc">' + el.desc + '</div></div>';
    }).join('');

    if (s.fusions.length) {
      html += '<h3 style="color:var(--gold);margin:16px 0 10px">الاندماجات المكتشفة</h3>';
      html += s.fusions.map(fid => {
        const f = FUSIONS.find(x => x.id === fid);
        if (!f) return '';
        return '<div class="spell-item"><div class="spell-head"><span class="spell-name">' + f.icon + ' ' + f.name + '</span></div><div class="spell-desc">' + f.desc + '</div></div>';
      }).join('');
    }
    body.innerHTML = html;
  },

  renderSkills() {
    const s = Game.state;
    if (!s) return;
    const tabs = document.getElementById('skill-tabs');
    const body = document.getElementById('skill-body');
    if (!tabs || !body) return;

    tabs.innerHTML = '';
    s.elements.forEach(eid => {
      const el = ELEMENTS[eid];
      if (!el) return;
      const t = document.createElement('button');
      t.className = 'tab-btn' + (eid === s._skillTab ? ' active' : '');
      t.textContent = el.icon + ' ' + el.name;
      t.onclick = () => { AudioSystem.play('click'); s._skillTab = eid; UI.renderSkills(); };
      tabs.appendChild(t);
    });

    const current = s._skillTab || s.elements[0];
    const el = ELEMENTS[current];
    if (!el) return;

    let html = '<h4 style="color:var(--gold);margin-bottom:12px">' + el.icon + ' ' + el.name + ' — نقاطك: ' + s.skillPoints + '</h4>';
    el.spells.forEach(spell => {
      const key = current + '_' + spell.id;
      const unlocked = s.unlockedSpells.includes(key);
      const canUnlock = !unlocked && s.skillPoints >= spell.tier;
      html +=
        '<div class="spell-item ' + (unlocked ? '' : 'locked') + '">' +
          '<div class="spell-head"><span class="spell-name">' + spell.icon + ' ' + spell.name + '</span><span class="spell-tier">' + spell.tier_name + '</span></div>' +
          '<div class="spell-desc">ضرر: ' + (spell.dmg >= 0 ? spell.dmg : 'شفاء') + ' · تكلفة: ' + spell.cost + ' MP</div>' +
          '<div style="margin-top:8px">' +
            (unlocked
              ? '<span style="color:var(--success);font-size:12px">✓ مفتوحة</span>'
              : '<button class="btn btn-primary" style="padding:8px 16px;font-size:13px;min-height:auto" ' + (canUnlock ? '' : 'disabled') +
                ' onclick="Game.unlockSpell(\'' + current + '\',\'' + spell.id + '\')">فتح (' + spell.tier + ' ⭐)</button>'
            ) +
          '</div>' +
        '</div>';
    });

    if (s.elements.length >= 2) {
      html += '<h4 style="color:var(--purple-glow);margin:20px 0 12px">✨ الاندماجات</h4>';
      FUSIONS.forEach(f => {
        if (!s.elements.includes(f.a) || !s.elements.includes(f.b)) return;
        const discovered = s.fusions.includes(f.id);
        const canDiscover = !discovered && s.skillPoints >= 2;
        html +=
          '<div class="spell-item ' + (discovered ? '' : 'locked') + '">' +
            '<div class="spell-head"><span class="spell-name">' + f.icon + ' ' + f.name + '</span><span class="spell-tier">' + ELEMENTS[f.a].name + ' + ' + ELEMENTS[f.b].name + '</span></div>' +
            '<div class="spell-desc">' + f.desc + ' · ضرر ' + f.dmg + ' · ' + f.cost + ' MP</div>' +
            (discovered
              ? '<span style="color:var(--success);font-size:12px">✓ مكتشف</span>'
              : '<button class="btn btn-primary" style="padding:8px 16px;font-size:13px;margin-top:8px;min-height:auto" ' + (canDiscover ? '' : 'disabled') +
                ' onclick="Game.discoverFusion(\'' + f.id + '\')">اكتشاف (2 ⭐)</button>'
            ) +
          '</div>';
      });
    }

    body.innerHTML = html;
  },

  renderQuests() {
    const s = Game.state;
    const body = document.getElementById('quests-body');
    if (!body || !s) return;
    const active = QUESTS.filter(q => s.questStates[q.id] === 'active');
    const done = QUESTS.filter(q => s.questStates[q.id] === 'done');
    const locked = QUESTS.filter(q => s.questStates[q.id] === 'locked');

    let html = '';
    if (active.length) {
      html += '<h4 style="color:var(--gold);margin-bottom:10px">نشطة</h4>';
      active.forEach(q => { html += this.questHtml(q, s); });
    }
    if (done.length) {
      html += '<h4 style="color:var(--success);margin:16px 0 10px">مكتملة</h4>';
      done.forEach(q => { html += this.questHtml(q, s); });
    }
    if (locked.length) {
      html += '<h4 style="color:var(--text-dim);margin:16px 0 10px">مقفلة</h4>';
      locked.forEach(q => { html += this.questHtml(q, s); });
    }
    body.innerHTML = html || '<div class="empty-msg">لا مهام حاليًا</div>';
  },

  questHtml(q, s) {
    const prog = s.questProgress[q.id] || {};
    const objText = q.objectives.map(o => {
      const cur = prog[o.type] || 0;
      return '<div class="quest-obj">• ' + cur + ' / ' + o.count + '</div>';
    }).join('');
    const r = q.reward || {};
    const rw = '+' + (r.exp || 0) + ' XP · +' + (r.gold || 0) + ' 💰' + (r.skill ? ' · +' + r.skill + ' ⭐' : '');
    return (
      '<div class="quest-item ' + (s.questStates[q.id] === 'done' ? 'done' : '') + '">' +
        '<div class="quest-title">' + q.name + '</div>' +
        '<div class="quest-desc">' + q.desc + '</div>' +
        objText +
        '<div class="quest-rewards">' + rw + '</div>' +
      '</div>'
    );
  },

  renderInventory() {
    const s = Game.state;
    const body = document.getElementById('inventory-body');
    if (!body || !s) return;
    const items = [
      { icon: '💰', name: 'ذهب', count: s.gold },
      { icon: '⭐', name: 'نقاط مهارة', count: s.skillPoints },
      { icon: '🔮', name: 'اندماجات', count: s.fusions.length },
      { icon: '📜', name: 'مهام مكتملة', count: Object.values(s.questStates).filter(v => v === 'done').length }
    ];
    body.innerHTML = '<div class="inv-grid">' + items.map(i =>
      '<div class="inv-item"><div class="ii-icon">' + i.icon + '</div><div class="ii-count">' + i.count + '</div><div style="font-size:10px;color:var(--text-dim)">' + i.name + '</div></div>'
    ).join('') + '</div>';
  },

  renderWorld() {
    const s = Game.state;
    const body = document.getElementById('world-body');
    if (!body || !s) return;
    body.innerHTML = ZONES.map(z => {
      const unlocked = s.unlockedZones.includes(z.id);
      return (
        '<div class="world-zone ' + (unlocked ? '' : 'locked') + '" data-zone="' + z.id + '">' +
          '<div class="zone-info">' +
            '<div class="zone-name">' + z.icon + ' ' + z.name + '</div>' +
            '<div class="zone-desc">' + z.desc + '</div>' +
          '</div>' +
          '<div class="zone-lvl">Lv.' + z.level + '</div>' +
        '</div>'
      );
    }).join('');

    body.querySelectorAll('.world-zone').forEach(el => {
      el.addEventListener('click', () => {
        const z = ZONES.find(x => x.id === el.dataset.zone);
        if (!z) return;
        if (!s.unlockedZones.includes(z.id)) {
          AudioSystem.play('error');
          return UI.toast('منطقة مقفلة — أكمل المتطلبات');
        }
        Game.enterZone(z);
      });
    });
  },

  renderAcademy() {
    const s = Game.state;
    const body = document.getElementById('academy-body');
    if (!body || !s) return;
    body.innerHTML =
      '<h3 style="color:var(--gold);margin-bottom:12px">المعلمون</h3>' +
      TEACHERS.map(t => {
        const known = s.elements.includes(t.element);
        return (
          '<div class="spell-item">' +
            '<div class="spell-head"><span class="spell-name">' + t.icon + ' ' + t.name + '</span><span class="spell-tier">' + ELEMENTS[t.element].name + '</span></div>' +
            '<div class="spell-desc">"' + t.line + '"</div>' +
            '<button class="btn ' + (known ? 'btn-ghost' : 'btn-primary') + '" style="padding:8px 16px;font-size:13px;margin-top:8px;min-height:auto" ' + (known ? 'disabled' : '') +
              ' onclick="Game.learnFromTeacher(\'' + t.element + '\')">' +
              (known ? '✓ تعلمت هذا العنصر' : 'تعلم أساسيات العنصر (100 💰)') +
            '</button>' +
          '</div>'
        );
      }).join('');
  },

  updateCombatBars() {
    const s = Combat.state;
    if (!s) return;
    const enemyFill = document.getElementById('enemy-hp-fill');
    if (enemyFill) enemyFill.style.width = (s.enemy.hp / s.enemy.maxHp * 100) + '%';

    const bars = document.getElementById('player-bars');
    if (bars) {
      bars.innerHTML =
        '<div class="bar bar-hp"><div class="bar-fill" style="width:' + (s.playerHp / s.playerMaxHp * 100) + '%"></div></div>' +
        '<div class="bar-label"><span>HP</span><span>' + s.playerHp + ' / ' + s.playerMaxHp + '</span></div>' +
        '<div class="bar bar-mp"><div class="bar-fill" style="width:' + (s.playerMp / s.playerMaxMp * 100) + '%"></div></div>' +
        '<div class="bar-label"><span>MP</span><span>' + s.playerMp + ' / ' + s.playerMaxMp + '</span></div>';
    }

    document.querySelectorAll('.spell-btn').forEach(btn => {
      const id = btn.dataset.spellId;
      const cd = s.cooldowns[id] || 0;
      const remain = cd - Date.now();
      if (remain > 0) {
        btn.classList.add('cooling');
        const ov = btn.querySelector('.cd-overlay');
        if (ov) ov.textContent = Math.ceil(remain / 1000) + 's';
      } else {
        btn.classList.remove('cooling');
      }
      const spell = Game.findSpell(id);
      if (spell) btn.disabled = s.playerMp < spell.cost;
    });

    if (!s._cdTimer) {
      s._cdTimer = setInterval(() => {
        if (Combat.state && !Combat.state.ended) UI.updateCombatBars();
        else { clearInterval(s._cdTimer); s._cdTimer = null; }
      }, 250);
    }
  }
};