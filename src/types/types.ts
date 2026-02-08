export type AgentProposal = {
  reasoning: string
  action: string
  payload?: any
}

export type ToolResult = {
  success: boolean
  output: string
}