import React, { forwardRef, useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { nondigitCount, zeroNumber, formatOnChange, formatOnBlur } from '../util';

const defaultProps = {
    atmMode: false,
    decimalSeparator: '.',
    fixedDecimalScale: 2,
    numberStyle: {},
    prefix: '$',
    prefixStyle: {},
    integerGroupType: 'thousand',
    integerGroupSeparator: ',',
    onValueChange: () => '0',
    className: ''
};

const CurrencyControl = forwardRef(({
    atmMode,
    decimalSeparator,
    fixedDecimalScale,
    numberStyle,
    prefix,
    prefixStyle,
    integerGroupType,
    integerGroupSeparator,
    onValueChange,
    className,
    value,
    ...props
}, ref) => {
    const prefixStyles = {
        width: '1.0625rem',
        borderRight: '0rem',
        borderTopRightRadius: '0rem',
        borderBottomRightRadius: '0rem',
        paddingLeft: '0.1875rem',
        paddingRight: '0rem',
        ...prefixStyle
    };
    const numberStyles = {
        borderTopLeftRadius: '0rem',
        borderBottomLeftRadius: '0rem',
        paddingLeft: '0.1875rem',
        ...numberStyle
    };

    const [number, setNumber] = useState('');

    useEffect(() => {
        setNumber(value);
    }, [value]);

    function numberOnFocus(e) {
        e.preventDefault();

        let zero = zeroNumber(decimalSeparator, fixedDecimalScale);

        if (e.target.value === zero && !atmMode) {
            setNumber('');
        }
    };

    function numberOnBlur(e) {
        e.preventDefault();

        const newValue = formatOnBlur(e.target.value, {
            atmMode: atmMode,
            decimalSeparator: decimalSeparator,
            fixedDecimalScale: fixedDecimalScale,
            integerGroupType: integerGroupType,
            integerGroupSeparator: integerGroupSeparator
        });
        setNumber(newValue);
        onValueChange(newValue);
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

        setNumber(newValue);
        onValueChange(newValue);
    };

    return (
        <div className='d-flex'>
            <Form.Control
                disabled
                style={prefixStyles}
                className={className}
                value={prefix}
            />
            <Form.Control
                {...props}
                ref={ref}
                style={numberStyles}
                className={className}
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
    numberStyle: PropTypes.object,
    prefix: PropTypes.string,
    prefixStyle: PropTypes.object,
    integerGroupType: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
    ]),
    integerGroupSeparator: PropTypes.string,
    onValueChange: PropTypes.func,
    className: PropTypes.string
};

CurrencyControl.displayName = 'CurrencyControl';
CurrencyControl.defaultProps = defaultProps;
export default CurrencyControl;
