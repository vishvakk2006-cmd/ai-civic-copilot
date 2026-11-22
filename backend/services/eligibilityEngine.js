import schemes from "../data/schemes.json" with { type: "json" };

const fieldAliases = {
    age_minimum: "age",
    age_maximum: "age",
    child_age_maximum: "child_age",
    annual_income_max: "annual_household_income",
    annual_household_income_max: "annual_household_income",
    minimum_academic_percentage_previous_class:
        "minimum_academic_percentage_previous_class",
    class_12_merit_percentile_minimum: "class_12_merit_percentile",
    class_level_minimum: "class_level",
    class_level_maximum: "class_level"
};

const fieldLabels = {
    age: "Age",
    child_age: "Child's age",
    gender: "Gender",
    child_gender: "Child's gender",
    annual_household_income: "Annual household income",
    is_landholder: "Land ownership",
    has_active_bank_savings_account: "Active bank savings account",
    ration_card_type: "Ration card type",
    institutional_landholder_flag: "Institutional landholder status",
    taxpayer_last_year_flag: "Taxpayer status",
    urban_area_flag: "Urban/rural residence",
    willing_to_do_unskilled_manual_work: "Willingness to do manual work",
    is_farmer: "Farmer status",
    cultivated_notified_crops_flag: "Notified crop cultivation",
    insurable_interest_in_land: "Insurable interest in land",
    is_landholder_or_lessee: "Landholder or lessee status",
    has_access_to_water_source: "Access to a water source",
    micro_irrigation_interest_flag: "Micro-irrigation interest",
    pucca_house_ownership_flag: "Pucca house ownership",
    is_electricity_consumer: "Electricity consumer status",
    residential_connection_flag: "Residential electricity connection",
    adequate_roof_space_flag: "Adequate roof space",
    is_urban_street_vendor: "Urban street vendor status",
    has_certificate_of_vending_or_id_card: "Certificate of vending or ID card",
    is_indian_citizen: "Indian citizenship",
    pregnancy_registered_flag: "Pregnancy registration",
    government_employee_flag: "Government employee status",
    is_taxpayer: "Taxpayer status",
    is_destitute_widow_or_disabled_flag: "Widow/disability status",
    is_corporate_entity: "Corporate entity status",
    non_farm_income_generating_activity_flag: "Non-farm income activity",
    engaged_in_traditional_artisan_trade: "Traditional artisan trade",
    government_employee_in_family_flag: "Government employee in family",
    unemployed_or_school_dropout_flag: "Unemployment/school dropout status",
    caste_category_or_gender: "Caste category or gender",
    is_greenfield_enterprise: "Greenfield enterprise status",
    current_class: "Current class",
    minimum_academic_percentage_previous_class:
        "Previous class academic percentage",
    class_12_merit_percentile: "Class 12 merit percentile",
    annual_household_income_max: "Annual household income",
    enrolled_in_government_school: "Government school enrollment",
    class_level: "Class level",
    has_active_ration_card: "Active ration card",
    secc_beneficiary_flag: "SECC beneficiary status",
    pursuing_regular_higher_education: "Regular higher education enrollment",
    has_valid_aadhaar: "Valid Aadhaar",
    aadhaar_linked_mobile_flag: "Aadhaar-linked mobile",
    has_valid_identity_proof: "Valid identity proof",
    is_indian_resident: "Indian residency"
};

function isKnown(value) {
    return value !== undefined && value !== null && value !== "";
}

function getCitizenValue(ruleName, citizen) {
    return citizen[fieldAliases[ruleName] || ruleName];
}

