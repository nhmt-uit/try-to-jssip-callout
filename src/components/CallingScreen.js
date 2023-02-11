import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import styles from './CallingScreen.module.scss';

const cx = classNames.bind(styles);

function NumberKeyboard({ number, connected, time, handleHangup }) {
    let [sec, setSec] = useState('');
    let [min, setMin] = useState('');

    useEffect(() => {
        let m = Math.floor(time / 60);
        let s = time - 60 * m;

        if (m < 10) m = '0' + m;
        if (s < 10) s = '0' + s;

        setMin(m);
        setSec(s);
    }, [time]);
    return (
        <div className={cx('phone')}>
            <h3> {number} </h3>
            {connected ? (
                <p>
                    {min}:{sec}
                </p>
            ) : (
                <p className={cx('calling')}>Calling</p>
            )}
            <button className={cx('button-hangup')} onClick={() => handleHangup()}>
                <img src="https://cdn-icons-png.flaticon.com/512/4059/4059257.png" width="75" height="75" alt="Call" />
            </button>
        </div>
    );
}

export default NumberKeyboard;
