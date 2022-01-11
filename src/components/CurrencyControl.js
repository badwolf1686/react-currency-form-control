import React, { forwardRef, useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { nondigitCount, zeroNumber, formatOnChange, formatOnBlur } from '../util';

const defaultProps = {
    atmMode: false,
    decimalSeparator: '.',
    fixedDecimalScale: 2,
    prefix: '$',
    integerGroupType: 'thousand',
    integerGroupSeparator: ','
};

const CurrencyControl = forwardRef(({
    atmMode,
    decimalSeparator,
    fixedDecimalScale,
    prefix,
    integerGroupType,
    integerGroupSeparator,
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
            integerGroupType: integerGroupType,
            integerGroupSeparator: integerGroupSeparator
        }));
    };

    function numberOnChange(e) {
        e.preventDefault();
        const target = e.target;
        const targetLen = target.value.length

        const newValue = formatOnChange(target.value, {
            atmMode: atmMode,
            decimalSeparator: decimalSeparator,
            fixedDecimalScale: fixedDecimalScale,
            integerGroupType: integerGroupType,
            integerGroupSeparator: integerGroupSeparator
        });
        setNumber(newValue);
        
        let caret = target.selectionStart;
        if (caret !== targetLen) {
            // reset caret position if was not at the end of input
            const prevNdigitCount = nondigitCount(target.value.slice(0, caret));
            const curNdigitCount = nondigitCount(newValue.slice(0, caret));
            caret = caret - prevNdigitCount + curNdigitCount;
            window.requestAnimationFrame(() => {
                target.selectionStart = caret;
                target.selectionEnd = caret;
            })
        }
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
    integerGroupType: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
    ]),
    integerGroupSeparator: PropTypes.string
};

CurrencyControl.displayName = 'CurrencyControl';
CurrencyControl.defaultProps = defaultProps;
export default CurrencyControl;
