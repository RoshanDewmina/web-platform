"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  PlayCircle,
  FileText,
  MessageSquare,
  Image as ImageIcon,
} from "lucide-react";
import {
  CourseSlide,
  Module,
  SubModule,
} from "@/lib/course-data/renewable-energy-ontario";
import ReactMarkdown from "react-markdown";
import dynamic from "next/dynamic";
import { YouTubeVideo } from "@/components/course/media/youtube-video";
import { CourseImage } from "@/components/course/media/course-image";

// Dynamically import interactive components
const CommunityEnergySurvey = dynamic(
  () => import("@/components/course/interactive/community-energy-survey").then(m => m.CommunityEnergySurvey),
  { ssr: false }
);
const ProjectTypeMatcher = dynamic(
  () => import("@/components/course/interactive/project-type-matcher").then(m => m.ProjectTypeMatcher),
  { ssr: false }
);
const NetMeteringExplainer = dynamic(
  () => import("@/components/course/interactive/net-metering-explainer").then(m => m.NetMeteringExplainer),
  { ssr: false }
);
const KnowledgeQuiz = dynamic(
  () => import("@/components/course/interactive/knowledge-quiz").then(m => m.KnowledgeQuiz),
  { ssr: false }
);
const PaybackCalculator = dynamic(
  () => import("@/components/course/interactive/payback-calculator").then(m => m.PaybackCalculator),
  { ssr: false }
);
const RegistrationForm = dynamic(
  () => import("@/components/course/interactive/registration-form").then(m => m.RegistrationForm),
  { ssr: false }
);
const CourseOverview = dynamic(
  () => import("@/components/course/interactive/course-overview").then(m => m.CourseOverview),
  { ssr: false }
);
const TTNIntroduction = dynamic(
  () => import("@/components/course/interactive/ttn-introduction").then(m => m.TTNIntroduction),
  { ssr: false }
);

interface SlideRendererProps {
  slide: CourseSlide;
  module: Module;
  subModule: SubModule;
  onNavigate: (direction: "prev" | "next") => void;
  onInteraction?: (eventType: string, eventName: string, eventData?: any) => void;
  onSlideComplete?: () => void;
}

