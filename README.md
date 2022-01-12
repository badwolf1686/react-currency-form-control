# react-currency-form-control

## Version
1.1.1

## Introduction
A React Bootstrap `Form.Control` wrapper for currency input.

## Feature
- The currency symbol prefix is not part of the read value.
- Press minus key (`-`) to toggle negative/positive input value (e.g. `--` is positive).
- `atmMode` enables inputting decimals without type the decimal point, i.e. digits move forward as type in.
- Two types of integer part grouping (thousands or chinese wan (tens of thousands)).
- Customizable currency symbol prefix, decimal separator and integer group separator.

## Dependency
- React V17
- Bootstrap V5
- React-Bootstrap V2

## Usage
```
import CurrencyControl from "./CurrencyControl";
```

## Props
| Props | Type | Default | Description |
| ----------- | ----------- | ----------- | ----------- |
| atmMode | boolean | false | If true, moving digits forward as type in (like what you see on an ATM). |
| decimalSeparator | single character string | '.' | The decimal point for a number. |
| fixedDecimalScale | integer number | 2 | If greater than -1, it defines the fixed decimal scale. Show decimal scale as entered otherwise. |
| numberStyle | object | {} | Style for the number `Form.Control`. |
| prefix | single character string | '$' | The currency symbol prefix. |
| prefixStyle | object | {} | Style for the currency symbol prefix. |
| integerGroupType | string (one of ['thousand', 'wan']), or boolean | 'thousand' | The integer grouping type: thousand (1,234,567), chinese wan (1,2345,6789). 'thousand' if true, no integer grouping if false. |
| integerGroupSeparator | single character string | ',' | The integer grouping separator. |
| onValueChange | function(v) | () => '0' | The function to get the formatted input value string `v`. |

## Demo
Start the demo with `npm start`.
