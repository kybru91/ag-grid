export const ADVANCED_FILTER_LOCALE_TEXT = {
    ariaAdvancedFilterInput: 'Advanced Filter Input',
    ariaLabelAdvancedFilterAutocomplete: 'Advanced Filter Autocomplete',
    advancedFilterContains: 'contains',
    advancedFilterNotContains: 'does not contain',
    advancedFilterTextEquals: 'equals',
    advancedFilterTextNotEqual: 'does not equal',
    advancedFilterStartsWith: 'starts with',
    advancedFilterEndsWith: 'ends with',
    advancedFilterBlank: 'is blank',
    advancedFilterNotBlank: 'is not blank',
    advancedFilterEquals: '=',
    advancedFilterNotEqual: '!=',
    advancedFilterGreaterThan: '>',
    advancedFilterGreaterThanOrEqual: '>=',
    advancedFilterLessThan: '<',
    advancedFilterLessThanOrEqual: '<=',
    advancedFilterTrue: 'is true',
    advancedFilterFalse: 'is false',
    advancedFilterAnd: 'AND',
    advancedFilterOr: 'OR',
    advancedFilterApply: 'Apply',
    advancedFilterValidationMissingColumn: 'Column is missing',
    advancedFilterValidationMissingOption: 'Option is missing',
    advancedFilterValidationMissingValue: 'Value is missing',
    advancedFilterValidationInvalidColumn: 'Column not found',
    advancedFilterValidationInvalidOption: 'Option not found',
    advancedFilterValidationMissingQuote: 'Value is missing an end quote',
    advancedFilterValidationNotANumber: 'Value is not a number',
    advancedFilterValidationMissingCondition: 'Condition is missing',
    advancedFilterValidationJoinOperatorMismatch: 'Join operators within a condition must be the same',
    advancedFilterValidationInvalidJoinOperator: 'Join operator not found',
    advancedFilterValidationMissingEndBracket: 'Missing end bracket',
    advancedFilterValidationExtraEndBracket: 'Too many end brackets',
    advancedFilterValidationMessage: (variableValues: string[]) => `Expression has an error. ${variableValues[0]} - ${variableValues[1]}.`,
    advancedFilterValidationMessageAtEnd: (variableValues: string[]) => `Expression has an error. ${variableValues[0]} at end of expression.`,
};