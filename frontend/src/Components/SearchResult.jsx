import { useSearch } from "../context/searchContext";
import Card from "./Card";
import SearchForm from "./SearchForm";


export default function Search() {
  const [search, setSearch] = useSearch();

  return (
    <div>
      <h1 className="display-1 bg-primary text-light p-5">Search</h1>
      <SearchForm />

      <div className="container">
        <div className="row">
          {search.results?.length > 0 ? (
            <div className="col-md-12 text-center p-5">
              Found {search.results?.length} results
            </div>
          ) : (
            <div className="col-md-12 text-center p-5">No properties found</div>
          )}
        </div>

        <div className="row">
          {search.results?.map((item) => (
            <Card Ad={item} key={item._id} />
          ))}
        </div>
      </div>
    </div>
  );
}