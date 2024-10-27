import { Table, Column, Model, DataType, PrimaryKey, AllowNull } from 'sequelize-typescript';

@Table({
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    modelName: 'AccessToken',
    tableName: 'access_token',
})
export default class AccessTokenModel extends Model<AccessTokenModel> {

    @PrimaryKey
    @Column(DataType.TEXT)
    id!: string;

    @Column({
        type: DataType.TEXT,
        field: 'token_type',
    })
    tokenType!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    token!: string;

    @Column({
        type: DataType.TEXT,
        field: 'refresh_token',
    })
    refreshToken!: string;
}