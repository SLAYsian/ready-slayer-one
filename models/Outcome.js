const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Outcome extends Model {}

Outcome.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    chat_history: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    character_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'character',
        key: 'id'
      }
    },
    quest_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'quest',
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'outcome',
  }
);

module.exports = Outcome;