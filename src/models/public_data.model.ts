import { Model, DataTypes, BuildOptions, Sequelize, InferAttributes } from 'sequelize';

// Define the public data model
export interface PublicDataModel extends Model<InferAttributes<PublicDataModel>, InferAttributes<PublicDataModel>> {
    id: number;
    data: string;
    createdAt: Date;
    updatedAt: Date;
}

// Define the public data static model
export type PublicDataStatic = typeof Model<InferAttributes<PublicDataModel>, InferAttributes<PublicDataModel>> & {
    new (values?: object, options?: BuildOptions): PublicDataModel;
};

// Define the public data factory
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