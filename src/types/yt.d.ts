interface YTSearchResponse {
  nextPageToken?: string;
  items: YTVideo[];
}

interface YTVideo {
  id:
    | {
        videoId: string;
      }
    | string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: { url: string };
      default: { url: string };
    };
  };
}
