import React, { useEffect, useMemo } from 'react'
import { Typography, TextField, Grid, MenuItem, Select, Checkbox, FormControlLabel, IconButton, Dialog } from '@mui/material';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { db, auth } from '../../firebase';
import { get, ref, set } from 'firebase/database';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MainContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '75vh',
    padding: '15px',
    background: '#ffffe0',
});
const DialogContent = styled('div')({
    maxWidth: '100vw',
    overflow: 'auto',
    overflowX: 'hidden',
});

const CheckAvailabilityButton = styled('button')({
    marginTop: '10px',
    backgroundColor: 'black',
    padding: '10px 25px',
    color: 'white',
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 500,
    fontSize: '16px',
    borderRadius: '12px',
    '&:hover': {
        background: 'white',
        color: 'black'
    },
});

let timeSlots = [
    { start: "00:00", end: "03:00" },
    { start: "03:00", end: "06:00" },
    { start: "06:00", end: "09:00" },
    { start: "09:00", end: "12:00" },
    { start: "12:00", end: "15:00" },
    { start: "15:00", end: "18:00" },
    { start: "18:00", end: "21:00" },
    { start: "21:00", end: "23:59" }
];

let fromSlot, toSlot;
const pricing = {
    'Extra beds': 400,
    'Bed sheets': 50,
    'Laundry service': 250,
    'Wi-Fi': 100,
    'EV charging slot': 500,
    'Rest room': 200,
    'Washroom': 100,
};

