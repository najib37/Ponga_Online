import OtpInput from 'react-otp-input';
import '../Authentication/Authentication.style.css';
import { MouseEvent, useState } from 'react';
import useSWRMutation from 'swr/mutation';
import { sendOtp } from '../../api/auth/Login';
import { useNavigate } from 'react-router-dom';
import { mutate } from 'swr';
import { toast } from 'react-toastify';

const TwoFactor = () => {

  const [twofaCode, setTwofaCode] = useState<string | undefined>(undefined);
  const { trigger: sendOtpTrigger } = useSWRMutation('/otp', sendOtp);
  const navigate = useNavigate();

  const handleSubmit = (event: MouseEvent) => {

    if (twofaCode && twofaCode.length >= 6)
      sendOtpTrigger(twofaCode, {
        onSuccess: (otp) => {
          if (otp?.otpAuthorized === true) {
            mutate('/status')
            navigate('/home');
          }
          else {
            toast.error("Invalid Two Factor Code"); // khask toast
          }
        },
      });

    event.preventDefault();
    event.stopPropagation()
  }

  const handleCancel = (event: MouseEvent) => {
    navigate('/');
    event.preventDefault();
    event.stopPropagation()
  }

  return (
    <section>
      <div className="leftSection"></div>
      <div className="middleSection">
        <div className="twoFactorAuth">
          <h1>2FA CODE</h1>
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
          <div>
            <button className="signButton" onClick={(event) => {
              handleSubmit(event);
            }}>
              Submit
            </button>
            <button className="signButton" onClick={(event) => {
              handleCancel(event);
            }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div className="rightSection"></div>
    </section>
  );
};

export default TwoFactor;
