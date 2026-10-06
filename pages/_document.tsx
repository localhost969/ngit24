import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Unified academic portal for attendance, schedules, and examination results across KMEC and NGIT."
        />
        <link rel="icon" href="/icon.jpeg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://challenges.cloudflare.com" />
      </Head>
      <body className="antialiased selection:bg-amber-500/20 selection:text-amber-900 dark:selection:text-amber-200">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
