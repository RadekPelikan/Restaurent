import { FC, ReactNode } from "react";
import { Page } from "../../components";

type LoginPageType = {
  children?: ReactNode;
};

const LoginPage: FC<LoginPageType> = () => {
  return (
    <Page title="LoginPage">
      <h1>LoginPage</h1>
    </Page>
  );
};

export default LoginPage;
