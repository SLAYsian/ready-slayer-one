const User = require('./User');
const Character = require('./Character');
const CharacterClass = require('./CharacterClass');
const Quest = require('./Quest');
const Outcome = require('./Outcome');
const CharacterQuest = require('./CharacterQuest');

User.hasMany(Character, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Character.belongsTo(User, {
  foreignKey: 'user_id'
});

Character.belongsTo(CharacterClass, {
  foreignKey: 'class_id',
  as: 'character_class',
});

CharacterClass.hasMany(Character, {
  foreignKey: 'class_id',
  as: 'characters',
});

Character.belongsToMany(Quest, {
  through: CharacterQuest,
  foreignKey: 'character_id'
});

Quest.belongsToMany(Character, {
  through: CharacterQuest,
  foreignKey: 'quest_id'
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

User.hasMany(Outcome, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Outcome.belongsTo(User, {
  foreignKey: 'user_id'
});

module.exports = { User, Character, CharacterClass, CharacterQuest, Quest, Outcome };