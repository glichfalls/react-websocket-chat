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
            isAdmin: false,
            gameState: 'waiting'
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
                        gameState: data.state,
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
        this.props.leave();
    };
    start = () => {
        this.request({
            type: 'start',
            lobbyid: this.state.gameId
        });
    };
    countdown = () => {
        let time = this.state.timeLeft;
        return Math.floor(time / 60) + ':' + (time%60 > 9 ? time%60 : "0" + (time%60));
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

                <div className={`${game.status} ${this.state.isConnected ? game.connected : game.disconnected}`} />

                <div style={{display: (this.state.gameState === 'started' ? 'flex' : 'none')}} className={game.countdown}>
                    <span>{this.countdown()}</span>
                </div>

                <div className={game.share}>
                    <input className={forms.input} type={'text'} readOnly={true} value={this.state.gameId} />
                </div>

                <h4 className={game.sectionTitle}>Clients in lobby</h4>
                <div className={game.clients}>
                {
                    this.state.clients.length > 0
                        ? this.state.clients.map(client => (
                          <div className={`${game.client}`} key={client}>{client}</div>
                        ))
                        : <div>No clients in lobby</div>
                }
                </div>

                <div style={{display: (this.state.gameState === 'started' ? 'block' : 'none')}}>
                    <h4 className={game.sectionTitle}>Possible Locations</h4>
                    <div className={game.locations}>
                        {
                            this.state.locations.map(location => <div className={game.location}>{location}</div>)
                        }
                    </div>
                </div>

                {this.state.isAdmin ? adminPanel : userPanel}

            </div>
        );
    }

}

Game.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
    leave: PropTypes.func.isRequired
};

export default Game;