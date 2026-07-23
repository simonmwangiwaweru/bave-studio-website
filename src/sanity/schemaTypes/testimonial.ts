import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "What they said",
      type: "text",
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "author",
      title: "Client name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "organisation",
      title: "Organisation or event",
      type: "string",
    }),
    defineField({
      name: "service",
      title: "Related service",
      type: "string",
      options: {
        list: ["photography", "videography", "live-streaming"],
      },
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "author", subtitle: "organisation" },
  },
});
