import PasswordResetCode from "../models/PasswordResetCodes.model";
import { ICodePassword } from "../interfaces/ICodePassword";

export class PasswordResetService {
  async createResetCode(newCode: ICodePassword) {
    const { user_id, code, expires_at, created_at } = newCode;
    const new_Code = PasswordResetCode.create({ user_id, code, expires_at });
    return new_Code;
  }

  //elimina codigos Anteriores.
  async deleteCode(user_id: number) {
    return await PasswordResetCode.destroy({ where: { user_id } });
  }

  async findCode(user_id: number, code: string) {
    return await PasswordResetCode.findOne({ where: { user_id, code } });
  }

  async resetPassword() {}
}
