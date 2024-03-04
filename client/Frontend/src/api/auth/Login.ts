
import { authApi, twoFaStatusType } from "./2factor";

export type AuthStatusType = {
  message: string,
  authorized: boolean,
  twoFactor: boolean,
}

export async function logStatus(
  url: string,
): Promise<AuthStatusType> {

  return authApi.get(url).then(
    res => {
      return res.data
    }
  ).catch(() => { });
}

export async function sendOtp (
  url: string,
  { arg: otpCode }: { arg: string }
): Promise<twoFaStatusType> {

  return authApi.post(
    url,
    { otp: otpCode }
  ).then(
    res => {
      return res.data
    }
  ).catch(() => { });
}
