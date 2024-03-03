import { useEffect, useState } from "react";
import "./UserElements.style.css";
import { User, searchUsersByUsername } from "../../../api/user/User";
import useSWRMutation from "swr/mutation";
import { useDebounce } from 'use-debounce';
import { useNavigate } from "react-router-dom";

const UserSearch = ({setOpen}) => {
  const [input, setInput] = useState<string>("");
  const [username] = useDebounce(input, 500);
  const { trigger: searchTrigger, data: users = [] } = useSWRMutation("/user/search", searchUsersByUsername)
  const navigate = useNavigate();

  useEffect(() => {
    searchTrigger(username);
  }, [username])

  const handleClick = (user: User) => {
    navigate(`/profile/${user.username}`)
    setOpen(false);
    // event.stopPropagation();
  }

  return (
    <div className="listNotifSearch">
      <input
        type="search"
        name=""
        id=""
        placeholder="Search for a friend"
        className="userMenuSearch"
        onChange={(event) => setInput(event.target.value)}
      />
      {
        <ul className="userMenuSearchUl">
          {users.length > 0 &&
            users.map((user: User) => (
              <div className="userNotifSearchLi" key={user.id}>
                <button onClick={() => handleClick(user)}>
                  <li>{user.username}</li>
                </button>
              </div>
            ))}
        </ul>
      }
    </div>
  );
};

export default UserSearch;
