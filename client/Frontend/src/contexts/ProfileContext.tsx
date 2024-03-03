import { ReactNode, createContext, useContext } from "react";
import useSWR from 'swr'
import { Profile, getProfile } from "../api/user/Profile"

export type FetchProfileType = {
  profile?: Profile,
  isLoading?: boolean,
  error?: boolean
}

export const ProfileContext = createContext<FetchProfileType>({
  profile: undefined,
  isLoading: false,
  error: true
});


export const ProfileContextProvider = (
  { children, username }: { children: ReactNode, username: string; }
) => {

  const { data: profile, isLoading, error } = useSWR({ url: '/profile', username }, getProfile, {
    revalidateOnMount: true,
    suspense: true,
  })

  return (
    <ProfileContext.Provider value={{profile, isLoading, error}}>
        {children}
    </ProfileContext.Provider>
  )
}


export const useProfile = (): FetchProfileType => {
  const profile: FetchProfileType = useContext(ProfileContext);

  // check for error and throw but its not allowed in the subject
  return profile;
}
