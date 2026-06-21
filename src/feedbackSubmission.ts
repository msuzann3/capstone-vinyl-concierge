export interface FeedbackPayload {
  submittedAt: string;
  source: "vinyl-concierge-week-5-feedback";
  respondent: {
    name: string;
    email: string;
    musicBuyerType: string;
  };
  priorExperience: {
    usedSimilarBefore: string;
    similarToolsUsed: string;
    likedBefore: string;
    frustratingBefore: string;
  };
  usability: {
    firstStepClarity: string;
    confusingMoment: string;
    recommendationClarity: string;
    uiEase: string;
    uiFriction: string;
    wordingConfusion: string;
  };
  recommendationQuality: {
    notesHelpful: string;
    trustSignal: string;
    wantedToExplore: string;
    expectedBetterUnderstanding: string;
  };
  decisionSignals: {
    mostUsefulChange: string;
    wouldUseAtStore: string;
  };
  metadata: {
    pageUrl: string;
    userAgent: string;
  };
}

const configuredWebhookUrl = import.meta.env.VITE_N8N_FEEDBACK_WEBHOOK_URL as string | undefined;

export function hasFeedbackWebhook() {
  return Boolean(configuredWebhookUrl && !configuredWebhookUrl.includes("your-n8n-domain"));
}

export async function submitFeedbackToWebhook(payload: FeedbackPayload) {
  if (!hasFeedbackWebhook() || !configuredWebhookUrl) {
    throw new Error("The feedback form is not connected yet. Michelle needs to add the webhook link and redeploy the site.");
  }

  const response = await fetch(configuredWebhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`The feedback webhook returned ${response.status}.`);
  }
}

export function downloadFeedbackPayload(payload: FeedbackPayload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const timestamp = payload.submittedAt.replace(/[:.]/g, "-");

  link.href = url;
  link.download = `vinyl-concierge-feedback-${timestamp}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
