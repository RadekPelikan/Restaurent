import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRestaurants } from "./app/restaurants";
import { useAuth0 } from "@auth0/auth0-react";

type Ierror = {
  message: string;
};

const App = () => {
  const { isLoading, isAuthenticated, user, loginWithRedirect, logout } =
    useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const query = useQuery({
    queryKey: ["restaurants"],
    queryFn: getRestaurants,
  });

  const status = query.status;
  const restaurants = query.data;
  const error = query.error as Ierror;

  return (
    <>
      {isAuthenticated ? (
        <div>
          <p>Hello {user?.name}</p>
          <button onClick={() => logout()}>Log out</button>
        </div>
      ) : (
        <button onClick={() => loginWithRedirect()}>Log in</button>
      )}

      {/* <div>
        Hello {user?.name}{" "}
        <button onClick={() => logout({ returnTo: window.location.origin })}>
          Log out
        </button>
      </div>
      <button onClick={() => loginWithRedirect()}>Log in</button> */}
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
