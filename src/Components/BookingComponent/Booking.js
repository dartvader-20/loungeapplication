import React, { useState, useEffect } from 'react'
import Navbar from '../Navbar/NavBar';
import LoungeTable from './LoungeTable';
import { Typography, TextField, Dialog } from '@mui/material';
import { db, auth } from '../../firebase';
import Autocomplete from '@mui/material/Autocomplete';
import { ref, get } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { styled } from '@mui/system';
import StartBooking from './StartBooking';

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

const Booking = () => {
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedCityIndex, setSelectedCityIndex] = useState(-1);
    const [showDialog, setShowDialog] = React.useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async () => {
            try {
                const dbRef = ref(db, 'airports');
                const snapshot = await get(dbRef);
                const airportData = snapshot.val();
                if (airportData) {
                    const cityNames = Object.values(airportData).map((data) => data.city_name);
                    setCities(cityNames);
                }
            } catch (error) {
                console.error('Error fetching airport details from the database:', error);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleCheckAvailibilty = () => {
        if (selectedCity) {
            setShowDialog(true);
        } else {
            setError('Please select a valid city before checking availability.');
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    }
    useEffect(() => {
        if (selectedCity) {
            const index = cities.indexOf(selectedCity);
            setSelectedCityIndex(index);
        }
    }, [selectedCity, cities]);
    return (
        <div >
            <Navbar />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography color='GrayText' style={{
                    fontFamily: 'Poppins, sans-serif', fontSize: '30px',
                    fontWeight: 'bold'
                }}>Lounge Reservation</Typography>
                <div style={{ display: 'flex', flexDirection: 'row', padding: 10, justifyContent: 'space-between', width: "60%" }}>
                    <Autocomplete
                        freeSolo
                        options={cities}
                        value={selectedCity}
                        onChange={(event, value) => setSelectedCity(value)}
                        renderInput={(params) => (
                            <div style={{ position: 'relative', width: '700px' }}>
                                <TextField
                                    {...params}
                                    label="Search for a City"
                                    margin="normal"
                                    variant="outlined"
                                    style={{ width: "100%" }}
                                    InputProps={{ ...params.InputProps, type: 'search' }}
                                />
                                {error && (
                                    <Typography
                                        variant="caption"
                                        color="error"
                                        style={{ position: 'absolute', bottom: -20, left: 0 }}
                                    >
                                        {error}
                                    </Typography>
                                )}
                            </div>
                        )}
                    />
                    <GenerateButton onClick={handleCheckAvailibilty}>
                        Check Availability
                    </GenerateButton>
                </div>
                <Typography color='GrayText' style={{
                    fontFamily: 'Poppins, sans-serif', fontSize: '30px',
                    fontWeight: 'bold'
                }}>Airports</Typography>
                <LoungeTable />
                <Dialog open={showDialog} onClose={() => setShowDialog(false)} PaperProps={{
                    style: {
                        minWidth: '58%', position: 'absolute',
                        top: '45%',
                        left: '58%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '12px'
                    }
                }}>
                    <StartBooking selectedCity={selectedCity} selectedCityIndex={selectedCityIndex} />
                </Dialog>
            </div>
        </div>
    )
}

export default Booking;