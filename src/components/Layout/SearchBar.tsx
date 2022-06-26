import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { Form, Image } from 'react-bootstrap';
import { useStore } from '~/store/StoreProvider';
import LoadingBtn from '../Form/LoadingBtn';

function SearchBar() {
  const router = useRouter();
  const { ytApi } = useStore();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const search = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    await ytApi.search(query);
    setLoading(false);
    router.push('/search-results');
  };

  return (
    <Form onSubmit={search} className="d-flex mx-auto">
      <Form.Group controlId="search-input">
        <Form.Label hidden>Search</Form.Label>
        <Form.Control
          type="search"
          placeholder="Search"
          aria-label="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </Form.Group>
      <LoadingBtn isLoading={loading}>
        <Image src="/search.svg" alt="Magnifying glass" />
      </LoadingBtn>
    </Form>
  );
}

export default SearchBar;
