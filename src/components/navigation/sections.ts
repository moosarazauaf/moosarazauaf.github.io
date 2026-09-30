/** The page's sections in order, with the stage of the research story each
 *  one stands for. Shared by the menu and the story rail. */
export const SECTIONS = [
  { id: "research", label: "Research", note: "Seven areas, one system" },
  { id: "sensing", label: "Observation", note: "The instruments behind the work" },
  { id: "projects", label: "Projects", note: "Twelve studies, built end to end" },
  { id: "data", label: "Data", note: "A national map you can query" },
  { id: "publications", label: "Publications", note: "Manuscripts and talks" },
  { id: "about", label: "About", note: "Who is behind the work" },
  { id: "contact", label: "Contact", note: "Start a conversation" },
] as const;
