import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRestaurants } from "./app/restaurants";

type Ierror = {
  message: string;
};

const App = () => {
  const query = useQuery({
    queryKey: ["restaurants"],
    queryFn: getRestaurants,
  });

  const status = query.status;
  const restaurants = query.data;
  const error = query.error as Ierror;

  return (
    <>
      <h2 className="text-2xl">Hello</h2>
      <pre>
        {
          {
            loading: <p>Loading...</p>,
            error: <p>Error: {error?.message}</p>,
            success: <pre>{JSON.stringify(restaurants, null, 2)}</pre>,
          }[status]
        }
      </pre>
    </>
  );
};

export default App;
