import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    modelName: 'PublicData',
    tableName: 'public_data',
})
export default class PublicDataModel extends Model<PublicDataModel> {
    @Column({
        allowNull: false,
        primaryKey: true,
        type: DataType.TEXT,
    })
    id!: string;

    @Column({
        allowNull: false,
        type: DataType.TEXT,
    })
    data!: string;

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