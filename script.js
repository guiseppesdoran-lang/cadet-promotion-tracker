const DATE_FIELDS = [
  "PhyFitTest", "AEDateP", "LeadLabDateP", "CharacterDevelopment",
  "ActiveParticipationDate", "CadetOathDate", "LeadershipExpectationsDate",
  "UniformDate", "DrillDate", "WelcomeCourseDate",
  // EssayDate & SpeechDate will be conditionally added
  "AEInteractiveDate",
  "LeadershipInteractiveDate", "NextApprovalDate",
  "SpecialActivityDate", "StaffServiceDate",
  "OralPresentationDate", "TechnicalWritingAssignmentDate"
];

const SCORE_FIELDS = ["AEScore", "LeadLabScore", "DrillScore", "AEInteractiveModule"];
const BOOL_FIELDS = ["ActivePart", "CadetOath"];

// --- Requirement logic functions ---
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
        const achievement = row["AchvName"] || "";
        let missing = [];

        // Always-required date fields
        DATE_FIELDS.forEach(col => {
          if (col in row && !isDateOk(row[col])) missing.push(col);
        });

        // Scores
        SCORE_FIELDS.forEach(col => {
          if (col in row && !isScoreOk(row[col])) missing.push(col);
        });

        // Boolean fields
        BOOL_FIELDS.forEach(col => {
          if (col in row && !isBoolOk(row[col])) missing.push(col);
        });

        // -------------------------------------------------------
        // SPECIAL LOGIC: Essay & Speech ONLY if Achievement 8
        // -------------------------------------------------------
        if (achievement.includes("8")) {
          // Achievement 8 REQUIRED fields
          if (!isDateOk(row["EssayDate"])) missing.push("EssayDate");
          if (!isDateOk(row["SpeechDate"])) missing.push("SpeechDate");
        }
        // Otherwise treat as N/A = OK (do not add)
        // -------------------------------------------------------

        report.push({
          "Cadet Name": name,
          "Achievement": achievement,
          "Missing Requirements": missing.length ? missing.join("; ") : "READY FOR PROMOTION"
        });
      });

      const csv = Papa.unparse(report);
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
