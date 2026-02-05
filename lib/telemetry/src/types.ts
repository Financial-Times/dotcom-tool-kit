export interface NamespaceSchemas {
  'tasks.completed': { success: boolean }
}
export type Namespace = keyof NamespaceSchemas

export type TelemetryAttributes = Record<string, string>

export interface TelemetryEvent<N extends Namespace = Namespace> {
  eventTimestamp: number
  namespace: `dotcom-tool-kit.${N}`
  systemCode: string
  data: TelemetryAttributes & NamespaceSchemas[N]
}
