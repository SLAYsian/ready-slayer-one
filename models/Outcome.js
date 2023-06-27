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
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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