"use client";

import React, { useState } from "react";
import { submitDoctorReview } from "@/lib/api";
import Button from "@/components/button";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorId: string;
  doctorName: string;
  appointmentId?: string;
  defaultReviewerName?: string;
  onReviewSubmitted?: () => void;
}

export default function ReviewModal({
  isOpen,
  onClose,
  doctorId,
  doctorName,
  appointmentId,
  defaultReviewerName = "",
  onReviewSubmitted,
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewerName, setReviewerName] = useState<string>(defaultReviewerName);
  const [reviewText, setReviewText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const ratingLabels: Record<number, string> = {
    1: "Poor - Needs Improvement",
    2: "Fair - Acceptable Visit",
    3: "Good - Satisfactory Care",
    4: "Very Good - Great Doctor",
    5: "Excellent - Highly Recommended!",
  };

  const currentActiveRating = hoverRating || rating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      await submitDoctorReview({
        doctor_id: doctorId,
        appointment_id: appointmentId,
        reviewer_name: reviewerName.trim() || "Verified Patient",
        rating,
        review_text: reviewText.trim() || undefined,
      });

      setSuccessMsg(true);
      if (onReviewSubmitted) onReviewSubmitted();
      setTimeout(() => {
        setSuccessMsg(false);
        onClose();
      }, 1800);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl border border-outline-variant/20 p-6 md:p-8 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center hover:bg-surface-container-highest transition-colors"
        >
          ✕
        </button>

        {successMsg ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">
              ✓
            </div>
            <h3 className="text-headline-sm font-bold text-on-surface">Review Submitted!</h3>
            <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
              Thank you! Your feedback has been recorded and updated {doctorName}'s rating in real-time.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full">
                REAL-TIME PATIENT REVIEW
              </span>
              <h3 className="text-headline-sm font-bold text-on-surface mt-2">
                Rate Your Consultation
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                How was your experience with <strong className="text-on-surface">{doctorName}</strong>?
              </p>
            </div>

            {errorMsg && (
              <div className="bg-error/10 border border-error/30 text-error p-3 rounded-xl text-xs font-bold">
                {errorMsg}
              </div>
            )}

            {/* Interactive Star Picker */}
            <div className="space-y-2 text-center bg-surface-container-low p-4 rounded-2xl border border-outline-variant/15">
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="text-3xl transition-transform hover:scale-125 focus:outline-none"
                  >
                    <span
                      className={`material-symbols-outlined text-3xl select-none ${
                        star <= currentActiveRating ? "text-amber-500 font-bold" : "text-gray-300"
                      }`}
                      style={{ fontVariationSettings: star <= currentActiveRating ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      star
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xs font-extrabold text-amber-950">
                {ratingLabels[currentActiveRating]}
              </p>
            </div>

            {/* Reviewer Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface block">Your Name</label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="e.g. Jane Doe"
                className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Review Text */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface block">Written Review (Optional)</label>
              <textarea
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share specific details about diagnosis, waiting time, or bedside manner..."
                className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="w-full py-3 text-xs font-bold shadow-md"
            >
              Submit Real-Time Review
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
