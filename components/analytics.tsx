import Script from 'next/script'

export default function Analytics() {
  if (process.env.ENABLE_ANALYTICS !== 'true' || !process.env.googleAnalytics) {
    return <></>
  }
  return (
    <>
      <Script
        async
        src={
          'https://www.googletagmanager.com/gtag/js?id=' +
          process.env.googleAnalytics
        }
      />

      <Script id="google-analytics">
        {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.googleAnalytics}');
          `}
      </Script>
    </>
  )
}
