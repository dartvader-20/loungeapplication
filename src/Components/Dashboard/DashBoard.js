import React from 'react'
import Navbar from '../Navbar/NavBar';
import Services from './Services';

const DashBoard = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Navbar />
            <Services />
        </div>
    )
}

export default DashBoard;