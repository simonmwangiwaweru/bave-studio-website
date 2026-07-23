import { defineField, defineType } from "sanity";

/* A body of work presented as a coherent set — e.g. "Regenesys corporate
   event" or "AI for Business". The client creates these himself. */
export const gallery = defineType({
  name: "gallery",
  title: "Gallery / Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Photography", value: "photography" },
          { title: "Videography", value: "videography" },
          { title: "Live Streaming", value: "live-streaming" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "subcategory",
      title: "Sub-category",
      type: "string",
      description: "e.g. Weddings, Corporate, Portrait",
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Describe this photo (for search engines & screen readers)",
              type: "string",
              validation: (r) => r.required(),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "videoUrl",
      title: "Video link (YouTube or Vimeo)",
      type: "url",
      description: "Paste the full video URL for video projects.",
    }),
    defineField({
      name: "client",
      title: "Client name",
      type: "string",
    }),
    defineField({
      name: "date",
      title: "Shoot date",
      type: "date",
    }),
    defineField({
      name: "description",
      title: "About this project",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "featured",
      title: "Show on homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      description: "Turn off to hide from the site without deleting.",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "images.0" },
  },
});
