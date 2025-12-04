const DATE_FIELDS = [
  "PhyFitTest", "AEDateP", "LeadLabDateP", "CharacterDevelopment",
  "ActiveParticipationDate", "CadetOathDate", "LeadershipExpectationsDate",
  "UniformDate", "DrillDate", "WelcomeCourseDate",
  "AEInteractiveDate", "LeadershipInteractiveDate",
  "NextApprovalDate", "SpecialActivityDate", "StaffServiceDate",
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
      const container = document.getElementById("results");
      container.innerHTML = ""; // Clear old results

      cadets.forEach(row => {
        const name = `${row["NameLast"] || ""}, ${row["NameFirst"] || ""}`.trim();
        const achievement = row["AchvName"] || "";
        let missing = [];

        // Always-required fields:
        DATE_FIELDS.forEach(col => {
          if (col in row && !isDateOk(row[col])) missing.push(col);
        });

        SCORE_FIELDS.forEach(col => {
          if (col in row && !isScoreOk(row[col])) missing.push(col);
        });

        BOOL_FIELDS.forEach(col => {
          if (col in row && !isBoolOk(row[col])) missing.push(col);
        });

        // ---- Achievement 8 Rule: Essay & Speech ----
        if (achievement.includes("8")) {
          if (!isDateOk(row["EssayDate"])) missing.push("EssayDate");
          if (!isDateOk(row["SpeechDate"])) missing.push("SpeechDate");
        }

        // Display results on screen
        const div = document.createElement("div");
        div.style.border = "1px solid #ccc";
        div.style.padding = "10px";
        div.style.margin = "10px 0";
        div.style.background = "#fff";

        const title = document.createElement("h3");
        title.innerText = name || "(Unnamed Cadet)";
        div.appendChild(title);

        const ach = document.createElement("p");
        ach.innerHTML = `<b>Achievement:</b> ${achievement}`;
        div.appendChild(ach);

        if (missing.length === 0) {
          const ok = document.createElement("p");
          ok.style.color = "green";
          ok.style.fontWeight = "bold";
          ok.innerText = "READY FOR PROMOTION";
          div.appendChild(ok);
        } else {
          const list = document.createElement("ul");
          list.innerHTML = "<b>Still Needed:</b>";
          missing.forEach(req => {
            const item = document.createElement("li");
            item.innerText = req;
            item.style.color = "red";
            list.appendChild(item);
          });
          div.appendChild(list);
        }

        container.appendChild(div);
      });
    }
  });
};
