

import { myApi } from "../axiosInstance"

export async function logOut(
  url: string,
  { arg: logout }: { arg: string }
): Promise<void> {

  myApi.delete(
    url +  logout,
  ).catch(() => { });
}
