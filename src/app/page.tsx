'use client'
import Cover from "@/components/display/cover";
import { useState, useEffect } from "react";
import { ItemType } from "@/type/type";
import { ApiItem } from "@/api/client";
import Image from "next/image";
import Layout from "@/components/display/layout";
import { useRouter } from "next/navigation";
import Parallax from "@/components/display/parallax";
import Footer from "@/components/display/footer";

export default function Home() {

  const [_category_name, set_category_name] = useState<string>("")
  const [_blogs, set_blogs] = useState<ItemType[]>([])
  const getBLogs = async (archive: string, limit: number) => {
    const result = await ApiItem({ archive, limit })
    if (result.success) {
      set_blogs(result.data)
    } else {
      set_blogs([])
    }
  }
  useEffect(() => {
    getBLogs("blog", 4)
  }, [])
  const [_books, set_books] = useState<ItemType[]>([])
  const getBooks = async (archive: string, category: string | null, limit: number) => {
    const result = await ApiItem({ archive, category: category ? category : undefined, limit })
    if (result.success) {
      set_books(result.data)
    } else {
      set_books([])
    }
  }
  useEffect(() => {
    getBooks("book", _category_name, 12)
  }, [_category_name])
  const [_categories, set_categories] = useState<ItemType[]>([])
  const getCategories = async (archive: string) => {
    const result = await ApiItem({ archive })
    if (result.success) {
      set_categories(result.data)
    } else {
      set_categories([])
    }
  }
  useEffect(() => {
    getCategories("category")
  }, [])
  const toPage = useRouter()
  return (
    <>
      <Layout>
        <div className="min-h-screen">
          <Cover />
          <div className="h-12"></div>
          <div className="text-2xl font-bold text-lv-11 p-4">BLOG </div>
          <Parallax data={_blogs} subsx="!w-full" />
          <div className="h-12"></div>
          <div className="text-2xl font-bold text-lv-11 p-4">BOOK </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 ">
            <div className="col-span-1 w-full p-4" onClick={() => set_category_name("")}>
              <div className="bg-lv-1 aspect-[2] flex flex-col justify-center cursor-pointer border rounded">
                <div className="rotate-6 text-center font-bold text-lv-11 ">ALL</div>
              </div>
            </div>
            {_categories.map((category: ItemType, index: number) =>
              <div key={index} className="col-span-1 w-full p-4" onClick={() => set_category_name(category.name)}>
                <div className="bg-lv-1 aspect-[2] flex flex-col justify-center cursor-pointer border rounded">
                  <div className="rotate-6 text-center font-bold text-lv-11 ">{category.name}</div>
                </div>
              </div>
            )}
          </div>
          {_books.length ?
            <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {_books.map((book: ItemType, index: number) =>
                <div key={index} className="col-span-1 w-full p-4 flex flex-col justify-end" onClick={() => toPage.push("/book/" + book.slug)}>
                  <Image src={process.env.ftp_url + book.cover.name} width={500} height={500} alt="cover" className="w-full h-auto shadow-[12px_4px_4px_0px_rgba(0,0,0,0.25)] cursor-pointer transition-all duration-500 hover:-translate-y-4" />
                </div>
              )}
            </div> : <div className="p-4">No Book</div>}
          <div className="h-screen"></div>
        </div>
      </Layout>
      <Footer />
    </>
  );
}
