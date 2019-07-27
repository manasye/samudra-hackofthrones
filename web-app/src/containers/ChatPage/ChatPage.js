import React, { Component, Fragment } from 'react';
import './ChatPage.css';
import $ from 'jquery';
import axiosSocket from '../../axios/axios-socket';
import io from 'socket.io-client';
const socket = io(axiosSocket.defaults.baseURL);

function findIdInArr(string, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].userId === string) {
            return true;
        }
    }
    return false;
}

export default class ChatPage extends Component {
    state = {
        chats: [],
        users: [],
        userSelected: {
            name: '',
            userId: ''
        }
    };

    componentDidMount() {
        socket.emit('join', {
            room: localStorage.getItem('key')
        });
        socket.on('web-recv', msg => {
            let userId = msg.from_user;
            if (userId !== 'server') {
                userId = msg.from_user.id;
                let chatUser = {
                    message: msg.message,
                    status: 'incoming',
                    userId
                };
                if (findIdInArr(userId, this.state.users)) {
                    this.setState({
                        chats: [...this.state.chats, chatUser]
                    });
                } else {
                    let user = {};
                    user = {
                        userId,
                        photo: msg.from_user.image,
                        name: msg.from_user.name
                    };
                    this.setState({
                        chats: [...this.state.chats, chatUser],
                        users: [...this.state.users, user]
                    });
                }
            }
        });
        socket.emit('web-sync', localStorage.getItem('key'));
        socket.on('web-messages', listOfChats => {
            for (let i = 0; i < listOfChats.length; i++) {
                let chat = listOfChats[i];
                if (chat.from_user === localStorage.getItem('key')) {
                    const userId = chat.to_user;
                    let chatUser = {
                        message: chat.message,
                        status: 'outcoming',
                        userId
                    };

                    this.setState({
                        chats: [...this.state.chats, chatUser]
                    });
                } else {
                    const userId = chat.from_user.id;
                    let chatUser = {
                        message: chat.message,
                        status: 'incoming',
                        userId
                    };
                    if (findIdInArr(userId, this.state.users)) {
                        this.setState({
                            chats: [...this.state.chats, chatUser]
                        });
                    } else {
                        let user = {};
                        user = {
                            userId,
                            photo: chat.from_user.image,
                            name: chat.from_user.name
                        };

                        this.setState({
                            chats: [...this.state.chats, chatUser],
                            users: [...this.state.users, user]
                        });
                    }
                }
                this.setState({ userSelected: this.state.users[0] });
            }
        });
    }

    replyChat = id => {
        socket.emit('web-send', {
            from_user: localStorage.getItem('key'),
            to_user: id,
            message: $('#reply-chat').val()
        });
        let chatUser = {
            message: $('#reply-chat').val(),
            status: 'outcoming',
            userId: id
        };
        $('#reply-chat').val('');
        this.setState({ chats: [...this.state.chats, chatUser] });
    };

    render() {
        return (
            <div className="chatpage-container">
                <div className="chatpage-wrapper">
                    <div className="row">
                        <div className="col-5">
                            {this.state.users.map(user => {
                                return (
                                    <div
                                        className={
                                            user === this.state.userSelected
                                                ? 'chatpage-smallbox active'
                                                : 'chatpage-smallbox'
                                        }
                                        key={user.userId}
                                        onClick={() =>
                                            this.setState({
                                                userSelected: user
                                            })
                                        }>
                                        <div className="row">
                                            <div className="col-3">
                                                <img src={user.photo} alt="" />
                                            </div>
                                            <div className="col-9">
                                                <h4>{user.name}</h4>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="col-7 chatpage-content">
                            <div className="chatpage-header-user">
                                <h3>{this.state.userSelected.name}</h3>
                            </div>
                            <div className="chatpage-content-chat">
                                {this.state.chats.map((chat, index) => {
                                    if (
                                        chat.userId ===
                                        this.state.userSelected.userId
                                    ) {
                                        if (chat.status === 'incoming') {
                                            return (
                                                <Fragment key={index}>
                                                    <div className="incoming-message-container">
                                                        <p>{chat.message}</p>
                                                    </div>
                                                </Fragment>
                                            );
                                        } else {
                                            return (
                                                <Fragment key={index}>
                                                    <div className="outgoing-message-container">
                                                        <p>{chat.message}</p>
                                                    </div>
                                                </Fragment>
                                            );
                                        }
                                    } else {
                                        return null;
                                    }
                                })}
                            </div>
                            {this.state.chats.length === 0 ? null : (
                                <div className="chatpage-reply">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="reply-chat"
                                    />
                                    <i
                                        className="fab fa-telegram-plane"
                                        onClick={() =>
                                            this.replyChat(
                                                this.state.userSelected.userId
                                            )
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
