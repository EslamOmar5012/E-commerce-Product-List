import { useRouteError } from "react-router-dom";

function Error() {
  const error = useRouteError();
  return <p>{error.message}</p>;
}

export default Error;
