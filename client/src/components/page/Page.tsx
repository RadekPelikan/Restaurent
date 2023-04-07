import { FC, ReactNode } from "react";
import { Helmet } from "react-helmet";

type IPage = {
  children?: ReactNode;
  title: string;
};

const Page: FC<IPage> = (props) => {
  return (
    <>
      <Helmet>
        <title>{props.title}</title>
      </Helmet>

      <div className="flex flex-col min-h-screen pt-10">{props.children}</div>
    </>
  );
};

export default Page;
