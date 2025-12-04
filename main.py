import pandas as pd
import numpy as np

# Columns grouped by requirement type
DATE_FIELDS = [
    "PhyFitTest", "AEDateP", "LeadLabDateP", "CharacterDevelopment",
    "ActiveParticipationDate", "CadetOathDate", "LeadershipExpectationsDate",
    "UniformDate", "DrillDate", "WelcomeCourseDate",
    "EssayDate", "SpeechDate", "AEInteractiveDate",
    "LeadershipInteractiveDate", "NextApprovalDate",
    "SpecialActivityDate", "StaffServiceDate",
    "OralPresentationDate", "TechnicalWritingAssignmentDate"
]

SCORE_FIELDS = ["AEScore", "LeadLabScore", "DrillScore", "AEInteractiveModule"]
BOOL_FIELDS = ["ActivePart", "CadetOath"]

def is_date_ok(value):
    if pd.isna(value) or str(value).strip().lower() == "none" or value == "":
        return False
    if str(value).upper() == "N/A":
        return True
    return True  # any non-empty is considered a filled date

def is_score_ok(value):
    try:
        return float(value) > 0
    except:
        return False

def is_bool_ok(value):
    if str(value).upper() == "TRUE":
        return True
    if str(value).upper() == "N/A":
        return True
    return False

def evaluate_row(row):
    missing = []

    # Check date fields
    for col in DATE_FIELDS:
        if col in row:
            if not is_date_ok(row[col]):
                missing.append(col)

    # Check score fields
    for col in SCORE_FIELDS:
        if col in row:
            if not is_score_ok(row[col]):
                missing.append(col)

    # Check boolean fields
    for col in BOOL_FIELDS:
        if col in row:
            if not is_bool_ok(row[col]):
                missing.append(col)

    return missing


def main():
    print("Loading cadet CSV…")
    df = pd.read_csv("cadets.csv")  # Replace with your filename

    cadet_reports = []

    for idx, row in df.iterrows():
        cadet_name = f"{row.get('NameLast', '')}, {row.get('NameFirst', '')}"
        missing = evaluate_row(row)

        cadet_reports.append({
            "Cadet Name": cadet_name,
            "Missing Requirements": ", ".join(missing) if missing else "READY FOR PROMOTION"
        })

    report_df = pd.DataFrame(cadet_reports)
    report_df.to_csv("promotion_report.csv", index=False)

    print("\nReport generated: promotion_report.csv")
    print("Upload this file to your unit staff or use it in boards.")


if __name__ == "__main__":
    main()
