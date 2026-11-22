import assert from "node:assert/strict";
import test from "node:test";
import {
    checkEligibility,
    findIncompleteSchemes
} from "../services/eligibilityEngine.js";
import { checkMissingDocuments } from "../services/documentEngine.js";
import schemes from "../data/schemes.json" with { type: "json" };

test("missing required information never produces a verified match", () => {
    const matches = checkEligibility({ age: 24 });
    const incomplete = findIncompleteSchemes({ age: 24 });

    assert.equal(
        matches.some((scheme) => scheme.scheme_id === "IN-FINANCE-002"),
        false
    );
    assert.ok(
        incomplete.some((scheme) => scheme.scheme_id === "IN-FINANCE-002")
    );
});

test("known age and bank details match the corresponding insurance schemes", () => {
    const matches = checkEligibility({
        age: 24,
        has_active_bank_savings_account: true
    });
    const ids = matches.map((scheme) => scheme.scheme_id);

    assert.ok(ids.includes("IN-FINANCE-002"));
    assert.ok(ids.includes("IN-FINANCE-003"));
});

test("the documented age-based PM-JAY rule works without a ration card value", () => {
    const matches = checkEligibility({ age: 70 });

    assert.ok(matches.some((scheme) => scheme.scheme_id === "IN-HEALTH-001"));
});

test("the NSAP rule accepts a qualifying disability/widow status under age 60", () => {
    const matches = checkEligibility({
        age: 40,
        ration_card_type: "BPL",
        is_destitute_widow_or_disabled_flag: true
    });

    assert.ok(matches.some((scheme) => scheme.scheme_id === "IN-SOCIAL-015"));
});

test("missing documents are based on documents selected as provided", () => {
    const scheme = schemes.find((item) => item.scheme_id === "IN-FINANCE-002");
    const missing = checkMissingDocuments(
        { provided_documents: ["Bank Passbook"] },
        scheme
    );

    assert.ok(missing.includes("Aadhaar Card"));
    assert.ok(missing.includes("Bank Passbook") === false);
});
