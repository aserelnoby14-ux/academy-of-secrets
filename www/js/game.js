const Game = {
  state: null,
  pendingElement: null,

  init() {
    document.getElementById('btn-continue').disabled = !SaveSystem.hasSave();
    document.querySelectorAll('[data-action]').forEach(el => {
      el.onclick = () => this.action(el.dataset.action);
    });
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.onclick = () => {
        const nav = el.dataset.nav;
        if (nav === 'hub') UI.showScreen('hub');
        else { UI.showScreen(nav); UI['render' + nav[0].toUpperCase() + nav.slice(1)](); }
      };
    });
    document.getElementById('btn-confirm-element').onclick = () => {
      if (this.pendingElement) this.startNewGame(this.pendingElement);
    };
  },

  action(a) {
    if (a === 'new-game') {
      UI.renderCreateScreen();
      UI.showScreen('create');
    } else if (a === 'continue-game') {
      const s = SaveSystem.load();
      if (s) { this.state = s; UI.showScreen('hub'); UI.renderHub(); }
    } else if (a === 'back-menu') UI.showScreen('menu');
    else if (a === 'show-help') this.showHelp();
  },

  showHelp() {
    UI.modal('كيف تلعب؟',
      `<p>• اختر عنصرًا أوليًا لتبدأ.</p>
       <p>• اذهب للأكاديمية لتعلم عناصر جديدة من المعلمين.</p>
       <p>• افتح المهارات بنقاط المهارة.</p>
       <p>• في القتال: اضغط المهارة لتنفيذها، أو تفادى هجمات العدو.</p>
       <p>• الجمع بين عنصرين يفتح اندماجات قوية.</p>`,
      [{label:'فهمت', className:'btn-primary'}]);
  },

  startNewGame(element) {
    this.state = {
      level: 1, exp: 0, hp: 100, maxHp: 100, mp: 60, maxMp: 60,
      gold: 50, skillPoints: 1,
      elements: [element],
      unlockedSpells: [element + '_' + ELEMENTS[element].spells[0].id],
      fusions: [],
      unlockedZones: ['academy'],
      questStates: {q_intro:'active', q_side1:'active', q_side2:'active', q_explore:'active'},
      questProgress: {q_intro:{talk_teacher:0}, q_first_lesson:{complete_lesson:0}, q_first_fight:{kill:0}, q_explore:{unlock_zone:0}, q_fusion:{fusion:0}, q_boss:{kill_boss:0}, q_side1:{kill_zone:0}, q_side2:{gold:0}},
      playedAt: Date.now()
    };
    SaveSystem.save(this.state);
    UI.showScreen('hub');
    UI.renderHub();
    UI.toast(`مرحبًا بك في أكاديمية الأسرار!`);
  },

  showAcademy() {
    UI.showScreen('academy');
    UI.renderAcademy();
  },

  learnFromTeacher(elementId) {
    const s = this.state;
    if (s.elements.includes(elementId)) return UI.toast('تعلمت هذا العنصر بالفعل');
    if (s.gold < 100) return UI.toast('تحتاج 100 ذهب للتعلم');
    s.gold -= 100;
    s.elements.push(elementId);
    const firstSpell = elementId + '_' + ELEMENTS[elementId].spells[0].id;
    if (!s.unlockedSpells.includes(firstSpell)) s.unlockedSpells.push(firstSpell);
    UI.toast(`تعلمت ${ELEMENTS[elementId].name}!`);
    this.trackQuest('talk_teacher');
    SaveSystem.save(s);
    UI.renderAcademy();
    UI.updatePlayerChip();
  },

  unlockSpell(element, spellId) {
    const s = this.state;
    const spell = ELEMENTS[element].spells.find(x => x.id === spellId);
    if (!spell) return;
    if (s.skillPoints < spell.tier) return UI.toast('نقاط مهارة غير كافية');
    s.skillPoints -= spell.tier;
    s.unlockedSpells.push(element + '_' + spellId);
    UI.toast(`فتحت ${spell.name}!`);
    SaveSystem.save(s);
    UI.renderSkills();
    UI.updatePlayerChip();
  },

  discoverFusion(fusionId) {
    const s = this.state;
    const f = FUSIONS.find(x => x.id === fusionId);
    if (!f) return;
    if (s.fusions.includes(fusionId)) return;
    if (s.skillPoints < 2) return UI.toast('تحتاج نقطتي مهارة');
    s.skillPoints -= 2;
    s.fusions.push(fusionId);
    UI.toast(`اكتشفت ${f.name}!`);
    this.trackQuest('fusion');
    SaveSystem.save(s);
    UI.renderSkills();
    UI.updatePlayerChip();
  },

  enterZone(zone) {
    const enemyId = zone.enemies[Math.floor(Math.random() * zone.enemies.length)];
    const template = ENEMIES.find(e => e.id === enemyId);
    if (!template) return;
    const scale = 1 + (zone.level - 1) * 0.15;
    const enemy = {
      ...template,
      hp: Math.floor(template.hp * scale),
      dmg: Math.floor(template.dmg * scale),
      gold: Math.floor(template.gold * scale),
      exp: Math.floor(template.exp * scale),
      zone: zone.id
    };
    this.startCombat(enemy, zone);
  },

  startCombat(enemy, zone) {
    const s = this.state;
    s.hp = s.maxHp;
    s.mp = s.maxMp;
    UI.showScreen('combat');
    // build spell bar from unlocked spells + fusions
    const spells = [];
    s.unlockedSpells.forEach(key => {
      const [elId, spId] = key.split('_');
      const el = ELEMENTS[elId];
      if (!el) return;
      const sp = el.spells.find(x => x.id === spId);
      if (sp) spells.push({...sp, color: el.color, source: elId});
    });
    s.fusions.forEach(fid => {
      const f = FUSIONS.find(x => x.id === fid);
      if (f) spells.push({...f, color: '#a57dff', isFusion: true});
    });
    const bar = document.getElementById('spell-bar');
    bar.innerHTML = '';
    spells.slice(0, 8).forEach(sp => {
      const btn = document.createElement('button');
      btn.className = 'spell-btn';
      btn.dataset.spellId = sp.id;
      btn.innerHTML = `
        <span class="sb-icon">${sp.icon}</span>
        <span style="font-size:10px;color:var(--gold)">${sp.name}</span>
        <span class="sb-cost">${sp.cost} MP</span>
        <div class="cd-overlay"></div>
      `;
      btn.onclick = () => Combat.castSpell(sp);
      bar.appendChild(btn);
    });

    document.getElementById('enemy-panel').innerHTML = `
      <div class="enemy-sprite">${enemy.icon}</div>
      <div class="enemy-name">${enemy.name}</div>
      <div class="enemy-hp-bar"><div class="enemy-hp-fill" id="enemy-hp-fill" style="width:100%"></div></div>
      <div style="font-size:11px;color:var(--text-dim)">مستوى ${enemy.level}${enemy.boss ? ' · زعيم' : ''}</div>
    `;

    document.getElementById('btn-dodge').onclick = () => Combat.dodge();
    document.getElementById('btn-flee').onclick = () => Combat.flee();

    Combat.start(enemy, (result) => this.endCombat(result, enemy, zone));
    UI.updateCombatBars();
  },

  endCombat(result, enemy, zone) {
    UI.showScreen('hub');
    if (result.fled) { UI.toast('هربت!'); UI.renderHub(); return; }
    if (result.won) {
      const s = this.state;
      s.exp += enemy.exp;
      s.gold += enemy.gold;
      const zoneKey = 'kill_zone';
      if (!s.questProgress.q_side1) s.questProgress.q_side1 = {kill_zone:0};
      if (zone.id === 'forest') s.questProgress.q_side1.kill_zone = (s.questProgress.q_side1.kill_zone || 0) + 1;
      this.trackQuest('kill');
      if (enemy.boss) this.trackQuest('kill_boss');
      this.trackQuest('gold', enemy.gold);
      // level up check
      while (s.exp >= LEVEL_EXP(s.level)) {
        s.exp -= LEVEL_EXP(s.level);
        s.level++;
        s.maxHp = MAX_HP(s.level);
        s.maxMp = MAX_ENERGY(s.level);
        s.hp = s.maxHp;
        s.mp = s.maxMp;
        s.skillPoints += 2;
        UI.toast(`ارتقيت للمستوى ${s.level}!`);
      }
      // unlock next zone
      const idx = ZONES.findIndex(z => z.id === zone.id);
      if (idx >= 0 && idx + 1 < ZONES.length) {
        const next = ZONES[idx + 1];
        if (!s.unlockedZones.includes(next.id) && s.level >= next.level - 1) {
          s.unlockedZones.push(next.id);
          this.trackQuest('unlock_zone');
        }
      }
      UI.modal('انتصار!', `هزمت ${enemy.name}!<br>+${enemy.exp} XP · +${enemy.gold} 💰`,
        [{label:'رائع', className:'btn-primary'}]);
      SaveSystem.save(s);
    } else {
      UI.modal('هزيمة', 'خسرت المعركة... حاول مرة أخرى.', [{label:'حسنًا'}]);
    }
    UI.renderHub();
  },

  trackQuest(type, value = 1) {
    const s = this.state;
    QUESTS.forEach(q => {
      if (s.questStates[q.id] !== 'active') return;
      q.objectives.forEach((o, i) => {
        if (o.type !== type) return;
        const p = s.questProgress[q.id] = s.questProgress[q.id] || {};
        p[type] = (p[type] || 0) + value;
        if (p[type] >= o.count) p[type] = o.count;
      });
      this.checkQuestComplete(q);
    });
  },

  checkQuestComplete(q) {
    const s = this.state;
    const prog = s.questProgress[q.id] || {};
    const allDone = q.objectives.every(o => (prog[o.type] || 0) >= o.count);
    if (allDone) {
      s.questStates[q.id] = 'done';
      const r = q.reward;
      if (r.exp) s.exp += r.exp;
      if (r.gold) s.gold += r.gold;
      if (r.skill) s.skillPoints += r.skill;
      UI.toast(`أكملت: ${q.name}!`);
      // unlock next quests
      QUESTS.forEach(next => {
        if (next.requires && next.requires.includes(q.id) && s.questStates[next.id] === 'locked') {
          s.questStates[next.id] = 'active';
        }
      });
      SaveSystem.save(s);
    }
  },

  findSpell(id) {
    for (const el of Object.values(ELEMENTS)) {
      const sp = el.spells.find(x => x.id === id);
      if (sp) return sp;
    }
    return FUSIONS.find(f => f.id === id);
  }
};

window.addEventListener('DOMContentLoaded', () => Game.init());