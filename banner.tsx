import type { PropsWithChildren } from 'react';
import Button from '@/components/button';
import bannerContent from '@/content/banner.json';
import bannerWhiteLogo from '@/assets/images/sjp-white.svg';
import portfolioChart from '@/assets/images/3d-portfolio-chart.svg';
import googlePlayStoreIcon from '@/assets/images/google-playstore-icon.svg';
import appStoreIcon from '@/assets/images/app-store-icon.svg';
import { getDeviceView } from '@/utils/view-detect';

export default function Banner({ children }: PropsWithChildren) {
  const { isBrowser } = getDeviceView();
  return (
    <div className="flex h-screen w-full flex-col lg:flex-row">
      {isBrowser && (
        <aside className="to-primary border-b-secondary from-dark order-2 flex flex-col gap-2.5 border-b-8 bg-linear-to-t p-10 lg:order-1 lg:w-3xl lg:overflow-hidden">
          <img
            src={bannerWhiteLogo}
            alt="banner logo"
            className="mr-auto mb-2.5 hidden h-17.5 shrink-0 lg:block"
          />
          <div className="mx-auto flex w-full max-w-md flex-col sm:flex-row lg:flex-col">
            <div className="mb-4 flex min-h-0 items-center justify-center overflow-hidden sm:w-1/2 lg:w-full">
              <img
                src={portfolioChart}
                alt="banner bg"
                height="300"
                className="h-52 w-full lg:h-[38vh] lg:object-contain xl:h-[45vh]"
              />
            </div>
            <div className="flex flex-col gap-2.5 sm:w-1/2 lg:w-full">
              <h3 className="font-neo-display md:2xl flex flex-auto flex-wrap gap-1 text-3xl font-bold text-white lg:gap-2">
                <span>{bannerContent.YOUR_PORTFOLIO}</span>
                <span>{bannerContent.IN_YOUR_POCKET}</span>
              </h3>
              <p className="font-poppins text-turqouise shrink-0 text-sm">
                {bannerContent.DOWNLOAD_SJP_APP}
              </p>
              <div className="flex shrink-0 justify-center gap-5">
                <Button
                  variant="link"
                  className="rounded focus-visible:before:border-white"
                  aria-label="Download on AppStore"
                >
                  <img src={appStoreIcon} className="w-32 object-contain" alt="appstore" />
                </Button>
                <Button
                  variant="link"
                  className="rounded focus-visible:before:border-white"
                  aria-label="Download on PlayStore"
                >
                  <img src={googlePlayStoreIcon} className="w-32 object-contain" alt="playstore" />
                </Button>
              </div>
            </div>
          </div>
        </aside>
      )}
      <main
        id="main-content"
        className="lg:flex-2.5/4 order-1 w-full grow lg:order-2 lg:overflow-y-auto"
      >
        {children}
      </main>
    </div>
  );
}