export function SlideRenderer({
  slide,
  module,
  subModule,
  onNavigate,
  onInteraction,
  onSlideComplete,
}: SlideRendererProps) {
  // Track interactions helper
  const trackInteraction = (eventName: string, eventData?: any) => {
    if (onInteraction) {
      onInteraction("slide_interaction", eventName, {
        slideId: slide.id,
        slideType: slide.type,
        ...eventData,
      });
    }
  };
  const getSlideTypeIcon = () => {
    switch (slide.type) {
      case "video":
        return <PlayCircle className="h-5 w-5" />;
      case "interactive":
        return <MessageSquare className="h-5 w-5" />;
      case "quiz":
        return <FileText className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getSlideTypeLabel = () => {
    switch (slide.type) {
      case "video":
        return "Video";
      case "interactive":
        return "Interactive";
      case "quiz":
        return "Quiz";
      default:
        return "Content";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12 space-y-6 md:space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground overflow-x-auto">
        <span className="whitespace-nowrap">{module.title}</span>
        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
        <span className="whitespace-nowrap truncate">{subModule.title}</span>
      </div>

      {/* Slide Header - hide for registration slides */}
      {!["slide-0-1", "slide-0-2", "slide-0-3"].includes(slide.id) && (
        <>
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5">
                {getSlideTypeIcon()}
                <span className="text-xs sm:text-sm">{getSlideTypeLabel()}</span>
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {slide.title}
            </h1>
          </div>

          <Separator className="my-3 md:my-4" />
        </>
      )}

      {/* Slide Content */}
      <div className="space-y-6">
        {/* Main Content */}
        <Card className="border-0 shadow-none bg-transparent">
          <CardContent className="p-0">
            <div className="prose prose-sm sm:prose-base lg:prose-lg prose-slate dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-6 sm:mt-8 mb-4 sm:mb-6">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-slate-800 dark:text-slate-200 mt-6 sm:mt-8 lg:mt-10 mb-3 sm:mb-4 lg:mb-5 pb-2 border-b border-slate-200 dark:border-slate-700">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-800 dark:text-slate-200 mt-4 sm:mt-6 lg:mt-8 mb-2 sm:mb-3 lg:mb-4">
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-700 dark:text-slate-300 mt-4 sm:mt-5 lg:mt-6 mb-2 sm:mb-3">
                      {children}
                    </h4>
                  ),
                  h5: ({ children }) => (
                    <h5 className="text-sm sm:text-base lg:text-lg font-semibold text-slate-700 dark:text-slate-300 mt-3 sm:mt-4 lg:mt-5 mb-1 sm:mb-2">
                      {children}
                    </h5>
                  ),
                  h6: ({ children }) => (
                    <h6 className="text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-400 mt-3 sm:mt-4 mb-1 sm:mb-2">
                      {children}
                    </h6>
                  ),
                  p: ({ children }) => (
                    <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 my-3 sm:my-4 lg:my-6">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-outside pl-6 my-6 space-y-3 text-slate-700 dark:text-slate-300">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-outside pl-6 my-6 space-y-3 text-slate-700 dark:text-slate-300">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed pl-2" suppressHydrationWarning>
                      {children}
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-slate-900 dark:text-slate-100">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-slate-700 dark:text-slate-300">
                      {children}
                    </em>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary pl-6 my-6 italic text-slate-600 dark:text-slate-400">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children, ...props }) => {
                    const inline = !String(children).includes('\n');
                    return inline ? (
                      <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-slate-800 dark:text-slate-200">
                        {children}
                      </code>
                    ) : (
                      <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto my-6">
                        <code className="font-mono text-sm text-slate-800 dark:text-slate-200">
                          {children}
                        </code>
                      </pre>
                    );
                  },
                  hr: () => (
                    <hr className="my-8 border-slate-200 dark:border-slate-700" />
                  ),
                }}
              >
                {slide.content}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        {/* Media Content - Images and Videos */}
        {slide.media && (
          <div className="my-6">
            {slide.media.type === 'youtube' && (
              <div
                onClick={() => trackInteraction("video_played", { videoId: slide.media!.src })}
              >
                <YouTubeVideo
                  videoId={slide.media.src}
                  title={slide.media.alt || slide.title}
                  aspectRatio="16:9"
                />
              </div>
            )}
            {slide.media.type === 'image' && (
              <CourseImage
                src={slide.media.src}
                alt={slide.media.alt || slide.title}
                caption={slide.media.caption}
                aspectRatio="16:9"
                priority={false}
              />
            )}
          </div>
        )}

        {/* Visual Placeholder - only show if no media */}
        {slide.visualPlaceholder && !slide.media && (
          <Card className="border-dashed">
            <CardContent className="p-8 sm:p-10 md:p-12">
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <ImageIcon className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-muted-foreground" />
                <p className="text-muted-foreground text-xs sm:text-sm max-w-md">
                  {slide.visualPlaceholder}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes Section */}
        {slide.notes && slide.notes.length > 0 && (
          <Card className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                Key Notes
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {slide.notes.map((note, index) => (
                  <li key={index} className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400 flex items-start">
                    <span className="text-primary mr-2 sm:mr-3 text-base sm:text-lg leading-tight">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Interactive Elements */}
        {slide.type === "interactive" && (
          <>
            {/* Registration, Overview, and TTN intro don't need wrapper card */}
            {["slide-0-1", "slide-0-2", "slide-0-3"].includes(slide.id) ? (
              <>
                {slide.id === "slide-0-1" && (
                  <RegistrationForm 
                    onComplete={() => {
                      trackInteraction("registration_complete");
                      onSlideComplete?.();
                      onNavigate("next");
                    }}
                  />
                )}
                {slide.id === "slide-0-2" && (
                  <CourseOverview 
                    onContinue={() => {
                      trackInteraction("overview_viewed");
                      onSlideComplete?.();
                      onNavigate("next");
                    }}
                  />
                )}
                {slide.id === "slide-0-3" && (
                  <TTNIntroduction 
                    onContinue={() => {
                      trackInteraction("ttn_intro_viewed");
                      onSlideComplete?.();
                      onNavigate("next");
                    }}
                  />
                )}
              </>
            ) : (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  {slide.id === "slide-4" && <CommunityEnergySurvey />}
                  {slide.id === "slide-12" && <ProjectTypeMatcher />}
                  {slide.id === "slide-18" && <NetMeteringExplainer />}
                  {slide.id === "slide-38" && <PaybackCalculator />}
                  {!["slide-4", "slide-12", "slide-18", "slide-38"].includes(slide.id) && (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Interactive Activity</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Interactive content coming soon.
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
        
        {/* Quiz Elements */}
        {slide.type === "quiz" && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              {slide.id === "slide-47" ? (
                <KnowledgeQuiz />
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Quiz</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Quiz content coming soon.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Video Elements */}
        {slide.type === "video" && !slide.media && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-3">
                <PlayCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <h3 className="font-semibold text-sm sm:text-base">Video Content</h3>
              </div>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-3 p-4">
                  <PlayCircle className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto" />
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Video content will be displayed here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-8 sm:pt-10 md:pt-12 pb-6 sm:pb-8 border-t border-slate-200 dark:border-slate-700">
        <Button
          variant="outline"
          size="default"
          onClick={() => onNavigate("prev")}
          className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 md:px-6 text-xs sm:text-sm md:text-base"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="font-medium hidden sm:inline">Previous</span>
          <span className="font-medium sm:hidden">Prev</span>
        </Button>

        <Button
          size="default"
          onClick={() => onNavigate("next")}
          className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 md:px-6 text-xs sm:text-sm md:text-base"
        >
          <span className="font-medium">Next</span>
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>
    </div>
  );
}
