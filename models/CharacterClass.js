const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class CharacterClass extends Model {}

CharacterClass.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    strength: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    agility: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    constitution: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    wisdom: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    intelligence: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    charisma: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'character_class',
  }
);

module.exports = CharacterClass;