import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    modelName: 'Secret',
    tableName: 'secret',
})
export default class SecretModel extends Model<SecretModel> {
    @Column({
        allowNull: false,
        primaryKey: true,
        type: DataType.TEXT,
    })
    id!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    secret!: string;

    @Column({
        allowNull: false,
        type: DataType.DATE,
    })
    createdAt!: Date;

    @Column({
        allowNull: false,
        type: DataType.DATE,
    })
    updatedAt!: Date;
}