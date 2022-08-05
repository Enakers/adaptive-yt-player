import {Video} from "@prisma/client";
import {ParsedUrlQuery} from "querystring";
import {useEffect, useState} from "react";
import {useStore} from "~/store/StoreProvider";

const useVideo = (routerQuery: ParsedUrlQuery) => {
  const {playlistStore} = useStore();
  const [loading, setLoading] = useState(true);
  const [video, setVideo] = useState<Video | null>(null);

  useEffect(() => {
    setLoading(true);
    playlistStore
      .findVideo(routerQuery.videoId as string, routerQuery.playlistId as string)
      .then(v => {
        setVideo(v);
        setLoading(false);
      });
  }, [routerQuery]);

  return {video, loading};
};

export default useVideo;
