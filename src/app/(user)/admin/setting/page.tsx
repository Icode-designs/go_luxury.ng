import Link from "next/link";
import { AiFillProduct } from "react-icons/ai";
import { MdOutlineImage } from "react-icons/md";
import { BiImages } from "react-icons/bi";
import { LuFileText } from "react-icons/lu";
import { AdminContentBox, AdminHeaderBox } from "@/components/user/user.styles";
import { SettingsHubGrid, SettingsHubCard } from "@/components/settings/settings.styles";
import React from "react";

const SETTINGS_SECTIONS = [
  {
    href: "/admin/setting/categories",
    icon: AiFillProduct,
    title: "Categories",
    description: "Manage product categories, images, and attributes.",
  },
  {
    href: "/admin/setting/hero",
    icon: MdOutlineImage,
    title: "Homepage Hero",
    description: "Change the hero image, tag, heading, and subtext.",
  },
  {
    href: "/admin/setting/gallery",
    icon: BiImages,
    title: "Homepage Gallery",
    description: "Set the 5 photos shown in the homepage gallery.",
  },
  {
    href: "/admin/setting/terms",
    icon: LuFileText,
    title: "Terms & Policies",
    description: "Edit the Terms & Policies page shown to customers.",
  },
] as const;

const page = () => {
  return (
    <AdminContentBox>
      <AdminHeaderBox>
        <h1>Settings</h1>
      </AdminHeaderBox>
      <div className="content">
        <SettingsHubGrid>
          {SETTINGS_SECTIONS.map(({ href, icon: Icon, title, description }) => (
            <Link key={href} href={href} passHref legacyBehavior>
              <SettingsHubCard>
                <Icon />
                <h3>{title}</h3>
                <p>{description}</p>
              </SettingsHubCard>
            </Link>
          ))}
        </SettingsHubGrid>
      </div>
    </AdminContentBox>
  );
};

export default page;
