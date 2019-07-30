import React from 'react';
import {Bar} from 'react-chartjs';
const BookingsBucket={
    'Cheap':{
        min:0,
        max:50
    },
    'Normal':{
        min:50,
        max:100
    },
    'Expensive':{
        min:100,
        max:10000000000000
    }
};

const Chart = props =>{
    let bookings = props.bookings;
    let values = []
    const chartData = { labels: [], datasets: [] };
    for(const border in BookingsBucket){
        const count = bookings.reduce((prev,cur)=>{
            if(cur.event.price < BookingsBucket[border].max && cur.event.price >= BookingsBucket[border].min){
                return ++prev;
            }else{
                return prev;
            }
        },0);

        values.push(count);
        chartData.labels.push(border);
        chartData.datasets.push({
            // label: "My First dataset",
            fillColor: 'rgba(220,220,220,0.5)',
            strokeColor: 'rgba(220,220,220,0.8)',
            highlightFill: 'rgba(220,220,220,0.75)',
            highlightStroke: 'rgba(220,220,220,1)',
            data: values
        });
        values = [...values];
        values[values.length - 1] = 0;
    }
    
    return <div style={{ textAlign: 'center' }}> <Bar data={chartData}/></div>
};
export default Chart;