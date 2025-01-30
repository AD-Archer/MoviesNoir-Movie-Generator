import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Movie = sequelize.define('Movie', {
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
    },
    year: {
        type: DataTypes.INTEGER
    }
});

export default Movie; 