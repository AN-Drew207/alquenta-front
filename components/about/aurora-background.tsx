export function AuroraBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <span className="nos-blob absolute top-[-160px] left-[-120px] h-[340px] w-[340px] bg-[radial-gradient(circle_at_30%_30%,rgba(255,138,61,.55),transparent_68%)] sm:h-[520px] sm:w-[520px]" />
      <span className="nos-blob absolute top-[-120px] right-[-180px] h-[380px] w-[380px] bg-[radial-gradient(circle_at_60%_40%,rgba(240,90,40,.40),transparent_66%)] [animation-delay:-7s] sm:h-[600px] sm:w-[600px]" />
      <span className="nos-blob absolute top-[180px] left-[38%] h-[300px] w-[300px] bg-[radial-gradient(circle_at_50%_50%,rgba(255,190,120,.55),transparent_70%)] opacity-40 [animation-delay:-13s] sm:h-[460px] sm:w-[460px]" />
      <span className="nos-grid-fade" />
    </div>
  );
}
