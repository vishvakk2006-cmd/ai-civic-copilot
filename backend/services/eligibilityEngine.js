import schemes from "../data/schemes.json" with { type: "json" };
import { evaluateRule } from "./ruleInterpreter.js";

export function checkEligibility(citizen) {
  const eligibleSchemes = [];

  for (const scheme of schemes) {
    let eligible = true;
    const rules = scheme.attributes;

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

    // Ration Card Type
    if (
      rules.ration_card_type !== undefined &&
      !rules.ration_card_type.includes(citizen.ration_card_type)
    ) {
      eligible = false;
    }

    // Active Bank Account
    if (
      rules.has_active_bank_savings_account !== undefined &&
      citizen.has_active_bank_savings_account !==
        rules.has_active_bank_savings_account
    ) {
      eligible = false;
    }

    // Annual Income Maximum
    if (
      rules.annual_income_max !== undefined &&
      citizen.annual_household_income > rules.annual_income_max
    ) {
      eligible = false;
    }

    // Landholder
    if (
      rules.is_landholder !== undefined &&
      citizen.is_landholder !== rules.is_landholder
    ) {
      eligible = false;
    }

    // Institutional Landholder
    if (
      rules.institutional_landholder_flag !== undefined &&
      citizen.institutional_landholder_flag !==
        rules.institutional_landholder_flag
    ) {
      eligible = false;
    }

    // Taxpayer
    if (
      rules.taxpayer_last_year_flag !== undefined &&
      citizen.taxpayer_last_year_flag !==
        rules.taxpayer_last_year_flag
    ) {
      eligible = false;
    }

    if (eligible) {
    eligibleSchemes.push({
    scheme_id: scheme.scheme_id,
    scheme_name: scheme.scheme_name,
    category: scheme.category,
    description: scheme.description,
    benefit: scheme.benefit,
    status: "Eligible",
    reason: "All eligibility criteria satisfied.",
    required_documents: scheme.required_documents,
    application_steps: scheme.application_steps,
    contact: scheme.contact
  });
}
  }

  return eligibleSchemes;
}