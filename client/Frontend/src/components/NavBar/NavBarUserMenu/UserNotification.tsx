import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { notif_socket } from './UserMenu';
import { NotifType } from './UserMenu';
import { useNavigate } from 'react-router-dom';
import useSWRMutation from 'swr/mutation';
import { getOtherUser } from '../../../api/user/User';


const UserNotification = ({
  notification,
  setNotification,
  notifList,
  setNotifList,
  setOpen
}: {
  notification?: NotifType,
  setNotification: Dispatch<SetStateAction<NotifType | undefined>>,
  notifList: NotifType[],
  setNotifList: Dispatch<SetStateAction<NotifType[]>>,
  setOpen: Dispatch<SetStateAction<boolean>>,
}) => {

  const { trigger: getRequestUserTrigger } = useSWRMutation('/user', getOtherUser)

  const navigate = useNavigate();

  useEffect(() => {
    if (notification?.id) {
      const changedNotif: NotifType = {
        ...notification,
        state: "READ"
      }
      setNotification(changedNotif)
      notif_socket.emit('notification', changedNotif);
    }
  }, [])

  function handleClickEvent(notif: NotifType) {
    setNotifList(notifList.filter(no => no.id !== notif.id))
    getRequestUserTrigger(notif.senderId, {
      onSuccess: (requestUser) => {
        if (notif.type === 'User')
          navigate(`/profile/${requestUser?.username}`)
        if (notif.type === 'Game') {
          notif_socket.emit('notification', {
            ...notif,
            state: "CLICKED",
          })
          navigate(`/game`)
        }
      }
    })
    setOpen(false);
  }
  return (
    <>
      <div className="listNotifSearch">
        <span>Notifications</span>
        <ul className="userMenuSearchUl">
          {notifList.length > 0 &&
            notifList.map((notif: NotifType) => (
              <li
                className="userNotifSearchLi"
                key={notif.id}
                onClick={(event) => {
                  event.stopPropagation();
                  handleClickEvent(notif);
                }}>
                <FontAwesomeIcon icon={faGamepad} className="message-icon" />
                {notif?.content}
              </li>
            ))}
        </ul>
      </div>
    </>
  );
};

export default UserNotification;
