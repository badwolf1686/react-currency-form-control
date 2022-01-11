import React, { forwardRef, useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { zeroNumber, formatOnChange, formatOnBlur } from '../util';

const defaultProps = {
    atmMode: false,
    decimalSeparator: '.',
    fixedDecimalScale: 2,
    prefix: '$',
    thousandScale: 3,
    thousandSeparator: ','
};

const CurrencyControl = forwardRef(({
    atmMode,
    decimalSeparator,
    fixedDecimalScale,
    prefix,
    thousandScale,
    thousandSeparator,
    ...props
}, ref) => {
    const prefixStyle = {
        width: '1.0625rem',
        borderRight: '0rem',
        borderTopRightRadius: '0rem',
        borderBottomRightRadius: '0rem',
        paddingLeft: '0.1875rem',
        paddingRight: '0rem'
    };
    const numberStyle = {
        borderTopLeftRadius: '0rem',
        borderBottomLeftRadius: '0rem',
        paddingLeft: '0.1875rem'
    };

    const [number, setNumber] = useState('');

    useEffect(() => {
        let zero = zeroNumber(decimalSeparator, fixedDecimalScale)
        setNumber(zero)
    }, [decimalSeparator, fixedDecimalScale]);

    function numberOnFocus(e) {
        e.preventDefault();

        let zero = zeroNumber(decimalSeparator, fixedDecimalScale);

        if (e.target.value === zero && !atmMode) {
            setNumber('');
        }
    };

    function numberOnBlur(e) {
        e.preventDefault();

        setNumber(formatOnBlur(e.target.value, {
            atmMode: atmMode,
            decimalSeparator: decimalSeparator,
            fixedDecimalScale: fixedDecimalScale,
            thousandScale: thousandScale,
            thousandSeparator: thousandSeparator
        }));
    };

    function numberOnChange(e) {
        e.preventDefault();

        setNumber(formatOnChange(e.target.value, {
            atmMode: atmMode,
            decimalSeparator: decimalSeparator,
            fixedDecimalScale: fixedDecimalScale,
            thousandScale: thousandScale,
            thousandSeparator: thousandSeparator
        }));
    };

    return (
        <div className='d-flex'>
            <Form.Control
                disabled
                style={prefixStyle}
                value={prefix}
            />
            <Form.Control
                ref={ref}
                style={numberStyle}
                type='text'
                value={number}
                onFocus={numberOnFocus}
                onBlur={numberOnBlur}
                onChange={numberOnChange}
            />
        </div>
    );
});

CurrencyControl.propTypes = {
    atmMode: PropTypes.bool,
    decimalSeparator: PropTypes.string,
    fixedDecimalScale: PropTypes.number,
    prefix: PropTypes.string,
    thousandScale: PropTypes.number,
    thousandSeparator: PropTypes.string
};

CurrencyControl.displayName = 'CurrencyControl';
CurrencyControl.defaultProps = defaultProps;
export default CurrencyControl;
