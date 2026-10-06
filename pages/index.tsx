'use client'

import { useState, useMemo } from 'react'
import Head from 'next/head'
import {
  Header,
  BottomNav,
  Greeting,
  Banner,
  LookupTabs,
  RollNumberSearch,
  NetraMobileSearch,
  SanjayaMobileSearch,
  RecentSearches,
  FaceNotRegistered,
  AttendanceOverview,
  SubjectAttendance,
  AttendanceCalendar,
  AttendanceTargetCalculator,
  PerformanceCharts,
  CalendarView,
  ResultsView,
  RateLimitModal,
} from '@/components'
import { useAcademicLookup } from '@/hooks/use-academic-lookup'
import { useRateLimit } from '@/hooks/use-rate-limit'
import useTheme from '@/hooks/use-theme'
import { detectCollege } from '@/lib/utils/formatters'
import type { ActiveView } from '@/components/common/BottomNav'
import type { LoginType } from '@/types/auth'

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>('home')
  const { isLoading: themeLoading, isTransitioning: themeTransitioning } = useTheme()

  const {
    attendanceData,
    subjectData,
    loading,
    error,
    currentHtno,
    currentStudentName,
    loginType,
    setLoginType,
    executeLookup,
    resetLookup,
  } = useAcademicLookup()

  const {
    isModalOpen: isRateLimitOpen,
    closeModal: closeRateLimitModal,
    rateLimitInfo,
    countdown: rateLimitCountdown,
    checkRateLimit,
    recordSearch,
  } = useRateLimit()

  const isGreen = useMemo(() => {
    return parseFloat(String(attendanceData?.overallAttendance || '0')) >= 75
  }, [attendanceData?.overallAttendance])

  const currentCollege = useMemo(() => {
    if (!currentHtno) return 'NGIT'
    return detectCollege(currentHtno)
  }, [currentHtno])

  const handleSearchInitiated = async (identifier: string, overrideLoginType?: LoginType) => {
    const targetType = overrideLoginType || loginType

    if (targetType === 'htno') {
      const rateCheck = checkRateLimit(identifier)
      if (!rateCheck.allowed) return
    }

    const success = await executeLookup(identifier, targetType)
    if (success && targetType === 'htno') {
      recordSearch(identifier)
    }
  }

  const handleResetAll = () => {
    setActiveView('home')
    resetLookup()
  }

  if (themeLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>
          {currentStudentName
            ? `${currentStudentName} | ${currentCollege} Student Tracker`
            : 'NGIT Student Tracker | Academic Portal'}
        </title>
      </Head>

      <div
        className={`relative min-h-screen overflow-x-hidden bg-[var(--color-background)] text-[var(--color-foreground)] transition-colors duration-300 ${
          themeTransitioning ? 'pointer-events-none' : ''
        }`}
      >
        <Header college={currentCollege} onLogoClick={handleResetAll} />

        {activeView === 'calendar' ? (
          <CalendarView onBack={() => setActiveView('home')} />
        ) : activeView === 'results' ? (
          <ResultsView onBack={() => setActiveView('home')} />
        ) : (
          <main className="mx-auto w-full md:max-w-sm px-4 sm:px-6 pb-24 pt-20" role="main">
            <section className="space-y-4 pt-1 pb-4">
              <LookupTabs activeTab={loginType} onTabChange={setLoginType} />

              {loginType === 'htno' ? (
                <RollNumberSearch
                  onSearch={(htno) => handleSearchInitiated(htno, 'htno')}
                  loading={loading}
                  isGreen={isGreen}
                />
              ) : loginType === 'netra' ? (
                <NetraMobileSearch
                  onSearch={(mob) => handleSearchInitiated(mob, 'netra')}
                  loading={loading}
                  isGreen={isGreen}
                />
              ) : (
                <SanjayaMobileSearch
                  onSearch={(mob) => handleSearchInitiated(mob, 'sanjaya')}
                  loading={loading}
                  isGreen={isGreen}
                />
              )}

              {error && (
                <div>
                  {error === 'NOT_REGISTERED' ? (
                    <FaceNotRegistered themeTransitioning={themeTransitioning} />
                  ) : (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-center">
                      <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                        {error}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </section>

            {!loading && !attendanceData && !error && (
              <>
                <Banner />
                <section className="w-full pb-8">
                  <RecentSearches
                    onSearch={(identifier, savedType) => handleSearchInitiated(identifier, savedType)}
                    loading={loading}
                  />
                </section>
              </>
            )}

            {loading ? (
              <div className="space-y-4">
                {currentStudentName && (
                  <Greeting htno={currentHtno} name={currentStudentName} isGreen={isGreen} />
                )}
                <AttendanceOverview loading isGreen={isGreen} />
                <AttendanceCalendar loading isGreen={isGreen} />
                <SubjectAttendance loading isGreen={isGreen} />
              </div>
            ) : attendanceData && subjectData ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                <Greeting htno={currentHtno} name={currentStudentName} isGreen={isGreen} />

                <AttendanceOverview
                  overallPercentage={attendanceData.overallAttendance}
                  attendanceDetails={attendanceData.attendanceDetails}
                  isGreen={isGreen}
                />

                <AttendanceTargetCalculator
                  subjectData={subjectData}
                  overallPercentage={attendanceData.overallAttendance}
                  isGreen={isGreen}
                />

                <PerformanceCharts subjectData={subjectData} isGreen={isGreen} />

                <AttendanceCalendar
                  data={attendanceData.attendanceDetails}
                  isGreen={isGreen}
                />

                <SubjectAttendance data={subjectData} isGreen={isGreen} />
              </div>
            ) : null}
          </main>
        )}

        <BottomNav activeView={activeView} onNavigate={setActiveView} />

        <RateLimitModal
          isOpen={isRateLimitOpen}
          onClose={closeRateLimitModal}
          remaining={rateLimitInfo.remaining}
          resetTime={rateLimitInfo.resetTimeFormatted}
          timeUntilReset={rateLimitCountdown}
        />
      </div>
    </>
  )
}
