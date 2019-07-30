import React from 'react';
import EventItem from './EventItem'
import './EventList.css'

const EventList = props =>{

    const events = props.events.map(event=>{
        return (
            <EventItem
                key={event._id}
                event={event}
                userId={props.authUserId}
                onDetail={props.onViewDetail}
            />
        )
    });

    return(<ul className="event__list">{events}</ul>)
};

export default EventList;