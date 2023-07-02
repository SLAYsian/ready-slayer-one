const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Character extends Model {}

Character.init(
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
    description: {
      type: DataTypes.TEXT,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    class_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'character_class',
        key: 'id',
      },
    },
    strength: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    agility: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    constitution: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    wisdom: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    intelligence: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    charisma: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'character',
  }
);

module.exports = Character;