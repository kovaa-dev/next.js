import { getDeploymentId } from '../shared/lib/deployment-id'

declare global {
  /** @internal */
  var NEXT_DEPLOYMENT_ID: string | undefined
}

const deploymentId = getDeploymentId()
globalThis.NEXT_DEPLOYMENT_ID = deploymentId
