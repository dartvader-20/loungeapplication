import React, { useEffect, useState } from 'react'
import '../../App.css'
import { styled } from '@mui/system';
import { useNavigate } from "react-router-dom";
import { TextField, Typography } from "@mui/material";
import GoogleButton from 'react-google-button'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import AccountCircle from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import InputLabel from '@mui/material/InputLabel';
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../../firebase';
import { ref, get, set } from 'firebase/database';
import { setUserData, setUserDetails, setUserPresent } from './userManagement';
import imagee1url from '../../images/image2';

const MainContainer = styled('div')({
    height: "100vh",
    display: 'flex',
    backgroundColor: 'black',
});
const FirstHalf = styled('div')({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
});
const SecondHalf = styled('div')({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'black',
    justifyContent: 'center',
    textAlign: 'start',
    padding: 15,
});
const GenerateButton = styled('button')({
    marginTop: '15px',
    backgroundColor: 'black',
    padding: '10px 26px',
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 500,
    color: 'white',
    height: '50px',
    borderRadius: '10px',
    fontSize: '16px',
    "&:hover": {
        background: 'white',
        color: 'black'
    },
});
const GeneratePaleButton = styled('button')({
    marginTop: '15px',
    backgroundColor: '#2c3a84',
    opacity: '0.1',
    padding: '10px 26px',
    fontFamily: 'Poppins, sans-serif',
    color: 'white',
    height: '50px',
    fontWeight: 500,
    borderRadius: '10px',
    fontSize: '16px',
});


