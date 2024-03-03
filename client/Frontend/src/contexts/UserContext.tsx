import { ReactNode, Suspense, createContext, useContext, useEffect } from "react";
import { User, getMyUser } from "../api/user/User"
import useSWRMutation, { TriggerWithoutArgs } from "swr/mutation";
import { useAuth } from "../hooks/useAuth";

export type FetchUserType = {
  user?: User,
  isMutating?: boolean,
  error?: boolean,
  getUserTrigger: TriggerWithoutArgs | (() => void),
}

export const UserContext = createContext< FetchUserType >({
  isMutating: false,
  error: true,
  getUserTrigger: () => {}
});


export const UserContextProvider = ({ children }: { children: ReactNode }) => {

  const { trigger: getUserTrigger, data: user, error , isMutating} = useSWRMutation(
    '/user/me',
    getMyUser,
  )
  const auth = useAuth();

  useEffect(() => {
    if (auth?.authorized)
      getUserTrigger();
    console.log("____________user ctx useffect________________");
  }, [auth?.authorized])

  return (
    <UserContext.Provider value={{user, isMutating, error, getUserTrigger}}>
      <Suspense fallback={<div className="flex justify-center items-center text-center text-6xl font-[PINGPONG] text-black h-screen w-screen">Loading...</div>}>
        {children}
      </Suspense>
    </UserContext.Provider>
  )
}


export const useUser = (): FetchUserType => {
  const user = useContext(UserContext);

  return user;
}
