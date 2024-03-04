import axios from "axios";
import { myApi } from "../axiosInstance"
import { SERVER_URL } from "../../components/Authentication/Authentication";

// type PaginationQuery = {
//   take: number,
//   skip: number
// }
//
// type SearchQuery = {
//   field: string,
//   search: string,
//   sort: string,
// }

export interface User {
  id: string,
  email: string,
  name: string,
  username: string,
  avatar: string,
  status: string,
  twoFactorEnabled: boolean,
}


export function checkImageUrl(imgSrc?: string): string | undefined {
  if (imgSrc && imgSrc.match('https://') || imgSrc?.match('http://'))
    return imgSrc;
  return SERVER_URL + imgSrc; // debug
}

export async function getMyUser(url : string): Promise<User> {
  return myApi.get(url).then(res => res.data).catch(() => { });
}

export async function setMyProfilePhoto(
  url: string,
  { arg: image }: { arg: File | null | undefined }
): Promise<User | undefined> {
  if (!image)
    return;

  const myForm = new FormData();
  myForm.append('file', image);
  return axios.post(
     SERVER_URL + url,
    myForm,
    { withCredentials: true }
  ).then(res => res.data).catch(() => { })
}

export async function editMyProfile(
  url: string,
  { arg: user }: { arg: Partial<User> }
): Promise<User | undefined> {

  delete user['id'];
  delete user['status'];
  delete user['username'];

  return myApi.patch(
    url,
    user
  ).then(res => res.data).catch(() => { });
}

export async function getOtherUser(
  url: string,
  { arg: userId}: { arg: string }
): Promise<User> {

  return myApi.get(
    url + '/' + userId,
  ).then(res => res.data).catch(() => { });
}

export async function getUser(
	url: string,
  ): Promise<User> {
	return myApi.get(url).then(res => res.data).catch(() => { });
  }

export async function searchUsersByUsername(
  url: string,
  { arg: username }: { arg: string; }
): Promise<User[]> {
  return myApi.get(url, {
    params: {
      username
    }
  }).then(res => res.data).catch(() => {});
}
