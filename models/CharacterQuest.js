const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class CharacterQuest extends Model {}

CharacterQuest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    character_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'character',
        key: 'id',
      },
    },
    quest_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'quest',
        key: 'id',
      },
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'characterQuest',
    indexes: [
      {
        unique: true,
        fields: ['character_id', 'quest_id'],
      },
    ],
  }
);

module.exports = CharacterQuest;
