import { FC, PropsWithChildren } from "react";

const PublicLayout: FC<PropsWithChildren> = ({ children }) => {
  return <main className="container py-6">{children}</main>;
};

export default PublicLayout;
