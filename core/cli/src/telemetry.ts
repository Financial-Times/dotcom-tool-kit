import type { RootOptions } from '@dotcom-tool-kit/plugin/src/root-schema'
import type { TelemetryProcess, TelemetryRecorder } from '@dotcom-tool-kit/telemetry'

// TODO:IM:20260113 in the future this type signature could be changed to allow
// enabling telemetry even without a valid config (and the root options derived
// from it,) so that we can track metrics related to invalid configurations.
export function enableTelemetry(metrics: TelemetryProcess | TelemetryRecorder, options: RootOptions) {
  if (options.enableTelemetry) {
    metrics.enable()
  }
}
