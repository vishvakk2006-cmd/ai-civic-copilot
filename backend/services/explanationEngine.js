const explanationMap = {
    age_minimum: "Minimum age requirement satisfied.",
    age_maximum: "Maximum age requirement satisfied.",
    gender: "Gender requirement satisfied.",
    annual_income_max: "Income is within the eligible limit.",
    ration_card_type: "Eligible ration card available.",
    has_active_bank_savings_account: "Active bank account verified.",
    is_landholder: "Land ownership requirement satisfied.",
    institutional_landholder_flag: "Institutional landholder requirement satisfied.",
    taxpayer_last_year_flag: "Taxpayer requirement satisfied."
};

export function generateExplanation(citizen, scheme, evaluateRule) {

    const reasons = [];

    for (const ruleName in scheme.attributes) {

        const ruleValue = scheme.attributes[ruleName];

        let citizenValue;

        switch (ruleName) {

            case "age_minimum":
            case "age_maximum":
            case "special_auto_include_age":
                citizenValue = citizen.age;
                break;

            case "annual_income_max":
                citizenValue = citizen.annual_household_income;
                break;

            default:
                citizenValue = citizen[ruleName];
        }

        if (evaluateRule(ruleName, citizenValue, ruleValue)) {
            if (explanationMap[ruleName]) {
                reasons.push(explanationMap[ruleName]);
            }
        }
    }

    return reasons;
}