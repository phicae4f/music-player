import type { ReactNode } from "react";
import { Header } from "./Header";
import { AudioPlayer } from "./AudioPlayer";

interface LayoutProps {
  children: ReactNode;
}
export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <AudioPlayer />
      <footer></footer>
    </>
  );
};
