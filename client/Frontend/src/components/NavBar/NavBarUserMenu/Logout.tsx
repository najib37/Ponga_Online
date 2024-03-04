import { useNavigate } from 'react-router-dom';
import { mutate } from 'swr'
import useSWRMutation from 'swr/mutation';
import { logOut } from '../../../api/auth/Logout';
import { notif_socket } from './UserMenu';
import { socket } from '../../Socket/socket';

export const Logout = () => {
  const navigate = useNavigate();
  const { trigger: logoutTrigger } = useSWRMutation('auth', logOut)

  const handleClick = () => {
    logoutTrigger('/logout', {
      onSuccess: () => {
        mutate(() => { }, undefined, {
          revalidate: false
        })
        notif_socket.disconnect();
        socket.disconnect()
        navigate("/");
      }
    })
  }
  return (<div onClick={handleClick}>logout</div>)
}
