import type { APIRoute } from "astro";
import { contentAssetPaths, serveContentAsset } from "../../../../lib/assets";
import { isPostEntry } from "../../../../lib/content";

export function getStaticPaths() {
  return contentAssetPaths(isPostEntry);
}

export const GET: APIRoute = ({ props }) => serveContentAsset(props.filePath as string);
