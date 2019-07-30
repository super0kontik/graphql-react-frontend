import React,{Component} from 'react';
import AuthContext from '../context/auth-context'
import Spinner from '../components/Spinner/Spinner'
import BookingList from '../components/Bookings/BookingList'
import Chart from '../components/Bookings/Chart';
import './Bookings.css';

class BookingsPage extends Component{
    state={
        isLoading:false,
        bookings:[],
        outputType:'list'
    };
    
    isActive=true;
    
    componentDidMount(){
        this.fetchBookings()
    }

    fetchBookings=()=>{
        this.setState({isLoading:true});
        const requestBody = {
            query: `
          query {
            bookings {
              _id
              createdAt
              event{
                _id
                title
                date
                price
              }
              
            }
          }
        `
        };
        const token = this.props.context.token;
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization : 'Bearer '+token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                const bookings = resData.data.bookings;
                if(this.isActive) {
                    this.setState({bookings: bookings, isLoading: false});
                }
            })
            .catch(err => {
                console.log(err);
                if(this.isActive) this.setState({isLoading:false});
            });
    };

    cancelBookingHandler= bookingId =>{
        this.setState({isLoading:true});
        const requestBody = {
            query: `
          mutation CancelBooking($id : ID!){
            cancelBooking(bookingId : $id) {
                _id
                title
            }
          }
        `,
            variables:{
                id:bookingId
            }
        };
        const token = this.props.context.token;
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization : 'Bearer '+token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                this.setState(prevState=>{
                    const updatedBookings = prevState.bookings.filter(booking=> booking._id !== bookingId)
                    return {bookings:updatedBookings,isLoading:false}

                })
            })
            .catch(err => {
                console.log(err);
                this.setState({isLoading:false});
            });
    };

    componentWillUnmount(){
        this.isActive=false;
    }

    changeOutputHandler=type=>{
        this.setState({outputType:type})
    };

    render(){
        let content = <Spinner/> ;
        if(!this.state.isLoading){
            content=(
                <React.Fragment>
                    <div className="bookings-control">
                        <button className={this.state.outputType==='list'?'active':''} onClick={this.changeOutputHandler.bind(this,'list')}>List</button>
                        <button className={this.state.outputType==='chart'?'active':''} onClick={this.changeOutputHandler.bind(this,'chart')}>Chart</button>
                    </div>
                    <div>
                        {this.state.outputType ==='list'?
                            <BookingList cancelBookingHandler={this.cancelBookingHandler} bookings={this.state.bookings}/>
                            :
                            <Chart bookings={this.state.bookings}/>
                        }
                    </div>
                </React.Fragment>
            )
        }
        return(
            <React.Fragment>
                {content}
            </React.Fragment>
        )
    }
}

export default props=>(
<AuthContext.Consumer>
    {state=> <BookingsPage context={state}/> }
</AuthContext.Consumer>)