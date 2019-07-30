import React,{Component} from 'react';
import {BrowserRouter,Route, Redirect,Switch} from 'react-router-dom'
import AuthPage from './pages/Auth'
import EventsPage from './pages/Events'
import BookingsPage from './pages/Bookings'
import MainNav from './components/nav/MainNav'
import AuthContext from './context/auth-context'
import './App.css'


class App extends Component{

    state={
        token:null,
        userId:null
    };

    componentDidMount(){
        const token = localStorage.getItem('token');
        const userId= localStorage.getItem('userId');
        if(token&& userId){
            this.setState({token:token,userId:userId})
        }
    }

    login=(token, userId)=>{
        this.setState({token:token,userId:userId})
        localStorage.setItem('token',token);
        localStorage.setItem('userId',userId);
    };

    logout=()=>{this.setState({token:null,userId:null})};

  render() {
      return (
          <div className="App">
              <BrowserRouter>
                  <React.Fragment>
                      <AuthContext.Provider value={{token:this.state.token, userId:this.state.userId,login:this.login,logout:this.logout}}>
                          <MainNav/>
                              <Switch >
                                  <main className="main-content">
                                      {this.state.token&&<Redirect from='/' to="/events" exact/>}
                                      {this.state.token&&<Redirect from='/auth' to="/events" exact/>}
                                      {!this.state.token&&<Route path='/auth' component={AuthPage}/>}
                                      <Route path='/events' component={EventsPage}/>
                                      {this.state.token&&
                                      <Route path='/bookings' component={BookingsPage}/>}
                                      {!this.state.token&&<Redirect to="/auth" exact/>}
                                  </main>
                              </Switch>
                      </AuthContext.Provider>
                  </React.Fragment>
              </BrowserRouter>
          </div>
      );
  }
}

export default App;
