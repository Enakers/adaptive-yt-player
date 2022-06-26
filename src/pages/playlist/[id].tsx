import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { useStore } from '~/store/StoreProvider';

function Playlist() {
  const router = useRouter();
  const { playlistStore, playerApi } = useStore();
  const playlist = useMemo(
    () => playlistStore.playlists.find(p => p.id === router.query.id),
    [router.query]
  );
  const videoEls = playlist?.videos.map((v, i) => (
    <Col key={i} tabIndex={0} data-index={i}>
      <Card>
        <Card.Img src={v.thumbnails.default.url} alt="Video thumbnail" />
        <Card.Body>
          <Card.Title>{v.title}</Card.Title>
        </Card.Body>
      </Card>
    </Col>
  ));
  const container = useRef<HTMLDivElement | null>(null);
  const [activeCard, setActiveCard] = useState(0);

  const speakTitle = () => {
    window.speechSynthesis.cancel();

    const title = playlist!.videos[activeCard]!.title;
    const utterance = new SpeechSynthesisUtterance(title);
    window.speechSynthesis.speak(utterance);
  };

  const containerCallback = useCallback((node: HTMLDivElement) => {
    if (!node) return;

    container.current = node;

    document.addEventListener('keydown', prevDefaultOnSpace);
    document.addEventListener('keyup', onSpace);
  }, []);

  useEffect(() => {
    if (!playerApi.isSwitchInput || !container.current) return;

    if (activeCard >= videoEls!.length) {
      setActiveCard(0);
      return;
    }
    if (activeCard === 0) {
      (container.current!.lastChild!.firstChild as HTMLElement).style.transform = '';
    } else {
      const prevCard = container.current.children[activeCard - 1].firstChild as HTMLElement;
      if (prevCard) prevCard.style.transform = '';
    }
    const currentCard = container.current!.children[activeCard].firstChild as HTMLDivElement;
    currentCard.focus();
    currentCard.style.transform = 'scale(1.1)';

    (container.current!.children[activeCard] as HTMLDivElement).focus();
    speakTitle();
  }, [activeCard]);

  const prevDefaultOnSpace = (e: KeyboardEvent) => {
    if (
      e.code === 'Space' &&
      playerApi.isSwitchInput &&
      (e.target as HTMLElement).nodeName !== 'INPUT'
    )
      e.preventDefault();
  };

  const onSpace = (e: KeyboardEvent) => {
    console.log((e.target as HTMLElement).nodeName);
    if (
      e.code !== 'Space' ||
      !playerApi.isSwitchInput ||
      (e.target as HTMLElement).nodeName === 'INPUT'
    )
      return;
    e.preventDefault();
    setActiveCard(n => n + 1);
  };

  return (
    <Container>
      <div className="d-flex justify-content-center mb-5">
        <h4>{playlist?.title}</h4>
        <Button
          className="ms-2"
          variant="primary"
          onClick={() => {
            playlistStore.loadPlaylist(playlist!);
            router.push(`/player/${playlist!.videos[0].id}/?playlistId={${playlist?.id}}`);
          }}
        >
          Load
        </Button>
      </div>

      <Row xs={1} md={2} lg={3} ref={containerCallback} style={{ rowGap: '5rem' }}>
        {playlist?.videos.map((v, i) => (
          <Col
            key={i}
            data-index={i}
            onKeyUp={e => {
              if (e.code === 'Enter') {
                playerApi.setStarted();
                router.push(`/player/${v.id}/?playlistId=${playlist?.id}`);
              }
            }}
          >
            <Card
              tabIndex={0}
              onClick={() => {
                router.push(`/player/${v.id}/?playlistId=${playlist?.id}`);
              }}
              className="clickable"
            >
              <Card.Img src={v.thumbnails.default.url} alt="Video thumbnail" />
              <Card.Body>
                <Card.Title>{v.title}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Playlist;
