export function calculateApprovalProbability(citizen, scheme) {

    let score = 50;

    const rules = scheme.attributes;

    if (
        rules.age_minimum !== undefined &&
        citizen.age >= rules.age_minimum
    ) score += 10;

    if (
        rules.age_maximum !== undefined &&
        citizen.age <= rules.age_maximum
    ) score += 10;

    if (
        rules.gender !== undefined &&
        citizen.gender === rules.gender
    ) score += 10;

    if (
        rules.annual_income_max !== undefined &&
        citizen.annual_household_income <= rules.annual_income_max
    ) score += 10;

    if (
        rules.has_active_bank_savings_account &&
        citizen.has_active_bank_savings_account
    ) score += 5;

    if (
        rules.is_landholder &&
        citizen.is_landholder
    ) score += 5;

    return Math.min(score, 95);

}