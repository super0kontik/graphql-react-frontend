import React,{Component} from 'react';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import EventList from '../components/Events/EventList';
import Spinner from '../components/Spinner/Spinner'
import './Events.css'
class EventsPage extends Component{
    state={
        creating:false,
        events:[],
        isLoading:false,
        selectedEvent:null
    };
    isActive=true;

    constructor(props){
        super(props);
        this.titleElRef = React.createRef();
        this.priceElRef = React.createRef();
        this.dateElRef = React.createRef();
        this.descriptionElRef = React.createRef();
    }


    componentDidMount(){
        this.fetchEvents()
    }


    startCreateEventHandler=()=>{
        this.setState({creating:true});
    };


    modalConfirmHandler=()=>{
        const title = this.titleElRef.current.value;
        const price = +this.priceElRef.current.value;
        const date = this.dateElRef.current.value;
        const description = this.descriptionElRef.current.value;
        if(title.trim().length ===0|| description.trim().length ===0||price<=0||date.trim().length ===0){
            alert('Wrong input');
            return;
        }

        const event={title,price,date,description};
        console.log(event);

        const reqBody = {
            query: `
          mutation CreateEvent($title: String!, $description: String!, $price:Float!, $date:String!){
            createEvent(eventInput: {title: $title, description: $description, price: $price, date: $date}) {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }`,
            variables:{
                title:title,
                description:description,
                price:price,
                date:date
            }
        };

        const token = this.props.context.token;
        
        fetch('http://localhost:8000/graphql',{
            method:'POST',
            body:JSON.stringify(reqBody),
            headers:{
                'Content-Type' :'application/json',
                 Authorization : 'Bearer '+token
            }
        }).then(res=>{
            if (res.status!==200 && res.status!==201){
                throw new Error("Failed");
            }
            return res.json();
        }).then(resData=>{
            console.log(resData)
            this.setState(prevState=>{
                const updatedEvents =[...prevState.events];
                updatedEvents.push(resData.data.createEvent);
                return {events:updatedEvents}
            });
            this.setState({creating:false});
        }).catch(e=>{
            alert('Error!!!');
        });
    };


    modalCancelHandler=()=>{
        this.setState({creating:false,selectedEvent:null});
    };


    fetchEvents() {
        this.setState({isLoading:true});
            const requestBody = {
                query: `
          query {
            events {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `
            };
            fetch('http://localhost:8000/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => {
                    if (res.status !== 200 && res.status !== 201) {
                        throw new Error('Failed!');
                    }
                    return res.json();
                })
                .then(resData => {
                    const events = resData.data.events;
                    if(this.isActive) {
                        this.setState({events: events, isLoading: false});
                    }
                })
                .catch(err => {
                    console.log(err);
                    if(this.isActive) this.setState({isLoading:false});
                });
        }


    showDetailsHandler = eventId =>{
        this.setState(prevState=>{
            const selected =prevState.events.find(e=>e._id === eventId)
            return{selectedEvent:selected}
        })
    };


    bookEventHandler= ()=>{
        const reqBody = {
            query: `
          mutation BookEvent($id:ID!){
            bookEvent(eventId: $id) {
              _id
              createdAt
              updatedAt
            }
          }`,
            variables:{
                id:this.state.selectedEvent._id
            }
        };

        const token = this.props.context.token;

        fetch('http://localhost:8000/graphql',{
            method:'POST',
            body:JSON.stringify(reqBody),
            headers:{
                'Content-Type' :'application/json',
                Authorization:'Bearer '+token
            }
        }).then(res=>{
            if (res.status!==200 && res.status!==201){
                throw new Error("Failed");
            }
            return res.json();
        }).then(resData=>{
            this.setState({selectedEvent:null});
        }).catch(e=>{
            alert('Error!!!');
        });
    };

    componentWillUnmount(){
        this.isActive=false;
    }

    render(){
        return(
            <React.Fragment>
                {(this.state.creating || this.state.selectedEvent) && <Backdrop/>}
                {this.state.creating &&
                <Modal title="Add event" confirmText='Confirm' canCancel canSubmit onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler}>
                    <form>
                        <div className="form-control">
                            <label htmlFor="title">Title: </label>
                            <input type="text" id="title" ref={this.titleElRef}/>
                        </div>
                        <div className="form-control">
                            <label htmlFor="price">Price: </label>
                            <input type="number" id="price" ref={this.priceElRef}/>
                        </div>
                        <div className="form-control">
                            <label htmlFor="date">Date of event: </label>
                            <input type="datetime-local" id="date" ref={this.dateElRef}/>
                        </div>
                        <div className="form-control">
                            <label htmlFor="description">Description: </label>
                            <textarea id="description" rows="4" ref={this.descriptionElRef}/>
                        </div>
                    </form>
                </Modal>}


                {this.state.selectedEvent &&
                <Modal
                    title={this.state.selectedEvent.title}
                    canCancel
                    canSubmit={this.props.context.token}
                    confirmText='Book'
                    onCancel={this.modalCancelHandler}
                    onConfirm={this.bookEventHandler}>
                    <h2>${this.state.selectedEvent.price} <br/>
                         { new Date(+this.state.selectedEvent.date).toLocaleDateString()}
                         {new Date(+this.state.selectedEvent.date).toLocaleTimeString()}</h2>
                    <p>{this.state.selectedEvent.description}</p>

                </Modal>}


                { this.props.context.token && <div className="events-control">
                    <h2>Add your event:</h2>
                    <button className="btn" onClick={this.startCreateEventHandler}>Create Event</button>
                </div>}
                {this.state.isLoading
                    ?
                    <Spinner/>
                    :
                    <EventList
                        events={this.state.events}
                        authUserId={this.props.context.userId}
                        onViewDetail={this.showDetailsHandler}
                    />}
            </React.Fragment>
        )
    }
}

export default props=>(
    <AuthContext.Consumer>
        {state=> <EventsPage context={state}/> }
    </AuthContext.Consumer>
);