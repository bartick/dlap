import { Model, DataTypes, BuildOptions, Sequelize, InferAttributes } from 'sequelize';

// Define the secret model
export interface SecretModel extends Model<InferAttributes<SecretModel>, InferAttributes<SecretModel>> {
    id: number;
    secret: string;
    createdAt: Date;
    updatedAt: Date;
}

// Define the secret static model
export type SecretStatic = typeof Model<InferAttributes<SecretModel>, InferAttributes<SecretModel>> & {
    new (values?: object, options?: BuildOptions): SecretModel;
};

// Define the secret factory
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