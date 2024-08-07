import Image from "next/image";
import {RouteComponent} from "@/components/component/route-component"
import Component from "@/components/component/RouteComponent";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 m-16">
      {/* <Component/> */}
     <RouteComponent/>
    </main>
  );
}
