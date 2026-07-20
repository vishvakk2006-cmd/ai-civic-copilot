export function evaluateRule(ruleName, citizenValue, ruleValue) {

    switch (ruleName) {

        case "age_minimum":
            return citizenValue >= ruleValue;

        case "age_maximum":
            return citizenValue <= ruleValue;

        case "gender":
            return citizenValue === ruleValue;

        case "ration_card_type":
            return ruleValue.includes(citizenValue);

        case "has_active_bank_savings_account":
            return citizenValue === ruleValue;

        case "annual_income_max":
            return citizenValue <= ruleValue;

        case "is_landholder":
            return citizenValue === ruleValue;

        case "institutional_landholder_flag":
            return citizenValue === ruleValue;

        case "taxpayer_last_year_flag":
            return citizenValue === ruleValue;

        default:
            return true;

    }

}