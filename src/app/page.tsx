import Layout from "@/components/display/layout";
import { Menu } from "@/components/display/menu";
export default function Home() {
  return (
    <Layout sidebar={<Menu />}>
      <div>
        Hello world!!!
      </div>
    </Layout>
  );
}
