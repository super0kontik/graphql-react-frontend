import React from 'react';
import './BookingList.css';

const bookingList = props =>(
    <ul className="bookings__list">
        {props.bookings.map(booking=>{
        return (
            <li className="bookings__item" key={booking._id}>
            <div className="bookings__item-data">
                <h2>{booking.event.title}</h2>
            <p>{new Date(+booking.event.date).toLocaleDateString()} :
                {new Date(+booking.event.date).toLocaleTimeString()}</p>
                <p>${booking.event.price}</p>
            </div>
            <div className="bookings__item-action">
               <button className="btn" onClick={props.cancelBookingHandler.bind(this,booking._id)}>Cancel</button>
            </div>
        </li>
        )
    })}
    </ul>
);

export default bookingList;

