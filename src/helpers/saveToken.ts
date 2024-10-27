import sequelize, { AccessTokenModel } from "../database";

export async function saveToken(id: string, token: string, tokenType: string, refreshToken: string) {
    let transaction = await sequelize.transaction();
    try {
        await sequelize.models[AccessTokenModel.name].upsert({
            id: id,
            token: token,
            tokenType: tokenType,
            refreshToken: refreshToken,
        }, { transaction });

        await transaction.commit();
    } catch(err) {
        transaction.rollback();
        return err;
    }
}