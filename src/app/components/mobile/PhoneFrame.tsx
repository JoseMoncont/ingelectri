interface PhoneFrameProps {
  src: string;
  title?: string;
}

/**
 * Bisel de celular que envuelve un iframe. El iframe le da a la app móvil
 * embebida su propio viewport real, así los `h-screen`/`min-h-screen` de
 * las pantallas móviles miden el alto del "celular" y no el de la ventana.
 */
export function PhoneFrame({ src, title = 'Vista previa de la app móvil' }: PhoneFrameProps) {
  return (
    <div className="relative mx-auto h-[760px] w-[380px] shrink-0 rounded-[3rem] bg-brand-dark p-3 shadow-2xl ring-1 ring-white/10">
      <div className="absolute -left-px top-28 h-10 w-[3px] rounded-l-sm bg-black/40" />
      <div className="absolute -left-px top-44 h-16 w-[3px] rounded-l-sm bg-black/40" />
      <div className="absolute -right-px top-40 h-20 w-[3px] rounded-r-sm bg-black/40" />

      <div className="relative h-full w-full overflow-hidden rounded-[2.4rem] bg-white">
        {/* Dynamic-island style notch, kept clear of app content: screens reserve ~36px of top padding */}
        <div className="pointer-events-none absolute left-1/2 top-2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-brand-dark" />
        <iframe src={src} title={title} className="h-full w-full border-0" />
      </div>
    </div>
  );
}
