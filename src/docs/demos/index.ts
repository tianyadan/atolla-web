import type { ComponentType } from 'react'
import ArchitectureDemo from './ArchitectureDemo'
import EngineHubDemo from './EngineHubDemo'
import AgentStudioDemo from './AgentStudioDemo'
import CollabDemo from './CollabDemo'
import RelayDemo from './RelayDemo'
import ApprovalDemo from './ApprovalDemo'
import './demos.css'

/** Markdown 中的 <!-- demo:name --> 占位 → 实时 React 演示 */
export const DEMOS: Record<string, ComponentType> = {
  architecture: ArchitectureDemo,
  'engine-hub': EngineHubDemo,
  'agent-studio': AgentStudioDemo,
  collab: CollabDemo,
  relay: RelayDemo,
  approval: ApprovalDemo,
}
