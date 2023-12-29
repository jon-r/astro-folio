export interface PageContent {
  title?: string;
  copy: PageCopy[]
}

export type PageCopy = PageCopySubtitle | PageCopyList | PageCopyPagagraph;

export interface PageCopySubtitle {
  type: 'SUBTITLE',
  value: string;
}
export interface PageCopyPagagraph {
  type: 'PARAGRAPH',
  value: string;
}

export interface PageCopyList {
  type: 'LIST',
  value: string[];
}

export interface PageSection {
  title: string;
  content: PageContent[]
}
