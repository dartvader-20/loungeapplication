import React, { useEffect, useState } from 'react'
import { styled } from '@mui/system';
import { Typography, Grid } from '@mui/material';
import imageurl from '../../images/image1';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SingleBedIcon from '@mui/icons-material/SingleBed';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import DoNotDisturbOnTotalSilenceIcon from '@mui/icons-material/DoNotDisturbOnTotalSilence';
import BedIcon from '@mui/icons-material/Bed';
import AirlineSeatFlatIcon from '@mui/icons-material/AirlineSeatFlat';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import WifiIcon from '@mui/icons-material/Wifi';
import ChargingStationIcon from '@mui/icons-material/ChargingStation';
import BedroomChildIcon from '@mui/icons-material/BedroomChild';
import BathroomIcon from '@mui/icons-material/Bathroom';
import { useNavigate } from "react-router-dom";

const MainContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '15px',
    background: 'GrayText'
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

const Services = () => {
    const navigate = useNavigate();
    return (
        <MainContainer>
            <div style={{ background: 'linear-gradient(to left, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.4))', padding: 10, }}>
                <Typography color='tomato' style={{
                    fontFamily: 'Poppins, sans-serif', fontSize: '40px',
                    fontWeight: 'bold'
                }}>Lounge Services</Typography>
                <TypingEffect text="An unbundled service for minimal lounge. These services made available for convenience of any passenger. Just few steps away to get your comfortable lounge experience while travelling." speed={50} />
            </div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                width: '100%'
            }}>
                <img src={imageurl} alt='Dashboard' style={{ width: '40%', height: '400px', padding: 10 }} />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '1px solid black', borderRadius: '14px', padding: 15, alignItems: 'flex-start', width: "30%", marginTop: 20 }}>
                    <Typography style={{
                        fontFamily: 'Poppins, sans-serif', fontSize: '16px',
                        fontWeight: 'bold', padding: 15
                    }}>Basic Services Provided</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={4} sm={4}>
                            <ShoppingCartIcon />
                            <Typography color='black' align='left' style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 500,
                                fontSize: '14px'
                            }}>Bunker cart</Typography>
                        </Grid>
                        <Grid item xs={4} sm={4}>
                            <SingleBedIcon />
                            <Typography color='black' align='left' style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 500,
                                fontSize: '14px'
                            }}>individual Pod</Typography>
                        </Grid>
                        <Grid item xs={4} sm={4}>
                            <ChildCareIcon />
                            <Typography color='black' align='left' style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 500,
                                fontSize: '14px'
                            }}>Feeding Room</Typography>
                        </Grid>
                        <Grid item xs={4} sm={4}>
                            <DoNotDisturbOnTotalSilenceIcon />
                            <Typography color='black' align='left' style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 500,
                                fontSize: '14px'
                            }}>Silent Room</Typography>
                        </Grid>
                    </Grid>
                    <Typography style={{
                        fontFamily: 'Poppins, sans-serif', fontSize: '16px',
                        fontWeight: 'bold', padding: 15
                    }}>Extra Add ons</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={4} sm={4}>
                            <BedIcon />
                            <Typography color='black' align='left' style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 500,
                                fontSize: '14px'
                            }}>Extra Beds</Typography>
                        </Grid>
                        <Grid item xs={4} sm={4}>
                            <AirlineSeatFlatIcon />
                            <Typography color='black' align='left' style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 500,
                                fontSize: '14px'
                            }}>Bed Sheets</Typography>
                        </Grid>
                        <Grid item xs={4} sm={4}>
                            <LocalLaundryServiceIcon />
                            <Typography color='black' align='left' style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 500,
                                fontSize: '14px'
                            }}>Laundry Services</Typography>
                        </Grid>
                        <Grid item xs={4} sm={4}>
                            <WifiIcon />
                            <Typography color='black' align='left' style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 500,
                                fontSize: '14px'
                            }}>Wifi</Typography>
                        </Grid>
                        <Grid item xs={4} sm={4}>
                            <ChargingStationIcon />
                            <Typography color='black' align='left' style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 500,
                                fontSize: '14px'
                            }}>EV Charging Slot</Typography>
                        </Grid>
                        <Grid item xs={4} sm={4}>
                            <BedroomChildIcon />
                            <Typography color='black' align='left' style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 500,
                                fontSize: '14px'
                            }}>Rest Room</Typography>
                        </Grid>
                        <Grid item xs={4} sm={4}>
                            <BathroomIcon />
                            <Typography color='black' align='left' style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 500,
                                fontSize: '14px'
                            }}>Washroom</Typography>
                        </Grid>
                    </Grid>
                    <GenerateButton onClick={() => navigate("/booking")}>
                        Book Now
                    </GenerateButton>
                </div>
            </div>
        </MainContainer>
    )
}

export default Services;