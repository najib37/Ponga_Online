import { FormEvent, useState } from 'react';
import '../Profile.style.css';
import OtpInput from 'react-otp-input';
import useSWR, { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';
import { activate2Fa, disable2Fa, generate2faQr, getAuthStatus } from '../../../api/auth/2factor';
import { useUser } from '../../../contexts/UserContext';
import { useProfile } from '../../../contexts/ProfileContext';
import { useNavigate, useParams } from 'react-router-dom';
import { addFriend, checkForFriendRequests, deleteFriend, deleteFriendRequest, sendFriendRequest } from '../../../api/user/Friends';
import { blockUser, checkBlockState, unblockUser } from '../../../api/user/Block';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const TwoFactorButton = () => {

  const [open2FA, setOpen2FA] = useState(false);
  const [twofaCode, setTwofaCode] = useState<string | undefined>(undefined)

  const { data: twoFaSatatus } = useSWR('/2fa/status', getAuthStatus, {
    revalidateOnFocus: false,
  });

  const { trigger: enableTrigger } = useSWRMutation('2fa/turn-on', activate2Fa, {
    revalidate: false,
  });

  const { trigger: disableTrigger } = useSWRMutation('2fa/turn-off', disable2Fa, {
    revalidate: false,
  });

  const { data: qrImage, trigger: generateTrigger } = useSWRMutation('2fa/generate', generate2faQr, {
    revalidate: false,
  });

  const twoFAon = () => {
    setOpen2FA(!open2FA);
    generateTrigger();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    twofaCode && enableTrigger(
      twofaCode,
      { onSuccess: () => mutate('/2fa/status', true) }
    ).then(data => toast.info(data?.message)); // alert debug
    event.stopPropagation();
    setOpen2FA(false);
  }

  const handleCancel = (event: FormEvent) => {
    event.preventDefault();
    setTwofaCode(undefined);
    event.stopPropagation();
    setOpen2FA(false);
  }

  const disableTowFa = () => {
    disableTrigger(undefined,
      { onSuccess: () => mutate('/2fa/status', false) }
    ).then(data => toast.info(data?.message)); // alert debug
  }

  return (
    <>
      {!twoFaSatatus ? (
        <button onClick={twoFAon}>Turn 2FA On</button>
      ) : (
        <button onClick={disableTowFa} style={{ backgroundColor: "red" }}>Turn 2FA off</button>
      )}
      {open2FA && (
        <div className="profile2FAContainer">
          <form action="" className="profile2FA">
            <div className="QrCode">
              <img src={qrImage} />
            </div>

            <OtpInput
              value={twofaCode}
              // inputType='number'
              onChange={setTwofaCode}
              numInputs={6}
              renderInput={(props) => <input {...props} />}
              containerStyle={{
                width: '100%',
                justifyContent: 'space-between',
              }}
              inputStyle={{ width: '2rem', height: '2rem', fontSize: '1.5rem' }}
            />
            <div className="TwoFaFormButtons">
              <button onClick={(event) => handleSubmit(event)}>Submit</button>
              <button onClick={(event) => handleCancel(event)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export const SendMsgButton = () => {

  const { profile } = useProfile();
  const navigate = useNavigate();

  if (profile?.isBlocked || !profile?.isFriend)
    return (<></>)

  const sendClickHandler = () => {
    navigate(`/chat/Direct/${profile?.user.id}`)
  }

  return (
    <>
      {<button onClick={sendClickHandler}>Send message</button>}
    </>
  )

}

export const PlayButton = () => {
  const { profile } = useProfile();
  const navigate = useNavigate();

  if (profile?.isBlocked || !profile?.isFriend)
    return (<></>)

  const handleClick = () => {
    console.log(profile.user);
    if (profile?.user.status === 'online')
      navigate(`/game/${profile.user.id}`);
    else
      toast.error(`${profile.user?.username} is offline`)
  }
  return (
    <button onClick={handleClick}> Play </button>
  )
}

export const BlockUserButton = () => {

  const { profile } = useProfile();
  const { trigger: blockTrigger } = useSWRMutation('/block', blockUser)
  const { trigger: unblockTrigger } = useSWRMutation('/block', unblockUser)
  const { data: blockState } = useSWR(`/block/state/${profile?.user.id}`, checkBlockState)
  const { username } = useParams();

  const handleBlockClick = () => {
    if (profile)
      blockTrigger(profile.user.id, {
        onSuccess: () => {
          mutate({ url: '/profile', username });
          mutate(`/friends/state/${profile?.user.id}`);
          mutate(`/friends/request/${profile?.user.id}`);
          mutate(`/block/state/${profile?.user.id}`);
        }
      })
  }
  const handleUnblockClick = () => {
    if (profile)
      unblockTrigger(profile.user.id, {
        onSuccess: () => {
          mutate({ url: '/profile', username });
          mutate(`/block/state/${profile?.user.id}`);
          mutate(`/friends/state/${profile?.user.id}`);
          mutate(`/friends/request/${profile?.user.id}`);
        }
      })
  }

  if (blockState?.blockedBy)
    return (
      <button disabled={true} style={{ backgroundColor: 'grey' }} >
        {`blocked by ${profile?.user.username}`}
      </button>
    )

  return (
    <>
      {
        profile?.isBlocked ?
          <button onClick={handleUnblockClick}> Unblock </button>
          :
          <button onClick={handleBlockClick}> block </button>
      }
    </>
  )
}

export const AddFriendButton = () => {
  const { profile } = useProfile();
  const { trigger: sendRequestTrigger } = useSWRMutation('/friends', sendFriendRequest)
  const { trigger: deleteFriendTrigger } = useSWRMutation('/friends', deleteFriend)
  const { data: checkRequestState } = useSWR(`/friends/state/${profile?.user.id}`, checkForFriendRequests);
  const { data: checkRequests } = useSWR(`/friends/request/${profile?.user.id}`, checkForFriendRequests);
  const { username } = useParams();

  if (profile?.isBlocked)
    return (<></>)

  const handleSendRequestClick = () => {
    if (profile)
      sendRequestTrigger(profile.user.id, {
        onSuccess: () => {
          mutate({ url: '/profile', username });
          mutate(`/friends/state/${profile?.user.id}`);
          mutate(`/friends/request/${profile?.user.id}`);
        }
      })
  }
  const handleDeleteClick = () => {
    if (profile)
      deleteFriendTrigger(profile.user.id, {
        onSuccess: () => {
          mutate({ url: '/profile', username });
          mutate(`/friends/state/${profile?.user.id}`);
          mutate(`/friends/request/${profile?.user.id}`);
        }
      })
  }

  return (
    <>
      {
        profile?.isFriend ?
          <button onClick={handleDeleteClick}>Unfriend</button>
          :
          (!checkRequestState && !checkRequests) ?
            <>
              <button onClick={handleSendRequestClick}>Send Friend Request</button>
            </> :
            <>
              {(!checkRequests) && <button style={{ backgroundColor: 'grey' }} disabled={true}> Request sent </button>}
            </>
      }
    </>
  )
}
export const AcceptFriendRequest = () => {

  const { profile } = useProfile();
  const { data: checkRequests } = useSWR(`/friends/request/${profile?.user.id}`, checkForFriendRequests);
  const { trigger: acceptRequestTrigger } = useSWRMutation('/friends', addFriend)
  const { trigger: deleteRequestTrigger } = useSWRMutation('/friends', deleteFriendRequest);
  const { username } = useParams();

  const handleAcceptClick = () => {
    if (profile) {
      acceptRequestTrigger(profile.user.id, {
        onSuccess: () => {
          mutate({ url: '/profile', username });
          mutate(`/block/state/${profile?.user.id}`)
          mutate(`/friends/state/${profile?.user.id}`);
          mutate(`/friends/request/${profile?.user.id}`);
        }
      });
      deleteRequestTrigger(profile?.user.id);
    }
  }

  const handleDeleteRequest = () => {
    if (profile) {
      deleteRequestTrigger(profile?.user.id, {
        onSuccess: () => {
          mutate({ url: '/profile', username });
          mutate(`/block/state/${profile?.user.id}`)
          mutate(`/friends/state/${profile?.user.id}`);
          mutate(`/friends/request/${profile?.user.id}`);
        }
      });
    }
  }

  if (!profile || profile?.isBlocked) return (<></>)

  if (checkRequests && !profile.isFriend)
    return (
      <>
        <button onClick={handleAcceptClick}> Accept Request</button>
        <button style={{ backgroundColor: 'red' }} onClick={handleDeleteRequest}> Delete Request </button>
      </>
    )
  return (
    <>
      <SendMsgButton />
    </>
  )
}

export const CardBottomSection = () => {

  const { user } = useUser();
  const { profile } = useProfile();

  if (!user || !profile) return (<></>)

  return (
    <>
      <div className="playerBottomSection">
        {
          user.username === profile.user.username ?
            <>
              <TwoFactorButton />
            </>
            :
            <>
              <AcceptFriendRequest />
              <PlayButton />
              <AddFriendButton />
              <BlockUserButton />
            </>
        }
      </div>
    </>
  )
}

export default CardBottomSection;
