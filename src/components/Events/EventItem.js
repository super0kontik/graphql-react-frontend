import React from 'react';
import './EventItem.css';

 const EventItem = props =>(
    <li className="events__list-item">
        <div>
            <h1>{props.event.title}</h1>
            <h2>${props.event.price} - { new Date(+props.event.date).toLocaleDateString()}</h2>
        </div>
        <div>
            {props.userId === props.event.creator._id?<p>you're the creator of this event</p>
            :<button className="btn" onClick={props.onDetail.bind(this,props.event._id)}>View Details</button>}
        </div>
        </li>
 );


export default EventItem;