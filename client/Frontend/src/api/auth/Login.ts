
import { authApi, twoFaStatusType } from "./2factor";

export type AuthStatusType = {
  message: string,
  authorized: boolean,
  twoFactor: boolean,
}

export async function logStatus(
  url: string,
): Promise<AuthStatusType> {

  console.log("server = ", import.meta.env.VITE_SERVER_URL);
  return authApi.get(url).then(
    res => {
		console.log(res.data);
      return res.data
    }
  ).catch(() => { });
}

export async function sendOtp (
  url: string,
  { arg: otpCode }: { arg: string }
): Promise<twoFaStatusType> {
  console.log("send");

  return authApi.post(
    url,
    { otp: otpCode }
  ).then(
    res => {
      return res.data
    }
  ).catch(() => { });
}
