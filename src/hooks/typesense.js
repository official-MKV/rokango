// import { useState, useEffect } from "react";
// import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";

// const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
//   server: {
//     apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_ONLY_API_KEY,
//     nodes: [
//       {
//         host: process.env.NEXT_PUBLIC_TYPESENSE_HOST,
//         port: process.env.NEXT_PUBLIC_TYPESENSE_PORT,
//         protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL,
//       },
//     ],
//   },
//   additionalSearchParameters: {
//     query_by: "name,description,brand,supplier.name",
//   },
// });

// const searchClient = typesenseInstantsearchAdapter.searchClient;

// export function useTypesenseSearch(initialSearchTerm = "") {
//   const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
//   const [searchResults, setSearchResults] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchResults = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const results = await searchClient.search([
//           {
//             indexName: "products",
//             query: searchTerm,
//             params: {
//               hitsPerPage: 20,
//             },
//           },
//         ]);
//         setSearchResults(results.results[0].hits);
//       } catch (err) {
//         setError(err.message);
//       }
//       setIsLoading(false);
//     };

//     if (searchTerm) {
//       fetchResults();
//     } else {
//       setSearchResults([]);
//     }
//   }, [searchTerm]);

//   return { searchTerm, setSearchTerm, searchResults, isLoading, error };
// }
