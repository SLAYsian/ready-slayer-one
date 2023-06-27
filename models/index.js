const User = require('./User');
const Character = require('./Character');
const CharacterClass = require('./CharacterClass');
const Quest = require('./Quest');
const Outcome = require('./Outcome');

User.hasMany(Character, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Character.belongsTo(User, {
  foreignKey: 'user_id'
});

Character.belongsTo(CharacterClass, {
  foreignKey: 'class_id'
});

CharacterClass.hasMany(Character, {
  foreignKey: 'class_id',
  onDelete: 'CASCADE'
});

Character.hasMany(Quest, {
  foreignKey: 'character_id',
  onDelete: 'CASCADE'
});

Quest.belongsTo(Character, {
  foreignKey: 'character_id'
});

Quest.hasMany(Outcome, {
  foreignKey: 'quest_id',
  onDelete: 'CASCADE'
});

Outcome.belongsTo(Quest, {
  foreignKey: 'quest_id'
});

Outcome.belongsTo(Character, {
  foreignKey: 'character_id'
});

Character.hasMany(Outcome, {
  foreignKey: 'character_id',
  onDelete: 'CASCADE'
});

module.exports = { User, Character, CharacterClass, Quest, Outcome };