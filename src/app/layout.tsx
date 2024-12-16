import type { Metadata } from "next";
import { Noto_Sans ,Noto_Serif} from "next/font/google";
import "../style/globals.css";
import Provider from "@/redux/component/provider";
import DecideModal from "@/components/modal/decide.modal";
import NoticeModal from "@/components/modal/notice.modal";
import { Menu } from "@/components/display/menu";
export const metadata: Metadata = {
  title: "Admin",
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const noto = Noto_Sans({
  subsets: ['latin'],
  display: 'swap',
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const serif = Noto_Serif({
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
      <body
       className={noto.className}>
        <Provider>
          <DecideModal />
          <NoticeModal />
          <Menu/>
          {children}
        </Provider>
      </body>
    </html>
  );
}