function evaluateAttribute(ruleName, requirement, citizen) {
    if (ruleName === "special_auto_include_age") {
        return isKnown(citizen.age) && Number(citizen.age) >= requirement
            ? "match"
            : isKnown(citizen.age)
              ? "mismatch"
              : "unknown";
    }

    if (ruleName === "caste_category_or_gender") {
        if (citizen.gender === "Female") return "match";
        if (isKnown(citizen.caste_category)) {
            return requirement.includes(citizen.caste_category)
                ? "match"
                : "mismatch";
        }
        return "unknown";
    }

    const value = getCitizenValue(ruleName, citizen);
    if (!isKnown(value)) return "unknown";

    if (Array.isArray(requirement)) {
        return requirement.includes(value) ? "match" : "mismatch";
    }

    if (typeof requirement === "boolean") {
        return value === requirement ? "match" : "mismatch";
    }

    if (ruleName === "age_minimum" || ruleName === "class_level_minimum") {
        return Number(value) >= requirement ? "match" : "mismatch";
    }

    if (
        ruleName === "age_maximum" ||
        ruleName === "child_age_maximum" ||
        ruleName === "annual_income_max" ||
        ruleName === "annual_household_income_max" ||
        ruleName === "class_level_maximum"
    ) {
        return Number(value) <= requirement ? "match" : "mismatch";
    }

    if (
        ruleName === "minimum_academic_percentage_previous_class" ||
        ruleName === "class_12_merit_percentile_minimum"
    ) {
        return Number(value) >= requirement ? "match" : "mismatch";
    }

    return value === requirement ? "match" : "mismatch";
}

function evaluateScheme(citizen, scheme) {
    const attributes = scheme.attributes || {};
    const ageRequirement = attributes.special_auto_include_age;

    if (
        ageRequirement !== undefined &&
        evaluateAttribute("special_auto_include_age", ageRequirement, citizen) ===
            "match"
    ) {
        return { status: "eligible", missingInformation: [] };
    }

    if (scheme.scheme_id === "IN-SOCIAL-015") {
        const rationCard = evaluateAttribute(
            "ration_card_type",
            attributes.ration_card_type,
            citizen
        );
        if (rationCard === "mismatch") {
            return { status: "ineligible", missingInformation: [] };
        }

        const ageMatch = isKnown(citizen.age)
            ? Number(citizen.age) >= attributes.age_minimum
            : null;
        const specialMatch = isKnown(citizen.is_destitute_widow_or_disabled_flag)
            ? citizen.is_destitute_widow_or_disabled_flag ===
              attributes.is_destitute_widow_or_disabled_flag
            : null;

        if (ageMatch === false && specialMatch === false) {
            return { status: "ineligible", missingInformation: [] };
        }

        const missingInformation = [];
        if (rationCard === "unknown") {
            missingInformation.push(fieldLabels.ration_card_type);
        }
        if (ageMatch === null && specialMatch !== true) {
            missingInformation.push(fieldLabels.age);
        }
        if (specialMatch === null && ageMatch !== true) {
            missingInformation.push(
                fieldLabels.is_destitute_widow_or_disabled_flag
            );
        }

        return missingInformation.length > 0
            ? { status: "incomplete", missingInformation }
            : { status: "eligible", missingInformation: [] };
    }

    const missingInformation = [];

    for (const [ruleName, requirement] of Object.entries(attributes)) {
        if (ruleName === "special_auto_include_age") continue;

        const result = evaluateAttribute(ruleName, requirement, citizen);
        if (result === "mismatch") {
            return { status: "ineligible", missingInformation: [] };
        }
        if (result === "unknown") {
            const fieldName = fieldAliases[ruleName] || ruleName;
            missingInformation.push(
                fieldLabels[ruleName] || fieldLabels[fieldName] || fieldName
            );
        }
    }

    if (missingInformation.length > 0) {
        return {
            status: "incomplete",
            missingInformation: [...new Set(missingInformation)]
        };
    }

    return { status: "eligible", missingInformation: [] };
}

export function checkEligibility(citizen) {
    if (!citizen || typeof citizen !== "object" || Array.isArray(citizen)) {
        return [];
    }

    return schemes.filter(
        (scheme) => evaluateScheme(citizen, scheme).status === "eligible"
    );
}

export function findIncompleteSchemes(citizen) {
    if (!citizen || typeof citizen !== "object" || Array.isArray(citizen)) {
        return [];
    }

    return schemes.flatMap((scheme) => {
        const result = evaluateScheme(citizen, scheme);
        return result.status === "incomplete"
            ? [
                  {
                      scheme_id: scheme.scheme_id,
                      scheme_name: scheme.scheme_name,
                      missing_information: result.missingInformation
                  }
              ]
            : [];
    });
}
