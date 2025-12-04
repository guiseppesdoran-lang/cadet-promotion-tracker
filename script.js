const DATE_FIELDS = [
  "PhyFitTest", "AEDateP", "LeadLabDateP", "CharacterDevelopment",
  "ActiveParticipationDate", "CadetOathDate", "LeadershipExpectationsDate",
  "UniformDate", "DrillDate", "WelcomeCourseDate",
  "EssayDate", "SpeechDate", "AEInteractiveDate",
  "LeadershipInteractiveDate", "NextApprovalDate",
  "SpecialActivityDate", "StaffServiceDate",
  "OralPresentationDate", "TechnicalWritingAssignmentDate"
];

const SCORE_FIELDS = ["AEScore", "LeadLabScore", "DrillScore", "AEInteractiveModule"];
const BOOL_FIELDS = ["ActivePart", "CadetOath"];

function isDateOk(v) {
  if (!v || v === "None" || v.trim() === "") return false;
  if (v.toUpperCase() === "N/A") return true;
  return true;
}

function isScoreOk(v) {
  const num = parseFloat(v);
  return !isNaN(num) && num > 0;
}

function isBoolOk(v) {
  if (!v) return false;
  v = v.toUpperCase();
  return v === "TRUE" || v === "N/A";
}

document.getElementById("processBtn").onclick = function () {
  const file = document.getElementById("fileInput").files[0];
  if (!file) {
    alert("Please upload a CSV file first.");
    return;
  }

  Papa.parse(file, {
    header: true,
    complete: function (results) {
      const cadets = results.data;
      const report = [];

      cadets.forEach(row => {
        const name = `${row["NameLast"] || ""}, ${row["NameFirst"] || ""}`;
        let missing = [];

        DATE_FIELDS.forEach(col => {
          if (col in row && !isDateOk(row[col])) missing.push(col);
        });

        SCORE_FIELDS.forEach(col => {
          if (col in row && !isScoreOk(row[col])) missing.push(col);
        });

        BOOL_FIELDS.forEach(col => {
          if (col in row && !isBoolOk(row[col])) missing.push(col);
        });

        report.push({
          "Cadet Name": name,
          "Missing Requirements": missing.length ? missing.join("; ") : "READY FOR PROMOTION"
        });
      });

      // Convert to CSV
      const csv = Papa.unparse(report);

      // Force download
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "promotion_report.csv";
      a.click();

      document.getElementById("status").innerText = "Report generated successfully!";
    }
  });
};
