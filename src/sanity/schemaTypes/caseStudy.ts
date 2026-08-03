import { defineField, defineType } from "sanity";

/* Live-streaming case study: what the event was, what was required,
   what was delivered — per Section 6.4 of the scope document. */
export const caseStudy = defineType({
  name: "caseStudy",
  title: "Streaming Case Study",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Event name",
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
      name: "eventType",
      title: "Type of event",
      type: "string",
      description: "e.g. Conference, Church service, Wedding",
    }),
    defineField({
      name: "brief",
      title: "What was required",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "delivered",
      title: "What we delivered",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "recordingUrl",
      title: "Recording link (YouTube/Facebook)",
      type: "url",
    }),
    defineField({
      name: "viewership",
      title: "Viewership figures",
      type: "string",
      description: "e.g. \"1,200 live viewers\" — only if known.",
    }),
    defineField({
      name: "images",
      title: "Photos",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Describe this photo",
              type: "string",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      initialValue: true,
    }),
  ],
});
