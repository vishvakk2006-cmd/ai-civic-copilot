import assert from "node:assert/strict";
import test from "node:test";
import { parseCitizenData } from "../services/documentParser.js";

test("document parser extracts supported profile fields from OCR text", () => {
    const citizen = parseCitizenData(
        "Age: 24\nGender: Female\nAnnual Household Income: ₹ 1,80,000\n" +
            "Land Holder: No\nActive Bank Savings Account: Yes"
    );

    assert.deepEqual(citizen, {
        age: 24,
        gender: "Female",
        annual_household_income: 180000,
        is_landholder: false,
        has_active_bank_savings_account: true
    });
});
