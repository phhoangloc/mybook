'use client'
import { useState,useEffect } from "react";
import Header from "@/components/display/header";
import Parallax from "@/components/display/parallax";
import { ItemType } from "@/type/type";
import { ApiItem } from "@/api/client";
export default function Home() {
  
  const [_items, set_items] = useState<ItemType[]>([])
  const geItem = async (archive: string, limit: number) => {
    const result = await ApiItem({ archive, limit })
    if (result.success) {
      set_items(result.data)
    } else {
      set_items([])
    }
  }
  useEffect(() => {
    geItem("blog", 50)
  }, [])
  return (
    <div className="bg-lv-0 h-screen">
    <Header />
    <Parallax data={_items} />
    </div>
  );
}
