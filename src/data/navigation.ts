export interface NavigationItem {
  href: string;
  label: string;
  icon: string;
}

const navigationItems: NavigationItem[] = [
  {
    href: "/",
    label: "Home",
    icon: `<svg class="cjnrq" xmlns="http://www.w3.org/2000/svg" width="21" height="19">
      <path fill-opacity=".16" d="M4 7v11h13V7l-6.5-5z"></path>
      <path d="m10.433 3.242-8.837 6.56L.404 8.198l10.02-7.44L20.59 8.194l-1.18 1.614-8.977-6.565ZM16 17V9h2v10H3V9h2v8h11Z"></path>
    </svg>`
  },
  {
    href: "/projects",
    label: "Projects",
    icon: `<svg class="cjnrq" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
      <path fill-opacity=".16" d="M1 4h18v10H1z"></path>
      <path d="M8 3h4V2H8v1ZM6 3V0h8v3h6v12H0V3h6ZM2 5v8h16V5H2Zm14 13v-2h2v4H2v-4h2v2h12Z"></path>
    </svg>`
  },
  {
    href: "/resume",
    label: "Resume",
    icon: `<svg class="cjnrq" xmlns="http://www.w3.org/2000/svg" width="18" height="20">
      <path fill-opacity=".16" fill-rule="nonzero" d="M1 5h16v14H1z"></path>
      <path fill-rule="nonzero" d="M2 6v12h14V6H2Zm16-2v16H0V4h18ZM2 2V0h14v2H2Z"></path>
    </svg>`
  }
];

export default navigationItems;