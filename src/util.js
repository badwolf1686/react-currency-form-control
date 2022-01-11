function addThousandSeparator(s, {
    decimalSeparator,
    thousandScale,
    thousandSeparator
}) {
    s = s.replaceAll(thousandSeparator, '');
    let startingIntegerIdx = s.indexOf(decimalSeparator)
    if (startingIntegerIdx === -1) {
        startingIntegerIdx = s.length
    }
    let thousandSeparatorIdx = startingIntegerIdx - thousandScale;
    while (thousandSeparatorIdx > 0) {
        s = s.slice(0, thousandSeparatorIdx) + thousandSeparator + s.slice(thousandSeparatorIdx);
        thousandSeparatorIdx -= thousandScale;
    }
    return s;
};

function isNegative(s) {
    // XOR
    return (s.endsWith('-')) ? (!s.startsWith('-')) : s.startsWith('-');
};

function regexMatch(s, pattern) {
    let re = new RegExp(pattern);
    let matchList = s.match(re);
    return matchList === null ? null : matchList[0];
};

function isZero(s, thousandSeparator, decimalSeparator) {
    if (typeof s !== 'string') {
        return true;
    }
    let match = regexMatch(s, `^-?[0\\${thousandSeparator}\\${decimalSeparator}]*-?$`);
    return match !== null;
};

function removeLeadingZeros(s) {
    return s.replace(/^0+/, '');
};

function generalNumberFormat(s, thousandSeparator, decimalSeparator) {
    let match = regexMatch(s, `-?[\\d\\${thousandSeparator}]*\\${decimalSeparator}?\\d*-?`);
    return (match === null) ? '' : match;
};

function atmModeNumberFormat(s, decimalSeparator, fixedDecimalScale) {
    s = s.replaceAll(decimalSeparator, '');
    s = removeLeadingZeros(s);
    // add enough leading zeros
    while (s.length < fixedDecimalScale + 1) {
        s = '0' + s;
    }
    let decimalSeparatorIdx = s.length - fixedDecimalScale;
    let sIntegerPart = s.slice(0, decimalSeparatorIdx);
    let sDecimalPart = s.slice(decimalSeparatorIdx);
    return sIntegerPart + decimalSeparator + sDecimalPart;
};

export function zeroNumber(decimalSeparator, fixedDecimalScale) {
    let zeroNumber = '0';
    if (fixedDecimalScale > 0) {
        zeroNumber += decimalSeparator + '0'.repeat(fixedDecimalScale);
    }
    return zeroNumber;
};

export function formatOnChange(s, {
    atmMode,
    decimalSeparator,
    fixedDecimalScale,
    thousandScale,
    thousandSeparator
}) {
    s = generalNumberFormat(s, thousandSeparator, decimalSeparator);
    if (isZero(s)) {
        return zeroNumber(decimalSeparator, fixedDecimalScale);
    } else {
        let sIsNegative = isNegative(s);
        s = s.replaceAll('-', '');
        s = s.replaceAll(thousandSeparator, '');

        if (atmMode) {
            s = atmModeNumberFormat(s, decimalSeparator, fixedDecimalScale);
        }

        s = addThousandSeparator(s, {
            decimalSeparator: decimalSeparator,
            thousandScale: thousandScale,
            thousandSeparator: thousandSeparator
        });

        if (sIsNegative) {
            s = '-' + s;
        }
        return s;
    }
};

export function formatOnBlur(s, {
    atmMode,
    decimalSeparator,
    fixedDecimalScale,
    thousandScale,
    thousandSeparator
}) {
    if (atmMode) {
        // atm mode formats number on type-in
        return s;
    } else {
        // check if s is 0 like
        if (isZero(s, thousandSeparator, decimalSeparator)) {
            return zeroNumber(decimalSeparator, fixedDecimalScale);
        }

        s = s.replaceAll(thousandSeparator, '');
        let sLen = s.length;
        if (fixedDecimalScale > -1) {
            let decimalSeparatorIdx = s.indexOf(decimalSeparator);
            if (decimalSeparatorIdx > -1) {
                // there is decimal separator
                let curDecimalScale = sLen - decimalSeparatorIdx - 1;
                let decimalScaleDiff = curDecimalScale - fixedDecimalScale;
                if (decimalScaleDiff > 0) {
                    // excessive decimal digit
                    s = parseFloat(s).toFixed(fixedDecimalScale);
                } else if (decimalScaleDiff < 0) {
                    // lack of decimal digit
                    s += '0'.repeat(-decimalScaleDiff);
                }
            } else {
                // there is no decimal separator
                s += decimalSeparator + '0'.repeat(fixedDecimalScale);
            }
        } else {
            if (s.endsWith('.')) {
                s = s.slice(0, sLen - 1);
            }
        }

        return addThousandSeparator(s, {
            decimalSeparator: decimalSeparator,
            thousandScale: thousandScale,
            thousandSeparator: thousandSeparator
        });
    }
};