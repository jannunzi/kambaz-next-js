import "@/app/labs/lab2/tailwind/utilities.css";

/** Tailwind responsive show/hide for the screen-size label. */
export default function ScreenSizeLabel() {
  return (
    <div
      id="wd-screen-size-label"
      className="fixed bottom-0 right-0 z-50 w-56 bg-black px-2 py-1 text-center text-xs text-white"
    >
      <div className="block sm:hidden">XS - Extra Small (&lt;640px)</div>
      <div className="hidden sm:block md:hidden">S - Small (≥640px)</div>
      <div className="hidden md:block lg:hidden">M - Medium (≥768px)</div>
      <div className="hidden lg:block xl:hidden">L - Large (≥1024px)</div>
      <div className="hidden xl:block 2xl:hidden">XL - Extra Large (≥1280px)</div>
      <div className="hidden 2xl:block">2XL - Extra Extra Large (≥1536px)</div>
    </div>
  );
}
