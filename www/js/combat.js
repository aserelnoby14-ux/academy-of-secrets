
const Combat = {
  state: null,

  start(enemy, onEnd) {
    this.state = {
      enemy: { ...enemy, maxHp: enemy.hp },
      playerHp: Game.state.hp,
      playerMaxHp: Game.state.maxHp,
      playerMp: Game.state.mp,
      playerMaxMp: Game.state.maxMp,
      cooldowns: {},
      enemyTimer: null,
      onEnd,
      ended: false,
      slowed: 0,
      shielded: 0,
      evading: 0
    };
    this.scheduleEnemy();
  },

  scheduleEnemy() {
    const s = this.state;
    if (!s || s.ended) return;
    const baseDelay = s.enemy.boss ? 1600 : 2000;
    const delay = s.slowed > 0 ? baseDelay * 1.8 : baseDelay;
    s.enemyTimer = setTimeout(() => this.enemyAttack(), delay);
  },

  enemyAttack() {
    const s = this.state;
    if (!s || s.ended) return;
    if (s.evading > 0) {
      s.evading = 0;
      UI.fx('تفادي!', '#4ed88a');
      AudioSystem.play('click');
    } else {
      let dmg = s.enemy.dmg + Math.floor(Math.random() * 4);
      if (s.shielded > 0) { dmg = Math.floor(dmg * 0.4); s.shielded = 0; }
      s.playerHp = Math.max(0, s.playerHp - dmg);
      UI.fx('-' + dmg, '#e8474b');
      AudioSystem.play('hit');
      UI.updateCombatBars();
      if (s.playerHp <= 0) return this.end(false);
    }
    this.scheduleEnemy();
  },

  castSpell(spell) {
    const s = this.state;
    if (!s || s.ended) return;
    if (s.playerMp < spell.cost) {
      AudioSystem.play('error');
      return UI.toast('طاقة غير كافية');
    }
    if ((s.cooldowns[spell.id] || 0) > Date.now()) {
      AudioSystem.play('error');
      return UI.toast('المهارة في فترة تبريد');
    }

    s.playerMp -= spell.cost;
    s.cooldowns[spell.id] = Date.now() + spell.cd;

    if (spell.heal) {
      AudioSystem.play('heal');
      const heal = Math.abs(spell.dmg);
      s.playerHp = Math.min(s.playerMaxHp, s.playerHp + heal);
      UI.fx('+' + heal, '#4ed88a');
    } else if (spell.shield) {
      AudioSystem.play('cast_ice');
      s.shielded = 1;
      UI.fx('🛡️', '#7ac4ff');
    } else if (spell.evade) {
      AudioSystem.play('click');
      s.evading = 1;
      UI.fx('👁️', '#7a4bd4');
    } else if (spell.slow) {
      AudioSystem.play('click');
      s.slowed = 1;
      UI.fx('🐢', '#f5c451');
    } else {
      AudioSystem.play('cast_' + (spell.source === 'water' ? 'water' : spell.source === 'ice' ? 'ice' : 'fire'));
      const dmg = spell.dmg + Math.floor(Math.random() * 6);
      s.enemy.hp = Math.max(0, s.enemy.hp - dmg);
      UI.fx('-' + dmg, spell.color || '#f5c451');
      if (s.enemy.hp <= 0) { UI.updateCombatBars(); return this.end(true); }
    }
    UI.updateCombatBars();
  },

  dodge() {
    const s = this.state;
    if (!s || s.ended) return;
    if (s.evading > 0) return;
    AudioSystem.play('click');
    s.evading = 1;
    UI.toast('استعدت للتفادي');
  },

  flee() {
    const s = this.state;
    if (!s || s.ended) return;
    if (s.enemy.boss) {
      AudioSystem.play('error');
      return UI.toast('لا يمكن الهروب من زعيم');
    }
    AudioSystem.play('click');
    this.end(false, true);
  },

  end(won, fled = false) {
    const s = this.state;
    if (!s || s.ended) return;
    s.ended = true;
    clearTimeout(s.enemyTimer);
    Game.state.hp = s.playerHp;
    Game.state.mp = s.playerMp;
    if (won) AudioSystem.play('victory');
    else if (!fled) AudioSystem.play('defeat');
    s.onEnd({ won, fled });
  }
};