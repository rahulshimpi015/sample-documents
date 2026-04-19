<BannerLayout>
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

    {/* Section */}
    <section
      className="flex flex-col flex-1 justify-center sm:items-center sm:text-center overflow-hidden"
      style={{ padding: 'clamp(20px, 4vw, 48px) clamp(20px, 5vw, 56px) 0' }}
    >
      {/* Chart — mobile only */}
      <div className="flex justify-center sm:hidden"
        style={{ marginBottom: 'clamp(12px, 2vh, 20px)' }}>
        <img
          src="portfolioChart.png"
          alt="portfolio chart"
          style={{ width: 'clamp(64px, 18vw, 110px)' }}
        />
      </div>

      <div
        className="flex flex-col items-start sm:items-center"
        style={{ gap: 'clamp(6px, 1.2vh, 14px)' }}
      >
        <h1
          className="font-bold text-[#0A1428]"
          style={{ fontSize: 'clamp(20px, 3.2vw, 38px)', lineHeight: 1.25 }}
        >
          Your portfolio.<br />Simplified.
        </h1>
        <p
          className="font-medium text-[#616061] max-w-[400px]"
          style={{ fontSize: 'clamp(11px, 1.05vw, 14px)', lineHeight: 1.65 }}
        >
          Got an SJP account? Register now to view your funds and documents
          in one place.
        </p>
      </div>
    </section>

    {/* Footer */}
    <footer
      className="flex-shrink-0"
      style={{
        padding: 'clamp(14px, 2vh, 24px) clamp(20px, 5vw, 56px) clamp(14px, 2.5vh, 28px)',
      }}
    >
      <div
        className="flex flex-col w-full mx-auto max-w-[400px]"
        style={{ gap: 'clamp(7px, 1.2vh, 12px)' }}
      >
        <button
          className="w-full bg-[#1C4ED8] hover:bg-[#1E40AF] text-white font-semibold rounded-md transition-colors"
          style={{ fontSize: 'clamp(11px, 1.05vw, 14px)', padding: 'clamp(9px, 1.4vh, 13px) 16px' }}
        >
          Register for online services
        </button>

        <span className="relative text-center font-semibold text-[#606776]"
          style={{ fontSize: 11 }}>
          <span className="before:absolute before:top-1/2 before:left-0 before:h-px before:w-[44%] before:bg-[#d1d5db]" />
          <span className="after:absolute after:top-1/2 after:right-0 after:h-px after:w-[44%] after:bg-[#d1d5db]" />
          OR
        </span>

        <button
          className="w-full bg-white border-[1.5px] border-[#d1d5db] hover:border-[#9ca3af] text-[#0A1428] font-medium rounded-md transition-colors"
          style={{ fontSize: 'clamp(11px, 1.05vw, 14px)', padding: 'clamp(9px, 1.4vh, 13px) 16px' }}
        >
          Sign in
        </button>

        <button
          className="hidden sm:block self-center text-[#1C4ED8] underline bg-none border-none cursor-pointer"
          style={{ fontSize: 12, marginTop: 'clamp(2px, 0.8vh, 8px)' }}
        >
          Cookie Preferences
        </button>
      </div>
    </footer>

  </div>
</BannerLayout>