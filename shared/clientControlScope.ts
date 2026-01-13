// clientControlScope.ts
import { allControls, Control } from "./allControls";

export type ScopeStatus = "in-scope" | "out-of-scope";

export interface ClientControlScope {
  clientId: string;
  controlId: string; // internal id from allControls (1..106)
  scope: ScopeStatus;
  reasonOutOfScope?: string;
  updatedAt: string;
}

/**
 * 🔹 MOCK: Client-specific scope mapping
 * Later this will come from DB
 */
export const clientControlScopes: ClientControlScope[] = [
  {
    clientId: "satoshi-energy",
    controlId: "1",
    scope: "in-scope",
    updatedAt: "2026-01-01"
  },
  {
    clientId: "satoshi-energy",
    controlId: "2",
    scope: "in-scope",
    updatedAt: "2026-01-01"
  },
  {
    clientId: "satoshi-energy",
    controlId: "3",
    scope: "in-scope",
    updatedAt: "2026-01-01"
  },
  {
    clientId: "satoshi-energy",
    controlId: "9",
    scope: "out-of-scope",
    reasonOutOfScope: "Infrastructure managed by cloud provider",
    updatedAt: "2026-01-01"
  }
];
/**
 * ✅ Get all controls with scope for a client (ADMIN VIEW)
 */
export function getControlsWithScopeForClient(
    clientId: string
  ): (Control & { scope: ScopeStatus; reasonOutOfScope?: string })[] {
    return allControls.map((control) => {
      const scopeEntry = clientControlScopes.find(
        (s) => s.clientId === clientId && s.controlId === control.controlId
      );
  
      return {
        ...control,
        scope: scopeEntry?.scope ?? "out-of-scope",
        reasonOutOfScope: scopeEntry?.reasonOutOfScope
      };
    });
  }
  
  /**
   * ✅ Get ONLY in-scope controls for client (CLIENT VIEW)
   */
  export function getInScopeControlsForClient(clientId: string): Control[] {
    const inScopeIds = clientControlScopes
      .filter(
        (s) => s.clientId === clientId && s.scope === "in-scope"
      )
      .map((s) => s.controlId);
  
    return allControls.filter((c) => inScopeIds.includes(c.id));
  }
  