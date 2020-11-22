const SPELL_THUNDER_MAX_DAMAGE = 30;
const SPELL_THUNDER_MAX_COOLDOWN = 3;
const SPELL_THUNDER_NAME = 'thunder';

const SPELL_TEST_NAME = 'test spell';
const SPELL_TEST_MAX_DAMAGE = 15;
const SPELL_TEST_MAX_COOLDOWN = 2;

const MAX_DAMAGE = 20;
const MAX_HP = 100;

const $btn = document.getElementById('btn-kick');
const logs = document.getElementById('logs');

let countMove = 0;

const actionWithAbility = function (callback) {
  for (let spell in this.ability) {
    callback(this.ability[spell]);
  }
}

const enabledSpellBtn = function(enabled = true) {
  return spell => {
    spell.$btn().disabled = enabled;
  };
}

function createButtonSpell() {
  const btn = document.createElement('button');

  btn.appendChild(document.createTextNode(`Cast ${this.name} spell`));
  btn.classList.add('button');
  btn.id = `btn-spell-${this.name}`;

  return btn;
}

function getSpellBtn(type) {
  if (this.$__btn === null) {
    this.$__btn = createButtonSpell.call(this);
    console.log(this)
    document.getElementsByClassName(`control-${type}`).item(0).appendChild(this.$__btn);
  }

  return this.$__btn;
}

const character = {
  name: "Pikachu",
  defaultHP: MAX_HP,
  damageHP: MAX_HP,
  maxDamage: MAX_DAMAGE,
  ability: {
    [SPELL_THUNDER_NAME]: {
      getDamage: () => (random(SPELL_THUNDER_MAX_DAMAGE)),
      cooldown: 0,
      maxCooldown: SPELL_THUNDER_MAX_COOLDOWN,
      $__btn: null,
      $btn: function() {
        return getSpellBtn.call(this, 'character');
      },
      name: SPELL_THUNDER_NAME,
    },
    [SPELL_TEST_NAME]: {
      getDamage: () => (random(SPELL_TEST_MAX_DAMAGE)),
      cooldown: 0,
      maxCooldown: SPELL_TEST_MAX_COOLDOWN,
      $__btn: null,
      $btn: function() {
        return getSpellBtn.call(this, 'character');
      },
      name: SPELL_TEST_NAME,
    }
  },
  actionWithAbility,

  elHP: document.getElementById('health-character'),
  elProgressbar: document.getElementById('progressbar-character'),
  elName: document.getElementById('name-character'),
};

const enemy = {
  name: "Charmander",
  defaultHP: MAX_HP,
  damageHP: MAX_HP,
  maxDamage: MAX_DAMAGE,
  ability: {},
  actionWithAbility,

  elHP: document.getElementById('health-enemy'),
  elProgressbar: document.getElementById('progressbar-enemy'),
  elName: document.getElementById('name-enemy'),
};

const kick = () => {
  decrementCooldown();
  move();
};

const move = () => {
  const countMoveText = `Ход#${++countMove}\n`;

  const characterData = hit(character, enemy);
  const enemyData = hit(enemy, character);

  const characterMessage = characterData.message;
  const enemyMessage = enemyData.message;

  infoLog(characterMessage, enemyMessage, countMoveText);

  if (characterData.die || enemyData.die) {
    stopGame();
  }
}

const hit = (character, enemy) => {
  const damage = random(character.maxDamage);

  if (changeHP(enemy, damage)) {
    return { message: generateTextLog(character, enemy, damage) + `\nПокемон ${enemy.name} после такого удара погиб! Помним, любим, скорбим!\n`, die: true };
  }

  return { message: generateTextLog(character, enemy, damage) + '\n', die: false };
}

const infoLog = (characterMessage, enemyMessage, countMoveMessage) => {
  logs.innerHTML += `<div class="row">
${wrapperLog(characterMessage)}${wrapperLog(countMoveMessage)}${wrapperLog(enemyMessage)}
</div>`;
}

const wrapperLog = (text) => (
  `<div class="column">${text}</div>`
);

const generateTextLog = (person1, person2, damage) => {
  return `Покемон [${person1.name}] ударил покемона [${person2.name}] и нанёс ему: {${damage}} урона.`;
}

const decrementCooldown = () => {
  cooldownSpell(character);
  cooldownSpell(enemy);
}

const castSpell = (character, enemy, nameSpell) => {
  const damage = character.ability[nameSpell].getDamage();

  const message = changeHP(enemy, damage) ?
    `Покемон [${character.name}] использовал [${nameSpell}] на покемона [${enemy.name}] нанеся {${damage}} урона.\nПокемон [${enemy.name}] после такого погиб! Помним, любим, скорбим!\n`
    :
    `Покемон [${character.name}] использовал [${nameSpell}] на покемона [${enemy.name}] нанеся {${damage}} урона.\n`;

  character.ability[nameSpell].cooldown = character.ability[nameSpell].maxCooldown;
  character.ability[nameSpell].$btn().disabled = true;

  infoLog(message, '', 'casting spell');
}

const cooldownSpell = (person) => {
  person.actionWithAbility((spell) => {
    if (spell.cooldown > 0) {
      spell.cooldown--;
    }

    if (spell.cooldown === 0) {
      spell.$btn().disabled = false;
    }
  });
}

const renderHPLife = (person) => {
  person.elHP.innerText = `${person.damageHP} / ${person.defaultHP}`;
}

const renderProgressbarHP = (person) => {
  person.elProgressbar.style.width = `${(person.damageHP / person.defaultHP) * 100}%`;
}

const renderHP = (person) => {
  renderHPLife(person);
  renderProgressbarHP(person);
}

const changeHP = (person, count) => {
  let status = false;

  if ((person.damageHP -= count) <= count) {
    person.damageHP = 0;

    status = true;
  }

  renderHP(person);

  return status;
}

const random = (num) => {
  return Math.ceil(Math.random() * num);
}

const stopGame = () => {
  $btn.disabled = true;
  character.actionWithAbility(enabledSpellBtn(true));
  enemy.actionWithAbility(enabledSpellBtn(true));
}

const setHPToDefault = (person, _default = null) => {
  if (_default !== null) {
    person.defaultHP = _default; // set new default value
  }

  person.damageHP = person.defaultHP;
}

const startGame = () => {
  setHPToDefault(character);
  setHPToDefault(enemy);

  renderHP(character);
  renderHP(enemy);

  initSpellAction(character);
  initSpellAction(enemy);

  countMove = 0;
}

const initGame = () => {
  console.log('Start Game!');

  $btn.addEventListener('click', kick);
  startGame();
}

const initSpellAction = (person) => {
  person.actionWithAbility((spell) => {
    const spellAction = castSpell.bind(this, character, enemy, spell.name);
    spell.$btn().addEventListener('click', spellAction)
  });
}

initGame();