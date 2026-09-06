"use client";

import { Sparkles, CheckCircle2, MapPin, AlertTriangle } from "lucide-react";
import { ReviewResult } from "../types";

export default function ReviewSidebar({ review }: { review: ReviewResult }) {
    const { score, reviewsUsed, reviewsTotal, strengths, suggestions, concerns } =
        review;

    return (
        <div className="flex flex-col gap-5">
            {/* AI Review Status Card */}
            <div className="rounded-xl border border-stone-200 bg-white p-5">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-green-800" />
                        <span className="font-semibold text-stone-900">AI Review Ready</span>
                    </div>
                    <span className="text-xs text-stone-400 whitespace-nowrap">
                        {reviewsUsed} of {reviewsTotal} free reviews used
                    </span>
                </div>
                <p className="text-sm text-stone-500 mt-1">
                    Get instant, actionable feedback on your document.
                </p>

                <div className="mt-3 h-1.5 w-full rounded-full bg-stone-100 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-green-800"
                        style={{ width: `${(reviewsUsed / reviewsTotal) * 100}%` }}
                    />
                </div>

                <button
                    type="button"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-green-800 py-2.5 text-sm font-medium text-white hover:bg-green-900 transition-colors"
                >
                    <Sparkles className="h-4 w-4" />
                    Request AI Review
                </button>

                <a
                    href="#"
                    className="block text-center text-xs text-stone-400 mt-2 hover:text-stone-600 transition-colors"
                >
                    Upgrade to Premium
                </a>
            </div>

            {}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-stone-900">Review Results</h2>
                    <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
                        Score: {score}/100
                    </span>
                </div>

                <div className="flex flex-col gap-3">
                    {/* Strengths */}
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="h-4 w-4 text-green-700" />
                            <span className="font-medium text-green-900 text-sm">Strengths</span>
                        </div>
                        <ul className="space-y-1.5">
                            {(strengths || []).map((item, i) => (
                                <li
                                    key={i}
                                    className="text-sm text-green-900 pl-3 relative before:content-['•'] before:absolute before:left-0"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Suggestions */}
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-4 w-4 text-blue-700" />
                            <span className="font-medium text-blue-900 text-sm">
                                Suggestions for Improvement
                            </span>
                        </div>
                        <ul className="space-y-1.5">
                            {suggestions.map((item, i) => (
                                <li
                                    key={i}
                                    className="text-sm text-blue-900 pl-3 relative before:content-['•'] before:absolute before:left-0"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Concerns */}
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-amber-700" />
                            <span className="font-medium text-amber-900 text-sm">
                                Areas of Concern
                            </span>
                        </div>
                        <ul className="space-y-1.5">
                        {(concerns || []).map((item, i) => (
                                <li
                                    key={i}
                                    className="text-sm text-amber-900 pl-3 relative before:content-['•'] before:absolute before:left-0"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
