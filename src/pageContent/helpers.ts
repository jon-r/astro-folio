import type { PageCopy, PageCopyList, PageCopyPagagraph, PageCopySubtitle } from "../types/content.ts";

export const isParagraph = (text: PageCopy): text is PageCopyPagagraph => text.type === "PARAGRAPH";
export const isList = (text: PageCopy): text is PageCopyList => text.type === "LIST";
export const isSubtitle = (text: PageCopy): text is PageCopySubtitle => text.type === "SUBTITLE";

export const toParagraph = (value: string): PageCopyPagagraph => ({ type: "PARAGRAPH", value });
export const toList = (value: string[]): PageCopyList => ({ type: "LIST", value });
export const toSubtitle = (value: string): PageCopySubtitle => ({ type: "SUBTITLE", value });
