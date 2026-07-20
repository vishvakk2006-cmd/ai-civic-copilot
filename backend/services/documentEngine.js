export function checkMissingDocuments(citizen, scheme) {

    const missing = [];

    const rules = scheme.attributes;

    if (
        rules.has_active_bank_savings_account &&
        !citizen.has_active_bank_savings_account
    ) {
        missing.push("Bank Passbook");
    }

    if (
        rules.is_landholder &&
        !citizen.is_landholder
    ) {
        missing.push("Land Ownership Record");
    }

    if (
        rules.annual_income_max !== undefined
    ) {
        missing.push("Income Certificate");
    }

    if (
        rules.age_minimum !== undefined
    ) {
        missing.push("Aadhaar Card");
    }

    return [...new Set(missing)];

}