import accessList from "@/data/access-list.json";

/** 多账号列表（编辑 client/src/data/access-list.json 增删账号密码） */
const list = accessList as Array<{ account: string; password: string }>;

/** 单密码（环境变量）；未设置且无账号列表时不启用登录 */
const APP_PASSWORD = import.meta.env.VITE_APP_PASSWORD as string | undefined;

/** 是否启用登录：有账号列表或设置了单密码时启用 */
export const isAuthEnabled = (): boolean =>
  list.length > 0 || !!APP_PASSWORD;

/** 是否使用多账号模式（有账号列表时为 true，否则用单密码） */
export const useAccountList = (): boolean => list.length > 0;

/** 单密码模式：校验密码（仅当未使用账号列表时有效） */
export function checkPassword(input: string): boolean {
  return !!APP_PASSWORD && input === APP_PASSWORD;
}

/** 多账号模式：校验账号+密码 */
export function checkAccount(account: string, password: string): boolean {
  const a = account.trim();
  const p = password.trim();
  return list.some(
    (item) => item.account.trim() === a && item.password.trim() === p
  );
}
