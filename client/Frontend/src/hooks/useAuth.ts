
import useSWR from 'swr'
import { AuthStatusType, logStatus } from '../api/auth/Login';


export const useAuth = (): AuthStatusType | undefined => {

  const { data: authStatus } = useSWR('/status', logStatus, {
    suspense: true,
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
  })

  return authStatus;
}
