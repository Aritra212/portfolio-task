export default function getRiskStatusColorByName(name: string) {
  switch (name?.toLowerCase()) {
    case "medium":
      return "#f59e0b";
    case "heigh":
      return "#dc2626";
    case "low":
    default:
      return "#65a30d";
  }
}
