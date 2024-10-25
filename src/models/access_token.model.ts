import { Model, DataTypes, BuildOptions, Sequelize, InferAttributes } from 'sequelize';

// Define the attributes of the access token model
export interface AccessTokenModel extends Model<InferAttributes<AccessTokenModel>, InferAttributes<AccessTokenModel>> {
    id: number;
    token: string;
    tokenType: string;
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;
}

// Define the static model type
export type AccessTokenStatic = typeof Model<InferAttributes<AccessTokenModel>, InferAttributes<AccessTokenModel>> & {
    new (values?: object, options?: BuildOptions): AccessTokenModel;
};

// Define the access token factory
export default function AccessTokenFactory(sequelize: Sequelize): AccessTokenStatic {
    return <AccessTokenStatic>sequelize.define('AccessToken', {
        id: {
            type: DataTypes.TEXT,
            allowNull: false,
            primaryKey: true,
        },
        tokenType: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'token_type',
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        refreshToken: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'refresh_token',
        },
    }, {
        timestamps: true,
        createdAt: 'createdAt', 
        updatedAt: 'updatedAt',
        modelName: 'AccessToken',
        tableName: 'access_token',
    });
}