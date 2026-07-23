import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "showreelUrl",
      title: "Showreel video link",
      type: "url",
    }),
    defineField({
      name: "aboutBio",
      title: "About page biography",
      type: "text",
      rows: 8,
    }),
    defineField({
      name: "headshot",
      title: "Your photo (About page)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "phone",
      title: "Phone number",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email address",
      type: "string",
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp number (international format)",
      type: "string",
      description: "e.g. 254798108543 — leave empty to hide WhatsApp links.",
    }),
    defineField({
      name: "socialLinks",
      title: "Social media links",
      type: "array",
      of: [{ type: "url" }],
    }),
    defineField({
      name: "seoDescription",
      title: "Site description (search engines)",
      type: "text",
      rows: 2,
    }),
  ],
});
