import axios from "axios";
import { SERVER_URL } from "../../components/Authentication/Authentication";


export type twoFaStatusType = {
	otpAuthorized: boolean,
  message: string,
}

export const authApi = axios.create({
  baseURL: SERVER_URL + '/auth/',
  withCredentials: true,
})

export async function generate2faQr(url: string) : Promise<string> {
  return authApi.get(url).then(res => res.data).catch(() => { });
}

export async function activate2Fa(
  url: string,
  { arg: twoFaCode }: { arg: string }
) : Promise<twoFaStatusType | undefined> {
  if (!twoFaCode)
    return;
  return authApi.post(url, {
    twoFactorAuthenticationCode: twoFaCode,
  }).then(res => res.data).catch(() => { });
}

export async function disable2Fa(url: string) {
  return authApi.post(url).then(res => res.data()).catch(() => {});
}

// export async function sendOtp(url: string, { arg: otpCode }: { arg: string }) {
// return authApi.post(url, {
// }).then(res => res.data).catch(() => { });
// }

export async function getAuthStatus(url: string) : Promise<boolean> {
  return authApi.get(url).then(res => res.data?.twoFactor).catch(() => { });
}
