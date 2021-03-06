/**
 * Defines the configuration interface for the build system.
 */
export default interface Config {
  version?: string;
  appleNotarizationBundleId?: string;
  input?: string;
  execInput?: string;
  outputDir?: string;
  analyticsConfig?: string;
  rootDir?: string;
  project?: string;
  revision?: string;
  branch?: string;
  evgAwsKey?: string;
  evgAwsSecret?: string;
  downloadCenterAwsKey?: string;
  downloadCenterAwsSecret?: string;
  githubToken?: string;
  segmentKey?: string;
  appleNotarizationUsername?: string;
  appleNotarizationApplicationPassword?: string;
  appleCodesignIdentity?: string;
  appleCodesignEntitlementsFile?: string;
  isCi?: boolean;
  platform?: string;
  execNodeVersion?: string;
  signableBinary?: boolean;
  buildVariant?: string;
  repo?: {
    owner: string;
    repo: string;
  };
  dryRun?: boolean;
  isPatch?: boolean;
}
