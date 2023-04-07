import { FC, ReactNode } from "react";
import { Page } from "../../components";

type RegisterPageType = {
  children?: ReactNode;
};

const RegisterPage: FC<RegisterPageType> = () => {
  return (
    <Page title="RegisterPage">
      <h1>RegisterPage</h1>
    </Page>
  );
};

export default RegisterPage;
