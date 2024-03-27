import { createContext, useContext, useState } from "react";

const SearchContext = createContext();

const initialValues = {
  address: "",
  action: "",
  type: "",
  price: "",
  priceRange: [0, 50000],
  result: [],
  page: "",
  loading: false,
};

const SearchProvider = ({ children }) => {
  const [search, setSearch] = useState(initialValues);
  return (
    <SearchContext.Provider value={[search, setSearch, initialValues]}>
      {children}
    </SearchContext.Provider>
  );
};

const useSearch = () => useContext(SearchContext);
export { SearchProvider, useSearch };