const StartBooking = ({ selectedCity, selectedCityIndex }) => {
    const [date, setDate] = React.useState('');
    const [fromTime, setFromTime] = React.useState('');
    const [toTime, setToTime] = React.useState('');
    const [serviceType, setServiceType] = React.useState('');
    const [extraBedsCount, setExtraBedsCount] = React.useState(0);
    const [bedSheetsCount, setBedSheetsCount] = React.useState(0);
    const [error, setError] = React.useState('');
    const memoizedPricing = useMemo(() => pricing, []);
    const [services, setServices] = React.useState({
        'Laundry service': false,
        'Wi-Fi': false,
        'EV charging slot': false,
        'Rest room': false,
        'Washroom': false,
    });
    const [checkedItems, setCheckedItems] = React.useState([]);
    const [totalAmount, setTotalAmount] = React.useState(0);
    const [confirmBooking, setConfirmBooking] = React.useState(false);
    const [isAvailable, setIsAvailable] = React.useState(false);
    const [showDialog, setShowDialog] = React.useState(false);
    useEffect(() => {
        let amount = 0;
        amount += extraBedsCount * memoizedPricing['Extra beds'];
        amount += bedSheetsCount * memoizedPricing['Bed sheets'];

        if (confirmBooking) {
            amount += 600
        }

        for (const service in services) {
            if (services[service]) {
                amount += memoizedPricing[service];
            }
        }
        setTotalAmount(amount);
    }, [extraBedsCount, bedSheetsCount, services, memoizedPricing, confirmBooking]);
    const handleDate = (event) => {
        setDate(event.target.value)
    }
    const handleFromTime = (event) => {
        setFromTime(event.target.value);
    };

    const handleToTime = (event) => {
        setToTime(event.target.value);
    };
    const handleServiceTypeChange = (event) => {
        setServiceType(event.target.value)
    }
    const handleIncrement = (service) => {
        if (service === 'Extra beds') {
            setExtraBedsCount((prevCount) => prevCount + 1);
        } else if (service === 'Bed sheets') {
            setBedSheetsCount((prevCount) => prevCount + 1);
        }
    };

    const handleDecrement = (service) => {
        if (service === 'Extra beds') {
            setExtraBedsCount((prevCount) => Math.max(0, prevCount - 1));
        } else if (service === 'Bed sheets') {
            setBedSheetsCount((prevCount) => Math.max(0, prevCount - 1));
        }
    };

    const handleCheckboxChange = (service) => {
        setServices((prevServices) => ({
            ...prevServices,
            [service]: !prevServices[service],
        }));

        if (!checkedItems.includes(service)) {
            setCheckedItems((prevCheckedItems) => [...prevCheckedItems, service]);
        } else {
            setCheckedItems((prevCheckedItems) =>
                prevCheckedItems.filter((item) => item !== service)
            );
        }
    };
    const handleBooking = async () => {
        if (!date) {
            setError('Please fill out the Date field.');
        } else if (!fromTime) {
            setError('Please fill out the From field.');
        } else if (!toTime) {
            setError('Please fill out the To field.');
        } else if (!serviceType) {
            setError('Please select a Service Type.');
        } else {
            setError('');
            checkTimeSlot(fromTime, toTime, timeSlots);
            if (!fromSlot || !toSlot) {
                console.log('Slots not selected');
                return;
            }
            try {
                const dbFromTimeRef = ref(db, `airports/${selectedCityIndex}/services/${serviceType}/slots/${fromSlot}/count`);
                const dbToTimeRef = ref(db, `airports/${selectedCityIndex}/services/${serviceType}/slots/${toSlot}/count`);
                const snapshot = await get(dbFromTimeRef);
                const snapshot1 = await get(dbToTimeRef);
                const fromTimeData = snapshot.val();
                const toTimeData = snapshot1.val();
                setShowDialog(true);
                if (fromTimeData > 0 && toTimeData > 0) {
                    if (fromSlot === toSlot) {
                        setIsAvailable(true);
                    }
                    else {
                        setIsAvailable(true);
                    }
                }
                else {
                    console.log("no")
                }
            } catch (error) {
                ;
                console.error('Error fetching airport details from the database:', error);
            }
        }
    }
    const checkTimeSlot = (fromTime, toTime, timeSlots) => {
        const fromTimeObj = new Date(`2000-01-01T${fromTime}:00`);
        const toTimeObj = new Date(`2000-01-01T${toTime}:00`);

        for (let i = 0; i < timeSlots.length; i++) {
            const slotStart = new Date(`2000-01-01T${timeSlots[i].start}:00`);
            const slotEnd = new Date(`2000-01-01T${timeSlots[i].end}:00`);

            if (fromTimeObj >= slotStart && fromTimeObj < slotEnd) {
                fromSlot = `slot${i + 1}`
            }
            if (toTimeObj > slotStart && toTimeObj <= slotEnd) {
                toSlot = `slot${i + 1}`
            }
        }
        console.log("from", fromSlot, "to", toSlot)
    };
    const handleCancel = () => {
        setShowDialog(false);
    };
    const handleBook = async () => {
        try {
            const dbFromTimeRef = ref(db, `airports/${selectedCityIndex}/services/${serviceType}/slots/${fromSlot}/count`);
            const dbToTimeRef = ref(db, `airports/${selectedCityIndex}/services/${serviceType}/slots/${toSlot}/count`);
            const snapshot = await get(dbFromTimeRef);
            const snapshot1 = await get(dbToTimeRef);
            const fromTimeData = snapshot.val();
            const toTimeData = snapshot1.val();
            const userUid = auth.currentUser.uid;
            if (userUid) {
                const userDetailsRef = ref(db, `users/${userUid}/bookingDetails`);
                await set(userDetailsRef, bookingDetails);
            }
            if (fromTimeData > 0 && toTimeData > 0) {
                if (fromSlot === toSlot) {
                    if (isAvailable) {
                        set(dbFromTimeRef, fromTimeData - 1);
                        setConfirmBooking(true);
                        console.log("yes")
                        setTimeout(() => {
                            setConfirmBooking(false);
                        }, 5000);
                    }

                }
                else {
                    if (isAvailable) {
                        set(dbFromTimeRef, fromTimeData - 1);
                        set(dbToTimeRef, toTimeData - 1);
                        setConfirmBooking(true);
                        console.log("yessss")
                        setTimeout(() => {
                            setConfirmBooking(false);
                        }, 5000);
                    }
                }
            }
            else {
                console.log("no")
            }
        } catch (error) {
            ;
            console.error('Error fetching airport details from the database:', error);
        }

        setShowDialog(false);
        setTimeout(() => {
            setError('');
        }, 5000);
    };
    const handleGeneratePdf = () => {
        const doc = new jsPDF();
        const email = auth.currentUser.email
        const name = auth.currentUser.displayName
        doc.rect(5, 5, doc.internal.pageSize.width - 10, doc.internal.pageSize.height - 10, 'S');
        doc.setFont('times', 'bold');
        doc.setFontSize(28);
        doc.text("LoungeEase", 85, 20)
        doc.setTextColor(0, 0, 0)
        doc.setFontSize(16);
        doc.text("Lounge Ease Booking receipt", 30, 35)
        doc.text(`Name: ${name}`, 10, 50);
        doc.text(`Date: ${Bookingdate}`, 10, 60);
        const { from } = bookingDetails[Bookingdate];
        const { to } = bookingDetails[Bookingdate];
        doc.text(`Time: ${from} - ${to}`, 10, 70);
        doc.text(`Email: ${email}`, 10, 80);
        doc.text("Invoice", 10, 100)
        doc.setFontSize(12);
        doc.setFont("times", "normal");
        autoTable(doc, { html: '#my-table' })
        doc.setFontSize(9);
        const tableData = [];
        const { service } = bookingDetails[Bookingdate];
        const { extraServices } = bookingDetails[Bookingdate];
        tableData.push([service, "1", "Rs600"]);
        for (const key in extraServices) {
            if (extraServices[key] === false)
                tableData.push([key, 0, `Rs${pricing[key]}`]);
            else if (extraServices[key] === true) {
                tableData.push([key, 1, `Rs${pricing[key]}`]);
            }
        }
        const { extraBeds } = bookingDetails[Bookingdate];
        const { extraSheets } = bookingDetails[Bookingdate];
        tableData.push(["Extra Beds", extraBeds, "Rs400"]);
        tableData.push(["Extra Sheets", extraSheets, "Rs50"]);
        tableData.push([" ", "Total Amount", `Rs${totalAmount}`]);
        autoTable(doc, {
            head: [['Services', 'Quantity', 'Price']],
            body: tableData,
            theme: 'striped',
            tableWidth: 160,
            startY: 110,
            styles: { textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.3, fontSize: 11 },
            columnStyles: { 0: { cellWidth: 'auto' }, 1: { cellWidth: 'auto' }, 2: { cellWidth: 'auto' } },
        });
        doc.save("Invoice.pdf");
    };
    let Bookingdate = date;
    let bookingDetails = {
        [Bookingdate]: {
            from: fromTime,
            to: toTime,
            service: serviceType,
            extraServices: services,
            extraBeds: extraBedsCount,
            extraSheets: bedSheetsCount,
        }
    }

    return (
        <MainContainer>
            {error && (
                <Typography color="error" style={{ marginBottom: '10px', fontFamily: 'Poppins, sans-serif', fontSize: '160px', }}>
                    {error}
                </Typography>
            )}
            {confirmBooking ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography style={{
                        marginBottom: '20px', fontFamily: 'Poppins, sans-serif', fontSize: '30px',
                        fontWeight: 'bold', color: 'white'
                    }}>
                        Booking Confirmed!!
                    </Typography>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <CheckAvailabilityButton
                            onClick={handleGeneratePdf}>
                            Download PDF
                        </CheckAvailabilityButton>
                    </div>
                </div>
            ) : (
                <DialogContent>
                    <Typography style={{
                        fontSize: '20px',
                        borderBottom: '2px solid #D8D0D0',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 600,
                    }}>Select Service at {selectedCity} Lounge</Typography>
                    <Grid container spacing={2} style={{ paddingTop: 20 }}>
                        <Grid item xs={12} sm={6}>
                            <Typography style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 500,
                                fontSize: '14px'
                            }}>Date<span style={{ color: 'red', marginLeft: '4px' }}>*
                                </span></Typography>
                            <TextField
                                variant="outlined"
                                fullWidth
                                value={date}
                                onChange={handleDate}
                                type='date'
                                InputProps={{
                                    style: {
                                        fontFamily: 'Poppins, sans-serif',
                                        fontWeight: 500,
                                        fontSize: '14px',
                                        borderRadius: '12px'
                                    },
                                }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 500,
                                fontSize: '14px'
                            }}>Service Type<span style={{ color: 'red', marginLeft: '4px' }}>*
                                </span></Typography>
                            <Select
                                value={serviceType}
                                onChange={handleServiceTypeChange}
                                fullWidth
                                sx={{ borderRadius: '12px', fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: 500 }}
                            >
                                <MenuItem value="Bunker cart" style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontWeight: 500,
                                    fontSize: '14px',
                                }}>Bunker Cart</MenuItem>
                                <MenuItem value="Individual pod" style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontWeight: 500,
                                    fontSize: '14px',
                                }}>Individual Pod</MenuItem>
                                <MenuItem value="Feeding room" style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontWeight: 500,
                                    fontSize: '14px',
                                }}>Feeding Room</MenuItem>
                                <MenuItem value="Silent room" style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontWeight: 500,
                                    fontSize: '14px',
                                }}>Silent Room</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 500,
                                fontSize: '14px'
                            }}>From<span style={{ color: 'red', marginLeft: '4px' }}>*</span></Typography>
                            <TextField
                                id="fromTime"
                                variant="outlined"
                                fullWidth
                                value={fromTime}
                                onChange={handleFromTime}
                                type='time'
                                inputProps={{
                                    style: {
                                        fontFamily: 'Poppins, sans-serif',
                                        fontWeight: 500,
                                        fontSize: '14px',
                                        borderRadius: '12px'
                                    },
                                }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 500,
                                fontSize: '14px'
                            }}>To<span style={{ color: 'red', marginLeft: '4px' }}>*</span></Typography>
                            <TextField
                                variant="outlined"
                                fullWidth
                                value={toTime}
                                onChange={handleToTime}
                                type='time'
                                inputProps={{
                                    style: {
                                        fontFamily: 'Poppins, sans-serif',
                                        fontWeight: 500,
                                        fontSize: '14px',
                                        borderRadius: '12px'
                                    },
                                }}
                                required
                            />
                        </Grid>
                    </Grid>
                    <Typography style={{
                        fontSize: '20px',
                        borderBottom: '2px solid #D8D0D0',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 600,
                        marginTop: 10
                    }}>Select Add-on Services</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Typography style={{ fontFamily: 'Poppins, sans-serif', }}>Extra beds (Price: ₹400)</Typography>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton onClick={() => handleDecrement('Extra beds')}>
                                        <RemoveIcon />
                                    </IconButton>
                                    <Typography style={{ fontFamily: 'Poppins, sans-serif', }}>{extraBedsCount}</Typography>
                                    <IconButton onClick={() => handleIncrement('Extra beds')}>
                                        <AddIcon />
                                    </IconButton>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Typography style={{ fontFamily: 'Poppins, sans-serif', }}>Bed sheets (Price: ₹50)</Typography>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton onClick={() => handleDecrement('Bed sheets')}>
                                        <RemoveIcon />
                                    </IconButton>
                                    <Typography style={{ fontFamily: 'Poppins, sans-serif', }}>{bedSheetsCount}</Typography>
                                    <IconButton onClick={() => handleIncrement('Bed sheets')}>
                                        <AddIcon />
                                    </IconButton>
                                </div>
                            </div>
                        </Grid>
                        {Object.keys(services).map((service, index) => (
                            <Grid item xs={6} key={index}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={services[service]}
                                                onChange={() => handleCheckboxChange(service)}
                                            />
                                        }
                                        label={`${service} (Price: ₹${pricing[service]})`}
                                    />
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography style={{ marginTop: 20, fontFamily: 'Poppins, sans-serif', }}>
                            Total Amount: ₹{totalAmount}
                        </Typography>
                        <CheckAvailabilityButton onClick={handleBooking}>Check Now</CheckAvailabilityButton>
                    </div>
                </DialogContent>
            )}
            <Dialog open={showDialog} onClose={() => setShowDialog(false)} PaperProps={{
                style: {
                    minWidth: '58%', position: 'absolute',
                    top: '45%',
                    left: '58%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '12px',
                    background: 'GrayText', opacity: '0.9'
                }
            }}>
                {isAvailable ? <div style={{ height: '150px', }}>
                    <Typography style={{ fontFamily: 'Poppins, sans-serif', }}>Yes Lounge is available for that day</Typography>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <CheckAvailabilityButton onClick={handleBook}>Book Now</CheckAvailabilityButton>
                        <CheckAvailabilityButton onClick={handleCancel}>Cancel</CheckAvailabilityButton>
                    </div>
                </div> :
                    <div>
                        <Typography style={{ fontFamily: 'Poppins, sans-serif', }}>No Lounge is available for that day</Typography>
                    </div>
                }
            </Dialog>
        </MainContainer>
    )
}

export default StartBooking;