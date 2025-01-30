import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

const TVShow = sequelize.define('TVShow', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    genres: {
        type: DataTypes.ARRAY(DataTypes.STRING)
    },
    rating: {
        type: DataTypes.STRING
    }
});

export default TVShow; 