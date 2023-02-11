import React from 'react';
import classNames from 'classnames/bind';

import styles from './NumberKeyboard.module.scss';

const cx = classNames.bind(styles);

let keyboardArr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

function NumberKeyboard({ number, setNumber, handleCalling }) {
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
        <div className={cx('phone')}>
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
        </div>
    );
}

export default NumberKeyboard;
