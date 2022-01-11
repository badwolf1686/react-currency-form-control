function validateSeparator(separator) {
    let dsLen = separator.length;
    if (dsLen > 1) {
        return separator.charAt(0);
    } else if (dsLen === 1) {
        return separator;
    } else {
        return '.';
    }
};

function addintegerGroupSeparator(s, {
    decimalSeparator,
    integerGroupType,
    integerGroupSeparator
}) {
    if (integerGroupType !== false) {
        let integerGroupScale = 3;
        if (integerGroupType === 'wan') {
            integerGroupScale = 4;
        } 
        s = s.replaceAll(integerGroupSeparator, '');
        let startingIntegerIdx = s.indexOf(decimalSeparator)
        if (startingIntegerIdx === -1) {
            startingIntegerIdx = s.length
        }
        let integerGroupSeparatorIdx = startingIntegerIdx - integerGroupScale;
        while (integerGroupSeparatorIdx > 0) {
            s = s.slice(0, integerGroupSeparatorIdx) + integerGroupSeparator + s.slice(integerGroupSeparatorIdx);
            integerGroupSeparatorIdx -= integerGroupScale;
        }
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

function isZero(s, integerGroupSeparator, decimalSeparator) {
    if (typeof s !== 'string') {
        return true;
    }
    let match = regexMatch(s, `^-?[0\\${integerGroupSeparator}\\${decimalSeparator}]*-?$`);
    return match !== null;
};

function removeLeadingZeros(s) {
    return s.replace(/^0+/, '');
};

function generalNumberFormat(s, integerGroupSeparator, decimalSeparator) {
    let match = regexMatch(s, `-?[\\d\\${integerGroupSeparator}]*\\${decimalSeparator}?\\d*-?`);
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
    integerGroupType,
    integerGroupSeparator
}) {
    decimalSeparator = validateSeparator(decimalSeparator);
    integerGroupSeparator = validateSeparator(integerGroupSeparator);
    s = generalNumberFormat(s, integerGroupSeparator, decimalSeparator);
    if (s === '') {
        // empty value s waiting for type in.
        return s;
    }
    if (isZero(s)) {
        return zeroNumber(decimalSeparator, fixedDecimalScale);
    } else {
        let sIsNegative = isNegative(s);
        s = s.replaceAll('-', '');
        s = s.replaceAll(integerGroupSeparator, '');

        if (atmMode) {
            s = atmModeNumberFormat(s, decimalSeparator, fixedDecimalScale);
        }

        s = addintegerGroupSeparator(s, {
            decimalSeparator: decimalSeparator,
            integerGroupType: integerGroupType,
            integerGroupSeparator: integerGroupSeparator
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
    integerGroupType,
    integerGroupSeparator
}) {
    if (atmMode) {
        // atm mode formats number on type-in
        return s;
    } else {
        decimalSeparator = validateSeparator(decimalSeparator);
        integerGroupSeparator = validateSeparator(integerGroupSeparator);
        // check if s is 0 like
        if (isZero(s, integerGroupSeparator, decimalSeparator)) {
            return zeroNumber(decimalSeparator, fixedDecimalScale);
        }

        s = s.replaceAll(integerGroupSeparator, '');
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

        return addintegerGroupSeparator(s, {
            decimalSeparator: decimalSeparator,
            integerGroupType: integerGroupType,
            integerGroupSeparator: integerGroupSeparator
        });
    }
};