import React, { Component } from "react";
import PropTypes from "prop-types";

import forms from "./../styles/forms.module.css";
import game from "./../styles/game.module.css";

class Game extends Component {

    connection;

    constructor(props) {
        super(props);
        this.state = {
            isConnected: false,
            gameId: null,
            name: this.props.name,
            clients: [],
            timeLeft: 600,
            locations: [],
            location: null,
            spy: null,
            duration: 0,
            isAdmin: false
        };
    }

    componentWillUnmount() {
        this.connection = null;
    }

    componentWillMount() {

        // connect to websocket
        this.connect(() => {
            switch(this.props.type) {
                case 'join': this.join(); break;
                case 'create': this.create(); break;
                default: console.log('wrong props `type`'); break;
            }
        });

        // set initial state
        switch(this.props.type) {
            case 'join': {
                this.setState({
                    name: this.props.name,
                    gameId: this.props.config.id
                });
                break;
            }
            case 'create': {
                this.setState({
                    name: this.props.name,
                    duration: this.props.config.gameLength
                });
                break;
            }
            default: {
                console.log('wrong props `type`');
                break;
            }
        }

    }

    connect(callback) {

        if(this.state.isConnected) {
            return;
        }

        this.connection = new WebSocket('ws://127.0.0.1:1337');

        this.connection.onopen = () => {
            console.log('connected to ws server');
            this.setState({
                isConnected: true
            });
            if(callback) {
                callback();
            }
        };

        this.connection.onmessage = (message) => {
            let data = JSON.parse(message.data);

            switch(data.type) {
                case 'create': {
                    if(data.status === 200) {
                        this.setState({
                            gameId: data.id,
                            clients: data.clients
                        });
                    }
                    break;
                }
                case 'join': {
                    if(data.status === 200) {
                        this.setState({
                            gameId: data.id,
                            clients: data.clients
                        });
                    }
                    break;
                }
                case 'update': {
                    this.setState({
                        gameId: data.id,
                        clients: data.clients,
                        spy: data.spy,
                        location: data.location,
                        locations: data.locations,
                        timeLeft: data.timeLeft,
                        isAdmin: data.isAdmin
                    });
                    break;
                }
                case 'response': {
                    console.log(data);
                    break;
                }
                default: {
                    console.log(data);
                    break;
                }
            }

        };

        this.connection.onclose = () => {
            console.log('connection closed');
            this.setState({
                isConnected: false
            });
            setTimeout(() => {
                console.log('trying to reconnect...');
                this.connect();
            }, 1000);
        };

    };
    request = (data) => {
        if(this.state.isConnected) {
            this.connection.send(JSON.stringify(data));
        } else {
            console.log('failed to '+data.type+', no ws connection available');
        }
    };
    create = () => {
        if(this.state.name !== '') {
            this.request({
                type: 'create',
                name: this.state.name
            });
        }
    };
    join = () => {
        if(this.state.name !== '') {
            this.request({
                type: 'join',
                lobbyid: this.state.gameId,
                name: this.state.name
            });
        }
    };
    configure = () => {
        this.request({
            type: 'configure',
            duration: this.state.duration
        });
    };
    leave = () => {
        this.request({
            type: 'leave',
            lobbyid: this.state.gameId
        });
    };
    start = () => {
        this.request({
            type: 'start',
            lobbyid: this.state.gameId
        });
    };
    render() {

        const adminPanel = (
            <div className={forms.buttonGroup}>
                <button className={forms.button} onClick={this.start}>Start</button>
                <button className={`${forms.button} ${forms.danger}`} onClick={this.leave}>Leave</button>
            </div>
        );

        const userPanel = (
            <div className={forms.buttonGroup}>
                <button className={`${forms.button} ${forms.danger}`} onClick={this.leave}>Leave</button>
            </div>
        );

        return (
            <div>

                Your WS connection state: {this.state.isConnected ? 'connected': 'disconnected'}<br/>
                Your Game ID: {this.state.gameId} <br/>
                Your permission: {this.state.isAdmin ? 'admin' : 'none'}<br />
                Game status: <br />
                Time left: {this.state.timeLeft} seconds<br />
                Your Name: {this.state.name}<br/>

                <h4>Clients in lobby</h4>
                <ul>
                {
                    this.state.clients.length > 0
                        ? this.state.clients.map(client => (
                          <li key={client}>{client}</li>
                        ))
                        : <li>No clients in lobby</li>
                }
                </ul>


                <h3>Possible Locations</h3>

                <div className={game.locations}>
                    {
                        this.state.locations.map(location => <div className={game.location}>{location}</div>)
                    }
                </div>


                {this.state.isAdmin ? adminPanel : userPanel}

            </div>
        );
    }

}

Game.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired
};

export default Game;