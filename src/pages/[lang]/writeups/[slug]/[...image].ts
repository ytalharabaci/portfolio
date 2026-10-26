import type { APIRoute } from "astro";
import { contentAssetPaths, serveContentAsset } from "../../../../lib/assets";
import { isWriteupEntry } from "../../../../lib/content";

export function getStaticPaths() {
  return contentAssetPaths(isWriteupEntry);
}

export const GET: APIRoute = ({ props }) => serveContentAsset(props.filePath as string);
