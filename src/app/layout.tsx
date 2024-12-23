import type { Metadata } from "next";
import "../style/globals.css";
import Provider from "@/redux/component/provider";
import DecideModal from "@/components/modal/decide.modal";
import NoticeModal from "@/components/modal/notice.modal";
import { Modal } from "@/components/modal/imagemodal";
import { Noto_Sans } from 'next/font/google'
import Layout from "@/components/display/layout";
import { Menu } from "@/components/display/menu";
export const metadata: Metadata = {
  title: "Admin",
};
const noto = Noto_Sans({
  subsets: ['latin'],
  display: 'swap',
})
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={noto.className}>
        <Provider>
          <DecideModal />
          <NoticeModal />
          <Modal />
          <Layout sidebar={<Menu />}>
            {children}
          </Layout>
        </Provider>
      </body>
    </html>
  );
}
