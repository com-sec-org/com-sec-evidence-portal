import fs from "fs";
import { mockControls } from "./client/data/mockControls";

const rows = mockControls.map(c => ({
  control_id: c.controlId,
  name: c.name.replace(/"/g, '""'),
  description: c.description.replace(/"/g, '""'),
  category: c.category,
  soc2_criteria: c.soc2Criteria ?? "",
  example_evidence: c.exampleEvidence?.replace(/"/g, '""') ?? "",
}));

const csv = [
  "control_id,name,description,category,soc2_criteria,example_evidence",
  ...rows.map(r =>
    `"${r.control_id}","${r.name}","${r.description}","${r.category}","${r.soc2_criteria}","${r.example_evidence}"`
  ),
].join("\n");

fs.writeFileSync("controls_seed.csv", csv);
console.log("controls_seed.csv generated");
