import { useState, useEffect, useRef} from 'react';
import UserSearch from './UserSearch';
import UserNotification from './UserNotification';
import './UserElements.style.css';
import { io } from 'socket.io-client'
import { checkImageUrl } from '../../../api/user/User';
import { useUser } from '../../../contexts/UserContext';
import { Logout } from './Logout';

export interface NotifType {
  id?: string,
  type?: string,
  state?: string,
  content?: string,
  senderId: string;
}
export const notif_socket = io(import.meta.env.VITE_NOTIFICATION_SOCKET_URL, {
  autoConnect: true,
  withCredentials: true,
});

const UserMenu = () => {

  const [notifList, setNotifList] = useState<NotifType[]>([])
  const [notification, setNotification] = useState<NotifType | undefined>(undefined)
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<any>(null);
  const { user} = useUser()

  useEffect(() => {
    notif_socket.on("notification", (notif) => {
      setNotification(notif);
    })
    notif_socket.on("allPendingNotification", (notifs) => {
      setNotifList(notifs);
    })
    notif_socket.emit("allPendingNotification");

    return (() => {
      setNotifList([]);
      setNotification(undefined);
      notif_socket.off("notification");
      notif_socket.off("allPendingNotification");
    });
  }, [])

  useEffect(() => {
    if (notification?.content)
      setNotifList([
        notification,
        ...notifList,
      ])
  }, [notification?.id])

  const handleOpen = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="userMenu" ref={dropdownRef}>
      <button
        id="dropdownMenuIconButton"
        // data-dropdown-toggle="dropdownDots"
        className="userMenuButton"
        // type="button"
        onClick={handleOpen}
        aria-expanded={open}
      >
        {user && (
          <img src={checkImageUrl(user.avatar)} className="userMenuImage" />
        )}
      </button>
      {notification?.state === "PENDING" && <div className="notifBill"></div>}

      {open ? (
        <ul className="userMenuUl" aria-labelledby="dropdownMenuIconButton">
          <div className="userMenuName">
            <span>{user?.name}</span>
          </div>
          <UserNotification
            notification={notification}
            setNotification={setNotification}
            notifList={notifList}
            setNotifList={setNotifList}
            setOpen={setOpen}
          />
          <UserSearch setOpen={setOpen} />
          <li onClick={() => 'LogOut'} className="userMenuLi text-red-500">
            <Logout />
          </li>
        </ul>
      ) : null}
    </div>
  );
};

export default UserMenu;
