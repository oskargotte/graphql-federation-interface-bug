import { gql, useQuery } from "@apollo/client";

const GET_MEDIA_FRAGMENT = gql`
  query GetMediaFragment {
    topRatedMedia(id: 1) {
      id
      title
      review
    }
  }
`;
const GET_BOOKS_FRAGMENT = gql`
  query GetBooksFragment {
    topRatedMedia(id: 2) {
      id
      title
      ... on Book {
        review
      }
    }
  }
`;

export default function App() {
  const { data: media } = useQuery(GET_MEDIA_FRAGMENT);
  const { error, data: bookFragment } = useQuery(GET_BOOKS_FRAGMENT);
  return (
    <div
      style={{
        fontFamily: "monospace",
      }}
    >
      <div style={{ borderWidth: 2, padding: 5 }}>
        <div style={{ fontWeight: "bold", whiteSpace: "pre" }}>
          {`topRatedMedia {
  id
  title
  ... on Media {
    review
  }
}`}
        </div>
        <div>{"=>"}</div>
        {media?.topRatedMedia?.map((book) => (
          <div key={book.id}>{JSON.stringify(book, null, 2)}</div>
        ))}
      </div>
      <div style={{ borderWidth: 2, padding: 5, marginTop: 30 }}>
        <div style={{ fontWeight: "bold", whiteSpace: "pre" }}>
          {`topRatedMedia {
  id
  title
  ... on Book {
    review
  }
}`}
        </div>
        <div>{"=>"}</div>
        {bookFragment?.topRatedMedia?.map((book) => (
          <div key={book.id}>{JSON.stringify(book, null, 2)}</div>
        ))}
        {!bookFragment && !error && "no books and no error?"}
      </div>
    </div>
  );
}
