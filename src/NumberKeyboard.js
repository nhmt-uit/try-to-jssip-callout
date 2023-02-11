import React, { useState, useEffect } from 'react';
import SipUserAgent from 'jssip';
import classNames from 'classnames/bind';

import styles from './NumberKeyboard.module.scss';

const cx = classNames.bind(styles);

let keyboardArr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
let session;
let currentSession;

function NumberKeyboard() {
    let [number, setNumber] = useState('');
    let [status, setStatus] = useState(false);
    let [connected, setConnected] = useState(false);

    let [time, setTime] = useState(0);
    let [sec, setSec] = useState('');
    let [min, setMin] = useState('');

    useEffect(() => {
        if (connected) {
            const interval = setInterval(() => {
                setTime((prevtime) => prevtime + 1);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [connected]);

    useEffect(() => {
        let m = Math.floor(time / 60);
        let s = time - 60 * m;

        if (m < 10) m = '0' + m;
        if (s < 10) s = '0' + s;

        setMin(m);
        setSec(s);
    }, [time]);

    const handleCalling = () => {
        const socket = new SipUserAgent.WebSocketInterface('wss://sbc03.tel4vn.com:7444');
        socket.via_transport = 'tcp';
        const configuration = {
            sockets: [socket],
            uri: 'sip:105@2-test1.gcalls.vn:50061',
            password: 'test1105',
        };
        const userAgent = new SipUserAgent.UA(configuration);

        userAgent.start();

        userAgent.on('newRTCSession', function (e) {
            console.log('New Webrtc session created!');
            currentSession = e.session;
        });

        userAgent.on('connected', () => {
            console.log('Connected');
        });

        userAgent.on('disconnected', () => {
            console.log('Disconnected');
        });

        // Register callbacks to desired call events
        let eventHandlers = {
            progress: function (e) {
                console.log('Call is in progress');
                setStatus(true);
            },
            failed: function (e) {
                console.log('Call failed with cause: ');
                setStatus(false);
            },
            ended: function (e) {
                console.log('Call ended with cause: ');
                setStatus(false);
                setConnected(false);
                setTime(0);
            },
            confirmed: function (e) {
                console.log('Call confirmed');
                setConnected(true);
            },
        };

        let options = {
            eventHandlers: eventHandlers,
            mediaConstraints: { audio: true, video: false },
            sessionTimersExpires: 120,
        };

        session = userAgent.call(`sip:${number}@2-test1.gcalls.vn:50061`, options);

        session.connection.addEventListener('addstream', (event) => {
            const audio = document.createElement('audio');
            document.body.appendChild(audio);
            audio.srcObject = event.stream;
            audio.play();
        });
    };

    const handleHangup = () => {
        currentSession.terminate();
    };

    const handleDelete = () => {
        if (number !== '') {
            setNumber(number.slice(0, -1));
        }
    };

    let KeyboardNumber = keyboardArr.map((item) => {
        return (
            <span key={item} onClick={() => setNumber((number += item))}>
                <i>{item}</i>
            </span>
        );
    });

    return (
        <div className={cx('wrapper')}>
            {/*  Phone area  */}
            <div className={cx('phone')}>
                {/*  phone area  */}
                {!status ? (
                    <div className={cx('phone-container')}>
                        <input
                            disabled={true}
                            type="text"
                            className={cx('number-input')}
                            value={number}
                            placeholder="Phone Number"
                        />

                        {/*  keyboard  */}
                        <div className={cx('keyboard')}>
                            <div className={cx('number')}>{KeyboardNumber}</div>
                            <div className={cx('button-area')}>
                                <button
                                    className={cx('button-calling')}
                                    disabled={number === ''}
                                    onClick={() => handleCalling()}
                                >
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/5585/5585856.png"
                                        width="75"
                                        height="75"
                                        alt="Call"
                                    />
                                </button>
                                <button className={cx('button-deleting')} onClick={() => handleDelete()}>
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/9222/9222691.png"
                                        width="70"
                                        height="70"
                                        alt="Delete"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h3> {number} </h3>
                        {connected ? (
                            <p>
                                {min}:{sec}
                            </p>
                        ) : (
                            <p className={cx('calling')}>Calling</p>
                        )}
                        <button className={cx('button-hangup')} onClick={() => handleHangup()}>
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/4059/4059257.png"
                                width="75"
                                height="75"
                                alt="Call"
                            />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default NumberKeyboard;
