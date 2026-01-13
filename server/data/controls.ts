import { allControls } from "../../shared/allControls";
import { clientControlScopes } from "../../shared/clientControlScope";

export function getControlsForClient(clientId: string) {
  // 1. Find controls marked IN-SCOPE for this client
  const scopedControlIds = clientControlScopes
    .filter(
      (s) => s.clientId === clientId && s.scope === "in-scope"
    )
    .map((s) => s.controlId);

  // 2. Return full control metadata from master list
  return allControls.filter((control) =>
    scopedControlIds.includes(control.controlId)
  );
}
