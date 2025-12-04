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
      container.innerHTML = "";

      cadets.forEach(row => {
        const name = `${row["NameLast"] || ""}, ${row["NameFirst"] || ""}`.trim();
        const achievement = row["AchvName"] || "";
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

        // Achievement 8 rule
        if (achievement.includes("8")) {
          if (!isDateOk(row["EssayDate"])) missing.push("EssayDate");
          if (!isDateOk(row["SpeechDate"])) missing.push("SpeechDate");
        }

        const wrapper = document.createElement("div");
        wrapper.style.border = "1px solid #ccc";
        wrapper.style.background = "#fff";
        wrapper.style.padding = "10px";
        wrapper.style.margin = "10px 0";

        const title = document.createElement("h3");
        title.innerText = name || "(Unnamed Cadet)";
        wrapper.appendChild(title);

        const ach = document.createElement("p");
        ach.innerHTML = `<b>Achievement:</b> ${achievement}`;
        wrapper.appendChild(ach);

        if (missing.length === 0) {
          const ok = document.createElement("p");
          ok.style.color = "green";
          ok.style.fontWeight = "bold";
          ok.innerText = "READY FOR PROMOTION";
          wrapper.appendChild(ok);
        } else {
          const listLabel = document.createElement("p");
          listLabel.innerHTML = "<b>Still Needed:</b>";
          wrapper.appendChild(listLabel);

          const list = document.createElement("ul");
          missing.forEach(req => {
            const item = document.createElement("li");
            item.innerText = req;
            item.style.color = "red";
            list.appendChild(item);
          });
          wrapper.appendChild(list);
        }

        container.appendChild(wrapper);
      });
    }
  });
};
