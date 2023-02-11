import React, { useState, useEffect } from 'react';
import SipUserAgent from 'jssip';
import classNames from 'classnames/bind';

import styles from './CallToPhoneNumber.module.scss';
import NumberKeyboard from '../components/NumberKeyboard';
import CallingScreen from '../components/CallingScreen';

const cx = classNames.bind(styles);

let session;
let currentSession;

function CallToPhoneNumber() {
    let [number, setNumber] = useState('');
    let [status, setStatus] = useState(false);
    let [connected, setConnected] = useState(false);

    let [time, setTime] = useState(0);

    useEffect(() => {
        if (connected) {
            const interval = setInterval(() => {
                setTime((prevtime) => prevtime + 1);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [connected]);

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
                console.log('Call is in progress!');
                setStatus(true);
            },
            failed: function (e) {
                console.log('Call failed!');
                setStatus(false);
            },
            ended: function (e) {
                console.log('Call ended!');
                setStatus(false);
                setConnected(false);
                setTime(0);
            },
            confirmed: function (e) {
                console.log('Call confirmed!');
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

    return (
        <div className={cx('wrapper')}>
            {!status ? (
                <NumberKeyboard number={number} setNumber={setNumber} handleCalling={handleCalling} />
            ) : (
                <CallingScreen number={number} connected={connected} time={time} handleHangup={handleHangup} />
            )}
        </div>
    );
}

export default CallToPhoneNumber;
