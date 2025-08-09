import { AppProviders } from "./providers"

export default function LayoutClient({ children }) {
  return <AppProviders>{children}</AppProviders>
}
