import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("teachers", "routes/teachers.tsx"),
  route("subjects", "routes/subjects.tsx"),
] satisfies RouteConfig;
