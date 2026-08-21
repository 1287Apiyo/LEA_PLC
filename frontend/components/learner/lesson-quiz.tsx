"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, RotateCcw, Trophy } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { courseService, type CourseLesson, type QuizAttempt } from "@/services/courses";

interface LessonQuizProps {
  courseId: string;
  lessonId: string;
  quiz: NonNullable<CourseLesson["quiz"]>;
  mastery?: CourseLesson["mastery"];
  onCompleted?: (attempt: QuizAttempt) => void;
}

export function LessonQuiz({ courseId, lessonId, quiz, mastery, onCompleted }: LessonQuizProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizAttempt | null>(null);
  const questionsAnswered = useMemo(() => Object.keys(answers).length, [answers]);

  const submit = useMutation({
    mutationFn: () => courseService.submitQuiz(courseId, lessonId, answers),
    onSuccess: ({ data }) => {
      setResult(data);
      onCompleted?.(data);
      toast.success(data.passed ? "Mastery check passed." : "Attempt saved — review the explanations and try again.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not save this mastery check."),
  });

  const reset = () => {
    setAnswers({});
    setResult(null);
  };

  return (
    <section className="space-y-4 border-t border-[#4d176e]/10 pt-5" aria-labelledby={`quiz-${lessonId}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-[#f47945]" aria-hidden />
            <h3 id={`quiz-${lessonId}`} className="text-sm font-semibold text-foreground">Mastery check</h3>
          </div>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground">
            Answer the short questions to check your understanding. You need {quiz.pass_percent}% to pass, and you can retry as many times as you need.
          </p>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <p>{quiz.questions.length} questions</p>
          <p>{mastery?.attempts ?? 0} saved attempt{mastery?.attempts === 1 ? "" : "s"}</p>
        </div>
      </div>

      <div className="space-y-4">
        {quiz.questions.map((question, questionIndex) => {
          const selected = answers[question.id];
          const explanation = result?.explanations?.find((item) => item.question_id === question.id);
          return (
            <div key={question.id} className="border border-[#4d176e]/12 bg-[#fffdfb] p-4">
              <p className="text-sm font-semibold leading-5">
                <span className="mr-2 text-xs font-bold text-[#b94920]">{questionIndex + 1}</span>
                {question.prompt}
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {question.options.map((option, optionIndex) => {
                  const isSelected = selected === String(optionIndex);
                  const isCorrect = Boolean(explanation && optionIndex === explanation.correct_index);
                  const isWrongSelection = Boolean(explanation && isSelected && !explanation.correct);
                  return (
                    <button
                      key={`${question.id}-${optionIndex}`}
                      type="button"
                      disabled={submit.isPending || Boolean(result)}
                      onClick={() => setAnswers((current) => ({ ...current, [question.id]: String(optionIndex) }))}
                      className={cn(
                        "flex items-start gap-2 border px-3 py-2.5 text-left text-xs leading-5 transition-colors",
                        isCorrect && "border-emerald-400 bg-emerald-50 text-emerald-900",
                        isWrongSelection && "border-red-300 bg-red-50 text-red-900",
                        !isCorrect && !isWrongSelection && isSelected && "border-[#4d176e] bg-[#f4ecf8] text-[#4d176e]",
                        !isCorrect && !isWrongSelection && !isSelected && "border-border hover:border-[#f47945]/70 hover:bg-[#fff8f4]",
                      )}
                    >
                      <span className={cn(
                        "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px]",
                        isSelected ? "border-[#4d176e] bg-[#4d176e] text-white" : "border-muted-foreground/40",
                      )}>
                        {isSelected ? "✓" : String.fromCharCode(65 + optionIndex)}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>
              {explanation ? (
                <div className={cn(
                  "mt-3 flex items-start gap-2 border-l-4 px-3 py-2.5 text-xs leading-5",
                  explanation.correct ? "border-emerald-400 bg-emerald-50 text-emerald-900" : "border-[#f47945] bg-[#fff8f4] text-[#7b3218]",
                )}>
                  {explanation.correct ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> : <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />}
                  <p>{explanation.explanation}</p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {result ? (
        <div className={cn(
          "flex flex-wrap items-center justify-between gap-3 border px-4 py-3",
          result.passed ? "border-emerald-300 bg-emerald-50" : "border-[#f47945]/40 bg-[#fff8f4]",
        )}>
          <div>
            <p className="text-sm font-semibold">{result.passed ? "Mastery achieved" : "Keep practising"}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              You scored {result.score}% ({result.correct_count}/{result.question_count}). {result.passed ? "This lesson is ready for your next step." : `A pass requires ${result.pass_percent}%.`}
            </p>
          </div>
          <Button type="button" size="sm" variant="outline" onClick={reset}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Try again
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#4d176e]/10 pt-3">
          <p className="text-xs text-muted-foreground">{questionsAnswered}/{quiz.questions.length} answered</p>
          <Button
            type="button"
            onClick={() => submit.mutate()}
            disabled={submit.isPending || questionsAnswered !== quiz.questions.length}
            className="bg-[#4d176e] text-white hover:bg-[#35104f]"
          >
            {submit.isPending ? "Checking…" : "Check my answers"}
          </Button>
        </div>
      )}
    </section>
  );
}
