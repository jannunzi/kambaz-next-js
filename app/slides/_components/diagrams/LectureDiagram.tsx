import type { LectureDiagramId } from "@/lib/lectures/types";
import ClientServerDiagram from "./ClientServerDiagram";
import CourseStackDiagram from "./CourseStackDiagram";
import CsrDiagram from "./CsrDiagram";
import DomTreeDiagram from "./DomTreeDiagram";
import GithubCreateRepoMock from "./GithubCreateRepoMock";
import NetworkOfNetworksDiagram from "./NetworkOfNetworksDiagram";
import NpmRunDevMock from "./NpmRunDevMock";
import ReactDataUiDiagram from "./ReactDataUiDiagram";
import SsrDiagram from "./SsrDiagram";
import TailwindBreakpointsDiagram from "./TailwindBreakpointsDiagram";
import BoxModelDiagram from "./BoxModelDiagram";
import GoogleCloudKeyMock from "./GoogleCloudKeyMock";
import GrokTokenFlow from "./GrokTokenFlow";
import OpenaiProjectKeyMock from "./OpenaiProjectKeyMock";
import OpenaiRolesFlow from "./OpenaiRolesFlow";
import VercelAddProjectMock from "./VercelAddProjectMock";
import VercelAuthMock from "./VercelAuthMock";
import VercelDashboardMock from "./VercelDashboardMock";
import VercelDeployMock from "./VercelDeployMock";
import VercelGitProviderMock from "./VercelGitProviderMock";
import VercelImportMock from "./VercelImportMock";
import VercelLoginMock from "./VercelLoginMock";
import VercelProtectMock from "./VercelProtectMock";
import VercelSuccessMock from "./VercelSuccessMock";
import XaiKeyMock from "./XaiKeyMock";
import YoutubeEnableApiMock from "./YoutubeEnableApiMock";
import YoutubeSaveFlow from "./YoutubeSaveFlow";
import YoutubeSearchFlow from "./YoutubeSearchFlow";

export default function LectureDiagram({ id }: { id: LectureDiagramId }) {
  switch (id) {
    case "network-of-networks":
      return <NetworkOfNetworksDiagram />;
    case "client-server":
      return <ClientServerDiagram />;
    case "ssr":
      return <SsrDiagram />;
    case "csr":
      return <CsrDiagram />;
    case "course-stack":
      return <CourseStackDiagram />;
    case "react-data-ui":
      return <ReactDataUiDiagram />;
    case "dom-tree":
      return <DomTreeDiagram />;
    case "npm-run-dev-mock":
      return <NpmRunDevMock />;
    case "github-create-repo-mock":
      return <GithubCreateRepoMock />;
    case "vercel-login-mock":
      return <VercelLoginMock />;
    case "vercel-add-project-mock":
      return <VercelAddProjectMock />;
    case "vercel-git-provider-mock":
      return <VercelGitProviderMock />;
    case "vercel-import-mock":
      return <VercelImportMock />;
    case "vercel-deploy-mock":
      return <VercelDeployMock />;
    case "vercel-success-mock":
      return <VercelSuccessMock />;
    case "vercel-dashboard-mock":
      return <VercelDashboardMock />;
    case "vercel-protect-mock":
      return <VercelProtectMock />;
    case "vercel-auth-mock":
      return <VercelAuthMock />;
    case "box-model":
      return <BoxModelDiagram />;
    case "tailwind-breakpoints":
      return <TailwindBreakpointsDiagram />;
    case "google-cloud-key-mock":
      return <GoogleCloudKeyMock />;
    case "youtube-enable-api-mock":
      return <YoutubeEnableApiMock />;
    case "youtube-search-flow":
      return <YoutubeSearchFlow />;
    case "youtube-save-flow":
      return <YoutubeSaveFlow />;
    case "openai-project-key-mock":
      return <OpenaiProjectKeyMock />;
    case "openai-roles-flow":
      return <OpenaiRolesFlow />;
    case "xai-key-mock":
      return <XaiKeyMock />;
    case "grok-token-flow":
      return <GrokTokenFlow />;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}
