import { Model, DataTypes, BuildOptions, Sequelize } from 'sequelize';

export interface SecretModel extends Model {
    id: number;
    secret: string;
    createdAt: Date;
    updatedAt: Date;
}

export type SecretStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): SecretModel;
};

export default function SecretFactory(sequelize: Sequelize): SecretStatic {
    return <SecretStatic>sequelize.define('Secret', {
        id: {
            type: DataTypes.TEXT,
            allowNull: false,
            primaryKey: true,
        },
        secret: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    }, {
        timestamps: true,
        createdAt: 'createdAt', 
        updatedAt: 'updatedAt',
        modelName: 'Secret',
        tableName: 'secrets',
    });
}