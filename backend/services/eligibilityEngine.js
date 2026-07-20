import schemes from "../data/schemes.json" with { type: "json" };

export function checkEligibility(citizen) {

    const eligibleSchemes = [];

    for (const scheme of schemes) {

        const rules = scheme.attributes;

        let eligible = true;

        // Age Minimum
        if (
            rules.age_minimum !== undefined &&
            citizen.age < rules.age_minimum
        ) {
            eligible = false;
        }

        // Age Maximum
        if (
            rules.age_maximum !== undefined &&
            citizen.age > rules.age_maximum
        ) {
            eligible = false;
        }

        // Gender
        if (
            rules.gender !== undefined &&
            citizen.gender !== rules.gender
        ) {
            eligible = false;
        }

        // Annual Income
        if (
            rules.annual_income_max !== undefined &&
            citizen.annual_household_income > rules.annual_income_max
        ) {
            eligible = false;
        }

        // Land Holder
        if (
            rules.is_landholder !== undefined &&
            citizen.is_landholder !== rules.is_landholder
        ) {
            eligible = false;
        }

        // Bank Account
        if (
            rules.has_active_bank_savings_account !== undefined &&
            citizen.has_active_bank_savings_account !==
                rules.has_active_bank_savings_account
        ) {
            eligible = false;
        }

        // Ration Card
        if (
            rules.ration_card_type !== undefined &&
            citizen.ration_card_type !== undefined &&
            !rules.ration_card_type.includes(citizen.ration_card_type)
        ) {
            eligible = false;
        }

        // Special Auto Include (Age 70+)
        if (
            rules.special_auto_include_age !== undefined &&
            citizen.age >= rules.special_auto_include_age
        ) {
            eligible = true;
        }

        if (eligible) {
            eligibleSchemes.push(scheme);
        }
    }

    return eligibleSchemes;
} 
