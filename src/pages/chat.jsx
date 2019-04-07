import React, { Component } from "react";

import styles from "../styles/chat.module.css";


const MessageFromServer = (key, sender, message) => (
    <div key={key} className={`${styles.message} ${styles.server}`}>
        <span className={`${styles.sender}`}>{sender}</span>
        <span className={`${styles.body} `}>{message}</span>
    </div>
);

const MessageFromClient = (key, message) => <span className={`${styles.message} ${styles.client}`} key={key}>{message}</span>;
const SystemMessage = (key, message) => <span className={`${styles.message} ${styles.system}`} key={key}>{message}</span>;

class Chat extends Component {

    connection;

    reconnect = null;

    constructor(props) {
        super(props);

        this.type = this.type.bind(this);

        this.state = {
            name: this.props.match.params.username,
            isConnected: false,
            message: '',
            history: [],
        }
    }

    componentDidMount() {
        this.connect();
    }

    componentDidUpdate() {
        let el = document.getElementById('container');
        el.scrollTop = el.scrollHeight;
    }

    connect() {

        this.connection = new WebSocket('wss://spyfall.portner.dev:8888');

        this.connection.onopen = () => {
            this.setState({
                history: this.state.history.concat([{
                    from: 'system',
                    message: 'connection opened'
                }]),
                isConnected: true
            });
        };

        this.connection.onmessage = (event) => {

            console.log(event);

            let data = JSON.parse(event.data);

            this.setState({
                history: this.state.history.concat([{
                    from: 'server',
                    sender: data.sender,
                    message: data.message
                }])
            });
        };

        this.connection.onclose = () => {
            this.setState({
                history: this.state.history.concat([{
                    from: 'system',
                    message: 'connection closed'
                }]),
                isConnected: false
            });

            setTimeout(() => {
                this.setState({
                    history: this.state.history.concat([{
                        from: 'system',
                        message: 'Trying to reconnect...'
                    }])
                });
                this.connect();
            }, 5000);

        };

    }

    type(e) {
        this.setState({
            message: e.target.value
        })
    }

    send() {
        if (this.state.message !== '') {
            this.connection.send(JSON.stringify({sender: this.state.name, message: this.state.message}));
            this.setState({
                message: '',
                history: this.state.history.concat([{
                    from: 'client',
                    message: `${this.state.message}`
                }])
            });
        }
    }

    enter = (e) => {
        if(e.key === 'Enter') {
            this.send();
        }
    };


    render() {
        return(
            <div className={styles.chat}>
                <div id="container" className={styles.chatContainer}>
                    <div className={styles.messages}>
                        {
                            this.state.history.map((message, key) => {
                                let msg;
                                switch(message.from) {
                                    case 'client':
                                        msg = MessageFromClient(key, message.message);
                                        break;
                                    case 'server':
                                        msg = MessageFromServer(key, message.sender, message.message);
                                        break;
                                    case 'system':
                                        msg = SystemMessage(key, message.message);
                                        break;
                                    default:
                                        msg = '';
                                }
                                return msg;
                            })
                        }
                    </div>
                </div>
                <div className={styles.input}>
                    <input type="text"
                           value={this.state.message}
                           ref={input => input && input.focus()}
                           onKeyPress={this.enter}
                           onChange={this.type}
                           autoFocus={true}
                           disabled={!this.state.isConnected}
                    />
                </div>
            </div>
        )
    }
}

export default Chat;