const TypingEffect = ({ text, speed }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (currentIndex < text.length) {
                setDisplayedText((prevText) => prevText + text[currentIndex]);
                setCurrentIndex((prevIndex) => prevIndex + 1);
            } else {
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [currentIndex, text, speed]);
    return (
        <Typography style={{
            fontFamily: 'Poppins, sans-serif', fontSize: '20px',
            padding: '20px', fontWeight: 'bold', color: 'white'
        }}>
            {displayedText}
        </Typography>
    );
};
let image1url = null;
const HomePage = () => {
    const navigate = useNavigate();
    const [userDetailsData, setUserDetailsData] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    const [error, setError] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [agree, setAgree] = React.useState(false);

    const handleFirstNameChange = (event) => {
        setUserDetailsData((prevData) => ({ ...prevData, firstName: event.target.value }));
    };
    const handleLastNameChange = (event) => {
        setUserDetailsData((prevData) => ({ ...prevData, lastName: event.target.value }));
    };
    const handleEmailChange = (event) => {
        setUserDetailsData((prevData) => ({ ...prevData, email: event.target.value }));
    };
    const handlePasswordChange = (event) => {
        setUserDetailsData((prevData) => ({ ...prevData, password: event.target.value }));
    };
    const handleCheckBox = () => {
        setAgree(!agree);
    }
    const onSubmit = async (e) => {
        e.preventDefault()
        if (!userDetailsData.firstName || !userDetailsData.lastName || !userDetailsData.email || !userDetailsData.password || !agree) {
            setError('Please fill in all the fields before signing up.');
            setTimeout(() => {
                setError('');
            }, 5000);
        } else {
            await createUserWithEmailAndPassword(auth, userDetailsData.email, userDetailsData.password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    const userUid = user.uid;
                    setUserDetails(user);
                    const userDetailsRef = ref(db, `users/${userUid}/userDetails`);
                    set(userDetailsRef, userDetailsData);
                    checkUserAvailable(user)
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log("err", error)
                    setError(errorMessage)
                    console.log(errorCode, errorMessage, error);

                });
        }
    }

    const onGoogleSignIn = (e) => {
        e.preventDefault();
        const googleAuthProvider = new GoogleAuthProvider();
        signInWithPopup(auth, googleAuthProvider)
            .then((userCredential) => {
                const user = userCredential.user;
                image1url = user.photoURL
                setUserDetails(user);
                checkUserAvailable(user)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setError(errorMessage)
                console.log(errorCode, errorMessage)
            });

    }

    const checkUserAvailable = async (authUser) => {
        if (authUser) {
            const userUid = authUser.uid;
            const userDetailsRef = ref(db, `users/${userUid}/userDetails`);

            try {
                const snapshot = await get(userDetailsRef);
                if (snapshot.exists()) {
                    setUserPresent(true);
                    setUserData(snapshot.val());
                    navigate("/dashboard")
                } else {
                    setUserPresent(false);
                    navigate("/dashboard")
                }
            } catch (error) {
                console.error('Error checking student details data:', error);
            }
        }
    }

    return (
        <MainContainer>
            <FirstHalf>
                <Typography color='GrayText' style={{
                    fontFamily: 'Poppins, sans-serif', fontSize: '40px',
                    padding: '20px', fontWeight: 'bold'
                }}>LoungeEase</Typography>
                <TypingEffect text="Welcome to our minimalist lounge, where simplicity meets serenity. Unwind with soothing music, engage in mindful conversations, and explore curated content for personal growth. Discover a tranquil oasis designed to elevate your relaxation and foster meaningful connections." speed={50} />
                <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    pointerEvents: 'none',
                    overflow: 'hidden',
                    opacity: 0.5,
                }}>
                    <img
                        src={imagee1url}
                        alt="Login"
                        className='swirl'
                        style={{ width: '50vw', height: "99vh", objectFit: 'cover' }}
                    />
                </div>
            </FirstHalf>
            <SecondHalf>
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', border: '1px solid black', background: 'white', borderRadius: '16px', width: '80%', padding: '15px' }}>
                    <Typography color='GrayText' style={{
                        fontFamily: 'Poppins, sans-serif', fontSize: '20px',
                        padding: '20px', fontWeight: 'bold'
                    }}>Sign Up</Typography>
                    <Typography color='GrayText' style={{
                        fontFamily: 'Poppins, sans-serif', fontSize: '16px',
                        padding: '16px', fontWeight: 'bold'
                    }}>Relaxation on Demand</Typography>
                    <GoogleButton
                        className="g-btn"
                        type='dark'
                        onClick={onGoogleSignIn}
                    />
                    <TextField value={userDetailsData.firstName}
                        onChange={handleFirstNameChange}
                        variant='standard'
                        label='First Name'
                        color='warning'
                        style={{ fontFamily: 'Poppins, sans-serif', marginTop: 20, width: "80%" }}
                        required />
                    <TextField value={userDetailsData.lastName}
                        onChange={handleLastNameChange}
                        variant='standard'
                        color='warning'
                        label='Last Name'
                        style={{ fontFamily: 'Poppins, sans-serif', marginTop: 20, width: "80%" }}
                        required />
                    <InputLabel htmlFor="input-with-icon-adornment" style={{ fontFamily: 'Poppins, sans-serif', marginTop: 10 }}>
                        Email*
                    </InputLabel>
                    <Input
                        id="input-with-icon-adornment"
                        color="warning"
                        label="Email"
                        re
                        value={userDetailsData.email}
                        onChange={handleEmailChange}
                        style={{ fontFamily: 'Poppins, sans-serif', marginTop: 20, width: "80%" }}
                        startAdornment={
                            <EmailIcon position="start" style={{ padding: '5px' }}>
                                <AccountCircle />
                            </EmailIcon>
                        }
                    />
                    <TextField
                        type={showPassword ? 'text' : 'password'}
                        variant='standard'
                        label="Create Password"
                        value={userDetailsData.password}
                        onChange={handlePasswordChange}
                        style={{ fontFamily: 'Poppins, sans-serif', marginTop: 20, width: "80%" }}
                        required
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            ),
                        }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'row', paddingTop: '10px' }}>
                        <TextField type='checkbox' value={agree} onChange={handleCheckBox} />
                        <Typography style={{ paddingLeft: '9px', fontFamily: 'Poppins, sans-serif', fontSize: '16px' }}> I accept the <span onClick={() => navigate('/privacypolicy')}
                            style={{ cursor: 'pointer', textDecoration: 'underline', color: 'inherit', }}>Privacy Policy</span> and the<span onClick={() => navigate('/termsofservice')}
                                style={{ cursor: 'pointer', textDecoration: 'underline', color: 'inherit', }} > Terms of Service</span></Typography>
                    </div>
                    {
                        !agree ? <GeneratePaleButton disabled={!agree}>Sign Up</GeneratePaleButton> : <GenerateButton onClick={onSubmit}>Sign Up</GenerateButton>
                    }
                    <GenerateButton onClick={() => navigate('/login')}>Login</GenerateButton>
                    {error && <Typography variant="danger" style={{ padding: '20px', fontFamily: 'Poppins, sans-serif', }}>{error}</Typography>}
                </div>
            </SecondHalf>
        </MainContainer >
    )
}

export { image1url };
export default HomePage;