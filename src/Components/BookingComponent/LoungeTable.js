import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { db, auth } from '../../firebase';
import { ref, get } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';

const LoungeTable = () => {
    const [airports, setAirports] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async () => {
            try {
                const airportDetailsRef = ref(db, `airports`);
                const snapshot = await get(airportDetailsRef);
                const airportData = snapshot.val();
                const airportsArray = airportData ? Object.values(airportData) : [];
                setAirports(airportsArray);

            } catch (error) {
                console.error('Error fetching airport details from the database:', error);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);
    const calculateTotalCount = (services) => {
        let totalCount = 0;
        for (const service in services) {
            const slots = services[service].slots;
            for (const slot in slots) {
                totalCount += slots[slot].count;
            }
        }
        return totalCount;
    };

    return (
        <div style={{ marginTop: 20, width: "70%" }}>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead style={{ background: 'black' }}>
                        <TableRow>
                            <TableCell style={{
                                color: 'white', fontFamily: 'Poppins, sans-serif',
                                fontWeight: 500,
                                fontSize: '13px',
                                border: '1px solid white'
                            }}>IATA Code</TableCell>
                            <TableCell style={{
                                color: 'white', fontFamily: 'Poppins, sans-serif',
                                fontWeight: 500,
                                fontSize: '13px',
                                border: '1px solid white'
                            }}>ICAO Code</TableCell>
                            <TableCell style={{
                                color: 'white', fontFamily: 'Poppins, sans-serif',
                                fontWeight: 500,
                                fontSize: '13px',
                                border: '1px solid white'
                            }}>Airport Name</TableCell>
                            <TableCell style={{
                                color: 'white', fontFamily: 'Poppins, sans-serif',
                                fontWeight: 500,
                                fontSize: '13px',
                                border: '1px solid white'
                            }}>City Name</TableCell>
                            <TableCell style={{
                                color: 'white', fontFamily: 'Poppins, sans-serif',
                                fontWeight: 500,
                                fontSize: '13px',
                                border: '1px solid white'
                            }}>Lounges Remaining</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {airports.map((airport, index) => (
                            <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                    {airport.IATA_code}
                                </TableCell>
                                <TableCell>{airport.ICAO_code}</TableCell>
                                <TableCell>{airport.airport_name}</TableCell>
                                <TableCell>{airport.city_name}</TableCell>
                                <TableCell>{calculateTotalCount(airport.services)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default LoungeTable;