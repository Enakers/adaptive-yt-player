import {observer} from "mobx-react-lite";
import {useRouter} from "next/router";
import {useEffect, useRef} from "react";
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  FormSelect,
  ListGroup,
  Ratio,
  Row
} from "react-bootstrap";
import {FullScreen, useFullScreenHandle} from "react-full-screen";
import AddToPlaylist from "~/components/AddToPlaylist";
import Input from "~/components/Input/Input";
import Loader from "~/components/Loader";
import useVideo from "~/hooks/useVideo";
import {useStore} from "~/store/StoreProvider";
import SearchResults from "../search-results";

function Player() {
  const handleFullscreen = useFullScreenHandle();
  const router = useRouter();
  const {playerApi, timerStore} = useStore();
  const {video, loading} = useVideo(router.query);
  const playerContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading || !video || !playerContainer.current) return;

    return playerApi.setupPlayer(playerContainer.current, video, handleFullscreen);
  }, [loading, video, playerContainer.current]);

  if (loading) {
    return <Loader />;
  }

  if (!loading && !video) {
    return <div>Video not found</div>;
  }

  return (
    <>
      <Container fluid className={playerApi.ready ? "" : "visually-hidden"}>
        <Row>
          <Col xs={12} lg={8}>
            <div
              className={
                "d-flex justify-content-between " + playerApi.started ? "visually-hidden" : ""
              }
            >
              <h5>{video?.title}</h5>
              <Button variant="warning">Reset</Button>
            </div>

            <FullScreen handle={handleFullscreen} className="d-grid">
              <Ratio
                aspectRatio="16x9"
                className={
                  playerApi.started && !playerApi.isPlaying ? "visually-hidden" : "player-container"
                }
              >
                <div ref={playerContainer} />
              </Ratio>
              {playerApi.isBuffering && (
                <div className="overlay">
                  <Loader colour="white" />
                </div>
              )}
              {!playerApi.isBuffering && (
                <>
                  {playerApi.useVideoTimers || timerStore.timer.playtime !== 0 ? (
                    <div
                      className={
                        playerApi.started && !playerApi.isPlaying ? "visually-hidden" : "overlay"
                      }
                    />
                  ) : null}
                  <Input />
                </>
              )}
            </FullScreen>

            <div className={playerApi.started ? "visually-hidden" : ""}>
              <Button variant="primary" onClick={playerApi.setStarted} className="w-100">
                Start
              </Button>
              <div className="mt-3 d-flex">
                <AddToPlaylist video={playerApi.video!} />
                <FloatingLabel controlId="timer-select" label="Select timer" className="ms-3 w-100">
                  <FormSelect
                    onChange={e => playerApi.setTimer(e.target.value)}
                    value={playerApi.useVideoTimers ? "custom" : timerStore.timer.name}
                  >
                    {timerStore.timers.map((t, i) => (
                      <option key={i} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                    {playerApi.video?.timers.length && <option value="custom">Video timers</option>}
                  </FormSelect>
                </FloatingLabel>
              </div>
              {playerApi.useVideoTimers && (
                <ListGroup>
                  {playerApi.video?.timers.map((t, i) => (
                    <ListGroup.Item
                      key={i}
                      variant={t.index === playerApi.videoTimerIndex ? "success" : undefined}
                    >
                      {t.index} - {t.videoTime} - {t.pauseTime} seconds
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>
          </Col>

          <Col xs={12} lg={4} className={playerApi.started ? "visually-hidden" : ""}>
            <SearchResults sidebar />
          </Col>
        </Row>
      </Container>

      {!playerApi.ready && <Loader />}
    </>
  );
}

export default observer(Player);
