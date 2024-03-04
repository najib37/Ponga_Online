import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocationContext } from '../../locationContext';
import PlayerCard from './PlayerCard/PlayerCard.tsx';
import PlayerHistory from './PlayerHistory/PlayerHistory.tsx';
import { FetchUserType, useUser } from '../../contexts/UserContext.tsx';
import { FetchProfileType, ProfileContextProvider, useProfile } from '../../contexts/ProfileContext.tsx';


const ProfileCards = () => {
  const { profile, isLoading, error }: FetchProfileType = useProfile();

  if (isLoading)
    return (<h1>Profile Is Loading</h1>)

  if (!profile?.user || error)
    return (
      <div
        className="flex flex-col items-center justify-center h-[90vh] text-6xl"
        style={{ fontFamily: 'PINGPONG' }}
      >
        <p>Invalid user</p>
      </div>
    );

  return (
    <div className="playerProfile">
      <PlayerCard />
      <PlayerHistory />
    </div>
  )

}

const Profile = () => {

  const { username } = useParams();
  const { user, isMutating }: FetchUserType = useUser();
  const navigate = useNavigate();
  const { setLocationData } = useLocationContext();

  useEffect(() => {
    if (!username && user)
      navigate(`/profile/${user.username}`);
  }, [username, user?.username, navigate]);

  useEffect(() => {
    setLocationData('/profile');
  }, [setLocationData]);

  if (isMutating && !user)
    return (<h1>user is Loading...</h1>)

  return (
    <>
      {user && username && (
        <>
          <div className="playerCharacter"></div>
          <ProfileContextProvider username={username}>
            <ProfileCards />
          </ProfileContextProvider>

        </>
      )}
    </>
  );
};
export default Profile;
