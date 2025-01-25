import { FC, PropsWithChildren } from "react";

const PublicLayout: FC<PropsWithChildren> = ({ children }) => {
  return <main className="container my-6">{children}</main>;
};

export default PublicLayout;
