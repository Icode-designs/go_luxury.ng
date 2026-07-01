"use client";
import React from "react";
import Link from "next/link";
import { AiFillProduct } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { IoMdRepeat } from "react-icons/io";
import { IoCartOutline, IoSettingsOutline } from "react-icons/io5";
import { LuNotebook } from "react-icons/lu";
import {
  MdOutlineDashboard,
  MdOutlineInventory2,
  MdOutlineRateReview,
} from "react-icons/md";
import { SideBarNav } from "./user.styles";
import { usePathname } from "next/navigation";

const SidebarNavComponent = () => {
  const pathname = usePathname();
  return (
    <SideBarNav>
      <Link
        href="/admin"
        className={pathname === "/admin" ? "active" : undefined}
      >
        <MdOutlineDashboard /> <p>Dashboard</p>
      </Link>
      <Link
        href="/admin/orders"
        className={pathname.startsWith("/admin/orders") ? "active" : undefined}
      >
        <IoCartOutline />
        <p>Orders</p>
      </Link>
      <Link
        href="/admin/products"
        className={
          pathname.startsWith("/admin/products") ? "active" : undefined
        }
      >
        <AiFillProduct />
        <p>Products</p>
      </Link>{" "}
      <Link
        href="/admin/inventory"
        className={
          pathname.startsWith("/admin/inventory") ? "active" : undefined
        }
      >
        <MdOutlineInventory2 />
        <p>Inventory</p>
      </Link>
      <Link
        href="/admin/customers"
        className={
          pathname.startsWith("/admin/customers") ? "active" : undefined
        }
      >
        <FiUsers />
        <p>Customers</p>
      </Link>
      <Link
        href="/admin/reviews"
        className={pathname.startsWith("/admin/reviews") ? "active" : undefined}
      >
        <MdOutlineRateReview />
        <p>Reviews</p>
      </Link>
      <Link
        href="/admin/returns"
        className={pathname.startsWith("/admin/returns") ? "active" : undefined}
      >
        <IoMdRepeat />
        <p>Returns</p>
      </Link>
      <Link
        href="/admin/blog"
        className={pathname.startsWith("/admin/blog") ? "active" : undefined}
      >
        <LuNotebook />
        <p>Blog</p>
      </Link>
      <Link
        href="/admin/setting"
        className={pathname.startsWith("/admin/setting") ? "active" : undefined}
      >
        <IoSettingsOutline />
        <p>setting</p>
      </Link>
    </SideBarNav>
  );
};

export default SidebarNavComponent;
