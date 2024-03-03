import {
  useEffect,
  useState,
  FormEvent,
} from 'react';

import {
  checkImageUrl,
  editMyProfile,
  setMyProfilePhoto,
  User,
} from '../../../api/user/User';

import { useUser } from '../../../contexts/UserContext';
import { useProfile } from '../../../contexts/ProfileContext';

import useSWRMutation from 'swr/mutation';

import '../Profile.style.css';
import { toast } from 'react-toastify';
import { userSchema } from '../../../api/user/schema/UserValidationSchema';


const EditProfile = ({ setOpenForm }) => {
  const [name, setName] = useState<string | null>(null);
  const [image, setImage] = useState<File | null | undefined>(null);
  const [imagePath, setImagePath] = useState<string>("");
  const { trigger: changePhotoTrigger } = useSWRMutation('/upload/avatar/', setMyProfilePhoto)
  const { trigger: editUserTrigger } = useSWRMutation('/user', editMyProfile)
  const { user, getUserTrigger } = useUser();

  useEffect(() => {
    if (image) {
      const reader = new FileReader()
      reader.onload = () => setImagePath(reader.result as string);
      reader.readAsDataURL((image as Blob));
    }
    else if (user) {
      setImagePath(checkImageUrl(user.avatar));
    }
  }, [image])

  const handleSubmit = (event: FormEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (name && user && name != user.name) {
      const newUser: User = { ...user, name };
      try {
        const parsedUser = userSchema.parse(newUser);
        editUserTrigger(parsedUser, {
          onSuccess: () => {
            getUserTrigger(undefined, {
              optimisticData: parsedUser
            });
            toast.success("Name Changed Successfully")
          }
        })
      } catch {
        toast.error("Error Changing User Name");
      }
    }
    if (image) {
      changePhotoTrigger(image, {
        onSuccess: () => {
          getUserTrigger();
          toast.success("Image Changed Successfully")
        },
      });
    }
    setOpenForm(false);
  }

  const handleCancel = (event: FormEvent) => { // this must be set 
    event.stopPropagation();
    event.preventDefault();
    setOpenForm(false);
  }

  return (
    <div className="profileFormContainer">
      <form action="" className="profileForm" >
        <div>
          <label className="updatePhotoLabel">
            <input
              type="file"
              accept='image/*'
              id="formId"
              className="hidden"
              onChange={(event) => setImage(event.target.files?.item(0))}
            />
            <img src={imagePath} />
          </label>
        </div>
        <div>
          <input
            type="text"
            id="name"
            placeholder="Change Name"
            className="updateName"
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="profileFormButtons">
          <button onClick={(event: FormEvent) => handleSubmit(event)}>Submit</button>
          <button onClick={(event) => handleCancel(event)}>Cancel</button>
        </div>
      </form>
    </div>
  )

}

const CardTopSection = () => {

  const [openFormProfile, setOpenForm] = useState(false);

  const popUpEdit = () => setOpenForm(!openFormProfile);

  const { user } = useUser();
  const { profile } = useProfile();

  if (!user || !profile) return (<></>)

  const image = user.username === profile.user.username ?
    user.avatar : profile.user.avatar // set the correct name to avoid fetching 2 times
  const name = user.username === profile.user.username ?
    user.name : profile.user.name

  return (
    <div className="playerTopSection">
      <span className="playerNickname">金-{name}-金</span>
      <div
        className="playerImage"
        style={{ backgroundImage: `url(${checkImageUrl(image)})` }}
      >
        {/* <img src={checkImageUrl(image)} /> */}
        {profile.user.username === user.username && (
          <>
            <button onClick={popUpEdit} className="editProfile">
              Edit Profile
            </button>
            {openFormProfile && <EditProfile setOpenForm={setOpenForm} />}
          </>
        )}
      </div>
    </div>
  );
};
export default CardTopSection;
