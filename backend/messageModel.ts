import { DataTypes, Model } from 'sequelize';
import { sequelize } from './dbConfig';

class Message extends Model {}

Message.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        content: { type: DataTypes.TEXT, allowNull: false },
        username: { type: DataTypes.TEXT, allowNull: false },
        room: { type: DataTypes.TEXT, allowNull: false },
    },
    { sequelize, updatedAt: false },
);

Message.sync();

export default Message;
