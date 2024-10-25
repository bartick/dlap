import { Model, DataTypes, BuildOptions, Sequelize } from 'sequelize';

export interface PublicDataModel extends Model {
    id: number;
    data: string;
    createdAt: Date;
    updatedAt: Date;
}

export type PublicDataStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): PublicDataModel;
};

export default function PublicDataFactory(sequelize: Sequelize): PublicDataStatic {
    return <PublicDataStatic>sequelize.define('PublicData', {
        id: {
            type: DataTypes.TEXT,
            allowNull: false,
            primaryKey: true,
        },
        data: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    }, {
        timestamps: true,
        createdAt: 'createdAt', 
        updatedAt: 'updatedAt',
        modelName: 'PublicData',
        tableName: 'public_data',
    });
}