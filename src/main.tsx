
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  // Aplica el modo oscuro guardado antes del primer render para evitar parpadeo.
  // Se omite en el iframe de vista previa móvil (?mobilePreview=1): esa app siempre es clara.
  if (new URLSearchParams(window.location.search).get('mobilePreview') !== '1') {
    if (localStorage.getItem('ui-theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }

  createRoot(document.getElementById("root")!).render(<App />);
